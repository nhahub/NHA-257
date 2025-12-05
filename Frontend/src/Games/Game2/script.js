const GAME_ID = 2; // Number Sequence
const sessionMgr = new SessionManager('https://localhost:7101/api');

// 1. Security Check
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
    }
});

function goToMenu() {
    window.location.href = '../menu.html';
}

const sequenceDisplay = document.getElementById('sequence-display');
const optionsContainer = document.getElementById('options-container');
const startBtn = document.getElementById('start-btn');
const levelInfo = document.getElementById('level-info');
const resultDiv = document.getElementById('result');

const QUESTIONS_PER_LEVEL = 3; 
const TOTAL_LEVELS = 5; 
const MAX_SEQUENCES = QUESTIONS_PER_LEVEL * TOTAL_LEVELS; 
const MAX_SCORE = 100; 

let level = 1;
let question = 1;
let score = 0;
let correctSequence = [];

// Start Game
startBtn.addEventListener('click', startGame);

function startGame() {
  startBtn.style.display = 'none';
  resultDiv.textContent = '';

  level = 1;
  question = 1;
  score = 0;

  nextQuestion();
}

function nextQuestion() {
  optionsContainer.innerHTML = '';
  resultDiv.textContent = '';
  levelInfo.textContent = `Level: ${level} | Question: ${question}`;

  let sequenceLength = level + 1; // Start with 2 numbers
  correctSequence = generateSequence(sequenceLength);

  sequenceDisplay.textContent = correctSequence.join(' ');

  // Show sequence for 5 seconds then hide it
  setTimeout(() => {
    sequenceDisplay.textContent = '???';
    showOptions();
  }, 3000); // Reduced to 3s for better pacing, adjust if needed
}

function generateSequence(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 9) + 1);
  }
  return arr;
}

function showOptions() {
  const correct = correctSequence.join(' ');
  const options = [correct];

  while (options.length < 4) {
    const fake = generateSequence(correctSequence.length).join(' ');
    if (!options.includes(fake)) options.push(fake);
  }

  // shuffle
  options.sort(() => Math.random() - 0.5);

  // create buttons
  options.forEach((option) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selected, button) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach((btn) => (btn.disabled = true));

  if (selected === correctSequence.join(' ')) {
    score++;
    resultDiv.textContent = '✅ Correct!';
    resultDiv.style.color = 'green';
    button.style.backgroundColor = '#4CAF50';
  } else {
    resultDiv.textContent = `❌ Wrong! It was: ${correctSequence.join(' ')}`;
    resultDiv.style.color = 'red';
    button.style.backgroundColor = '#dc3545';
  }

  setTimeout(() => {
    if (question < QUESTIONS_PER_LEVEL) {
      question++;
      nextQuestion();
    } else if (level < TOTAL_LEVELS) {
      level++;
      question = 1;
      nextQuestion();
    } else {
      finishGame();
    }
  }, 2000);
}

// Game Finished
async function finishGame() {
  optionsContainer.innerHTML = '';
  sequenceDisplay.textContent = '';
  levelInfo.textContent = '';

  const finalScore = Math.round((score / MAX_SEQUENCES) * MAX_SCORE);
  
  // Calculate Stats for DB
  const trials = MAX_SEQUENCES;
  const misses = MAX_SEQUENCES - score;

  resultDiv.style.color = '#333';
  resultDiv.textContent = `Saving Score... (${finalScore} pts)`;

  // --- SEND TO BACKEND ---
  await sessionMgr.submitScore(GAME_ID, finalScore, trials, misses);

  // Show modal with results
  showResultModal(finalScore, score);

  startBtn.textContent = 'Play Again';
  startBtn.style.display = 'inline-block';
}

function showResultModal(finalScore, correctCount = 0) {
  const existing = document.querySelector('.number-seq-result-modal');
  if (existing) existing.remove();

  const modalHTML = `
        <div class="number-seq-result-modal" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);z-index:9999;">
            <div style="background:#fff;border-radius:10px;padding:22px;max-width:420px;width:90%;box-shadow:0 12px 30px rgba(0,0,0,0.25);text-align:center;">
                <h2 style="margin:0 0 10px;">🎉 Game Over</h2>
                <p style="margin:6px 0 6px;font-size:18px;">Final Score: <strong>${finalScore} / ${MAX_SCORE}</strong></p>
                <p style="margin:6px 0 16px;font-size:16px;">Correct sequences: <strong>${correctCount} / ${MAX_SEQUENCES}</strong></p>
                <p style="color:green; font-weight:bold;">✅ Saved to Doctor Dashboard</p>
                <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">
                    <button id="ns-modal-playagain" style="padding:8px 14px;border-radius:6px;border:0;background:#4CAF50;color:white;cursor:pointer;">Play Again</button>
                    <button onclick="goToMenu()" style="padding:8px 14px;border-radius:6px;border:0;background:#1e90ff;color:white;cursor:pointer;">Main Menu</button>
                </div>
            </div>
        </div>
        `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const playAgainBtn = document.getElementById('ns-modal-playagain');
  const modalWrap = document.querySelector('.number-seq-result-modal');

  function cleanupAndReset() {
    if (modalWrap) modalWrap.remove();
    startBtn.click(); // Auto restart
  }

  if (playAgainBtn) playAgainBtn.addEventListener('click', cleanupAndReset);
}