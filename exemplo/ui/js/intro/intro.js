let introIndex = 0;

function showIntroText() {
  if (introIndex < Locale.intro.messages.length) {
    introText.textContent = Locale.intro.messages[introIndex];
    introText.style.display = 'block';
    introText.style.animation = 'none';
    introText.offsetHeight;
    introText.style.animation = 'introTextAnim 3s ease-out forwards';
    introIndex++;
    setTimeout(showIntroText, 1500);
  } else {
    setTimeout(() => {
      document.getElementById('intro').style.display = 'none';
      showNextTimelineMessage();
    }, 1500);
  }
}

if (Config.intro.enabled) {
  showIntroText();
} else {
  document.getElementById('intro').style.display = 'none';
}

function nextScene() {
  if (!Config.backgrounds.enabled) return;
  scenes[currentScene].classList.remove('active');
  currentScene = (currentScene + 1) % scenes.length;
  scenes[currentScene].classList.add('active');
}

if (Config.backgrounds.enabled) {
  setInterval(nextScene, Config.backgrounds.interval);
}

let timelineDone = {};
let timelineIndex = 0;

function showNextTimelineMessage() {
  if (timelineIndex < Locale.timeline.length) {
    const item = Locale.timeline[timelineIndex];
    textEl.classList.remove("show");
    setTimeout(() => { 
      textEl.innerText = item.text; 
      textEl.classList.add("show"); 
    }, 500);
    timelineIndex++;
    setTimeout(showNextTimelineMessage, 8000);
  }
}

if (Locale.timeline.length > 0) {
  // Timeline starts after intro ends
}
