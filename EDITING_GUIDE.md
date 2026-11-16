# AquaShield Website Editing Guide

For a non-technical maintainer. One rule above all: **change the source, then run the build, then commit both.**

```bash
node build.js
```

If you only want to change words, you never leave the `locales/` folder.

## Change words on any page

1. Open `locales/en.json` (English), `locales/de.json` (German) or `locales/fr.json` (French).
2. Find the text. The file is grouped by page: `home`, `product`, `realEstate`, `insurance`, `dataCenters`, `team`, `blog`, `book`, `imprint`. Shared text is under `nav`, `cta`, `footer`, `counter`, `alert`, `building` (the labels inside the hero animation) and `logos`.
3. Change the text between the quotes. Keep the quotes. Keep the key on the left unchanged.
4. Run `node build.js`. Open the page. Commit.

Change the same text in all three files, or the languages drift apart.

Marking something as unconfirmed: write `[TO CONFIRM: what and who]` inside the text. It shows as an amber chip on the page until you remove it.

Prompt for AI:

```text
Change the wording on the AquaShield website. The text lives in locales/en.json, de.json and fr.json. Change [describe the text] to [new text] in all three languages, run node build.js, and show me the result at 390px and 1440px.
```

## Change the live counter

Open `data/sites.json`. Each site has `buildings`, `points` (measuring points) and `liveSince` (the go-live date). `leaksFound` is the total. The site computes readings from these inputs. Never type a readings number anywhere.

## Add or change a blog post

1. Copy an existing file in `content/blog/en/` and rename it. The file name becomes the URL.
2. Fill the front matter at the top: `id` (same across languages for the same post), `slug`, `title`, `description`, `date`, `author`, `authorId` (one of `paul-beckers`, `marguerite-benoist`, `tim-baumeister`), `segment` and `segmentLabel`, `answer` (the direct answer, under 60 words), the sourced statistic (`statValue`, `statLabel`, `statSource`, `statDate`), `definition`, and up to five FAQ pairs (`faq1q`, `faq1a`, ...).
3. Write the body in Markdown: `##` headings, paragraphs, lists, links.
4. For German and French, add the same post under `content/blog/de/` and `content/blog/fr/` with the same `id`.
5. Run `node build.js`.

## Change a picture

Web-sized pictures live in `assets/img/`. Replace a file with one of the same name and size (the photos are 1200px wide WebP with 600px and 900px variants), then run the build. Where each picture is used:

| File | Used on |
| --- | --- |
| `team.webp` | Team page. |
| `twin-ui.webp` | Product, machine learning section (real dashboard view). |
| `logo-wordmark.webp` | Header and footer. |
| `og-default.png` | Link previews on LinkedIn and chat apps. |

Team photos live in `assets/img/team/people/`. Save a square WebP (240 by 240, under 20 KB) named after the person's `id` in the locale file, for example `paul-beckers.webp`, then run the build: the photo replaces that person's initials, and anyone without a photo keeps the initials.
| `clamp-on-sensor.webp`, `pipe-network.webp`, `assets/video/twin.*` | Kept in the repo, not on any page right now. |

Drawn visuals (sharp at any size, animated, every label from the locale file) live in code, not in image files:

| Visual | File | Used on |
| --- | --- | --- |
| Hero building, the 18-second story loop | `src/hero.js` | Home hero. Same drawing in a still "twin" variant on Product (localization) and Team. |
| The clamp-on sensor (one look everywhere) | `src/sensor-kit.js` | Used by the Product drawings below and drawn the same way in Home step 1 (`src/visuals/home.js`). |
| Clamp-on sensors on a riser and its supply line | `src/visuals.js`, `installSvg` | Product install, Team. |
| Sensor close-up | `src/visuals.js`, `sensorSvg` | Product, "The sensor". |
| Rack row on a cooling loop | `src/visuals.js`, `rackSvg` | Data centers. |
| Baseline and deviation charts | inline in `src/pages/home.html` and `product.html` | Home steps 2 and 3, Product data section. |

To change a label inside a drawing, edit the `building`, `product.install.labels`, `product.sensors.visual` or `dataCenters.visual` block in the locale files.

## Add the launch video

Save the video as `assets/video/launch.mp4` and a still frame as `assets/video/launch-poster.webp` (16:9, about 1600 by 900, under 200 KB), then run the build. The home page then shows a section "See it in two minutes" right under the row of four figures, with a player that loads nothing until the visitor presses play. Without `launch.mp4` the section is simply not on the page. The heading is `home.video.h2` in the locale files.

## Add photos from the lab and the field

Save each photo as a WebP in `assets/img/field/`, named with a number and a short caption, for example `01-test-bench.webp` or `02-riser-in-basement.webp` (about 1200px wide, under 200 KB), then run the build. They appear in that number order in a section "From the lab and the field" on the Team page, above the people cards, and the caption is made from the file name ("Riser in basement"). The caption is the same in all three languages. With no photos in the folder the section is not on the page.

## Change colours or type

`theme.css` holds the tokens (`--accent`, `--bg-primary`, text colours, radii). `styles.css` holds the components. Both are inlined into every page by the build, so run `node build.js` after any change.

## Styles and drawings for one page

Styles for a single page go in `src/css/<page>.css`. Drawings for a single page go in `src/visuals/<page>.js`. One file per page means two people never edit the same file. The build picks them up on its own. Run `node build.js` after any change.

## Change the layout of a page

Templates are in `src/pages/`, one per page. Shared pieces in `src/partials/`. The page shell in `src/layout.html`. Templates use `{{key}}` for a string from the locale file, `{{> name}}` for a partial, `{{#each list}} ... {{/each}}` for a list.

## Check before showing anyone

Look at the page at phone width (390px) and laptop width (1440px). No sideways scrolling, no cut-off headlines, every To-confirm chip is one you expect.

## Where things do not live

- Legal text: `privacy-policy.html` and `terms.html` are not touched by the build. Marguerite owns them.
- The contact form posts to Formspree, the booking button opens Calendly. Both links are in `src/pages/book-a-call.html`. Change them only when Felix confirms the founders' link.
- Analytics: a commented slot in `src/layout.html`. Off until agreed.
