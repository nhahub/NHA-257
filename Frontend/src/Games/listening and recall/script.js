const storyQuestions = [
  {
    name: 'Beethoven',
    questions: [
      {
        question: 'What did Beethoven love more than anything?',
        choices: ['Music', 'Painting', 'Traveling'],
        correct: 'Music',
      },
      {
        question: 'What instrument did Beethoven play?',
        choices: ['Piano', 'Violin', 'Flute'],
        correct: 'Piano',
      },
      {
        question: 'What happened to Beethoven as he got older?',
        choices: [
          'He broke his hand',
          'He lost his sight',
          'He started losing his hearing',
        ],
        correct: 'He started losing his hearing',
      },
      {
        question:
          'How did Beethoven keep making music after he lost his hearing?',
        choices: [
          'He watched other people play',
          'He imagined the notes in his mind',
          'He stopped writing music',
        ],
        correct: 'He imagined the notes in his mind',
      },
      {
        question: 'What did Beethoven prove with his music?',
        choices: [
          'That only young people can make music',
          'That real music comes from the heart',
          'That music must be loud to be great',
        ],
        correct: 'That real music comes from the heart',
      },
    ],
  },
  {
    name: 'Marie Curie',
    questions: [
      {
        question: 'What did Marie Curie love to learn about?',
        choices: ['Science', 'Music', 'Art'],
        correct: 'Science',
      },
      {
        question: 'What did she study for many hours in her lab?',
        choices: [
          'Plants and animals',
          'Stars and planets',
          'Rocks and chemicals',
        ],
        correct: 'Rocks and chemicals',
      },
      {
        question: 'What amazing thing did Marie notice one night?',
        choices: [
          'A bright star in the sky',
          'A strange green glow from a rock',
          'A new kind of flower',
        ],
        correct: 'A strange green glow from a rock',
      },
      {
        question: 'What was the name of the new element she discovered?',
        choices: ['Radium', 'Helium', 'Iron'],
        correct: 'Radium',
      },
      {
        question: `What made Marie Curie's discovery so important?`,
        choices: [
          'It made jewelry shine brighter',
          'It helped farmers grow food',
          'It helped doctors treat sick people with radiation',
        ],
        correct: 'It helped doctors treat sick people with radiation',
      },
      {
        question: 'What did Marie Curie show the world?',
        choices: [
          'That rocks are magical',
          'That girls can shine just as bright as any scientist',
          'That science is easy for everyone',
        ],
        correct: 'That girls can shine just as bright as any scientist',
      },
    ],
  },
  {
    name: 'Mozart',
    questions: [
      {
        question: 'What did Mozart love more than anything as a little boy?',
        choices: ['Music', 'Drawing', 'Reading'],
        correct: 'Music',
      },
      {
        question: 'At what age could Mozart play the piano?',
        choices: ['Seven', 'Five', 'Ten'],
        correct: 'Five',
      },
      {
        question: 'What sound inspired Mozart one night?',
        choices: ['Rain falling', 'Birds singing', 'Waves crashing'],
        correct: 'Birds singing',
      },
      {
        question: 'What did Mozart do after hearing the birds?',
        choices: [
          'He went to sleep',
          'He wrote a story about birds',
          'He copied their tune on the piano',
        ],
        correct: 'He copied their tune on the piano',
      },
      {
        question: `What did Mozart's songs make people feel?`,
        choices: [
          'Anger and confusion',
          'Joy and happiness',
          'Fear and sadness',
        ],
        correct: 'Joy and happiness',
      },
    ],
  },
  {
    name: 'Leonardo da Vinci',
    questions: [
      {
        question: 'What was Leonardo da Vinci known for?',
        choices: [
          'Being a sailor',
          'Being an artist and inventor',
          'Being a king',
        ],
        correct: 'Being an artist and inventor',
      },
      {
        question: 'What did Leonardo love to do?',
        choices: [
          'Play music',
          'Imagine and study everything he saw',
          'Build castles',
        ],
        correct: 'Imagine and study everything he saw',
      },
      {
        question: 'What did Leonardo wonder when he saw birds flying?',
        choices: [
          'What if people could fly too?',
          'How do birds sing?',
          'Where are the birds going?',
        ],
        correct: 'What if people could fly too?',
      },
      {
        question: 'What did Leonardo draw after watching the birds?',
        choices: [
          'Wings and flying machines',
          'Castles and kings',
          'Animals and trees',
        ],
        correct: 'Wings and flying machines',
      },
      {
        question: ` What message does Leonardo's story teach us?`,
        choices: [
          'Flying is impossible for people',
          'Only birds can dream of the sky',
          'Great dreams can start with a simple question',
        ],
        correct: 'Great dreams can start with a simple question',
      },
    ],
  },
  {
    name: 'Mark Twain',
    questions: [
      {
        question: 'Where did Mark Twain grow up?',
        choices: ['In the mountains', 'Near a big river', 'By the sea'],
        correct: 'Near a big river',
      },
      {
        question: 'What did young Twain love to do by the river?',
        choices: [
          'Go fishing every day',
          'Swim with his friends',
          `Watch boats and listen to sailors' stories`,
        ],
        correct: ` Watch boats and listen to sailors' stories`,
      },
      {
        question: 'What did Twain do when he grew up?',
        choices: [
          'He became a sailor',
          'He painted pictures of rivers',
          'He wrote books about adventures',
        ],
        correct: 'He wrote books about adventures',
      },
      {
        question: ` Who was the clever boy in Twain's most famous story?`,
        choices: ['Tom Sawyer', 'Huckleberry Finn', 'Harry Potter'],
        correct: 'Tom Sawyer',
      },
      {
        question: 'What did Twain say about kindness?',
        choices: [
          'It is hard to learn',
          'It is only for friends',
          'It is a language everyone understands',
        ],
        correct: 'It is a language everyone understands',
      },
    ],
  },
  {
    name: 'James Maxwell',
    questions: [
      {
        question: 'Where was James Clerk Maxwell from?',
        choices: ['Scotland', 'England', 'Ireland'],
        correct: 'Scotland',
      },
      {
        question: 'What did Maxwell love as a boy?',
        choices: [
          'Playing sports',
          'Cooking new recipes',
          'Drawing patterns and asking "why"',
        ],
        correct: 'Drawing patterns and asking "why"',
      },
      {
        question: 'What great discovery did Maxwell make?',
        choices: [
          'That the Earth moves around the Sun',
          'That light, electricity, and magnetism are connected',
          'That sound travels through air',
        ],
        correct: 'That light, electricity, and magnetism are connected',
      },
      {
        question: 'What inventions were made later because of his ideas?',
        choices: [
          'Radios, TVs, and Wi-Fi',
          'Cars and airplanes',
          'Telephones and cameras',
        ],
        correct: 'Radios, TVs, and Wi-Fi',
      },
      {
        question: 'What else did Maxwell love besides science?',
        choices: [
          'Sports and painting',
          'Cooking and travel',
          'Poetry and kindness',
        ],
        correct: 'Poetry and kindness',
      },
    ],
  },
  {
    name: 'Leo Tolstoy',
    questions: [
      {
        question: 'Where was Leo Tolstoy from?',
        choices: ['Russia', 'France', 'Italy'],
        correct: 'Russia',
      },
      {
        question: 'What did Tolstoy love most?',
        choices: [
          'Parties and luxury',
          'Sports and travel',
          'Nature and simple living',
        ],
        correct: 'Nature and simple living',
      },
      {
        question: 'What kind of books did Tolstoy write?',
        choices: [
          'Books about animals',
          'Stories about real people and their feelings',
          'Books about science experiments',
        ],
        correct: 'Stories about real people and their feelings',
      },
      {
        question: 'What did Tolstoy believe brings true happiness?',
        choices: [
          'Kindness, not money',
          'Winning and fame',
          'Owning many things',
        ],
        correct: 'Kindness, not money',
      },
      {
        question: 'How did Tolstoy show his simple way of living?',
        choices: [
          'He traveled the world',
          'He built a big palace',
          'He wore simple clothes and worked in his garden',
        ],
        correct: 'He wore simple clothes and worked in his garden',
      },
    ],
  },
  {
    name: 'Galileo',
    questions: [
      {
        question: 'What did Galileo love to look at?',
        choices: ['The ocean', 'The sky', 'The forest'],
        correct: 'The sky',
      },
      {
        question: 'What tool did Galileo build to see the moon and stars?',
        choices: ['A telescope', 'A microscope', 'A compass'],
        correct: 'A telescope',
      },
      {
        question: 'What did Galileo see when he looked through his telescope?',
        choices: [
          'Only clouds',
          'Flying birds',
          'Craters and tiny stars no one had seen before',
        ],
        correct: 'Craters and tiny stars no one had seen before',
      },
      {
        question: 'What did most people believe about the Earth back then?',
        choices: [
          'That it moved around the sun',
          'That it was the center of everything',
          'That it was flat',
        ],
        correct: 'That it was the center of everything',
      },
      {
        question: 'What did Galileo say about the Earth?',
        choices: [
          'The Earth moves around the sun',
          'The Earth never moves',
          'The Earth is the center of the stars',
        ],
        correct: 'The Earth moves around the sun',
      },
      {
        question: 'Why do we call Galileo the father of modern science?',
        choices: [
          'He discovered electricity',
          'He invented airplanes',
          'He helped us understand the stars',
        ],
        correct: 'He helped us understand the stars',
      },
    ],
  },
  {
    name: 'Michael Faraday',
    questions: [
      {
        question: 'Where did Michael Faraday work when he was young?',
        choices: ['In a factory', 'In a bookshop', 'In a school'],
        correct: 'In a bookshop',
      },
      {
        question: 'What did Faraday love reading about?',
        choices: ['Adventure stories', 'Animals', 'Science'],
        correct: 'Science',
      },
      {
        question:
          'What happened when Faraday connected the ring of wire to a battery?',
        choices: [
          'The magnet disappeared',
          'The ring began to spin',
          'The light turned on',
        ],
        correct: 'The ring began to spin',
      },
      {
        question: ` What did Faraday's discovery help create?`,
        choices: ['Electric motors', 'Light bulbs', 'Televisions'],
        correct: 'Electric motors',
      },
      {
        question: 'What did Faraday whisper after his discovery?',
        choices: [
          'Science is too hard for me',
          'Electricity is dangerous',
          'Magic is just science we understand',
        ],
        correct: 'Magic is just science we understand',
      },
    ],
  },
];

