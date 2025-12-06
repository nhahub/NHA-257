// --- CONFIG ---
const GAME_ID = 5; 
const sessionMgr = new SessionManager('https://localhost:7101/api');

// Security Check
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        // alert("⚠️ Start a session from the menu first!");
        // window.location.href = '../menu.html';
    }
});

function goToMenu() { window.location.href = '../menu.html'; }

// --- GAME STATE ---
const gameState = {
    currentStory: 0,
    trials: 0,
    misses: 0,
    totalCorrectItems: 0, // We now count items (max 18), not points
    startTime: null
};

// Stories
const storyTemplates = [
    { name: "Story 1", items: [1,2,3,4,5,6].map(i => ({ id: i, content: `./images/the first story/${i}.png` })) },
    { name: "Story 2", items: [1,2,3,4,5,6].map(i => ({ id: i, content: `./images/the second story/${i}.png` })) },
    { name: "Story 3", items: [1,2,3,4,5,6].map(i => ({ id: i, content: `./images/the third story/${i}.png` })) },
];

let stories = [];

// Elements
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
const resultsModal = document.getElementById("results-modal");
const currentStorySpan = document.getElementById("current-story");
const trialsCount = document.getElementById("trials-count");

// Init
btnStart.addEventListener("click", startGame);
btnAbout.addEventListener("click", () => { startMenu.classList.add("remove"); aboutSection.classList.remove("remove"); });
btnBackMenu.addEventListener("click", () => { aboutSection.classList.add("remove"); startMenu.classList.remove("remove"); });

btnCheck.addEventListener("click", checkOrder);
btnReset.addEventListener("click", resetCurrentStory);
btnNextStory.addEventListener("click", handleNextStoryClick);

setupDragAndDrop();

function startGame() {
    // Randomize Stories
    const shuffledTemplates = [...storyTemplates].sort(() => Math.random() - 0.5);
    stories = shuffledTemplates.map(t => ({
        name: t.name,
        correctOrder: t.items.map(i => i.id),
        items: t.items
    }));

    gameState.startTime = Date.now();
    gameState.currentStory = 0;
    gameState.trials = 0;
    gameState.misses = 0;
    gameState.totalCorrectItems = 0; // Reset count

    startMenu.classList.add("remove");
    gameContainer.classList.remove("remove");
    loadStory(0);
    updateStats();
}

function loadStory(index) {
    currentStorySpan.textContent = index + 1;
    
    // Update Button Text
    if (index === stories.length - 1) {
        btnNextStory.textContent = "Finish Game 🏁";
    } else {
        btnNextStory.textContent = "Next Story ➡";
    }

    pool.innerHTML = "";
    dropZones.forEach(z => { z.innerHTML = ""; z.classList.remove("correct", "incorrect"); });

    const story = stories[index];
    const shuffledItems = [...story.items].sort(() => Math.random() - 0.5);

    shuffledItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "draggable";
        div.draggable = true;
        div.id = `item${item.id}`;
        div.dataset.itemId = item.id;
        
        const img = document.createElement("img");
        img.src = item.content;
        div.appendChild(img);
        pool.appendChild(div);

        div.addEventListener("dragstart", e => { 
            e.dataTransfer.setData("text/plain", div.id); 
            div.classList.add("dragging"); 
        });
        div.addEventListener("dragend", e => div.classList.remove("dragging"));
    });
    
    btnNextStory.classList.add("remove");
    btnCheck.disabled = false;
    btnCheck.classList.remove("remove");
    updateStats();
}

function resetCurrentStory() {
    dropZones.forEach(z => {
        if(z.children.length > 0) {
            pool.appendChild(z.children[0]);
        }
        z.classList.remove("correct", "incorrect");
    });
    btnNextStory.classList.add("remove");
    btnCheck.disabled = false;
}

function setupDragAndDrop() {
    [...dropZones, pool].forEach(zone => {
        zone.addEventListener("dragover", e => e.preventDefault());
        zone.addEventListener("drop", e => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const dragged = document.getElementById(id);
            if (!dragged) return;
            if (zone.classList.contains("drop-zone") && zone.children.length > 0) return; 
            zone.appendChild(dragged);
        });
    });
}

function checkOrder() {
    let isFull = true;
    dropZones.forEach(zone => { if(zone.children.length === 0) isFull = false; });
    if(!isFull) { alert("Please place all images first!"); return; }

    gameState.trials++;
    const correctOrder = stories[gameState.currentStory].correctOrder;
    let correctCount = 0;

    dropZones.forEach((zone, i) => {
        const item = zone.children[0];
        // Compare current item ID with expected ID
        if (parseInt(item.dataset.itemId) === correctOrder[i]) {
            zone.classList.add("correct");
            zone.classList.remove("incorrect");
            correctCount++;
        } else {
            zone.classList.add("incorrect");
            zone.classList.remove("correct");
            gameState.misses++;
        }
    });

    // Allow moving to next story regardless of score
    btnNextStory.classList.remove("remove");
    
    // If perfect, disable further checks for this level
    if (correctCount === 6) {
        btnCheck.disabled = true; 
    }
    
    updateStats();
}

function handleNextStoryClick() {
    // 1. CALCULATE SCORE FOR THIS STORY
    // We count how many zones currently have the class "correct"
    const currentCorrect = document.querySelectorAll('.drop-zone.correct').length;
    
    gameState.totalCorrectItems += currentCorrect;

    // 2. MOVE TO NEXT OR END
    if (gameState.currentStory < 2) {
        gameState.currentStory++;
        loadStory(gameState.currentStory);
    } else {
        endGame();
    }
}

function updateStats() {
    trialsCount.textContent = gameState.trials;
}

async function endGame() {
    const endTime = Date.now();
    const timeDiff = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;

    // --- SCORE CALCULATION ---
    // Formula: (Correct Items / 18) * 100
    // There are 3 stories * 6 items = 18 total items
    let finalScore = (gameState.totalCorrectItems / 18) * 100;
    
    // Round to nearest whole number
    finalScore = Math.round(finalScore);

    document.getElementById("final-score").textContent = finalScore;
    document.getElementById("final-time").textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    
    resultsModal.classList.add("show");

    // --- SUBMIT TO BACKEND ---
    await sessionMgr.submitScore(GAME_ID, finalScore, gameState.trials, gameState.misses);
}