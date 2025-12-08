// --- CONFIG ---
const GAME_ID = 10; // Listen & Recall
const MAX_STORIES_PER_SESSION = 3; // Limit to 3 stories
const sessionMgr = new SessionManager('https://localhost:7101/api');

// --- DATA (All Available Stories) ---
const allStoryQuestions = [
  {
    name: 'Beethoven',
    questions: [
      { question: 'What did Beethoven love more than anything?', choices: ['Music', 'Painting', 'Traveling'], correct: 'Music' },
      { question: 'What instrument did Beethoven play?', choices: ['Piano', 'Violin', 'Flute'], correct: 'Piano' },
      { question: 'What happened to Beethoven as he got older?', choices: ['He broke his hand', 'He lost his sight', 'He started losing his hearing'], correct: 'He started losing his hearing' },
      { question: 'How did Beethoven keep making music after he lost his hearing?', choices: ['He watched other people play', 'He imagined the notes in his mind', 'He stopped writing music'], correct: 'He imagined the notes in his mind' },
      { question: 'What did Beethoven prove with his music?', choices: ['That only young people can make music', 'That real music comes from the heart', 'That music must be loud to be great'], correct: 'That real music comes from the heart' },
    ],
  },
  {
    name: 'Marie Curie',
    questions: [
      { question: 'What did Marie Curie love to learn about?', choices: ['Science', 'Music', 'Art'], correct: 'Science' },
      { question: 'What did she study for many hours in her lab?', choices: ['Plants and animals', 'Stars and planets', 'Rocks and chemicals'], correct: 'Rocks and chemicals' },
      { question: 'What amazing thing did Marie notice one night?', choices: ['A bright star in the sky', 'A strange green glow from a rock', 'A new kind of flower'], correct: 'A strange green glow from a rock' },
      { question: 'What was the name of the new element she discovered?', choices: ['Radium', 'Helium', 'Iron'], correct: 'Radium' },
      { question: 'What made Marie Curie\'s discovery so important?', choices: ['It made jewelry shine brighter', 'It helped farmers grow food', 'It helped doctors treat sick people with radiation'], correct: 'It helped doctors treat sick people with radiation' },
      { question: 'What did Marie Curie show the world?', choices: ['That rocks are magical', 'That girls can shine just as bright as any scientist', 'That science is easy for everyone'], correct: 'That girls can shine just as bright as any scientist' },
    ],
  },
  {
    name: 'Mozart',
    questions: [
      { question: 'What did Mozart love more than anything as a little boy?', choices: ['Music', 'Drawing', 'Reading'], correct: 'Music' },
      { question: 'At what age could Mozart play the piano?', choices: ['Seven', 'Five', 'Ten'], correct: 'Five' },
      { question: 'What sound inspired Mozart one night?', choices: ['Rain falling', 'Birds singing', 'Waves crashing'], correct: 'Birds singing' },
      { question: 'What did Mozart do after hearing the birds?', choices: ['He went to sleep', 'He wrote a story about birds', 'He copied their tune on the piano'], correct: 'He copied their tune on the piano' },
      { question: 'What did Mozart\'s songs make people feel?', choices: ['Anger and confusion', 'Joy and happiness', 'Fear and sadness'], correct: 'Joy and happiness' },
    ],
  },
  {
    name: 'Leonardo da Vinci',
    questions: [
      { question: 'What was Leonardo da Vinci known for?', choices: ['Being a sailor', 'Being an artist and inventor', 'Being a king'], correct: 'Being an artist and inventor' },
      { question: 'What did Leonardo love to do?', choices: ['Play music', 'Imagine and study everything he saw', 'Build castles'], correct: 'Imagine and study everything he saw' },
      { question: 'What did Leonardo wonder when he saw birds flying?', choices: ['What if people could fly too?', 'How do birds sing?', 'Where are the birds going?'], correct: 'What if people could fly too?' },
      { question: 'What did Leonardo draw after watching the birds?', choices: ['Wings and flying machines', 'Castles and kings', 'Animals and trees'], correct: 'Wings and flying machines' },
      { question: 'What message does Leonardo\'s story teach us?', choices: ['Flying is impossible for people', 'Only birds can dream of the sky', 'Great dreams can start with a simple question'], correct: 'Great dreams can start with a simple question' },
    ],
  },
  {
    name: 'Mark Twain',
    questions: [
      { question: 'Where did Mark Twain grow up?', choices: ['In the mountains', 'Near a big river', 'By the sea'], correct: 'Near a big river' },
      { question: 'What did young Twain love to do by the river?', choices: ['Go fishing every day', 'Swim with his friends', 'Watch boats and listen to sailors\' stories'], correct: 'Watch boats and listen to sailors\' stories' },
      { question: 'What did Twain do when he grew up?', choices: ['He became a sailor', 'He painted pictures of rivers', 'He wrote books about adventures'], correct: 'He wrote books about adventures' },
      { question: 'Who was the clever boy in Twain\'s most famous story?', choices: ['Tom Sawyer', 'Huckleberry Finn', 'Harry Potter'], correct: 'Tom Sawyer' },
      { question: 'What did Twain say about kindness?', choices: ['It is hard to learn', 'It is only for friends', 'It is a language everyone understands'], correct: 'It is a language everyone understands' },
    ],
  },
  {
    name: 'James Maxwell',
    questions: [
      { question: 'Where was James Clerk Maxwell from?', choices: ['Scotland', 'England', 'Ireland'], correct: 'Scotland' },
      { question: 'What did Maxwell love as a boy?', choices: ['Playing sports', 'Cooking new recipes', 'Drawing patterns and asking "why"'], correct: 'Drawing patterns and asking "why"' },
      { question: 'What great discovery did Maxwell make?', choices: ['That the Earth moves around the Sun', 'That light, electricity, and magnetism are connected', 'That sound travels through air'], correct: 'That light, electricity, and magnetism are connected' },
      { question: 'What inventions were made later because of his ideas?', choices: ['Radios, TVs, and Wi-Fi', 'Cars and airplanes', 'Telephones and cameras'], correct: 'Radios, TVs, and Wi-Fi' },
      { question: 'What else did Maxwell love besides science?', choices: ['Sports and painting', 'Cooking and travel', 'Poetry and kindness'], correct: 'Poetry and kindness' },
    ],
  },
  {
    name: 'Leo Tolstoy',
    questions: [
      { question: 'Where was Leo Tolstoy from?', choices: ['Russia', 'France', 'Italy'], correct: 'Russia' },
      { question: 'What did Tolstoy love most?', choices: ['Parties and luxury', 'Sports and travel', 'Nature and simple living'], correct: 'Nature and simple living' },
      { question: 'What kind of books did Tolstoy write?', choices: ['Books about animals', 'Stories about real people and their feelings', 'Books about science experiments'], correct: 'Stories about real people and their feelings' },
      { question: 'What did Tolstoy believe brings true happiness?', choices: ['Kindness, not money', 'Winning and fame', 'Owning many things'], correct: 'Kindness, not money' },
      { question: 'How did Tolstoy show his simple way of living?', choices: ['He traveled the world', 'He built a big palace', 'He wore simple clothes and worked in his garden'], correct: 'He wore simple clothes and worked in his garden' },
    ],
  },
  {
    name: 'Galileo',
    questions: [
      { question: 'What did Galileo love to look at?', choices: ['The ocean', 'The sky', 'The forest'], correct: 'The sky' },
      { question: 'What tool did Galileo build to see the moon and stars?', choices: ['A telescope', 'A microscope', 'A compass'], correct: 'A telescope' },
      { question: 'What did Galileo see when he looked through his telescope?', choices: ['Only clouds', 'Flying birds', 'Craters and tiny stars no one had seen before'], correct: 'Craters and tiny stars no one had seen before' },
      { question: 'What did most people believe about the Earth back then?', choices: ['That it moved around the sun', 'That it was the center of everything', 'That it was flat'], correct: 'That it was the center of everything' },
      { question: 'What did Galileo say about the Earth?', choices: ['The Earth moves around the sun', 'The Earth never moves', 'The Earth is the center of the stars'], correct: 'The Earth moves around the sun' },
      { question: 'Why do we call Galileo the father of modern science?', choices: ['He discovered electricity', 'He invented airplanes', 'He helped us understand the stars'], correct: 'He helped us understand the stars' },
    ],
  }
];
// Add this helper function at the bottom or top of your script
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- UPDATE THIS FUNCTION ---
const displayDetails = function (curStory) {
  const curObject = curStory.questions.at(currentQuestion);
  
  // Set Question Text
  // Note: We use innerHTML to ensure the structure stays correct
  questionContainer.innerHTML = `
      <div style="margin-bottom:20px;">${curObject.question}</div>
      <div class="answers--container"></div>
  `;
  
  const container = document.querySelector('.answers--container');
  
  // 1. Randomize the choices for this session
  // We use [...array] to create a copy so we don't mess up the original order permanently
  const shuffledChoices = shuffleArray([...curObject.choices]);

  // 2. Render them
  shuffledChoices.forEach((answer) => {
    const markup = `<div class="answer shadowing">${answer}</div>`;
    container.insertAdjacentHTML('beforeend', markup);
  });
};
// --- STATE ---
let activeStories = []; // This will hold the 3 random stories
let currentStory = 0;
let currentQuestion = 0;
let score = 0;
let totalTrials = 0;
let totalMisses = 0;

