#!/usr/bin/env node
/*
  AquaShield site builder. No dependencies. Run: node build.js

  Reads  locales/<lang>.json   (every string on the site)
         data/sites.json       (live-counter inputs)
         src/layout.html       (page shell)
         src/pages/*.html      (one template per page)
         src/partials/*.html   (shared pieces)
         content/blog/<lang>/*.md (blog posts)
  Writes the static pages into the repo root (en), /de/ and /fr/.

  Template syntax
    {{path.to.string}}            escaped text
    {{{path.to.html}}}            raw HTML
    {{> partialName}}             include src/partials/partialName.html
    {{#each path}} ... {{/each}}  loop, inside use {{this}} or {{field}} and {{@index}}
    {{#if path}} ... {{/if}}      truthy test, {{#unless path}} ... {{/unless}} the inverse
*/

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PREVIEW = process.argv.includes("--preview");
const OUT = PREVIEW ? path.join(ROOT, "preview") : ROOT;
const SITE_URL = "https://aquashieldai.com";
const LANGS = ["en", "de", "fr"];
const DEFAULT_LANG = "en";

// Route table: page key -> slug per language. Empty string = language root.
const ROUTES = {
  home: { en: "", de: "", fr: "" },
  product: { en: "product", de: "produkt", fr: "produit" },
  "real-estate": { en: "real-estate", de: "immobilien", fr: "immobilier" },
  insurance: { en: "insurance", de: "versicherungen", fr: "assurance" },
  "data-centers": { en: "data-centers", de: "rechenzentren", fr: "centres-de-donnees" },
  team: { en: "team", de: "team", fr: "equipe" },
  blog: { en: "blog", de: "blog", fr: "blog" },
  "book-a-call": { en: "book-a-call", de: "gespraech-buchen", fr: "reserver-un-appel" },
  imprint: { en: "imprint", de: "impressum", fr: "mentions-legales" },
  "404": { en: "404", de: "404", fr: "404" }
};

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// [TO CONFIRM: ...] markers become visible amber chips in the draft.
function markConfirm(html) {
  return html.replace(/\[TO CONFIRM:?\s*([^\]]*)\]/g, (_, what) => `<mark class="to-confirm">To confirm${what ? ": " + what.trim() : ""}</mark>`);
}

function lookup(ctxStack, keyPath) {
  if (keyPath === ".") keyPath = "this";
  if (keyPath === "@index") {
    for (let i = ctxStack.length - 1; i >= 0; i--) {
      if (ctxStack[i] && typeof ctxStack[i] === "object" && "@index" in ctxStack[i]) return ctxStack[i]["@index"];
    }
    return undefined;
  }
  const parts = keyPath.split(".");
  for (let i = ctxStack.length - 1; i >= 0; i--) {
    let cur = ctxStack[i];
    let ok = true;
    for (const part of parts) {
      if (cur !== null && typeof cur === "object" && part in cur) cur = cur[part];
      else { ok = false; break; }
    }
    if (ok) return cur;
  }
  return undefined;
}

const partialCache = {};
function partial(name) {
  if (!partialCache[name]) partialCache[name] = read(`src/partials/${name}.html`);
  return partialCache[name];
}

