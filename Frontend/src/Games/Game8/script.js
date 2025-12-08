// --- CONFIG ---
const GAME_ID = 8; // Tricky Cards
const sessionMgr = new SessionManager('https://localhost:7101/api');

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
    }
    showStartScreen();
});

function goToMenu() { window.location.href = '../menu.html'; }

// --- GAME STATE ---
const TOTAL_GROUPS = 12;
const SHOW_GROUPS = 6;
const TOTAL_ROUNDS = 3;

let selectedGroups = [];
let phase = 'start';
let currentIndex = 0;
let startTime = 0;
let shuffledImages = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let totalTime = 0;
let currentRound = 1;
let roundScores = [];
let currentCorrectVariant = 1;
let groupVariants = {};

const gameContent = document.getElementById('game-content');

// --- FLOW ---
function showStartScreen() {
  currentRound = 1;
  roundScores = [];
  gameContent.innerHTML = `
    <div class="start-container">
      <h2 class="start-title">Round ${currentRound} / ${TOTAL_ROUNDS}</h2>
      <button class="start-btn" onclick="startGame()">🎮 Start</button>
    </div>
  `;
}


function startGame() {
  const groups = Array.from({ length: TOTAL_GROUPS }, (_, i) => i + 1);
  selectedGroups = groups.sort(() => 0.5 - Math.random()).slice(0, SHOW_GROUPS);
  
  // --- NEW: Reset the variants storage ---
  groupVariants = {}; 
  
  phase = 'memorize';
  currentIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  showMemorizePhase();
}

function showMemorizePhase() {
  if (currentIndex >= selectedGroups.length) {
    gameContent.innerHTML = '<h2 class="ready-message">Get ready for the quiz...</h2>';
    setTimeout(() => {
      phase = 'quiz';
      currentIndex = 0;
      showQuizPhase();
    }, 1000);
    return;
  }

  const group = selectedGroups[currentIndex];
  
  // --- NEW LOGIC START ---
  // 1. Pick a random variant (1, 2, 3, or 4)
  const randomVariant = Math.floor(Math.random() * 4) + 1;
  
  // 2. Save it specifically for this group ID
  groupVariants[group] = randomVariant;

  // 3. Show that specific random image
  const correctImage = `cards/${group}-${randomVariant}.png`;
  // --- NEW LOGIC END ---

  gameContent.innerHTML = `
    <div class="memorize-container">
      <h2 class="memorize-title">Memorize this image (${currentIndex + 1}/${selectedGroups.length})</h2>
      <img src="${correctImage}" alt="Memorize" class="memorize-image">
    </div>
  `;

  setTimeout(() => {
    currentIndex++;
    showMemorizePhase();
  }, 2000);
}

function shuffleArray(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

function showQuizPhase() {
  if (currentIndex >= selectedGroups.length) {
    // Round Complete
    roundScores.push(correctAnswers);
    
    if (currentRound < TOTAL_ROUNDS) {
      currentRound++;
      gameContent.innerHTML = `
        <div class="scoreboard-container">
           <h2>Round Complete!</h2>
           <p>Score: ${correctAnswers} / ${SHOW_GROUPS}</p>
           <button class="start-btn" onclick="startGame()">Next Round >></button>
        </div>`;
    } else {
      showFinalScoreBoard();
    }
    return;
  }

  const group = selectedGroups[currentIndex];
  shuffledImages = shuffleArray([1, 2, 3, 4]);
  startTime = Date.now();

  gameContent.innerHTML = `
    <div class="quiz-container">
      <h2 class="quiz-title">Which one did you see?</h2>
      <div class="quiz-grid">
        ${shuffledImages.map(idx => `
          <img src="cards/${group}-${idx}.png" class="quiz-image" data-index="${idx}">
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.quiz-image').forEach(img => {
    img.addEventListener('click', handleImageClick);
  });
}

function handleImageClick(e) {
  const imgIndex = parseInt(e.target.dataset.index);
  
  // --- NEW LOGIC START ---
  // 1. Get the current group ID based on the current question index
  const currentGroup = selectedGroups[currentIndex];
  
  // 2. Retrieve the correct variant we saved earlier for THIS group
  const correctVariant = groupVariants[currentGroup];

  // 3. Compare
  const isCorrect = imgIndex === correctVariant;
  // --- NEW LOGIC END ---

  if (isCorrect) correctAnswers++;
  else wrongAnswers++;

  // Remove listener to prevent double clicks
  document.querySelectorAll('.quiz-image').forEach(img => img.removeEventListener('click', handleImageClick));
  
  // Visual feedback
  e.target.classList.add(isCorrect ? 'correct' : 'incorrect');

  setTimeout(() => {
    currentIndex++;
    showQuizPhase();
  }, 800);
}

async function showFinalScoreBoard() {
  const totalCorrect = roundScores.reduce((a, b) => a + b, 0);
  const totalQuestions = SHOW_GROUPS * TOTAL_ROUNDS; // 6 * 3 = 18
  
  // Scale to 100
  const finalScore = Math.round((totalCorrect / totalQuestions) * 100);
  const totalMisses = totalQuestions - totalCorrect;
  const totalTrials = totalQuestions;

  // Show Modal
  document.getElementById('finalScore').innerText = finalScore;
  document.getElementById('gameOverModal').style.display = 'flex';

  // Send to Backend
  await sessionMgr.submitScore(GAME_ID, finalScore, totalTrials, totalMisses);
}