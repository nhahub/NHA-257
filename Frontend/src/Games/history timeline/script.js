// Game State
const gameState = {
  currentStory: 0,
  trials: 0,
  misses: 0,
  score: 0,
  startTime: null,
  endTime: null,
  userId: 1, // Should be set based on logged-in user
  gameId: 2, // Memory Timeline game ID
  storyScores: [0, 0, 0],
};

//be generated randomly for each game session
const storyTemplates = [
  {
    name: "the first story",
    items: [
      { id: 1, content: "./images/the first story/1.png", label: "first" },
      { id: 2, content: "./images/the first story/2.png", label: "second" },
      { id: 3, content: "./images/the first story/3.png", label: "third" },
      { id: 4, content: "./images/the first story/4.png", label: "fourth" },
      { id: 5, content: "./images/the first story/5.png", label: "fifth" },
      { id: 6, content: "./images/the first story/6.png", label: "sixth" },
    ],
  },
  {
    name: "the second story",
    items: [
      { id: 1, content: "./images/the second story/1.png", label: "first" },
      { id: 2, content: "./images/the second story/2.png", label: "second" },
      { id: 3, content: "./images/the second story/3.png", label: "third" },
      { id: 4, content: "./images/the second story/4.png", label: "fourth" },
      { id: 5, content: "./images/the second story/5.png", label: "fifth" },
      { id: 6, content: "./images/the second story/6.png", label: "sixth" },
    ],
  },
  {
    name: "the third story",
    items: [
      { id: 1, content: "./images/the third story/1.png", label: "first" },
      { id: 2, content: "./images/the third story/2.png", label: "second" },
      { id: 3, content: "./images/the third story/3.png", label: "third" },
      { id: 4, content: "./images/the third story/4.png", label: "fourth" },
      { id: 5, content: "./images/the third story/5.png", label: "fifth" },
      { id: 6, content: "./images/the third story/6.png", label: "sixth" },
    ],
  },
];

// This will hold the 3 randomly selected and shuffled stories for this game session
let stories = [];

// DOM Elements
const startMenu = document.querySelector(".start-menu");
const aboutSection = document.querySelector(".about--section");
const gameContainer = document.querySelector(".game--container");
const pool = document.getElementById("pool");
const dropZones = document.querySelectorAll(".drop-zone");
const btnStart = document.querySelector(".btn--start");
const btnAbout = document.querySelector(".btn--about");
const btnBackMenu = document.querySelector(".btn--back-menu");
const btnCheck = document.querySelector(".btn--check");
const btnReset = document.querySelector(".btn--reset");
const btnNextStory = document.querySelector(".btn--next-story");
const btnNextGame = document.querySelector(".btn--next-game");
const resultsModal = document.getElementById("results-modal");
const currentStorySpan = document.getElementById("current-story");
const trialsCount = document.getElementById("trials-count");
const missesCount = document.getElementById("misses-count");
const scoreCount = document.getElementById("score-count");

// Initialize game
function initGame() {
  btnStart.addEventListener("click", startGame);
  btnAbout.addEventListener("click", showAbout);
  btnBackMenu.addEventListener("click", backToMenu);
  btnCheck.addEventListener("click", checkOrder);
  btnReset.addEventListener("click", resetCurrentStory);
  btnNextStory.addEventListener("click", nextStory);
  btnNextGame.addEventListener("click", goToNextGame);

  setupDragAndDrop();
}

function showAbout() {
  startMenu.classList.add("remove");
  aboutSection.classList.remove("remove");
}

function backToMenu() {
  aboutSection.classList.add("remove");
  gameContainer.classList.add("remove");
  startMenu.classList.remove("remove");
}

// Function to generate random stories for this game session
function generateRandomStories() {
  // Shuffle the story templates array
  const shuffledTemplates = [...storyTemplates].sort(() => Math.random() - 0.5);

  // Take the first 3 stories
  const selectedTemplates = shuffledTemplates.slice(0, 3);

  // For each selected story, create a randomized version
  stories = selectedTemplates.map((template) => {
    // Create array of IDs [1, 2, 3, 4, 5, 6]
    const ids = template.items.map((item) => item.id);

    // Use the template's defined order as the correct order.
    // Previously this was shuffled which made the "correct" order different
    // from the natural/template order the player expects.
    const correctOrder = [...ids];

    return {
      name: template.name,
      correctOrder: correctOrder,
      items: template.items,
    };
  });

  console.log("Generated stories for this session:", stories);
}