function render(template, ctxStack, trace) {
  let out = "";
  let i = 0;
  const re = /\{\{(\{?)\s*(#each|#if|#unless|>)?\s*([^}\s]+)\s*\}?\}\}/g;
  let m;
  while ((m = re.exec(template)) !== null) {
    out += template.slice(i, m.index);
    const raw = m[1] === "{";
    const op = m[2];
    const key = m[3];
    if (op === ">") {
      out += render(partial(key), ctxStack, trace);
      i = re.lastIndex;
      continue;
    }
    if (op === "#each" || op === "#if" || op === "#unless") {
      const closeTag = op === "#each" ? "{{/each}}" : op === "#if" ? "{{/if}}" : "{{/unless}}";
      const openTagRe = op === "#each" ? /\{\{#each\s/g : op === "#if" ? /\{\{#if\s/g : /\{\{#unless\s/g;
      // find matching close, honouring nesting of the same block type
      let depth = 1;
      let pos = re.lastIndex;
      let bodyEnd = -1;
      while (depth > 0) {
        const nextClose = template.indexOf(closeTag, pos);
        if (nextClose === -1) throw new Error(`Unclosed ${op} ${key} in ${trace}`);
        openTagRe.lastIndex = pos;
        const nextOpen = openTagRe.exec(template);
        if (nextOpen && nextOpen.index < nextClose) {
          depth++;
          pos = nextOpen.index + 1;
        } else {
          depth--;
          if (depth === 0) bodyEnd = nextClose;
          pos = nextClose + closeTag.length;
        }
      }
      const body = template.slice(re.lastIndex, bodyEnd);
      const value = lookup(ctxStack, key);
      if (op === "#each") {
        if (Array.isArray(value)) {
          value.forEach((item, idx) => {
            const scoped = item !== null && typeof item === "object" && !Array.isArray(item)
              ? { ...item, this: item, "@index": idx }
              : { this: item, "@index": idx };
            out += render(body, ctxStack.concat([scoped]), trace);
          });
        }
      } else {
        const truthy = Array.isArray(value) ? value.length > 0 : Boolean(value);
        if ((op === "#if") === truthy) out += render(body, ctxStack, trace);
      }
      i = pos;
      re.lastIndex = pos;
      continue;
    }
    const value = lookup(ctxStack, key);
    if (value === undefined) {
      missing.add(`${trace}: ${key}`);
    } else if (value !== null) {
      out += raw ? String(value) : markConfirm(escapeHtml(value));
    }
    i = re.lastIndex;
  }
  out += template.slice(i);
  return out;
}

const missing = new Set();

// --- Minimal Markdown for blog posts -----------------------------------
function inlineMd(text) {
  return markConfirm(escapeHtml(text))
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let para = [];
  let list = null;
  const flushPara = () => {
    if (para.length) { html += `<p>${inlineMd(para.join(" "))}</p>\n`; para = []; }
  };
  const flushList = () => {
    if (list) { html += `<${list.type}>\n${list.items.map((t) => `<li>${inlineMd(t)}</li>`).join("\n")}\n</${list.type}>\n`; list = null; }
  };
  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    const ul = line.match(/^[-*]\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      const level = h[1].length;
      html += `<h${level}>${inlineMd(h[2])}</h${level}>\n`;
    } else if (ol || ul) {
      flushPara();
      const type = ol ? "ol" : "ul";
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      list.items.push((ol || ul)[1]);
    } else if (line.trim() === "") {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara(); flushList();
  return html;
}

function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  m[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
  });
  return { meta, body: m[2] };
}

// --- Hero building SVG lives in src/hero.js ---------------------------
const heroBuildingSvg = require("./src/hero.js");
const visuals = require("./src/visuals.js");

// --- Counter numbers computed at build time (the browser keeps them ticking) --
function counterSnapshot(sites) {
  const now = Date.now();
  let buildings = 0, points = 0, readings = 0;
  sites.sites.forEach((s) => {
    buildings += s.buildings;
    points += s.points;
    const days = Math.max(0, (now - Date.parse(s.liveSince)) / 86400000);
    readings += s.points * 144 * days;
  });
  return { buildings, points, readings: Math.floor(readings), leaks: sites.leaksFound };
}

function formatNumber(n, lang) {
  return new Intl.NumberFormat(lang === "de" ? "de-DE" : lang === "fr" ? "fr-CH" : "en-US").format(n);
}

// --- JSON-LD -----------------------------------------------------------
function organizationLd(t) {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "AquaShield",
    legalName: "AquaShield AI Inc.",
    url: SITE_URL + "/",
    logo: `${SITE_URL}/assets/img/logo-mark.png`,
    description: t.canonical,
    email: "founders@aquashieldai.com",
    sameAs: ["https://www.linkedin.com/company/aquashieldinc/"],
    address: { "@type": "PostalAddress", streetAddress: "Technoparkstrasse 1", postalCode: "8005", addressLocality: "Zürich", addressCountry: "CH" }
  };
}

function jsonLdFor(pageKey, t, lang, url, extra) {
  const graph = [organizationLd(t)];
  const name = t.pages[pageKey] ? t.pages[pageKey].title : "AquaShield";
  if (pageKey === "home") {
    graph.push({ "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL + "/", name: "AquaShield", inLanguage: lang, publisher: { "@id": `${SITE_URL}/#organization` } });
  }
  if (["home", "real-estate", "insurance", "data-centers"].includes(pageKey)) {
    graph.push({ "@type": "Service", name: t.service.name, serviceType: t.service.type, description: t.canonical, provider: { "@id": `${SITE_URL}/#organization` }, areaServed: ["CH", "DE", "US"], url });
  }
  if (pageKey !== "home" && pageKey !== "404") {
    graph.push({ "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: `${SITE_URL}/${lang === DEFAULT_LANG ? "" : lang + "/"}` },
      { "@type": "ListItem", position: 2, name, item: url }
    ] });
  }
  if (extra && extra.faq && extra.faq.length) {
    graph.push({ "@type": "FAQPage", mainEntity: extra.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })) });
  }
  if (extra && extra.people) {
    extra.people.forEach((p) => graph.push({ "@type": "Person", "@id": `${url}#${p.id}`, name: p.name, jobTitle: p.role, alumniOf: p.alumni, worksFor: { "@id": `${SITE_URL}/#organization` } }));
  }
  if (extra && extra.article) {
    const a = extra.article;
    graph.push({ "@type": "Article", headline: a.title, datePublished: a.date, dateModified: a.updated || a.date, inLanguage: lang, author: { "@type": "Person", name: a.author, url: a.authorUrl }, publisher: { "@id": `${SITE_URL}/#organization` }, mainEntityOfPage: url, image: `${SITE_URL}/assets/img/og-default.png` });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

// --- Build -------------------------------------------------------------
function urlFor(pageKey, lang, slugOverride) {
  const slug = slugOverride !== undefined ? slugOverride : ROUTES[pageKey][lang];
  const prefix = lang === DEFAULT_LANG ? "" : `${lang}/`;
  if (pageKey === "404") return `/${prefix}404.html`;
  return `/${prefix}${slug ? slug + "/" : ""}`;
}

function outPathFor(pageKey, lang, slugOverride) {
  const u = urlFor(pageKey, lang, slugOverride);
  if (u.endsWith(".html")) return u.slice(1);
  return `${u.slice(1)}index.html`;
}

function writeOut(rel, content) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  written.push(rel);
}

// Preview mode: rewrite root-relative links to relative ones so the folder
// works from file://, a subfolder or a hosted preview. index.html is appended
// to folder links.
function relativize(html, outRel) {
  const depth = outRel.split("/").length - 1;
  const prefix = depth ? "../".repeat(depth) : "./";
  const rel = (p) => {
    let target = p;
    if (target === "" || target.endsWith("/")) target += "index.html";
    if (target.includes("/?")) target = target.replace("/?", "/index.html?");
    return prefix + target;
  };
  return html
    .replace(/(href|src|poster)="\/(?!\/)([^"]*)"/g, (_, attr, p) => `${attr}="${rel(p)}"`)
    .replace(/srcset="([^"]*)"/g, (_, list) => `srcset="${list.split(",").map((c) => c.trim().replace(/^\/(?!\/)/, (m) => rel("").replace("index.html", ""))).join(", ")}"`);
}

function copyStatic() {
  const items = ["theme.css", "styles.css", "script.js", "favicon.png", "privacy-policy.html", "terms.html", "robots.txt", "llms.txt", "assets/img", "assets/video", "logos", "animations"];
  items.forEach((item) => {
    const from = path.join(ROOT, item);
    if (!fs.existsSync(from)) return;
    const to = path.join(OUT, item);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true });
  });
}

