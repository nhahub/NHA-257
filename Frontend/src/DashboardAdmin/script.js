const API_BASE = 'https://localhost:7101/api';
let allUsers = [];
let currentView = 'doctor'; 
let selectedUserId = null; // Store ID for actions
let selectedUserIsActive = false; // Store status

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    loadStats();
    loadUsers();
});

// --- SECURITY ---
function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user || user.role !== "1") { 
        alert("⛔ Access Denied. Admin Only.");
        window.location.href = '../Home/home.html';
    }
}

// --- DATA LOADING ---
async function loadStats() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Admin/stats`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        
        document.getElementById('statDoctors').innerText = data.totalDoctors || 0;
        document.getElementById('statChildren').innerText = data.totalChildren || 0;
        document.getElementById('statGames').innerText = data.totalGamesPlayed || 0;
        document.getElementById('statActive').innerText = data.totalActiveSessions || 0;
    } catch(e) { console.error(e); }
}

async function loadUsers() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Admin/users`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        allUsers = await res.json();
        renderCurrentView(); 
    } catch(e) { console.error(e); }
}

// --- RENDERING ---
function switchTable(type) {
    currentView = type;
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    document.getElementById('doctorTableContainer').classList.toggle('hidden', type !== 'doctor');
    document.getElementById('childTableContainer').classList.toggle('hidden', type !== 'child');
    renderCurrentView();
}

function renderCurrentView() {
    const term = document.getElementById('searchBox').value.toLowerCase();
    const tbody = currentView === 'doctor' ? document.getElementById('doctorsTableBody') : document.getElementById('kidsTableBody');
    const roleFilter = currentView === 'doctor' ? 'Doctor' : 'Child';

    const users = allUsers.filter(u => u.role === roleFilter && 
        (u.email.toLowerCase().includes(term) || (u.fullName && u.fullName.toLowerCase().includes(term))));

    tbody.innerHTML = users.map(u => {
        
        // --- SMART CHECK: Handles both 'isActive' AND 'isDeleted' ---
        // If u.isActive exists, use it. Otherwise, assume !u.isDeleted.
        let isUserActive = true; 
        if (u.isActive !== undefined) {
            isUserActive = u.isActive;
        } else if (u.isDeleted !== undefined) {
            isUserActive = !u.isDeleted;
        }
        // -----------------------------------------------------------

        return `
        <tr onclick="openUserModal(${u.userId})">
            <td>#${u.userId}</td>
            <td>
                <div style="font-weight:bold">${u.fullName || 'No Name'}</div>
                <div style="font-size:0.8em; color:gray">${u.email}</div>
            </td>
            ${currentView === 'doctor' 
                ? `<td>${u.specialty || 'General'}</td><td>${u.phone || '-'}</td><td><span class="badge Doctor">${u.assignedCount || 0} Kids</span></td>`
                : `<td>${u.address || '-'}</td><td>${u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString() : '-'}</td><td>${u.phone || '-'}</td>`
            }
            <td>
                ${isUserActive 
                    ? '<span style="color:green; font-weight:bold;">Active</span>' 
                    : '<span style="color:red; font-weight:bold;">Not Active</span>'
                }
            </td>
        </tr>
    `}).join('');
}

// REPLACE THE ENTIRE 'openUserModal' FUNCTION WITH THIS:
async function openUserModal(id) {
    const user = JSON.parse(localStorage.getItem('user_details'));
    selectedUserId = id;

    try {
        const res = await fetch(`${API_BASE}/Admin/user/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        if (!res.ok) throw new Error("Could not fetch details");
        const data = await res.json();
        
        selectedUserIsActive = !data.isDeleted; // Store active status

        // 1. Basic Info (Header)
        document.getElementById('modalName').innerText = data.fullName || "Unknown";
        document.getElementById('modalEmail').innerText = data.email;
        
        // 2. Setup Deactivate Button Color
        const btnToggle = document.getElementById('btnToggleStatus');
        btnToggle.innerText = selectedUserIsActive ? "Deactivate User" : "Activate User";
        btnToggle.className = selectedUserIsActive ? "btn-action btn-toggle" : "btn-action"; 
        btnToggle.style.background = selectedUserIsActive ? "#f59e0b" : "#10b981"; // Orange vs Green

        // 3. Dynamic Details (The Fix You Asked For)
        const container = document.getElementById('modalDetails');
        
        if (data.userTypeId === 2) { // DOCTOR
            container.innerHTML = `
                <div class="detail-row"><span class="detail-label">System ID:</span> <span class="detail-value">#${data.userId}</span></div>
                <div class="detail-row"><span class="detail-label">Specialty:</span> <span class="detail-value">${data.specialty}</span></div>
                <div class="detail-row"><span class="detail-label">Address:</span> <span class="detail-value">${data.address || 'No Address'}</span></div>
                <div class="detail-row"><span class="detail-label">Phone:</span> <span class="detail-value">${data.phone || '-'}</span></div>
                <div class="detail-row"><span class="detail-label">Total Patients:</span> <span class="detail-value badge Doctor">${data.associatedCount} Kids</span></div>
            `;
        } else { // CHILD
            container.innerHTML = `
                <div class="detail-row"><span class="detail-label">System ID:</span> <span class="detail-value">#${data.userId}</span></div>
                <div class="detail-row"><span class="detail-label">Parent:</span> <span class="detail-value">${data.parentName}</span></div>
                <div class="detail-row"><span class="detail-label">Address:</span> <span class="detail-value">${data.address || 'No Address'}</span></div>
                <div class="detail-row"><span class="detail-label">Phone:</span> <span class="detail-value">${data.phone || '-'}</span></div>
                <div class="detail-row"><span class="detail-label">Assigned Dr:</span> <span class="detail-value" style="color:#7c5cff; font-weight:bold">${data.assignedDoctor || 'Not Assigned'}</span></div>
                <div class="detail-row"><span class="detail-label">Age:</span> <span class="detail-value">${calculateAge(data.dateOfBirth)}</span></div>
            `;
        }

        document.getElementById('userModal').classList.add('active');

    } catch (e) {
        console.error(e);
        alert("Error loading details. Check console.");
    }
}

function closeModal() {
    document.getElementById('userModal').classList.remove('active');
}

// --- ACTIONS ---
async function toggleUserStatus() {
    const action = selectedUserIsActive ? "DEACTIVATE" : "ACTIVATE";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    await sendUserAction(action);
}

async function deleteUser() {
    if (!confirm("⚠️ WARNING: This will PERMANENTLY delete the user and all their game history.\n\nAre you sure?")) return;
    await sendUserAction("DELETE");
}

async function sendUserAction(actionType) {
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Admin/manage-user`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: selectedUserId, actionType: actionType })
        });

        if (res.ok) {
            alert("Action successful!");
            closeModal();
            loadUsers(); // Refresh table
        } else {
            alert("Action failed.");
        }
    } catch (e) {
        console.error(e);
        alert("Network error.");
    }
}

function calculateAge(dob) {
    if (!dob) return '-';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + " Years";
}

function filterUsers() { renderCurrentView(); }

// --- LOGOUT LOGIC ---
function handleLogout() {
    // 1. Clear credentials
    localStorage.removeItem('user_details');
    localStorage.clear();

    // 2. Redirect to Login Page
    window.location.href = '../login/index.html'; 
}