# SEO.md

Search and AI-search plan for aquashieldai.com. English first, German and French follow the same map.

## 1. Keywords and intent

| Page | Primary keyword (en) | Intent | Secondary |
| --- | --- | --- | --- |
| Home | AI leak detection for buildings | Commercial, navigational | water leak detection system commercial buildings, leak detection sensors buildings |
| Product | non-invasive leak detection sensors | Informational | clamp-on ultrasonic flow sensor leak detection, pipe leak localisation building, digital twin plumbing |
| Real estate | leak detection for real estate portfolios | Commercial | water damage prevention apartment buildings, water leak detection for property management, riser leak detection |
| Insurance | water damage claim severity | Commercial, B2B | property insurance leak detection data, water claim prevention insurers |
| Data centres | data center liquid cooling leak detection | Commercial | cooling loop leak detection, rack leak detection liquid cooling |
| Team | AquaShield founders | Navigational | |
| Blog | hidden water leak apartment building | Informational | how long does it take to find a water leak, smart water meter vs leak detection |

German (de):

| Page | Primary | Secondary |
| --- | --- | --- |
| Home | KI Leckageerkennung Gebäude | Leckage Erkennung Sensor, Wasserschaden Prävention Immobilien |
| Product | Leckageortung Gebäude | Ultraschall Durchflusssensor Leckage, nicht-invasive Leckageerkennung |
| Immobilien | Leitungswasserschaden vermeiden Wohnungsbestand | Wasserschaden Prävention Immobilien, Leckageerkennung Wohnungswirtschaft |
| Versicherungen | Leitungswasserschäden Schadenhöhe senken | Leckageerkennung Versicherung Daten |
| Rechenzentren | Leckageerkennung Flüssigkühlung Rechenzentrum | Kühlkreislauf Leckage Sensor |

French (fr):

| Page | Primary | Secondary |
| --- | --- | --- |
| Home | détection de fuites d'eau bâtiment | capteur de fuite non invasif, IA détection fuite |
| Produit | localisation de fuite bâtiment | capteur ultrasonique débit fuite |
| Immobilier | prévention dégâts des eaux immobilier | détection fuite immeuble résidentiel |
| Assurance | sinistre dégât des eaux sévérité | données risque dégâts des eaux assureur |
| Centres de données | détection fuite refroidissement liquide centre de données | |

## 2. URL map

| Page | en | de | fr |
| --- | --- | --- | --- |
| Home | / | /de/ | /fr/ |
| Product | /product/ | /de/produkt/ | /fr/produit/ |
| Real estate | /real-estate/ | /de/immobilien/ | /fr/immobilier/ |
| Insurance | /insurance/ | /de/versicherungen/ | /fr/assurance/ |
| Data centres | /data-centers/ | /de/rechenzentren/ | /fr/centres-de-donnees/ |
| Team | /team/ | /de/team/ | /fr/equipe/ |
| Blog | /blog/ | /de/blog/ | /fr/blog/ |
| Post 1 | /blog/why-hidden-leaks-take-so-long/ | /de/blog/warum-versteckte-lecks-so-lange-unentdeckt-bleiben/ | /fr/blog/pourquoi-les-fuites-cachees-restent-si-longtemps-invisibles/ |
| Book a call | /book-a-call/ | /de/gespraech-buchen/ | /fr/reserver-un-appel/ |
| Imprint | /imprint/ | /de/impressum/ | /fr/mentions-legales/ |
| Privacy | /privacy-policy.html (existing, untouched) | same | same |
| 404 | /404.html | /de/404.html | /fr/404.html |

Clean URLs use folder plus index.html, which GitHub Pages serves without a build. Old URLs /privacy-policy.html and /terms.html stay as they are.

## 3. Titles and meta descriptions (en)

| Page | Title (chars) | Meta description |
| --- | --- | --- |
| Home | AquaShield: AI leak detection for buildings (44) | AquaShield detects and localises leaks in complex pipe networks using non-invasive sensors and AI. Clamp-on, no pipe cutting, riser-level localisation. |
| Product | How AquaShield works: sensors, AI, digital twin (47) | Clamp-on ultrasonic and pressure sensors, a model per measuring point that learns normal flow, and a digital twin that narrows a leak to a riser. |
| Real estate | Leak detection for real estate portfolios \| AquaShield (54) | AI leak detection for apartment and office portfolios. Clamp-on sensors, no pipe cutting, riser-level localisation. Live at Vonovia since March 2026. |
| Insurance | Water claim severity and risk data \| AquaShield (48) | Earlier detection shortens loss duration and cuts secondary damage. Live building data for risk scoring. Five ways for property insurers to work with AquaShield. |
| Data centres | Cooling-loop leak detection for data centres \| AquaShield (57) | Networked flow and pressure sensing per rack for liquid-cooled data centres. Catch the cooling-loop leak before the outage. Nothing live yet, first site wanted. |
| Team | Team \| AquaShield (17) | Two robotics researchers from MIT and Harvard who left robotics to fix plumbing. AquaShield detects and localises leaks in complex pipe networks using non-invasive sensors and AI. |
| Blog | Blog \| AquaShield (17) | Leak detection, water damage and building data, written by the AquaShield founders. One post every two weeks. |
| Book a call | Book a 30-min discovery call \| AquaShield (41) | Book a 30-minute call with the AquaShield founders. We check whether we can fix your water problem. No pilot form, no commitment. |

