import type { Config } from "tailwindcss";
import { DESIGN_TOKENS } from "./config/tokens";

const c = DESIGN_TOKENS.colors;

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: c.background,
        "on-background": c.onBackground,

        // Surface tones (Material 3 style, flattened so `bg-surface-container-*` resolves)
        surface: {
          DEFAULT: c.surface.DEFAULT,
          dim: c.surface.dim,
          bright: c.surface.bright,
          lowest: c.surface.lowest,
          low: c.surface.low,
          high: c.surface.high,
          highest: c.surface.highest,
          variant: c.surface.variant,
          input: c.surface.low,
          container: {
            DEFAULT: c.surface.container,
            lowest: c.surface.lowest,
            low: c.surface.low,
            high: c.surface.high,
            highest: c.surface.highest,
          },
        },
        "surface-input": c.surface.low,
        "on-surface": c.onSurface,
        "on-surface-variant": c.onSurfaceVariant,
        "inverse-surface": c.inverseSurface,
        "inverse-on-surface": c.inverseOnSurface,
        outline: c.outline,
        "outline-variant": c.outlineVariant,
        "surface-tint": c.surfaceTint,

        primary: {
          DEFAULT: c.primary.DEFAULT,
          on: c.primary.on,
          hover: "#00563a",
          container: c.primary.container,
          "on-container": c.primary.onContainer,
          inverse: c.primary.inverse,
        },
        "on-primary": c.primary.on,

        secondary: {
          DEFAULT: c.secondary.DEFAULT,
          on: c.secondary.on,
          container: c.secondary.container,
          "on-container": c.secondary.onContainer,
        },
        "on-secondary": c.secondary.on,

        tertiary: {
          DEFAULT: c.tertiary.DEFAULT,
          on: c.tertiary.on,
          container: c.tertiary.container,
          "on-container": c.tertiary.onContainer,
        },
        "on-tertiary": c.tertiary.on,

        error: {
          DEFAULT: c.error.DEFAULT,
          on: c.error.on,
          container: c.error.container,
          "on-container": c.error.onContainer,
        },
        "on-error": c.error.on,

        "border-subtle": c.outlineVariant,
        "text-muted": c.onSurfaceVariant,
      },
      borderRadius: {
        sm: DESIGN_TOKENS.radii.sm,
        DEFAULT: DESIGN_TOKENS.radii.DEFAULT,
        md: DESIGN_TOKENS.radii.md,
        lg: DESIGN_TOKENS.radii.lg,
        xl: DESIGN_TOKENS.radii.xl,
        full: DESIGN_TOKENS.radii.full,
        card: "1.5rem",
        statCard: "1.5rem",
        badge: "9999px",
        button: "9999px",
        drawer: "1.5rem",
        modal: "1.5rem",
        input: "0.75rem",
      },
      fontFamily: {
        sans: [DESIGN_TOKENS.typography.fontFamily.sans],
        display: [DESIGN_TOKENS.typography.fontFamily.display],
        headline: [DESIGN_TOKENS.typography.fontFamily.display],
        mono: [DESIGN_TOKENS.typography.fontFamily.mono],
      },
      boxShadow: {
        level1: "0px 4px 20px -2px rgba(6, 78, 59, 0.05)",
        level2: "0px 12px 32px -4px rgba(6, 78, 59, 0.12)",
        card: "0px 4px 20px -2px rgba(6, 78, 59, 0.05)",
        subtle: "0px 2px 8px 0px rgba(0, 0, 0, 0.04)",
        offset: "0px 6px 20px -6px rgba(6, 78, 59, 0.18)",
        "offset-primary": "0px 8px 24px -6px rgba(0, 108, 73, 0.35)",
        glow: "0px 0px 24px -4px rgba(0, 108, 73, 0.35)",
        drawer: "-8px 0px 40px -12px rgba(6, 78, 59, 0.18)",
        modal: "0px 24px 64px -12px rgba(6, 78, 59, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
