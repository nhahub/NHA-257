// --- CONFIG ---
const GAME_ID = 9; // Visual Tracking
const TOTAL_ROUNDS = 10; // Fixed limit
const sessionMgr = new SessionManager('https://localhost:7101/api');

// --- GLOBAL VARIABLES ---
let game, message, nextBtn, startBtn, instructions, levelSelect;
let gamesSpan, correctSpan, wrongSpan;
let currentSet = [], missingItem = null;
let gamesPlayed = 0, correctCount = 0, wrongCount = 0;

const icons = ['🍎','⭐','⚽','🐥','🚗','🎈','🍌','🦋','🌙','🎁','🐸','🎩','🦓','🌴','🌶️','🎂','🐶','🍇','🎃','🧸','🐼','🐒','🐋','🍩','🎱','⏰'];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
        return;
    }

    // Grab Elements
    game = document.getElementById('game');
    message = document.getElementById('message');
    nextBtn = document.getElementById('next');
    startBtn = document.getElementById('start');
    instructions = document.getElementById('instructions');
    levelSelect = document.getElementById('level');
    gamesSpan = document.getElementById('games');
    correctSpan = document.getElementById('correct');
    wrongSpan = document.getElementById('wrong');

    // Attach Listeners
    if(startBtn) {
        startBtn.style.display = 'inline-block';
        startBtn.onclick = () => {
            instructions.style.display = 'none';
            // Disable difficulty change after start
            levelSelect.disabled = true;
            startGame();
        };
    }

    if(nextBtn) {
        nextBtn.onclick = startGame;
    }
});

function goToMenu() { window.location.href = '../menu.html'; }

function updateStats() {
    gamesSpan.textContent = gamesPlayed;
    correctSpan.textContent = correctCount;
    wrongSpan.textContent = wrongCount;
}

function startGame() {
    // Reset UI
    game.innerHTML = '';
    message.textContent = '';
    if(nextBtn) nextBtn.style.display = 'none';

    // Increment Round
    gamesPlayed++;
    updateStats();

    const level = levelSelect.value;
    let showTime, numShapes, numChoices;

    if (level === 'easy') {
        showTime = 4000; numShapes = 6; numChoices = 4;
        game.style.gridTemplateColumns = 'repeat(3, 120px)';
    } else if (level === 'medium') {
        showTime = 5000; numShapes = 9; numChoices = 7;
        game.style.gridTemplateColumns = 'repeat(3, 120px)';
    } else {
        showTime = 8000; numShapes = 12; numChoices = 9;
        game.style.gridTemplateColumns = 'repeat(4, 120px)';
    }

    currentSet = shuffle([...icons]).slice(0, numShapes);

    currentSet.forEach((icon) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = icon;
        game.appendChild(div);
    });

    setTimeout(() => hideAndRemoveOne(numChoices), showTime);
}

function hideAndRemoveOne(numChoices) {
    game.innerHTML = '';
    missingItem = currentSet[Math.floor(Math.random() * currentSet.length)];
    let remaining = currentSet.filter((i) => i !== missingItem);
    remaining = shuffle(remaining);

    remaining.forEach((icon) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = icon;
        game.appendChild(div);
    });

    message.innerHTML = '🤔 Which shape disappeared?';

    const unusedIcons = icons.filter((i) => !remaining.includes(i) && i !== missingItem);
    let choices = shuffle([...unusedIcons]).slice(0, numChoices - 1);
    choices.push(missingItem);
    choices = shuffle(choices);

    choices.forEach((icon) => {
        const btn = document.createElement('button');
        btn.textContent = icon;
        btn.style.margin = '10px';
        btn.style.padding = '10px 20px';
        btn.style.fontSize = '1.5em';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '10px';
        btn.style.border = 'none';
        btn.style.background = '#fff';
        btn.style.color = '#333';
        
        btn.onclick = () => checkAnswer(icon);
        message.appendChild(btn);
    });
}

function checkAnswer(icon) {
    const buttons = message.querySelectorAll('button');
    buttons.forEach((btn) => (btn.disabled = true));

    if (icon === missingItem) {
        message.innerHTML = `✅ Correct! It was ${missingItem}`;
        correctCount++;
    } else {
        message.innerHTML = `❌ Wrong! It was ${missingItem}`;
        wrongCount++;
    }
    
    updateStats();

    // --- NEW LOGIC: CHECK IF GAME OVER ---
    if (gamesPlayed >= TOTAL_ROUNDS) {
        // Game Finished
        setTimeout(showResultsModal, 1500);
    } else {
        // Show Next Button
        if(nextBtn) nextBtn.style.display = 'inline-block';
    }
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --- BACKEND SUBMISSION ---
function computeScore() {
    if (gamesPlayed <= 0) return 0;
    const ratio = correctCount / gamesPlayed;
    return Math.round(ratio * 100);
}

async function showResultsModal() {
    const score = computeScore();
    const modal = document.getElementById('resultsModal');
    
    // Update Modal UI
    modal.querySelector('.modal-score').textContent = score + '/100';
    modal.querySelector('.modal-correct').textContent = correctCount;
    modal.querySelector('.modal-wrong').textContent = wrongCount;
    modal.classList.add('open');
    modal.style.display = 'flex'; 

    // Submit to Backend
    // Note: Sending 'correctCount' as score metric (or calculated percentage)
    await sessionMgr.submitScore(GAME_ID, score, gamesPlayed, wrongCount);
}