## 4. On-page rules

- One H1 per page, stating the outcome.
- Every page opens with a direct-answer paragraph under 60 words: what, for whom, outcome.
- Canonical tag on every page. hreflang en, de, fr plus x-default (en) on every page.
- OpenGraph and Twitter card per page, image `/og/og-default.png` generated from the logo (1200 × 630).
- Alt text on every image, descriptive, in the page language.
- Internal links: every blog post links to one subpage and to Book a call. Every subpage links to Product and Book a call.
- Sitemap per language: `/sitemap.xml` (index) pointing to `/sitemap-en.xml`, `/sitemap-de.xml`, `/sitemap-fr.xml`.
- `robots.txt` allows everything, names the sitemap index.
- `llms.txt` at the root.

## 5. Structured data (JSON-LD)

| Type | Where | Fields |
| --- | --- | --- |
| Organization | every page | name AquaShield, legalName AquaShield AI Inc., url, logo, sameAs [LinkedIn, Y Combinator directory [TO CONFIRM: URL]], address Zurich, contactPoint founders@aquashieldai.com, description = canonical sentence |
| WebSite | Home | name, url, inLanguage |
| Service | Home, Real estate, Insurance, Data centres | name, serviceType "AI leak detection and localisation", provider Organization, areaServed [CH, DE, US], audience per page |
| FAQPage | Product, Real estate | the page's FAQ |
| BreadcrumbList | every subpage | Home > page |
| Article | each blog post | headline, datePublished, dateModified, author Person (name, url to Team), publisher Organization, image, inLanguage |
| Person | Team (one per founder) | name, jobTitle, alumniOf, worksFor |

## 6. GEO (ChatGPT, Perplexity, Google AI Overviews)

- The canonical sentence is identical in the meta description, the Team lead, Organization.description and the first paragraph of Home.
- Every page's first paragraph is a direct answer under 60 words.
- FAQ blocks are plain question and answer HTML, also in FAQPage JSON-LD.
- Facts carry source and date inline (NAIOP, GDV, "since March 2026").
- Author pages: Team page sections with ids `#paul-beckers`, `#marguerite-benoist`, `#tim-baumeister`, each with Person JSON-LD. Blog posts link their author there.
- Entity facts (founders, offices, founding, backing) identical across site, LinkedIn and the Y Combinator directory. [TO CONFIRM: check LinkedIn and YC directory text, Felix]

### llms.txt draft

```
# AquaShield

> AquaShield detects and localises leaks in complex pipe networks using non-invasive sensors and AI.

AquaShield (legal entity AquaShield AI Inc., Zurich HQ at Technoparkstrasse 1, 8005 Zurich, and San Francisco) builds clamp-on ultrasonic and pressure sensors, a model per measuring point that learns a building's normal flow in 10-minute steps, and a digital twin that narrows a leak to a riser or a building section. Alerts are reviewed with the maintenance team. Founded by robotics researchers Paul Beckers (CEO) and Marguerite Benoist (CTO) with Tim Baumeister (customers and operations). Y Combinator, spring 2026. Developed with MIT Facilities. Live at Vonovia since March 2026 (22 buildings, 32 measuring points), Prime Residential and Panoramic Interests in California.

## Pages
- [Home](https://aquashieldai.com/): what AquaShield does and who it is for
- [Product](https://aquashieldai.com/product/): sensors, machine learning, digital twin, FAQ
- [Real estate](https://aquashieldai.com/real-estate/): portfolios, pilot facts, one-claim anchor
- [Insurance](https://aquashieldai.com/insurance/): claim severity, risk data, five ways to work together
- [Data centres](https://aquashieldai.com/data-centers/): liquid cooling, per-rack sensing
- [Team](https://aquashieldai.com/team/): founders and offices
- [Blog](https://aquashieldai.com/blog/)
- [Book a call](https://aquashieldai.com/book-a-call/)

## Facts
- Install: under 15 minutes per sensor, no pipe cutting, non-invasive
- Localisation: to the riser or building section, not the pipe segment
- No accuracy figures published yet
- Languages: English, German (/de/), French (/fr/)
```

## 7. Measurement

- Google Search Console for aquashieldai.com, with the three language folders as filters. [TO CONFIRM: who owns the property, Felix]
- Cookieless analytics (Plausible or Umami), UTM on every LinkedIn post: `utm_source=linkedin&utm_medium=social&utm_campaign=<post-slug>`. Script slot is in the layout, commented out until the tool is chosen. [TO CONFIRM: tool and approval, Felix. The repo rule bans new third-party scripts without agreement.]
- Monthly log below.

### Monthly log

| Month | Rankings (top queries) | AI-search check: "best leak detection for real estate portfolios" | Notes |
| --- | --- | --- | --- |
| 2026-11 | not live | ChatGPT: [ ] Perplexity: [ ] | Site not yet launched |
