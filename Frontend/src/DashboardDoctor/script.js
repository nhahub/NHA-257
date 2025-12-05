// --- CONFIG ---
const API_BASE = 'https://localhost:7101/api'; 

// --- STATE ---
let allPatients = []; 
let filteredPatients = [];
let selectedPatient = null;
let charts = { iqTrend: null, categoryChart: null };

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user || user.role !== "2") { // Ensure Doctor
        window.location.href = '../login/index.html';
        return;
    }

    // 2. Fill Profile Info
    const displayName = user.name.includes('@') ? user.name.split('@')[0] : user.name;
    document.getElementById('docName').innerText = `Dr. ${displayName}`; 
    document.getElementById('headerDocName').innerText = `Dr. ${displayName}`;

    // 3. Fetch Data
    await fetchPatients();
});


async function loadDoctorProfile() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user) return;

    // 1. Set Email immediately (we have it in local storage)
    // If user.name is an email, use it. Otherwise, assume it's just a name.
    const emailText = user.name.includes('@') ? user.name : "Email hidden";
    document.getElementById('docEmail').innerText = emailText;

    try {
        // 2. Fetch Full Profile from API
        const res = await fetch(`${API_BASE}/Doctor/profile`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            
            // Update Name
            document.getElementById('docName').innerText = `Dr. ${data.fullName}`;
            document.getElementById('headerDocName').innerText = `Dr. ${data.fullName}`;
            
            // Update Phone
            document.getElementById('docPhone').innerText = data.phone || "No phone linked";

            // Update Specialty
            document.getElementById('docSpecialty').innerText = `Specialist: ${data.specialty || 'General Practice'}`;
        }
    } catch (e) { 
        console.error("Profile load error:", e); 
    }
}

// Ensure this runs on load
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing checks ...
    loadDoctorProfile(); // <--- Make sure this is called!
    // ... existing fetches ...
});

// Add this to your DOMContentLoaded event
loadDoctorProfile();


// --- API: FETCH & TRANSFORM DATA ---
async function fetchPatients() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    
    try {
        const res = await fetch(`${API_BASE}/Doctor/dashboard`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        if (!res.ok) throw new Error('Failed to load data');
        
        const rawData = await res.json();
        
        // TRANSFORM: Convert Flat List -> Patient Objects
        allPatients = processBackendData(rawData);
        
        filteredPatients = [...allPatients];
        updateKPIs();
        renderPatientTable();

    } catch (err) {
        console.error('Error:', err);
        document.getElementById('patientTableBody').innerHTML = `<tr><td colspan="6" style="color:red;text-align:center;">Failed to load patients.</td></tr>`;
    }
}

// --- HELPER: Process Flat Data into Objects ---
function processBackendData(data) {
    const patientsMap = {};

    data.forEach(row => {
        if (!patientsMap[row.childId]) {
            patientsMap[row.childId] = {
                id: row.childId,
                name: row.childName,
                parent: row.parentName,
                age: calculateAge(row.dateOfBirth),
                history: []
            };
        }
        
        // Add game session to history
        if (row.gameId) {
            patientsMap[row.childId].history.push({
                gameId: row.gameId,
                score: row.gameScore,
                date: row.sessionDate,
                category: getCategoryName(row.gameId)
            });
        }
    });

    return Object.values(patientsMap);
}

// --- API: LINK PATIENT ---
async function linkPatient() {
    const email = document.getElementById('linkEmail').value;
    const msgDiv = document.getElementById('linkMsg');
    const user = JSON.parse(localStorage.getItem('user_details'));

    if (!email) return;
    msgDiv.innerText = "Processing...";
    msgDiv.style.color = "gray";

    try {
        const res = await fetch(`${API_BASE}/Doctor/assign`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
            body: JSON.stringify({ childEmail: email })
        });

        if (res.ok) {
            msgDiv.innerText = "Success! Patient linked.";
            msgDiv.style.color = "green";
            document.getElementById('linkEmail').value = "";
            fetchPatients(); // Reload list
        } else {
            const err = await res.json();
            msgDiv.innerText = err.message || "Failed (Ensure child profile exists)";
            msgDiv.style.color = "red";
        }
    } catch (e) {
        msgDiv.innerText = "Network Error";
        msgDiv.style.color = "red";
    }
}