const aboutSection = document.querySelector('.about');
const listeningSection = document.querySelector('.listening');
const questionsSection = document.querySelector('.questions');
const nextAboutBtn = document.querySelector('.btn--next--aboutSection');
const nextListeningBtn = document.querySelector('.btn--questions');
const questionContainer = document.querySelector('.question--container');
const answersContainer = document.querySelector('.answers--container');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const finalTimeEl = document.getElementById('final-time');
const restartBtn = document.querySelector('.btn--restart');
const timerBox = document.querySelector('.timer');
const characterTitle = document.querySelector('.character--container h2');
const characterImage = document.querySelector('.character--image');
const audioSrc = document.querySelector('.audio--source');

// ========================
// Variables
// ========================

let currentStory = 0;
let currentQuestion = 0;
let score = 0;
let seconds = 0;
let timer;

// NEW: API-related variables
let gameStartTime = null;
let totalTrials = 0; // Total questions answered
let totalMisses = 0; // Total wrong answers
const API_ENDPOINT = 'https://your-api-endpoint.com/api/games'; // Replace with your actual API endpoint
const USER_ID = 1; // Replace with actual user ID from your authentication system

// ========================
// Timer
// ========================

function formatTime(s) {
  const min = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    if (timeEl) timeEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

// ========================
// NEW: API Functions
// ========================

// Function to send game data to API
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
    throw error;
  }
};

