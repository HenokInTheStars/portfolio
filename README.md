# Henok — Full-Stack Web &amp; AI Systems Engineer Portfolio

A high-performance personal portfolio built with the **Technical Editorial** design system. Showcasing modern full-stack web applications, zero-build frontend architectures, low-latency streaming interfaces, sub-100ms APIs, and applied AI pipelines.

---

## 🗂 Project Architecture

```
portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD (Node syntax check, XML validation, Pages deployment)
├── index.html              # Main index page (Hero, Telemetry, Selected Work, Systems Architecture Console, In-Page Contact)
├── work.html               # Work & Systems (6 production case studies with expandable architectural deep dives)
├── lab.html                # The Lab (In-browser tokenizer, Transformers.js spam classifier, streaming profiler)
├── writing.html            # Writing & Notes (4 technical essays, deep-linked master-detail reader, newsletter dispatch)
├── feed.xml                # RSS 2.0 technical dispatches feed
├── sitemap.xml             # XML sitemap with canonical priorities
├── robots.txt              # Standard crawler declarations
├── assets/
│   ├── css/
│   │   └── style.css       # Design tokens, CSS variables for Light & Dark mode, custom scrollbars, modal transitions
│   ├── js/
│   │   ├── config.js       # Tailwind CSS dynamic configuration & anti-FOUC theme initialization
│   │   ├── main.js         # Dark/Light toggle, ⌘K Command Palette, universal contact modal, in-page contact dispatch
│   │   ├── work.js         # Case study deep dive accordions and tag filter engine
│   │   ├── lab.js          # Grid/Table view switcher, real-time search, Transformers.js classifier, stream profiler
│   │   └── writing.js      # Essay search, tag chips, deep-linking reader engine, SVG diagrams, and code copy
│   └── screenshots/        # High-resolution social cards and page previews
│       ├── home.png
│       ├── work.png
│       ├── lab.png
│       └── writing.png
└── docs/
    └── DESIGN.md           # Comprehensive Technical Editorial Design System specification
```

---

## ⚡ Features & Capabilities

1. **Minimal Build**: Plain HTML and vanilla JS. The only build step compiles Tailwind CSS (`pnpm build:css`).
2. **Dual-Theme Engineering (Light & Dark)**:
   - **Light Theme**: Warm alabaster paper base (`#FCF9F8`) with deep archival pine accent (`#005C55`).
   - **Dark Theme**: Deep carbon slate surfaces (`#0E0F11`) with phosphor teal indicators (`#2DD4BF`).
   - Theme preference is stored in `localStorage` and respects system `prefers-color-scheme`.
3. **Omni Command Palette (`⌘K` / `Ctrl+K`)**:
   - Universal quick-launcher accessible from any page.
   - Live search across all pages, 5 case studies, 5 lab tools, and essays.
   - Built-in site assistant answering common questions about Henok's engineering background.
4. **Interactive Sandboxes & Evals**:
   - **Token Streaming Visualizer**: Interactive SSE chunk latency simulator with real-time SVG jitter sparkline and TTFT profiling.
   - **Interactive Reader**: Master-detail reading pane dynamically rendering articles and code blocks with 1-click clipboard copy.
   - **Architectural Breakdowns**: Expandable specifications for each case study (Streaming, Tool Calls, Evals, and Bundle Footprint).

---

## 🚀 Preview Locally

Build the CSS once (or keep it rebuilding while you edit), then serve the folder:

```bash
pnpm install
pnpm build:css        # or: pnpm watch:css
python -m http.server 3000
```

Then visit `http://localhost:3000`. `assets/css/tailwind.css` is generated and gitignored; without it the pages render unstyled.

---

## 🌐 Deploy (GitHub Pages)

Deployment is handled by [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Every push validates JS and XML and builds the CSS. Pushes to `main` also bundle only the public files into `_site/` and deploy them.

One-time setup:
1. **Settings → Pages → Source**: choose **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter `www.henoksolomon.com` and enable **Enforce HTTPS**. (With Actions deployments a `CNAME` file is ignored, so the domain lives in settings.)
3. At your DNS provider, point `www` (CNAME) to `henokinthestars.github.io`, and add the GitHub Pages `A` records for the apex `henoksolomon.com`.
