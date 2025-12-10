// Initialize Manager with your API URL
const sessionMgr = new SessionManager('https://localhost:7101/api');

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user) {
        window.location.href = '../../login/index.html';
        return;
    }

    // 2. Sync Session Status (Only necessary for Kids)
    if (user.role === "3") {
        await sessionMgr.getActiveSession();
    }

    // 3. Update UI based on User Role & Session Status
    updateUI(user);
});

async function handleStartSession() {
    const btn = document.getElementById('btnStart');
    btn.innerText = "Starting...";
    btn.disabled = true;

    // Call API
    const sessionId = await sessionMgr.startSession();

    if (sessionId) {
        // Refresh UI with new status
        const user = JSON.parse(localStorage.getItem('user_details'));
        updateUI(user);
    } else {
        btn.innerText = "▶ Start Session";
        btn.disabled = false;
    }
}

async function handleEndSession() {
    if(!confirm("Are you sure you want to finish therapy for today?")) return;

    const success = await sessionMgr.endSession();
    if (success) {
        const user = JSON.parse(localStorage.getItem('user_details'));
        updateUI(user);
    } else {
        alert("Failed to end session.");
    }
}

function updateUI(user) {
    const btnStart = document.getElementById('btnStart');
    const btnEnd = document.getElementById('btnEnd');
    const badge = document.getElementById('session-badge');
    const cards = document.querySelectorAll('.game-card');

    // --- SCENARIO A: DOCTOR OR ADMIN (Practice Mode) ---
    if (user && (user.role === "1" || user.role === "2")) {
        // 1. Badge Status
        badge.innerHTML = '<i class="fa-solid fa-user-shield"></i> Practice Mode';
        badge.style.color = "#64748b"; // Grey
        badge.style.border = "1px solid #64748b";
        badge.title = "Scores will not be saved";

        // 2. Hide Session Controls (Not needed)
        if(btnStart) btnStart.style.display = 'none';
        if(btnEnd) btnEnd.style.display = 'none';

        // 3. ALWAYS Unlock Games
        cards.forEach(card => {
            card.classList.remove('locked');
            card.onclick = function() { 
                const text = this.querySelector('h3').innerText;
                const id = text.split('.')[0]; 
                playGame(id); 
            };
        });
        return; // STOP here.
    }

    // --- SCENARIO B: CHILD (Regular Logic) ---
    const isActive = sessionMgr.isSessionActive();

    if (isActive) {
        // Active Session
        if(btnStart) btnStart.style.display = 'none';
        if(btnEnd) btnEnd.style.display = 'inline-block';
        
        badge.innerText = "Session Active 🟢";
        badge.style.color = "#22c55e";
        badge.style.border = "1px solid #22c55e";

        // Unlock Games
        cards.forEach(card => {
            card.classList.remove('locked');
            card.onclick = function() { 
                const text = this.querySelector('h3').innerText;
                const id = text.split('.')[0]; 
                playGame(id); 
            };
        });

    } else {
        // No Session
        if(btnStart) {
            btnStart.style.display = 'inline-block';
            btnStart.innerText = "▶ Start Session";
            btnStart.disabled = false;
        }
        if(btnEnd) btnEnd.style.display = 'none';

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
    const user = JSON.parse(localStorage.getItem('user_details'));

    // 1. Guard for KIDS only
    if (user.role === "3" && !sessionMgr.isSessionActive()) {
        alert("Please click 'Start Session' first!");
        return;
    }

    // 2. Navigate to Game
    window.location.href = `Game${gameId}/index.html`;
}

function goHome() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    
    // Logic: If kid clicks "Back", they effectively Logout since they can't see the dashboard
    if (user.role === "3") {
        if(confirm("Log out?")) {
            localStorage.clear();
            window.location.href = '../login/index.html';
        }
    } else {
        // Doctors/Admins go back to dashboard
        window.location.href = '../Home/home.html';
    }

}