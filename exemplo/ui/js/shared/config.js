const Config = {
  server: {
    name: "NightCity RP",
    version: "1.0.0",
    discord: "https://discord.gg/JFhXXmJVPK"
  },

  debug: false,
  testMode: false,

  locale: {
    default: "en",
    available: ["en", "pt-br", "es", "fr", "de"]
  },

  ui: {
    title: "NightCity Loading",
    loading: "Loading...",
    playersOnline: "players online",
    noPlayers: "No players online",
    morePlayers: "more..."
  },

  panels: {
    staff: "Staff Online",
    players: "Players Online",
    news: "News & Updates",
    map: "Map",
    rules: "Server Rules"
  },

  intro: {
    enabled: true,
    duration: 5000,
    messages: ["NightCity", "Where Legends Are Born", "Get Ready..."]
  },

  timeline: [
    { time: 3, text: "( Night City... )" },
    { time: 12, text: "( Where chaos reigns )" },
    { time: 21, text: "( You write your story )" },
    { time: 30, text: "( Welcome to the server )" }
  ],

  tips: {
    enabled: true,
    interval: 5000,
    list: [
      "Press F5 to open the map",
      "Use /help to see commands",
      "Respect other players",
      "Join our Discord for news",
      "Watch out for bandits on the road",
      "Visit the shop to buy items",
      "Work to earn money"
    ],
    clickable: true,
    clickTips: {
      "Press F5 to open the map": "The map shows points of interest, cities and roads.",
      "Use /help to see commands": "Type /help in chat to see all available commands.",
      "Respect other players": "Keep the roleplay civil and fun for everyone."
    }
  },

  backgrounds: {
    enabled: true,
    interval: 8000,
    fadeTransition: 2000,
    blurEffect: true,
    images: ["img/noise.png", "img/bg2.webp", "img/bg3.webp"]
  },

  news: {
    enabled: true,
    title: "News & Updates",
    updates: [
      { title: "New update v2.0", date: "25/03/2026", content: "New features on loading screen!" },
      { title: "Weekend event", date: "24/03/2026", content: "Participate and win special prizes!" },
      { title: "New missions available", date: "20/03/2026", content: "Explore the new missions." }
    ]
  },

  players: {
    enabled: true,
    showLiveList: true,
    maxDisplay: 10
  },

  blips: {
    enabled: true,
    showTooltip: true
  },

  map: {
    enabled: true,
    zoomMin: 1.0,
    // zoomMax: 15.0,
    zoomStep: 0.2,
    mapBounds: {
      width: 11820,
      height: 8660,
      xOffset: 8515,
      yOffset: 10850,
      radius: 16000
    }
  },

  clock: {
    enabled: true,
    style: "western",
    showDate: true
  },

  fire: {
    enabled: true,
    count: 8
  },

  fog: {
    enabled: true,
    intensity: 0.15,
    speed: 0.5
  },

  rain: {
    enabled: true,
    intensity: 100
  },

  particles: {
    enabled: true,
    count: 40
  },

  theme: {
    primary: "#E8B84A",
    secondary: "#8B7355",
    current: "western",
    available: {
      western: { primary: "#E8B84A", secondary: "#8B7355", bg: "rgba(20,15,10,0.85)" },
      blood: { primary: "#8B0000", secondary: "#4A0000", bg: "rgba(30,5,5,0.85)" },
      night: { primary: "#4169E1", secondary: "#191970", bg: "rgba(10,10,30,0.85)" },
      desert: { primary: "#D2691E", secondary: "#8B4513", bg: "rgba(40,25,10,0.85)" }
    }
  },

  audio: {
    music: "audio/music.ogg",
    ambient: "audio/wind.ogg",
    musicVolume: 1.0,
    ambientVolume: 0.3
  },

  logo: {
    path: "img/logo2.png",
    width: 350,
    glowEnabled: true,
    floatEnabled: true,
    mouseFollow: true,
    mouseSensitivity: 0.02
  },

  rules: {
    enabled: true,
    title: "Server Rules",
    position: "left",
    list: [
      "1. Respect all players",
      "2. No illegal roleplay without reason",
      "3. No hacks or cheats",
      "4. Keep realistic roleplay",
      "5. No spamming in chat",
      "6. Respect server hierarchy",
      "7. Report problematic players",
      "8. Have fun and make good stories!"
    ]
  },

  staff: {
    enabled: true,
    title: "Staff Online",
    position: "top-left",
    members: [
      { name: "Night", role: "Owner", icon: "crown", color: "#FFD700" },
      { name: "Admin1", role: "Admin", icon: "shield-alt", color: "#FF4444" },
      { name: "Mod1", role: "Mod", icon: "star", color: "#44FF44" }
    ]
  },

  cinematic: {
    barsEnabled: true,
    barsHeight: "10%",
    vignetteEnabled: true,
    grainEnabled: true,
    grainOpacity: 0.04
  },

  progress: {
    simulated: true,
    minSpeed: 1,
    maxSpeed: 3
  }
};

window.LocaleData = {};

function loadLocale(lang) {
  const langMap = {
    "pt": "pt-br",
    "en": "en",
    "es": "es",
    "fr": "fr",
    "de": "de"
  };
  
  const fullLang = langMap[lang] || "en";
  
  if (window.LocaleData[fullLang]) {
    return window.LocaleData[fullLang];
  }
  
  return null;
}

function detectLocale() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('lang')) {
    return urlParams.get('lang');
  }
  
  const browserLang = navigator.language || navigator.userLanguage;
  const shortLang = browserLang.split('-')[0];
  
  const langMap = {
    "pt": "pt-br",
    "en": "en",
    "es": "es",
    "fr": "fr",
    "de": "de"
  };
  
  return langMap[shortLang] || "en";
}

function applyLocale(localeData) {
  if (!localeData) return;
  
  if (localeData.ui) {
    Config.ui = { ...Config.ui, ...localeData.ui };
  }
  if (localeData.panels) {
    Config.panels = { ...Config.panels, ...localeData.panels };
  }
  if (localeData.tips) {
    Config.tips.list = localeData.tips.list || Config.tips.list;
  }
  if (localeData.intro) {
    Config.intro.messages = localeData.intro.messages || Config.intro.messages;
  }
  if (localeData.timeline) {
    Config.timeline = localeData.timeline || Config.timeline;
  }
}

const Locale = Config;
