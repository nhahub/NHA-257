// --- CONFIG ---
const GAME_ID = 11; // Instrument Recognition
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
const answersList = document.querySelector('.answers'); // Select the UL container
const scoreValueEl = document.querySelector('.score-value');
const finalScoreModal = document.querySelector('.final-score-modal');
const modalClose = document.querySelector('.modal-close');

// --- STATE ---
let currentInstrumentIndex = 0;
let score = 0;
let acceptingAnswers = true;
let mainSoundPlayed = false;
let totalTrials = 0;
let totalMisses = 0;
let currentActiveAudio = null;

// --- DATA ---
const instrumentData = [
  {
    name: 'Piano', image: './image/pexels-photo-1246437.jpeg', mainSound: './audio/piano.mp3',
    alternatives: [ { name: 'Piano', sound: './audio/piano.mp3' }, { name: 'Keyboard', sound: './audio/keyboard.mp3' }, { name: 'Organ', sound: './audio/organ.mp3' }, { name: 'Harpsichord', sound: './audio/harpsichord.mp3' } ]
  },
  {
    name: 'Guitar', image: './image/pexels-photo-1407322.jpeg', mainSound: './audio/guitar.mp3',
    alternatives: [ { name: 'Ukulele', sound: './audio/ukulele.mp3' }, { name: 'Banjo', sound: './audio/banjo.mp3' }, { name: 'Mandolin', sound: './audio/mandolin.mp3' }, { name: 'Guitar', sound: './audio/guitar.mp3' } ]
  },
  {
    name: 'Drum', image: './image/pexels-photo-542553.jpeg', mainSound: './audio/drums.mp3',
    alternatives: [ { name: 'Drum', sound: './audio/drums.mp3' }, { name: 'Conga', sound: './audio/conga.mp3' }, { name: 'Bongo', sound: './audio/bongo.mp3' }, { name: 'Cajón', sound: './audio/cajon.mp3' } ]
  },
  {
    name: 'Violin', image: './image/pexels-photo-111287.jpeg', mainSound: './audio/villion.mp3',
    alternatives: [ { name: 'Viola', sound: './audio/viola.mp3' }, { name: 'Violin', sound: './audio/villion.mp3' }, { name: 'Cello', sound: './audio/cello.mp3' }, { name: 'Fiddle', sound: './audio/fiddle.mp3' } ]
  },
  {
    name: 'Flute', image: './image/pexels-photo-2254140.jpeg', mainSound: './audio/flute.mp3',
    alternatives: [ { name: 'Pan Flute', sound: './audio/pan flute.mp3' }, { name: 'Piccolo', sound: './audio/piccolo.mp3' }, { name: 'Flute', sound: './audio/flute.mp3' }, { name: 'Whistle', sound: './audio/whistle.mp3' } ]
  },
  {
    name: 'Trumpet', image: './image/pexels-photo-2221318.jpeg', mainSound: './audio/trumpet.mp3',
    alternatives: [ { name: 'Cornet', sound: './audio/cornet.mp3' }, { name: 'Trombone', sound: './audio/trombone.mp3' }, { name: 'Trumpet', sound: './audio/trumpet.mp3' }, { name: 'French Horn', sound: './audio/french horn.mp3' } ]
  },
  {
    name: 'Xylophone', image: './image/pexels-photo-165972.jpeg', mainSound: './audio/xylophone.mp3',
    alternatives: [ { name: 'Glockenspiel', sound: './audio/Glockenspiel.mp3' }, { name: 'Marimba', sound: './audio/marimba.mp3' }, { name: 'Xylophone', sound: './audio/xylophone.mp3' }, { name: 'Vibraphone', sound: './audio/vibraphone.mp3' } ]
  },
  {
    name: 'Tambourine', image: './image/pexels-photo-15189503.jpeg', mainSound: './audio/tambourine.mp3',
    alternatives: [ { name: 'Tambourine', sound: './audio/tambourine.mp3' }, { name: 'Maracas', sound: './audio/maracas.mp3' }, { name: 'Castanets', sound: './audio/castanets.mp3' }, { name: 'Shaker', sound: './audio/shaker.mp3' } ]
  },
  {
    name: 'Harp', image: './image/pexels-photo-20523211.jpeg', mainSound: './audio/harp.mp3',
    alternatives: [ { name: 'Lyre', sound: './audio/lyre.mp3' }, { name: 'Zither', sound: './audio/zither.mp3' }, { name: 'Guitar', sound: './audio/guitar.mp3' }, { name: 'Harp', sound: './audio/harp.mp3' } ]
  },
  {
    name: 'Saxophone', image: './image/pexels-photo-1049690.jpeg', mainSound: './audio/saxophone.mp3',
    alternatives: [ { name: 'Clarinet', sound: './audio/clarinet.mp3' }, { name: 'Oboe', sound: './audio/oboe.mp3' }, { name: 'Saxophone', sound: './audio/saxophone.mp3' }, { name: 'Bassoon', sound: './audio/bassoon.mp3' } ]
  }
];

