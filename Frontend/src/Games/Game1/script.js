// --- 1. INITIALIZE SESSION MANAGER ---
const sessionMgr = new SessionManager('https://localhost:7101/api');

// --- 2. SECURITY CHECK ON LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // If no session is active, kick them out
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ You must start a Therapy Session from the menu first!");
        window.location.href = '../../menu.html';
    }
});

function goToMenu() {
    window.location.href = '../menu.html'; 
}

/******** Global Variables & Game State ********/
const colorButtons = {
  green: document.getElementById('green'),
  red: document.getElementById('red'),
  yellow: document.getElementById('yellow'),
  blue: document.getElementById('blue'),
};

const audioElements = {
  green: document.getElementById('audio-green'),
  red: document.getElementById('audio-red'),
  yellow: document.getElementById('audio-yellow'),
  blue: document.getElementById('audio-blue'),
  wrong: document.getElementById('audio-wrong'),
};

const startBtn = document.getElementById('startBtn');
const levelDisplay = document.getElementById('levelDisplay');
const messageDiv = document.getElementById('message');

let gameSequence = [];
let playerSequence = [];
const MAX_LEVELS = 10;
const MAX_SCORE = 100;
let level = 0;
let acceptingInput = false;
let gameStartTime = null;

/******** Helper Functions ********/
function playColorSound(color) {
  const audio = audioElements[color];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch((err) => console.log(err));
  }
}

function flashColor(color) {
  return new Promise((resolve) => {
    const button = colorButtons[color];
    const flashDuration = Math.max(300, 600 - level * 20);
    const pauseDuration = Math.max(100, 200 - level * 10);
    button.classList.add('flash');
    playColorSound(color);
    setTimeout(() => {
      button.classList.remove('flash');
      setTimeout(() => {
        resolve();
      }, pauseDuration);
    }, flashDuration);
  });
}

function updateLevelDisplay() {
  levelDisplay.textContent = `Level: ${level}`;
}

function showMessage(msg) {
  messageDiv.textContent = msg;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomColor() {
  const colors = Object.keys(colorButtons);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

async function playSequence() {
  acceptingInput = false;
  showMessage('Watch the sequence...');
  for (let color of gameSequence) {
    await flashColor(color);
    await sleep(200);
  }
  acceptingInput = true;
  showMessage('Your turn!');
}

function handleUserClick(color) {
  if (!acceptingInput) return;
  playerSequence.push(color);
  flashColor(color);

  const currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
    // Wrong input
    const wrongAudio = audioElements.wrong;
    if (wrongAudio) {
      wrongAudio.currentTime = 0;
      wrongAudio.play().catch((err) => console.log(err));
    }
    gameOver(); // User lost
    return;
  }

  if (playerSequence.length === gameSequence.length) {
    acceptingInput = false;
    if (level >= MAX_LEVELS) {
      showMessage("Amazing! You've completed all levels.");
      setTimeout(() => gameOver(true), 800); // User Won
      return;
    }
    showMessage('Good job! Next level...');
    setTimeout(() => nextLevel(), 1000);
  }
}

async function nextLevel() {
  playerSequence = [];
  level++;
  if (level > MAX_LEVELS) level = MAX_LEVELS;
  updateLevelDisplay();
  const newColor = getRandomColor();
  gameSequence.push(newColor);
  await sleep(800);
  await playSequence();
}

// --- 3. MODIFIED GAMEOVER TO SEND SCORE ---
async function gameOver(won = false) {
  acceptingInput = false;
  const gameEndTime = Date.now();
  let timeTakenSeconds = 0;
  if (gameStartTime)
    timeTakenSeconds = Math.round((gameEndTime - gameStartTime) / 1000);

  const finalScore = Math.round((level / MAX_LEVELS) * MAX_SCORE);
  
  // Calculate stats for DB
  const gameId = 1; // Simon Says ID
  const trials = level; // Levels passed
  const misses = won ? 0 : 1; // 1 miss if they lost, 0 if they won

  showMessage("Saving Score...");

  // --- SEND TO DB ---
  await sessionMgr.submitScore(gameId, finalScore, trials, misses);

  // Show Modal
  showGameOverModal({
    won,
    levelReached: level,
    maxLevels: MAX_LEVELS,
    score: finalScore,
    timeTakenSeconds,
    linkUrl: '../menu.html', // Redirect to Menu
  });

  // Reset
  gameSequence = [];
  playerSequence = [];
  level = 0;
  updateLevelDisplay();
}

function showGameOverModal({ won, levelReached, maxLevels, score, timeTakenSeconds, linkUrl }) {
  const existing = document.getElementById('simon-modal');
  if (existing) existing.remove();

  // (Your existing Modal Styles logic...)
  if (!document.getElementById('simon-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'simon-modal-styles';
    style.textContent = `
            #simon-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.45);z-index:9999}
            .simon-modal-box{background:#fff;border-radius:8px;padding:20px;max-width:420px;width:92%;box-shadow:0 10px 30px rgba(0,0,0,0.3);text-align:center;font-family:inherit; color:#333;}
            .simon-modal-box h2{margin:0 0 10px;font-size:20px}
            .simon-modal-stats{margin:10px 0;font-size:16px}
            .simon-modal-actions{display:flex;gap:10px;justify-content:center;margin-top:15px}
            .simon-btn{padding:8px 14px;border-radius:6px;border:0;cursor:pointer;font-weight:600}
            .simon-btn--primary{background:#2b8aef;color:#fff}
            .simon-btn--muted{background:#f0f0f0;color:#222}
          `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = 'simon-modal';

  const box = document.createElement('div');
  box.className = 'simon-modal-box';

  const title = document.createElement('h2');
  title.textContent = won ? '🎉 You Win!' : 'Game Over';

  const detail = document.createElement('div');
  detail.className = 'simon-modal-stats';
  detail.innerHTML = `
          <p>Level: <strong>${levelReached} / ${maxLevels}</strong></p>
          <p>Score: <strong>${score} / ${MAX_SCORE}</strong></p>
          <p>Time: <strong>${formatTime(timeTakenSeconds)}</strong></p>
          <p style="color:green; font-size:0.9em;">(Saved to Doctor's Dashboard)</p>
        `;

  const actions = document.createElement('div');
  actions.className = 'simon-modal-actions';

  const btnRestart = document.createElement('button');
  btnRestart.className = 'simon-btn simon-btn--primary';
  btnRestart.textContent = 'Play Again';
  btnRestart.addEventListener('click', () => {
    overlay.remove();
    startBtn.click();
  });

  const btnNavigate = document.createElement('button');
  btnNavigate.className = 'simon-btn simon-btn--muted';
  btnNavigate.textContent = 'Back to Menu';
  btnNavigate.addEventListener('click', () => {
      window.location.href = linkUrl;
  });

  actions.appendChild(btnRestart);
  actions.appendChild(btnNavigate);
  box.appendChild(title);
  box.appendChild(detail);
  box.appendChild(actions);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

startBtn.addEventListener('click', async () => {
  showMessage('');
  gameSequence = [];
  playerSequence = [];
  level = 0;
  gameStartTime = Date.now();
  updateLevelDisplay();
  await sleep(500);
  nextLevel();
});

function formatTime(totalSeconds) {
  totalSeconds = Number(totalSeconds) || 0;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

Object.keys(colorButtons).forEach((color) => {
  colorButtons[color].addEventListener('click', () => handleUserClick(color));
});