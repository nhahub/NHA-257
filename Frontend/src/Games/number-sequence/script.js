const sequenceDisplay = document.getElementById('sequence-display');
const optionsContainer = document.getElementById('options-container');
const startBtn = document.getElementById('start-btn');
const levelInfo = document.getElementById('level-info');
const resultDiv = document.getElementById('result');

// Game structure: configurable number of levels & questions per level
const QUESTIONS_PER_LEVEL = 3; // 3 questions per level
const TOTAL_LEVELS = 5; // 5 levels
const MAX_SEQUENCES = QUESTIONS_PER_LEVEL * TOTAL_LEVELS; // 15 total sequences
const MAX_SCORE = 100; // Max score to scale to

let level = 1;
let question = 1;
let score = 0;
let correctSequence = [];
let startTime = null;

//  Send Game Result to Backend
async function sendResult(gameId, score, trials = 0, misses = 0) {
  const now = new Date();

  const payload = {
    userId: 1,
    gameId: gameId,
    startTime: startTime,
    endTime: now.toISOString(),
    score: score,
    trials: trials,
    misses: misses,
    sessionDate: now.toISOString().split('T')[0],
  };

  try {
    await fetch('https://localhost:7134/GameSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Game 2 result stored:', payload);
  } catch (err) {
    console.error('Failed to send Game 2 result:', err);
  }
}

function endGame(finalScore, trials = 0, misses = 0) {
  sendResult(1, finalScore, trials, misses);
}

//  MAIN GAME LOGIC
// Start Game
startBtn.addEventListener('click', startGame);

function startGame() {
  startTime = new Date().toISOString(); //  record time for API
  startBtn.style.display = 'none';
  resultDiv.textContent = '';

  level = 1;
  question = 1;
  score = 0;

  nextQuestion();
}

// Generate next question

function nextQuestion() {
  optionsContainer.innerHTML = '';
  resultDiv.textContent = '';
  levelInfo.textContent = `Level: ${level} | Question: ${question}`;

  let sequenceLength = level;
  correctSequence = generateSequence(sequenceLength);

  sequenceDisplay.textContent = correctSequence.join(' ');

  // Show sequence for 5 seconds then hide it
  setTimeout(() => {
    sequenceDisplay.textContent = '';
    showOptions();
  }, 5000);
}

// Generate numeric sequence

function generateSequence(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 9) + 1);
  }
  return arr;
}

// Show options (1 correct + 3 fake)
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

// Check Answer
function checkAnswer(selected, button) {
  const allButtons = document.querySelectorAll('.option-btn');
  allButtons.forEach((btn) => (btn.disabled = true));

  if (selected === correctSequence.join(' ')) {
    score++;
    resultDiv.textContent = '✅ Correct!';
    resultDiv.style.color = 'green';
    button.style.backgroundColor = '#4CAF50';
  } else {
    resultDiv.textContent = `❌ Wrong! Correct sequence: ${correctSequence.join(
      ' '
    )}`;
    resultDiv.style.color = 'red';
    button.style.backgroundColor = '#dc3545';
  }

  setTimeout(() => {
    // QUESTIONS_PER_LEVEL questions per level → TOTAL_LEVELS levels → MAX_SEQUENCES total
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

function finishGame() {
  optionsContainer.innerHTML = '';
  sequenceDisplay.textContent = '';
  levelInfo.textContent = '';

  resultDiv.style.color = '#333';

  // Compute final score scaled to 0..MAX_SCORE based on MAX_SEQUENCES
  // Save finalScore to a variable to both send to the backend and show in the modal
  const finalScore = Math.round((score / MAX_SEQUENCES) * MAX_SCORE);

  // Update short inline result to show both raw correct count and scaled score
  resultDiv.textContent = `🎉 Game Over! Correct: ${score} / ${MAX_SEQUENCES} · Score: ${finalScore} / ${MAX_SCORE}`;

  // Send API result (finalScore is 0..100)
  endGame(finalScore);

  // Show modal with results and a button linking to main index.html
  showResultModal(finalScore, score);

  startBtn.textContent = 'Play Again';
  startBtn.style.display = 'inline-block';
}

// Create and show a modal with final results + link back to project root
function showResultModal(finalScore, correctCount = 0) {
  // Remove any existing modal first
  const existing = document.querySelector('.number-seq-result-modal');
  if (existing) existing.remove();

  const modalHTML = `
        <div class="number-seq-result-modal" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.4);z-index:9999;">
            <div style="background:#fff;border-radius:10px;padding:22px;max-width:420px;width:90%;box-shadow:0 12px 30px rgba(0,0,0,0.25);text-align:center;">
                <h2 style="margin:0 0 10px;">🎉 Game Over</h2>
                <p style="margin:6px 0 6px;font-size:18px;">Final Score: <strong>${finalScore} / ${MAX_SCORE}</strong></p>
                <p style="margin:6px 0 16px;font-size:16px;">Correct sequences: <strong>${correctCount} / ${MAX_SEQUENCES}</strong></p>
                <div style="display:flex;gap:10px;justify-content:center;margin-top:12px;">
                    <button id="ns-modal-playagain" style="padding:8px 14px;border-radius:6px;border:0;background:#4CAF50;color:white;cursor:pointer;">Play Again</button>
                    <a id="ns-modal-main" href="../../index.html" style="display:inline-block;padding:8px 14px;border-radius:6px;background:#1e90ff;color:white;text-decoration:none;">Main Menu</a>
                </div>
                <button id="ns-modal-close" aria-label="close" style="position:absolute;right:14px;top:12px;border:0;background:transparent;font-size:20px;cursor:pointer;">&times;</button>
            </div>
        </div>
        `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Hook up buttons
  const playAgainBtn = document.getElementById('ns-modal-playagain');
  const closeBtn = document.getElementById('ns-modal-close');
  const modalWrap = document.querySelector('.number-seq-result-modal');

  function cleanupAndReset() {
    if (modalWrap) modalWrap.remove();
    // Reset UI to initial state so player can start again
    startBtn.textContent = 'Play Again';
    startBtn.style.display = 'inline-block';
    level = 1;
    question = 1;
    score = 0;
    correctSequence = [];
    resultDiv.textContent = '';
  }

  if (playAgainBtn) playAgainBtn.addEventListener('click', cleanupAndReset);
  if (closeBtn)
    closeBtn.addEventListener('click', () => modalWrap && modalWrap.remove());
}
