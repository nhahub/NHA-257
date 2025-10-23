const btnAbout = document.querySelector('.btn-about');
const aboutSec = document.querySelector('.About--section');
const startStorySce = document.querySelector('.start--story');
const btnStartStory = document.querySelector('.btn--start--story');
const btnNXT = document.querySelector('.btn--next');
const curStoryPart = document.querySelector('.story--part');
const imgEl = document.querySelector('.story--img');
const storyContainer = document.querySelector('.story');
const questionContainer = document.querySelector('.questions--container');
const answersContainer = document.querySelector('.answers');
const answers = document.querySelectorAll('.answer');
const question = document.querySelector('.question');

let curPart = 0;
let curQuestion = 0;
let acceptingAnswers = true;
let score = 0;
let scores = [0, 0, 0]; // Array to track scores for all three stories
const scoreValueEl = document.querySelector('.score-value');
const scoresModal = document.querySelector('.scores-modal');
const modalClose = document.querySelector('.modal-close');

const firstStory = [
  {
    text: 'Lina went to the park on a windy afternoon with her younger brother, Youssef.',
    image: './images/the first story/1.png',
  },
  {
    text: 'She carried a yellow kite and a small picnic basket. They sat near a tall oak tree and ate sandwiches with cheese and tomatoes',
    image: './images/the first story/2.png',
  },
  {
    text: 'While flying the kite, the string snapped.',
    image: './images/the first story/3.png',
  },
  {
    text: 'it landed beside an old man reading a newspaper on a wooden bench. The man smiled, returned the kite, and gave Youssef a candy in a blue wrapper',
    image: './images/the first story/4.png',
  },
  {
    text: 'As they were leaving, Lina noticed a squirrel climbing the tree, holding one of their sandwich crusts.',
    image: './images/the first story/5.png',
  },
  {
    text: 'The END. Questions time',
    image: './images/the first story/the END.png',
  },
];
const secondStory = [
  {
    text: 'Prince Arion rode through the dark forest of Eldria, his silver armor shining beneath the full moon.',
    image: './images/the third story/1.png',
  },
  {
    text: 'Deep within the forest, the Shadow Beast guarded the crystal tower where Princess Elara was trapped.',
    image:
      './images/the third story/Gemini_Generated_Image_p0jmezp0jmezp0jm.png',
  },
  {
    text: 'Armed with a golden spear and a blue shield, Arion crossed the stone bridge that cracked with every step.',
    image: './images/the third story/2.png',
  },
  {
    text: 'The Beast appeared — a giant creature with red eyes and wings black as night. It roared so loudly that the trees trembled.',
    image: './images/the third story/3.png',
  },
  {
    text: 'Arion struck first, aiming for the glowing mark on its chest. After three fierce blows, the monster fell into the river below, vanishing in a flash of light.',
    image: './images/the third story/4.png',
  },
  {
    text: 'Arion climbed the tower, freed Elara, and placed a single white rose in her hand a promise that their kingdom would rise in peace again.',
    image: './images/the third story/5.png',
  },

  {
    text: 'The END. Questions time',
    image: './images/the third story/the END.png',
  },
];
const thirdStory = [
  {
    text: 'One sunny morning, Omar left his house carrying a blue backpack.',
    image: './images/the second story/1.png',
  },
  {
    text: 'On his way to school, he stopped by a small shop to buy a bottle of water and two apples.',
    image: './images/the second story/2.png',
  },
  {
    text: 'Outside the shop, he saw a lost puppy sitting near a red bicycle. Feeling sorry for it, Omar gave the puppy one of his apples and decided to look for its owner.',
    image: './images/the second story/3.png',
  },
  {
    text: "A few minutes later, a woman wearing a green jacket ran toward him, calling the puppy's name, “Bingo!”",
    image: './images/the second story/missing bingo.png',
  },
  {
    text: 'She thanked Omar and gave him a small keychain shaped like a star as a gift..',
    image: './images/the second story/4.png',
  },
  {
    text: 'Smiling, Omar continued walking to school, holding the keychain tightly in his hand.',
    image: './images/the second story/5.png',
  },

  {
    text: 'The END. Questions time',
    image: './images/the second story/the END.png',
  },
];
const parkAdventureQuestions = [
  {
    question: 'Who went to the park with Lina?',
    options: [
      'Her friend Mariam',
      'Her brother Youssef',
      'Her cousin Karim',
      'Her mother',
    ],
    correctAnswer: 'Her brother Youssef',
  },
  {
    question: 'What color was Lina’s kite?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correctAnswer: 'Yellow',
  },
  {
    question: 'What did Lina carry besides the kite?',
    options: ['A picnic basket', 'A football', 'A book', 'A painting set'],
    correctAnswer: 'A picnic basket',
  },
  {
    question: 'What kind of sandwiches did they eat?',
    options: [
      'Tuna and lettuce',
      'Cheese and tomatoes',
      'Chicken and mayo',
      'Egg and cucumber',
    ],
    correctAnswer: 'Cheese and tomatoes',
  },
  {
    question: 'Where did the kite land after the string snapped?',
    options: [
      'On a tree',
      'Beside an old man',
      'In the pond',
      'Near the playground',
    ],
    correctAnswer: 'Beside an old man',
  },
  {
    question: 'What was the old man doing when the kite landed near him?',
    options: [
      'Feeding pigeons',
      'Reading a newspaper',
      'Playing chess',
      'Listening to music',
    ],
    correctAnswer: 'Reading a newspaper',
  },
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
];
const thirdStoryQuestions = [
  {
    question: `What color was Omar's backpack?`,
    options: [`Red`, `Blue`, `Green`, `Black`],
    correctAnswer: `Blue`,
  },
  {
    question: `What items did Omar buy at the shop?`,
    options: [
      `A bottle of water and two apples`,
      `A sandwich and juice`,
      `Three oranges and milk`,
      `Cookies and water`,
    ],
    correctAnswer: `A bottle of water and two apples`,
  },
  {
    question: `What did Omar find outside the shop?`,
    options: [`A lost kitten`, `A lost puppy`, `A lost bird`, `A lost rabbit`],
    correctAnswer: `A lost puppy`,
  },
  {
    question: `What was near the lost animal?`,
    options: [
      `A blue car`,
      `A red bicycle`,
      `A green bench`,
      `A yellow skateboard`,
    ],
    correctAnswer: `A red bicycle`,
  },
  {
    question: `What did Omar give to the puppy?`,
    options: [`A piece of bread`, `An apple`, `A biscuit`, `Some water`],
    correctAnswer: `An apple`,
  },
  {
    question: `What was the puppy's name?`,
    options: [`Lucky`, `Spot`, `Bingo`, `Max`],
    correctAnswer: `Bingo`,
  },
  {
    question: `What color jacket was the woman wearing?`,
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
];

const princeStoryQuestions = [
  {
    question: `What was the name of the prince?`,
    options: [`Prince Arion`, `Prince Eldric`, `Prince Lorian`, `Prince Kael`],
    correctAnswer: `Prince Arion`,
  },
  {
    question: `Where did the story take place?`,
    options: [
      `The desert of Orin`,
      `The dark forest of Eldria`,
      `The frozen mountains of Drakar`,
      `The golden castle of Solen`,
    ],
    correctAnswer: `The dark forest of Eldria`,
  },
  {
    question: `What color was the prince's armor?`,
    options: [`Gold`, `Silver`, `Black`, `Bronze`],
    correctAnswer: `Silver`,
  },
  {
    question: `What weapon did Arion carry?`,
    options: [
      `A silver sword`,
      `A golden spear`,
      `A steel axe`,
      `An iron dagger`,
    ],
    correctAnswer: `A golden spear`,
  },
  {
    question: `What color was the prince's shield?`,
    options: [`Red`, `Blue`, `Green`, `White`],
    correctAnswer: `Blue`,
  },
  {
    question: `What did the Beast guard?`,
    options: [
      `A crystal tower`,
      `A magic cave`,
      `A hidden crown`,
      `A golden gate`,
    ],
    correctAnswer: `A crystal tower`,
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
const morningSurpriseQuestions = [
  {
    question: `What was Omar carrying when he left his house?`,
    options: [
      `A black backpack`,
      `A blue backpack`,
      `A red bag`,
      `A brown suitcase`,
    ],
    correctAnswer: `A blue backpack`,
  },
  {
    question: `Where was Omar going that morning?`,
    options: [`To the market`, `To the park`, `To school`, `To visit a friend`],
    correctAnswer: `To school`,
  },
  {
    question: `What did Omar buy from the shop?`,
    options: [
      `A bottle of juice and a sandwich`,
      `A bottle of water and two apples`,
      `A notebook and a pencil`,
      `A loaf of bread and milk`,
    ],
    correctAnswer: `A bottle of water and two apples`,
  },
  {
    question: `What did Omar see outside the shop?`,
    options: [
      `A cat near a car`,
      `A lost puppy near a red bicycle`,
      `A bird on a tree`,
      `A dog chasing a ball`,
    ],
    correctAnswer: `A lost puppy near a red bicycle`,
  },
  {
    question: `What did Omar give to the puppy?`,
    options: [
      `A biscuit`,
      `Some water`,
      `One of his apples`,
      `A piece of bread`,
    ],
    correctAnswer: `One of his apples`,
  },
  {
    question: `What was the color of the woman’s jacket?`,
    options: [`Blue`, `Green`, `Brown`, `Yellow`],
    correctAnswer: `Green`,
  },
  {
    question: `What was the puppy’s name?`,
    options: [`Luna`, `Rex`, `Bingo`, `Max`],
    correctAnswer: `Bingo`,
  },
  {
    question: `What gift did the woman give Omar?`,
    options: [
      `A bracelet`,
      `A small keychain shaped like a star`,
      `A silver coin`,
      `A thank-you card`,
    ],
    correctAnswer: `A small keychain shaped like a star`,
  },
  {
    question: `How did Omar feel after receiving the gift?`,
    options: [`Sad`, `Angry`, `Embarrassed`, `Happy`],
    correctAnswer: `Happy`,
  },
  {
    question: `What did Omar do with the keychain?`,
    options: [
      `Put it in his pocket`,
      `Held it tightly in his hand`,
      `Gave it to a friend`,
      `Left it at school`,
    ],
    correctAnswer: `Held it tightly in his hand`,
  },
];

// start with the first story and its question set
let currentStory = firstStory;
let currentQuestionSet = parkAdventureQuestions;
DisplayStory(currentStory);

btnAbout.addEventListener('click', function () {
  aboutSec.classList.add('hidden');
  setTimeout(() => {
    aboutSec.classList.add('remove');
  }, 500);
});

if (btnStartStory) {
  btnStartStory.addEventListener('click', function () {
    startStorySce.classList.add('hidden');
    startStorySce.classList.add('remove');
  });
}

btnNXT.addEventListener('click', function () {
  if (curPart === currentStory.length) {
    storyContainer.classList.add('hidden');
    setTimeout(() => {
      storyContainer.classList.add('remove');
      questionContainer.classList.remove('remove');
      // initialize first question when questions container becomes visible
      loadQuestion(0);
    }, 500);
    setTimeout(() => {
      questionContainer.classList.remove('hidden');
    }, 750);
    curPart = 0;
  } else {
    DisplayStory(currentStory);
  }
});

function DisplayStory(story) {
  curStoryPart.textContent = story[curPart].text;
  imgEl.src = story[curPart].image;
  curPart++;
}

// Load a question by index and prepare the answers
function loadQuestion(index) {
  // if out of range, finish the quiz
  if (index >= currentQuestionSet.length) {
    // Check which story's quiz just finished and transition accordingly
    if (currentQuestionSet === parkAdventureQuestions) {
      // Save first story score
      scores[0] = score;
      // First story quiz finished, show second story
      transitionToNextStory(secondStory, princeStoryQuestions);
      return;
    } else if (currentQuestionSet === princeStoryQuestions) {
      // Save second story score
      scores[1] = score;
      // Second story quiz finished, show third story
      transitionToNextStory(thirdStory, thirdStoryQuestions);
      return;
    } else {
      // Save final story score and show modal
      scores[2] = score;

      // Update the question container
      question.textContent = `All stories finished! Click anywhere to see your scores.`;
      answers.forEach(a => {
        a.classList.remove(
          'correct--answer',
          'wrong--answer',
          'answer--animation'
        );
        a.textContent = '';
        a.classList.add('remove');
      });
      acceptingAnswers = false;

      // Show final scores after a short delay
      setTimeout(() => {
        showFinalScores();
      }, 1000);
      return;
    }
  }

  // make sure answers are visible and reset classes
  answers.forEach((choice, i) => {
    choice.classList.remove(
      'correct--answer',
      'wrong--answer',
      'answer--animation',
      'remove'
    );
    choice.textContent = currentQuestionSet[index].options[i];
  });

  question.textContent = currentQuestionSet[index].question;
  curQuestion = index;
  acceptingAnswers = true;
}

questionContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('answer')) return;
  if (!acceptingAnswers) return;
  acceptingAnswers = false; // prevent double clicks while animating

  const option = e.target;
  const correct = currentQuestionSet[curQuestion].correctAnswer;

  if (option.textContent === correct) {
    option.classList.add('correct--answer');
    // increment score (max 10)
    if (score < 10) {
      score++;
    }
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

  // Update scores in the modal
  document.querySelector('.story1-score').textContent = scores[0];
  document.querySelector('.story2-score').textContent = scores[1];
  document.querySelector('.story3-score').textContent = scores[2];

  // Calculate and update total score
  const totalScore = scores.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-score-value').textContent = totalScore;

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

function transitionToNextStory(nextStory, nextQuestionSet) {
  question.textContent = 'Great! Next story incoming...';
  answers.forEach(a => {
    a.classList.remove('correct--answer', 'wrong--answer', 'answer--animation');
  });
  acceptingAnswers = false;

  // hide questions and show next story
  questionContainer.classList.add('hidden');
  setTimeout(() => {
    questionContainer.classList.add('remove');
    // prepare next story and question set
    currentStory = nextStory;
    currentQuestionSet = nextQuestionSet;
    curPart = 0;
    // reset score for each story
    score = 0;
    if (scoreValueEl) scoreValueEl.textContent = score;
    storyContainer.classList.remove('remove');
    DisplayStory(currentStory);
  }, 500);
  setTimeout(() => {
    storyContainer.classList.remove('hidden');
  }, 750);
}
