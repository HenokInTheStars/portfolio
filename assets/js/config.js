/**
 * Technical Editorial - Tailwind Configuration & Theme Initialization
 */

// 1. Immediate Theme Detection (Prevents FOUC)
(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

// 2. Tailwind CSS Configuration with CSS Variable Mapping
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        "on-background": "var(--color-on-background)",
        surface: "var(--color-surface)",
        "surface-dim": "var(--color-surface-dim)",
        "surface-bright": "var(--color-surface-bright)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "surface-variant": "var(--color-surface-variant)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "inverse-surface": "var(--color-inverse-surface)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        outline: "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "surface-tint": "var(--color-surface-tint)",
        primary: "var(--color-primary)",
        "on-primary": "var(--color-on-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary-container": "var(--color-on-primary-container)",
        "primary-fixed": "var(--color-primary-fixed)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "inverse-primary": "var(--color-inverse-primary)",
        secondary: "var(--color-secondary)",
        "on-secondary": "var(--color-on-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        tertiary: "var(--color-tertiary)",
        "on-tertiary": "var(--color-on-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        error: "var(--color-error)",
        "on-error": "var(--color-on-error)",
        "error-container": "var(--color-error-container)",
        "on-error-container": "var(--color-on-error-container)"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px"
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        margin: "2rem",
        gutter: "1.5rem"
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        "display-mobile": ["Newsreader", "Georgia", "serif"],
        "headline-lg": ["Newsreader", "Georgia", "serif"],
        "headline-lg-mobile": ["Newsreader", "Georgia", "serif"],
        "headline-md": ["Geist", "-apple-system", "sans-serif"],
        "body-lg": ["Geist", "-apple-system", "sans-serif"],
        "body-md": ["Geist", "-apple-system", "sans-serif"],
        code: ["JetBrains Mono", "monospace"],
        "label-md": ["JetBrains Mono", "monospace"],
        "label-sm": ["JetBrains Mono", "monospace"]
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-mobile": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-lg": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "400" }],
        "headline-lg-mobile": ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "400" }],
        "headline-md": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        code: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" }],
        "label-md": ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.04em", fontWeight: "500" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.06em", fontWeight: "500" }]
      }
    }
  }
};
