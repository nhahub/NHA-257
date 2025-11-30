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
let score = 0; // raw correct answers (0..totalQuestions)
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
const instrumentData = [
  {
    name: 'Piano',
    image: 'https://images.pexels.com/photos/1246437/pexels-photo-1246437.jpeg',
    mainSound: './audio/piano.mp3',
    alternatives: [
      {
        name: 'Piano',
        sound: './audio/piano.mp3',
      },
      { name: 'Keyboard', sound: './audio/keyboard.mp3' },
      { name: 'Organ', sound: './audio/organ.mp3' },
      { name: 'Harpsichord', sound: './audio/harpsichord.mp3' },
    ],
  },
  {
    name: 'Guitar',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg',
    mainSound: './audio/guitar.mp3',
    alternatives: [
      { name: 'Ukulele', sound: './audio/ukulele.mp3' },
      { name: 'Banjo', sound: './audio/banjo.mp3' },
      { name: 'Mandolin', sound: './audio/mandolin.mp3' },
      { name: 'Guitar', sound: './audio/guitar.mp3' },
    ],
  },
  {
    name: 'Drum',
    image: 'https://images.pexels.com/photos/542553/pexels-photo-542553.jpeg',
    mainSound: './audio/drums.mp3',
    alternatives: [
      { name: 'Drum', sound: './audio/drums.mp3' },
      { name: 'Conga', sound: './audio/conga.wav' },
      { name: 'Bongo', sound: './audio/bongo.mp3' },
      { name: 'Cajón', sound: './audio/cajon.mp3' },
    ],
  },
  {
    name: 'Violin',
    image: 'https://images.pexels.com/photos/111287/pexels-photo-111287.jpeg',
    mainSound: './audio/villion.mp3',
    alternatives: [
      { name: 'Viola', sound: './audio/viola.mp3' },
      { name: 'Violin', sound: './audio/villion.mp3' },
      { name: 'Cello', sound: './audio/cello.mp3' },
      { name: 'Fiddle', sound: './audio/fiddle.mp3' },
    ],
  },
  {
    name: 'Flute',
    image: 'https://images.pexels.com/photos/2254140/pexels-photo-2254140.jpeg',
    mainSound: './audio/flute.mp3',
    alternatives: [
      { name: 'Pan Flute', sound: './audio/pan flute.mp3' },
      { name: 'Piccolo', sound: './audio/piccolo.mp3' },
      { name: 'Flute', sound: './audio/flute.mp3' },
      { name: 'Whistle', sound: './audio/whistle.mp3' },
    ],
  },
  {
    name: 'Trumpet',
    image: 'https://images.pexels.com/photos/2221318/pexels-photo-2221318.jpeg',
    mainSound: './audio/trumpet.mp3',
    alternatives: [
      { name: 'Cornet', sound: './audio/cornet.mp3' },
      { name: 'Trombone', sound: './audio/trombone.mp3' },
      { name: 'Trumpet', sound: './audio/trumpet.mp3' },
      { name: 'French Horn', sound: './audio/french horn.mp3' },
    ],
  },
  {
    name: 'Xylophone',
    image: 'https://images.pexels.com/photos/165972/pexels-photo-165972.jpeg',
    mainSound: './audio/xylophone.mp3',
    alternatives: [
      { name: 'Glockenspiel', sound: './audio/Glockenspiel.mp3' },
      { name: 'Marimba', sound: './audio/marimba.mp3' },
      { name: 'Xylophone', sound: './audio/xylophone.mp3' },
      { name: 'Vibraphone', sound: './audio/vibraphone.mp3' },
    ],
  },
  {
    name: 'Tambourine',
    image:
      'https://images.pexels.com/photos/15189503/pexels-photo-15189503.jpeg',
    mainSound: '/audio/tambourine.mp3',
    alternatives: [
      { name: 'Tambourine', sound: '/audio/tambourine.mp3' },
      { name: 'Maracas', sound: '/audio/maracas.mp3' },
      { name: 'Castanets', sound: '/audio/castanets.mp3' },
      { name: 'Shaker', sound: '/audio/shaker.mp3' },
    ],
  },
  {
    name: 'Harp',
    image:
      'https://images.pexels.com/photos/20523211/pexels-photo-20523211.png',
    mainSound: './audio/harp.mp3',
    alternatives: [
      { name: 'Lyre', sound: '/audio/lyre.mp3' },
      { name: 'Zither', sound: '/audio/zither.mp3' },
      { name: 'Guitar', sound: './audio/guitar.mp3' },
      { name: 'Harp', sound: './audio/harp.mp3' },
    ],
  },
  {
    name: 'Saxophone',
    image: 'https://images.pexels.com/photos/1049690/pexels-photo-1049690.jpeg',
    mainSound: '/audio/saxophone.mp3',
    alternatives: [
      { name: 'Clarinet', sound: '/audio/clarinet.mp3' },
      { name: 'Oboe', sound: '/audio/oboe.mp3' },
      { name: 'Saxophone', sound: '/audio/saxophone.mp3' },
      { name: 'Bassoon', sound: '/audio/bassoon.mp3' },
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
  if (index >= instrumentData.length) {
    showFinalScore();
    return;
  }

  const instrument = instrumentData[index];
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
  // update live displayed score (scale to 0..100)
  updateDisplayedScore();
}

// Score helpers
function calcScaledScore(rawCorrect) {
  // convert raw correct answers (0..totalQuestions) to a 0..100 integer
  const total = instrumentData.length || 1;
  return Math.round((rawCorrect / total) * 100);
}

function updateDisplayedScore() {
  if (!scoreValueEl) return;
  // Show live score as scaled to 100 (for clarity keep integer percent)
  scoreValueEl.textContent = calcScaledScore(score);
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
  const currentInstrument = instrumentData[currentInstrumentIndex];
  const isCorrect = answerText === currentInstrument.name;

  if (isCorrect) {
    answer.classList.add('correct--answer');
    // Only increase raw score up to the number of instruments
    if (score < instrumentData.length) {
      score++;
      updateDisplayedScore();
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

function showFinalScore() {
  instrumentDisplay.classList.add('hidden');
  setTimeout(() => {
    instrumentDisplay.classList.add('remove');

    // Update the final score (scaled 0..100)
    document.querySelector('.total-score-value').textContent =
      calcScaledScore(score);

    // Show the modal
    finalScoreModal.classList.remove('remove');
    setTimeout(() => {
      finalScoreModal.classList.remove('hidden');
    }, 100);
  }, 500);
}

// Reset game when clicking close button on final score modal
modalClose.addEventListener('click', () => {
  finalScoreModal.classList.add('hidden');
  setTimeout(() => {
    finalScoreModal.classList.add('remove');
    // Reset game state
    currentInstrumentIndex = 0;
    score = 0;
    // reset and display scaled zero
    updateDisplayedScore();
    acceptingAnswers = true;
    // Show first instrument
    instrumentDisplay.classList.remove('remove', 'hidden');
    displayInstrument(currentInstrumentIndex);
  }, 500);
});
