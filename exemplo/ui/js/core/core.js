if (Config.debug) console.log(Config.server.name + ' - Core loaded');

const scenes = document.querySelectorAll('.scene');
const textEl = document.getElementById('text');
const audio = document.getElementById('audio');
const ambient = document.getElementById('ambient');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const tipsContainer = document.getElementById('tipsContainer');
const tipsText = document.getElementById('tipsText');
const tipDetail = document.getElementById('tipDetail');
const playerCount = document.getElementById('playerCount');
const logo = document.getElementById('logo');
const logoContainer = document.getElementById('logoContainer');
const introText = document.getElementById('introText');
const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');
const pingDot = document.getElementById('pingDot');
const pingValue = document.getElementById('pingValue');
const staffList = document.getElementById('staffList');
const newsList = document.getElementById('newsList');
const playersList = document.getElementById('playersList');
const serverVersion = document.getElementById('serverVersion');

let currentScene = 0;
let currentTip = 0;
let tipExpanded = false;

function detectAndApplyLocale() {
  const urlParams = new URLSearchParams(window.location.search);
  let lang = urlParams.get('lang');
  
  if (!lang) {
    const browserLang = navigator.language || navigator.userLanguage;
    lang = browserLang.split('-')[0];
  }
  
  const langMap = { "pt": "pt-br", "en": "en", "es": "es", "fr": "fr", "de": "de" };
  const fullLang = langMap[lang] || "en";
  
  if (window.LocaleData && window.LocaleData[fullLang]) {
    const locale = window.LocaleData[fullLang];
    if (locale.ui) Config.ui = { ...Config.ui, ...locale.ui };
    if (locale.panels) Config.panels = { ...Config.panels, ...locale.panels };
    if (locale.tips) Config.tips.list = locale.tips.list || Config.tips.list;
    if (locale.intro) Config.intro.messages = locale.intro.messages || Config.intro.messages;
    if (locale.timeline) Config.timeline = locale.timeline || Config.timeline;
  }
}

function initConfig() {
  detectAndApplyLocale();
  
  serverVersion.textContent = Config.server.version;
  
  document.title = Locale.ui.title;
  
  const discordLink = document.getElementById('discordLink');
  if (discordLink && Config.server.discord) {
    discordLink.href = Config.server.discord;
    discordLink.innerHTML = '<i class="fab fa-discord"></i><span class="social-menu-label">Discord</span>';
  }
  
  if (document.getElementById('staffTitle')) document.getElementById('staffTitle').textContent = Locale.panels.staff;
  if (document.getElementById('playersTitle')) document.getElementById('playersTitle').textContent = Locale.panels.players;
  if (document.getElementById('newsTitle')) document.getElementById('newsTitle').textContent = Locale.panels.news;
  if (document.getElementById('mapTitle')) document.getElementById('mapTitle').textContent = Locale.panels.map;
  if (document.getElementById('rulesTitle')) document.getElementById('rulesTitle').textContent = Locale.panels.rules;
  
  progressText.textContent = Locale.ui.loading + ' 0%';
  
  if (Config.clock.enabled) {
    updateClock();
    setInterval(updateClock, 1000);
  } else {
    document.getElementById('clockContainer').style.display = 'none';
  }

  if (Config.news.enabled) {
    renderNews();
    document.getElementById('newsPanel').style.display = 'block';
  } else {
    document.querySelector('[data-panel="news"]').style.display = 'none';
    document.getElementById('newsPanel').style.display = 'none';
  }

  if (Config.staff.enabled) {
    renderStaff();
    document.getElementById('staffPanel').style.display = 'block';
  } else {
    document.querySelector('[data-panel="staff"]').style.display = 'none';
    document.getElementById('staffPanel').style.display = 'none';
  }

  if (Config.rules.enabled) {
    renderRules();
    document.getElementById('rulesPanel').style.display = 'block';
  } else {
    document.querySelector('[data-panel="rules"]').style.display = 'none';
    document.getElementById('rulesPanel').style.display = 'none';
  }

  if (Config.players.enabled) {
    initPlayers();
  }

  if (Config.fire && Config.fire.enabled && typeof FireEffects !== 'undefined') {
    try { FireEffects.init(); } catch(e) {}
  }

  if (Config.fog && Config.fog.enabled && typeof FogEffect !== 'undefined') {
    try { FogEffect.init(); } catch(e) {}
  }

  if (Config.rain && !Config.rain.enabled) {
    const rainCanvas = document.getElementById('rainCanvas');
    if (rainCanvas) rainCanvas.style.display = 'none';
  }

  initThemeSelector();
  initPingMonitor();
}

function initSideMenu() {}

const safeShutdown = () => {
  if (typeof window.rpcCall === 'function') {
    window.rpcCall('onLoadingFinished', {});
  } else {
    fetch(`https://${GetParentResourceName()}/onLoadingFinished`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).catch(() => {});
  }
};

window.addEventListener('resize', () => {
  if (typeof FireEffects !== 'undefined' && FireEffects.resize) { FireEffects.resize(); }
  if (typeof FogEffect !== 'undefined' && FogEffect.resize) { FogEffect.resize(); }
  if (typeof RainEffect !== 'undefined' && RainEffect.resize) { RainEffect.resize(); }
});

if (!TEST_MODE) {
  setTimeout(() => {
    safeShutdown();
  }, 30000);
}

initConfig();
initSideMenu();
initBlips();

if (Config.debug) console.log(Config.server.name + ' - Inicializado');
