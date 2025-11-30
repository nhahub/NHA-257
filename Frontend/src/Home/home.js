document.addEventListener('DOMContentLoaded', () => {
    // 1. Check if user is logged in
    const userJson = localStorage.getItem('user_details');
    
    if (!userJson) {
        // Not logged in? Go back to login
        window.location.href = '../Login/login.html';
        return;
    }

    const user = JSON.parse(userJson);

    // 2. Display Name and Role
    const welcome = document.getElementById('welcome-msg');
    welcome.innerHTML = `Hi, <b>${user.name || 'User'}</b>`;
});

// Navigation Logic
function navigateTo(area) {
    if (area === 'games') {
        // Link to the new menu we just made
        window.location.href = '../Games/menu.html';
    }
    else if (area === 'doctor') {
        // window.location.href = '../DashboardDoctor/dashboard.html';
        alert("Doctor Dashboard coming soon!");
    } 
    else if (area === 'admin') {
        // window.location.href = '../DashboardAdmin/dashboard.html';
        alert("Admin Panel coming soon!");
    }
}

// Logout Logic
function handleLogout() {
    if(confirm("Sign out?")) {
        localStorage.removeItem('user_details');
        localStorage.removeItem('token');
        window.location.href = '../login/index.html';
    }
}