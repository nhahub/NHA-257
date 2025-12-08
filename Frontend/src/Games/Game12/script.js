// --- CONFIG ---
const GAME_ID = 12; // Animal Recognition
const sessionMgr = new SessionManager('https://localhost:7101/api');

// Security Check
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
        return;
    }
    
    // Attach Global Listeners
    if(btnAbout) btnAbout.addEventListener('click', startTransition);
    if(btnNXT) btnNXT.addEventListener('click', nextQuestion);
    if(btnPlaySound) btnPlaySound.addEventListener('click', playMainSound);
});

function goToMenu() { window.location.href = '../menu.html'; }

// --- DOM ELEMENTS ---
const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const btnNXT = document.querySelector('.btn--next');
const imgEl = document.querySelector('.instrument--img');
const instrumentDisplay = document.querySelector('.instrument-display');
const instrumentName = document.querySelector('.instrument-name');
const btnPlaySound = document.querySelector('.btn-play-sound');
const mainAudio = document.querySelector('#main-audio');
const answersList = document.querySelector('.answers');
const scoreValueEl = document.querySelector('.score-value');
const finalScoreModal = document.querySelector('.final-score-modal');

// --- STATE ---
let currentInstrumentIndex = 0;
let score = 0;
let acceptingAnswers = true;
let mainSoundPlayed = false;
let totalTrials = 0;
let totalMisses = 0;
let currentActiveAudio = null;

