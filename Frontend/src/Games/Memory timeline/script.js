// DOM elements (keep these selectors in sync with index.html)
const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const questionContainer = document.querySelector('.questions--container');
const answersContainer = document.querySelector('.answers');
const answers = document.querySelectorAll('.answer');
const question = document.querySelector('.question');

let curQuestion = 0;
let acceptingAnswers = true;
let score = 0; // keep structure used by HTML (story1, story2, story3)
let currentQuestionSet; // set after questions array is declared
const scoreValueEl = document.querySelector('.score-value');
const scoresModal = document.querySelector('.scores-modal');
const modalClose = document.querySelector('.modal-close');

const parkAdventureQuestions = [
  {
    question: 'What did the old man give to Youssef?',
    options: ['A balloon', 'A candy', 'A coin', 'A flower'],
    correctAnswer: 'A candy',
  },
  {
    question: 'What color was the candy’s wrapper?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correctAnswer: 'Blue',
  },
  {
    question: 'What animal did Lina see as they were leaving the park?',
    options: ['A cat', 'A dog', 'A squirrel', 'A bird'],
    correctAnswer: 'A squirrel',
  },
  {
    question: 'What was the squirrel holding when Lina saw it?',
    options: ['A nut', 'A leaf', 'A sandwich crust', 'A flower'],
    correctAnswer: 'A sandwich crust',
  },
  {
    question: `What color was jacket the dog owner wearing?`,
    options: [`Blue`, `Red`, `Green`, `Yellow`],
    correctAnswer: `Green`,
  },
  {
    question: `What did the woman give Omar as a thank you?`,
    options: [`A candy`, `A star keychain`, `A small toy`, `Money`],
    correctAnswer: `A star keychain`,
  },
  {
    question: `Where was Omar going?`,
    options: [
      `To the park`,
      `To school`,
      `To his friend's house`,
      `To the library`,
    ],
    correctAnswer: `To school`,
  },
  {
    question: `How did Omar hold the keychain at the end?`,
    options: [`Loosely`, `Tightly`, `In his pocket`, `In his backpack`],
    correctAnswer: `Tightly`,
  },
  {
    question: `What color were the Beast's eyes?`,
    options: [`Green`, `Yellow`, `Red`, `Blue`],
    correctAnswer: `Red`,
  },
  {
    question: `How many blows did Arion strike to defeat the monster?`,
    options: [`One`, `Two`, `Three`, `Four`],
    correctAnswer: `Three`,
  },
  {
    question: `Where did the monster fall after being defeated?`,
    options: [
      `Into the forest`,
      `Into the river`,
      `Into the cave`,
      `Into the flames`,
    ],
    correctAnswer: `Into the river`,
  },
  {
    question: `What did Arion give Princess Elara after rescuing her?`,
    options: [
      `A golden crown`,
      `A white rose`,
      `A silver necklace`,
      `A red ribbon`,
    ],
    correctAnswer: `A white rose`,
  },
];

// initialize the current question set after questions are declared
currentQuestionSet = parkAdventureQuestions;

// --- Simplified quiz flow -------------------------------------------------

// We'll use the parkAdventureQuestions array (defined above) as the quiz.
// The original code included a multi-story flow that wasn't present in index.html.
// We'll therefore implement a single, working quiz that matches the DOM.

function hideAboutAndStart() {
  if (!aboutSec || !questionContainer) return;
  aboutSec.classList.add('hidden');
  setTimeout(() => {
    aboutSec.classList.add('remove');
    questionContainer.classList.remove('remove');
    setTimeout(() => questionContainer.classList.remove('hidden'), 50);
    loadQuestion(0);
  }, 350);
}

btnAbout && btnAbout.addEventListener('click', hideAboutAndStart);

