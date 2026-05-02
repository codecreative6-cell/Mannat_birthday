// ── CANVAS PARTICLES (infinite, rose petals + confetti) ──
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = [
  'rgba(255,133,179,0.75)',
  'rgba(244,200,66,0.75)',
  'rgba(201,123,178,0.65)',
  'rgba(255,182,204,0.6)',
  'rgba(244,200,66,0.45)',
  'rgba(255,214,231,0.5)',
];

const pieces = Array.from({ length: 110 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  r: 1.5 + Math.random() * 4,
  vy: 0.6 + Math.random() * 1.4,
  vx: (Math.random() - 0.5) * 0.7,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  angle: Math.random() * Math.PI * 2,
  av: (Math.random() - 0.5) * 0.04,
  type: Math.floor(Math.random() * 4),
  wobble: Math.random() * Math.PI * 2,
  wobbleSpeed: 0.015 + Math.random() * 0.025,
  opacity: 0.4 + Math.random() * 0.6,
}));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    p.wobble += p.wobbleSpeed;
    p.y += p.vy;
    p.x += p.vx + Math.sin(p.wobble) * 0.5;
    p.angle += p.av;
    if (p.y > canvas.height + 30) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    if (p.type === 0) {
      ctx.fillRect(-p.r * 2, -p.r / 2, p.r * 4, p.r);
    } else if (p.type === 1) {
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 2) {
      ctx.beginPath();
      ctx.moveTo(0, -p.r * 1.5);
      ctx.lineTo(p.r, 0);
      ctx.lineTo(0, p.r * 1.5);
      ctx.lineTo(-p.r, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      const s = p.r * 0.6;
      ctx.beginPath();
      ctx.moveTo(0, s);
      ctx.bezierCurveTo(-s * 2, -s, -s * 3.5, s, 0, s * 3);
      ctx.bezierCurveTo(s * 3.5, s, s * 2, -s, 0, s);
      ctx.fill();
    }
    ctx.restore();
  });
  requestAnimationFrame(draw);
}
draw();

// ── CURSOR SPARKLE TRAIL ──
const sparkles = [];
document.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 2; i++) {
    sparkles.push({
      x: e.clientX + (Math.random() - 0.5) * 20,
      y: e.clientY + (Math.random() - 0.5) * 20,
      r: 1 + Math.random() * 3,
      life: 1,
      color: Math.random() > 0.5 ? '#ff85b3' : '#f4c842',
      vy: -0.5 - Math.random(),
      vx: (Math.random() - 0.5) * 1.5,
    });
  }
});

const sparkCanvas = document.createElement('canvas');
sparkCanvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;width:100%;height:100%';
document.body.appendChild(sparkCanvas);
const sctx = sparkCanvas.getContext('2d');

function resizeSpark() {
  sparkCanvas.width = innerWidth;
  sparkCanvas.height = innerHeight;
}
resizeSpark();
window.addEventListener('resize', resizeSpark);

function drawSparkles() {
  sctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.life -= 0.03;
    s.x += s.vx;
    s.y += s.vy;
    s.r *= 0.96;
    if (s.life <= 0) { sparkles.splice(i, 1); continue; }
    sctx.save();
    sctx.globalAlpha = s.life * 0.8;
    sctx.fillStyle = s.color;
    sctx.shadowBlur = 6;
    sctx.shadowColor = s.color;
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();
  }
  requestAnimationFrame(drawSparkles);
}
drawSparkles();

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll(
  '.sh-card, .fact-card, .msg-card, .sec-heading, .sec-label, .divider'
);

const revealStyle = document.createElement('style');
revealStyle.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(revealStyle);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(36px)';
  el.style.transition = `opacity 0.7s ease ${i * 0.07}s, transform 0.7s ease ${i * 0.07}s`;
  observer.observe(el);
});

// ── TYPEWRITER on msg-greeting ──
const greetingEl = document.querySelector('.msg-greeting');
if (greetingEl) {
  const fullText = greetingEl.textContent.trim();
  greetingEl.textContent = '';
  greetingEl.style.cssText += 'border-right:2px solid #ff85b3;display:inline-block;';

  const typeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let i = 0;
        const interval = setInterval(() => {
          greetingEl.textContent = fullText.slice(0, i);
          i++;
          if (i > fullText.length) {
            clearInterval(interval);
            setTimeout(() => { greetingEl.style.borderRight = 'none'; }, 700);
          }
        }, 52);
        typeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  typeObs.observe(greetingEl);
}

// ── FLOATING EMOJIS (DOM) ──
const floatStyle = document.createElement('style');
floatStyle.textContent = `
  @keyframes floatUpEmoji {
    0%   { transform: translateY(0) rotate(-10deg);  opacity: 0; }
    10%  { opacity: 0.85; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(-110vh) rotate(15deg); opacity: 0; }
  }
`;
document.head.appendChild(floatStyle);

const emojis = ['🌸', '💕', '✨', '💛', '🌸', '💖', '⭐'];
function spawnEmoji() {
  const el = document.createElement('div');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const dur = 5 + Math.random() * 4;
  el.style.cssText = `
    position:fixed;
    left:${Math.random() * 100}vw;
    bottom:-50px;
    font-size:${14 + Math.random() * 16}px;
    pointer-events:none;
    z-index:9001;
    animation:floatUpEmoji ${dur}s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}
setInterval(spawnEmoji, 1400);

// ── 3D TILT on shayari cards ──
document.querySelectorAll('.sh-card').forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    card.style.transition = 'transform 0.5s ease';
  });
});

// ── WISH LIST items pop in one by one ──
const wishItems = document.querySelectorAll('.msg-wish-list li');
const wishObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      wishItems.forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        li.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
        }, 100);
      });
      wishObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
if (wishItems.length) wishObs.observe(wishItems[0]);

// ── PHOTO click burst ──
const photoImg = document.querySelector('.photo-outer img');
if (photoImg) {
  photoImg.style.cursor = 'pointer';
  photoImg.addEventListener('click', () => {
    photoImg.style.transform = 'scale(1.12)';
    photoImg.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(() => { photoImg.style.transform = 'scale(1)'; }, 320);
    const rect = photoImg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 20; i++) {
      sparkles.push({
        x: cx, y: cy,
        r: 2 + Math.random() * 5,
        life: 1,
        color: Math.random() > 0.5 ? '#ff85b3' : '#f4c842',
        vy: -2 - Math.random() * 4,
        vx: (Math.random() - 0.5) * 8,
      });
    }
  });
}

// ── TICKER pause on hover ──
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

// ── NEON-BADGE shimmer on hover ──
const badge = document.querySelector('.neon-badge');
if (badge) {
  badge.addEventListener('mouseenter', () => {
    badge.style.background = 'rgba(244,200,66,0.12)';
    badge.style.boxShadow = '0 0 40px rgba(244,200,66,0.4), inset 0 0 20px rgba(244,200,66,0.1)';
    badge.style.transition = 'all 0.3s ease';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.background = 'rgba(244,200,66,0.03)';
    badge.style.boxShadow = '0 0 20px rgba(244,200,66,0.15), inset 0 0 20px rgba(244,200,66,0.05)';
  });
}