// --- DATA (15 Animals) ---
const animalData = [
  {
    name: 'Dog', image: './image/pexels-photo-2253275.jpeg', mainSound: './audio/dog.mp3',
    alternatives: [ { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Bear', sound: './audio/bear.mp3' }, { name: 'Dog', sound: './audio/dog.mp3' }, { name: 'Wolf', sound: './audio/wolf.mp3' } ]
  },
  {
    name: 'Cat', image: './image/kitty-cat-kitten-pet-45201.jpeg', mainSound: './audio/cat.mp3',
    alternatives: [ { name: 'Cheetah', sound: './audio/cheetah.mp3' }, { name: 'Panther', sound: './audio/panther.mp3' }, { name: 'Cat', sound: './audio/cat.mp3' }, { name: 'Raccoon', sound: './audio/raccoon.mp3' } ]
  },
  {
    name: 'Cow', image: './image/pexels-photo-2647053.jpeg', mainSound: './audio/cow.mp3',
    alternatives: [ { name: 'Moose', sound: './audio/moose.mp3' }, { name: 'Camel', sound: './audio/camel.mp3' }, { name: 'Cow', sound: './audio/cow.mp3' }, { name: 'Bison', sound: './audio/bison.mp3' } ]
  },
  {
    name: 'Sheep', image: './image/pexels-photo-977239.jpeg', mainSound: './audio/sheep.mp3',
    alternatives: [ { name: 'Goat', sound: './audio/goat.mp3' }, { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Lamb', sound: './audio/lamb.mp3' }, { name: 'Sheep', sound: './audio/sheep.mp3' } ]
  },
  {
    name: 'Horse', image: './image/pexels-photo-1996333.jpeg', mainSound: './audio/horse.mp3',
    alternatives: [ { name: 'Donkey', sound: './audio/donkey.mp3' }, { name: 'Zebra', sound: './audio/zebra.mp3' }, { name: 'Horse', sound: './audio/horse.mp3' }, { name: 'Moose', sound: './audio/moose.mp3' } ]
  },
  {
    name: 'Rooster', image: './image/pexels-photo-3820303.jpeg', mainSound: './audio/rooster.mp3',
    alternatives: [ { name: 'Peacock', sound: './audio/peacock.mp3' }, { name: 'Howler Monkey', sound: './audio/howler_monkey.mp3' }, { name: 'Rooster', sound: './audio/rooster.mp3' }, { name: 'Turkey', sound: './audio/turkey.mp3' } ]
  },
  {
    name: 'Duck', image: './image/pexels-photo-833687.jpeg', mainSound: './audio/duck.mp3',
    alternatives: [ { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Goose', sound: './audio/goose.mp3' }, { name: 'Duck', sound: './audio/duck.mp3' }, { name: 'Penguin', sound: './audio/penguin.mp3' } ]
  },
  {
    name: 'Goose', image: './image/gans.jpg', mainSound: './audio/goose.mp3',
    alternatives: [ { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Goose', sound: './audio/goose.mp3' }, { name: 'Duck', sound: './audio/duck.mp3' }, { name: 'Penguin', sound: './audio/penguin.mp3' } ]
  },
  {
    name: 'Elephant', image: './image/pexels-photo-667205.jpeg', mainSound: './audio/elephant.mp3',
    alternatives: [ { name: 'Whale', sound: './audio/whale.mp3' }, { name: 'Rhino', sound: './audio/rhino.mp3' }, { name: 'Elephant', sound: './audio/elephant.mp3' }, { name: 'Camel', sound: './audio/camel.mp3' } ]
  },
  {
    name: 'Moose', image: './image/moose-bull-elk-yawns-39645.jpeg', mainSound: './audio/moose.mp3',
    alternatives: [ { name: 'Donkey', sound: './audio/donkey.mp3' }, { name: 'Moose', sound: './audio/moose.mp3' }, { name: 'Zebra', sound: './audio/zebra.mp3' }, { name: 'Horse', sound: './audio/horse.mp3' } ]
  },
  {
    name: 'Parrot', image: './image/pexels-photo-2317904.jpeg', mainSound: './audio/parrot.mp3',
    alternatives: [ { name: 'Crow', sound: './audio/crow.mp3' }, { name: 'Myna', sound: './audio/myna.mp3' }, { name: 'Parrot', sound: './audio/parrot.mp3' }, { name: 'Seagull', sound: './audio/seagull.mp3' } ]
  },
  {
    name: 'Sea Lion', image: './image/pexels-photo-25956354.jpeg', mainSound: './audio/sea_lion.mp3',
    alternatives: [ { name: 'Whale', sound: './audio/whale.mp3' }, { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Dolphin', sound: './audio/dolphin.mp3' }, { name: 'Sea Lion', sound: './audio/sea_lion.mp3' } ]
  },
  {
    name: 'Dolphin', image: './image/dolphin-marine-mammals-water-sea-64219.jpeg', mainSound: './audio/dolphin.mp3',
    alternatives: [ { name: 'Whale', sound: './audio/whale.mp3' }, { name: 'Seal', sound: './audio/seal.mp3' }, { name: 'Dolphin', sound: './audio/dolphin.mp3' }, { name: 'Sea Lion', sound: './audio/sea_lion.mp3' } ]
  },
  {
    name: 'Hippopotamus', image: './image/pexels-photo-667201.jpeg', mainSound: './audio/hippopotamus.mp3',
    alternatives: [ { name: 'Rhino', sound: './audio/rhino.mp3' }, { name: 'Bison', sound: './audio/bison.mp3' }, { name: 'Hippopotamus', sound: './audio/hippopotamus.mp3' }, { name: 'Elephant', sound: './audio/elephant.mp3' } ]
  },
  {
    name: 'Bear', image: './image/OIP.jpeg', mainSound: './audio/bear.mp3',
    alternatives: [ { name: 'Gorilla', sound: './audio/gorilla.mp3' }, { name: 'Boar', sound: './audio/boar.mp3' }, { name: 'Bear', sound: './audio/bear.mp3' }, { name: 'Bison', sound: './audio/bison.mp3' } ]
  }
];

// --- LOGIC ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function stopAllSounds() {
    if(mainAudio) {
        mainAudio.pause();
        mainAudio.currentTime = 0;
    }
    if(currentActiveAudio) {
        currentActiveAudio.pause();
        currentActiveAudio.currentTime = 0;
        currentActiveAudio = null;
    }
}

function displayInstrument(index) {
    stopAllSounds();

    if (index >= animalData.length) {
        showFinalScore();
        return;
    }

    const animal = animalData[index];
    imgEl.src = animal.image;
    instrumentName.textContent = animal.name;

    // Reset Play Button
    btnPlaySound.classList.remove('hidden', 'remove');
    btnPlaySound.style.pointerEvents = 'auto';
    mainSoundPlayed = false;

    if (mainAudio) {
        mainAudio.src = animal.mainSound;
        mainAudio.load();
    }

    btnNXT.style.display = 'none';

    // --- DYNAMICALLY CREATE BUTTONS ---
    answersList.innerHTML = '';
    const allAlternatives = shuffleArray([...animal.alternatives]);

    allAlternatives.forEach(alt => {
        const li = document.createElement('li');
        li.className = 'answer';
        li.innerHTML = `
            <span class="answer-text">Listen and Choose</span>
            <button class="btn btn-play-choice">Play</button>
        `;

        li.dataset.animalName = alt.name;

        // Play Logic
        const playBtn = li.querySelector('.btn-play-choice');
        playBtn.onclick = (e) => {
            e.stopPropagation();
            playEffect(alt.sound);
            playBtn.classList.add('hidden');
        };

        // Answer Logic
        li.onclick = (e) => {
            if(e.target === playBtn) return;
            checkAnswer(li, alt.name);
        };

        answersList.appendChild(li);
    });

    acceptingAnswers = true;
    updateDisplayedScore();
}

function playEffect(src) {
    stopAllSounds();
    const audio = new Audio(src);
    currentActiveAudio = audio;
    audio.play().catch(() => console.log("Audio play blocked"));
}

function playMainSound() {
    stopAllSounds();
    if (!mainSoundPlayed) {
        mainAudio.play().catch(() => {});
        mainSoundPlayed = true;
        btnPlaySound.classList.add('hidden');
        btnPlaySound.style.pointerEvents = 'none';
    }
}

function checkAnswer(element, selectedName) {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    totalTrials++;
    stopAllSounds();

    const currentAnimal = animalData[currentInstrumentIndex];
    const isCorrect = selectedName === currentAnimal.name;

    if (isCorrect) {
        element.classList.add('correct--answer');
        score++;
        updateDisplayedScore();
    } else {
        totalMisses++;
        element.classList.add('wrong--answer');
        // Highlight correct one
        const allAnswers = document.querySelectorAll('.answer');
        allAnswers.forEach(a => {
            if(a.dataset.animalName === currentAnimal.name) {
                a.classList.add('correct--answer');
            }
        });
    }

    // Hide play buttons
    document.querySelectorAll('.btn-play-choice').forEach(b => b.classList.add('hidden'));

    // Auto-advance
    setTimeout(() => {
        currentInstrumentIndex++;
        displayInstrument(currentInstrumentIndex);
    }, 1500);
}

function startTransition() {
    aboutSec.classList.add('hidden');
    setTimeout(() => {
        aboutSec.classList.add('remove');
        instrumentDisplay.classList.remove('remove');
        displayInstrument(currentInstrumentIndex);
        setTimeout(() => instrumentDisplay.classList.remove('hidden'), 50);
    }, 500);
}

function nextQuestion() {
    currentInstrumentIndex++;
    displayInstrument(currentInstrumentIndex);
}

function calcScaledScore(rawCorrect) {
    // Total is exactly 15
    const total = animalData.length; 
    return Math.round((rawCorrect / total) * 100);
}

function updateDisplayedScore() {
    if (!scoreValueEl) return;
    // Show scaled score / 100
    scoreValueEl.textContent = calcScaledScore(score);
}

async function showFinalScore() {
    instrumentDisplay.classList.add('hidden');
    setTimeout(() => instrumentDisplay.classList.add('remove'), 500);

    // Calculate final percentage
    const scaledScore = calcScaledScore(score);
    
    document.querySelector('.total-score-value').textContent = scaledScore;
    
    finalScoreModal.classList.remove('hidden', 'remove');
    finalScoreModal.style.display = 'flex'; 

    // Submit to Backend
    console.log(`Submitting: Score=${scaledScore}, Trials=${totalTrials}, Misses=${totalMisses}`);
    await sessionMgr.submitScore(GAME_ID, scaledScore, totalTrials, totalMisses);
}