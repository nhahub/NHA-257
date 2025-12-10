// --- CONFIG ---
const API_BASE = 'https://localhost:7101/api'; 

// --- STATE ---
let allPatients = []; 
let filteredPatients = [];
let selectedPatient = null;
let charts = { iqTrend: null, categoryChart: null, cognitiveRadar: null };

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Login
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user || user.role !== "2") { 
        window.location.href = '../login/index.html';
        return;
    }

    // 2. Load Doctor Profile Info
    loadDoctorProfile();

    // 3. Fetch Data
    await fetchPatients();
});

// --- LOAD PROFILE ---
async function loadDoctorProfile() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (!user) return;

    // Default info from local storage
    const displayName = user.name.includes('@') ? user.name.split('@')[0] : user.name;
    document.getElementById('docName').innerText = `Dr. ${displayName}`;
    document.getElementById('headerDocName').innerText = `Dr. ${displayName}`;
    document.getElementById('docEmail').innerText = user.email || user.name; // Fallback
    

    try {
        const res = await fetch(`${API_BASE}/Doctor/profile`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            document.getElementById('docName').innerText = `Dr. ${data.fullName || displayName}`;
            document.getElementById('headerDocName').innerText = `Dr. ${data.fullName || displayName}`;
            document.getElementById('docPhone').innerText = data.phone || "No phone linked";
            document.getElementById('docSpecialty').innerText = data.specialization ? `Specialist: ${data.specialization}` : "General Specialist";
        }
    } catch (e) { 
        console.log("Profile load error (using defaults):", e); 
    }
}

