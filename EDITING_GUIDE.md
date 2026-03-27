# AquaShield Website Editing Guide

This guide is for a non-technical maintainer who wants to update the website without digging through the whole codebase.

## Where Things Live

Main page files:

- [index.html](index.html)
  All main website text and section structure.
- [styles.css](styles.css)
  Spacing, layout, responsiveness, and section styling.
- [theme.css](theme.css)
  Colors, typography, and shared design tokens.
- [script.js](script.js)
  Contact form behavior, smooth scrolling, and reveal effects.

Asset folders:

- [logos](logos)
  All logo files used on the site.
- [animations](animations)
  Standalone animated scenes embedded into the page.

If you only want to change words, stay in `index.html`.

## Before You Edit

1. Change one section at a time.
2. Refresh the page after every change.
3. If mobile looks wrong, the fix is usually in `styles.css`.
4. Only edit files in `animations/` if the problem is inside the animation itself.

## Website Order

1. Header
2. Hero
3. Logo band
4. Solution section, top row
5. Solution section, bottom row
6. Pilot and contact section
7. Footer

## 1. Header

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [5608_U_AquaShield_DV_PM_01_header.png](logos/5608_U_AquaShield_DV_PM_01_header.png)

What you can change:

- the top-left AquaShield logo (single combined image: icon + wordmark)
- the `Get in touch` button text

Where to edit:

- in `index.html`, inside `<header class="site-header"...>`

If the header height or spacing feels wrong:

- edit `.nav-shell`
- edit `.brand`
- edit `.brand-logo`
- edit `.nav-cta`

Note: the header backdrop blur is on `.site-header::before`, not the header itself. This avoids browser rendering bugs.

Prompt for AI:

```text
Update the header section of my AquaShield website only. The files are index.html and styles.css. Keep the rest of the page unchanged. I want you to [describe the header change], and if the logo changes, use files from the logos folder.
```

## 2. Hero

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [house_anomaly.html](animations/house_anomaly.html) (embedded with `?hero=1`)
- [Y_Combinator_logo.svg](logos/Y_Combinator_logo.svg)

What you can change:

- eyebrow text
- main title
- tagline ("The smoke detector for your building's water system")
- subtitle
- main CTA text
- `Backed by Y Combinator` line

Where to edit:

- in `index.html`, inside `<section class="hero"...>`

If you want to change the animation itself:

- edit [house_anomaly.html](animations/house_anomaly.html)

If you want to resize or reposition the animation on the page:

- edit `.hero-visual`
- edit `.blob-shell`
- edit the hero mobile rules near `@media (max-width: 520px)` in [styles.css](styles.css)

Prompt for AI:

```text
Update only the hero section of my AquaShield website. The main files are index.html and styles.css, and the embedded animation is animations/house_anomaly.html (loaded with ?hero=1). Keep the rest of the page unchanged. I want you to [describe the hero copy or layout change]. If the request is mobile-specific, make the fix in styles.css rather than changing the animation camera unless that is absolutely necessary.
```

## 3. Logo Band

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [MIT_logo.svg](logos/MIT_logo.svg)
- [EPGL_logo.svg](logos/EPGL_logo.svg)
- [Y_Combinator_logo_cutout.svg](logos/Y_Combinator_logo_cutout.svg)

What you can change:

- the text above the logos
- logo order
- which logos are shown
- logo sizes

Where to edit:

- in `index.html`, inside `<section class="proof-strip"...>`

If a logo size feels off:

- edit `.proof-logos img`
- edit `.proof-logo-mit img`
- edit `.proof-logo-yc img`

If the logos break on mobile:

- start in the `@media (max-width: 520px)` block in [styles.css](styles.css)

Note: the YC logo in the proof strip has `filter: none` to avoid Safari blur issues. Do not add CSS filters to the YC logo.

Prompt for AI:

```text
Update only the social proof logo band on my AquaShield website. The files are index.html and styles.css, and the logo assets are in the logos folder. Keep all other sections unchanged. I want you to [describe the logo/text/order/mobile change].
```

## 4. Solution Section, Top Row

This is the row with the pipe animation on the left and "Full visibility. Zero disruption." on the right.

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [pipe_network.html](animations/pipe_network.html)

What you can change:

- kicker text
- title
- paragraph
- page-level sizing of the embedded animation

Where to edit:

- in `index.html`, inside `<div class="solution-top"...>`

If you want to change the animation scene itself:

- edit [pipe_network.html](animations/pipe_network.html)

If you only want the embed bigger or smaller on the page:

- edit `.solution-panel-embed`
- edit `.pipe-network-frame`

Note: the animation auto-rotates and has zoom/rotate/pan disabled so it does not interfere with page scrolling.

Prompt for AI:

