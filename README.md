# AquaShield Website

Static marketing site for AquaShield.

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript
- Standalone animation pages embedded in `iframe`s
- Formspree for contact form delivery

No build step is required.

## Folder Structure

- [index.html](index.html)
  Main page shell and all page copy.
- [theme.css](theme.css)
  Global tokens, reset, typography, and shared motion rules.
- [styles.css](styles.css)
  Section styles, layout, and responsive behavior.
- [script.js](script.js)
  Header state, scroll reveals, anchor scrolling, and Formspree submission.
- [logos](logos)
  Brand and social-proof logo assets.
- [animations](animations)
  Standalone visual scenes embedded on the page.

## Animation Files

- [house_anomaly.html](animations/house_anomaly.html)
  3D building scene with anomaly detection. Used in the hero (`?hero=1` mode) and the bottom solution row (with chart overlay). Auto-rotates, all user interaction disabled.
- [pipe_network.html](animations/pipe_network.html)
  3D pipe network scene. Used in the top solution row. Auto-rotates, all user interaction disabled.
- [blob.html](animations/blob.html)
  Older hero blob animation, no longer embedded on the page.
- [dashboard.html](animations/dashboard.html)
  Older dashboard component kept in repo.
- [pipe_anomaly.html](animations/pipe_anomaly.html)
  Older anomaly scene kept in repo.
- [flow_diagram.html](animations/flow_diagram.html)
  Older flow diagram reference kept in repo.

## Logo Files

- [5608_U_AquaShield_DV_PM_01_header.png](logos/5608_U_AquaShield_DV_PM_01_header.png)
  Combined icon + wordmark header logo.
- [5608_U_AquaShield_DV_PM_01.png](logos/5608_U_AquaShield_DV_PM_01.png)
  Full AquaShield logo asset.
- [5608_U_AquaShield_wordmark_header.png](logos/5608_U_AquaShield_wordmark_header.png)
  Legacy wordmark-only header image. No longer used on the page.
- [MIT_logo.svg](logos/MIT_logo.svg)
- [EPGL_logo.svg](logos/EPGL_logo.svg)
  EPFL logo asset. The filename is legacy and intentionally left as-is.
- [Y_Combinator_logo.svg](logos/Y_Combinator_logo.svg)
  Orange/white hero trust logo.
- [Y_Combinator_logo_cutout.svg](logos/Y_Combinator_logo_cutout.svg)
  White cutout strip logo. Uses `fill-rule="evenodd"` path (no SVG mask) for Safari compatibility.

## Section Ownership

### Header

- HTML: `index.html`
- Style: `styles.css` (`.site-header`, `.nav-shell`, `.brand`, `.brand-logo`)
- Logo asset: `logos/5608_U_AquaShield_DV_PM_01_header.png`
- Backdrop blur is on `.site-header::before` pseudo-element to avoid rendering bugs with `position: sticky`.

### Hero

- Copy and CTA: `index.html`
- Layout: `styles.css`
- Tagline: `.hero-tagline` element
- Trust logo: `logos/Y_Combinator_logo.svg`
- Animation: `animations/house_anomaly.html?hero=1`

### Social Proof Band

- HTML and logo order: `index.html`
- Sizing and responsive behavior: `styles.css`
- Assets: `logos/`
- YC logo uses `filter: none` to override the base `brightness(0) invert(1)` filter, since the cutout SVG is already white. This avoids Safari rasterization blur.

### Solution Section, Top Row

- Copy: `index.html`
- Layout: `styles.css`
- Animation: `animations/pipe_network.html`

### Solution Section, Bottom Row

- Copy: `index.html`
- Layout: `styles.css`
- Animation and chart: `animations/house_anomaly.html`

### Contact Section

- Copy and form fields: `index.html`
- Layout: `styles.css` (`.contact-blurb` for the description paragraph)
- Behavior: `script.js`
- Submission endpoint: `index.html`

### Footer

- HTML: `index.html`
- Style: `styles.css` (`.footer-shell`, `.footer-social`)
- Social links: email (founders@aquashieldai.com) and LinkedIn
- Footer does not use scroll-reveal animations — it is always visible.

## Form Submission

The contact form submits to Formspree.

Current endpoint:
- `https://formspree.io/f/mqeyjeqn`

Where it is configured:
- `action="https://formspree.io/f/mqeyjeqn"` in [index.html](index.html)

How it works:
- client-side validation in [script.js](script.js)
- `fetch` POST using `FormData`
- success/error feedback rendered into `.form-note`

## Responsive Rules

Responsive layout is handled in [styles.css](styles.css) through:

- `@media (max-width: 1080px)` — hero stacks vertically, `flex-basis: auto` on hero-visual
- `@media (max-width: 768px)` — mobile layout, hero animation moves above text
- `@media (max-width: 520px)` — narrow phone tweaks

Keep page-level mobile fixes in `styles.css`.
Only change animation camera or internal chart logic when the issue is genuinely inside the embedded scene.

## Safe Editing Guidelines

Low-risk changes:

- text in `index.html`
- colors in `theme.css`
- spacing and layout in `styles.css`
- logo swaps inside `logos/`

Medium-risk changes:

- `script.js`
- form fields
- mobile overrides

Higher-risk changes:

- files inside `animations/`
- `iframe` source changes
- Formspree endpoint changes

## Known Browser Notes

- Safari rasterizes SVGs with CSS `filter` or internal `<mask>` elements at low resolution on Retina displays. The YC cutout SVG was rewritten to use `fill-rule="evenodd"` instead of `<mask>` to avoid this.
- Chrome DevTools responsive mode does not perfectly simulate `position: sticky` behavior on real mobile devices.
- `backdrop-filter` on `position: sticky` elements can cause rendering glitches in Chrome. The header uses a `::before` pseudo-element for the blur to work around this.

## Local Preview

Open [index.html](index.html) directly in a browser, or run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment Notes

- This project is static and deploys cleanly to Vercel.
- No `npm install` or build step is required.
- If fonts or embeds behave differently in production, check remote font loading, iframe asset paths, and browser caching.

## Maintenance Rules

1. Keep section copy in `index.html`.
2. Keep design tokens in `theme.css`.
3. Keep layout and breakpoints in `styles.css`.
4. Keep behavior in `script.js`, grouped by function.
5. Treat files in `animations/` as separate mini-projects.
6. Prefer page-shell mobile fixes before touching animation framing.

## Companion Guide

For non-technical editing instructions and AI prompts, use [EDITING_GUIDE.md](EDITING_GUIDE.md).
