const particlesCanvas = document.createElement("canvas");
document.body.appendChild(particlesCanvas);
const particlesCtx = particlesCanvas.getContext("2d");

particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;
particlesCanvas.style.zIndex = "3";
particlesCanvas.style.position = "fixed";
particlesCanvas.style.pointerEvents = "none";

let particles = [];
const particleCount = 40;

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = Math.random() * particlesCanvas.width;
    this.y = Math.random() * particlesCanvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = Math.random() * 0.2 + 0.05;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.7 ? '232, 184, 74' : '255, 255, 255';
  }
  
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.y > particlesCanvas.height) {
      this.y = -10;
      this.x = Math.random() * particlesCanvas.width;
    }
    if (this.x < 0) this.x = particlesCanvas.width;
    if (this.x > particlesCanvas.width) this.x = 0;
  }
  
  draw() {
    particlesCtx.beginPath();
    particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesCtx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    particlesCtx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
});
