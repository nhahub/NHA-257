// Game State
// --- CONFIG ---
const GAME_ID = 7; // Magic Tray
const sessionMgr = new SessionManager('https://localhost:7101/api');

// Security Check
document.addEventListener('DOMContentLoaded', () => {
    if (!sessionMgr.isSessionActive()) {
        alert("⚠️ Start a session from the menu first!");
        window.location.href = '../menu.html';
    }
    // Original Init
    initSpeech();
});

function goToMenu() { window.location.href = '../menu.html'; }

let gameState = {
    level: 1,
    score: 0,
    lives: 3,
    progress: 0,
    isPlaying: false,
    showingSequence: false,
    difficulty: 'medium',
    speed: 'medium',
    soundEnabled: true,
    pronunciationEnabled: true,
    selectedCategory: 'magic',
    currentSequence: [],
    playerSequence: [],
    availableItems: [],
    maxProgress: 4,
    // API tracking
    sessionId: 0,
    userId: 0,
    gameId: 0,
    startTime: null,
    trials: 0,
    misses: 0,
    apiEndpoint: 'https://localhost:7134/GameSession'
};

// Object Pools
const objectPools = {
    magic: {
        name: '♦ Shapes',
        description: 'Different Shapes',
        items: [
            { id: 'circle', emoji: '⚪', color: 'item-blue', name: 'Circle' },
            { id: 'square', emoji: '⬜', color: 'item-purple', name: 'Square' },
            { id: 'triangle', emoji: '🔺', color: 'item-green', name: 'Triangle' },
            { id: 'diamond', emoji: '♦️', color: 'item-yellow', name: 'Diamond' },
            { id: 'heart', emoji: '❤', color: 'item-red', name: 'Heart' },
            { id: 'oval', emoji: '⬬', color: 'item-orange', name: 'Oval' },
            { id: 'rectangle', emoji: '▬', color: 'item-pink', name: 'Rectangle' },
            { id: 'star', emoji: '⭐', color: 'item-cyan', name: 'Star' }
        ]
    },
    fruits: {
        name: '🍎 Fruits',
        description: 'Delicious and healthy fruits',
        items: [
            { id: 'apple', emoji: '🍎', color: 'item-red', name: 'Apple' },
            { id: 'banana', emoji: '🍌', color: 'item-yellow', name: 'Banana' },
            { id: 'orange', emoji: '🍊', color: 'item-orange', name: 'Orange' },
            { id: 'grapes', emoji: '🍇', color: 'item-purple', name: 'Grapes' },
            { id: 'strawberry', emoji: '🍓', color: 'item-red', name: 'Strawberry' },
            { id: 'watermelon', emoji: '🍉', color: 'item-green', name: 'Watermelon' },
            { id: 'pineapple', emoji: '🍍', color: 'item-yellow', name: 'Pineapple' },
            { id: 'avocado', emoji: '🥑', color: 'item-pink', name: 'Avocado' }
        ]
    },
    vegetables: {
        name: '🥕 Vegetables',
        description: 'Fresh and nutritious vegetables',
        items: [
            { id: 'carrot', emoji: '🥕', color: 'item-orange', name: 'Carrot' },
            { id: 'pepper', emoji: '🌶', color: 'item-green', name: 'Hot Pepper' },
            { id: 'tomato', emoji: '🍅', color: 'item-red', name: 'Tomato' },
            { id: 'corn', emoji: '🌽', color: 'item-yellow', name: 'Corn' },
            { id: 'eggplant', emoji: '🍆', color: 'item-purple', name: 'Eggplant' },
            { id: 'cucumber', emoji: '🥒', color: 'item-green', name: 'Cucumber' },
            { id: 'onion', emoji: '🧅', color: 'item-yellow', name: 'Onion' },
            { id: 'potato', emoji: '🥔', color: 'item-orange', name: 'Potato' }
        ]
    },
    animals: {
        name: '🐘 Animals',
        description: 'Cute and friendly animals',
        items: [
            { id: 'dog', emoji: '🐶', color: 'item-orange', name: 'Dog' },
            { id: 'cat', emoji: '🐱', color: 'item-yellow', name: 'Cat' },
            { id: 'rabbit', emoji: '🐰', color: 'item-pink', name: 'Rabbit' },
            { id: 'bear', emoji: '🐻', color: 'item-orange', name: 'Bear' },
            { id: 'lion', emoji: '🦁', color: 'item-yellow', name: 'Lion' },
            { id: 'elephant', emoji: '🐘', color: 'item-blue', name: 'Elephant' },
            { id: 'monkey', emoji: '🐵', color: 'item-orange', name: 'Monkey' },
            { id: 'panda', emoji: '🐼', color: 'item-green', name: 'Panda' }
        ]
    },
    bodyparts: {
        name: '👁️ Body Parts',
        description: 'Learn about your body',
        items: [
            { id: 'eye', emoji: '👁️', color: 'item-blue', name: 'Eye' },
            { id: 'nose', emoji: '👃', color: 'item-pink', name: 'Nose' },
            { id: 'mouth', emoji: '👄', color: 'item-red', name: 'Mouth' },
            { id: 'ear', emoji: '👂', color: 'item-orange', name: 'Ear' },
            { id: 'hand', emoji: '✋', color: 'item-yellow', name: 'Hand' },
            { id: 'leg', emoji: '🦶', color: 'item-pink', name: 'Leg' },
            { id: 'heart', emoji: '❤️', color: 'item-red', name: 'Heart' },
            { id: 'brain', emoji: '🧠', color: 'item-purple', name: 'Brain' }
        ]
    },
    family: {
        name: '👨‍👩‍👧‍👦 Family',
        description: 'Family members and relationships',
        items: [
            { id: 'mom', emoji: '👩', color: 'item-pink', name: 'Mom' },
            { id: 'dad', emoji: '👨', color: 'item-blue', name: 'Dad' },
            { id: 'girl', emoji: '👧', color: 'item-purple', name: 'Sister' },
            { id: 'boy', emoji: '👦', color: 'item-cyan', name: 'Brother' },
            { id: 'grandma', emoji: '👵', color: 'item-yellow', name: 'Grandma' },
            { id: 'grandpa', emoji: '👴', color: 'item-orange', name: 'Grandpa' },
            { id: 'baby', emoji: '👶', color: 'item-green', name: 'Baby' },
            { id: 'family', emoji: '👨‍👩‍👧‍👦', color: 'item-red', name: 'Family' }
        ]
    }
};

