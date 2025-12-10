class SessionManager {
    constructor(apiBaseUrl) {
        // Ensure this matches your running .NET API port
        this.baseUrl = apiBaseUrl; 
        this.user = this.getUser(); // Cache user on init
    }

    // --- HELPER: Get User Details from Storage ---
    getUser() {
        const userStr = localStorage.getItem('user_details');
        return userStr ? JSON.parse(userStr) : null;
    }

    // --- HELPER: Get Auth Headers (The Key Card) ---
    getAuthHeaders() {
        const user = this.getUser();
        if (!user || !user.token) return null;
        
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // <--- Attach Token
        };
    }

    // --- 1. START SESSION ---
    async startSession() {
        const user = this.getUser();
        if (!user) { alert("Please login first"); return null; }

        try {
            const response = await fetch(`${this.baseUrl}/GameSession/start`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ userId: parseInt(user.userId) }) // Send ID
            });

            const data = await response.json();

            if (response.ok) {
                // Save Session ID to memory so we know we are "Active"
                sessionStorage.setItem('active_session_id', data.sessionId);
                return data.sessionId;
            } else {
                console.error(data);
                alert("Error: " + (data.error || data.message || "Could not start session"));
                return null;
            }
        } catch (error) {
            console.error("Network Error:", error);
            return null;
        }
    }

    // --- 2. END SESSION ---
    async endSession() {
        const user = this.getUser();
        if (!user) return false;

        try {
            const response = await fetch(`${this.baseUrl}/GameSession/end`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ userId: parseInt(user.userId) })
            });

            if (response.ok) {
                sessionStorage.removeItem('active_session_id'); // Clear memory
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    // --- 3. CHECK STATUS (Is session active?) ---
    // UPDATED: Admins (1) and Doctors (2) bypass this check
    isSessionActive() {
        const user = this.getUser();
        
        // Allow Admins and Doctors to play without starting a "Medical Session"
        if (user && (user.role === "1" || user.role === "2")) {
            return true; 
        }

        // For Kids, check the storage
        return sessionStorage.getItem('active_session_id') !== null;
    }

    // --- 4. GET ACTIVE SESSION (Sync) ---
    async getActiveSession() {
        const user = this.getUser();
        if (!user) return null;

        try {
            const response = await fetch(`${this.baseUrl}/GameSession/active/${user.userId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sessionId) {
                    sessionStorage.setItem('active_session_id', data.sessionId);
                    return data.sessionId;
                }
            }
        } catch (error) {
            console.error("Sync Error:", error);
        }
        
        sessionStorage.removeItem('active_session_id');
        return null;
    }

    // --- 5. SUBMIT SCORE ---
    async submitScore(gameId, score, trials, misses) {
        const user = this.getUser();
        if (!user) return false;

        // --- SECURITY GUARD: BLOCK NON-KIDS ---
        // If user is Admin (1) or Doctor (2), DO NOT save score.
        if (user.role !== "3") {
            console.log("🚫 Score submission skipped: User is not a child.");
            return true; // Pretend it succeeded so the game doesn't crash
        }

        const payload = {
            userId: parseInt(user.userId),
            gameId: gameId,
            score: score,
            trials: trials,
            misses: misses
        };

        try {
            const response = await fetch(`${this.baseUrl}/GameSession/submit`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log("Score Saved! ✅");
                return true;
            } else {
                const err = await response.json();
                console.error("Score Error:", err);
                // alert("Failed to save score: " + (err.error || err.message)); // Optional: Disable alert for smoother play
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}