function pascal(key) {
  return key.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
}

function initials(name) {
  return name.split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso, lang) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  return new Intl.DateTimeFormat(lang === "de" ? "de-DE" : lang === "fr" ? "fr-CH" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

const written = [];
const sitemapEntries = {};

function loadPosts(lang) {
  const dir = path.join(ROOT, "content", "blog", lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
    const { meta, body } = parseFrontMatter(fs.readFileSync(path.join(dir, f), "utf8"));
    const slug = meta.slug || f.replace(/\.md$/, "");
    const html = markdownToHtml(body);
    const faq = [];
    for (let i = 1; i <= 5; i++) {
      if (meta[`faq${i}q`]) faq.push({ q: meta[`faq${i}q`], a: meta[`faq${i}a`] });
    }
    return { ...meta, slug, html, faq, words: body.split(/\s+/).length };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

// theme.css and styles.css are inlined into every page so nothing render-blocking
// is fetched. Comments and runs of whitespace are stripped.
function inlineCss() {
  return (read("theme.css") + "\n" + read("styles.css"))
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n+/g, "\n")
    .replace(/:\s+/g, ":")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .trim();
}

function build() {
  const layout = read("src/layout.html");
  const css = inlineCss();
  const sites = JSON.parse(read("data/sites.json"));
  const partners = JSON.parse(read("data/partners.json")).groups;
  const locales = {};
  LANGS.forEach((l) => { if (exists(`locales/${l}.json`)) locales[l] = JSON.parse(read(`locales/${l}.json`)); });
  const langsBuilt = Object.keys(locales);
  const posts = {};
  langsBuilt.forEach((l) => { posts[l] = loadPosts(l); });

  const pageFiles = fs.readdirSync(path.join(ROOT, "src", "pages")).filter((f) => f.endsWith(".html"));

  langsBuilt.forEach((lang) => {
    const t = locales[lang];
    const counter = counterSnapshot(sites);
    const base = {
      ...t,
      lang,
      base: "/",
      inlineCss: css,
      site: { url: SITE_URL, year: new Date().getFullYear(), buildDate: new Date().toISOString().slice(0, 10) },
      root: lang === DEFAULT_LANG ? "/" : `/${lang}/`,
      urls: Object.fromEntries(Object.keys(ROUTES).map((k) => [k, urlFor(k, lang)])),
      counter: { ...t.counter, perDayLabel: t.counter.perDay, perDay: formatNumber(counter.points * 144, lang), buildings: formatNumber(counter.buildings, lang), points: formatNumber(counter.points, lang), readings: formatNumber(counter.readings, lang), leaks: formatNumber(counter.leaks, lang) },
      sitesJson: JSON.stringify({ leaksFound: sites.leaksFound, sites: sites.sites.map((s) => ({ buildings: s.buildings, points: s.points, liveSince: s.liveSince })) }),
      heroBuilding: heroBuildingSvg(t),
      twinSvg: heroBuildingSvg(t, { twin: true }),
      installSvg: visuals.installSvg(t),
      installSvgCompact: visuals.installSvg(t, { compact: true }),
      rackSvg: visuals.rackSvg(t),
      mlSvg: visuals.mlSvg(t),
      severitySvg: visuals.severitySvg(t),
      posts: posts[lang].map((p) => ({ ...p, url: urlFor("blog", lang) + p.slug + "/", date: formatDate(p.date, lang), updated: p.updated && p.updated !== p.date ? formatDate(p.updated, lang) : "" })),
      sitesList: sites.sites,
      logoGroups: partners.map((g) => ({ key: g.key, label: t.logos[g.key], items: g.items.map((it) => ({ ...it, name: t.logos[it.key] || it.name })) })),
      team: { ...t.team, people: t.team.people.map((p) => ({ ...p, initials: initials(p.name) })) }
    };

    const CTA_KEY = { "real-estate": "realEstate", insurance: "insurance", "data-centers": "dataCenters" };

    const renderPage = (pageKey, templateName, pageVars, extraLd, slugOverride) => {
      const url = SITE_URL + urlFor(pageKey, lang, slugOverride);
      const altLangs = pageVars.altLangs || langsBuilt;
      const alternates = langsBuilt.filter((l) => altLangs.includes(l)).map((l) => {
        const slug = slugOverride !== undefined ? (pageVars.altSlugs ? pageVars.altSlugs[l] : slugOverride) : undefined;
        const u = urlFor(pageKey, l, slug);
        return { lang: l, code: l.toUpperCase(), url: SITE_URL + u, href: u, name: locales[l].meta.langName, current: l === lang };
      });
      const pageMeta = t.pages[pageKey] || {};
      const ctaKey = CTA_KEY[pageKey] || "home";
      const section = t[camel(pageKey)] || {};
      const ctx = {
        ...base,
        page: {
          key: pageKey,
          url,
          ...pageMeta,
          ctaLine: t.cta[ctaKey],
          ctaTitle: t.cta.titles[ctaKey],
          ctaQuery: ctaKey === "home" ? "" : `?for=${pageKey}`,
          faqTitle: section.faqTitle || "",
          faq: section.faq || [],
          ["is" + pascal(pageKey)]: true,
          ...pageVars
        },
        alternates,
        xDefault: (pageVars.altLangs && !pageVars.altLangs.includes(DEFAULT_LANG)) ? url : SITE_URL + urlFor(pageKey, DEFAULT_LANG, slugOverride !== undefined && pageVars.altSlugs ? pageVars.altSlugs[DEFAULT_LANG] : slugOverride),
        jsonLd: jsonLdFor(pageKey, t, lang, url, extraLd)
      };
      const trace = `${lang}/${pageKey}${slugOverride ? "/" + slugOverride : ""}`;
      const content = render(read(`src/pages/${templateName}.html`), [ctx], trace);
      let html = render(layout, [{ ...ctx, content }], trace);
      const outRel = outPathFor(pageKey, lang, slugOverride);
      if (PREVIEW) html = relativize(html, outRel);
      writeOut(outRel, html);
      if (pageKey !== "404") {
        sitemapEntries[lang] = sitemapEntries[lang] || [];
        sitemapEntries[lang].push({ url, alternates });
      }
    };

    pageFiles.forEach((file) => {
      const key = file.replace(/\.html$/, "");
      if (key === "blog-post") return;
      if (!ROUTES[key]) throw new Error(`No route for page ${key}`);
      const extra = {};
      if (t[camel(key)] && t[camel(key)].faq) extra.faq = t[camel(key)].faq;
      if (key === "team") extra.people = t.team.people;
      renderPage(key, key, {}, extra);
    });

    // blog posts
    posts[lang].forEach((post) => {
      const altSlugs = {};
      const altLangs = [];
      langsBuilt.forEach((l) => {
        const match = posts[l].find((p) => p.id === post.id);
        if (match) { altSlugs[l] = `${ROUTES.blog[l]}/${match.slug}`; altLangs.push(l); }
      });
      const postView = base.posts.find((p) => p.slug === post.slug);
      renderPage("blog", "blog-post", { post: postView, title: post.title, description: post.description, altSlugs, altLangs, isPost: true, faq: [] }, { faq: post.faq, article: { ...post, authorUrl: SITE_URL + urlFor("team", lang) + "#" + post.authorId } }, altSlugs[lang]);
    });
  });

  // sitemaps
  const sitemapIndex = langsBuilt.map((l) => `  <sitemap><loc>${SITE_URL}/sitemap-${l}.xml</loc></sitemap>`).join("\n");
  writeOut("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapIndex}\n</sitemapindex>\n`);
  langsBuilt.forEach((l) => {
    const urls = (sitemapEntries[l] || []).map((e) => {
      const alts = e.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`).join("\n");
      return `  <url>\n    <loc>${e.url}</loc>\n${alts}\n  </url>`;
    }).join("\n");
    writeOut(`sitemap-${l}.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
  });

  if (PREVIEW) copyStatic();
  if (missing.size) {
    console.warn("Missing strings:\n  " + Array.from(missing).join("\n  "));
  }
  console.log(`Built ${written.length} files for ${langsBuilt.join(", ")}${PREVIEW ? " into preview/" : ""}.`);
}

function camel(key) {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

build();
