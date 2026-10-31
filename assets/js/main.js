/**
 * Technical Editorial - Main Site Interactions
 * Handles Dark/Light Mode, Command Palette (⌘K), and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCommandPalette();
  highlightActiveNav();
});

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
    });
  }

  const isInitiallyDark = document.documentElement.classList.contains('dark');
  updateIcons(isInitiallyDark);

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateIcons(isDark);
    });
  });
}

/* ==========================================================================
   2. Command Palette (⌘K) & Search System
   ========================================================================== */
const SEARCH_INDEX = [
  // Pages
  { title: "Home // Index", category: "Navigation", url: "index.html", desc: "Hero, architecture overview, and telemetry" },
  { title: "Work & Systems", category: "Navigation", url: "work.html", desc: "Production case studies, latency benchmarks, and RFCs" },
  { title: "The Lab", category: "Navigation", url: "lab.html", desc: "Experimental sandboxes, prototypes, and streaming tools" },
  { title: "Writing & Notes", category: "Navigation", url: "writing.html", desc: "Technical essays on UI latency, streaming, and compilers" },
  { title: "About / Colophon", category: "Navigation", url: "index.html#about", desc: "Design rationale, colophon, and contact details" },

  // Projects
  { title: "Smart Front Desk System", category: "Projects", url: "work.html#smart-front-desk", desc: "Asynchronous front desk automation, FastAPI, Pydantic V2, sub-100ms API latency" },
  { title: "Ethiopian Airlines Flight Price Prediction Engine", category: "Projects", url: "work.html#flight-price", desc: "11-algorithm regression benchmark, LightGBM/XGBoost, interactive Streamlit app" },
  { title: "SMS Spam Detection Engine", category: "Projects", url: "work.html#spam-detector", desc: "High-precision NLP classifier (98.21% accuracy, 99.24% precision) over 5,572 messages" },
  { title: "Time-Series Anomaly Detection Suite", category: "Projects", url: "work.html#anomaly-detection", desc: "Statistical masking mitigation via Modified Z-Score (MAD) and KNN spatial outlier density" },
  { title: "Mall Customer Segmentation System", category: "Projects", url: "work.html#mall-segmentation", desc: "Unsupervised K-Means clustering, WCSS Elbow & Silhouette score validation" },
  { title: "Telco Customer Churn Prediction", category: "Projects", url: "https://github.com/HenokInTheStars/telco-customer-churn-prediction", desc: "Machine learning comparative classification for customer retention risk scoring" },
  { title: "KeywordSense Conversational Agent", category: "Projects", url: "https://github.com/HenokInTheStars/keywordsense-chatbot", desc: "Keyword-based intent matching with TextBlob sentiment analysis fallback loop" },

  // Lab Experiments
  { title: "Token Streaming Visualizer Sandbox", category: "Lab", url: "lab.html", desc: "Live SSE chunk latency and TTFT jitter inspector" },
  { title: "Token Cost Realtime Estimator", category: "Lab", url: "lab.html", desc: "Buffer chunk estimator for Sonnet 3.5, GPT-4o, and DeepSeek" },
  { title: "Markdown AST Diff Inspector", category: "Lab", url: "lab.html", desc: "Structural token tree diffing for LLM output drift" },
  { title: "SchemaCanvas for JSON Spec", category: "Lab", url: "lab.html", desc: "Tactile node canvas for recursive JSON schema validation" },

  // Writing
  { title: "Designing for Streaming UI Latency & Perceptual Speed", category: "Writing", url: "writing.html", desc: "Buffer smoothing, ocular saccade pacing, and TTFT optimization" },
  { title: "Reciprocal Rank Fusion in Regulated Search Environments", category: "Writing", url: "writing.html", desc: "Hybrid BM25 and vector embeddings in mission-critical applications" },
  { title: "Zero-Runtime CSS: Compiling Design Tokens via AST Transforms", category: "Writing", url: "writing.html", desc: "Sub-millisecond PostCSS transforms without runtime overhead" }
];