// --- UTILITIES ---
function calculateAge(dob) {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getCategoryName(id) {
    if(id <= 3) return "Working";
    if(id <= 6) return "Episodic";
    if(id <= 9) return "Visual";
    return "Auditory";
}

function fmtDate(iso) {
    if(!iso) return "-";
    return new Date(iso).toLocaleDateString();
}

// --- RENDER TABLE ---
function renderPatientTable() {
    const body = document.getElementById('patientTableBody');
    body.innerHTML = '';
    
    if(filteredPatients.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center;">No patients found. Link a child above!</td></tr>`;
        return;
    }

    filteredPatients.forEach(p => {
        // Calculate Avg Score
        const totalScore = p.history.reduce((sum, h) => sum + h.score, 0);
        const avg = p.history.length ? Math.round(totalScore / p.history.length) : 0;
        const lastPlayed = p.history.length ? fmtDate(p.history[p.history.length-1].date) : "Never";

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${p.name}</b></td>
            <td>${p.age}</td>
            <td>${p.parent || '-'}</td>
            <td>${lastPlayed}</td>
            <td><span style="background:${avg >= 80 ? '#dcfce7' : '#fee2e2'}; padding:4px 8px; border-radius:10px; font-weight:bold; color:${avg >= 80 ? '#166534' : '#991b1b'}">${avg}</span></td>
            <td style="text-align:right">
                <button class="btn-view" onclick="selectPatient(${p.id})">View Analytics</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

// --- UPDATE KPIs ---
function updateKPIs() {
    document.getElementById('kpiTotalPatients').textContent = allPatients.length;
    document.getElementById('leftTotalPatients').textContent = allPatients.length;
    
    const totalSessions = allPatients.reduce((sum, p) => sum + p.history.length, 0);
    document.getElementById('kpiAssessments').textContent = totalSessions;
    document.getElementById('leftAssessments').textContent = totalSessions;
}

// --- ANALYTICS & CHARTS ---
async function selectPatient(id) {
    selectedPatient = allPatients.find(p => p.id === id);
    if (!selectedPatient) return;

    // 1. Update Header Info
    document.getElementById('childName').textContent = selectedPatient.name;
    document.getElementById('childSubtitle').textContent = `Parent: ${selectedPatient.parent} • Age: ${selectedPatient.age}`;
    document.getElementById('childAvatar').innerText = selectedPatient.name.substring(0, 2).toUpperCase();

    // 2. Set "Loading" State for AI
    const aiBox = document.getElementById('aiInsights');
    aiBox.innerHTML = '<span style="color:#666">🤖 AI is analyzing performance...</span>';

    // 3. Call Backend to get AI Prediction
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Doctor/predict/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        const data = await res.json();
        
        // 4. Show the Result from Python
        aiBox.innerHTML = `<strong>AI Analysis:</strong><br>${data.insight}`;
        aiBox.style.borderLeft = "4px solid #7c5cff"; // Purple accent
        
    } catch (e) {
        aiBox.innerText = "AI Service Unavailable (Check if Python is running)";
    }

    // 5. Render Charts
    renderCharts(selectedPatient);

    // 6. Switch Tab
    document.querySelector('[data-tab="analyticsTab"]').click();
}

function renderCharts(p) {
    // 1. Trend Chart
    const ctx1 = document.getElementById('iqTrend').getContext('2d');
    if (charts.iqTrend) charts.iqTrend.destroy();
    
    charts.iqTrend = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: p.history.map(h => new Date(h.date).toLocaleDateString()),
            datasets: [{
                label: 'Game Score',
                data: p.history.map(h => h.score),
                borderColor: '#2563eb',
                tension: 0.3
            }]
        }
    });

    // 2. Category Pie Chart
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    if (charts.categoryChart) charts.categoryChart.destroy();

    const cats = { "Working": 0, "Episodic": 0, "Visual": 0, "Auditory": 0 };
    p.history.forEach(h => { cats[h.category]++; });

    charts.categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(cats),
            datasets: [{
                data: Object.values(cats),
                backgroundColor: ['#4fc3f7', '#ba68c8', '#ffb74d', '#4db6ac']
            }]
        }
    });
}

// --- TABS & SEARCH ---
document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
});

document.getElementById('searchInput').addEventListener('input', function() {
    const val = this.value.toLowerCase();
    filteredPatients = allPatients.filter(p => p.name.toLowerCase().includes(val));
    renderPatientTable();
});

// --- TAB SWITCHING LOGIC ---
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // 1. Remove 'active' class from all buttons and contents
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // 2. Add 'active' class to clicked button
        button.classList.add('active');

        // 3. Show the corresponding tab content
        const tabId = button.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    });
});

function handleLogout() {
    localStorage.clear();
    window.location.href = '../login/index.html';
}