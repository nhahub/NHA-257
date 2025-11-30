// Initialize Manager with your API URL
const sessionMgr = new SessionManager('https://localhost:7101/api');

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ask Server: "Am I playing?"
    const activeId = await sessionMgr.getActiveSession();
    
    // 2. Update UI based on Server Truth
    updateUI();
    
    if (activeId) {
        console.log("Resuming Session:", activeId);
    }
});

async function handleStartSession() {
    const btn = document.getElementById('btnStart');
    btn.innerText = "Starting...";
    btn.disabled = true;

    // Call API
    const sessionId = await sessionMgr.startSession();

    if (sessionId) {
        alert(`Session Started! (ID: ${sessionId})`);
        updateUI();
    } else {
        btn.innerText = "▶ Start Session";
        btn.disabled = false;
    }
}

async function handleEndSession() {
    if(!confirm("Are you sure you want to finish therapy for today?")) return;

    const success = await sessionMgr.endSession();
    if (success) {
        updateUI();
    } else {
        alert("Failed to end session.");
    }
}

function updateUI() {
    const btnStart = document.getElementById('btnStart');
    const btnEnd = document.getElementById('btnEnd');
    const badge = document.getElementById('session-badge');
    const cards = document.querySelectorAll('.game-card');
    
    // Check Status
    const isActive = sessionMgr.isSessionActive();

    if (isActive) {
        // SHOW "End", HIDE "Start"
        btnStart.style.display = 'none';
        btnEnd.style.display = 'inline-block';
        
        badge.innerText = "Session Active 🟢";
        badge.style.color = "#22c55e";
        badge.style.border = "1px solid #22c55e";

        // Unlock Games
        cards.forEach(card => {
            card.classList.remove('locked');
            card.onclick = function() { 
                // Get the game ID from the H3 text (e.g. "1. Simon Says" -> 1)
                const text = this.querySelector('h3').innerText;
                const id = text.split('.')[0]; 
                playGame(id); 
            };
        });

    } else {
        // SHOW "Start", HIDE "End"
        btnStart.style.display = 'inline-block';
        btnEnd.style.display = 'none';
        btnStart.innerText = "▶ Start Session";
        btnStart.disabled = false;

        badge.innerText = "No Active Session 🔴";
        badge.style.color = "#ef4444";
        badge.style.border = "1px solid #ef4444";

        // Lock Games
        cards.forEach(card => {
            card.classList.add('locked');
            card.onclick = null; // Disable clicking
        });
    }
}

function playGame(gameId) {
    // 1. Check if session is active
    if (!sessionMgr.isSessionActive()) {
        alert("Please click 'Start Session' first!");
        return;
    }

    // 2. Navigate to the game folder
    // This assumes folders are named Game1, Game2, Game3...
    window.location.href = `Game${gameId}/index.html`;
}

function goHome() {
    window.location.href = '../Home/home.html';
}