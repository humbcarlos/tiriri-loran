function initThemeSelector() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-western', 'theme-blood', 'theme-night', 'theme-desert');
  body.classList.add(`theme-${theme}`);
  
  const themeData = Config.theme.available[theme];
  document.documentElement.style.setProperty('--primary', themeData.primary);
  document.documentElement.style.setProperty('--secondary', themeData.secondary);
  document.documentElement.style.setProperty('--bg-color', themeData.bg);
}

function initPingMonitor() {
  updatePing();
  setInterval(updatePing, 5000);
}

function updatePing() {
  const ping = Math.floor(Math.random() * 100) + 20;
  pingValue.textContent = `${ping} ms`;
  
  pingDot.classList.remove('ping-good', 'ping-medium', 'ping-bad');
  if (ping < 50) {
    pingDot.classList.add('ping-good');
  } else if (ping < 100) {
    pingDot.classList.add('ping-medium');
  } else {
    pingDot.classList.add('ping-bad');
  }
}
