# REVIEW.md

Three review passes on the rebuilt site, each run on the English pages at phone (390px) and laptop (1440px) width, then the fixes, then a re-run. Lighthouse and device-sweep results at the end.

## Pass A: Apple design review. Cut what does not earn its place, then cut again.

| # | Finding | Fix |
| --- | --- | --- |
| A1 | The digital-twin sentence appeared three times on the Product page (precision caption, machine-learning caption, bottom box). | Bottom box now holds only the sensors. The machine-learning visual is captioned as the dashboard view. |
| A2 | Hero building: the three risers projected onto one screen column, so the building read as a single pipe. Label overlapped the building edge. | Risers spread across the floor plate, label moved outside the building with a leader line, stray supply line removed. |
| A3 | Counter at tablet width (768 to 899px) packed four columns too tightly. | Two columns up to 899px, four from 900px. |
| A4 | Tooltip on the counter took layout width while hidden and caused sideways scroll on phones. | Tooltip is display none until hover, focus or tap. Edge stats anchor left or right. |
| A5 | Two render-blocking stylesheets plus the Google Fonts stylesheet delayed first paint to 2.9 s on simulated 4G. | theme.css and styles.css are inlined by the build. The font stylesheet loads without blocking. First paint 1.0 s. |
| A6 | "Menu" label did not change when the menu was open. | Label flips to "Close". |
| A7 | Muted text at 44 percent white failed WCAG AA on the counter labels, the footer and the legal line. | Muted token raised to 60 percent white. Contrast passes everywhere. |
| A8 | Second cut: nothing else removed. The "Founders from" logo row stays because decision 6 names Harvard, and the footer canonical sentence stays for AI search. | |

## Pass B: a head of maintenance who has been burned by false alarms.

Would I book a call? Yes, if the install photo is real and the alert looks like something my team can act on. Both are on the page.

| # | What I do not believe or what is missing | Fix |
| --- | --- | --- |
| B1 | The sample alert said "Today, 04:10". That reads as a 4 a.m. call to my people. | Time changed to 07:10. The status line says the alert was reviewed with the maintenance team before it reached anyone. |
| B2 | "Up to 5 site visits" had no source. | Labelled "AquaShield pilot sites" with a To-confirm chip until Tim confirms the wording. |
| B3 | What happens with a false alarm? | Answered in the Product FAQ, the Real estate FAQ and the "What we do not promise yet" block. |
| B4 | Who installs it, and do I have to open walls? | Real estate FAQ and deployment path: walkthrough with the team, accessible pipe only, self-install after the first building. |
| B5 | What does my team actually receive? | Product "What data do I get": building, riser or section, how far from normal, how long, what to check first. Alert channels still [TO CONFIRM]. |
| B6 | Is this the same as our smart meters? | Real estate FAQ, first question. |

## Pass C: a sceptical underwriter. Which claim would I challenge, where is the source?

| # | Challenge | Fix |
| --- | --- | --- |
| C1 | "Europe's largest residential landlord" (Vonovia). | To-confirm chip until the wording is confirmed. |
| C2 | "USD 100k deductible per incident" and "claims above USD 1M tripled since 2015" carried no source. | Both now show "Source: To confirm". They must trace to a primary source before merge, or come off the page. |
| C3 | "A risk signal that does not exist today" is unprovable. | Reworded to "a risk signal that underwriting does not have today". |
| C4 | USD 89k average claim (NAIOP) and EUR 4.91bn (GDV). | Cited inline with To-confirm chips until checked against the primary source. |
| C5 | Any accuracy, lead time or savings claim? | None on the site. The "What we do not promise yet" block says so explicitly. Insurance page states no insurer partner exists yet. |
| C6 | Customer names without permission. | Names only, no logos, every list carries a To-confirm note. CLAIMS.md tracks permission per name. |

Re-run after fixes: no new findings in any pass.

## Device sweep

Playwright, eleven pages at twelve widths: 360, 390, 430 (phones), 768, 820, 1024, 1180 (tablets portrait and landscape), 1280, 1366, 1440, 1536, 1920 (laptops and desktops). Check: document scroll width equals viewport width, no element outside the viewport, no console errors.

Result: 132 of 132 pass. The only element reported outside the viewport is the intentional off-screen honeypot field on the booking form.

## Lighthouse, mobile, simulated 4G (local preview server, no gzip and no cache headers, so the live site on GitHub Pages scores the same or better)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| en / | 100 | 100 | 100 | 100 | 1.3 s | 0 |
| en /product/ | 100 | 100 | 100 | 100 | 1.4 s | 0 |
| en /team/ | 99 | 100 | 100 | 100 | 2.3 s | 0 |
| de / | 100 | 100 | 100 | 100 | 1.3 s | 0 |
| fr / | 100 | 100 | 100 | 100 | 1.4 s | 0 |

