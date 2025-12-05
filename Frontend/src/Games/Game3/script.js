const GAME_ID = 3;
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

// Variables
const aboutSec = document.querySelector('.about--section');
// Note: In your HTML, the start button is inside .about--section
const startBtn = document.querySelector('.about--section .btn'); 
const btnNXT = document.querySelector('#nextLevelBtn');
const container = document.querySelector('.container');
const movesCounter = document.querySelector('.score');
const movesDisplay = document.querySelector('.moves');
const timerDisplay = document.querySelector('.timer');

let selectedCards = [];
let toggledCards = [];
let moves = 0;
let createdCards = 0;
let truePairs = 0;
let currentLevel = 0;
let gameTimer;
let seconds = 0;
let totalMoves = 0;
let totalTime = 0;

const updateTimer = function () {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const items = [
  { value: './images/eeyore-halloween.svg', count: 0 },
  { value: './images/iyor.svg', count: 0 },
  { value: './images/piglet-halloween.svg', count: 0 },
  { value: './images/piglet.svg', count: 0 },
  { value: './images/tigger-halloween.svg', count: 0 },
  { value: './images/tigger.svg', count: 0 },
  { value: './images/winnie-halloween.svg', count: 0 },
  { value: './images/winnie-the-pooh-3.svg', count: 0 },
];

// Start Game Event
startBtn.addEventListener('click', function() {
    aboutSec.classList.add('hidden');
    container.classList.remove('hidden');
    // Show stats
    movesDisplay.classList.remove('hidden');
    timerDisplay.classList.remove('hidden');
    
    currentLevel = 0;
    resetGame();
    gameTimer = setInterval(updateTimer, 1000);
});

// Next Level Event
btnNXT.addEventListener('click', function () {
  if (currentLevel === 1) { // Finish after Level 1 (since index starts 0, this is 2 levels)
    endGame(); 
    return;
  }
  
  // Reset for next level
  moves = 0;
  movesCounter.textContent = '0';
  resetGame();

  btnNXT.classList.add('btn--animation');
  setTimeout(() => btnNXT.classList.remove('btn--animation'), 1000);
  setTimeout(() => btnNXT.classList.add('hidden--opacity'), 1500);
});

container.addEventListener('click', function (e) {
  const card = e.target.closest('.box');
  if (!card) return;
  if (!card.classList.contains('box-animation') && selectedCards.length < 2) {
    card.classList.add('box-animation');
    const svgUse = card.querySelector('.front').querySelector('image');
    const value = svgUse ? svgUse.getAttribute('href') : '';
    selectedCards.push(value);
    toggledCards.push(card);
    checkMatch();
  }
});

const resetGame = function () {
  container.innerHTML = '';
  createdCards = 0;
  truePairs = 0;
  selectedCards = [];
  toggledCards = [];
  items.forEach((item) => (item.count = 0));
  while (createdCards < 16) {
    generateMarkup();
  }
};

const checkMatch = function () {
  if (selectedCards.length === 2) {
    moves++;
    movesCounter.textContent = moves;
    setTimeout(() => {
      if (selectedCards[0] === selectedCards[1]) {
        toggledCards.forEach((card) => card.classList.add('unvisible'));
        truePairs++;
        checkIfDone();
      } else {
        toggledCards.forEach((card) => {
          card.classList.remove('box-animation');
        });
      }
      selectedCards = [];
      toggledCards = [];
    }, 1500);
  }
};

const checkIfDone = function () {
  if (truePairs === 8) {
    setTimeout(() => {
      currentLevel++;
      totalMoves += moves;

      if (currentLevel === 2) { // 2 Levels Total
        btnNXT.textContent = 'End Game';
      } else {
        btnNXT.textContent = `Next Level`;
      }

      btnNXT.classList.remove('hidden--opacity');
      btnNXT.classList.add('btn--animation');
      setTimeout(() => btnNXT.classList.remove('btn--animation'), 500);
    }, 1500);
  }
};

const getRandomNumber = function () {
  return Math.trunc(Math.random() * items.length);
};

const checkItem = function () {
  let item = items.at(getRandomNumber());
  while (item.count === 2) {
    item = items.at(getRandomNumber());
  }
  item.count++;
  createdCards++;
  return item;
};

const generateMarkup = function () {
  const item = checkItem();
  const html = `<div class="box">
          <div class="face front centralize-items">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
              <image href="${item.value}" width="100" height="100" />
            </svg>
          </div>
          <div class="face back centralize-items">
            <div class="frame centralize-items">
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                <image href="./images/crown.svg" width="100" height="100" />
              </svg></div>
          </div>
        </div>`;
  container.insertAdjacentHTML('afterbegin', html);
};

// --- GAME OVER & SUBMIT ---
async function endGame() {
  clearInterval(gameTimer);
  totalTime += seconds;

  // Score Logic
  const perfectMoves = 16 * 2; 
  const penalty = Math.max(0, (totalMoves - perfectMoves) * 1.5) + Math.floor(totalTime / 5);
  let finalScore = Math.round(100 - penalty);
  if (finalScore < 0) finalScore = 0;

  const totalMisses = Math.max(0, totalMoves - perfectMoves);

  // 1. Submit to Backend
  await sessionMgr.submitScore(GAME_ID, finalScore, totalMoves, totalMisses);

  // 2. Show Modal
  showResults(finalScore, totalMisses);
}

const showResults = function (finalScore, misses) {
  const modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <h2>🎉 Game Complete!</h2>
        <p><strong>Score:</strong> ${finalScore} / 100</p>
        <p>Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}</p>
        <p>Moves: ${totalMoves}</p>
        <p style="color:green; font-weight:bold;">✅ Saved to Doctor Dashboard</p>
        <button class="restart-btn" onclick="location.reload()">Play Again</button>
        <br>
        <button class="restart-btn" style="background:#555; margin-top:10px" onclick="goToMenu()">Back to Menu</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};