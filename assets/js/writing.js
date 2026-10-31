/**
 * Technical Editorial - Writing Interactions
 * Essay search filtering, tag chips, active reader switcher, and code snippet copy
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('essay-search');
  const searchCount = document.getElementById('search-count');
  const tagChips = document.querySelectorAll('.tag-chip');
  const essayCards = document.querySelectorAll('.essay-card');
  const copyBtn = document.getElementById('copy-code-btn');

  let currentTag = 'all';
  let currentQuery = '';

  // Essay content data for interactive reader switching
  const ARTICLES_DATA = {
    "designing for streaming ui latency and perceptual speed": {
      id: "041",
      date: "2025.02.14",
      readTime: "6 min read",
      title: "Designing for Streaming UI Latency and Perceptual Speed",
      subtitle: "Why time-to-first-token is only half the battle. Re-architecting modern async canvas feeds with micro-task scheduling and client predictive buffers.",
      tags: ["#latency", "#frontend", "#ai-engineering"],
      section1Title: "1. The Ingestion Problem",
      section1P1: "When generative models dispatch tokens via Server-Sent Events (SSE) or WebSockets, they output text in bursts. Traditional frontends render chunks naively as they arrive via <code>ReadableStreamDefaultReader</code>. This naive paradigm induces extreme layout thrashing, rapid reflow cycles, and visual vibration that destabilizes user reading focus.",
      section1P2: "The human ocular saccade system requires roughly <span class=\"font-semibold text-primary\">200ms to 250ms</span> of visual fixity to process continuous prose. When delta streams output tokens erratically at 12ms to 80ms intervals, the UI operates in direct opposition to human reading ergonomics.",
      code: `export class StreamPacer {\n  private queue: string[] = [];\n  private isFlushing = false;\n\n  enqueue(chunk: string) {\n    this.queue.push(chunk);\n    if (!this.isFlushing) this.scheduleFlush();\n  }\n\n  private scheduleFlush() {\n    this.isFlushing = true;\n    requestAnimationFrame(() => {\n      this.renderChunkBatch();\n      this.isFlushing = false;\n    });\n  }\n}`
    },
    "deterministic generation in stochastic runtimes": {
      id: "040",
      date: "2025.01.28",
      readTime: "11 min read",
      title: "Deterministic Generation in Stochastic Runtimes",
      subtitle: "Schema pinning, JSON-Grammar validation engines, and constructing high-velocity multi-agent pipelines without defensive hallucinations.",
      tags: ["#ai-engineering", "#frontend"],
      section1Title: "1. The Stochastic Boundary",
      section1P1: "Large language models operate probabilistically, yet user-facing applications require deterministic guarantees. When tool-calling returns unpredictable key casings or missing required properties, client-side hydration breaks silently.",
      section1P2: "By placing a strict Zod-compiled CFG (Context-Free Grammar) state machine directly at the model stream egress, we reject non-conforming tokens before they can pollute the client graph state.",
      code: `export const TelemetrySchema = z.object({\n  traceId: z.string().uuid(),\n  durationMs: z.number().nonnegative(),\n  status: z.enum(['ok', 'error']),\n  spans: z.array(z.string())\n});\n\nexport type TelemetryPayload = z.infer<typeof TelemetrySchema>;`
    },
    "zero-runtime tokens: the death of css-in-js": {
      id: "039",
      date: "2024.11.19",
      readTime: "8 min read",
      title: "Zero-Runtime Tokens: The Death of Dynamic CSS-in-JS",
      subtitle: "Profiling main-thread styling stalls in high-frequency dashboards. How static compilation and design-system primitives recover 40ms per interaction.",
      tags: ["#design-systems", "#frontend"],
      section1Title: "1. The Runtime Tax",
      section1P1: "Dynamic CSS-in-JS libraries serialize style strings, hash AST signatures, and inject new stylesheet rules into document `<head>` on every render cycle. In high-frequency telemetry monitors updating 60 times a second, this runtime tax consumes 30% of each frame's budget.",
      section1P2: "Compiling W3C Design Token JSON directly to static CSS custom properties during the Vite/PostCSS build phase eliminates JavaScript style overhead entirely while maintaining live runtime themability.",
      code: `:root {\n  --color-primary: #005c55;\n  --color-surface: #fcf9f8;\n}\n\nhtml.dark {\n  --color-primary: #2dd4bf;\n  --color-surface: #17181b;\n}`
    },
    "the 16ms illusion: frame pacing in hyper-responsive workflows": {
      id: "038",
      date: "2024.09.04",
      readTime: "5 min read",
      title: "The 16ms Illusion: Frame Pacing in Hyper-Responsive Workflows",
      subtitle: "Why meeting a 60fps budget fails user expectations when delta spikes desync touch events. A field guide to requestVideoFrameCallback and compositor hacks.",
      tags: ["#latency", "#design-systems"],
      section1Title: "1. Frame Delta Inconsistency",
      section1P1: "A steady average of 60 frames per second can still feel jerky if frame intervals fluctuate erratically between 8ms and 32ms. This frame jitter destroys the illusion of continuous physical momentum in canvas manipulation.",
      section1P2: "By tying stream renders to the browser's vsync refresh using dedicated AudioWorklet clock pulses, we achieve lockstep visual cadence across diverse hardware refresh rates.",
      code: `function scheduleVsyncTick(callback: (timestamp: number) => void) {\n  let lastTime = performance.now();\n  function loop(time: number) {\n    const delta = time - lastTime;\n    if (delta >= 16.6) {\n      callback(time);\n      lastTime = time;\n    }\n    requestAnimationFrame(loop);\n  }\n  requestAnimationFrame(loop);\n}`
    }
  };

  function filterEssays() {
    let visibleCount = 0;
    essayCards.forEach(card => {
      const title = card.getAttribute('data-title') || '';
      const tags = (card.getAttribute('data-tags') || '').split(',');

      const matchesQuery = title.toLowerCase().includes(currentQuery.toLowerCase());
      const matchesTag = (currentTag === 'all') || tags.includes(currentTag);

      if (matchesQuery && matchesTag) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    if (searchCount) {
      searchCount.textContent = `${visibleCount} shown`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim();
      filterEssays();
    });
  }

  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tagChips.forEach(c => {
        c.classList.remove('bg-primary', 'text-on-primary');
        c.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      chip.classList.add('bg-primary', 'text-on-primary');
      chip.classList.remove('bg-surface-container', 'text-on-surface-variant');

      currentTag = chip.getAttribute('data-tag');
      filterEssays();
    });
  });

  // Interactive Reader Card Selection
  essayCards.forEach(card => {
    card.addEventListener('click', () => {
      const titleKey = card.getAttribute('data-title');
      const article = ARTICLES_DATA[titleKey];

      // Update active indicator on cards
      essayCards.forEach(c => {
        c.classList.remove('bg-surface-container-lowest', 'shadow-md');
        c.classList.add('bg-surface-container-low');
        const activeBar = c.querySelector('.active-indicator-bar');
        if (activeBar) activeBar.remove();
      });

      card.classList.remove('bg-surface-container-low');
      card.classList.add('bg-surface-container-lowest', 'shadow-md');
      card.insertAdjacentHTML('beforeend', '<div class="active-indicator-bar absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r bg-primary"></div>');

      if (article) {
        // Update Reader elements
        const readerTitle = document.getElementById('reader-article-title');
        const readerDate = document.getElementById('reader-article-date');
        const readerTime = document.getElementById('reader-article-time');
        const readerId = document.getElementById('reader-article-id');
        const readerSnippet = document.getElementById('reader-article-snippet');
        const readerSec1Title = document.getElementById('reader-sec1-title');
        const readerSec1P1 = document.getElementById('reader-sec1-p1');
        const readerSec1P2 = document.getElementById('reader-sec1-p2');
        const readerCode = document.getElementById('reader-code-content');

        if (readerTitle) readerTitle.textContent = article.title;
        if (readerDate) readerDate.textContent = article.date;
        if (readerTime) readerTime.textContent = article.readTime;
        if (readerId) readerId.textContent = article.id;
        if (readerSnippet) readerSnippet.textContent = article.subtitle;
        if (readerSec1Title) readerSec1Title.textContent = article.section1Title;
        if (readerSec1P1) readerSec1P1.innerHTML = article.section1P1;
        if (readerSec1P2) readerSec1P2.innerHTML = article.section1P2;
        if (readerCode) readerCode.textContent = article.code;

        // On mobile, smooth scroll to the reader
        if (window.innerWidth < 1024) {
          const readerContainer = document.getElementById('active-reader-container');
          if (readerContainer) {
            readerContainer.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Code copy button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeElement = document.getElementById('reader-code-content');
      const textToCopy = codeElement ? codeElement.textContent : '';
      navigator.clipboard.writeText(textToCopy).then(() => {
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span><span>Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = original;
        }, 2000);
      });
    });
  }
});
