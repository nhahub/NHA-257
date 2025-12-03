const API_BASE = 'https://localhost:7101/api';
let allUsers = [];
let currentView = 'doctor'; // 'doctor' or 'child'

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    loadStats();
    loadUsers();
});

// Security Check
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user || user.role !== "1") { 
        alert("⛔ Access Denied. Admin Only.");
        window.location.href = '../Home/home.html';
    }
}

// 1. Fetch Stats (Updated)
async function loadStats() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Admin/stats`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        
        document.getElementById('statDoctors').innerText = data.totalDoctors;
        document.getElementById('statChildren').innerText = data.totalChildren;
        // Updated Fields
        document.getElementById('statGames').innerText = data.totalGamesPlayed;
        document.getElementById('statActive').innerText = data.totalActiveSessions;
    } catch(e) { console.error(e); }
}

// 2. Fetch Users & Render
async function loadUsers() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Admin/users`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        allUsers = await res.json();
        renderCurrentView(); // Render based on current selection
    } catch(e) { 
        console.error(e);
    }
}

// 3. Switch Table Logic
function switchTable(type) {
    currentView = type;
    
    // Update Tabs UI
    const btns = document.querySelectorAll('.tab-button');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active'); // Highlight clicked button

    // Toggle Table Visibility
    if (type === 'doctor') {
        document.getElementById('doctorTableContainer').classList.remove('hidden');
        document.getElementById('childTableContainer').classList.add('hidden');
    } else {
        document.getElementById('doctorTableContainer').classList.add('hidden');
        document.getElementById('childTableContainer').classList.remove('hidden');
    }

    renderCurrentView();
}

// 4. Render Logic (Split by Type)
function renderCurrentView() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    
    if (currentView === 'doctor') {
        // --- RENDER DOCTORS ---
        const doctors = allUsers.filter(u => u.role === 'Doctor' && 
            (u.email.toLowerCase().includes(term) || (u.fullName && u.fullName.toLowerCase().includes(term))));
        
        const tbody = document.getElementById('doctorsTableBody');
        tbody.innerHTML = doctors.map(u => `
            <tr>
                <td>#${u.userId}</td>
                <td>
                    <div style="font-weight:bold">${u.fullName || 'No Name'}</div>
                    <div style="font-size:0.8em; color:gray">${u.email}</div>
                </td>
                <td>${u.specialty || 'General'}</td>
                <td>${u.phone || '-'}</td>
                <td><span class="badge Doctor">${u.assignedCount} Kids</span></td>
                <td>${u.isActive ? '<span style="color:green">Active</span>' : '<span style="color:red">Inactive</span>'}</td>
            </tr>
        `).join('');
    } 
    else {
        // --- RENDER KIDS ---
        const kids = allUsers.filter(u => u.role === 'Child' && 
            (u.email.toLowerCase().includes(term) || (u.fullName && u.fullName.toLowerCase().includes(term))));
        
        const tbody = document.getElementById('kidsTableBody');
        
        tbody.innerHTML = kids.map(u => `
            <tr>
                <td>#${u.userId}</td>
                <td>
                    <div style="font-weight:bold">${u.fullName || 'No Name'}</div>
                    <div style="font-size:0.8em; color:gray">${u.email}</div>
                </td>
                <td>${u.address || '-'}</td>
                <td>${u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : '-'}</td>
                <td>${u.phone || '-'}</td>
                <td>${u.isActive ? '<span style="color:green">Active</span>' : '<span style="color:red">Inactive</span>'}</td>
            </tr>
        `).join('');
    }
}

// Search Trigger
function filterUsers() {
    renderCurrentView();
}

function handleLogout() {
    localStorage.clear();
    window.location.href = '../../Login/login.html';
}