// load a question by index
function loadQuestion(index) {
  if (!question || !answers || answers.length === 0) return;

  // when index is out of range, finish
  if (index >= parkAdventureQuestions.length) {
    return showFinalScores();
  }

  // reset visuals
  answers.forEach((a, i) => {
    a.classList.remove(
      'correct--answer',
      'wrong--answer',
      'answer--animation',
      'remove'
    );
    a.textContent = parkAdventureQuestions[index].options[i] || '';
  });

  question.textContent = parkAdventureQuestions[index].question;
  curQuestion = index;
  acceptingAnswers = true;
}

questionContainer &&
  questionContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('answer')) return;
    if (!acceptingAnswers) return;
    acceptingAnswers = false; // prevent double clicks while animating

    const option = e.target;
    const correct = currentQuestionSet[curQuestion].correctAnswer;

    // track attempts (for a single story quiz the first story is story1)
    totalQuestionsAnswered++;

    if (option.textContent === correct) {
      option.classList.add('correct--answer');
      score++;
      correctAnswersCount++;
      if (scoreValueEl) scoreValueEl.textContent = score;
    } else {
      option.classList.add('wrong--answer');
      // also highlight the correct option
      answers.forEach(a => {
        if (a.textContent === correct) a.classList.add('correct--answer');
      });
    }

    option.classList.add('answer--animation');

    // after a short delay to show feedback/animation, load next question
    setTimeout(() => {
      loadQuestion(curQuestion + 1);
    }, 700);
  });

// Helper function to transition between stories
// Function to show final scores in the modal
function showFinalScores() {
  // Hide question container
  questionContainer.classList.add('hidden');
  setTimeout(() => {
    questionContainer.classList.add('remove');
  }, 500);

  // For this single-page quiz, put the result into story1 and set others to

  // Update scores in the modal
  document.querySelector('.story1-score').textContent = score;

  // Calculate and update total score (sum of story scores)
  const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-score-value').textContent = totalScore;

  // Update accuracy and duration
  const accuracy =
    totalQuestionsAnswered > 0
      ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100)
      : 0;
  const accuracyEl = document.querySelector('.accuracy-value');
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

  // compute duration
  gameEndTime = Date.now();
  const gameDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
  const durationEl = document.querySelector('.duration-value');
  if (durationEl) {
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    durationEl.textContent = `${minutes}m ${seconds}s`;
  }

  // Show the modal
  scoresModal.classList.remove('remove');
  setTimeout(() => {
    scoresModal.classList.remove('hidden');
  }, 100);
}

// Add event listener for the close button
if (modalClose) {
  modalClose.addEventListener('click', () => {
    scoresModal.classList.add('hidden');
  });
}

// previous multi-story logic removed — not required for the single-quiz page
// small session tracking variables used by the quiz
// let playerName = 'Guest'; // optional
// let gameStartTime = Date.now();
// let gameEndTime;
// let totalQuestionsAnswered = 0;
// let correctAnswersCount = 0;

// // Enhanced endGame function
// // (end of file cleanup: multi-story/endgame functions removed so quiz remains consistent)

// // Add event listener for "Next Game" button in modal
// const nextGameBtn = document.querySelector('.btn-next-game');
// if (nextGameBtn) {
//   nextGameBtn.addEventListener('click', () => {
//     // Redirect to next game page
//     window.location.href = '/next-game.html'; // Replace with your actual page URL
//   });
// }
// // API Configuration
// const API_BASE_URL = 'https://your-api-endpoint.com/api'; // Replace with your actual API endpoint
// const API_ENDPOINTS = {
//   submitGame: '/games',
//   // Add other endpoints as needed
// };

// Session tracking variables (already in your code, included here for context)
let playerName = 'Guest';
let gameStartTime = Date.now();
let gameEndTime;
let totalQuestionsAnswered = 0;
let correctAnswersCount = 0;
let userId = 0; // Set this from your authentication system
let gameId = 0; // Can be generated or retrieved from backend

/**
 * Sends game session data to the API
 * @param {Object} gameData - The game session data to send
 * @returns {Promise<Object>} - The API response
 */
