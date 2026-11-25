/**
 * Easter eggs:
 *  1. A note for developers in the browser console.
 *  2. Arrow code (↑ ↑ ↓ ↓ ← → ← →): the rocket logo launches across the screen.
 *  3. Light every star in the About constellation: the constellation rocket lifts off and lands again.
 */
import { prefersReducedMotion } from './motion';

/* ---------- Shared toast ---------- */
let toastEl: HTMLDivElement | null = null;
let toastTimer = 0;
export function toast(message: string) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'egg-toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove('show'), 3200);
}

const isDarkTheme = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' || t === 'night' : window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/* ---------- 1. Console note ---------- */
function consoleNote() {
  const rocket = [
    '        /\\',
    '       /  \\',
    '      | /\\ |',
    '      | \\/ |',
    '     /|    |\\',
    '    / |    | \\',
    '   /__|____|__\\',
    '      /_\\/_\\',
    '       ´´´´',
  ].join('\n');
  console.log(`%c${rocket}`, 'color:#2dd4bf;font-family:ui-monospace,monospace;font-size:12px;line-height:1.15');
  console.log(
    "%cHey, you're inspecting my code. I like you already.%c\n" +
      "Let's talk: hhhenoksolomon@gmail.com · github.com/HenokInTheStars\n\n" +
      'Psst… there are more secrets on this site. Try typing ↑ ↑ ↓ ↓ ← → ← → on your keyboard.',
    'font:600 14px system-ui,sans-serif;color:#2dd4bf',
    'font:13px system-ui,sans-serif;color:inherit',
  );
}

/* ---------- 2. Arrow code → rocket launch ---------- */
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright'];
let progress = 0;
let launching = false;

