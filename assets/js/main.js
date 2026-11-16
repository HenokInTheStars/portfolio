/**
 * Technical Editorial - Main Site Interactions
 * Handles dark/light mode, parallax, the contact modal and forms, and nav state.
 */

const CONTACT_EMAIL = 'hhhenoksolomon@gmail.com';
// FormSubmit alias for the address above (keeps the raw address out of the endpoint URL).
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/654be654f596ab445f997f25b36c13fb';
const SUBMIT_TIMEOUT_MS = 15000;

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => reducedMotionQuery.matches;
const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

function bootPortfolio() {
  initThemeToggle();
  syncPortfolioCounts();
  initContactModal();
  highlightActiveNav();
  initParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPortfolio);
} else {
  bootPortfolio();
}

/* ==========================================================================
   0. Parallax & Card Tilt (disabled when the visitor prefers reduced motion)
   ========================================================================== */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-el[data-speed]');
  if (!parallaxElements.length) return;

  let ticking = false;
  let enabled = false;

  function updateParallax() {
    ticking = false;
    if (!enabled) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.15;
      const rect = el.getBoundingClientRect();

      // Only calculate if element is within or near the visible viewport
      if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
        let translateY;
        if (el.closest('#parallax-bg-layer')) {
          // Ambient background glow orbs drift continuously with page scroll
          translateY = (scrollY * speed).toFixed(1);
        } else {
          // In-page cards displace based on scroll progress
          const elementProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
          translateY = ((elementProgress - 0.5) * speed * 120).toFixed(1);
        }

        el.dataset.parallaxY = translateY;

        // Apply transform if element is not currently tilted by mouse
        if (!el.dataset.isTilting) {
          el.style.transform = `translate3d(0, ${translateY}px, 0)`;
        }
      }
    });
  }

  function onScroll() {
    if (enabled && !ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function applyMotionPreference() {
    enabled = !prefersReducedMotion();
    if (enabled) {
      updateParallax();
    } else {
      parallaxElements.forEach(el => {
        el.style.transform = '';
        delete el.dataset.parallaxY;
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reducedMotionQuery.addEventListener('change', applyMotionPreference);

  applyMotionPreference();
  initCardTiltParallax();
}

function initCardTiltParallax() {
  const cards = document.querySelectorAll('#hero-pipeline-card, #selected-work article');
  if (!cards.length) return;

  cards.forEach(card => {
    let tiltRaf = null;

    card.addEventListener('mousemove', (e) => {
      if (prefersReducedMotion()) return;
      card.dataset.isTilting = 'true';
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      tiltRaf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (((y - centerY) / centerY) * -6).toFixed(2);
        const rotateY = (((x - centerX) / centerX) * 6).toFixed(2);

        const currentY = card.dataset.parallaxY || '0';

        card.style.transform = `translate3d(0, ${currentY}px, 0) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
      delete card.dataset.isTilting;
      const currentY = card.dataset.parallaxY;
      card.style.transform = currentY ? `translate3d(0, ${currentY}px, 0)` : '';
    });
  });
}

/* ==========================================================================
   1. Theme Toggle System
   ========================================================================== */
function initThemeToggle() {
  const toggleButtons = document.querySelectorAll('[data-action="toggle-theme"], button[aria-label="Toggle color mode"]');

  function updateIcons(isDark) {
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = isDark ? 'light_mode' : 'contrast';
      }
      btn.setAttribute('aria-pressed', String(isDark));
    });
  }

  const isInitiallyDark = document.documentElement.classList.contains('dark');
  updateIcons(isInitiallyDark);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch (err) {
        /* storage unavailable (private mode): theme still applies for this page */
      }
      updateIcons(isDark);
    });
  });
}

/* ==========================================================================
   2. Dynamic Portfolio Stats & Count Synchronization
   ========================================================================== */
function syncPortfolioCounts() {
  // work.html renders .project-card elements; lab.html renders .tool-card elements.
  // On other pages, fall back to the known totals.
  const liveProjects = document.querySelectorAll('.project-card').length;
  const liveExperiments = document.querySelectorAll('.tool-card').length;

  const projectsCount = liveProjects > 0 ? liveProjects : 6;
  const experimentsCount = liveExperiments > 0 ? liveExperiments : 5;

  document.querySelectorAll('[data-stat="projects-count"]').forEach(el => {
    el.textContent = projectsCount;
  });

  document.querySelectorAll('[data-stat="experiments-count"]').forEach(el => {
    el.textContent = experimentsCount;
  });
}

/* ==========================================================================
   3. Contact: shared submission + status helpers
   ========================================================================== */

/**
 * Sends a message through FormSubmit's AJAX endpoint.
 * Resolves to { ok: true } only when FormSubmit confirms success.
 */
async function submitContactMessage({ name, email, topic, message, honey }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        topic,
        message,
        _honey: honey || '',
        _subject: `[Portfolio Inquiry] ${topic} from ${name}`,
        _template: 'table',
        _replyto: email
      }),
      signal: controller.signal
    });

    let data = {};
    try {
      data = await response.json();
    } catch (parseErr) {
      /* non-JSON body: treat as failure below */
    }

    const confirmed = response.ok && (data.success === true || data.success === 'true');
    return confirmed ? { ok: true } : { ok: false, reason: data.message || `HTTP ${response.status}` };
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

function buildMailtoLink({ name, email, topic, message }) {
  const subject = encodeURIComponent(`[Portfolio Inquiry] ${topic} from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

const STATUS_BASE = 'empty:hidden p-3 rounded-lg font-code text-xs';
const STATUS_STYLES = {
  pending: 'bg-surface-container text-on-surface border border-secondary-fixed',
  success: 'bg-primary/15 text-primary border border-primary/30 space-y-1',
  error: 'bg-error/15 text-error border border-error/30 space-y-1'
};

function setStatus(box, kind, html) {
  if (!box) return;
  if (!kind) {
    box.className = STATUS_BASE;
    box.textContent = '';
    return;
  }
  box.className = `${STATUS_BASE} ${STATUS_STYLES[kind]}`;
  box.innerHTML = html;
}

function pendingStatusHtml() {
  return `
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true"></span>
      <span>Sending your message…</span>
    </div>`;
}

function errorStatusHtml(fields) {
  const mailto = escapeHtml(buildMailtoLink(fields));
  return `
    <div class="flex items-center gap-1.5 font-bold">
      <span class="material-symbols-outlined text-[16px]" aria-hidden="true">error</span>
      <span>Your message wasn't sent.</span>
    </div>
    <p class="font-body-md text-xs text-on-surface">
      The form service didn't confirm delivery. Your text is still in the form, so you can try again, or
      <a href="${mailto}" class="text-primary underline">send it from your email app</a>
      (to ${escapeHtml(CONTACT_EMAIL)}).
    </p>`;
}

function readContactFields(prefix) {
  const value = (id) => {
    const el = document.getElementById(`${prefix}-${id}`);
    return el ? el.value.trim() : '';
  };
  return {
    name: value('name'),
    email: value('email'),
    topic: value('topic'),
    message: value('message'),
    honey: value('honey')
  };
}

async function copyEmail(button, iconEl, labelEl, idleLabel) {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    if (iconEl) iconEl.textContent = 'check';
    if (labelEl) labelEl.textContent = 'Copied';
    button.classList.add('bg-primary/20', 'text-primary');
    setTimeout(() => {
      if (iconEl) iconEl.textContent = 'content_copy';
      if (labelEl) labelEl.textContent = idleLabel;
      button.classList.remove('bg-primary/20', 'text-primary');
    }, 2000);
  } catch (err) {
    if (labelEl) labelEl.textContent = 'Press Ctrl+C';
  }
}

/* ==========================================================================
   4. Contact Modal (accessible dialog) & inline form
   ========================================================================== */
function initContactModal() {
  if (!document.getElementById('contact-modal-backdrop')) {
    const modalHtml = `
      <div id="contact-modal-backdrop" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
        <div id="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" aria-describedby="contact-modal-desc"
          class="w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto bg-surface-container-lowest border border-secondary-fixed rounded-2xl shadow-2xl flex flex-col scale-95 opacity-0 transition-all duration-200">

          <div class="h-1 bg-primary w-full shrink-0" aria-hidden="true"></div>

          <div class="p-space-md border-b border-secondary-fixed bg-surface-container-low flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]" aria-hidden="true">mail</span>
              <div>
                <h2 id="contact-modal-title" class="font-headline-md text-headline-md text-on-surface">Contact</h2>
                <p id="contact-modal-desc" class="font-code text-[11px] text-on-surface-variant">Send me a message. It goes straight to my inbox.</p>
              </div>
            </div>
            <button id="contact-modal-close" type="button" aria-label="Close contact dialog"
              class="w-11 h-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
              <span class="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>

          <div class="px-space-md py-2.5 bg-surface-container-lowest border-b border-secondary-fixed/50 flex flex-wrap items-center justify-between gap-2 font-code text-label-sm">
            <div class="flex items-center gap-1.5 text-on-surface-variant">
              <span class="text-secondary text-[10px] uppercase">Email:</span>
              <span class="text-on-surface font-medium select-all">${CONTACT_EMAIL}</span>
            </div>
            <button id="contact-copy-btn" type="button"
              class="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 text-[11px] cursor-pointer">
              <span class="material-symbols-outlined text-[13px]" id="contact-copy-icon" aria-hidden="true">content_copy</span>
              <span id="contact-copy-label">Copy Email</span>
            </button>
          </div>

          <form id="contact-form" class="p-space-md space-y-3">
            <div class="hidden" aria-hidden="true">
              <label for="contact-honey">Leave this field empty</label>
              <input id="contact-honey" type="text" name="_honey" tabindex="-1" autocomplete="off">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label for="contact-name" class="font-code text-[11px] text-on-surface-variant uppercase">Your Name</label>
                <input id="contact-name" name="name" type="text" required autocomplete="name" placeholder="Alex Turner"
                  class="w-full bg-surface-container-low border border-secondary-fixed text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors placeholder:text-secondary" />
              </div>
              <div class="space-y-1">
                <label for="contact-email" class="font-code text-[11px] text-on-surface-variant uppercase">Your Email</label>
                <input id="contact-email" name="email" type="email" required autocomplete="email" placeholder="alex@company.com"
                  class="w-full bg-surface-container-low border border-secondary-fixed text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors placeholder:text-secondary" />
              </div>
            </div>

            <div class="space-y-1">
              <label for="contact-topic" class="font-code text-[11px] text-on-surface-variant uppercase">Inquiring About</label>
              <select id="contact-topic" name="topic"
                class="w-full bg-surface-container-low border border-secondary-fixed text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors cursor-pointer">
                <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                <option value="Machine Learning Project">Machine Learning Project</option>
                <option value="Full-Time or Contract Role">Full-Time or Contract Role</option>
                <option value="Something Else">Something Else</option>
              </select>
            </div>

            <div class="space-y-1">
              <label for="contact-message" class="font-code text-[11px] text-on-surface-variant uppercase">Message</label>
              <textarea id="contact-message" name="message" rows="4" required placeholder="Tell me about your project, role, or timeline..."
                class="w-full bg-surface-container-low border border-secondary-fixed text-on-surface rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors placeholder:text-secondary resize-none"></textarea>
            </div>

            <div id="contact-status-box" role="status" aria-live="polite" class="${STATUS_BASE}"></div>

            <div class="pt-1 flex items-center justify-between gap-3">
              <span class="font-code text-[10px] text-on-surface-variant">Delivered by email via FormSubmit</span>
              <button id="contact-submit-btn" type="submit"
                class="min-h-[44px] px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-headline-md text-body-md hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined text-[16px]" aria-hidden="true">send</span>
                <span id="contact-submit-label">Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const backdrop = document.getElementById('contact-modal-backdrop');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close');
  const copyBtn = document.getElementById('contact-copy-btn');
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitLabel = document.getElementById('contact-submit-label');
  const statusBox = document.getElementById('contact-status-box');

  let lastFocused = null;

  function getFocusable() {
    return Array.from(
      modal.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => el.offsetParent !== null);
  }

  // Everything outside the dialog becomes inert while it is open.
  function setBackgroundInert(isInert) {
    Array.from(document.body.children).forEach(el => {
      if (el === backdrop || el.tagName === 'SCRIPT') return;
      if (isInert) {
        el.setAttribute('inert', '');
      } else {
        el.removeAttribute('inert');
      }
    });
  }

  function openContactModal() {
    if (!backdrop.classList.contains('hidden')) return;
    lastFocused = document.activeElement;
    backdrop.classList.remove('hidden');
    setBackgroundInert(true);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      modal.classList.remove('scale-95', 'opacity-0');
      modal.classList.add('scale-100', 'opacity-100');
      const firstInput = document.getElementById('contact-name');
      if (firstInput) firstInput.focus();
    });
  }

  function closeContactModal() {
    if (backdrop.classList.contains('hidden')) return;
    modal.classList.remove('scale-100', 'opacity-100');
    modal.classList.add('scale-95', 'opacity-0');
    setBackgroundInert(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      backdrop.classList.add('hidden');
      setStatus(statusBox, null);
    }, prefersReducedMotion() ? 0 : 150);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () =>
      copyEmail(copyBtn, document.getElementById('contact-copy-icon'), document.getElementById('contact-copy-label'), 'Copy Email'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = readContactFields('contact');
      if (!fields.name || !fields.email || !fields.message) return;

      submitBtn.disabled = true;
      submitLabel.textContent = 'Sending…';
      setStatus(statusBox, 'pending', pendingStatusHtml());

      const result = await submitContactMessage(fields);

      if (result.ok) {
        setStatus(statusBox, 'success', `
          <div class="flex items-center gap-1.5 font-bold">
            <span class="material-symbols-outlined text-[16px]" aria-hidden="true">check_circle</span>
            <span>Message sent</span>
          </div>
          <p class="font-body-md text-xs text-on-surface leading-relaxed">Thanks, <strong>${escapeHtml(fields.name)}</strong>. I'll reply to <code>${escapeHtml(fields.email)}</code>.</p>
        `);
        form.reset();
        submitLabel.textContent = 'Send Message';
      } else {
        console.warn('Contact form not delivered:', result.reason);
        setStatus(statusBox, 'error', errorStatusHtml(fields));
        submitLabel.textContent = 'Try again';
      }
      submitBtn.disabled = false;
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeContactModal);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeContactModal();
    });
  }

  // Escape closes; Tab / Shift+Tab stay inside the dialog.
  document.addEventListener('keydown', (e) => {
    if (!backdrop || backdrop.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeContactModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  initInlineContactForm();
  wireContactTriggers(openContactModal);

  window.openContactModal = openContactModal;
  window.closeContactModal = closeContactModal;
}

function initInlineContactForm() {
  const inlineForm = document.getElementById('inline-contact-form');
  if (!inlineForm) return;

  const submitBtn = document.getElementById('inline-submit-btn');
  const submitLabel = document.getElementById('inline-submit-label');
  const statusBox = document.getElementById('inline-status-box');
  const copyBtn = document.getElementById('inline-copy-email-btn');
  const confirmationCard = document.getElementById('inline-confirmation-card');
  const sendAnotherBtn = document.getElementById('inline-send-another-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () =>
      copyEmail(copyBtn, document.getElementById('inline-copy-icon'), document.getElementById('inline-copy-label'), 'Copy'));
  }

  function showConfirmation({ name, email, topic }) {
    document.getElementById('confirm-user-name').textContent = name;
    document.getElementById('confirm-user-email').textContent = email;
    document.getElementById('confirm-user-topic').textContent = topic.toLowerCase();

    inlineForm.classList.add('hidden');
    setStatus(statusBox, null);
    confirmationCard.classList.remove('hidden');
    confirmationCard.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
    // Move focus so keyboard and screen-reader users land on the result.
    confirmationCard.focus({ preventScroll: true });
  }

  if (sendAnotherBtn) {
    sendAnotherBtn.addEventListener('click', () => {
      confirmationCard.classList.add('hidden');
      inlineForm.reset();
      inlineForm.classList.remove('hidden');
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send Message';
      const nameInput = document.getElementById('inline-name');
      if (nameInput) nameInput.focus();
    });
  }

  inlineForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = readContactFields('inline');

    if (!fields.name || !fields.email || !fields.message) {
      setStatus(statusBox, 'error', 'Please fill in your name, email, and message.');
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';
    setStatus(statusBox, 'pending', pendingStatusHtml());

    const result = await submitContactMessage(fields);

    if (result.ok) {
      showConfirmation(fields);
    } else {
      console.warn('Contact form not delivered:', result.reason);
      setStatus(statusBox, 'error', errorStatusHtml(fields));
      submitLabel.textContent = 'Try again';
      submitBtn.disabled = false;
    }
  });
}

// Contact links scroll to the in-page form on the home page, and open the modal elsewhere.
function wireContactTriggers(openContactModal) {
  const path = window.location.pathname;
  const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
  const contactTriggers = document.querySelectorAll(
    `[data-action="contact"], a[href="#contact"], a[href="index.html#contact"], a[href*="mailto:${CONTACT_EMAIL}"]`
  );
  contactTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const href = trigger.getAttribute('href');
      const contactSection = document.getElementById('contact');
      e.preventDefault();
      if (isHome && contactSection && (href === '#contact' || href === 'index.html#contact')) {
        contactSection.scrollIntoView({ behavior: scrollBehavior() });
        const nameInput = document.getElementById('inline-name');
        if (nameInput && !nameInput.closest('.hidden')) nameInput.focus({ preventScroll: true });
        return;
      }
      openContactModal();
    });
  });
}

/* ==========================================================================
   5. Active Navigation Detection
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav[aria-label="Primary navigation"] a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop().split('#')[0];

    if (
      (currentPath === '' && linkPath === 'index.html') ||
      (currentPath === 'index.html' && (linkPath === 'index.html' || linkPath === '#')) ||
      (currentPath.includes(linkPath) && linkPath !== '')
    ) {
      link.classList.add('text-on-surface', 'border-b-2', 'border-primary');
      link.classList.remove('text-on-surface-variant');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* Helpers */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
