// DOM Elements
const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const btnNXT = document.querySelector('.btn--next');
const imgEl = document.querySelector('.instrument--img');
const instrumentDisplay = document.querySelector('.instrument-display');
const instrumentName = document.querySelector('.instrument-name');
const btnPlaySound = document.querySelector('.btn-play-sound');
const mainAudio = document.querySelector('#main-audio');
const answers = document.querySelectorAll('.answer');
const scoreValueEl = document.querySelector('.score-value');
const finalScoreModal = document.querySelector('.final-score-modal');
const modalClose = document.querySelector('.modal-close');

// Game state
let currentInstrumentIndex = 0;
let score = 0;
let acceptingAnswers = true;
let mainSoundPlayed = false;

// When main play button finishes its hide transition, remove it from flow
if (btnPlaySound) {
  btnPlaySound.addEventListener('transitionend', function (e) {
    // wait for opacity transition to finish
    if (
      e.propertyName === 'opacity' &&
      btnPlaySound.classList.contains('hidden')
    ) {
      btnPlaySound.classList.add('remove');
    }
  });
}

// start with the first story and its question set
const animalData = [
  {
    name: 'Dog',
    image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    mainSound: './audio/dog.mp3',
    alternatives: [
      { name: 'Seal', sound: './audio/seal.mp3' },
      { name: 'Bear', sound: './audio/bear.mp3' },
      { name: 'Dog', sound: './audio/dog.mp3' },
      { name: 'Wolf', sound: './audio/wolf.mp3' },
    ],
  },
  {
    name: 'Cat',
    image:
      'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    mainSound: './audio/cat.mp3',
    alternatives: [
      { name: 'Cheetah ', sound: './audio/cheetah.mp3' }, // similar meow–cry tone
      { name: 'Panther', sound: './audio/panther.mp3' },
      { name: 'Cat', sound: './audio/cat.mp3' },
      { name: 'Raccoon', sound: './audio/raccoon.mp3' },
    ],
  },
  {
    name: 'Cow',
    image: 'https://images.pexels.com/photos/2647053/pexels-photo-2647053.jpeg',
    mainSound: './audio/cow.mp3',
    alternatives: [
      { name: 'Moose', sound: './audio/moose.mp3' },
      { name: 'Camel', sound: './audio/camel.mp3' },
      { name: 'Cow', sound: './audio/cow.mp3' },
      { name: 'Bison', sound: './audio/bison.mp3' },
    ],
  },
  {
    name: 'Sheep',
    image: 'https://images.pexels.com/photos/977239/pexels-photo-977239.jpeg',
    mainSound: './audio/sheep.mp3',
    alternatives: [
      { name: 'Goat', sound: './audio/goat.mp3' },
      { name: 'Seal', sound: './audio/seal.mp3' }, // both have short bleats
      { name: 'Lamb', sound: './audio/lamb.mp3' },
      { name: 'Sheep', sound: './audio/sheep.mp3' },
    ],
  },
  {
    name: 'Horse',
    image: 'https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg',
    mainSound: './audio/horse.mp3',
    alternatives: [
      { name: 'Donkey', sound: './audio/donkey.mp3' },
      { name: 'Zebra', sound: './audio/zebra.mp3' },
      { name: 'Horse', sound: './audio/horse.mp3' },
      { name: 'Moose', sound: './audio/moose.mp3' },
    ],
  },
  {
    name: 'Rooster',
    image: 'https://images.pexels.com/photos/3820303/pexels-photo-3820303.jpeg',
    mainSound: './audio/rooster.mp3',
    alternatives: [
      { name: 'Peacock', sound: './audio/peacock.mp3' },
      { name: 'Howler Monkey', sound: './audio/howler_monkey.mp3' },
      { name: 'Rooster', sound: './audio/rooster.mp3' },
      { name: 'Turkey', sound: './audio/turkey.mp3' },
    ],
  },
  {
    name: 'Duck',
    image: 'https://images.pexels.com/photos/833687/pexels-photo-833687.jpeg',
    mainSound: './audio/duck.mp3',
    alternatives: [
      { name: 'Seal', sound: './audio/seal.mp3' },
      { name: 'Goose', sound: './audio/goose.mp3' },
      { name: 'Duck', sound: './audio/duck.mp3' },
      { name: 'Penguin', sound: './audio/penguin.mp3' },
    ],
  },
  {
    name: 'Goose',
    image: 'https://images.pexels.com/photos/833687/pexels-photo-833687.jpeg',
    mainSound: './audio/goose.mp3',
    alternatives: [
      { name: 'Seal', sound: './audio/seal.mp3' },
      { name: 'Goose', sound: './audio/goose.mp3' },
      { name: 'Duck', sound: './audio/duck.mp3' },
      { name: 'Penguin', sound: './audio/penguin.mp3' },
    ],
  },
  {
    name: 'Elephant',
    image: 'https://images.pexels.com/photos/667205/pexels-photo-667205.jpeg',
    mainSound: './audio/elephant.mp3',
    alternatives: [
      { name: 'Whale', sound: './audio/whale.mp3' }, // low-frequency rumbles
      { name: 'Rhino', sound: './audio/rhino.mp3' },
      { name: 'Elephant', sound: './audio/elephant.mp3' },
      { name: 'Camel', sound: './audio/camel.mp3' },
    ],
  },
  {
    name: 'Moose',
    image:
      'https://images.pexels.com/photos/39645/moose-bull-elk-yawns-39645.jpeg',
    mainSound: './audio/moose.mp3',
    alternatives: [
      { name: 'Donkey', sound: './audio/donkey.mp3' },
      { name: 'Moose', sound: './audio/moose.mp3' },
      { name: 'Zebra', sound: './audio/zebra.mp3' },
      { name: 'Horse', sound: './audio/horse.mp3' },
    ],
  },
  {
    name: 'Parrot',
    image: 'https://images.pexels.com/photos/2317904/pexels-photo-2317904.jpeg',
    mainSound: './audio/parrot.mp3',
    alternatives: [
      { name: 'Crow', sound: './audio/crow.mp3' },
      { name: 'Myna', sound: './audio/myna.mp3' },
      { name: 'Parrot', sound: './audio/parrot.mp3' },
      { name: 'Seagull', sound: './audio/seagull.mp3' },
    ],
  },
  {
    name: 'Sea Lion',
    image:
      'https://images.pexels.com/photos/25956354/pexels-photo-25956354.jpeg',
    mainSound: './audio/sea_lion.mp3',
    alternatives: [
      { name: 'Whale', sound: './audio/whale.mp3' },
      { name: 'Seal', sound: './audio/seal.mp3' },
      { name: 'Dolphin', sound: './audio/dolphin.mp3' },
      { name: 'Sea Lion', sound: './audio/sea_lion.mp3' },
    ],
  },
  {
    name: 'Dolphin',
    image:
      'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg',
    mainSound: './audio/dolphin.mp3',
    alternatives: [
      { name: 'Whale', sound: './audio/whale.mp3' },
      { name: 'Seal', sound: './audio/seal.mp3' },
      { name: 'Dolphin', sound: './audio/dolphin.mp3' },
      { name: 'Sea Lion', sound: './audio/sea_lion.mp3' },
    ],
  },
  {
    name: 'Hippopotamus',
    image: 'https://images.pexels.com/photos/667201/pexels-photo-667201.jpeg',
    mainSound: './audio/hippopotamus.mp3',
    alternatives: [
      { name: 'Rhino', sound: './audio/rhino.mp3' },
      { name: 'Bison', sound: './audio/bison.mp3' },
      { name: 'Hippopotamus', sound: './audio/hippopotamus.mp3' },
      { name: 'Elephant', sound: './audio/elephant.mp3' },
    ],
  },
  {
    name: 'Bear',
    image: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg',
    mainSound: './audio/bear.mp3',
    alternatives: [
      { name: 'Gorilla', sound: './audio/gorilla.mp3' },
      { name: 'Boar', sound: './audio/boar.mp3' },
      { name: 'Bear', sound: './audio/bear.mp3' },
      { name: 'Bison', sound: './audio/bison.mp3' },
    ],
  },
];

