const API_BASE = 'https://localhost:7101/api/auth'; 

// DOM
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const toast = document.getElementById('toast');

// Toggle tabs
tabLogin.addEventListener('click', () => switchTo('login'));
tabRegister.addEventListener('click', () => switchTo('register'));

function switchTo(mode) {
  if (mode === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.setAttribute('aria-selected', 'false');
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'false');
    tabRegister.setAttribute('aria-selected', 'true');
    formLogin.classList.remove('active');
    formRegister.classList.add('active');
  }
}

// Validation helpers
function isEmail(v) {
  return /^\S+@\S+\.\S+$/.test(v);
}

function pwdStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 4);
}

// Toast helper
function showToast(msg, time = 2500) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), time);
}

// --- NEW HELPER: Parse JWT to get User Info ---
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

// LOGIN logic
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearLoginErrors();
  const email = document.getElementById('loginEmail').value.trim();
  const pwd = document.getElementById('loginPassword').value;

  let hasError = false;
  if (!isEmail(email)) {
    setErr('loginEmailErr', 'Please enter a valid email');
    hasError = true;
  }
  if (!pwd) {
    setErr('loginPasswordErr', 'Password required');
    hasError = true;
  }
  if (hasError) return;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg('loginMsg', data.message || 'Login failed');
      return;
    }

    // --- UPDATED SUCCESS LOGIC ---
    const token = data.token;
    const decoded = parseJwt(token);
    // Try find role depending on how .NET named it
    const userRole = decoded.Role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "3";
    const userEmail = decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    const userDetails = {
        token: token,
        userId: decoded.UserId,
        role: userRole,
        name: userEmail
    };

    // Save full details to local storage
    localStorage.setItem('user_details', JSON.stringify(userDetails));
    localStorage.setItem('token', token); // Keep original too just in case

    setMsg('loginMsg', 'Login successful ✓', '#4dd0e1'); // Changed color to match theme
    showToast('Welcome back!');
    
    // Redirect to Home after 1 second
    setTimeout(() => {
         window.location.href = '../../src/Home/home.html'; // Adjust path based on your structure
    }, 1000);
    // -----------------------------

  } catch (err) {
    console.error(err);
    setMsg('loginMsg', 'Network error');
  }
});

function clearLoginErrors() {
  setErr('loginEmailErr', '');
  setErr('loginPasswordErr', '');
  setMsg('loginMsg', '');
}

// REGISTER logic
const pwdMeter = document.getElementById('pwdStrength');
const regPwdInput = document.getElementById('regPassword');
regPwdInput &&
  regPwdInput.addEventListener('input', (e) => {
    const v = e.target.value;
    const s = pwdStrength(v);
    if (pwdMeter) pwdMeter.value = s;
  });

formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearRegisterErrors();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pwd = document.getElementById('regPassword').value;
  // GET ROLE
  const typeId = document.getElementById('regUserType').value;

  let hasError = false;
  if (!name) {
    setErr('regNameErr', 'Full name required');
    hasError = true;
  }
  // VALIDATE ROLE
  if (!typeId) {
    setErr('regTypeErr', 'Please select a Role');
    hasError = true;
  }
  if (!isEmail(email)) {
    setErr('regEmailErr', 'Enter a valid email');
    hasError = true;
  }
  if (pwd.length < 6) {
    setErr('regPasswordErr', 'Password must be at least 6 chars');
    hasError = true;
  }
  if (hasError) return;

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // INCLUDE USERTYPEID IN BODY
      body: JSON.stringify({ fullName: name, email, password: pwd, userTypeId: parseInt(typeId) }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg('regMsg', data.message || data.error || 'Registration failed');
      return;
    }

    setMsg('regMsg', 'Account created ✓', '#4dd0e1');
    showToast('Account created — you can now login');
    setTimeout(() => switchTo('login'), 900);
  } catch (err) {
    console.error(err);
    setMsg('regMsg', 'Network error');
  }
});

function clearRegisterErrors() {
  setErr('regNameErr', '');
  setErr('regEmailErr', '');
  setErr('regPasswordErr', '');
  setErr('regTypeErr', ''); // Clear role error
  setMsg('regMsg', '');
}

// Small UI helpers
function setErr(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setMsg(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.style.color = color || '#ffdd57';
  }
}

// On load: if token exists show a small toast
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) showToast('You are already logged in (token found)');
});