function initCommandPalette() {
  // Inject Palette HTML into DOM if not present
  if (!document.getElementById('command-palette-backdrop')) {
    const paletteHtml = `
      <div id="command-palette-backdrop" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm hidden flex items-start justify-center pt-20 px-4">
        <div id="command-palette-modal" class="w-full max-w-xl bg-surface-container-lowest border border-secondary-fixed rounded-xl shadow-2xl overflow-hidden flex flex-col scale-95 opacity-0 transition-all duration-150">
          <!-- Search Input Bar -->
          <div class="flex items-center px-4 py-3 border-b border-secondary-fixed gap-3 bg-surface-container-low">
            <span class="material-symbols-outlined text-primary text-[20px]">search</span>
            <input id="palette-search-input" type="text" placeholder="Search pages, projects, lab tools, or ask questions..." class="w-full bg-transparent border-none text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-on-surface-variant/60" autocomplete="off" />
            <span class="font-code text-label-sm text-on-surface-variant px-1.5 py-0.5 bg-surface-container rounded border border-secondary-fixed">ESC</span>
          </div>
          <!-- Results List -->
          <div id="palette-results" class="max-h-80 overflow-y-auto p-2 divide-y divide-secondary-fixed/40">
            <!-- Dynamic items will render here -->
          </div>
          <!-- Footer Navigation Bar -->
          <div class="px-4 py-2 bg-surface-container-low border-t border-secondary-fixed flex items-center justify-between font-code text-label-sm text-on-surface-variant">
            <div class="flex items-center gap-3">
              <span><kbd class="px-1 py-0.5 bg-surface-container rounded">↑</kbd> <kbd class="px-1 py-0.5 bg-surface-container rounded">↓</kbd> to navigate</span>
              <span><kbd class="px-1 py-0.5 bg-surface-container rounded">↵</kbd> to select</span>
            </div>
            <span class="text-primary font-medium">Technical Editorial // ⌘K</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', paletteHtml);
  }

  const backdrop = document.getElementById('command-palette-backdrop');
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('palette-search-input');
  const resultsContainer = document.getElementById('palette-results');
  let selectedIndex = 0;
  let currentFilteredItems = [];

  function openPalette() {
    backdrop.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('scale-95', 'opacity-0');
      modal.classList.add('scale-100', 'opacity-100');
      input.focus();
      renderResults(input.value);
    }, 10);
  }

  function closePalette() {
    modal.classList.remove('scale-100', 'opacity-100');
    modal.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      input.value = '';
    }, 150);
  }

  function renderResults(query = '') {
    const q = query.toLowerCase().trim();
    currentFilteredItems = SEARCH_INDEX.filter(item => {
      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q);
    });

    if (currentFilteredItems.length === 0) {
      // Suggest Ask AI answer if user asked a question
      resultsContainer.innerHTML = `
        <div class="p-4 text-center space-y-2">
          <p class="font-body-md text-on-surface-variant">No exact matches for "${escapeHtml(query)}"</p>
          <div class="p-3 bg-surface-container-low rounded-lg border border-secondary-fixed text-left font-body-md">
            <div class="flex items-center gap-2 text-primary font-code text-label-sm mb-1">
              <span class="material-symbols-outlined text-[16px]">smart_toy</span>
              <span>Ask Henok's AI Portfolio Assistant:</span>
            </div>
            <p class="text-sm text-on-surface">"Henok is an AI & Web Systems Engineer focusing on sub-400ms TTFT, low-latency streaming architectures, and deterministic evaluations across production platforms."</p>
            <a href="index.html#writing" onclick="closePalette()" class="inline-block mt-2 font-code text-label-sm text-primary hover:underline">Try interactive streaming query on Home →</a>
          </div>
        </div>
      `;
      return;
    }

    selectedIndex = Math.min(selectedIndex, currentFilteredItems.length - 1);
    selectedIndex = Math.max(0, selectedIndex);

    resultsContainer.innerHTML = currentFilteredItems.map((item, idx) => `
      <a href="${item.url}" class="palette-item flex items-start justify-between p-2.5 rounded-lg transition-colors cursor-pointer ${idx === selectedIndex ? 'bg-surface-container-high' : 'hover:bg-surface-container'}" data-index="${idx}">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2">
            <span class="font-headline-md text-body-md text-on-surface">${highlightMatch(item.title, q)}</span>
            <span class="font-code text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">${item.category}</span>
          </div>
          <span class="font-body-md text-xs text-on-surface-variant">${highlightMatch(item.desc, q)}</span>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant text-[16px] mt-1">arrow_outward</span>
      </a>
    `).join('');

    // Attach click listeners
    resultsContainer.querySelectorAll('.palette-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        selectedIndex = parseInt(el.getAttribute('data-index'));
        updateItemSelection();
      });
      el.addEventListener('click', () => {
        closePalette();
      });
    });
  }

  function updateItemSelection() {
    const items = resultsContainer.querySelectorAll('.palette-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('bg-surface-container-high');
        item.classList.remove('hover:bg-surface-container');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-surface-container-high');
      }
    });
  }

  // Keyboard Navigation & Shortcuts
  document.addEventListener('keydown', (e) => {
    // ⌘K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('hidden')) {
        openPalette();
      } else {
        closePalette();
      }
    }
    // Escape
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      e.preventDefault();
      closePalette();
    }
    // Up / Down / Enter when palette is open
    if (!backdrop.classList.contains('hidden')) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % currentFilteredItems.length;
        updateItemSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + currentFilteredItems.length) % currentFilteredItems.length;
        updateItemSelection();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFilteredItems[selectedIndex]) {
          window.location.href = currentFilteredItems[selectedIndex].url;
          closePalette();
        }
      }
    }
  });

  input.addEventListener('input', (e) => {
    selectedIndex = 0;
    renderResults(e.target.value);
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });

  // Attach open buttons from navbar
  const searchButtons = document.querySelectorAll('button[aria-label="Ask AI search"], button[aria-label="Search or ask assistant"], button:has(.material-symbols-outlined:contains("search")), [data-action="open-search"]');
  searchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });
}

/* ==========================================================================
   3. Active Navigation Detection
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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapeHtml(text).replace(regex, '<span class="text-primary font-semibold">$1</span>');
}