// --- API: FETCH & TRANSFORM DATA ---
async function fetchPatients() {
    const user = JSON.parse(localStorage.getItem('user_details'));
    
    try {
        const res = await fetch(`${API_BASE}/Doctor/dashboard`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        if (!res.ok) throw new Error('Failed to load data');
        
        const rawData = await res.json();
        
        // TRANSFORM DATA
        allPatients = processBackendData(rawData);
        filteredPatients = [...allPatients];
        
        // UPDATE DASHBOARD
        updateKPIs();
        renderPatientTable();

    } catch (err) {
        console.error('Error:', err);
        document.getElementById('patientTableBody').innerHTML = `<tr><td colspan="6" style="color:red;text-align:center;">Failed to load patients. Is Backend Running?</td></tr>`;
    }
}

// --- PROCESS DATA (Advanced Logic) ---
function processBackendData(data) {
    const patientsMap = {};

    data.forEach(row => {
        if (!patientsMap[row.childId]) {
            patientsMap[row.childId] = {
                id: row.childId,
                name: row.childName,
                parent: row.parentName,
                age: calculateAge(row.dateOfBirth),
                history: [],
                // Store ALL summaries to calculate cumulative averages later
                sessionSummaries: [] 
            };
        }
        
        // 1. Add Game to History (For Line Chart & Doughnut)
        if (row.gameId && row.gameScore !== undefined) {
            const isExactDuplicate = patientsMap[row.childId].history.some(h => 
                h.gameId === row.gameId && h.date === row.sessionDate && h.score === row.gameScore
            );
            if (!isExactDuplicate) {
                patientsMap[row.childId].history.push({
                    gameId: row.gameId,
                    score: row.gameScore,
                    date: row.sessionDate,
                    category: getCategoryName(row.gameId)
                });
            }
        }

        // 2. Add Session Summary (Updated to group by ID)
if (row.summaryId) {
    // Check if we already added this specific Session ID
    const summaryExists = patientsMap[row.childId].sessionSummaries.some(s => s.id === row.summaryId);
    
    if (!summaryExists) {
        patientsMap[row.childId].sessionSummaries.push({
            id: row.summaryId, // Store the ID
            date: row.sessionDate,
            totalScore: row.totalWeightedScore || 0,
            working: row.workingScore || 0,
            episodic: row.episodicScore || 0,
            visual: row.visualScore || 0,
            auditory: row.auditoryScore || 0
        });
    }
}
    });

    return Object.values(patientsMap);
}
// --- KPI CALCULATIONS ---
function updateKPIs() {
    document.getElementById('kpiTotalPatients').textContent = allPatients.length;
    document.getElementById('leftTotalPatients').textContent = allPatients.length;


// 2. Total Sessions (Count Unique IDs instead of Dates)
let totalSessionsCount = 0;

allPatients.forEach(p => {
    // Simply add the number of summaries found for this child
    totalSessionsCount += p.sessionSummaries.length;
});

document.getElementById('kpiAssessments').textContent = totalSessionsCount;
document.getElementById('leftAssessments').textContent = totalSessionsCount;

    // Games Played
    const totalGames = allPatients.reduce((sum, p) => sum + p.history.length, 0);
    const gamesBox = document.getElementById('kpiGamesPlayed') || document.getElementById('kpiRecentActivity');
    if(gamesBox) gamesBox.textContent = totalGames;

    // Avg Weighted Score (Global)
    let sumWeightedScores = 0;
    let kidsWithScores = 0;
    allPatients.forEach(p => {
        // Calculate average of THIS kid's summaries
        if (p.sessionSummaries.length > 0) {
            const kidSum = p.sessionSummaries.reduce((sum, s) => sum + s.totalScore, 0);
            const kidAvg = kidSum / p.sessionSummaries.length;
            sumWeightedScores += kidAvg;
            kidsWithScores++;
        }
    });
    const globalAvg = kidsWithScores > 0 ? Math.round(sumWeightedScores / kidsWithScores) : 0;
    document.getElementById('kpiAvgScore').innerText = globalAvg;
}

// --- RENDER TABLE ---
function renderPatientTable() {
    const body = document.getElementById('patientTableBody');
    body.innerHTML = '';
    
    if(filteredPatients.length === 0) {
        body.innerHTML = `<tr><td colspan="6" style="text-align:center;">No patients found.</td></tr>`;
        return;
    }

    filteredPatients.forEach(p => {
        let lastPlayedDate = "Never";
        let displayScore = 0;

        // Get Latest Summary for the "Current Score" column
        if (p.sessionSummaries.length > 0) {
            // Sort to find newest
            const sortedSummaries = [...p.sessionSummaries].sort((a, b) => new Date(b.date) - new Date(a.date));
            const latest = sortedSummaries[0];
            
            lastPlayedDate = new Date(latest.date).toLocaleDateString();
            displayScore = Math.round(latest.totalScore);
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${p.name}</b></td>
            <td>${p.age}</td>
            <td>${p.parent || '-'}</td>
            <td>${lastPlayedDate}</td>
            <td><span style="background:${displayScore >= 80 ? '#dcfce7' : '#fef9c3'}; padding:4px 8px; border-radius:10px; font-weight:bold; color:#333">${displayScore}</span></td>
            <td style="text-align:right">
                <button class="btn-view" onclick="selectPatient(${p.id})">View Analytics</button>
            </td>
        `;
        body.appendChild(tr);
    });
}

// --- ANALYTICS & CHARTS ---
async function selectPatient(id) {
    selectedPatient = allPatients.find(p => p.id === id);
    if (!selectedPatient) return;

    // Update Header Info
    document.getElementById('childName').textContent = selectedPatient.name;
    document.getElementById('childSubtitle').textContent = `Parent: ${selectedPatient.parent} • Age: ${selectedPatient.age}`;
    document.getElementById('childAvatar').innerText = selectedPatient.name.substring(0, 2).toUpperCase();

    // AI Prediction Section
    const aiBox = document.getElementById('aiInsights');
    aiBox.innerHTML = '<span style="color:#666">🤖 Analyzing performance data...</span>';

    // Call Python/AI Backend
    const user = JSON.parse(localStorage.getItem('user_details'));
    try {
        const res = await fetch(`${API_BASE}/Doctor/predict/${id}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        
        if(res.ok) {
            const data = await res.json();
            // Assuming data.prediction or data.insight contains the text
            const text = data.prediction || data.insight || "No prediction available.";
            aiBox.innerHTML = `<strong>AI Analysis:</strong><br>${text}`;
            aiBox.style.borderLeft = "4px solid #7c5cff";
        } else {
            aiBox.innerHTML = "Not enough data for AI prediction yet.";
        }
    } catch (e) {
        aiBox.innerText = "AI Service Unavailable (Check connection)";
    }

    renderCharts(selectedPatient);

    // Switch Tab Programmatically
    document.querySelector('[data-tab="analyticsTab"]').click();
}

function renderCharts(p) {
    // 1. Trend Chart
    const ctx1 = document.getElementById('iqTrend').getContext('2d');
    if (charts.iqTrend) charts.iqTrend.destroy();
    
    // Sort by date for the line chart
    const sortedHistory = [...p.history].sort((a, b) => new Date(a.date) - new Date(b.date));

    charts.iqTrend = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: sortedHistory.map(h => new Date(h.date).toLocaleDateString()),
            datasets: [{
                label: 'Game Score',
                data: sortedHistory.map(h => h.score),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true,  scales: { y: { beginAtZero: true, max: 100 } } }
    });

    // 2. Category Pie Chart
    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    if (charts.categoryChart) charts.categoryChart.destroy();

    const cats = { "Working": 0, "Episodic": 0, "Visual": 0, "Auditory": 0 };
    p.history.forEach(h => { 
        if(cats[h.category] !== undefined) cats[h.category]++;
        else cats["Other"] = (cats["Other"] || 0) + 1;
    });

    charts.categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(cats),
            datasets: [{
                data: Object.values(cats),
                backgroundColor: ['#4fc3f7', '#ba68c8', '#ffb74d', '#4db6ac', '#ccc']
            }]
        },
        options: { responsive: true }
    });
    // 3. COGNITIVE PROFILE (RADAR) - **BIAS REMOVED**
    const ctx3 = document.getElementById('cognitiveRadar').getContext('2d');
    if (charts.cognitiveRadar) charts.cognitiveRadar.destroy();

    // A. Calculate GLOBAL Averages (Game by Game)
    // We use p.history instead of p.sessionSummaries to avoid "Small Session Bias"
    let stats = {
        Working: { sum: 0, count: 0 },
        Episodic: { sum: 0, count: 0 },
        Visual: { sum: 0, count: 0 },
        Auditory: { sum: 0, count: 0 }
    };

    p.history.forEach(game => {
        // 'game.category' is already set by processBackendData (e.g., "Visual")
        if (stats[game.category]) {
            stats[game.category].sum += game.score;
            stats[game.category].count++;
        }
    });

    // Calculate the pure averages
    const avgWorking = stats.Working.count > 0 ? Math.round(stats.Working.sum / stats.Working.count) : 0;
    const avgEpisodic = stats.Episodic.count > 0 ? Math.round(stats.Episodic.sum / stats.Episodic.count) : 0;
    const avgVisual = stats.Visual.count > 0 ? Math.round(stats.Visual.sum / stats.Visual.count) : 0;
    const avgAuditory = stats.Auditory.count > 0 ? Math.round(stats.Auditory.sum / stats.Auditory.count) : 0;

    // B. Development Trend Calculation
    // Compare Latest Session Score vs The Lifetime Average we just calculated
    const sortedSummaries = [...p.sessionSummaries].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedSummaries.length > 0 ? sortedSummaries[0] : null;
    
    let devText = "No data";
    let devColor = "#666";

    if (latest) {
        // Calculate the "Mean" of the lifetime profile to compare against today's Total Score
        // Note: We use the simple mean of the 4 profile points as the baseline
        const lifetimeBaseline = (avgWorking + avgEpisodic + avgVisual + avgAuditory) / 4;
        
        const diff = Math.round(latest.totalScore - lifetimeBaseline);
        if (diff > 0) { devText = `+${diff}% vs History`; devColor = "#22c55e"; } // Green
        else if (diff < 0) { devText = `${diff}% vs History`; devColor = "#ef4444"; } // Red
        else { devText = "Stable"; devColor = "#f59e0b"; } // Orange
    }

    charts.cognitiveRadar = new Chart(ctx3, {
        type: 'radar',
        data: {
            labels: ['Working', 'Episodic', 'Visual', 'Auditory'],
            datasets: [{
                label: 'Score Summary (historical average)',
                data: [avgWorking, avgEpisodic, avgVisual, avgAuditory],
                backgroundColor: 'rgba(124, 92, 255, 0.2)',
                borderColor: '#7c5cff',
                pointBackgroundColor: '#7c5cff',
                pointBorderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { angleLines: { display: true }, suggestedMin: 0, suggestedMax: 100 } },
            plugins: {
                title: {
                    display: true,
                    text: `Trend: ${devText}`,
                    color: devColor,
                    font: { size: 14, weight: 'bold' },
                    padding: { bottom: 10 }
                }
            }
        }
    });
}

// --- LINK NEW PATIENT ---
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
            msgDiv.innerText = err.message || "Failed. Check email.";
            msgDiv.style.color = "red";
        }
    } catch (e) {
        msgDiv.innerText = "Network Error";
        msgDiv.style.color = "red";
    }
}

// --- TABS & LOGOUT ---
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.getAttribute('data-tab')).classList.add('active');
    });
});

document.getElementById('searchInput').addEventListener('input', function() {
    const val = this.value.toLowerCase();
    filteredPatients = allPatients.filter(p => p.name.toLowerCase().includes(val));
    renderPatientTable();
});

function handleLogout() {
    localStorage.clear();
    window.location.href = '../login/index.html';
}

// --- UTILS ---
function calculateAge(dob) {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getCategoryName(id) {
    // Map your Game IDs to categories here
    if(id >= 1 && id <= 3) return "Working";
    if(id >= 4 && id <= 6) return "Episodic";
    if(id >= 7 && id <= 9) return "Visual";
    if(id >= 10 && id <= 12) return "Auditory";
    return "General";
}