// Speech Synthesis
let speechSynthesis = window.speechSynthesis;
let speechVoice = null;

// Initialize Speech
function initSpeech() {
    if ('speechSynthesis' in window) {
        const setVoice = () => {
            const voices = speechSynthesis.getVoices();
            speechVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Google') || voice.name.includes('Microsoft'))
            ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        };

        if (speechSynthesis.getVoices().length > 0) {
            setVoice();
        } else {
            speechSynthesis.addEventListener('voiceschanged', setVoice);
        }
    }
}

// Pronounce Word
function pronounceWord(word) {
    if (!gameState.pronunciationEnabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    if (speechVoice) {
        utterance.voice = speechVoice;
    }
    
    speechSynthesis.speak(utterance);
}

// Play Sound
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            appear: 800,
            select: 600,
            success: 1000,
            failure: 300,
            clear: 400
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Utility Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSequenceLength() {
    const baseLengths = {
        easy: { min: 3, max: 4 },
        medium: { min: 4, max: 6 },
        hard: { min: 6, max: 8 }
    };
    
    const range = baseLengths[gameState.difficulty];
    const levelBonus = Math.floor(gameState.level / 3);
    const min = Math.min(range.min + levelBonus, 8);
    const max = Math.min(range.max + levelBonus, 10);
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate Sequence
function generateSequence() {
    const sequenceLength = getSequenceLength();
    const items = objectPools[gameState.selectedCategory].items;
    const shuffled = shuffleArray(items);
    const newSequence = [];
    
    for (let i = 0; i < sequenceLength; i++) {
        newSequence.push(shuffled[i % shuffled.length]);
    }
    
    gameState.currentSequence = newSequence;
    gameState.availableItems = shuffled;
    gameState.playerSequence = [];
}

// Show Sequence Animation
async function showSequenceAnimation() {
    gameState.showingSequence = true;
    document.getElementById('trayStatus').textContent = 'Watch carefully...';
    
    const delays = {
        slow: 1500,
        medium: 1000,
        fast: 700
    };
    
    const delay = delays[gameState.speed];
    const magicTray = document.getElementById('magicTray');
    magicTray.classList.add('active');
    
    for (let i = 0; i < gameState.currentSequence.length; i++) {
        const item = gameState.currentSequence[i];
        
        magicTray.innerHTML = `<div class="magic-item ${item.color} appear">${item.emoji}</div>`;
        playSound('appear');
        setTimeout(() => pronounceWord(item.name), 300);
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        await wait(delay);
        magicTray.innerHTML = '';
        await wait(200);
    }
    
    magicTray.classList.remove('active');
    gameState.showingSequence = false;
    document.getElementById('trayStatus').textContent = 'Now recreate the sequence!';
    showSelectionArea();
}

// Update Display
function updateDisplay() {
    document.getElementById('levelDisplay').textContent = gameState.level;
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('livesDisplay').textContent = gameState.lives;
    
    const progressPercent = (gameState.progress / gameState.maxProgress) * 100;
    document.getElementById('progressFill').style.width = progressPercent + '%';
    document.getElementById('progressText').textContent = `${gameState.progress}/${gameState.maxProgress}`;
}

// Show Category Selection
function showCategorySelection() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('categorySelection').style.display = 'block';
    
    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = '';
    
    Object.entries(objectPools).forEach(([key, pool]) => {
        const card = document.createElement('div');
        card.className = `category-card ${gameState.selectedCategory === key ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="category-icon">${pool.items[0].emoji}</div>
            <div class="category-name">${pool.name}</div>
            <div class="category-description">${pool.description}</div>
            <div class="category-preview">${pool.items.slice(0, 4).map(item => item.emoji).join(' ')}</div>
        `;
        card.addEventListener('click', () => selectCategory(key));
        categoryGrid.appendChild(card);
    });
    
    updateSelectedCategoryInfo();
}

// Select Category
function selectCategory(key) {
    gameState.selectedCategory = key;
    playSound('select');
    
    document.querySelectorAll('.category-card').forEach(card => card.classList.remove('selected'));
    event.target.closest('.category-card').classList.add('selected');
    
    updateSelectedCategoryInfo();
}

// Update Selected Category Info
function updateSelectedCategoryInfo() {
    const pool = objectPools[gameState.selectedCategory];
    document.getElementById('selectedName').textContent = pool.name;
    document.getElementById('selectedDescription').textContent = pool.description;
    
    const preview = document.getElementById('categoryPreview');
    preview.innerHTML = '';
    pool.items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'preview-item';
        span.textContent = item.emoji;
        preview.appendChild(span);
    });
}

