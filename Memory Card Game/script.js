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
const items2 = [
  {
    value: './images 2/love-stitch.svg',
    count: 0,
  },
  {
    value: './images 2/santa-stitch.svg',
    count: 0,
  },
  {
    value: './images 2/stitch-and-angel.svg',
    count: 0,
  },
  {
    value: './images 2/stitch-cand-cane-christmas.svg',
    count: 0,
  },
  {
    value: './images 2/stitch-christmas-tree.svg',
    count: 0,
  },
  {
    value: './images 2/stitch-easter.svg',
    count: 0,
    id: 6,
  },
  {
    value: './images 2/stitch-senior.svg',
    count: 0,
  },
  {
    value: './images 2/stitch-with-frog.svg',
    count: 0,
  },
];
btnNXT.addEventListener('click', function (e) {
  if (!e.target.closest('.btn')) return;

  if (currentLevel === 0) {
    // First time starting the game
    aboutSec.classList.add('hidden');
    container.classList.remove('hidden');
    container.scrollIntoView();
    // Start the timer
    gameTimer = setInterval(updateTimer, 1000);
  } else if (currentLevel === 3) {
    // Game complete, show results
    showResults();
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

const showResults = function () {
  clearInterval(gameTimer);
  totalTime += seconds;
  const averageTime = Math.round(totalTime / 3);
  const averageMoves = Math.round(totalMoves / 3);

  const modalHtml = `
    <div class="modal">
      <div class="modal-content">
        <h2>Game Complete!</h2>
        <p>Total Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60)
    .toString()
    .padStart(2, '0')}</p>
        <p>Total Moves: ${totalMoves}</p>
        <p>Average Time per Level: ${Math.floor(averageTime / 60)}:${(
    averageTime % 60
  )
    .toString()
    .padStart(2, '0')}</p>
        <p>Average Moves per Level: ${averageMoves}</p>
        <button class="restart-btn">Play Again</button>
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
    movesCounter.textContent = '0';
    document.querySelector('.timer').textContent = '00:00';
    resetGame();
    btnNXT.classList.add('hidden--opacity');
    container.classList.remove('hidden');
  });
};

const checkIfDone = function () {
  if (truePairs === 8) {
    setTimeout(() => {
      currentLevel++;
      totalMoves += moves;

      if (currentLevel === 3) {
        btnNXT.textContent = 'Show Results';
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

while (createdCards < 16) {
  generateMarkup();
}

// btnNXT.addEventListener('click', function () {
//   container.classList.add('hidden');
//   container2.classList.remove('hidden');
// });
