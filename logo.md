Update the entire LifeOS application to use the new official brand identity.

## Branding

The new logo assets are located in:

/public/logo/
- lifeos-logo.png (primary logo)
- lifeos-icon.png (icon only)
- favicon.png

Replace every occurrence of the old LifeOS logo with the new branding.

## Landing Page

- Replace the current navbar logo with `lifeos-logo.png`.
- Keep the logo aligned with the navigation.
- Logo height should be approximately 38–42px.
- Preserve the existing spacing and responsive behavior.

## Dashboard

- Replace the sidebar logo with `lifeos-logo.png`.
- Size should be approximately 120–140px wide.
- When the sidebar is collapsed, display only `lifeos-icon.png`.

## Authentication Pages

- Display the logo above the login and register forms.
- Center it horizontally.
- Size around 180–220px wide.

## Browser Icon

Replace the current favicon with the new favicon asset.

## Responsive

Ensure the logo scales correctly on desktop, tablet, and mobile.

## Code Quality

- Do not hardcode image paths repeatedly.
- Create a reusable Logo component that accepts:
  - variant: "full" | "icon"
  - size
  - className

Example:

<Logo variant="full" />

or

<Logo variant="icon" />

Use this component everywhere instead of directly importing images.

## Cleanup

- Remove every reference to the previous logo.
- Keep spacing, alignment, and colors consistent with the current design system.
- Do not modify any functionality—only update the branding and logo implementation.