// Calculate score based on correct answers (0 - 100 scale)
const calculateScore = function (correctAnswers, totalQuestions) {
  // Guard against division by zero
  if (!totalQuestions || totalQuestions <= 0) return 0;

  // Calculate percentage of correct answers and scale to 0-100
  const percentage = correctAnswers / totalQuestions;
  const value = Math.round(percentage * 100);

  // Clamp to [0, 100]
  return Math.max(0, Math.min(100, value));
};

// NEW: End game function
const endGame = function () {
  stopTimer();
  const endTime = new Date().toISOString();

  // Calculate total questions (9 stories × varying questions per story)
  const totalQuestions = storyQuestions.reduce(
    (sum, story) => sum + story.questions.length,
    0
  );

  // Prepare game data according to schema
  const gameData = {
    userId: USER_ID,
    gameId: Math.floor(Math.random() * 1000000), // Generate a unique game ID
    startTime: gameStartTime,
    endTime: endTime,
    score: calculateScore(score, totalQuestions),
    trials: totalTrials,
    misses: totalMisses,
    sessionDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };

  // Send data to API
  sendGameDataToAPI(gameData)
    .then(() => {
      showFinalResults(gameData);
    })
    .catch((error) => {
      // Still show results even if API call fails
      console.error(
        'Failed to save game data, but showing results anyway' + error
      );
      showFinalResults(gameData);
    });
};