function startGame() {
  // Generate random stories for this game session
  generateRandomStories();

  gameState.startTime = new Date().toISOString();
  gameState.currentStory = 0;
  gameState.trials = 0;
  gameState.misses = 0;
  gameState.score = 0;
  gameState.storyScores = [0, 0, 0];

  startMenu.classList.add("remove");
  aboutSection.classList.add("remove");
  gameContainer.classList.remove("remove");

  loadStory(0);
  updateStats();
}

function loadStory(storyIndex) {
  currentStorySpan.textContent = storyIndex + 1;
  pool.innerHTML = "";
  dropZones.forEach((zone) => {
    zone.innerHTML = "";
    zone.classList.remove("correct", "incorrect");
  });

  const story = stories[storyIndex];
  const shuffledItems = [...story.items].sort(() => Math.random() - 0.5);

  shuffledItems.forEach((item) => {
    const div = document.createElement("div");
    div.className = "draggable";
    div.draggable = true;
    div.id = `story${storyIndex}_item${item.id}`;
    div.dataset.itemId = item.id; // Store the item ID for validation

    // If content looks like an image filename (png/jpg/gif/svg/webp), insert an <img>
    if (/\.(png|jpe?g|gif|webp|svg)$/i.test(item.content)) {
      const img = document.createElement("img");
      // Encode URI to handle spaces or special characters in file/folder names
      img.src = encodeURI(item.content);
      img.alt = `Story ${storyIndex + 1} - Image ${item.id}`;
      img.loading = "lazy";
      div.appendChild(img);
    } else {
      div.textContent = item.content;
    }

    pool.appendChild(div);
    setupDraggable(div);
  });

  btnNextStory.classList.add("remove");
}

function setupDragAndDrop() {
  dropZones.forEach((zone) => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("drop", handleDrop);
    zone.addEventListener("dragleave", handleDragLeave);
  });

  pool.addEventListener("dragover", handleDragOver);
  pool.addEventListener("drop", handleDrop);
  pool.addEventListener("dragleave", handleDragLeave);
}

function setupDraggable(element) {
  element.addEventListener("dragstart", handleDragStart);
  element.addEventListener("dragend", handleDragEnd);
}

function handleDragStart(e) {
  const id = e.currentTarget.id;
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";
  e.currentTarget.classList.add("dragging");
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add("drag-over");
  e.dataTransfer.dropEffect = "move";
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");

  const id = e.dataTransfer.getData("text/plain");
  const dragged = document.getElementById(id);
  if (!dragged) return;

  if (e.currentTarget.classList.contains("drop-zone")) {
    // Clear any previous feedback
    e.currentTarget.classList.remove("correct", "incorrect");

    if (e.currentTarget.children.length === 0) {
      e.currentTarget.appendChild(dragged);
    } else {
      const existing = e.currentTarget.children[0];
      const parentOfDragged = dragged.parentElement;
      e.currentTarget.replaceChild(dragged, existing);
      if (parentOfDragged) parentOfDragged.appendChild(existing);
    }
  } else {
    e.currentTarget.appendChild(dragged);
  }
}