// Game Functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function displayInstrument(index) {
  if (index >= animalData.length) {
    showFinalScore();
    return;
  }

  const instrument = animalData[index];
  imgEl.src = instrument.image;
  instrumentName.textContent = instrument.name;

  // Reset main sound button and state: show and allow interaction
  if (btnPlaySound) {
    btnPlaySound.classList.remove('hidden', 'remove');
    btnPlaySound.style.pointerEvents = 'auto';
  }
  mainSoundPlayed = false;
  if (mainAudio) {
    // set the <source> inside the audio element if present
    const mainSource = mainAudio.querySelector('source');
    // prefer explicit mainSound if provided, otherwise fallback to sound
    if (mainSource)
      mainSource.src = instrument.mainSound || instrument.sound || '';
    try {
      mainAudio.load();
      mainAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
  }

  // Hide next button until an answer is selected
  btnNXT.style.display = 'none';

  // Shuffle alternatives and update answer buttons
  const allAlternatives = shuffleArray([...instrument.alternatives]);
  answers.forEach((choice, i) => {
    const alternative = allAlternatives[i];

    // Reset classes
    choice.classList.remove(
      'correct--answer',
      'wrong--answer',
      'answer--animation'
    );

    // Update text and audio
    // Hide text but store name as data attribute for checking answers
    const answerText = choice.querySelector('.answer-text');
    answerText.textContent = 'Listen and Choose';
    answerText.dataset.instrumentName = alternative.name;
    const altAudio = choice.querySelector('.answer-audio');
    const altSource = altAudio.querySelector('source');
    if (altSource) altSource.src = alternative.sound || '';
    try {
      altAudio.load();
      altAudio.currentTime = 0;
    } catch (e) {}
    const playBtn = choice.querySelector('.btn-play-choice');
    // show play button by removing the 'hidden' or 'remove' classes (avoid direct style changes)
    playBtn.classList.remove('hidden', 'remove');
  });

  acceptingAnswers = true;
}

