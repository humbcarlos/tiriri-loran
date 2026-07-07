history.scrollRestoration = 'manual';

// Fire particles on splash — irradiam do centro para todas as direções
(function initFire() {
  const canvas = document.getElementById('fireCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  let animId;

  function resize() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const splashImg = document.querySelector('#splash img');

  function createParticle() {
    const rect = splashImg.getBoundingClientRect();
    const edge = Math.floor(Math.random() * 4);
    const pad = Math.random() * 20 + 5;
    let x, y;
    switch (edge) {
      case 0: x = rect.left + Math.random() * rect.width; y = rect.top - pad; break;
      case 1: x = rect.right + pad; y = rect.top + Math.random() * rect.height; break;
      case 2: x = rect.left + Math.random() * rect.width; y = rect.bottom + pad; break;
      case 3: x = rect.left - pad; y = rect.top + Math.random() * rect.height; break;
    }
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(y - cy, x - cx);
    const speed = Math.random() * 2.5 + 0.5;
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 7 + 3,
      opacity: Math.random() * 0.2 + 0.8,
      life: 1,
      decay: Math.random() * 0.006 + 0.003,
      hue: Math.random() * 10
    };
  }

  function loop() {
    if (document.getElementById('splash').classList.contains('hidden')) {
      cancelAnimationFrame(animId);
      return;
    }
    if (particles.length < 300) {
      for (let i = 0; i < 6; i++) particles.push(createParticle());
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const r = p.size * (0.3 + 0.7 * p.life);
      const a = p.life * p.opacity;
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${a})`);
      grad.addColorStop(0.4, `hsla(${p.hue + 10}, 100%, 40%, ${a * 0.6})`);
      grad.addColorStop(1, `hsla(${p.hue + 15}, 100%, 15%, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    animId = requestAnimationFrame(loop);
  }
  loop();
})();

function fadeSplash() {
  const s = document.getElementById('splash');
  if (s.classList.contains('fade-out')) return;
  s.classList.add('fade-out');
  setTimeout(() => {
    s.classList.add('hidden');
    allSections.forEach(s => s.style.display = 'none');
    document.querySelector('#inicio').style.removeProperty('display');
  }, 900);
}
setTimeout(fadeSplash, 3500);

const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('#btn');
const navLinks = document.querySelectorAll('.sidebar .nav-list li a');
const allSections = document.querySelectorAll('section[id]');
const logo = document.querySelector('.logo-details');

function isMobile() {
  return window.innerWidth <= 768;
}
function menuBtnChange() {
  closeBtn.classList.toggle('bx-menu-alt-right', sidebar.classList.contains('open'));
  closeBtn.classList.toggle('bx-menu', !sidebar.classList.contains('open'));
}

function showAllSections() {
  allSections.forEach(s => s.style.removeProperty('display'));
}

// Desktop: hover abre/fecha sidebar (não restaura seções)
sidebar.addEventListener('mouseenter', () => {
  if (!isMobile()) {
    sidebar.classList.add('open');
    menuBtnChange();
  }
});
sidebar.addEventListener('mouseleave', () => {
  if (!isMobile()) {
    sidebar.classList.remove('open');
    menuBtnChange();
  }
});

// Mobile: clique no botão toggle
closeBtn.addEventListener('click', () => {
  if (isMobile()) {
    sidebar.classList.toggle('open');
    menuBtnChange();
  }
});

// Nav links: mostra só a seção alvo e posiciona no topo
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    if (!isMobile()) {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        allSections.forEach(s => s.style.display = 'none');
        target.style.removeProperty('display');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
  link.addEventListener('click', (e) => {
    if (isMobile()) {
      sidebar.classList.remove('open');
      closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        allSections.forEach(s => s.style.display = 'none');
        target.style.removeProperty('display');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      e.preventDefault();
    }
  });
});

// Clique no logo restaura todas as seções + hero e volta ao topo
logo.addEventListener('click', () => {
  showAllSections();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
allSections.forEach(s => observer.observe(s));
