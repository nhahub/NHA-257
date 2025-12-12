// --- DOM ELEMENTS ---
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.querySelector('.navbar');
const navBtns = document.querySelectorAll('.nav-btn');
const games = document.querySelectorAll('.game-card');
const sections = document.querySelectorAll('.section');

// --- 1. MOBILE MENU TOGGLE ---
menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
  });
});

// --- 2. SCROLL ANIMATION (Intersection Observer) ---
const observerOptions = {
  root: null,
  threshold: 0.15 // Trigger when 15% of section is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
    }
  });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

// --- 3. GAME FILTERING LOGIC ---
navBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // A. Visual Active State
    navBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    const category = e.target.getAttribute('data-filter');

    // B. Filter Games
    games.forEach(game => {
      if (category === 'All') {
        game.classList.remove('remove');
      } else {
        if (game.classList.contains(category)) {
          game.classList.remove('remove');
        } else {
          game.classList.add('remove');
        }
      }
    });
  });
});