function playSound(element, sound) {
  // Pause all other playing sounds first
  document.querySelectorAll('audio').forEach(audio => {
    if (audio !== element) {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  if (element.paused) {
    element.play();
  } else {
    element.pause();
    element.currentTime = 0;
  }
}

// Event Listeners
btnAbout.addEventListener('click', function () {
  // First hide the about section
  aboutSec.classList.add('hidden');

  // After the hiding animation, remove it and prepare the instrument display
  setTimeout(() => {
    aboutSec.classList.add('remove');
    instrumentDisplay.classList.remove('remove');

    // Initialize the first instrument
    displayInstrument(currentInstrumentIndex);

    // Show the instrument display with a slight delay
    requestAnimationFrame(() => {
      instrumentDisplay.classList.remove('hidden');
    });
  }, 500);
});

btnNXT.addEventListener('click', function () {
  // stop any playing audios when moving to next instrument
  document.querySelectorAll('audio').forEach(a => {
    try {
      a.pause();
      a.currentTime = 0;
    } catch (e) {}
  });
  currentInstrumentIndex++;
  displayInstrument(currentInstrumentIndex);
});

btnPlaySound.addEventListener('click', function () {
  if (!mainSoundPlayed) {
    try {
      const p = mainAudio.play();
      if (p && p.then) p.catch(() => {});
    } catch (e) {
      // ignore play errors
    }
    mainSoundPlayed = true;
    // fade out smoothly, then transitionend handler will add .remove
    btnPlaySound.classList.add('hidden');
    btnPlaySound.style.pointerEvents = 'none';
  }
});

// Handle play buttons for alternatives
document.querySelectorAll('.btn-play-choice').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevent triggering the answer click
    const audio = this.parentElement.querySelector('.answer-audio');
    playSound(audio);
    // hide this play button using the 'hidden' class so it can be revealed next round
    try {
      this.classList.add('hidden');
    } catch (e) {}
  });
});

// Handle answer clicks
document.querySelector('.answers').addEventListener('click', function (e) {
  const answer = e.target.closest('.answer');
  if (!answer || !acceptingAnswers) return;
  acceptingAnswers = false;

  const answerText =
    answer.querySelector('.answer-text').dataset.instrumentName;
  const currentInstrument = animalData[currentInstrumentIndex];
  const isCorrect = answerText === currentInstrument.name;

  if (isCorrect) {
    answer.classList.add('correct--answer');
    if (score < 11) {
      score++;
      scoreValueEl.textContent = score;
    }
  } else {
    answer.classList.add('wrong--answer');
    // Highlight the correct answer
    answers.forEach(a => {
      if (
        a.querySelector('.answer-text').dataset.instrumentName ===
        currentInstrument.name
      ) {
        a.classList.add('correct--answer');
      }
    });
  }

  answer.classList.add('answer--animation');

  // Hide all play buttons after selection
  document.querySelectorAll('.btn-play-choice').forEach(btn => {
    btn.classList.add('hidden');
  });

  // Show and enable next button after animation
  // After animation, auto-advance to next question (preserve animation time)
  setTimeout(() => {
    // stop any playing audios when moving to next instrument
    document.querySelectorAll('audio').forEach(a => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });

    // advance index and display next instrument (displayInstrument handles final score)
    currentInstrumentIndex++;
    displayInstrument(currentInstrumentIndex);
  }, 1500);
});
// Add to game state variables (at the top with other state variables)
let gameResults = []; // Track each question result
let gameStartTime = null;
let gameEndTime = null;

