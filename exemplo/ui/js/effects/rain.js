const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const drops = [];
const dropCount = 100;

class RainDrop {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -100;
    this.speed = Math.random() * 15 + 10;
    this.length = Math.random() * 20 + 10;
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  
  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.reset();
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 1, this.y + this.length);
    ctx.strokeStyle = `rgba(180, 180, 200, ${this.opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

for (let i = 0; i < dropCount; i++) {
  drops.push(new RainDrop());
}

function animateRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops.forEach(drop => {
    drop.update();
    drop.draw();
  });
  requestAnimationFrame(animateRain);
}
animateRain();
