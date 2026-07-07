let realPlayers = [];
let realPlayerCount = 0;

function initPlayers() {
  if (TEST_MODE) {
    realPlayers = [...TestData.players];
    realPlayerCount = TestData.count;
    updatePlayerList();
    setInterval(() => {
      realPlayerCount = Math.floor(Math.random() * 15) + 1;
      const shuffled = [...TestData.players].sort(() => Math.random() - 0.5);
      realPlayers = shuffled.slice(0, realPlayerCount).map(p => ({
        ...p,
        ping: Math.floor(Math.random() * 100) + 20
      }));
      updatePlayerList();
    }, 5000);
  } else {
    updatePlayerList();
  }
}

function updatePlayerList() {
  if (realPlayerCount === 0 && realPlayers.length === 0) {
    playerCount.textContent = `0 ${Locale.ui.playersOnline}`;
    playersList.innerHTML = '<div class="player-item" style="color:#666;font-style:italic">' + Locale.ui.noPlayers + '</div>';
    return;
  }
  
  playerCount.textContent = `${realPlayerCount} ${Locale.ui.playersOnline}`;
  
  if (Config.players.showLiveList) {
    let html = '';
    const displayPlayers = realPlayers.slice(0, Config.players.maxDisplay);
    displayPlayers.forEach(player => {
      const pingClass = player.ping < 50 ? 'ping-good' : (player.ping < 100 ? 'ping-medium' : 'ping-bad');
      html += `
        <div class="player-item">
          <div class="player-status ${pingClass}"></div>
          <span style="flex:1">${player.name}</span>
          <span style="color:#666;font-size:0.75rem">${player.ping}ms</span>
        </div>
      `;
    });
    if (realPlayerCount > Config.players.maxDisplay) {
      html += `<div class="player-item" style="color:#666;font-style:italic">+${realPlayerCount - Config.players.maxDisplay} mais...</div>`;
    }
    playersList.innerHTML = html;
  }
}

const TestData = {
    players: [
        { name: "John_Doe", ping: 35 },
        { name: "Cowboy_X", ping: 67 },
        { name: "Maria_Santos", ping: 120 },
        { name: "Bandit_King", ping: 45 },
        { name: "Sheriff_Joe", ping: 89 },
        { name: "Emily_Blossom", ping: 55 },
        { name: "Pedro_Pan", ping: 78 },
        { name: "Sarah_West", ping: 42 }
    ],
    count: 8,
    blips: [
        { id: 1, name: "Loja Geral", x: -600, y: -7500, icon: "store", color: "#4CAF50", category: "store", description: "Compre suprimentos e armas" },
        { id: 2, name: "Ferreiro", x: -1800, y: -6500, icon: "tools", color: "#FF9800", category: "job", description: "Melhore suas armas" },
        { id: 3, name: "Banco", x: -300, y: -5500, icon: "bank", color: "#2196F3", category: "bank", description: "Deposite e retire seu dinheiro" },
        { id: 4, name: "Sheriff", x: -2000, y: -4500, icon: "shield", color: "#F44336", category: "job", description: "Mantenha a ordem" },
        { id: 5, name: "Bar", x: -1200, y: -8000, icon: "bar", color: "#9C27B0", category: "store", description: "Beba e socialize" },
        { id: 6, name: "Hotel", x: -3500, y: -7000, icon: "hotel", color: "#607D8B", category: "general", description: "Descanse e cure-se" },
        { id: 7, name: "Posto de Combustivel", x: 0, y: -4000, icon: "fuel", color: "#FFEB3B", category: "store", description: "Abasteca sua carruagem" },
        { id: 8, name: "Cacador de Recompensas", x: -4500, y: -3500, icon: "target", color: "#E91E63", category: "mission", description: "Complete missoes por recompensas" }
    ]
};

if (window.TEST_MODE) {
  document.getElementById('testModeBanner').style.display = 'block';
}