// Start Game
function startGame() {
    gameState.isPlaying = true;
    gameState.startTime = new Date().toISOString();
    gameState.trials = 0;
    gameState.misses = 0;
    
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('currentCategory').style.display = 'block';
    document.getElementById('categoryName').textContent = objectPools[gameState.selectedCategory].name;
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('magicTrayContainer').style.display = 'block';
    document.getElementById('gameControls').style.display = 'flex';
    
    document.getElementById('trayTitle').textContent = objectPools[gameState.selectedCategory].name + ' Tray';
    
    generateSequence();
    showSequenceAnimation();
}

// Show Selection Area
function showSelectionArea() {
    const selectionArea = document.getElementById('selectionArea');
    selectionArea.style.display = 'block';
    
    const categoryName = objectPools[gameState.selectedCategory].name.split(' ')[1] || 'Items';
    document.getElementById('selectionTitle').textContent = `🎭 Select the ${categoryName}`;
    
    updateSelectionStatus();
    
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = '';
    
    objectPools[gameState.selectedCategory].items.forEach(item => {
        const div = document.createElement('div');
        div.className = `magic-item ${item.color}`;
        div.textContent = item.emoji;
        div.title = item.name;
        div.addEventListener('click', () => selectItem(item));
        itemsGrid.appendChild(div);
    });
}

// Update Selection Status
function updateSelectionStatus() {
    const emojis = gameState.playerSequence.map(item => item.emoji).join(' ');
    document.getElementById('selectionStatus').textContent = 
        `Selected: ${gameState.playerSequence.length}/${gameState.currentSequence.length} - ${emojis}`;
}

// Select Item
function selectItem(item) {
    if (gameState.playerSequence.length >= gameState.currentSequence.length) {
        return;
    }
    
    gameState.playerSequence.push(item);
    updateSelectionStatus();
    playSound('select');
    pronounceWord(item.name);
    
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
    
    if (gameState.playerSequence.length === gameState.currentSequence.length) {
        setTimeout(() => submitSequence(), 500);
    }
}

// Clear Selection
function clearSelection() {
    gameState.playerSequence = [];
    updateSelectionStatus();
    playSound('clear');
}

// Submit Sequence
function submitSequence() {
    gameState.trials++;
    
    // Check match
    const isCorrect = gameState.currentSequence.every((item, i) => item.id === gameState.playerSequence[i].id);
    
    if (isCorrect) {
        // Success Logic:
        // Max Progress = 4. Total Score = 100.
        // Each Level = 25 Points.
        const pointsPerLevel = 25;
        gameState.score += pointsPerLevel;
        gameState.progress++;
        
        playSound('success');
        
        if (gameState.progress >= gameState.maxProgress) {
            // Game Won
            showResult({ icon: '🏆', title: 'You Win!', message: 'All levels complete!', isCorrect: true });
        } else {
            showResult({ icon: '🌟', title: 'Perfect!', message: 'Next Level', isCorrect: true });
        }
        
    } else {
        // Failure Logic
        gameState.lives--;
        gameState.misses++;
        
        // Penalty: -5 points (don't go below 0)
        gameState.score = Math.max(0, gameState.score - 5);
        
        playSound('failure');
        
        if (gameState.lives <= 0) {
            showResult({ icon: '💀', title: 'Game Over', message: 'Out of lives!', isCorrect: false });
        } else {
            showResult({ icon: '❌', title: 'Wrong', message: 'Try again carefully.', isCorrect: false });
        }
    }
    
    updateDisplay();
    document.getElementById('selectionArea').style.display = 'none';
}