async function sendGameDataToAPI(gameData) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.submitGame}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Game data successfully sent to API:', result);
    return result;
  } catch (error) {
    console.error('Error sending game data to API:', error);
    // Handle error appropriately (show user message, retry logic, etc.)
    throw error;
  }
}

/**
 * Prepares game session data according to the API schema
 * @returns {Object} - Formatted game data matching the API schema
 */
function prepareGameData() {
  const endTime = new Date();
  const startTime = new Date(gameStartTime);

  // Calculate misses (wrong answers)
  const misses = totalQuestionsAnswered - correctAnswersCount;

  return {
    userId: userId,
    gameId: gameId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    score: score,
    trials: totalQuestionsAnswered,
    misses: misses,
    sessionDate: startTime.toISOString().split('T')[0], // Format: YYYY-MM-DD
  };
}

/**
 * Enhanced endGame function that handles game completion and API submission
 */
async function endGame() {
  // Set game end time
  gameEndTime = Date.now();

  // Prepare the data according to API schema
  const gameData = prepareGameData();

  // Show final scores in the modal (your existing function)
  showFinalScores();

  // Send data to API
  try {
    const apiResponse = await sendGameDataToAPI(gameData);
    console.log('Game session saved successfully:', apiResponse);

    // Optional: Store the response (e.g., if API returns a game ID)
    if (apiResponse && apiResponse.gameId) {
      gameId = apiResponse.gameId;
    }

    // Optional: Show success message to user
    // displaySuccessMessage('Your progress has been saved!');
  } catch (error) {
    console.error('Failed to save game session:', error);
    // Optional: Show error message to user
    // displayErrorMessage('Failed to save your progress. Please check your connection.');
  }
}

/**
 * Alternative: Send data with retry logic
 * @param {Object} gameData - The game session data
 * @param {number} maxRetries - Maximum number of retry attempts
 */
async function sendGameDataWithRetry(gameData, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} of ${maxRetries} to send game data...`);
      const result = await sendGameDataToAPI(gameData);
      return result; // Success
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to send game data after ${maxRetries} attempts: ${lastError.message}`
  );
}

/**
 * Update the showFinalScores function to call endGame
 * (Add this to your existing showFinalScores function)
 */
function showFinalScores() {
  // Hide question container
  questionContainer.classList.add('hidden');
  setTimeout(() => {
    questionContainer.classList.add('remove');
  }, 500);

  // For this single-page quiz, put the result into story1 and set others to 0

  // // Update scores in the modal
  // document.querySelector('.story1-score').textContent = score;

  // Calculate and update total score
  const totalScore = score;
  document.querySelector('.story1-score').textContent = totalScore;

  // Update accuracy
  const accuracy =
    totalQuestionsAnswered > 0
      ? Math.round((correctAnswersCount / totalQuestionsAnswered) * 100)
      : 0;
  const accuracyEl = document.querySelector('.accuracy-value');
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

  // Compute duration
  gameEndTime = Date.now();
  const gameDuration = Math.floor((gameEndTime - gameStartTime) / 1000);
  const durationEl = document.querySelector('.duration-value');
  if (durationEl) {
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    durationEl.textContent = `${minutes}m ${seconds}s`;
  }

  // Show the modal
  scoresModal.classList.remove('remove');
  setTimeout(() => {
    scoresModal.classList.remove('hidden');
  }, 100);

  // Call endGame to send data to API
  endGame();
}

/**
 * Optional: Function to initialize game session (call this at game start)
 */
function initializeGameSession(userIdParam) {
  userId = userIdParam || 0;
  gameStartTime = Date.now();
  totalQuestionsAnswered = 0;
  correctAnswersCount = 0;
  score = 0;

  // Optional: Get a new gameId from the backend
  // gameId = await createNewGameSession();
}

/**
 * Optional: Display success/error messages to user
 */
function displaySuccessMessage(message) {
  // Implement your UI notification logic here
  console.log('✓ Success:', message);
}

function displayErrorMessage(message) {
  // Implement your UI notification logic here
  console.error('✗ Error:', message);
}
