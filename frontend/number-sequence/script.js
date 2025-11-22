const sequenceDisplay = document.getElementById("sequence-display");
const optionsContainer = document.getElementById("options-container");
const startBtn = document.getElementById("start-btn");
const levelInfo = document.getElementById("level-info");
const resultDiv = document.getElementById("result");


let level = 1;
let question = 1;
let score = 0;
let correctSequence = [];
let startTime = null; 

//  Send Game Result to Backend
async function sendResult(gameId, score, trials = 0, misses = 0) {
    const now = new Date();

    const payload = {
        userId: 1,
        gameId: gameId,
        startTime: startTime,
        endTime: now.toISOString(),
        score: score,
        trials: trials,
        misses: misses,
        sessionDate: now.toISOString().split("T")[0]
    };

    try {
        await fetch("https://localhost:7134/GameSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log("Game 2 result stored:", payload);
    } catch (err) {
        console.error("Failed to send Game 2 result:", err);
    }
}

function endGame(finalScore, trials = 0, misses = 0) {
    sendResult(1, finalScore, trials, misses);  
}

//  MAIN GAME LOGIC
// Start Game
startBtn.addEventListener("click", startGame);

function startGame() {
    startTime = new Date().toISOString(); //  record time for API
    startBtn.style.display = "none";
    resultDiv.textContent = "";

    level = 1;
    question = 1;
    score = 0;

    nextQuestion();
}

// Generate next question

function nextQuestion() {
    optionsContainer.innerHTML = "";
    resultDiv.textContent = "";
    levelInfo.textContent = `Level: ${level} | Question: ${question}`;

    let sequenceLength = level;
    correctSequence = generateSequence(sequenceLength);

    sequenceDisplay.textContent = correctSequence.join(" ");

    // Show sequence for 5 seconds then hide it
    setTimeout(() => {
        sequenceDisplay.textContent = "";
        showOptions();
    }, 5000);
}

// Generate numeric sequence

function generateSequence(length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(Math.floor(Math.random() * 9) + 1);
    }
    return arr;
}

// Show options (1 correct + 3 fake)
function showOptions() {
    const correct = correctSequence.join(" ");
    const options = [correct];

    while (options.length < 4) {
        const fake = generateSequence(correctSequence.length).join(" ");
        if (!options.includes(fake)) options.push(fake);
    }

    // shuffle
    options.sort(() => Math.random() - 0.5);

    // create buttons
    options.forEach(option => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(option, btn);
        optionsContainer.appendChild(btn);
    });
}

// Check Answer
function checkAnswer(selected, button) {
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    if (selected === correctSequence.join(" ")) {
        score++;
        resultDiv.textContent = "✅ Correct!";
        resultDiv.style.color = "green";
        button.style.backgroundColor = "#4CAF50";
    } else {
        resultDiv.textContent =
            `❌ Wrong! Correct sequence: ${correctSequence.join(" ")}`;
        resultDiv.style.color = "red";
        button.style.backgroundColor = "#dc3545";
    }

    setTimeout(() => {
        // 2 questions per level → 5 levels → 10 total score
        if (question < 2) {
            question++;
            nextQuestion();
        } else if (level < 5) {
            level++;
            question = 1;
            nextQuestion();
        } else {
            finishGame();
        }
    }, 2000);
}

// Game Finished

function finishGame() {
    optionsContainer.innerHTML = "";
    sequenceDisplay.textContent = "";
    levelInfo.textContent = "";

    resultDiv.style.color = "#333";
    resultDiv.textContent = `🎉 Game Over! Your Score: ${score} / 10`;

    // Send API result
    endGame(score);

    startBtn.textContent = "Play Again";
    startBtn.style.display = "inline-block";
}
