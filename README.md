# Henok — AI & Web Systems Engineer Portfolio

A high-performance personal portfolio built with the **Technical Editorial** design system. Designed for a technical systems engineer shipping production AI systems, focusing on low-latency streaming architectures, sub-400ms TTFT, and rigorous evaluation pipelines.

---

## 🗂 Project Architecture

```
portfolio/
├── index.html              # Main index page (Hero, Telemetry, Selected Work, The Lab, Ask-AI Runtime)
├── work.html               # Work & Systems (5 production case studies with expandable architectural deep dives)
├── lab.html                # The Lab (5 experimental prototypes, interactive SSE token stream visualizer, table/grid views)
├── writing.html            # Writing & Notes (Searchable essays directory with split-pane interactive reader)
├── assets/
│   ├── css/
│   │   └── style.css       # Design tokens, CSS variables for Light & Dark mode, custom scrollbars, modal transitions
│   ├── js/
│   │   ├── config.js       # Tailwind CSS dynamic configuration & anti-FOUC theme initialization
│   │   ├── main.js         # Shared functionality: Dark/Light mode toggle, ⌘K Command Palette, nav highlighting
│   │   ├── work.js         # Interactive case study deep dive accordions and tag filter engine
│   │   ├── lab.js          # Grid/Table view switcher, real-time tool search, and live SSE token stream simulator
│   │   └── writing.js      # Essay search, semantic tag chips, active article reader switcher, and code copy
│   └── screenshots/        # High-resolution reference mockups
│       ├── home.png
│       ├── work.png
│       ├── lab.png
│       └── writing.png
└── docs/
    └── DESIGN.md           # Comprehensive Technical Editorial Design System specification
```

---

## ⚡ Features & Capabilities

1. **Zero-Build Architecture**: Runs natively in any modern browser without requiring `npm install` or bundlers.
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

You can preview the portfolio using any static HTTP server:

### Option 1: Python
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000`.

### Option 2: Node / npx
```bash
npx serve .
```

### Option 3: VS Code / IDE Live Server
Right-click `index.html` and select **Open with Live Server**.

---

## 🌐 Deploy to GitHub Pages / Vercel

### GitHub Pages:
1. Push this repository to GitHub (`HenokInTheStars/portfolio`).
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`.
4. Your site will be live immediately!

### Vercel / Netlify:
Deploy instantly by linking your repository; no build command required.