function checkOrder() {
  gameState.trials++;

  // Get current arrangement from drop zones
  const currentArrangement = [];
  dropZones.forEach((zone, index) => {
    const item = zone.children[0];
    if (item) {
      currentArrangement.push(parseInt(item.dataset.itemId));
    } else {
      currentArrangement.push(null); // Empty zone
    }
  });

  // Get correct order for current story
  const correctOrder = stories[gameState.currentStory].correctOrder;

  // Validate arrangement
  let correctCount = 0;
  let allCorrect = true;
  let hasEmptyZones = false;

  dropZones.forEach((zone, index) => {
    const item = zone.children[0];

    if (item) {
      const itemId = parseInt(item.dataset.itemId);
      const expectedId = correctOrder[index];

      if (itemId === expectedId) {
        zone.classList.add("correct");
        zone.classList.remove("incorrect");
        correctCount++;
      } else {
        zone.classList.add("incorrect");
        zone.classList.remove("correct");
        allCorrect = false;
        gameState.misses++;
      }
    } else {
      zone.classList.remove("correct", "incorrect");
      allCorrect = false;
      hasEmptyZones = true;
    }
  });

  updateStats();

  // Log for debugging
  console.log("Current arrangement:", currentArrangement);
  console.log("Correct order:", correctOrder);
  console.log(
    "Match:",
    JSON.stringify(currentArrangement) === JSON.stringify(correctOrder)
  );

  if (hasEmptyZones) {
    showFeedback("Please fill all positions before checking! 📋", "needswork");
    return;
  }

  if (allCorrect && correctCount === 6) {
    // Calculate score for this story (max 100 per story)
    const storyScore = Math.max(0, 100 - gameState.misses * 5);
    gameState.storyScores[gameState.currentStory] = storyScore;
    gameState.score = gameState.storyScores.reduce((a, b) => a + b, 0);

    updateStats();

    if (gameState.currentStory < 2) {
      btnNextStory.classList.remove("remove");
      btnCheck.disabled = true;
      showFeedback("Excellent! You got it right! 🎉", "excellent");
    } else {
      endGame();
    }
  } else {
    showFeedback(
      `Not quite right. ${correctCount} out of 6 correct. Try again! 💪`,
      "needswork"
    );
  }
}

function showFeedback(message, type) {
  // Simple alert for now, can be enhanced with a toast notification
  const feedback = document.createElement("div");
  feedback.className = `feedback-message ${type}`;
  feedback.textContent = message;
  feedback.style.cssText =
    "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; padding: 15px 30px; border-radius: 8px;";
  document.body.appendChild(feedback);

  setTimeout(() => feedback.remove(), 3000);
}

function resetCurrentStory() {
  loadStory(gameState.currentStory);
  btnCheck.disabled = false;
}

function nextStory() {
  gameState.currentStory++;
  loadStory(gameState.currentStory);
  btnCheck.disabled = false;
}

function updateStats() {
  trialsCount.textContent = gameState.trials;
  missesCount.textContent = gameState.misses;
  scoreCount.textContent = gameState.score;
}

function endGame() {
  gameState.endTime = new Date().toISOString();

  // Calculate time played
  const startTime = new Date(gameState.startTime);
  const endTime = new Date(gameState.endTime);
  const timeDiff = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(timeDiff / 60);
  const seconds = timeDiff % 60;

  // Update modal
  document.getElementById("final-score").textContent = gameState.score;
  document.getElementById("final-trials").textContent = gameState.trials;
  document.getElementById("final-misses").textContent = gameState.misses;
  document.getElementById("final-time").textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Set feedback based on score
  const feedback = document.getElementById("feedback");
  if (gameState.score >= 250) {
    feedback.textContent = "🌟 Outstanding! Perfect memory!";
    feedback.className = "feedback-message excellent";
  } else if (gameState.score >= 200) {
    feedback.textContent = "👍 Great job! Well done!";
    feedback.className = "feedback-message good";
  } else {
    feedback.textContent = "💪 Good effort! Practice makes perfect!";
    feedback.className = "feedback-message needswork";
  }

  // Show modal
  resultsModal.classList.add("show");

  // Send results to API
  sendResultsToAPI();
}

async function sendResultsToAPI() {
  const payload = {
    userId: gameState.userId,
    gameId: gameState.gameId,
    startTime: gameState.startTime,
    endTime: gameState.endTime,
    score: gameState.score,
    trials: gameState.trials,
    misses: gameState.misses,
    sessionDate: new Date().toISOString().split("T")[0],
  };

  try {
    // Replace with your actual API endpoint
    const response = await fetch("127.0.0.1:5500", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("Results sent successfully:", await response.json());
    } else {
      console.error("Failed to send results:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending results to API:", error);
    // Store locally as backup
    localStorage.setItem("pendingGameResults", JSON.stringify(payload));
  }
}

function goToNextGame() {
  // Reset and go back to menu or redirect to next game
  resultsModal.classList.remove("show");
  backToMenu();
}

// Initialize everything when DOM is ready
initGame();
