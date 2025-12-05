// --- CONFIG ---
const GAME_ID = 6; // Story Chain
const sessionMgr = new SessionManager('https://localhost:7101/api');

// Security Check: Ensure session exists
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        // FIX: Go up one level only
        window.location.href = '../menu.html'; 
    }
});

function goToMenu() { 
    // FIX: Go up one level only
    window.location.href = '../menu.html'; 
}
// --- DOM ELEMENTS (Matching your original HTML) ---
const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const questionContainer = document.querySelector('.questions--container');
const answers = document.querySelectorAll('.answer');
const question = document.querySelector('.question');
const scoreValueEl = document.querySelector('.score-value');
const scoresModal = document.querySelector('.scores-modal');
const modalClose = document.querySelector('.modal-close');
const finalScoreEl = document.querySelector('.story1-score');

// --- GAME STATE ---
let curQuestion = 0;
let acceptingAnswers = true;
let score = 0;
let totalQuestionsAnswered = 0;

// --- QUESTIONS DATA ---
const parkAdventureQuestions = [
  { question: 'What did the old man give to Youssef?', options: ['A balloon', 'A candy', 'A coin', 'A flower'], correctAnswer: 'A candy' },
  { question: 'What color was the candy’s wrapper?', options: ['Red', 'Yellow', 'Blue', 'Green'], correctAnswer: 'Blue' },
  { question: 'What animal did Lina see as they were leaving the park?', options: ['A cat', 'A dog', 'A squirrel', 'A bird'], correctAnswer: 'A squirrel' },
  { question: 'What was the squirrel holding?', options: ['A nut', 'A leaf', 'A sandwich crust', 'A flower'], correctAnswer: 'A sandwich crust' },
  { question: 'What color was the dog owner’s jacket?', options: ['Blue', 'Red', 'Green', 'Yellow'], correctAnswer: 'Green' },
  { question: 'What did the woman give Omar?', options: ['A candy', 'A star keychain', 'A small toy', 'Money'], correctAnswer: 'A star keychain' },
  { question: 'Where was Omar going?', options: ['To the park', 'To school', 'To his friend\'s house', 'To the library'], correctAnswer: 'To school' },
  { question: 'How did Omar hold the keychain?', options: ['Loosely', 'Tightly', 'In his pocket', 'In his backpack'], correctAnswer: 'Tightly' },
  { question: 'What color were the Beast\'s eyes?', options: ['Green', 'Yellow', 'Red', 'Blue'], correctAnswer: 'Red' },
  { question: 'How many blows did Arion strike?', options: ['One', 'Two', 'Three', 'Four'], correctAnswer: 'Three' },
  { question: 'Where did the monster fall?', options: ['Into the forest', 'Into the river', 'Into the cave', 'Into the flames'], correctAnswer: 'Into the river' },
  { question: 'What did Arion give Princess Elara?', options: ['A golden crown', 'A white rose', 'A silver necklace', 'A red ribbon'], correctAnswer: 'A white rose' }
];

const currentQuestionSet = parkAdventureQuestions;
const TOTAL_QUESTIONS = parkAdventureQuestions.length;

// --- GAME LOGIC ---

// Start Game Transition (Original transition logic)
btnAbout.addEventListener('click', () => {
    aboutSec.classList.add('hidden');
    setTimeout(() => {
        aboutSec.classList.add('remove');
        questionContainer.classList.remove('remove');
        // Slight delay to allow remove to take effect before un-hiding
        setTimeout(() => questionContainer.classList.remove('hidden'), 50);
        loadQuestion(0);
    }, 500);
});

// Load Question
function loadQuestion(index) {
    // Check if game is over
    if (index >= TOTAL_QUESTIONS) {
        return endGame();
    }

    // Reset answer styles
    answers.forEach((a, i) => {
        a.classList.remove('correct--answer', 'wrong--answer', 'answer--animation');
        a.textContent = currentQuestionSet[index].options[i] || '';
    });

    question.textContent = currentQuestionSet[index].question;
    curQuestion = index;
    acceptingAnswers = true;
}

// Handle Answer Click
questionContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('answer')) return;
    if (!acceptingAnswers) return;
    
    acceptingAnswers = false; // Prevent double clicks
    const option = e.target;
    const correct = currentQuestionSet[curQuestion].correctAnswer;
    
    totalQuestionsAnswered++;

    if (option.textContent === correct) {
        option.classList.add('correct--answer');
        score++;
        scoreValueEl.textContent = score;
    } else {
        option.classList.add('wrong--answer');
        // Highlight the correct answer too
        answers.forEach(a => {
            if (a.textContent === correct) a.classList.add('correct--answer');
        });
    }

    option.classList.add('answer--animation');

    // Wait before moving to next question
    setTimeout(() => {
        loadQuestion(curQuestion + 1);
    }, 1000);
});

// --- GAME OVER & BACKEND SUBMISSION ---
async function endGame() {
    // 1. Hide Question Container
    questionContainer.classList.add('hidden');
    setTimeout(() => questionContainer.classList.add('remove'), 500);

    // 2. Update Modal UI
    if(finalScoreEl) finalScoreEl.textContent = score;

    // 3. Show Modal
    scoresModal.classList.remove('remove');
    setTimeout(() => scoresModal.classList.remove('hidden'), 100);

    // 4. --- BACKEND INTEGRATION HERE ---
    // Calculate stats for DB
    // Score: Let's convert raw score (e.g., 10/12) to a percentage out of 100 for consistency across games.
    const finalPercentageScore = Math.round((score / TOTAL_QUESTIONS) * 100);
    const misses = TOTAL_QUESTIONS - score;
    
    console.log(`Submitting: Score=${finalPercentageScore}, Trials=${totalQuestionsAnswered}, Misses=${misses}`);
    await sessionMgr.submitScore(GAME_ID, finalPercentageScore, totalQuestionsAnswered, misses);
}

// Close modal functionality
if(modalClose) {
    modalClose.addEventListener('click', () => {
        scoresModal.classList.add('hidden');
    });
}