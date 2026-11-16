/**
 * Technical Editorial - Writing Interactions
 * Essay search filtering, tag chips, active reader switcher, code snippet copy,
 * deep-linking URL hash synchronization, and newsletter subscription
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('essay-search');
  const searchCount = document.getElementById('search-count');
  const tagChips = document.querySelectorAll('.tag-chip');
  const essayCards = document.querySelectorAll('.essay-card');
  const copyBtn = document.getElementById('copy-code-btn');
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');

  let currentTag = 'all';
  let currentQuery = '';

  // Comprehensive essay data dictionary for dynamic master-detail reader
  const RAW_ARTICLES = [
    {
      slug: "streaming-latency",
      titleKey: "designing for streaming ui latency and perceptual speed",
      id: "041",
      date: "PUBLISHED FEB 14, 2026",
      readTime: "6 min read",
      title: "Designing for Streaming UI Latency and Perceptual Speed",
      subtitle: "Why time-to-first-token is only half the battle. Re-architecting modern async canvas feeds with micro-task scheduling and client predictive buffers.",
      tags: ["#latency", "#frontend", "#ai-engineering"],
      toc: [
        { title: "1. The Ingestion Problem", anchor: "#the-stream-problem" },
        { title: "2. The Micro-Task Pacing Scheduler", anchor: "#code-implementation" },
        { title: "3. Content Shift & Layout Stability", anchor: "#layout-stability" }
      ],
      budgetLabel: "120ms TARGET",
      budgetWidth: "82%",
      sec1Title: "1. The Ingestion Problem",
      sec1P1: "When generative models dispatch tokens via Server-Sent Events (SSE) or WebSockets, they output text in bursts. Traditional frontends render chunks naively as they arrive via <code>ReadableStreamDefaultReader</code>. This naive paradigm induces extreme layout thrashing, rapid reflow cycles, and visual vibration that destabilizes user reading focus.",
      sec1P2: "The human ocular saccade system requires roughly <span class=\"font-semibold text-primary\">200ms to 250ms</span> of visual fixity to process continuous prose. When delta streams output tokens erratically at 12ms to 80ms intervals, the UI operates in direct opposition to human reading ergonomics.",
      diagramTitle: "Fig 1. Stream Pacing vs. Human Ocular Saccade",
      diagramBadge: "SVG Pipeline Model",
      diagramSvg: `<svg class="w-full h-auto max-w-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 540 110">
        <path d="M 20 55 L 520 55" opacity="0.3" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.5"></path>
        <circle class="fill-surface-container-high stroke-primary" cx="60" cy="55" r="14" stroke-width="2"></circle>
        <text class="fill-on-surface font-mono" font-size="9" stroke="none" text-anchor="middle" x="60" y="58">SSE</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="60" y="85">Burst (10-40ms)</text>
        <path d="M 80 55 L 160 55" stroke="currentColor" stroke-width="1.5"></path>
        <rect class="fill-surface-container-highest stroke-primary" height="40" rx="6" stroke-width="1.5" width="130" x="170" y="35"></rect>
        <text class="fill-on-surface font-mono" font-size="9" stroke="none" text-anchor="middle" x="235" y="53">Pacing Scheduler</text>
        <text class="fill-primary font-mono" font-size="8" stroke="none" text-anchor="middle" x="235" y="66">Smoothing window</text>
        <path d="M 305 55 L 385 55" stroke="currentColor" stroke-width="1.5"></path>
        <circle class="fill-primary stroke-none" cx="430" cy="55" r="18"></circle>
        <text class="fill-on-primary font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="430" y="58">DOM</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="430" y="90">Cadenced Saccade</text>
      </svg>`,
      diagramCaption: "Buffer smoothing absorbs upstream model bursts, yielding an uninterrupted reading trajectory.",
      calloutIcon: "info",
      calloutTitle: "Note: Perceptual Physics",
      calloutText: "Perceived latency matters more than total response duration. An interface that delivers immediate visual structure and cadenced text delivery feels 3× faster than an identical execution arriving in one massive dump after a 1.2s blank delay.",
      sec2Title: "2. The Micro-Task Pacing Scheduler",
      sec2Desc: "To decouple network socket arrival times from DOM reconciliation, we install a high-frequency dequeue worker using <code>requestAnimationFrame</code> linked to dynamic token spring curves:",
      codeFilename: "streamScheduler.ts",
      code: `export class StreamPacer {
  private queue: string[] = [];
  private isRunning: boolean = false;

  constructor(private targetHz = 60) {}

  public push(token: string): void {
    this.queue.push(token);
    if (!this.isRunning) this.drain();
  }

  private drain(): void {
    if (this.queue.length === 0) {
      this.isRunning = false;
      return;
    }
    this.isRunning = true;
    const batch = this.queue.splice(0, Math.min(3, this.queue.length));
    this.commitToDom(batch.join(""));
    
    // Synchronize directly with display refresh pipeline
    requestAnimationFrame(() => this.drain());
  }
}`,
      sec3Title: "3. Content Shift & Cumulative Layout Drift",
      sec3P1: "Streaming responses continuously push scroll containers down. If an interface renders code snippets or data-tables midway through streaming, syntax tokenization updates can trigger sudden 120px height collapses.",
      sec3P2: "By employing CSS <code>contain-intrinsic-size</code> alongside predictive scroll anchors, we maintain strict viewport coordinates regardless of upstream mutation volume.",
      footnotes: [
        `Card, S. K., Moran, T. P., &amp; Newell, A. (1983). <span class="italic">The Psychology of Human-Computer Interaction</span>. L. Erlbaum Associates.`,
        `W3C CSS Box Sizing Module Level 4: <code>contain-intrinsic-size</code> implementation draft specification.`
      ]
    },
    {
      slug: "deterministic-runtime",
      titleKey: "deterministic generation in stochastic runtimes",
      id: "040",
      date: "PUBLISHED JAN 28, 2026",
      readTime: "11 min read",
      title: "Deterministic Generation in Stochastic Runtimes",
      subtitle: "Schema pinning, JSON-Grammar validation engines, and constructing high-velocity multi-agent pipelines without defensive hallucinations.",
      tags: ["#ai-engineering", "#frontend"],
      toc: [
        { title: "1. The Stochastic Boundary", anchor: "#the-stream-problem" },
        { title: "2. Grammar-Constrained Schema Interceptor", anchor: "#code-implementation" },
        { title: "3. State Invariance & Multi-Agent Contracts", anchor: "#layout-stability" }
      ],
      budgetLabel: "0.00% SCHEMA DRIFT",
      budgetWidth: "100%",
      sec1Title: "1. The Stochastic Boundary",
      sec1P1: "Large language models operate probabilistically, yet production user interfaces require absolute deterministic structural guarantees. When an autonomous multi-agent tool pipeline returns malformed JSON, mismatched enum casings, or unexpected null fields, client-side React hydration fails catastrophically.",
      sec1P2: "Traditional error handling relies on reactive try/catch blocks and expensive round-trip model retries. In high-throughput systems handling hundreds of concurrent tool executions, reactive retries explode latency budgets and balloon token costs.",
      diagramTitle: "Fig 2. Token Grammar DFA Constrained Decoding",
      diagramBadge: "Automata Pipeline",
      diagramSvg: `<svg class="w-full h-auto max-w-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 540 110">
        <path d="M 20 55 L 520 55" opacity="0.3" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.5"></path>
        <rect class="fill-surface-container-high stroke-primary" height="38" rx="6" stroke-width="1.5" width="90" x="20" y="36"></rect>
        <text class="fill-on-surface font-mono" font-size="9" stroke="none" text-anchor="middle" x="65" y="54">LLM Output</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="65" y="66">Logits Stream</text>
        <path d="M 110 55 L 170 55" stroke="currentColor" stroke-width="1.5"></path>
        <rect class="fill-surface-container-highest stroke-primary" height="42" rx="6" stroke-width="1.5" width="130" x="175" y="34"></rect>
        <text class="fill-on-surface font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="240" y="53">CFG Grammar DFA</text>
        <text class="fill-primary font-mono" font-size="8" stroke="none" text-anchor="middle" x="240" y="66">Token Bitmask Filter</text>
        <path d="M 305 55 L 365 55" stroke="currentColor" stroke-width="1.5"></path>
        <circle class="fill-primary stroke-none" cx="430" cy="55" r="20"></circle>
        <text class="fill-on-primary font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="430" y="54">Zod Type</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="430" y="90">100% Invariant</text>
      </svg>`,
      diagramCaption: "A pushdown automaton intercepts raw logits prior to sampling, pruning invalid grammar branches at zero runtime latency penalty.",
      calloutIcon: "schema",
      calloutTitle: "Note: The Fallacy of Defensive Parsing",
      calloutText: "Post-hoc JSON schema validation is defensive debt. By embedding Context-Free Grammar constraints directly into model sampling bitmasks, invalid keys are mathematically impossible to generate, eliminating runtime fallback forks.",
      sec2Title: "2. Grammar-Constrained Schema Interceptor",
      sec2Desc: "By pinning runtime tool schemas to strictly typed Zod descriptors, we derive both runtime pushdown automata and static TypeScript bindings from a single source of truth:",
      codeFilename: "schemaInterceptor.ts",
      code: `import { z } from 'zod';

export const AgentTelemetrySchema = z.object({
  traceId: z.string().uuid(),
  model: z.enum(['claude-3-5-sonnet', 'gpt-4o', 'gemini-1.5-pro']),
  latencyMs: z.number().int().positive(),
  stateDelta: z.record(z.string(), z.unknown()),
  verdict: z.enum(['commit', 'retry', 'abort'])
});

export type AgentTelemetry = z.infer<typeof AgentTelemetrySchema>;

export function validateStreamEgress(raw: string): AgentTelemetry {
  return AgentTelemetrySchema.parse(JSON.parse(raw));
}`,
      sec3Title: "3. State Invariance & Multi-Agent Contracts",
      sec3P1: "When distributed agent swarms coordinate across message queues, contract drift produces cascading micro-deadlocks. Enforcing semantic schema pinning at network boundaries allows services to evolve independently without coordinated lockstep redeployments.",
      sec3P2: "Client UI components can safely subscribe to incoming state updates using optimistic React 19 transitions, confident that UI render trees will never encounter undefined property access errors.",
      footnotes: [
        `Aho, A. V., Lam, M. S., Sethi, R., &amp; Ullman, J. D. (2006). <span class="italic">Compilers: Principles, Techniques, and Tools</span>. Addison-Wesley.`,
        `IETF RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format.`
      ]
    },
    {
      slug: "zero-runtime-tokens",
      titleKey: "zero-runtime tokens: the death of css-in-js",
      id: "039",
      date: "PUBLISHED NOV 19, 2025",
      readTime: "8 min read",
      title: "Zero-Runtime Tokens: The Death of Dynamic CSS-in-JS",
      subtitle: "Profiling main-thread styling stalls in high-frequency dashboards. How static compilation and design-system primitives recover 40ms per interaction.",
      tags: ["#design-systems", "#frontend"],
      toc: [
        { title: "1. The Runtime Tax", anchor: "#the-stream-problem" },
        { title: "2. Automated Token Compilation Pipeline", anchor: "#code-implementation" },
        { title: "3. Frame Recovery & Layout Thrashing", anchor: "#layout-stability" }
      ],
      budgetLabel: "0ms JS RUNTIME TAX",
      budgetWidth: "95%",
      sec1Title: "1. The Runtime Tax",
      sec1P1: "Dynamic CSS-in-JS libraries revolutionized component styling by co-locating styles with markup. However, under the hood, libraries like Emotion and styled-components parse style template strings, calculate cryptographic hashes, and dynamically inject <code>&lt;style&gt;</code> elements into the DOM on every state mutation.",
      sec1P2: "In high-frequency real-time dashboards updating 60 times a second, this runtime calculation causes massive style recalculation pauses. The browser main thread is held hostage by CSS string parsing rather than executing critical application logic.",
      diagramTitle: "Fig 3. Dynamic Injection vs. Static Variable Compilation",
      diagramBadge: "Execution Trace",
      diagramSvg: `<svg class="w-full h-auto max-w-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 540 110">
        <path d="M 20 55 L 520 55" opacity="0.3" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.5"></path>
        <rect class="fill-surface-container-high stroke-primary" height="38" rx="6" stroke-width="1.5" width="100" x="20" y="36"></rect>
        <text class="fill-on-surface font-mono" font-size="9" stroke="none" text-anchor="middle" x="70" y="52">W3C Tokens</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="70" y="65">JSON Schema</text>
        <path d="M 120 55 L 180 55" stroke="currentColor" stroke-width="1.5"></path>
        <rect class="fill-surface-container-highest stroke-primary" height="42" rx="6" stroke-width="1.5" width="125" x="185" y="34"></rect>
        <text class="fill-on-surface font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="247" y="52">Vite Compiler</text>
        <text class="fill-primary font-mono" font-size="8" stroke="none" text-anchor="middle" x="247" y="65">Zero-JS Output</text>
        <path d="M 310 55 L 370 55" stroke="currentColor" stroke-width="1.5"></path>
        <circle class="fill-primary stroke-none" cx="430" cy="55" r="20"></circle>
        <text class="fill-on-primary font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="430" y="54">:root CSS</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="430" y="90">0ms Overhead</text>
      </svg>`,
      diagramCaption: "Compiling token dictionaries directly to CSS custom properties at build time shifts all styling calculations to the browser's native C++ layout engine.",
      calloutIcon: "bolt",
      calloutTitle: "Note: Main-Thread Contention",
      calloutText: "Every millisecond spent computing dynamic CSS hashes is a millisecond stolen from 60fps touch tracking. CSS Custom Properties provide live runtime adaptability with zero JavaScript overhead.",
      sec2Title: "2. Automated Token Compilation Pipeline",
      sec2Desc: "By compiling design tokens directly to static CSS variables, dark mode switching and custom palette overrides are handled entirely via native cascade recalculations without JS execution:",
      codeFilename: "tokens.config.ts",
      code: `export const DesignTokens = {
  color: {
    primary: { light: '#005c55', dark: '#2dd4bf' },
    surface: { light: '#fcf9f8', dark: '#0e0f11' },
    accent: { light: '#f97316', dark: '#fb923c' }
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px'
  }
} as const;

// Emits pure static CSS variables at build time
export const cssCustomProperties = compileToCssVars(DesignTokens);`,
      sec3Title: "3. Frame Recovery & Layout Thrashing Benchmarks",
      sec3P1: "Migrating our internal telemetry canvas from dynamic CSS-in-JS to static design token variables slashed median script duration during data bursts from 48ms down to 1.8ms per batch.",
      sec3P2: "The result is buttery smooth, jank-free 120Hz interactions on ProMotion displays, eliminating battery drain on portable client devices.",
      footnotes: [
        `W3C Design Tokens Community Group: <span class="italic">Design Tokens Format Module Specification</span> (2024).`,
        `Google Chrome Developers: <span class="italic">Avoid Large, Complex Layouts and Layout Thrashing</span>.`
      ]
    },
    {
      slug: "16ms-illusion",
      titleKey: "the 16ms illusion: frame pacing in hyper-responsive workflows",
      id: "038",
      date: "PUBLISHED SEP 04, 2025",
      readTime: "5 min read",
      title: "The 16ms Illusion: Frame Pacing in Hyper-Responsive Workflows",
      subtitle: "Why meeting a 60fps budget fails user expectations when delta spikes desync touch events. A field guide to requestVideoFrameCallback and compositor hacks.",
      tags: ["#latency", "#design-systems"],
      toc: [
        { title: "1. Frame Delta Inconsistency", anchor: "#the-stream-problem" },
        { title: "2. Lockstep VSync Scheduler", anchor: "#code-implementation" },
        { title: "3. Offscreen Canvas & Web Worker Decoupling", anchor: "#layout-stability" }
      ],
      budgetLabel: "<2ms DELTA VARIANCE",
      budgetWidth: "90%",
      sec1Title: "1. Frame Delta Inconsistency",
      sec1P1: "Engineers often assume that averaging 60 frames per second guarantees a responsive interface. However, an application can log exactly 60 frames in one second while producing a jarring, jittery visual experience if individual frame intervals fluctuate between 6ms and 36ms.",
      sec1P2: "The human sensorimotor loop detects minute phase shifts between physical finger dragging and onscreen pixel movement. Delta spikes above 16.6ms cause visible dragging hysteresis, breaking the psychological illusion of direct manipulation.",
      diagramTitle: "Fig 4. Frame Delta Jitter vs. Lockstep Compositor Pacing",
      diagramBadge: "Compositor VSync",
      diagramSvg: `<svg class="w-full h-auto max-w-lg text-primary" fill="none" stroke="currentColor" viewBox="0 0 540 110">
        <path d="M 20 55 L 520 55" opacity="0.3" stroke="currentColor" stroke-dasharray="3 3" stroke-width="1.5"></path>
        <rect class="fill-surface-container-high stroke-primary" height="38" rx="6" stroke-width="1.5" width="100" x="20" y="36"></rect>
        <text class="fill-on-surface font-mono" font-size="9" stroke="none" text-anchor="middle" x="70" y="52">Touch Event</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="70" y="65">Jittery Input</text>
        <path d="M 120 55 L 180 55" stroke="currentColor" stroke-width="1.5"></path>
        <rect class="fill-surface-container-highest stroke-primary" height="42" rx="6" stroke-width="1.5" width="125" x="185" y="34"></rect>
        <text class="fill-on-surface font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="247" y="52">VSync Aligner</text>
        <text class="fill-primary font-mono" font-size="8" stroke="none" text-anchor="middle" x="247" y="65">Lockstep Pulses</text>
        <path d="M 310 55 L 370 55" stroke="currentColor" stroke-width="1.5"></path>
        <circle class="fill-primary stroke-none" cx="430" cy="55" r="20"></circle>
        <text class="fill-on-primary font-mono font-bold" font-size="9" stroke="none" text-anchor="middle" x="430" y="54">GPU Frame</text>
        <text class="fill-on-surface-variant font-mono" font-size="8" stroke="none" text-anchor="middle" x="430" y="90">Sub-1ms Delta</text>
      </svg>`,
      diagramCaption: "Aligning input sampling directly with the GPU compositor vsync cycle eliminates dragging hysteresis and phase drift.",
      calloutIcon: "speed",
      calloutTitle: "Note: Direct Manipulation Perception",
      calloutText: "When rendering interactive drag surfaces, a dropped frame is instantly perceived as friction or physical resistance. Cadenced frame pacing preserves the user's perception of zero-gravity tactile control.",
      sec2Title: "2. Lockstep VSync Scheduler Implementation",
      sec2Desc: "By synchronizing drawing cycles with the hardware rasterization pulse, we decouple CPU computational tasks from presentation layers:",
      codeFilename: "vsyncScheduler.ts",
      code: `export class VSyncFramePacer {
  private targetDelta = 1000 / 60;
  private lastTick = performance.now();

  public schedule(callback: (delta: number) => void): void {
    requestAnimationFrame((now) => {
      const delta = now - this.lastTick;
      if (delta >= this.targetDelta - 1.5) {
        callback(delta);
        this.lastTick = now;
      }
      this.schedule(callback);
    });
  }
}`,
      sec3Title: "3. Offscreen Canvas & Web Worker Decoupling",
      sec3P1: "Heavy layout computations, vector calculations, and spatial transforms should never execute on the main thread during gesture events. Transferring rendering contexts to an <code>OffscreenCanvas</code> inside a dedicated Web Worker isolates compositor updates from garbage collection pauses.",
      sec3P2: "This architectural pattern ensures that even if background network tasks trigger sudden CPU spikes, interactive animations and viewport gestures remain locked to the native hardware refresh rate.",
      footnotes: [
        `Apple Developer: <span class="italic">Designing for Direct Manipulation and Low-Latency Interaction</span>.`,
        `W3C HTML Living Standard: <span class="italic">The event loop and rendering processing model</span>.`
      ]
    }
  ];

  // Map entries by both slug and normalized title for fast polymorphic lookup
  const ARTICLES_DATA = {};
  RAW_ARTICLES.forEach(art => {
    ARTICLES_DATA[art.slug] = art;
    ARTICLES_DATA[art.titleKey] = art;
    ARTICLES_DATA[art.title.toLowerCase()] = art;
  });

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

  // Active essay state synchronizer
  function selectEssay(identifier, updateHash = true, scrollOnMobile = false) {
    if (!identifier) return;
    const lookupKey = identifier.toLowerCase().trim();
    const article = ARTICLES_DATA[lookupKey];
    if (!article) return;

    // 1. Update Card Highlighting
    essayCards.forEach(c => {
      const cardSlug = c.getAttribute('data-slug');
      const cardTitle = (c.getAttribute('data-title') || '').toLowerCase();
      const isMatch = (cardSlug === article.slug) || (cardTitle === article.titleKey);

      c.classList.toggle('bg-surface-container-lowest', isMatch);
      c.classList.toggle('shadow-md', isMatch);
      c.classList.toggle('bg-surface-container-low', !isMatch);

      const activeBar = c.querySelector('.active-indicator-bar');
      if (isMatch && !activeBar) {
        c.insertAdjacentHTML('beforeend', '<div class="active-indicator-bar absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r bg-primary"></div>');
      } else if (!isMatch && activeBar) {
        activeBar.remove();
      }
    });

    // 2. Reader Sub-Header & Metadata
    const readerTitle = document.getElementById('reader-article-title');
    const readerDate = document.getElementById('reader-article-date');
    const readerTime = document.getElementById('reader-article-time');
    const readerId = document.getElementById('reader-article-id');
    const readerSnippet = document.getElementById('reader-article-snippet');

    if (readerTitle) readerTitle.textContent = article.title;
    if (readerDate) readerDate.textContent = article.date;
    if (readerTime) readerTime.textContent = article.readTime;
    if (readerId) readerId.textContent = article.id;
    if (readerSnippet) readerSnippet.textContent = article.subtitle;

    // 3. Dynamic Table of Contents & Budget Gauge
    const readerTocNav = document.getElementById('reader-toc-nav');
    if (readerTocNav && Array.isArray(article.toc)) {
      readerTocNav.innerHTML = article.toc.map((item, idx) => `
        <a class="${idx === 0 ? 'text-primary font-medium hover:underline' : 'text-on-surface-variant hover:text-on-surface'}" href="${item.anchor}">${item.title}</a>
      `).join('');
    }

    const readerBudgetLabel = document.getElementById('reader-budget-label');
    const readerBudgetBar = document.getElementById('reader-budget-bar');
    if (readerBudgetLabel) readerBudgetLabel.textContent = article.budgetLabel;
    if (readerBudgetBar) readerBudgetBar.style.width = article.budgetWidth;

    // 4. Section 1 Content
    const readerSec1Title = document.getElementById('reader-sec1-title');
    const readerSec1P1 = document.getElementById('reader-sec1-p1');
    const readerSec1P2 = document.getElementById('reader-sec1-p2');
    if (readerSec1Title) readerSec1Title.textContent = article.sec1Title;
    if (readerSec1P1) readerSec1P1.innerHTML = article.sec1P1;
    if (readerSec1P2) readerSec1P2.innerHTML = article.sec1P2;

    // 5. Tailored Architectural Diagram
    const readerDiagTitle = document.getElementById('reader-diagram-title');
    const readerDiagBadge = document.getElementById('reader-diagram-badge');
    const readerDiagSvg = document.getElementById('reader-diagram-svg');
    const readerDiagCaption = document.getElementById('reader-diagram-caption');
    if (readerDiagTitle) readerDiagTitle.textContent = article.diagramTitle;
    if (readerDiagBadge) readerDiagBadge.textContent = article.diagramBadge;
    if (readerDiagSvg) readerDiagSvg.innerHTML = article.diagramSvg;
    if (readerDiagCaption) readerDiagCaption.textContent = article.diagramCaption;

    // 6. Section Callout
    const readerCalloutIcon = document.getElementById('reader-callout-icon');
    const readerCalloutTitle = document.getElementById('reader-callout-title');
    const readerCalloutText = document.getElementById('reader-callout-text');
    if (readerCalloutIcon) readerCalloutIcon.textContent = article.calloutIcon || 'info';
    if (readerCalloutTitle) readerCalloutTitle.textContent = article.calloutTitle;
    if (readerCalloutText) readerCalloutText.textContent = article.calloutText;

    // 7. Section 2 Code Implementation
    const readerSec2Title = document.getElementById('reader-sec2-title');
    const readerSec2Desc = document.getElementById('reader-sec2-desc');
    const readerCodeFilename = document.getElementById('reader-code-filename');
    const readerCode = document.getElementById('reader-code-content');
    if (readerSec2Title) readerSec2Title.textContent = article.sec2Title;
    if (readerSec2Desc) readerSec2Desc.innerHTML = article.sec2Desc;
    if (readerCodeFilename) readerCodeFilename.textContent = article.codeFilename;
    if (readerCode) readerCode.textContent = article.code;

    // 8. Section 3 Stability & Verification
    const readerSec3Title = document.getElementById('reader-sec3-title');
    const readerSec3P1 = document.getElementById('reader-sec3-p1');
    const readerSec3P2 = document.getElementById('reader-sec3-p2');
    if (readerSec3Title) readerSec3Title.textContent = article.sec3Title;
    if (readerSec3P1) readerSec3P1.innerHTML = article.sec3P1;
    if (readerSec3P2) readerSec3P2.innerHTML = article.sec3P2;

    // 9. Footnotes & Citations
    const readerFootnotesList = document.getElementById('reader-footnotes-list');
    if (readerFootnotesList && Array.isArray(article.footnotes)) {
      readerFootnotesList.innerHTML = article.footnotes.map((fn, idx) => `
        <li id="footnote-${idx + 1}">${fn}</li>
      `).join('');
    }

    // 10. URL Hash Sync (without jumping viewport)
    if (updateHash && window.location.hash !== `#${article.slug}`) {
      history.replaceState(null, '', `#${article.slug}`);
    }

    // 11. Smooth scroll to reader when triggered
    if (scrollOnMobile) {
      const readerContainer = document.getElementById('active-reader-container');
      if (readerContainer) {
        readerContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Card click triggers
  essayCards.forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.getAttribute('data-slug') || card.getAttribute('data-title');
      if (slug) {
        selectEssay(slug, true, window.innerWidth < 1024);
      }
    });
  });

  // URL Hash Deep-Linking on load and on back/forward
  function resolveInitialHash() {
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim().toLowerCase();
    if (rawHash && ARTICLES_DATA[rawHash]) {
      selectEssay(rawHash, false, true);
    } else {
      selectEssay('streaming-latency', false, false);
    }
  }

  window.addEventListener('hashchange', () => {
    const rawHash = (window.location.hash || '').replace(/^#/, '').trim().toLowerCase();
    if (rawHash && ARTICLES_DATA[rawHash]) {
      selectEssay(rawHash, false, true);
    }
  });

  // Initialize active essay
  resolveInitialHash();

  // Code copy button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeElement = document.getElementById('reader-code-content');
      const textToCopy = codeElement ? codeElement.textContent : '';
      navigator.clipboard.writeText(textToCopy).then(() => {
        const original = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-symbols-outlined text-[14px]" aria-hidden="true">check</span><span>Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = original;
        }, 2000);
      });
    });
  }

  // Newsletter dispatch subscription
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email) return;

      if (newsletterStatus) {
        newsletterStatus.classList.remove('hidden');
        newsletterStatus.textContent = `✓ Subscribed. Technical dispatches will arrive at ${email}.`;
      }
      if (emailInput) emailInput.value = '';
    });
  }
});
