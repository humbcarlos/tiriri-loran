let currentTip = 0;
function showTip() {
  if (!Config.tips.enabled) return;
  
  const tipList = Locale.tips.list || Config.tips.list;
  const tip = tipList[currentTip];
  tipsText.classList.remove('show');
  tipExpanded = false;
  tipDetail.style.display = 'none';
  
  setTimeout(() => {
    tipsText.textContent = tip;
    tipsText.classList.add('show');
  }, 500);
  
  currentTip = (currentTip + 1) % tipList.length;
}

if (Config.tips.enabled) {
  showTip();
  setInterval(showTip, Config.tips.interval);
  
  if (Config.tips.clickable) {
    tipsContainer.addEventListener('click', () => {
      const currentTipText = tipsText.textContent;
      const tipInfo = Config.tips.clickTips[currentTipText];
      
      if (tipInfo) {
        if (!tipExpanded) {
          tipDetail.textContent = tipInfo;
          tipDetail.style.display = 'block';
          tipExpanded = true;
        } else {
          tipDetail.style.display = 'none';
          tipExpanded = false;
        }
      }
    });
  }
}
