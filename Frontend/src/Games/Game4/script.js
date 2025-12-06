// --- CONFIG ---
const GAME_ID = 6; 
const sessionMgr = new SessionManager('https://localhost:7101/api');

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
    }
});

function goToMenu() { window.location.href = '../menu.html'; }

// --- DOM ELEMENTS ---
const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const storySec = document.querySelector('.story');
const questionSec = document.querySelector('.questions--container');
const imgEl = document.querySelector('.story--img');
const textEl = document.querySelector('.story--part');
const btnNextSlide = document.querySelector('.btn--next');
const questionEl = document.querySelector('.question');
const answersList = document.querySelector('.answers');
const scoreEl = document.querySelector('.score-value');
const modal = document.querySelector('.scores-modal');
const modalClose = document.querySelector('.modal-close');

// --- DATA: CORRECT ORDER ---
// Order: Lina -> Prince Arion -> Omar

const stories = [
    // 1. LINA (Park)
    {
        parts: [
            { text: 'Lina went to the park on a windy afternoon with her younger brother, Youssef.', image: './images/story1/1.png' },
            { text: 'She carried a yellow kite and a small picnic basket.', image: './images/story1/2.png' },
            { text: 'While flying the kite, the string snapped.', image: './images/story1/3.png' },
            { text: 'It landed beside an old man reading a newspaper.', image: './images/story1/4.png' },
            { text: 'As they were leaving, Lina noticed a squirrel climbing the tree.', image: './images/story1/5.png' },
            { text: 'The END. Questions time', image: './images/story1/the END.png' }
        ],
        questions: [
            { question: 'Who went to the park with Lina?', options: ['Her friend Mariam', 'Her brother Youssef', 'Her cousin Karim', 'Her mother'], correct: 'Her brother Youssef' },
            { question: 'What color was Lina’s kite?', options: ['Red', 'Yellow', 'Blue', 'Green'], correct: 'Yellow' },
            { question: 'What did Lina carry besides the kite?', options: ['A picnic basket', 'A football', 'A book', 'A painting set'], correct: 'A picnic basket' },
            { question: 'What kind of sandwiches did they eat?', options: ['Tuna and lettuce', 'Cheese and tomatoes', 'Chicken and mayo', 'Egg and cucumber'], correct: 'Cheese and tomatoes' },
            { question: 'Where did the kite land?', options: ['On a tree', 'Beside an old man', 'In the pond', 'Near the playground'], correct: 'Beside an old man' },
            { question: 'What was the old man doing?', options: ['Feeding pigeons', 'Reading a newspaper', 'Playing chess', 'Listening to music'], correct: 'Reading a newspaper' }
        ]
    },
    // 2. PRINCE ARION (Dark Forest) - Previously swapped
    {
        parts: [
            { text: 'Prince Arion rode through the dark forest of Eldria.', image: './images/story2/1.png' },
            { text: 'The Shadow Beast guarded the crystal tower.', image: './images/story2/Gemini_Generated_Image_p0jmezp0jmezp0jm.png' },
            { text: 'Armed with a golden spear and blue shield, he crossed the bridge.', image: './images/story2/2.png' },
            { text: 'The Beast appeared — a giant creature with red eyes.', image: './images/story2/3.png' },
            { text: 'Arion struck the beast, and it fell into the river.', image: './images/story2/4.png' },
            { text: 'He freed Princess Elara and gave her a white rose.', image: './images/story2/5.png' },
            { text: 'The END. Questions time', image: './images/story2/the END.png' }
        ],
        questions: [
            { question: 'What was the name of the prince?', options: ['Prince Arion', 'Prince Eldric', 'Prince Lorian', 'Prince Kael'], correct: 'Prince Arion' },
            { question: 'Where did the story take place?', options: ['The desert of Orin', 'The dark forest of Eldria', 'The frozen mountains of Drakar', 'The golden castle of Solen'], correct: 'The dark forest of Eldria' },
            { question: 'What color was the prince\'s armor?', options: ['Gold', 'Silver', 'Black', 'Bronze'], correct: 'Silver' },
            { question: 'What weapon did Arion carry?', options: ['A silver sword', 'A golden spear', 'A steel axe', 'An iron dagger'], correct: 'A golden spear' },
            { question: 'What color was the prince\'s shield?', options: ['Red', 'Blue', 'Green', 'White'], correct: 'Blue' },
            { question: 'What did the Beast guard?', options: ['A crystal tower', 'A magic cave', 'A hidden crown', 'A golden gate'], correct: 'A crystal tower' }
        ]
    },
    // 3. OMAR (Puppy)
    {
        parts: [
            { text: 'One sunny morning, Omar left his house carrying a blue backpack.', image: './images/story3/1.png' },
            { text: 'On his way to school, he stopped to buy water and apples.', image: './images/story3/2.png' },
            { text: 'Outside, he saw a lost puppy sitting near a red bicycle.', image: './images/story3/3.png' },
            { text: 'A woman in a green jacket ran toward him calling "Bingo!"', image: './images/story3/missing bingo.png' },
            { text: 'She thanked Omar and gave him a star keychain.', image: './images/story3/4.png' },
            { text: 'Smiling, Omar continued walking to school.', image: './images/story3/5.png' },
            { text: 'The END. Questions time', image: './images/story3/the END.png' }
        ],
        questions: [
            { question: 'What color was Omar\'s backpack?', options: ['Red', 'Blue', 'Green', 'Black'], correct: 'Blue' },
            { question: 'What items did Omar buy?', options: ['Water and apples', 'Sandwich', 'Juice', 'Cookies'], correct: 'Water and apples' },
            { question: 'What did Omar find outside?', options: ['A kitten', 'A puppy', 'A bird', 'A rabbit'], correct: 'A puppy' },
            { question: 'What was near the lost animal?', options: ['Blue car', 'Red bicycle', 'Green bench', 'Yellow skateboard'], correct: 'Red bicycle' },
            { question: 'What did Omar give to the puppy?', options: ['Bread', 'An apple', 'Biscuit', 'Water'], correct: 'An apple' },
            { question: 'What was the puppy\'s name?', options: ['Lucky', 'Spot', 'Bingo', 'Max'], correct: 'Bingo' }
        ]
    }
];