// Show Result
function showResult(result) {
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultMessage').textContent = result.message;
    document.getElementById('resultIcon').textContent = result.icon;
    
    const btn = document.getElementById('nextLevelBtn');
    
    if (gameState.lives <= 0 || gameState.progress >= gameState.maxProgress) {
        btn.textContent = "Finish Game";
        btn.onclick = () => sendSessionData();
    } else {
        btn.textContent = result.isCorrect ? "Next Level" : "Try Again";
        btn.onclick = () => nextLevel(result.isCorrect);
    }
    
    document.getElementById('resultOverlay').style.display = 'flex';
}

// Next Level
function nextLevel(wasCorrect) {
    document.getElementById('resultOverlay').style.display = 'none';
    
    if (wasCorrect) {
        // Generate new harder sequence
        generateSequence();
    } else {
        // Replay same sequence (easier)
        gameState.playerSequence = [];
    }
    
    showSequenceAnimation();
}

// Show Hint
function showHint() {
    if (!gameState.isPlaying || gameState.showingSequence) return;
    
    const hints = [
        `The sequence has ${gameState.currentSequence.length} items`,
        `First item was: ${gameState.currentSequence[0].emoji}`,
        `Last item was: ${gameState.currentSequence[gameState.currentSequence.length - 1].emoji}`,
        `Items included: ${gameState.currentSequence.slice(0, 2).map(item => item.emoji).join(', ')}...`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    alert(`💡 Hint: ${randomHint}`);
}

// Send Session Data to API
async function sendSessionData() {
    // 1. Show Modal immediately so user knows game is over
    // (Check if these elements exist in your HTML, if not, ignore these 2 lines)
    if(document.getElementById("finalScore")) document.getElementById("finalScore").innerText = gameState.score;
    if(document.getElementById("gameOverModal")) document.getElementById("gameOverModal").style.display = "flex";

    // 2. Calculate Final Stats
    // Map score to 100 scale (Max progress is 4)
    // Raw score can be high, so we scale it conservatively for the dashboard.
    let finalScore = Math.min(100, Math.round(gameState.score / 5)); 
    if (finalScore < 0) finalScore = 0;

    console.log(`Sending Score: ${finalScore}, Trials: ${gameState.trials}, Misses: ${gameState.misses}`);

    // 3. Send to Backend using SessionManager (Handles Auth & User ID)
    try {
        const success = await sessionMgr.submitScore(GAME_ID, finalScore, gameState.trials, gameState.misses);
        
        if (success) {
            console.log("✅ Save Successful");
            // Update UI if you have a specific success message element
            const savedMsg = document.querySelector('.saved-msg');
            if(savedMsg) {
                savedMsg.style.display = 'block';
                savedMsg.innerText = "✅ Saved to Doctor's Dashboard";
            }
        } else {
            throw new Error("Backend returned failure");
        }
    } catch (error) {
        console.error("❌ Save Failed:", error);
        const savedMsg = document.querySelector('.saved-msg');
        if(savedMsg) {
            savedMsg.innerText = "❌ Network Error - Score not saved";
            savedMsg.style.color = "red";
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initSpeech();
    
    document.getElementById('startBtn').addEventListener('click', showCategorySelection);
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    document.getElementById('clearBtn').addEventListener('click', clearSelection);
    document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);
    document.getElementById('hintBtn').addEventListener('click', showHint);
    document.getElementById('restartBtn').addEventListener('click', async () => {
        if (gameState.isPlaying && gameState.startTime) {
            await sendSessionData();
        }
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
    
    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsPanel').style.display = 'flex';
    });
    
    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        document.getElementById('settingsPanel').style.display = 'none';
    });
    
    document.getElementById('difficultySelect').addEventListener('change', (e) => {
        gameState.difficulty = e.target.value;
    });
    
    document.getElementById('speedSelect').addEventListener('change', (e) => {
        gameState.speed = e.target.value;
    });
    
    document.getElementById('soundCheckbox').addEventListener('change', (e) => {
        gameState.soundEnabled = e.target.checked;
    });
    
    document.getElementById('pronunciationCheckbox').addEventListener('change', (e) => {
        gameState.pronunciationEnabled = e.target.checked;
    });
    
});