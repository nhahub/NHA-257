document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is logged in
    const userJson = localStorage.getItem('user_details');
    
    if (!userJson) {
        // Redirect to Login if not found
        window.location.href = '../../login/index.html'; // Ensure path is correct relative to this file
        return;
    }

    const user = JSON.parse(userJson);

    // --- SECURITY REDIRECT (Kids) ---
    // If a Kid (Role 3) tries to access this Home Hub, redirect them to Games immediately.
    if (user.role === "3") {
        window.location.href = '../Games/menu.html';
        return; // Stop execution
    }

    // 2. Display Name
    const welcome = document.getElementById('welcome-msg');
    const displayName = user.name || "User"; 
    if(welcome) welcome.innerHTML = `Hi, <b>${displayName}</b>`;

    // --- UI ROLE MANAGEMENT (Hide/Show Cards) ---
    // We try to find the cards by their onclick function (e.g., navigateTo('admin'))
    // This ensures it works even if you haven't assigned specific IDs to the cards yet.
    const adminCard = document.querySelector("[onclick=\"navigateTo('admin')\"]");
    const doctorCard = document.querySelector("[onclick=\"navigateTo('doctor')\"]");

    // Step A: Hide sensitive cards by default
    if (adminCard) adminCard.style.display = 'none';
    if (doctorCard) doctorCard.style.display = 'none';

    // Step B: Show based on Role
    if (user.role === "1") { 
        // Admin: Show Admin Panel
        if (adminCard) adminCard.style.display = 'flex'; // Or 'block' depending on your CSS
    } 
    else if (user.role === "2") {
        // Doctor: Show Doctor Dashboard
        if (doctorCard) doctorCard.style.display = 'flex'; 
    }
});

// Navigation Logic (Keep this as a secondary security check)
function navigateTo(area) {
    const user = JSON.parse(localStorage.getItem('user_details'));
    const role = user ? user.role : null; 

    if (area === 'games') {
        // Anyone can see games
        window.location.href = '../Games/menu.html';
    } 
    else if (area === 'doctor') {
        if (role === "2") {
            window.location.href = '../DashboardDoctor/dashboard.html';
        } else {
            alert("⛔ Access Denied. This area is for Doctors only.");
        }
    } 
    else if (area === 'admin') {
        if (role === "1") {
            window.location.href = '../DashboardAdmin/dashboard.html';
        } else {
            alert("⛔ Access Denied. This area is for Administrators only.");
        }
    }
}

function handleLogout() {
    if(confirm("Sign out?")) {
        localStorage.clear(); 
        sessionStorage.clear(); 
        window.location.href = '../login/index.html';
    }
}
