document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is logged in
    const userJson = localStorage.getItem('user_details');
    
    if (!userJson) {
        window.location.href = '../Login/login.html';
        return;
    }

    const user = JSON.parse(userJson);

    // 2. Display Name
    const welcome = document.getElementById('welcome-msg');
    // Extract name from email if fullname isn't available
    const displayName = user.name || "User"; 
    welcome.innerHTML = `Hi, <b>${displayName}</b>`;
});

// Navigation Logic with Role Checks
function navigateTo(area) {
    const user = JSON.parse(localStorage.getItem('user_details'));
    const role = user ? user.role : null; // "1"=Admin, "2"=Doctor, "3"=Child

    if (area === 'games') {
        // Anyone can technically see games, but usually for kids
        window.location.href = '../Games/menu.html';
    } 
    else if (area === 'doctor') {
        // SECURITY CHECK: Only Doctors (Role "2")
        if (role === "2") {
            window.location.href = '../DashboardDoctor/dashboard.html';
        } else {
            alert("⛔ Access Denied. This area is for Doctors only.");
        }
    } 
    else if (area === 'admin') {
        // SECURITY CHECK: Only Admins (Role "1")
        if (role === "1") {
            // --- FIX: Redirect to the new dashboard folder ---
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