```text
Update only the top row of the solution section on my AquaShield website. The files are index.html and styles.css, and the embedded animation is animations/pipe_network.html. Keep the rest of the page unchanged. I want you to [describe the copy, layout, or sizing change]. If this is a mobile issue, prefer fixing the page layout in styles.css before changing the animation file.
```

## 5. Solution Section, Bottom Row

This is the row with "Catch leaks before they turn catastrophic" and the house/dashboard animation.

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [house_anomaly.html](animations/house_anomaly.html)

What you can change:

- kicker text
- title
- paragraph
- embed size on the page
- chart content inside the embedded animation

Where to edit:

- in `index.html`, inside `<div class="solution-bottom"...>`

Important:

- the chart labels, plot lines, anomaly button, and building overlay all live inside [house_anomaly.html](animations/house_anomaly.html)
- the page shell around that embed lives in [styles.css](styles.css)
- the animation auto-rotates and has zoom/rotate/pan disabled

Prompt for AI:

```text
Update only the bottom row of the solution section on my AquaShield website. The files are index.html and styles.css, and the embedded animation is animations/house_anomaly.html. Keep the rest of the page unchanged. I want you to [describe the text, layout, or chart change]. If the issue is only that the embed sits wrong on the page, fix styles.css. If the issue is inside the chart or scene, edit house_anomaly.html.
```

## 6. Pilot And Contact Section

This is the bottom section with the heading, description paragraph, and contact form.

Files:

- [index.html](index.html)
- [styles.css](styles.css)
- [script.js](script.js)

What you can change:

- kicker
- title ("Never miss a leak again")
- description paragraph
- form labels
- field list
- submit button text ("Request a pilot")

Where to edit:

- in `index.html`, inside `<section class="contact-section"...>`

Form delivery:

- the form submits to `https://formspree.io/f/mqeyjeqn`
- that URL is set on the `<form>` tag in [index.html](index.html)

If you want to add or remove fields:

- edit the form markup in `index.html`
- use `required` only on fields that must be mandatory

If you want to change validation or submission messages:

- edit [script.js](script.js)

Prompt for AI:

```text
Update only the pilot and contact section of my AquaShield website. The main files are index.html, styles.css, and script.js. Keep the rest of the page unchanged. I want you to [describe the copy, form, or layout change]. Do not change the Formspree endpoint unless I explicitly ask.
```

## 7. Footer

Files:

- [index.html](index.html)
- [styles.css](styles.css)

What you can change:

- copyright text
- social links (currently email and LinkedIn)

Where to edit:

- in `index.html`, inside `<footer class="site-footer"...>`

Note: the footer does not use scroll-reveal animations. It is always visible. Social links are styled with `.footer-social`.

Current links:

- Email: founders@aquashieldai.com
- LinkedIn: placeholder (`#`)

Prompt for AI:

```text
Update only the footer of my AquaShield website. The files are index.html and styles.css. Keep the rest of the page unchanged. I want you to [describe the footer link or text change].
```

## Colors, Fonts, And Global Design

Files:

- [theme.css](theme.css)
- [styles.css](styles.css)

If you want to change colors:

- open `theme.css`
- edit the values under `:root`

The most important tokens are:

- `--accent`
- `--accent-bright`
- `--text-primary`
- `--text-secondary`
- `--bg-primary`

If you want to change the main font:

- the site currently uses `Inter`
- the font is loaded in [index.html](index.html)
- embedded animations are separate pages, so text inside them may need separate font handling

Prompt for AI:

```text
Update the global design system of my AquaShield website. The key files are theme.css and styles.css, with index.html only if font loading needs to change. Keep the content and section structure unchanged. I want you to [describe the color, font, or spacing system change].
```

## Mobile Changes

Most mobile fixes belong in [styles.css](styles.css).

Look near the bottom for:

- `@media (max-width: 1080px)` — hero stacks vertically
- `@media (max-width: 768px)` — mobile layout
- `@media (max-width: 520px)` — narrow phone tweaks

Good mobile fixes:

- stacking sections vertically
- adjusting spacing
- resizing logos
- resizing embedded frames
- centering or tightening text blocks

Use caution before changing animation cameras or chart drawing logic just for mobile.

Prompt for AI:

```text
I need a mobile-only fix for my AquaShield website. Start in styles.css and keep desktop unchanged. Only touch files inside the animations folder if the problem is clearly inside the embedded scene rather than the page layout. The issue is: [describe the mobile problem].
```

## Quick Reference

Change homepage text:

- [index.html](index.html)

Change colors and font tokens:

- [theme.css](theme.css)

Change spacing, layout, and mobile rules:

- [styles.css](styles.css)

Change form behavior:

- [script.js](script.js)

Change hero animation:

- [house_anomaly.html](animations/house_anomaly.html) (loaded with `?hero=1`)

Change top solution animation:

- [pipe_network.html](animations/pipe_network.html)

Change bottom solution animation:

- [house_anomaly.html](animations/house_anomaly.html)

Swap logo files:

- [logos](logos)
