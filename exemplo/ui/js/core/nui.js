if (!TEST_MODE) {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      safeShutdown();
    }
  });
}

window.addEventListener('message', function(e) {
  if (TEST_MODE) return;
  
  const data = e.data;
  if(data.eventName === 'loadProgress') {
    const percentage = Math.round(data.loadFraction * 100);
    progressFill.style.width = percentage + '%';
    progressText.textContent = Locale.ui.loading + ' ' + percentage + '%';
  }
  if(data.eventName === 'updatePlayers') {
    realPlayers = data.players || [];
    realPlayerCount = data.count || 0;
    updatePlayerList();
  }
  if(data.eventName === 'updateBlips') {
    serverBlips = data.blips || [];
    renderBlipsInline();
  }
  if(data.eventName === 'shutdown') {
    document.body.innerHTML = '';
    document.body.style.display = 'none';
  }
});

if (typeof window.rpcRegisterFunction !== 'undefined') {
  window.rpcRegisterFunction('setProgress', (progress) => {
    progressFill.style.width = progress + '%';
    progressText.textContent = Locale.ui.loading + ' ' + Math.floor(progress) + '%';
  });

  window.rpcRegisterFunction('setPlayerCount', (count) => {
    playerCount.textContent = `${count} ${Locale.ui.playersOnline}`;
  });
}

if (TEST_MODE) {
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 5 + 2;
    if (progress > 100) progress = 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = Locale.ui.loading + ' ' + Math.round(progress) + '%';
    if (progress >= 100) clearInterval(progressInterval);
  }, 500);
}
