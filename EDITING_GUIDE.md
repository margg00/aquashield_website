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
| `clamp-on-sensor.webp` | Home, step 1. Product, install section. |
| `team.webp` | Team page. |
| `pipe-network.webp` | Home, step 4. Data centres. |
| `twin-poster.webp`, `assets/video/twin.webm`, `twin.mp4` | Product, localisation section. |
| `twin-ui.webp` | Product, machine learning section. |
| `logo-wordmark.webp` | Header and footer. |
| `og-default.png` | Link previews on LinkedIn and chat apps. |

## Change colours or type

`theme.css` holds the tokens (`--accent`, `--bg-primary`, text colours, radii). `styles.css` holds the components. Both are inlined into every page by the build, so run `node build.js` after any change.

## Change the layout of a page

Templates are in `src/pages/`, one per page. Shared pieces in `src/partials/`. The page shell in `src/layout.html`. Templates use `{{key}}` for a string from the locale file, `{{> name}}` for a partial, `{{#each list}} ... {{/each}}` for a list.

## Check before showing anyone

Look at the page at phone width (390px) and laptop width (1440px). No sideways scrolling, no cut-off headlines, every To-confirm chip is one you expect.

## Where things do not live

- Legal text: `privacy-policy.html` and `terms.html` are not touched by the build. Marguerite owns them.
- The contact form posts to Formspree, the booking button opens Calendly. Both links are in `src/pages/book-a-call.html`. Change them only when Felix confirms the founders' link.
- Analytics: a commented slot in `src/layout.html`. Off until agreed.
