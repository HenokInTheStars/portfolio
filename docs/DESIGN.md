---
name: Technical Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3e4947'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#5f5f59'
  on-secondary: '#ffffff'
  secondary-container: '#e4e3db'
  on-secondary-container: '#65655e'
  tertiary: '#7f4025'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c573a'
  on-tertiary-container: '#ffe5db'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#e4e3db'
  secondary-fixed-dim: '#c8c7bf'
  on-secondary-fixed: '#1b1c17'
  on-secondary-fixed-variant: '#474741'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb598'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#72361b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 3.5rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '400'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  code:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.3'
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a calm, precise, and rigorously engineered aesthetic tailored for a technical builder shipping production AI systems. It rejects standard AI tropes—eschewing neon purples, glossy glassmorphism, floating orbs, and generic futuristic blurs in favor of editorial clarity, tactile paper-like tones, and structured layout architecture.

The tone is understated, authoritative, and academic yet forward-looking. The visual cadence mimics high-end technical white papers and architectural monographs: generous baseline rhythms, razor-sharp 1px structural framing, and deliberate typographic contrast between rigorous monospaced data structures and literary editorial headings.

## Colors

The palette relies on balanced warm-neutral paper tones for the light theme and deep slate-charcoal obsidian surfaces for dark mode. High-contrast, saturated gradients are avoided; color is deployed strictly for intentional semantic cues, interactive states, and deliberate emphasis.

### Light Theme
- **Canvas (`bg`)**: `#FAFAF7` (warm alabaster base)
- **Surface (`surface`)**: `#F2F1EC` (muted linen card container)
- **Border (`border`)**: `#E3E2DB` (fine neutral rule)
- **Text (`text-primary`)**: `#1A1A1A` (near-black ink)
- **Muted Text (`text-muted`)**: `#5B5B55` (neutral graphite)
- **Accent (`accent`)**: `#0F766E` (deep archival pine / teal)

### Dark Theme
- **Canvas (`bg-dark`)**: `#0E0F11` (deep carbon canvas)
- **Surface (`surface-dark`)**: `#17181B` (elevated slate tier)
- **Border (`border-dark`)**: `#26272B` (subdued hairline border)
- **Text (`text-primary-dark`)**: `#EDEDED` (bright parchment white)
- **Muted Text (`text-muted-dark`)**: `#A1A1AA` (neutral steel)
- **Accent (`accent-dark`)**: `#2DD4BF` (phosphor teal indicator)

## Typography

Typography establishes an intentional dynamic between classical academic authority and clean technical logic:

- **Editorial Display & Key Headlines**: Rendered in a high-caliber serif (`Newsreader`), bringing literary warmth and restraint to titles, essay headers, and major case study narratives. Italic variants are reserved strictly for thesis statements, publication names, and project codenames.
- **Body & Structural Text**: Powered by `Geist`, offering clinical readability, neutral tracking, and tight vertical balance.
- **Labels, Metadata, Key-Value Pairs, & Architecture Specs**: Styled with `JetBrains Mono` in uppercase or tabular numerals to immediately communicate developer craft and systems orientation.

## Layout & Spacing

The layout model is anchored by a centered 12-column max-width grid (capped at `1120px` for wide viewports and `680px` for dedicated essay/article formats) to maintain optimal typographic line-length.

- **Desktop (>= 1024px)**: 12-column grid with `1.5rem` gutters and dynamic outer margins clamping between `2rem` and `4rem`.
- **Tablet (768px – 1023px)**: 8-column layout with `1.25rem` gutters and `2rem` outer margins.
- **Mobile (< 768px)**: 4-column layout with `1rem` gutters and `1.25rem` margins.

Vertical rhythm adheres to a strict 4px/8px modular cadence. Content blocks rely on precise border dividers rather than sprawling empty space to organize information.

## Elevation & Depth

This system avoids ambient drop shadows, blurry glows, and physical elevation metaphors. Hierarchy is articulated via **Tonal Layers** combined with **Low-Contrast Outlines**:

- **Layer 0 (Canvas)**: Baseline background (`#FAFAF7` light / `#0E0F11` dark).
- **Layer 1 (Card & Section Containers)**: Subtle tone shift (`#F2F1EC` light / `#17181B` dark) outlined by a continuous hairline border (`#E3E2DB` light / `#26272B` dark).
- **Interactive Hover Depth**: On cursor hover or state focus, surfaces do not lift; instead, the border transitions instantaneously (`150ms ease-out`) to the accent tone or a slightly deepened border tint.
- **Separators**: Explicit `1px solid` rules without inset shadows or beveling.

## Shapes

Corner radii remain disciplined and tight, reinforcing the architectural, technical aesthetic:

- **Base Radius (`0.5rem` / `8px`)**: Applied to standard interactive controls, code snippets, input fields, badges, and inline embeds.
- **Container Radius (`0.75rem` / `12px`)**: Applied to larger content cards, modal dialogs, and outer project framing.
- **Pill Shapes (`9999px`)**: Explicitly avoided, except for compact live status indicators (e.g., latency pings, availability markers).

## Components

### Buttons & Interactive Controls
- **Primary Action**: Solid surface fill using the text color with inverted text (`#1A1A1A` background with `#FAFAF7` text in light mode), crisp 8px radius, and standard `150ms` opacity shift on hover (`opacity: 0.9`). No drop shadows.
- **Secondary / Ghost Action**: Transparent fill, 1px border matching the border token, and Geist font at medium weight. Hover shifts background to surface color.
- **Action Transitions**: Strictly calibrated between `150ms` and `200ms` using standard ease curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

### Cards & Project Showcases
- Bound by 1px solid hairline borders with `12px` rounded corners.
- Header zones partition metadata (e.g., model deployed, latency, release timestamp) in `JetBrains Mono` label styling above the project title.
- Interactive project tiles apply a 1px border color transition to primary accent (`#0F766E` / `#2DD4BF`) on hover without vertical translation.

### Chips & Metadata Tags
- Compact `24px` height, `4px` corner radius, `space-xs` padding vertical and `space-sm` padding horizontal.
- Typeset in monospaced label typography, using a muted text color over surface background with a 1px border.

### Inputs & Terminal / Filter Fields
- Clean input surfaces using container background colors, with 1px hairline borders that switch to a crisp 1px primary accent on `:focus-visible`.
- Outline rings are sharp with zero blur offset.

### Code Blocks & Architecture Walkthroughs
- Background matches surface tier, delineated by hairline borders.
- Header bar includes filename or runtime environment labeled in monospaced uppercase, flanked by an inline copy action.