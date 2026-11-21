# Henok Solomon · Portfolio

Personal site of Henok Solomon, a full-stack developer in Addis Ababa: web apps with React, TypeScript and FastAPI, plus machine learning where it helps.

Live at **https://www.henoksolomon.com**

## Stack

- [Astro 5](https://astro.build) for static pages, with React for interactive pieces (the spam-threshold demo)
- TypeScript throughout, checked with `astro check`
- Plain CSS with design tokens (light and dark themes) in `src/styles/global.css`
- Self-hosted fonts via Fontsource: Bricolage Grotesque, Inter, JetBrains Mono
- Cross-document View Transitions for the card-to-case-study morph (falls back to a normal page load)

## Run it locally

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # type-check
pnpm build      # static site in dist/
pnpm preview    # serve dist/
```

## Where things live

| What | File |
|---|---|
| Name, links, skills, timeline, education | `src/data/site.ts` |
| Case studies and "More projects" | `src/data/projects.ts` |
| Spam-model scores for the threshold demo | `src/data/spamScores.ts` |
| Home page sections | `src/components/*.astro` |
| Case-study page | `src/pages/work/[slug].astro` |
| Layout, meta tags, theme and page-morph scripts | `src/layouts/Base.astro` |

## Content to add

- **Résumé:** put `resume.pdf` in `public/`. The résumé buttons appear automatically.
- **Education:** fill in `EDUCATION` in `src/data/site.ts`. It is added to the About timeline.
- **Real spam scores:** the threshold demo uses simulated scores that match the measured results at 0.50. Export the model's probabilities as described in `src/data/spamScores.ts` to make every threshold real.

## Deploy

`.github/workflows/ci.yml` type-checks and builds every push. Pushes to `main` deploy `dist/` to GitHub Pages.

One-time setup:
1. **Settings → Pages → Source:** GitHub Actions.
2. **Settings → Pages → Custom domain:** `www.henoksolomon.com`, then enable **Enforce HTTPS**.
3. DNS: a `CNAME` record for `www` pointing to `henokinthestars.github.io`, plus GitHub Pages `A` records for the apex domain.
