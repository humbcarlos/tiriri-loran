const FireEffects = {
  canvas: null,
  ctx: null,
  fires: [],
  enabled: true,

  init() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "fireCanvas";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.createFires();
    this.animate();
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  createFires() {
    const positions = [
      { x: 0.08, y: 0.82 },
      { x: 0.92, y: 0.82 },
      { x: 0.03, y: 0.48 },
      { x: 0.97, y: 0.48 },
      { x: 0.22, y: 0.88 },
      { x: 0.78, y: 0.88 },
      { x: 0.12, y: 0.12 },
      { x: 0.88, y: 0.12 }
    ];

    positions.forEach((pos, i) => {
      this.fires.push({
        x: window.innerWidth * pos.x,
        y: window.innerHeight * pos.y,
        particles: [],
        baseSize: 8 + Math.random() * 4,
        flickerSpeed: 0.1 + Math.random() * 0.1
      });
    });
  },

  createParticle(fire) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.5;
    return {
      x: fire.x + (Math.random() - 0.5) * 10,
      y: fire.y,
      vx: Math.cos(angle) * speed,
      vy: -Math.random() * 2 - 1,
      size: Math.random() * 4 + 2,
      life: 1,
      decay: 0.02 + Math.random() * 0.02,
      color: Math.random() > 0.3 ? "255, 150, 50" : "255, 200, 100"
    };
  },

  updateFire(fire) {
    if (Math.random() > 0.7) {
      fire.particles.push(this.createParticle(fire));
    }

    fire.particles = fire.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.05;
      p.life -= p.decay;
      p.size *= 0.98;
      return p.life > 0 && p.size > 0.5;
    });
  },

  drawFire(fire) {
    fire.particles.forEach(p => {
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
      gradient.addColorStop(0, `rgba(${p.color}, ${p.life})`);
      gradient.addColorStop(0.5, `rgba(255, 100, 30, ${p.life * 0.5})`);
      gradient.addColorStop(1, "rgba(255, 50, 0, 0)");
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    const flicker = Math.sin(Date.now() * fire.flickerSpeed) * 0.3 + 0.7;
    const glowGradient = this.ctx.createRadialGradient(fire.x, fire.y, 0, fire.x, fire.y, fire.baseSize * 3 * flicker);
    glowGradient.addColorStop(0, "rgba(255, 150, 50, 0.15)");
    glowGradient.addColorStop(0.5, "rgba(255, 100, 30, 0.05)");
    glowGradient.addColorStop(1, "rgba(255, 50, 0, 0)");
    
    this.ctx.beginPath();
    this.ctx.arc(fire.x, fire.y, fire.baseSize * 3 * flicker, 0, Math.PI * 2);
    this.ctx.fillStyle = glowGradient;
    this.ctx.fill();
  },

  animate() {
    if (!this.enabled) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fires.forEach(fire => {
      this.updateFire(fire);
      this.drawFire(fire);
    });
    requestAnimationFrame(() => this.animate());
  },

  disable() {
    this.enabled = false;
    if (this.canvas) this.canvas.remove();
  }
};

const FogEffect = {
  canvas: null,
  ctx: null,
  layers: [],
  enabled: true,
  intensity: 0.15,
  speed: 0.5,

  init(intensity = 0.15, speed = 0.5) {
    this.intensity = intensity;
    this.speed = speed;
    
    this.canvas = document.createElement("canvas");
    this.canvas.id = "fogCanvas";
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
    
    for (let i = 0; i < 3; i++) {
      this.layers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        width: window.innerWidth * (1.5 + Math.random()),
        height: window.innerHeight * (0.3 + Math.random() * 0.3),
        speed: (0.2 + Math.random() * 0.3) * this.speed,
        opacity: (0.1 + Math.random() * 0.1) * this.intensity
      });
    }
    
    this.animate();
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  updateLayer(layer) {
    layer.x += layer.speed;
    if (layer.x > window.innerWidth) {
      layer.x = -layer.width;
      layer.y = Math.random() * window.innerHeight;
    }
  },

  drawLayer(layer) {
    const gradient = this.ctx.createLinearGradient(layer.x, layer.y, layer.x + layer.width, layer.y + layer.height);
    gradient.addColorStop(0, "rgba(100, 100, 120, 0)");
    gradient.addColorStop(0.3, `rgba(100, 100, 120, ${layer.opacity})`);
    gradient.addColorStop(0.7, `rgba(100, 100, 120, ${layer.opacity})`);
    gradient.addColorStop(1, "rgba(100, 100, 120, 0)");

    this.ctx.beginPath();
    this.ctx.ellipse(
      layer.x + layer.width / 2,
      layer.y + layer.height / 2,
      layer.width / 2,
      layer.height / 2,
      0, 0, Math.PI * 2
    );
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  },

  animate() {
    if (!this.enabled) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.layers.forEach(layer => {
      this.updateLayer(layer);
      this.drawLayer(layer);
    });
    requestAnimationFrame(() => this.animate());
  },

  disable() {
    this.enabled = false;
    if (this.canvas) this.canvas.remove();
  }
};

if (Config.fire.enabled) {
  FireEffects.init();
}

if (Config.fog.enabled) {
  FogEffect.init(Config.fog.intensity, Config.fog.speed);
}