// --- STATE ---
let currentStoryIndex = 0;
let currentPartIndex = 0;
let currentQuestionIndex = 0;
let totalScore = 0;
let totalQuestionsPlayed = 0;
let acceptingAnswers = false;

// --- LOGIC ---
btnAbout.addEventListener('click', () => {
    aboutSec.classList.add('hidden');
    setTimeout(() => {
        aboutSec.classList.add('remove');
        storySec.classList.remove('remove');
        storySec.classList.remove('hidden');
        loadStorySlide(0, 0);
    }, 500);
});

btnNextSlide.addEventListener('click', () => {
    const story = stories[currentStoryIndex];
    currentPartIndex++;

    if (currentPartIndex < story.parts.length) {
        loadStorySlide(currentStoryIndex, currentPartIndex);
    } else {
        // End of Story -> Switch to Quiz
        switchToQuiz();
    }
});

function loadStorySlide(storyIdx, partIdx) {
    const story = stories[storyIdx];
    const part = story.parts[partIdx];
    textEl.textContent = part.text;
    imgEl.src = part.image;
    imgEl.style.display = part.image ? "block" : "none";
}

function switchToQuiz() {
    storySec.classList.add('hidden');
    setTimeout(() => {
        storySec.classList.add('remove');
        questionSec.classList.remove('remove');
        setTimeout(() => questionSec.classList.remove('hidden'), 50);
        
        currentQuestionIndex = 0;
        loadQuestion();
    }, 500);
}

function loadQuestion() {
    const storyQuestions = stories[currentStoryIndex].questions;

    if (currentQuestionIndex >= storyQuestions.length) {
        finishQuizForStory();
        return;
    }

    const qData = storyQuestions[currentQuestionIndex];
    questionEl.textContent = qData.question;
    scoreEl.textContent = totalScore;
    acceptingAnswers = true;

    answersList.innerHTML = '';
    qData.options.forEach(opt => {
        const li = document.createElement('li');
        li.className = 'answer';
        li.textContent = opt;
        li.onclick = () => checkAnswer(li, opt, qData.correct);
        answersList.appendChild(li);
    });
}

function checkAnswer(el, selected, correct) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    totalQuestionsPlayed++;

    if (selected === correct) {
        el.classList.add('correct--answer');
        totalScore++;
        scoreEl.textContent = totalScore;
    } else {
        el.classList.add('wrong--answer');
        Array.from(answersList.children).forEach(child => {
            if (child.textContent === correct) child.classList.add('correct--answer');
        });
    }

    el.classList.add('answer--animation');
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function finishQuizForStory() {
    currentStoryIndex++;
    currentPartIndex = 0;

    if (currentStoryIndex < stories.length) {
        // Next Story
        questionSec.classList.add('hidden');
        setTimeout(() => {
            questionSec.classList.add('remove');
            storySec.classList.remove('remove');
            setTimeout(() => storySec.classList.remove('hidden'), 50);
            loadStorySlide(currentStoryIndex, 0);
        }, 500);
    } else {
        // All Done
        endGame();
    }
}

async function endGame() {
    questionSec.classList.add('hidden');
    setTimeout(() => questionSec.classList.add('remove'), 500);

    // Show Modal (Score out of 18)
    document.querySelector('.story1-score').textContent = totalScore;
    modal.classList.remove('hidden', 'remove');
    // CSS Fix for flex display
    modal.style.display = 'flex'; 

    // Submit (Convert to %)
    const totalQuestions = 18;
    const finalScorePercent = Math.round((totalScore / totalQuestions) * 100);
    const misses = totalQuestions - totalScore;
    
    await sessionMgr.submitScore(GAME_ID, finalScorePercent, totalQuestions, misses);
}

if(modalClose) {
    modalClose.addEventListener('click', () => modal.style.display = 'none');
}