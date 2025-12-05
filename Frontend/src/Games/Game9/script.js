const icons = [
  '🍎',
  '⭐',
  '⚽',
  '🐥',
  '🚗',
  '🎈',
  '🍌',
  '🦋',
  '🌙',
  '🎁',
  '🐸',
  '🎩',
  '🦓',
  '🌴',
  '🌶️',
  '🎂',
  '🐶',
  '🍇',
  '🎃',
  '🧸',
  '🐼',
  '🐒',
  '🐋',
  '🍩',
  '🎱',
  '⏰',
];
let currentSet = [],
  missingItem = null;
let gamesPlayed = 0,
  correctCount = 0,
  wrongCount = 0;

// Scoring: maximum score is 100. Score is computed from accuracy (correct/gamesPlayed)
// Returns an integer from 0..100
function computeScore() {
  // Score is based on answered rounds (i.e. completed rounds = correct + wrong)
  const completed = correctCount + wrongCount;
  if (completed <= 0) return 0;
  const ratio = correctCount / completed;
  return Math.round(Math.min(Math.max(ratio * 100, 0), 100));
}

const game = document.getElementById('game');
const message = document.getElementById('message');
const nextBtn = document.getElementById('next');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const instructions = document.getElementById('instructions');
const levelSelect = document.getElementById('level');

const gamesSpan = document.getElementById('games');
const correctSpan = document.getElementById('correct');
const wrongSpan = document.getElementById('wrong');

startBtn.style.display = 'inline-block';

startBtn.onclick = () => {
  instructions.style.display = 'none';
  startGame();
};

restartBtn.onclick = () => {
  gamesPlayed = 0;
  correctCount = 0;
  wrongCount = 0;
  updateStats();
  startGame();
};

// Show a results modal with the final score and stats.
function showResultsModal() {
  const score = computeScore();
  const modal = document.getElementById('resultsModal');
  if (!modal) return;

  modal.querySelector('.modal-score').textContent = score + '/100';
  modal.querySelector('.modal-games').textContent = gamesPlayed;
  modal.querySelector('.modal-correct').textContent = correctCount;
  modal.querySelector('.modal-wrong').textContent = wrongCount;

  modal.classList.add('open');
}

function closeResultsModal() {
  const modal = document.getElementById('resultsModal');
  if (!modal) return;
  modal.classList.remove('open');
}

function updateStats() {
  gamesSpan.textContent = gamesPlayed;
  correctSpan.textContent = correctCount;
  wrongSpan.textContent = wrongCount;
}

function startGame() {
  game.innerHTML = '';
  message.textContent = '';
  nextBtn.style.display = 'none';

  gamesPlayed++;
  updateStats();

  const level = levelSelect.value;
  let showTime, numShapes, numChoices;

  if (level === 'easy') {
    showTime = 3000;
    numShapes = 6;
    numChoices = 4;
    game.style.gridTemplateColumns = 'repeat(3, 120px)';
  } else if (level === 'medium') {
    showTime = 5000;
    numShapes = 9;
    numChoices = 7;
    game.style.gridTemplateColumns = 'repeat(3, 120px)';
  } else {
    showTime = 8000;
    numShapes = 12;
    numChoices = 9;
    game.style.gridTemplateColumns = 'repeat(4, 120px)';
  }

  currentSet = shuffle([...icons]).slice(0, numShapes);

  currentSet.forEach((icon) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = icon;
    game.appendChild(div);
  });

  setTimeout(() => hideAndRemoveOne(numChoices), showTime);
}

function hideAndRemoveOne(numChoices) {
  game.innerHTML = '';
  missingItem = currentSet[Math.floor(Math.random() * currentSet.length)];
  let remaining = currentSet.filter((i) => i !== missingItem);
  remaining = shuffle(remaining);

  remaining.forEach((icon) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.textContent = icon;
    game.appendChild(div);
  });

  message.innerHTML = '🤔 Which shape disappeared ?';

  // نضمن عدم وجود أي تكرار في الاختيارات
  const unusedIcons = icons.filter(
    (i) => !remaining.includes(i) && i !== missingItem
  );
  let choices = shuffle([...unusedIcons]).slice(0, numChoices - 1);
  choices.push(missingItem);
  choices = shuffle(choices);

  choices.forEach((icon) => {
    const btn = document.createElement('button');
    btn.textContent = icon;
    btn.style.margin = '10px';
    btn.style.padding = '10px';
    btn.style.fontSize = '1.5em';
    btn.style.cursor = 'pointer';
    btn.onclick = () => checkAnswer(icon);
    message.appendChild(btn);
  });
}

function checkAnswer(icon) {
  const buttons = message.querySelectorAll('button');
  buttons.forEach((btn) => (btn.disabled = true));
  if (icon === missingItem) {
    message.innerHTML = `✅ Correct! The hidden shape was ${missingItem}`;
    correctCount++;
  } else {
    message.innerHTML = `❌ Wrong! The hidden shape was ${missingItem}`;
    wrongCount++;
  }
  updateStats();
  nextBtn.style.display = 'inline-block';
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

nextBtn.onclick = startGame;

// Wire up the Show Results button and modal close actions when available
document.addEventListener('DOMContentLoaded', () => {
  const showBtn = document.getElementById('show-results');
  if (showBtn) showBtn.addEventListener('click', showResultsModal);

  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeResultsModal);

  // close modal when clicking outside content
  const modal = document.getElementById('resultsModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeResultsModal();
    });
  }
});
