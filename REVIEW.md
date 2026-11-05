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

## Open items that the reviews cannot close

See CLAIMS.md section 2, "Confirm before merge". The six items from the master prompt, Part 1, plus the ones the builder added: alert channels, pipe materials, battery sensors, pricing statement, data-sharing statement, product screenshot approval, founders' meeting link, contact-form destination, legal address.