Before the fixes in pass A the home page scored 88 on performance (first paint 2.9 s). The two remaining advisory audits, unused CSS rules and responsive images, are about the inlined stylesheet carrying rules for other pages and about the 1200px photo being served to a 2.6x phone screen. Both are within budget.

## Language pass (de, fr)

| # | Finding | Fix |
| --- | --- | --- |
| L1 | German navigation labels (Versicherungen, Rechenzentren, Gespräch buchen) overflowed the header between 1024 and 1099px. | The menu button is used below 1100px. From 1100 to 1279px the desktop navigation runs tighter, full spacing from 1280px. |
| L2 | A German blog headline with "Mehrfamilienhaus" overflowed a 360px phone. | Headings hyphenate automatically on phones (under 640px), manual hyphenation above. |
| L3 | Every German and French page checked at 360, 390, 768, 1024, 1100, 1180, 1280 and 1440px. | No overflow, no console errors. |

Budget check: total JavaScript on the page is script.js at under 10 KB. No third-party script above the fold. Calendly loads on click. The Three.js scenes are not on any page by default. Fonts: Google Fonts Inter, loaded without blocking, with system-ui fallback.

## Second round, 5 Nov (Felix: fancier hero, hover on every image, no chips)

| # | Change | Check |
| --- | --- | --- |
| R1 | Hero is now a 16 s story loop: building draws in, sensors take readings, scan sweeps the floors while the chart learns the normal band and packets stream to the model node, riser B deviates, the twin localises to floors 3 to 5, reviewed with the team. CSS keyframes only, strings from the locale, status line in HTML so it stays legible on phones. Reduced motion shows the localised still frame. | Frozen at 3 s, 7.5 s, 10.5 s and 13.5 s at 1440px and at 10.5 s at 390px. All four phases render. |
| R2 | Hover system: cursor spotlight, lift and border glow on every card and media box, sheen sweep and 4.5 percent zoom on photos, sparkline redraw on the alert card. Pointer devices only. | Hover screenshots on the segment card, the install photo, the alert card and a step frame. |
| R3 | Every image on every page verified: loaded, non-zero natural size, visible box, HTTP 200 for every src, srcset candidate, video source and poster. | 184 placements, 31 pages, 2 sizes, 0 problems. Strip logos and footer wordmark made eager. |
| R4 | Automatic hyphenation split "be-fore" in the English H1 on phones. | Hyphenation limited to German headings on phones. |
| R5 | No `[TO CONFIRM]` chips on the rendered site. | grep across locales, templates and posts: none. Open items tracked in CLAIMS.md only. |

## Third round, 5 Nov (Felix: drawn install visual, sharpness, triple check)

| # | Change | Check |
| --- | --- | --- |
| T1 | The basement photo is replaced by a drawn, animated clamp-on sensor on a riser with a pressure sensor on a tap (`src/visuals.js`). Used on Home step 1 and the Product install section. | Captured at 1440 and 390. Labels hidden in the small step frame. |
| T2 | Product localisation: the 720p render video is replaced by the vector digital twin (still variant of the hero drawing). Home step 4 uses the same. | Callout fully visible, sharp at 2x. |
| T3 | Product machine learning: the dashboard screenshot re-extracted from the original 3024px capture, cropped to the building, no UI chrome or cursor, portrait box, 1500px and 900px variants. | Captured at 1440 and 390. |
| T4 | Data centres: pipe render replaced by a drawn rack row on a cooling loop with per-rack sensing and one pressure drop. | Captured at 1440. |
| T5 | Performance: step-frame drawings are static, and every animated visual pauses while off-screen. | Home 100 twice (blocking time 40 to 50 ms), Product 100, Data centres 100, de and fr 99. |
| T6 | Link crawl: every internal href, src, srcset, poster, hreflang and canonical target. | 31 pages, 944 references, 0 broken, 0 console errors. |
| T7 | Images: every placement loaded, visible, HTTP 200. | 120 placements on 21 pages at 2 sizes, 0 problems. |
| T8 | Overflow sweep on the pages with new visuals at 360, 390, 768, 1024, 1100, 1440 and 1920. | 0 overflow. |

## Open items that the reviews cannot close

See CLAIMS.md section 2, "Confirm before merge". The six items from the master prompt, Part 1, plus the ones the builder added: alert channels, pipe materials, battery sensors, pricing statement, data-sharing statement, product screenshot approval, founders' meeting link, contact-form destination, legal address.
