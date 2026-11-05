# AquaShield Website

Static marketing site for AquaShield, served by GitHub Pages at aquashieldai.com.

## Stack

- Plain HTML, CSS and JavaScript on the live site. No framework, no runtime dependencies.
- One build script, `build.js`, run with Node (no packages to install). It turns the templates and the three locale files into the static pages. The generated pages are committed, so GitHub Pages needs no build step.
- Three languages: English at `/`, German at `/de/`, French at `/fr/`.

## Build

```bash
node build.js
```

Writes the pages into the repo root, `de/` and `fr/`, plus the sitemaps. Run it after every change to a locale file, a template or a blog post, and commit the output together with the source.

```bash
node build.js --preview
```

Writes the same pages into `preview/` (ignored by git) with relative links, so the folder can be opened from disk or dropped onto any static host for a preview.

## Folder structure

| Path | What it is |
| --- | --- |
| `locales/en.json`, `de.json`, `fr.json` | Every string on the site, including the labels inside the hero animation and the counter. Change words here. |
| `data/sites.json` | Inputs for the live counter: site, buildings, measuring points, go-live date, leaks found. Never typed numbers. |
| `content/blog/<lang>/*.md` | Blog posts, Markdown with front matter. |
| `src/layout.html` | The page shell: head, header, footer. |
| `src/pages/*.html` | One template per page. |
| `src/partials/*.html` | Shared pieces: header, footer, CTA band, alert card, logo strip, FAQ, counter. |
| `theme.css` | Design tokens: colours, radii, shadows. Inlined into every page by the build. |
| `styles.css` | Components and layout, mobile first. Inlined into every page by the build. |
| `script.js` | Menu, live counter, Calendly on click, form, video playback, click-to-load 3D scenes. |
| `assets/img`, `assets/video` | Web-sized images and video. |
| `logos/` | Backer and research logos. |
| `animations/` | Three.js scenes from the previous site, kept for click-to-load use. Not loaded by default. |
| `index.html`, `product/`, `real-estate/`, ... `de/`, `fr/` | Generated output. Do not edit by hand, edit the source and rebuild. |
| `privacy-policy.html`, `terms.html` | Legal pages, untouched by the build. |
| `CLAIMS.md`, `COPY.md`, `SEO.md`, `REVIEW.md` | The rebuild's working documents: claim status, copy, search plan, review log. |

## Rules

- Every fact on the site traces to `CLAIMS.md`. Anything unconfirmed carries `[TO CONFIRM: ...]` in the locale file, which the build renders as a visible amber chip.
- The counter is computed from `data/sites.json`. Never type a number into a page.
- No en dashes, no semicolons, no superlatives.
- See `EDITING_GUIDE.md` for how to change words, pictures and pages.
