const btn = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  btn.textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', t);
}

setTheme(saved || (prefersDark ? 'dark' : 'light'));
btn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});