// NEW: Show final results function with custom modal
const showFinalResults = function (gameData) {
  const totalQuestions = storyQuestions.reduce(
    (sum, story) => sum + story.questions.length,
    0
  );
  const accuracy = Math.round((score / totalQuestions) * 100);

  // Create custom results modal
  const resultsModalHTML = `
    <div class="results-modal-overlay">
      <div class="results-modal">
        <div class="results-header">
          <h2>🎉 Game Complete! 🎉</h2>
          <p class="congratulations-text">Great job completing all the stories!</p>
        </div>
        
        <div class="results-content">
          <div class="result-card primary-score">
            <div class="result-icon">⭐</div>
            <div class="result-value">${gameData.score} / 100</div>
            <div class="result-label">Final Score</div>
          </div>

          <div class="results-grid">
            <div class="result-card">
              <div class="result-icon">✅</div>
              <div class="result-value">${score}</div>
              <div class="result-label">Correct Answers</div>
            </div>

            <div class="result-card">
              <div class="result-icon">❌</div>
              <div class="result-value">${totalMisses}</div>
              <div class="result-label">Wrong Answers</div>
            </div>

            <div class="result-card">
              <div class="result-icon">📝</div>
              <div class="result-value">${totalQuestions}</div>
              <div class="result-label">Total Questions</div>
            </div>

            <div class="result-card">
              <div class="result-icon">🎯</div>
              <div class="result-value">${accuracy}%</div>
              <div class="result-label">Accuracy</div>
            </div>

            <div class="result-card">
              <div class="result-icon">⏱️</div>
              <div class="result-value">${formatTime(seconds)}</div>
              <div class="result-label">Time Taken</div>
            </div>

            <div class="result-card">
              <div class="result-icon">📚</div>
              <div class="result-value">${storyQuestions.length}</div>
              <div class="result-label">Stories Completed</div>
            </div>
          </div>

          <div class="performance-message">
            <p>${getPerformanceMessage(accuracy)}</p>
          </div>

          <div class="results-actions">
            <button class="btn-play-again">Home Page</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert modal into body
  document.body.insertAdjacentHTML('beforeend', resultsModalHTML);

  // Add event listener to play again button
  document
    .querySelector('.btn-play-again')
    .addEventListener('click', function () {
      // Remove the results modal
      document.querySelector('.results-modal-overlay').remove();

      // Reset all variables
      currentStory = 0;
      currentQuestion = 0;
      score = 0;
      seconds = 0;
      totalTrials = 0;
      totalMisses = 0;
      gameStartTime = null;

      // Reset UI
      if (timeEl) timeEl.textContent = '00:00';

      // Go back to about section
      questionsSection.classList.add('hidden');
      listeningSection.classList.add('hidden');
      aboutSection.classList.remove('hidden');

      stopTimer();
    });
};

// NEW: Get performance message based on accuracy
const getPerformanceMessage = function (accuracy) {
  if (accuracy >= 90) {
    return "🌟 Outstanding! You're a true history expert!";
  } else if (accuracy >= 80) {
    return '🎊 Excellent work! You really know your stories!';
  } else if (accuracy >= 70) {
    return "👏 Good job! You've learned a lot!";
  } else if (accuracy >= 60) {
    return '👍 Nice effort! Keep practicing!';
  } else {
    return "💪 Don't give up! Try again to improve your score!";
  }
};

/////////////////////////////
// Functions
////////////////////////////

const removeAndAddClasses = function (firstClass, secondClass) {
  firstClass.classList.add('hidden');
  setTimeout(() => {
    firstClass.classList.add('remove');
    secondClass.classList.remove('hidden');
  }, 550);
  setTimeout(() => {
    secondClass.classList.remove('remove');
  }, 50);
};

const displayStoryDetails = function (curStoryName) {
  characterImage.src = `image/${curStoryName}.png`;
  audioSrc.src = `audio/${curStoryName}.mp3`;
  setTimeout(() => {
    const audio = audioSrc.parentElement;
    audio.load();
    audio.play();
  }, 1500);
};

const displayAnswers = function (answers) {
  answers.forEach((answer) => {
    const markup = `<div class="answer shadowing">${answer}</div>`;
    questionContainer.insertAdjacentHTML('beforeend', markup);
  });
};

const displayDetails = function (curStory) {
  const curObject = curStory.questions.at(currentQuestion);
  questionContainer.textContent = curObject.question;
  displayAnswers(curObject.choices);
};

// MODIFIED: Check if all stories are complete
const checkNewStory = function () {
  const currentStoryQuestions = storyQuestions[currentStory].questions.length;

  if (currentQuestion < currentStoryQuestions) return;

  if (currentQuestion === currentStoryQuestions) {
    currentQuestion = 0;
    currentStory++;

    // NEW: Check if all stories are completed
    if (currentStory >= storyQuestions.length) {
      // All stories completed - end the game
      setTimeout(() => {
        endGame();
      }, 1000);
      return;
    }

    removeAndAddClasses(questionsSection, listeningSection);
    setTimeout(() => {
      displayStoryDetails(storyQuestions.at(currentStory).name);
    }, 550);
  }
};

// MODIFIED: Track correct and incorrect answers
const checkValue = function (element, value) {
  totalTrials++; // Increment total trials

  if (
    value === storyQuestions[currentStory].questions[currentQuestion].correct
  ) {
    score++;
    element.classList.add('correct--answer');
  } else {
    totalMisses++; // Increment misses
    element.classList.add('wrong--answer');
  }

  currentQuestion++;

  setTimeout(() => {
    checkNewStory();
  }, 500);

  setTimeout(() => {
    // Only display next question if game hasn't ended
    if (currentStory < storyQuestions.length) {
      displayDetails(storyQuestions.at(currentStory));
    }
  }, 1000);
};

///////////////////////////
// Event Handlers
///////////////////////////

// MODIFIED: Start timer and track start time
nextAboutBtn.addEventListener('click', function () {
  gameStartTime = new Date().toISOString(); // NEW: Track start time
  startTimer(); // NEW: Start timer when game begins
  removeAndAddClasses(aboutSection, listeningSection);
  displayStoryDetails(storyQuestions.at(currentStory).name);
});

nextListeningBtn.addEventListener('click', function () {
  removeAndAddClasses(listeningSection, questionsSection);
  displayDetails(storyQuestions.at(currentStory));
});

questionsSection.addEventListener('click', function (e) {
  let answerValue;
  if (e.target.classList.contains('answer')) {
    answerValue = e.target.textContent;
    checkValue(e.target, answerValue);
  }
});

// NEW: Restart game handler
restartBtn.addEventListener('click', function () {
  // Reset all variables
  currentStory = 0;
  currentQuestion = 0;
  score = 0;
  seconds = 0;
  totalTrials = 0;
  totalMisses = 0;
  gameStartTime = null;

  // Reset UI
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  if (timeEl) timeEl.textContent = '00:00';

  // Remove stats if they exist
  const stats = document.querySelector('.game-stats');
  if (stats) stats.remove();

  // Go back to about section
  questionsSection.classList.add('hidden');
  listeningSection.classList.add('hidden');
  aboutSection.classList.remove('hidden');

  stopTimer();
});
