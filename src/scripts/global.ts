import { prefersReducedMotion, finePointer } from './motion';

/* Scroll reveal: elements below the fold slide up gently. Never hidden at rest. */
function initReveal() {
  if (prefersReducedMotion()) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add('pre');
      io.observe(el);
    }
  });
}

/* Buttons drift slightly toward the cursor. */
function initMagnetic() {
  if (!finePointer()) return;
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      if (prefersReducedMotion()) return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.22;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });
}

/* Cursor spotlight on project cards. */
function initSpotlight() {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

initReveal();
initMagnetic();
initSpotlight();
