/***** CONFIG *****/
const API_BASE = 'https://localhost:7101/api/auth'; 
/******************/

// DOM Elements
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const toast = document.getElementById('toast');

// Switch Tabs
tabLogin.addEventListener('click', () => switchTo('login'));
tabRegister.addEventListener('click', () => switchTo('register'));

function switchTo(mode) {
    if (mode === 'login') {
        tabLogin.classList.add('active'); tabRegister.classList.remove('active');
        formLogin.classList.add('active'); formRegister.classList.remove('active');
    } else {
        tabLogin.classList.remove('active'); tabRegister.classList.add('active');
        formLogin.classList.remove('active'); formRegister.classList.add('active');
    }
}

// --- HELPER: Parse JWT to get User Info ---
function parseJwt (token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// LOGIN LOGIC 
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMsg('loginMsg', 'Logging in...');
    
    const email = document.getElementById('loginEmail').value.trim();
    const pwd = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pwd }),
        });

        const data = await res.json();
        
        if (!res.ok) {
            setMsg('loginMsg', data.message || 'Login failed', 'red');
            return;
        }

        // 1. Store the Token
        const token = data.token; 

        // 2. Decode Token
        const decoded = parseJwt(token);
        // Fallback checks for different claim names
        const userRole = decoded.Role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "3";
        const userEmail = decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

        const userDetails = {
            token: token,
            userId: decoded.UserId, 
            role: userRole, // "1"=Admin, "2"=Doctor, "3"=Child
            name: userEmail
        };

        // 3. Save to LocalStorage
        localStorage.setItem('user_details', JSON.stringify(userDetails));

        setMsg('loginMsg', 'Success!', 'green');
        showToast(`Welcome back!`);

        // 4. Role-Based Redirect
        setTimeout(() => {
            if (userRole === "3" || userRole === 3) {
                // Kid: Go DIRECTLY to Games Menu
                window.location.href = '../../src/Games/menu.html'; 
            } else {
                // Doctor/Admin: Go to Home Hub
                window.location.href = '../../src/Home/home.html'; 
            }
        }, 1000);

    } catch (err) {
        console.error(err);
        setMsg('loginMsg', 'Could not connect to server', 'red');
    }
});

// REGISTER LOGIC-
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMsg('regMsg', 'Creating account...');

    // Basic Validation
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pwd = document.getElementById('regPassword').value;
    const typeId = document.getElementById('regUserType').value;

    if (!typeId) {
        setMsg('regMsg', 'Please select a Role', 'red');
        return;
    }

    // Build the Payload with Extra Fields
    const payload = {
        fullName: name,
        email: email,
        password: pwd,
        userTypeId: parseInt(typeId),
        
        // New Fields (Safe checks)
        phone: document.getElementById('regPhone')?.value || null,
        address: document.getElementById('regAddress')?.value || null,
        specialty: document.getElementById('regSpecialty')?.value || null,
        parentName: document.getElementById('regParentName')?.value || null,
        dateOfBirth: document.getElementById('regDob')?.value || null
    };

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload), 
        });

        const data = await res.json();
        
        if (!res.ok) {
            setMsg('regMsg', data.message || data.error || 'Failed', 'red');
            return;
        }

        setMsg('regMsg', 'Account Created!', 'green');
        showToast('Account created. Please login.');
        setTimeout(() => switchTo('login'), 1500);

    } catch (err) {
        console.error(err);
        setMsg('regMsg', 'Network Error', 'red');
    }
});

// --- TOGGLE FIELDS UI ---
function toggleExtraFields() {
    const role = document.getElementById('regUserType').value;
    const extraDiv = document.getElementById('extraFields');
    const docDiv = document.getElementById('doctorFields');
    const childDiv = document.getElementById('childFields');

    if (role) {
        extraDiv.style.display = 'block';
        if (role === "2") { // Doctor
            docDiv.style.display = 'block';
            childDiv.style.display = 'none';
        } else if (role === "3") { // Child
            docDiv.style.display = 'none';
            childDiv.style.display = 'block';
        } else {
            extraDiv.style.display = 'none'; // Hide for Admin
        }
    }
}

// --- UI HELPERS ---
function setMsg(id, text, color) {
    const el = document.getElementById(id);
    if(el) { el.textContent = text; el.style.color = color || 'white'; }
}
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}