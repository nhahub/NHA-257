/***** CONFIG - change API_BASE to your backend address *****/
const API_BASE = 'http://localhost:5000/api/auth'; // <- update this
/*******************************************************/

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

    localStorage.setItem('token', data.token);
    setMsg('loginMsg', 'Login successful ✓', 'green');
    showToast('Welcome back!');
    // you can redirect to dashboard: window.location = '/dashboard.html'
  } catch (err) {
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

  let hasError = false;
  if (!name) {
    setErr('regNameErr', 'Full name required');
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
      body: JSON.stringify({ fullName: name, email, password: pwd }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg('regMsg', data.message || 'Registration failed');
      return;
    }

    setMsg('regMsg', 'Account created ✓', 'green');
    showToast('Account created — you can now login');
    // switch to login
    setTimeout(() => switchTo('login'), 900);
  } catch (err) {
    setMsg('regMsg', 'Network error');
  }
});

function clearRegisterErrors() {
  setErr('regNameErr', '');
  setErr('regEmailErr', '');
  setErr('regPasswordErr', '');
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
