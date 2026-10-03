/* ---------- Theme toggle (remembers choice) ---------- */
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(saved || (prefersDark ? 'dark' : 'light'));
toggle.addEventListener('click', () => {
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- Typing effect ---------- */
const phrases = ['Linux systems.', 'Python tools.', 'SQL dashboards.', 'web projects.'];
const typed = document.getElementById('typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let p = 0, c = 0, deleting = false;

function type() {
  const word = phrases[p];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 80);
}
if (reduceMotion) { typed.textContent = phrases[0]; } else { type(); }

/* ---------- Signal-wave canvas (reacts to mouse) ---------- */
const canvas = document.getElementById('wave');
const ctx = canvas.getContext('2d');
let w, h, t = 0, mouseY = 0.5;

function resize() {
  const dpr = window.devicePixelRatio || 1;
  w = canvas.clientWidth; h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
canvas.parentElement.addEventListener('mousemove', e => {
  mouseY = e.clientY / window.innerHeight;
});
resize();

function draw() {
  ctx.clearRect(0, 0, w, h);
  const rgb = getComputedStyle(root).getPropertyValue('--wave').trim();
  const layers = [
    { amp: 28, freq: 0.012, speed: 0.02, alpha: 0.35, y: 0.72 },
    { amp: 18, freq: 0.02, speed: 0.03, alpha: 0.2, y: 0.78 },
  ];
  layers.forEach(l => {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = h * l.y + Math.sin(x * l.freq + t * l.speed * 10) * l.amp * (0.6 + mouseY)
              + Math.sin(x * l.freq * 2.7 - t * l.speed * 6) * (l.amp / 3);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${rgb}, ${l.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  t += 0.1;
  if (!reduceMotion) requestAnimationFrame(draw);
}
draw();

/* ---------- Project filters ---------- */
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.filter;
  cards.forEach(card => card.classList.toggle('hide', f !== 'all' && card.dataset.cat !== f));
}));

/* ---------- Highlight current section in nav ---------- */
const links = document.querySelectorAll('.links a');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && observer.observe(s));