// --- GLOBAL ELEMENTS (Filled on Load) ---
let aboutSection, listeningSection, questionsSection;
let characterImage, audioSrc, questionContainer;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Security Check
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
        return;
    }

    // 2. Select 3 Random Stories
    activeStories = selectRandomStories();

    // 3. Select Elements
    aboutSection = document.querySelector('.about');
    listeningSection = document.querySelector('.listening');
    questionsSection = document.querySelector('.questions');
    characterImage = document.querySelector('.character--image');
    audioSrc = document.querySelector('.audio--source');
    questionContainer = document.querySelector('.question--container');

    const nextAboutBtn = document.querySelector('.btn--next--aboutSection');
    const nextListeningBtn = document.querySelector('.btn--questions');

    // 4. Attach Listeners
    if (nextAboutBtn) {
        nextAboutBtn.addEventListener('click', () => {
            // Transition: About -> Listening
            removeAndAddClasses(aboutSection, listeningSection);
            displayStoryDetails(activeStories[currentStory].name);
        });
    }

    if (nextListeningBtn) {
        nextListeningBtn.addEventListener('click', () => {
            // Transition: Listening -> Questions
            removeAndAddClasses(listeningSection, questionsSection);
            displayDetails(activeStories[currentStory]);
        });
    }

    if (questionsSection) {
        questionsSection.addEventListener('click', function (e) {
            if (e.target.classList.contains('answer')) {
                // Prevent multiple clicks on same question
                if (e.target.classList.contains('correct--answer') || e.target.classList.contains('wrong--answer')) return;
                checkValue(e.target, e.target.textContent);
            }
        });
    }
});

