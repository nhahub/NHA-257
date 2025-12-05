const TOTAL_GROUPS = 12;
const SHOW_GROUPS = 6;
const API_URL = 'https://localhost:7134/GameSession'; // Replace with your API URL

let selectedGroups = [];
let phase = 'start';
let score = 0;
let totalTime = 0;
let currentIndex = 0;
let startTime = 0;
let shuffledImages = [];
let gameStartTime = null;
let gameEndTime = null;
let correctAnswers = 0;
let wrongAnswers = 0;

let currentRound = 1;
const TOTAL_ROUNDS = 3;
let roundScores = [];
let roundTimes = [];

const gameContent = document.getElementById('game-content');

function showStartScreen() {
  currentRound = 1;
  roundScores = [];
  roundTimes = [];
  gameContent.innerHTML = `
    <div class="start-container">
      <h2 class="start-title">Are you ready to test your memory?</h2>
      <button class="start-btn" onclick="startGame()">🎮 Start Game</button>
    </div>
  `;
}

function startGame() {
  const groups = Array.from({ length: TOTAL_GROUPS }, (_, i) => i + 1);
  selectedGroups = groups.sort(() => 0.5 - Math.random()).slice(0, SHOW_GROUPS);
  phase = 'memorize';
  score = 0;
  totalTime = 0;
  currentIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  gameStartTime = new Date();
  showMemorizePhase();
}

function showMemorizePhase() {
  if (currentIndex >= selectedGroups.length) {
    gameContent.innerHTML =
      '<h2 class="ready-message">Get ready for the quiz...</h2>';
    setTimeout(() => {
      phase = 'quiz';
      currentIndex = 0;
      showQuizPhase();
    }, 1000);
    return;
  }

  const group = selectedGroups[currentIndex];
  const correctImage = `cards/${group}-1.png`;

  gameContent.innerHTML = `
    <div class="memorize-container">
      <h2 class="memorize-title">Memorize this image (${currentIndex + 1}/${
    selectedGroups.length
  })</h2>
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
    gameEndTime = new Date();
    // Store round results
    roundScores.push(correctAnswers);
    roundTimes.push(totalTime);
    sendGameData();

    if (currentRound < TOTAL_ROUNDS) {
      // Prepare for next round
      currentRound++;
      setTimeout(() => {
        startGame();
      }, 1200);
      gameContent.innerHTML = `<div class="scoreboard-container"><h2 class="scoreboard-title">Round ${
        currentRound - 1
      } Complete!</h2><p class="score-text">Score: <span class="score-value">${correctAnswers}</span></p><p class="time-text">⏱️ Time: <span class="time-value">${formatTime(
        totalTime
      )}</span></p><h3>Get ready for round ${currentRound}...</h3></div>`;
    } else {
      // All rounds done, show final scoreboard
      showFinalScoreBoard();
    }
    return;
  }

  const group = selectedGroups[currentIndex];
  shuffledImages = shuffleArray([1, 2, 3, 4]);
  startTime = Date.now();

  gameContent.innerHTML = `
    <div class="quiz-container">
      <h2 class="quiz-title">Which image did you see before?</h2>
      <div class="quiz-grid">
        ${shuffledImages
          .map(
            (imgIndex) => `
          <img
            src="cards/${group}-${imgIndex}.png"
            alt="Option ${imgIndex}"
            class="quiz-image"
            data-index="${imgIndex}"
          >
        `
          )
          .join('')}
      </div>
      <p class="quiz-progress">Group ${currentIndex + 1} of ${
    selectedGroups.length
  }</p>
    </div>
  `;

  document.querySelectorAll('.quiz-image').forEach((img) => {
    img.addEventListener('click', handleImageClick);
  });
}

function handleImageClick(e) {
  const imgIndex = parseInt(e.target.dataset.index);
  const isCorrect = imgIndex === 1;
  const timeTaken = (Date.now() - startTime) / 1000;

  if (isCorrect) {
    correctAnswers++;
  } else {
    wrongAnswers++;
  }

  totalTime += timeTaken;

  document.querySelectorAll('.quiz-image').forEach((img) => {
    img.removeEventListener('click', handleImageClick);
  });

  e.target.classList.add(isCorrect ? 'correct' : 'incorrect');

  setTimeout(() => {
    currentIndex++;
    showQuizPhase();
  }, 800);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function showScoreBoard() {
  // Not used anymore, replaced by showFinalScoreBoard
}

function showFinalScoreBoard() {
  const score = roundScores.reduce((a, b) => a + b, 0);
  let totalScore = ((score / 18) * 100).toFixed(2);
  let totalTimeAll = roundTimes.reduce((a, b) => a + b, 0);
  let roundsHtml = '';
  for (let i = 0; i < roundScores.length; i++) {
    roundsHtml += `<p>Round ${i + 1}: <strong>${
      roundScores[i]
    }</strong> correct, <span>${formatTime(roundTimes[i])}</span></p>`;
  }
  gameContent.innerHTML = `
    <div class="scoreboard-container">
      <h2 class="scoreboard-title">🎯 Game Over!</h2>
      <p class="score-text">Total Score: <span class="score-value">${totalScore}</span> / ${100}</p>
      <p class="time-text">⏱️ Total Time: <span class="time-value">${formatTime(
        totalTimeAll
      )}</span></p>
      <div class="rounds-breakdown">${roundsHtml}</div>
      <button class="play-again-btn">  <a href="/../../index.html" style="text-decoration:none">Home Page</a></button>
    </div>
  `;
}

async function sendGameData() {
  const gameData = {
    userId: 1,
    gameId: 7,
    startTime: gameStartTime.toISOString(),
    endTime: gameEndTime.toISOString(),
    score: correctAnswers,
    trials: SHOW_GROUPS,
    misses: wrongAnswers,
    sessionDate: formatDate(gameStartTime),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (response.ok) {
      console.log('Game data sent successfully!', gameData);
    } else {
      console.error('Failed to send game data:', response.status);
    }
  } catch (error) {
    console.error('Error sending game data:', error);
  }
}

// Show start screen on load
showStartScreen();
