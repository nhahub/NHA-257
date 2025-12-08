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
  const correctStr = correctSequence.join(' ');
  const options = [correctStr];

  let safetyCounter = 0; // Prevents infinite loops

  while (options.length < 4 && safetyCounter < 50) {
    // 1. Try to generate a similar looking fake
    let fakeArr = generateSimilarFake(correctSequence);
    let fakeStr = fakeArr.join(' ');

    // 2. If the fake accidentally matches the correct one (e.g. swapping two 5s), 
    //    or if we already have this option, generate a totally random one instead.
    if (fakeStr === correctStr || options.includes(fakeStr)) {
       fakeArr = generateSequence(correctSequence.length);
       fakeStr = fakeArr.join(' ');
    }

    // 3. Add if unique
    if (!options.includes(fakeStr)) {
      options.push(fakeStr);
    }
    
    safetyCounter++;
  }

  // Shuffle the buttons so the correct answer isn't always first
  options.sort(() => Math.random() - 0.5);

  // Create buttons (Same as before)
  options.forEach((option) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });
}

// NEW: Generates a wrong answer that looks similar to the correct one
function generateSimilarFake(originalSequence) {
    // Create a copy of the array so we don't change the original
    let fake = [...originalSequence];
    const len = fake.length;

    // Pick a random strategy to mess up the sequence
    const strategy = Math.random();

    if (strategy < 0.4 && len > 1) {
        // STRATEGY 1: SWAP TWO NUMBERS (Very confusing)
        // Example: [1, 2, 3] -> [1, 3, 2]
        const idx1 = Math.floor(Math.random() * len);
        let idx2 = Math.floor(Math.random() * len);
        // Ensure we picked two different indices
        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * len);
        }
        // Swap
        [fake[idx1], fake[idx2]] = [fake[idx2], fake[idx1]];

    } else if (strategy < 0.7) {
        // STRATEGY 2: CHANGE ONE NUMBER RANDOMLY
        // Example: [1, 2, 3] -> [1, 9, 3]
        const idx = Math.floor(Math.random() * len);
        let newVal = Math.floor(Math.random() * 9) + 1;
        // Ensure the new value is actually different
        while (newVal === fake[idx]) {
            newVal = Math.floor(Math.random() * 9) + 1;
        }
        fake[idx] = newVal;

    } else {
        // STRATEGY 3: OFF-BY-ONE ( subtle change)
        // Example: [1, 5, 3] -> [1, 6, 3]
        const idx = Math.floor(Math.random() * len);
        const val = fake[idx];
        // If 9, make it 8. If 1, make it 2. Otherwise random +1 or -1.
        if (val === 9) fake[idx] = 8;
        else if (val === 1) fake[idx] = 2;
        else fake[idx] = Math.random() > 0.5 ? val + 1 : val - 1;
    }

    return fake;
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