---
name: Emerald Premium Productivity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#2b6954'
  on-secondary: '#ffffff'
  secondary-container: '#adedd3'
  on-secondary-container: '#306d58'
  tertiary: '#55615a'
  on-tertiary: '#ffffff'
  tertiary-container: '#99a69e'
  on-tertiary-container: '#303c36'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#d9e6dd'
  tertiary-fixed-dim: '#bdcac1'
  on-tertiary-fixed: '#131e19'
  on-tertiary-fixed-variant: '#3e4943'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-expanded: 256px
  sidebar-collapsed: 80px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

This design system targets high-performance professionals who value clarity, speed, and a premium aesthetic. The brand personality is "Sophisticated Efficiency"—it feels expensive yet highly functional. 

The design style is **Corporate Modern with a Tactile edge**. It utilizes generous whitespace and a refined color palette to reduce cognitive load. The emotional response should be one of calm focus and "flow state" reliability. Every interaction is designed to feel intentional, using soft elevations and large radii to soften the industrial nature of productivity software.

## Colors

The palette is centered around **Emerald Green (#10b981)**, which serves as the primary action color and brand anchor. 

- **Primary:** Emerald Green is used for primary buttons, active states, and critical progress indicators.
- **Secondary:** A deep "British Racing Green" (#064e3b) is used for high-contrast text or dark-mode headers to maintain the emerald theme without losing legibility.
- **Tertiary:** A soft mint tint (#f0fdf4) provides subtle background washes for cards or selected list items.
- **Neutral:** A cool slate palette handles typography and borders, ensuring the green accents remain the focal point.
- **Functional:** Error states use a soft rose, and warnings use an amber, both tuned to match the saturation levels of the primary Emerald.

## Typography

The typography uses **Hanken Grotesk** exclusively. It is a clean, modern typeface that balances geometric precision with humanist warmth. 

- **Hierarchy:** Use bold weights (700) for displays and semi-bold (600) for section headers. 
- **Readability:** Body text should maintain a 150% line-height ratio for long-form data entry or reading tasks.
- **Caps:** Use all-caps with 5% letter spacing only for the `label-md` style (e.g., table headers or small metadata).
- **RTL Alignment:** In RTL contexts, ensure font-weight remains consistent as Hanken Grotesk handles varied character densities well.

## Layout & Spacing

This design system uses a **Fluid Grid with Fixed Sidebar** model. 

- **Sidebar states:** The sidebar transitions smoothly between 256px (expanded) and 80px (collapsed). Content in the main viewport must fluidly resize during this transition.
- **RTL Support:** The layout is fully reversible. In RTL mode, the sidebar moves to the right, and all "start/end" padding values are swapped.
- **Rhythm:** A 4px/8px base unit drives all spacing. 
- **Breakpoints:** 
  - Mobile: < 768px (Sidebar hidden, replaced by bottom bar or drawer).
  - Tablet: 768px - 1280px (Sidebar collapsed by default).
  - Desktop: > 1280px (Sidebar expanded by default).

## Elevation & Depth

Visual hierarchy is established through **Ambient Shadows** and **Tonal Layers**. 

1. **Surface Base:** The primary background is a very light grey/white.
2. **Surface Container:** Cards use a pure white background to pop against the base.
3. **Shadows:** Use a "soft-touch" shadow profile. Instead of harsh blacks, use a deep Emerald-tinted neutral for the shadow color (e.g., `rgba(6, 78, 59, 0.08)`).
   - *Level 1 (Cards):* 0px 4px 20px -2px rgba(0,0,0,0.05).
   - *Level 2 (Modals/Popovers):* 0px 12px 32px -4px rgba(0,0,0,0.12).
4. **Transitions:** All state changes (hover, sidebar toggle) must use a `200ms cubic-bezier(0.4, 0, 0.2, 1)` easing.

## Shapes

The shape language is "Generous & Friendly." 

- **Cards:** Strictly 18px (`rounded-xl` equivalent in this system) to create a distinct, modern container feel.
- **Buttons & Inputs:** 12px (`rounded-lg`) to maintain a professional but accessible appearance.
- **Interactive Elements:** Active states in the sidebar or navigation should use a "pill" or "stadium" shape for clear selection visibility.
- **Consistency:** Never use sharp corners. Even "flush" elements should have a minimal 4px radius if they are distinct objects.

## Components

- **Buttons:** 
  - *Primary:* Emerald Green background, white text, 12px radius. 
  - *Secondary:* Transparent with Emerald 1px border.
  - *Micro-interaction:* On hover, the button should lift slightly (-2px Y-axis) and the shadow should deepen.
- **Sidebar:** 
  - Icons are 24px Lucide-style (outline, 2px stroke).
  - Active state: Emerald Green icon and text, with a 4px vertical "pill" indicator on the leading edge (left in LTR, right in RTL).
- **Cards:** 18px radius, white fill, Level 1 shadow. Headers within cards should have a subtle 1px bottom border (#f1f5f9).
- **Inputs:** 12px radius, 1.5px border. On focus, the border changes to Emerald Green with a 3px outer "glow" using the primary color at 15% opacity.
- **Chips/Badges:** Use the Tertiary color (light mint) for backgrounds with Primary color (Emerald) text for a high-end "tag" look.
- **Icons:** Standardized Lucide-style. Stroke width must remain constant at 2px regardless of icon size to maintain visual weight.