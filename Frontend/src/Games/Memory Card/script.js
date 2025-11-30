const aboutSec = document.querySelector('.about--section');
const btnNXT = document.querySelector('.btn--next');
const container = document.querySelector('.container');
const container2 = document.querySelector('.second-container');
const movesCounter = document.querySelector('.score');
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

// NEW: API-related variables
let gameStartTime = null;
const API_ENDPOINT = 'https://your-api-endpoint.com/api/games'; // Replace with your actual API endpoint
const USER_ID = 1; // Replace with actual user ID from your authentication system

const updateTimer = function () {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.querySelector('.timer').textContent = `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const items = [
  {
    value: './images/eeyore-halloween.svg',
    count: 0,
  },
  {
    value: './images/iyor.svg',
    count: 0,
  },
  {
    value: './images/piglet-halloween.svg',
    count: 0,
  },
  {
    value: './images/piglet.svg',
    count: 0,
  },
  {
    value: './images/tigger-halloween.svg',
    count: 0,
  },
  {
    value: './images/tigger.svg',
    count: 0,
    id: 6,
  },
  {
    value: './images/winnie-halloween.svg',
    count: 0,
  },
  {
    value: './images/winnie-the-pooh-3.svg',
    count: 0,
  },
];
// MODIFIED: Button event listener
btnNXT.addEventListener('click', function (e) {
  if (!e.target.closest('.btn')) return;

  if (currentLevel === 0) {
    // First time starting the game
    gameStartTime = new Date().toISOString(); // NEW: Track start time
    aboutSec.classList.add('hidden');
    container.classList.remove('hidden');
    container.scrollIntoView();
    // Start the timer
    gameTimer = setInterval(updateTimer, 1000);
  } else if (currentLevel === 2) {
    // MODIFIED: Game complete after 2 levels instead of 3
    endGame(); // NEW: Call endGame function
    return;
  } else {
    // Reset for next level
    moves = 0;
    movesCounter.textContent = '0';
    resetGame();
  }

  btnNXT.classList.add('btn--animation');
  setTimeout(() => {
    btnNXT.classList.remove('btn--animation');
  }, 1000);
  setTimeout(() => {
    btnNXT.classList.add('hidden--opacity');
  }, 1500);
});

container.addEventListener('click', function (e) {
  const card = e.target.closest('.box');
  if (!card) return; // Exit if no card was clicked
  if (!card.classList.contains('box-animation') && selectedCards.length < 2) {
    card.classList.add('box-animation');
    // Get the SVG use element and its href value
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

// NEW: Function to send game data to API
const sendGameDataToAPI = async function (gameData) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${your_token}`
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Game data successfully sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending game data:', error);
    // You might want to show an error message to the user here
    throw error;
  }
};

// NEW: Calculate score on a 0 - 100 scale using gentle penalties
const calculateScore = function (moves, time) {
  // Defensive checks
  if (!moves || moves <= 0) return 0;
  if (!time || time < 0) time = 0;

  // Perfect moves for two-level play = 8 pairs × 2 levels = 16 moves
  const perfectMoves = 16;

  // Penalize extra moves: each extra move reduces the score by ~1.5 points
  // (This is intentionally gentle so scores don't plummet.)
  const extraMoves = Math.max(0, moves - perfectMoves);
  const movePenalty = extraMoves * 1.5;

  // Penalize time: 1 point per 3–5 seconds is reasonable; use 1 point per 5 seconds here
  const timePenalty = Math.floor(time / 5);

  // Base score starts at 100 - apply penalties
  let score = Math.round(100 - movePenalty - timePenalty);

  // Small bonus for a perfect performance (optional): +5 if perfect moves and fast time
  const fastTimeBonusThreshold = 60; // <= 60s across both levels gives a bonus
  if (moves === perfectMoves && time <= fastTimeBonusThreshold) score += 5;

  // Clamp to 0..100
  score = Math.max(0, Math.min(100, score));

  return score;
};

// NEW: End game function
const endGame = function () {
  clearInterval(gameTimer);
  totalTime += seconds;
  const endTime = new Date().toISOString();

  // Calculate total misses (incorrect matches)
  const totalTrials = totalMoves;
  const perfectMoves = 8 * 2; // 8 pairs × 2 levels = 16 perfect moves
  const totalMisses = Math.max(0, totalMoves - perfectMoves);

  // Prepare game data according to schema
  const gameData = {
    userId: USER_ID,
    gameId: Math.floor(Math.random() * 1000000), // Generate a unique game ID or get from server
    startTime: gameStartTime,
    endTime: endTime,
    score: calculateScore(totalMoves, totalTime),
    trials: totalTrials,
    misses: totalMisses,
    sessionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };

  // Send data to API
  sendGameDataToAPI(gameData)
    .then(() => {
      showResults(gameData);
    })
    .catch((error) => {
      // Still show results even if API call fails
      console.error('Failed to save game data, but showing results anyway');
      showResults(gameData);
    });
};

// MODIFIED: showResults function to accept gameData
const showResults = function (gameData) {
  const averageTime = Math.round(totalTime / 2); // Changed from 3 to 2
  const averageMoves = Math.round(totalMoves / 2); // Changed from 3 to 2

  const modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <h2>Game Complete!</h2>
        <p><strong>Score:</strong> ${gameData.score} / 100</p>
        <p>Total Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60)
    .toString()
    .padStart(2, '0')}</p>
        <p>Total Moves: ${totalMoves}</p>
        <p>Misses: ${gameData.misses}</p>
        <p>Average Time per Level: ${Math.floor(averageTime / 60)}:${(
    averageTime % 60
  )
    .toString()
    .padStart(2, '0')}</p>
        <p>Average Moves per Level: ${averageMoves}</p>
    <button class="restart-btn">
          <a href="/index.html">Home Page</a>
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.querySelector('.restart-btn').addEventListener('click', function () {
    document.querySelector('.modal').remove();
    currentLevel = 0;
    totalMoves = 0;
    totalTime = 0;
    seconds = 0;
    moves = 0;
    gameStartTime = null;
    movesCounter.textContent = '0';
    document.querySelector('.timer').textContent = '00:00';
    resetGame();
    btnNXT.classList.add('hidden--opacity');
    aboutSec.classList.remove('hidden');
    container.classList.add('hidden');
  });
};

// MODIFIED: checkIfDone function to end after 2 levels
const checkIfDone = function () {
  if (truePairs === 8) {
    setTimeout(() => {
      currentLevel++;
      totalMoves += moves;

      if (currentLevel === 2) {
        // Changed from 3 to 2
        btnNXT.textContent = 'End Game';
      } else {
        btnNXT.textContent = `Level ${currentLevel + 1}`;
      }

      btnNXT.classList.remove('hidden--opacity');
      btnNXT.classList.add('btn--animation');
      setTimeout(() => {
        btnNXT.classList.remove('btn--animation');
      }, 500);
    }, 1500);
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
        checkIfDone(); // Move checkIfDone here to ensure it runs after truePairs is incremented
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

const getRandomNumber = function () {
  const randomNumber = Math.trunc(Math.random() * items.length);
  return randomNumber;
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
              <image
                href="${item.value}"
                width="100"
                height="100"
              />
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

// Initial game setup
while (createdCards < 16) {
  generateMarkup();
}