// --- LOGIC ---

// Shuffle Function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function stopAllSounds() {
    // 1. Stop Main Audio Tag
    if(mainAudio) {
        mainAudio.pause();
        mainAudio.currentTime = 0;
    }
    // 2. Stop Dynamic Audio (Choices)
    if(currentActiveAudio) {
        currentActiveAudio.pause();
        currentActiveAudio.currentTime = 0;
        currentActiveAudio = null;
    }
}

function displayInstrument(index) {
    // Clear audio when changing slide
    stopAllSounds();

    if (index >= instrumentData.length) {
        showFinalScore();
        return;
    }

    const instrument = instrumentData[index];
    imgEl.src = instrument.image;
    instrumentName.textContent = instrument.name;

    // Reset Main Button
    btnPlaySound.classList.remove('hidden', 'remove');
    btnPlaySound.style.pointerEvents = 'auto';
    mainSoundPlayed = false;

    // Set Main Audio Source
    if (mainAudio) {
        mainAudio.src = instrument.mainSound;
        mainAudio.load();
    }

    btnNXT.style.display = 'none';

    // Create Buttons
    answersList.innerHTML = '';
    const allAlternatives = shuffleArray([...instrument.alternatives]);

    allAlternatives.forEach(alt => {
        const li = document.createElement('li');
        li.className = 'answer';
        li.innerHTML = `
            <span class="answer-text">Listen and Choose</span>
            <button class="btn btn-play-choice">Play</button>
        `;

        li.dataset.instrumentName = alt.name;

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
    stopAllSounds(); // Stop other sounds first!
    const audio = new Audio(src);
    currentActiveAudio = audio; // Track this sound
    audio.play().catch(() => console.log("Audio play blocked"));
}

function playMainSound() {
    stopAllSounds(); // Stop choice sounds first!
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

    // Stop audio immediately when answer is chosen
    stopAllSounds();

    const currentInstrument = instrumentData[currentInstrumentIndex];
    const isCorrect = selectedName === currentInstrument.name;

    if (isCorrect) {
        element.classList.add('correct--answer');
        if (score < instrumentData.length) { 
            score++; 
            updateDisplayedScore(); 
        }
    } else {
        totalMisses++;
        element.classList.add('wrong--answer');
        const allAnswers = document.querySelectorAll('.answer');
        allAnswers.forEach(a => {
            if(a.dataset.instrumentName === currentInstrument.name) {
                a.classList.add('correct--answer');
            }
        });
    }

    document.querySelectorAll('.btn-play-choice').forEach(b => b.classList.add('hidden'));

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
    const total = instrumentData.length || 1;
    return Math.round((rawCorrect / total) * 100);
}

function updateDisplayedScore() {
    if (!scoreValueEl) return;
    scoreValueEl.textContent = calcScaledScore(score);
}

async function showFinalScore() {
    instrumentDisplay.classList.add('hidden');
    setTimeout(() => instrumentDisplay.classList.add('remove'), 500);

    const scaledScore = calcScaledScore(score);
    document.querySelector('.total-score-value').textContent = scaledScore;
    finalScoreModal.classList.remove('hidden', 'remove');

    // Submit to Backend
    await sessionMgr.submitScore(GAME_ID, scaledScore, totalTrials, totalMisses);
}