// Modified answer click handler - add this to track results
// Replace the existing answer click event listener with this updated version:
document.querySelector('.answers').addEventListener('click', function (e) {
  const answer = e.target.closest('.answer');
  if (!answer || !acceptingAnswers) return;
  acceptingAnswers = false;

  const answerText =
    answer.querySelector('.answer-text').dataset.instrumentName;
  const currentInstrument = animalData[currentInstrumentIndex];
  const isCorrect = answerText === currentInstrument.name;

  // Track this answer in game results
  gameResults.push({
    questionNumber: currentInstrumentIndex + 1,
    animal: currentInstrument.name,
    userAnswer: answerText,
    correctAnswer: currentInstrument.name,
    isCorrect: isCorrect,
    timestamp: new Date().toISOString(),
  });

  if (isCorrect) {
    answer.classList.add('correct--answer');
    if (score < animalData.length) {
      score++;
      scoreValueEl.textContent = score;
    }
  } else {
    answer.classList.add('wrong--answer');
    answers.forEach(a => {
      if (
        a.querySelector('.answer-text').dataset.instrumentName ===
        currentInstrument.name
      ) {
        a.classList.add('correct--answer');
      }
    });
  }

  answer.classList.add('answer--animation');

  document.querySelectorAll('.btn-play-choice').forEach(btn => {
    btn.classList.add('hidden');
  });

  setTimeout(() => {
    document.querySelectorAll('audio').forEach(a => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });

    currentInstrumentIndex++;
    displayInstrument(currentInstrumentIndex);
  }, 1500);
});

// Initialize game start time when game begins
// Add to the btnAbout click handler after displaying first instrument:
btnAbout.addEventListener('click', function () {
  aboutSec.classList.add('hidden');

  setTimeout(() => {
    aboutSec.classList.add('remove');
    instrumentDisplay.classList.remove('remove');

    // Initialize game start time and reset results
    gameStartTime = new Date();
    gameResults = [];
    score = 0;
    currentInstrumentIndex = 0;

    displayInstrument(currentInstrumentIndex);

    requestAnimationFrame(() => {
      instrumentDisplay.classList.remove('hidden');
    });
  }, 500);
});

// Show final score modal with detailed results
function showFinalScore() {
  gameEndTime = new Date();
  const gameDuration = Math.round((gameEndTime - gameStartTime) / 1000); // in seconds

  // Hide instrument display
  instrumentDisplay.classList.add('hidden');

  // Build results HTML
  const resultsHTML = gameResults
    .map(
      result => `
    <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
      <span class="result-number">${result.questionNumber}.</span>
      <span class="result-animal">${result.animal}</span>
      <span class="result-status">${result.isCorrect ? '✓' : '✗'}</span>
      ${
        !result.isCorrect
          ? `<span class="result-wrong">(You chose: ${result.userAnswer})</span>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const percentage = Math.round((score / animalData.length) * 100);

  // Populate modal content
  const modalContent = `
    <h2>Game Complete!</h2>
    <div class="final-stats">
      <div class="stat-item">
        <span class="stat-label">Final Score:</span>
        <span class="stat-value">${score} / ${animalData.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Accuracy:</span>
        <span class="stat-value">${percentage}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Time:</span>
        <span class="stat-value">${Math.floor(gameDuration / 60)}:${(
    gameDuration % 60
  )
    .toString()
    .padStart(2, '0')}</span>
      </div>
    </div>
    <div class="results-list">
      <h3>Your Answers:</h3>
      ${resultsHTML}
    </div>
    <div class="modal-actions">
      <a href="/index.html" class="btn-next-game">Home Page</a>
    </div>
  `;

  // Display modal
  finalScoreModal.innerHTML = modalContent;
  finalScoreModal.classList.remove('hidden', 'remove');

  // Send data to database
  sendGameDataToDatabase();

  // Add event listeners for modal buttons
  document
    .querySelector('.btn-play-again')
    .addEventListener('click', resetGame);
  document
    .querySelector('.btn-close-modal')
    .addEventListener('click', closeModal);
}

// Send game data to database
async function sendGameDataToDatabase() {
  const gameData = {
    score: score,
    totalQuestions: animalData.length,
    percentage: Math.round((score / animalData.length) * 100),
    duration: Math.round((gameEndTime - gameStartTime) / 1000),
    startTime: gameStartTime.toISOString(),
    endTime: gameEndTime.toISOString(),
    results: gameResults,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      'https://your-api-endpoint.com/api/game-results',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Game data saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error saving game data:', error);
    // Optionally store locally if server fails
    localStorage.setItem('lastGameData', JSON.stringify(gameData));
    return null;
  }
}

// Reset game and play again
function resetGame() {
  // Reset all game state
  currentInstrumentIndex = 0;
  score = 0;
  gameResults = [];
  acceptingAnswers = true;
  mainSoundPlayed = false;

  // Update score display
  scoreValueEl.textContent = score;

  // Hide modal
  finalScoreModal.classList.add('hidden');

  // Stop all audio
  document.querySelectorAll('audio').forEach(a => {
    try {
      a.pause();
      a.currentTime = 0;
    } catch (e) {}
  });

  // Show instrument display
  instrumentDisplay.classList.remove('hidden');

  // Start new game
  gameStartTime = new Date();
  displayInstrument(currentInstrumentIndex);
}

// Close modal without restarting
function closeModal() {
  finalScoreModal.classList.add('hidden');
  setTimeout(() => {
    finalScoreModal.classList.add('remove');
  }, 300);
}