function launchRocket() {
  toast('🚀 Houston, we have a developer.');
  if (launching || prefersReducedMotion()) return;
  launching = true;

  const logo = document.querySelector<HTMLImageElement>(isDarkTheme() ? '.brand-logo.on-dark' : '.brand-logo.on-light');
  const rocket = document.createElement('div');
  rocket.className = 'egg-rocket';
  rocket.setAttribute('aria-hidden', 'true');
  rocket.innerHTML = `<span class="egg-flame"></span><img src="${logo?.src ?? ''}" alt="">`;
  document.body.appendChild(rocket);

  // A gentle curve from bottom-left, up through the page, off the top-right corner.
  const W = window.innerWidth;
  const H = window.innerHeight;
  const p0 = { x: W * 0.06, y: H + 70 };
  const p1 = { x: W * 0.3, y: H * 0.15 };
  const p2 = { x: W + 90, y: -110 };
  const frames: Keyframe[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    frames.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg)`, offset: t });
  }
  const flight = rocket.animate(frames, { duration: 2800, easing: 'cubic-bezier(.4, 0, .7, 1)', fill: 'forwards' });

  // Trail of stars and sparks behind the rocket.
  const trail = window.setInterval(() => {
    const r = rocket.getBoundingClientRect();
    if (!r.width) return;
    for (let k = 0; k < 2; k++) {
      const s = document.createElement('span');
      const star = Math.random() < 0.45;
      s.className = star ? 'egg-spark star' : 'egg-spark';
      if (star) s.textContent = '✦';
      s.style.left = `${r.left + r.width / 2 + (Math.random() - 0.5) * 18}px`;
      s.style.top = `${r.top + r.height / 2 + (Math.random() - 0.5) * 18}px`;
      document.body.appendChild(s);
      s.animate(
        [
          { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0, transform: `translate(calc(-50% + ${(Math.random() - 0.5) * 30}px), calc(-50% + ${10 + Math.random() * 20}px)) scale(.2)` },
        ],
        { duration: 900 + Math.random() * 500, easing: 'ease-out', fill: 'forwards' },
      ).finished.then(() => s.remove());
    }
  }, 32);

  flight.finished.then(() => {
    window.clearInterval(trail);
    rocket.remove();
    launching = false;
  });
}

function initKonami() {
  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.closest('input, textarea, select, [contenteditable]')) return;
    const key = e.key.toLowerCase();
    progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
    if (progress === KONAMI.length) {
      progress = 0;
      launchRocket();
    }
  });
}

/* ---------- 3. Light every star in the constellation ---------- */
function initConstellation() {
  const sky = document.getElementById('sky');
  if (!sky) return;
  const stars = Array.from(sky.querySelectorAll<SVGGElement>('.cst-star'));
  const lines = Array.from(sky.querySelectorAll<SVGLineElement>('.cst-line'));
  const label = sky.querySelector<HTMLElement>('.sky-label');
  const title = sky.querySelector<HTMLElement>('.sky-title');
  const lit = new Set<string>();

  const update = () => {
    for (const line of lines) {
      line.classList.toggle('lit', lit.has(line.dataset.a ?? '') && lit.has(line.dataset.b ?? ''));
    }
    if (label) label.textContent = `${lit.size} / ${stars.length} stars`;
    if (lit.size === stars.length && !sky.classList.contains('complete')) {
      sky.classList.add('complete');
      if (title) title.textContent = 'You found Henok in the Stars ✦';
      toast('✦ You found Henok in the Stars');
      // Let the "found" glow play, then the constellation rocket lifts off.
      window.setTimeout(() => launchConstellation(sky, label), 1500);
    }
  };

  for (const star of stars) {
    star.addEventListener('click', () => {
      const key = star.dataset.k;
      if (!key || lit.has(key) || sky.classList.contains('complete')) return;
      lit.add(key);
      star.classList.add('lit');
      update();
    });
  }

  // Once it has landed, clicking the sky launches it again.
  sky.addEventListener('click', () => {
    if (sky.classList.contains('landed')) launchConstellation(sky, label);
  });
}

/**
 * Ignition (rumble + sparks), climb out of the top of the frame, then a slow
 * retro-burn landing back on the pad. Driven frame by frame so the exhaust
 * sparks can be dropped at the rocket's tail as it moves.
 */
function launchConstellation(sky: HTMLElement, label: HTMLElement | null) {
  const ship = sky.querySelector<SVGGElement>('#sky-ship');
  const trail = sky.querySelector<SVGGElement>('#sky-trail');
  if (!ship || !trail || sky.classList.contains('launching')) return;
  if (prefersReducedMotion()) return;

  const SVG = 'http://www.w3.org/2000/svg';
  const IGNITE = 1100;
  const CLIMB = 1700;
  const COAST = 700;
  const LAND = 2200;
  const TOP = -250; // far enough up that the whole rocket and its flame leave the frame
  const TAIL_Y = 150;
  const again = window.matchMedia('(pointer: fine)').matches ? 'Click to fly again' : 'Tap to fly again';

  sky.classList.remove('landed');
  sky.classList.add('launching');
  if (label) label.textContent = 'Ignition';

  const spark = (x: number, y: number, spread: number, fall: number) => {
    const c = document.createElementNS(SVG, 'circle');
    const hot = Math.random() < 0.6;
    c.setAttribute('cx', (x + (Math.random() - 0.5) * 6).toFixed(1));
    c.setAttribute('cy', y.toFixed(1));
    c.setAttribute('r', (0.5 + Math.random() * 1.1).toFixed(2));
    c.setAttribute('fill', hot ? (Math.random() < 0.5 ? '#ffd27a' : '#ff7a3d') : '#e6fffb');
    trail.appendChild(c);
    c.animate(
      [
        { opacity: 1, transform: 'translate(0px, 0px)' },
        { opacity: 0, transform: `translate(${((Math.random() - 0.5) * spread).toFixed(1)}px, ${(fall * (0.6 + Math.random() * 0.8)).toFixed(1)}px)` },
      ],
      { duration: 700 + Math.random() * 600, easing: 'ease-out', fill: 'forwards' },
    ).finished.then(() => c.remove());
  };

  const t0 = performance.now();
  let lastSpark = 0;
  let phase = '';
  const setLabel = (text: string) => {
    if (phase === text) return;
    phase = text;
    if (label) label.textContent = text;
  };

  const frame = (now: number) => {
    const t = now - t0;
    let x = 0;
    let y = 0;
    let burning = true;
    let spread = 10;
    let fall = 16;

    if (t < IGNITE) {
      // Rumble on the pad, growing stronger; smoke and sparks spray sideways.
      const k = t / IGNITE;
      x = Math.sin(t / 16) * 0.9 * k;
      y = Math.sin(t / 23) * 0.35 * k;
      spread = 34;
      fall = 6;
      setLabel(k < 0.5 ? 'Ignition' : 'Liftoff');
    } else if (t < IGNITE + CLIMB) {
      const k = (t - IGNITE) / CLIMB;
      y = TOP * k ** 2.2;
      x = Math.sin(t / 30) * 0.4 * (1 - k);
      fall = 22;
    } else if (t < IGNITE + CLIMB + COAST) {
      y = TOP;
      burning = false;
      setLabel('In orbit');
    } else if (t < IGNITE + CLIMB + COAST + LAND) {
      // Come back down tail first, slowing to a soft touchdown.
      const k = (t - IGNITE - CLIMB - COAST) / LAND;
      y = TOP * (1 - k) ** 3;
      spread = k > 0.85 ? 28 : 8;
      fall = k > 0.85 ? 5 : 12;
      setLabel('Landing');
    } else {
      ship.style.transform = '';
      sky.classList.remove('launching', 'burning');
      sky.classList.add('landed');
      if (label) label.textContent = again;
      toast('✦ Touchdown. Thanks for exploring');
      return;
    }

    ship.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    sky.classList.toggle('burning', burning);
    if (burning && now - lastSpark > 34 && y > TOP + 20) {
      lastSpark = now;
      spark(70 + x, TAIL_Y + y, spread, fall);
      spark(70 + x, TAIL_Y + y, spread, fall);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

consoleNote();
initKonami();
initConstellation();