function goToMenu() { window.location.href = '../menu.html'; }

// --- HELPERS ---

// New function to shuffle and pick 3 stories
function selectRandomStories() {
    const shuffled = [...allStoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, MAX_STORIES_PER_SESSION);
}

const removeAndAddClasses = function (firstClass, secondClass) {
    if(!firstClass || !secondClass) return;
    firstClass.classList.add('hidden');
    setTimeout(() => {
        firstClass.classList.add('remove');
        secondClass.classList.remove('remove');
        setTimeout(() => secondClass.classList.remove('hidden'), 50);
    }, 550);
};

const displayStoryDetails = function (curStoryName) {
    // Ensure you have images and audio for ALL stories in the folder
    characterImage.src = `image/${curStoryName}.png`;
    audioSrc.src = `audio/${curStoryName}.mp3`;
    const audio = audioSrc.parentElement;
    if(audio) {
        audio.load();
        // Play with error handling
        audio.play().catch(e => console.log("Audio play failed (user interaction needed)."));
    }
};



const checkNewStory = function () {
    const currentStoryQuestions = activeStories[currentStory].questions.length;

    if (currentQuestion < currentStoryQuestions) return;

    // Story Finished
    if (currentQuestion === currentStoryQuestions) {
        currentQuestion = 0;
        currentStory++;

        // All 3 Stories Finished?
        if (currentStory >= activeStories.length) {
            setTimeout(() => endGame(), 1000);
            return;
        }

        // Move to next story listening phase
        removeAndAddClasses(questionsSection, listeningSection);
        setTimeout(() => {
            displayStoryDetails(activeStories[currentStory].name);
        }, 550);
    }
};

const checkValue = function (element, value) {
    totalTrials++;

    if (value === activeStories[currentStory].questions[currentQuestion].correct) {
        score++;
        element.classList.add('correct--answer');
    } else {
        totalMisses++;
        element.classList.add('wrong--answer');
    }

    currentQuestion++;

    setTimeout(() => {
        checkNewStory();
    }, 500);

    setTimeout(() => {
        // Display next question if story continues
        if (currentStory < activeStories.length && currentQuestion < activeStories[currentStory].questions.length) {
            displayDetails(activeStories[currentStory]);
        }
    }, 1000);
};

async function endGame() {
    // Calculate Score based on ACTIVE stories only
    const totalQuestions = activeStories.reduce((sum, story) => sum + story.questions.length, 0);
    const accuracy = Math.round((score / totalQuestions) * 100);

    showFinalResults(accuracy, score, totalQuestions);

    await sessionMgr.submitScore(GAME_ID, accuracy, totalTrials, totalMisses);
}

const showFinalResults = function (accuracy, finalScore, totalQs) {
    const resultsModalHTML = `
        <div class="results-modal-overlay">
            <div class="results-modal">
                <div class="results-header"><h2>🎉 Game Complete! 🎉</h2></div>
                <div class="results-content">
                    <div class="result-card primary-score">
                        <div class="result-icon">⭐</div>
                        <div class="result-value">${accuracy} / 100</div>
                        <div class="result-label">Final Score</div>
                    </div>
                    <div class="results-grid">
                        <div class="result-card">
                            <div class="result-icon">✅</div>
                            <div class="result-value">${finalScore} / ${totalQs}</div>
                            <div class="result-label">Correct Answers</div>
                        </div>
                    </div>
                    <p style="color:#fff; text-align:center; font-weight:bold;">✅ Saved to Dashboard</p>
                    <div class="results-actions">
                        <button class="btn-play-again" onclick="goToMenu()">Back to Menu</button>
                    </div>
                </div>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML('beforeend', resultsModalHTML);
};