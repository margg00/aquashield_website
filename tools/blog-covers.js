#!/usr/bin/env node
/*
  Blog cover art. Run by hand, NOT part of the build:

    NODE_PATH=$(npm root -g) node tools/blog-covers.js            all covers
    NODE_PATH=$(npm root -g) node tools/blog-covers.js digital-twin   one cover (by post id)

  For every English post in content/blog/en it renders an SVG composition in
  headless Chromium (global Playwright) and writes
    assets/img/blog/<slug>.webp      1600 x 900
    assets/img/blog/<slug>-800.webp   800 x 450
    assets/img/blog/<slug>-og.jpg    1200 x 630 (social cards)
  Encoding uses Python Pillow (python3 -I). Translations reuse the English
  cover through their shared `id` (see build.js).

  Art rules: no text, no logos, no people, nothing that identifies a real
  building or customer. One subject per post, site palette, lots of air.
*/

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "assets", "img", "blog");
const W = 1600;
const H = 900;

const C = {
  accent: "#38b6ff",
  bright: "#00f0ff",
  light: "#b6deef",
  anomaly: "#ff6b4a",
  ink: "#05080b"
};

// Deterministic random so re-runs give the same image.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => Math.round(n * 10) / 10;
const pts = (list) => list.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const smoothPath = (list) => {
  // Catmull-Rom to cubic Bezier
  let d = `M${f(list[0][0])},${f(list[0][1])}`;
  for (let i = 0; i < list.length - 1; i++) {
    const p0 = list[i - 1] || list[i];
    const p1 = list[i];
    const p2 = list[i + 1];
    const p3 = list[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
};

// Shared defs: glows, grain, grid.
function defs(extra = "") {
  return `<defs>
  <filter id="g4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="g10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
  <filter id="g24" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
  <filter id="g60" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
  <filter id="g120" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="120"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0"/>
  </filter>
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="${C.light}" stroke-opacity="0.1" stroke-width="1"/>
  </pattern>
  <pattern id="gridFine" width="16" height="16" patternUnits="userSpaceOnUse">
    <path d="M16 0H0V16" fill="none" stroke="${C.light}" stroke-opacity="0.045" stroke-width="1"/>
  </pattern>
  <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.75"/>
  </radialGradient>
  ${extra}
</defs>`;
}

// Atmospheric stage: base gradient, two light pools, a grid fading out
// around the subject, then (after the subject) vignette and grain.
function stage({ fx = 1000, fy = 450, gridR = 520, tint = C.accent, tint2 = "#0e3b52", base = ["#04070a", "#081118"], subject, grid = true, grainOpacity = 0.07 }) {
  const extra = `
  <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${base[0]}"/><stop offset="1" stop-color="${base[1]}"/>
  </linearGradient>
  <radialGradient id="gridFade" cx="${fx}" cy="${fy}" r="${gridR}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#fff" stop-opacity="1"/>
    <stop offset="0.6" stop-color="#fff" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <mask id="gridMask"><rect width="${W}" height="${H}" fill="url(#gridFade)"/></mask>
  ${subject.defs || ""}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${defs(extra)}
<rect width="${W}" height="${H}" fill="url(#base)"/>
<ellipse cx="${fx}" cy="${fy}" rx="560" ry="380" fill="${tint}" opacity="0.13" filter="url(#g120)"/>
<ellipse cx="${W - fx * 0.55}" cy="${H - fy * 0.3}" rx="520" ry="300" fill="${tint2}" opacity="0.45" filter="url(#g120)"/>
${grid ? `<g mask="url(#gridMask)"><rect width="${W}" height="${H}" fill="url(#gridFine)"/><rect width="${W}" height="${H}" fill="url(#grid)"/></g>` : ""}
${subject.body}
<rect width="${W}" height="${H}" fill="url(#vignette)"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${grainOpacity}" style="mix-blend-mode:overlay"/>
</svg>`;
}

// Helper: draw something twice, once blurred underneath for glow.
const glow = (inner, blur = "g10", opacity = 0.9) => `<g filter="url(#${blur})" opacity="${opacity}">${inner}</g>${inner}`;

/* ---------------------------------------------------------------------
   Subjects, one per post id
   --------------------------------------------------------------------- */
const subjects = {};

// Hidden leaks: a cut through a wall, a concealed riser, one joint weeping.
subjects["hidden-leaks"] = () => {
  const r = rng(11);
  const px = 1010; // pipe centre
  const jy = 420; // joint
  let drops = "";
  for (let i = 0; i < 9; i++) {
    const y = jy + 46 + i * 34 + r() * 10;
    const rr = 3.2 - i * 0.22;
    drops += `<ellipse cx="${f(px + 34 + r() * 6)}" cy="${f(y)}" rx="${f(rr * 0.75)}" ry="${f(rr * 1.3)}" fill="${C.anomaly}" opacity="${f(0.85 - i * 0.08)}"/>`;
  }
  let hatch = "";
  for (let x = 640; x < 1480; x += 18) hatch += `<path d="M${x} 746 l-24 44" stroke="${C.light}" stroke-opacity="${f(0.13 * (1 - Math.abs(x - 1040) / 460))}"/>`;
  return {
    defs: `
    <linearGradient id="pipe" x1="0" x2="1"><stop offset="0" stop-color="#0a161e"/><stop offset="0.3" stop-color="#22404f"/><stop offset="0.42" stop-color="#5f8ea6"/><stop offset="0.55" stop-color="#2a4b5d"/><stop offset="1" stop-color="#060f14"/></linearGradient>
    <linearGradient id="panel" x1="0" x2="1"><stop offset="0" stop-color="#1a2630" stop-opacity="0.9"/><stop offset="1" stop-color="#0c141a" stop-opacity="0.9"/></linearGradient>
    <linearGradient id="panelFront" x1="0" x2="1"><stop offset="0" stop-color="#9fc9de" stop-opacity="0.12"/><stop offset="1" stop-color="#9fc9de" stop-opacity="0.03"/></linearGradient>
    <linearGradient id="fadeV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.18" stop-color="#fff"/><stop offset="0.85" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="fadeMask"><rect width="${W}" height="${H}" fill="url(#fadeV)"/></mask>
    <linearGradient id="slabEdge" x1="600" x2="1500" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.light}" stop-opacity="0"/><stop offset="0.5" stop-color="${C.light}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.light}" stop-opacity="0"/></linearGradient>
    <linearGradient id="slabG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fc9de" stop-opacity="0.08"/><stop offset="1" stop-color="#9fc9de" stop-opacity="0"/></linearGradient>
    <radialGradient id="stain" cx="0.5" cy="0.4" r="0.5"><stop offset="0" stop-color="${C.anomaly}" stop-opacity="0.5"/><stop offset="1" stop-color="${C.anomaly}" stop-opacity="0"/></radialGradient>`,
    body: `
    <g mask="url(#fadeMask)">
      <!-- back leaf of the wall -->
      <rect x="860" y="0" width="40" height="742" fill="url(#panel)"/>
      <rect x="900" y="0" width="1" height="742" fill="${C.light}" opacity="0.18"/>
      <!-- cavity insulation hint -->
      <g opacity="0.12" stroke="${C.light}" fill="none">${Array.from({ length: 22 }, (_, i) => `<path d="M904 ${i * 34} q12 17 0 34"/>`).join("")}</g>
      <!-- the riser -->
      <rect x="${px - 26}" y="0" width="52" height="742" fill="url(#pipe)"/>
      <rect x="${px - 9}" y="0" width="4" height="742" fill="#fff" opacity="0.1"/>
      <!-- joint -->
      <rect x="${px - 34}" y="${jy - 18}" width="68" height="36" rx="4" fill="url(#pipe)"/>
      <rect x="${px - 34}" y="${jy - 18}" width="68" height="2" fill="#fff" opacity="0.3"/>
      <rect x="${px - 30}" y="170" width="60" height="22" rx="3" fill="url(#pipe)" opacity="0.8"/>
      <rect x="${px - 30}" y="640" width="60" height="22" rx="3" fill="url(#pipe)" opacity="0.8"/>
      <!-- stain on the inner face of the front leaf -->
      <ellipse cx="1150" cy="${jy + 200}" rx="70" ry="210" fill="url(#stain)" filter="url(#g24)"/>
      <!-- front leaf, translucent so the riser shows through -->
      <rect x="1140" y="0" width="56" height="742" fill="url(#panelFront)"/>
      <rect x="1140" y="0" width="1.2" height="742" fill="${C.light}" opacity="0.35"/>
      <rect x="1196" y="0" width="1" height="742" fill="${C.light}" opacity="0.12"/>
    </g>
    <!-- weep at the joint -->
    <circle cx="${px + 30}" cy="${jy + 14}" r="60" fill="${C.anomaly}" opacity="0.35" filter="url(#g24)"/>
    <circle cx="${px + 30}" cy="${jy + 14}" r="14" fill="${C.anomaly}" opacity="0.7" filter="url(#g10)"/>
    <circle cx="${px + 30}" cy="${jy + 16}" r="4" fill="#ffd2c4"/>
    ${glow(drops, "g4", 0.8)}
    <!-- floor slab -->
    <rect x="600" y="742" width="900" height="1.5" fill="url(#slabEdge)"/>
    <g opacity="0.9">${hatch}</g>
    <rect x="600" y="744" width="900" height="70" fill="url(#slabG)"/>`
  };
};

// Flow baseline: a luminous band of normal, a live line riding inside it.
subjects["flow-baseline"] = () => {
  const r = rng(5);
  const day = (x) => {
    const t = (x / 560) * Math.PI * 2;
    return Math.sin(t - 1.2) * 0.55 + Math.sin(2 * t + 0.4) * 0.28 + Math.sin(3 * t) * 0.08;
  };
  const band = (y0, amp, width, xOffset = 0) => {
    const top = [];
    const bot = [];
    const mid = [];
    for (let x = -40; x <= W + 40; x += 40) {
      const y = y0 - day(x + xOffset) * amp;
      const w = width * (0.75 + 0.35 * (0.5 + 0.5 * Math.sin((x + xOffset) / 260)));
      top.push([x, y - w]);
      bot.push([x, y + w]);
      mid.push([x, y]);
    }
    return { top, bot, mid };
  };
  const ribbon = (b) => smoothPath(b.top) + " L" + smoothPath(b.bot.slice().reverse()).slice(1) + " Z";
  const back2 = band(300, 70, 26, 300);
  const back1 = band(380, 100, 34, 140);
  const front = band(500, 150, 46, 0);
  const live = front.mid.map(([x, y]) => [x, y + (r() - 0.5) * 22]);
  const liveSmall = [];
  for (let x = -40; x <= 1240; x += 14) {
    const y = 500 - day(x) * 150;
    liveSmall.push([x, y + Math.sin(x / 9) * 4 + (r() - 0.5) * 12]);
  }
  const end = liveSmall[liveSmall.length - 1];
  return {
    defs: `
    <linearGradient id="bandG" x1="0" x2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset="0.25" stop-color="${C.accent}" stop-opacity="0.22"/><stop offset="0.8" stop-color="${C.bright}" stop-opacity="0.26"/><stop offset="1" stop-color="${C.bright}" stop-opacity="0.05"/></linearGradient>
    <linearGradient id="lineG" x1="0" x2="1"><stop offset="0" stop-color="${C.light}" stop-opacity="0"/><stop offset="0.2" stop-color="${C.light}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`,
    body: `
    <path d="${ribbon(back2)}" fill="url(#bandG)" opacity="0.35" filter="url(#g10)"/>
    <path d="${ribbon(back1)}" fill="url(#bandG)" opacity="0.5" filter="url(#g4)"/>
    <path d="${ribbon(front)}" fill="url(#bandG)" filter="url(#g24)" opacity="0.9"/>
    <path d="${ribbon(front)}" fill="url(#bandG)" opacity="0.8"/>
    <path d="${smoothPath(front.top)}" fill="none" stroke="${C.accent}" stroke-opacity="0.35" stroke-width="1"/>
    <path d="${smoothPath(front.bot)}" fill="none" stroke="${C.accent}" stroke-opacity="0.35" stroke-width="1"/>
    ${glow(`<path d="${smoothPath(liveSmall)}" fill="none" stroke="url(#lineG)" stroke-width="2.4" stroke-linejoin="round"/>`, "g10", 1)}
    <circle cx="${f(end[0])}" cy="${f(end[1])}" r="40" fill="${C.bright}" opacity="0.35" filter="url(#g24)"/>
    <circle cx="${f(end[0])}" cy="${f(end[1])}" r="6" fill="#fff"/>
    <line x1="${f(end[0])}" y1="120" x2="${f(end[0])}" y2="780" stroke="${C.light}" stroke-opacity="0.12" stroke-dasharray="2 6"/>`
  };
};

// Digital twin: an isometric wireframe building with glowing risers.
subjects["digital-twin"] = () => {
  const s = 1.1;
  const cx = 860;
  const cy = 575;
  const iso = (x, y, z) => [cx + (x - y) * 0.866 * s, cy + (x + y) * 0.5 * s - z * s];
  const bw = 300;
  const bd = 200;
  const fh = 62;
  const floors = 7;
  let plates = "";
  for (let k = 0; k <= floors; k++) {
    const z = k * fh;
    const p = [iso(0, 0, z), iso(bw, 0, z), iso(bw, bd, z), iso(0, bd, z)];
    const op = k === floors ? 0.5 : 0.18 + 0.02 * k;
    plates += `<polygon points="${pts(p)}" fill="${C.accent}" fill-opacity="${k === 0 ? 0.08 : 0.025}" stroke="${C.light}" stroke-opacity="${op}" stroke-width="1"/>`;
    if (k < floors) {
      // interior wall lines per floor
      const a = iso(bw * 0.5, 0, z);
      const b = iso(bw * 0.5, bd, z);
      plates += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${C.light}" stroke-opacity="0.07"/>`;
    }
  }
  let edges = "";
  [[0, 0], [bw, 0], [bw, bd], [0, bd]].forEach(([x, y], i) => {
    const a = iso(x, y, 0);
    const b = iso(x, y, floors * fh);
    edges += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${C.light}" stroke-opacity="${i === 3 ? 0.12 : 0.4}"/>`;
  });
  const risers = [[70, 60], [170, 120], [250, 50]];
  let rs = "";
  let nodes = "";
  let branches = "";
  risers.forEach(([x, y], ri) => {
    const a = iso(x, y, -40);
    const b = iso(x, y, floors * fh - 10);
    rs += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${ri === 1 ? C.bright : C.accent}" stroke-width="${ri === 1 ? 3 : 2.2}" stroke-linecap="round"/>`;
    for (let k = 0; k < floors; k++) {
      const n = iso(x, y, k * fh + fh * 0.5);
      const bEnd = iso(x + (ri === 2 ? -40 : 40), y, k * fh + fh * 0.5);
      branches += `<line x1="${f(n[0])}" y1="${f(n[1])}" x2="${f(bEnd[0])}" y2="${f(bEnd[1])}" stroke="${C.accent}" stroke-opacity="0.45" stroke-width="1.2"/>`;
      if (k % 2 === 1 || ri === 1) nodes += `<circle cx="${f(n[0])}" cy="${f(n[1])}" r="${ri === 1 ? 4 : 3}" fill="${ri === 1 ? "#fff" : C.light}"/>`;
    }
  });
  // main supply in the basement
  const m1 = iso(-60, 60, -40);
  const m2 = iso(70, 60, -40);
  const m3 = iso(170, 120, -40);
  const m4 = iso(250, 50, -40);
  const supply = `<polyline points="${pts([m1, m2, iso(170, 60, -40), m3])}" fill="none" stroke="${C.accent}" stroke-width="2" stroke-opacity="0.8"/><polyline points="${pts([iso(170, 60, -40), iso(250, 60, -40), m4])}" fill="none" stroke="${C.accent}" stroke-width="2" stroke-opacity="0.8"/>`;
  // ground grid in iso
  let ground = "";
  for (let i = -6; i <= 12; i++) {
    const a = iso(i * 50, -300, -40);
    const b = iso(i * 50, 600, -40);
    const c = iso(-300, i * 50, -40);
    const d = iso(600, i * 50, -40);
    ground += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/><line x1="${f(c[0])}" y1="${f(c[1])}" x2="${f(d[0])}" y2="${f(d[1])}"/>`;
  }
  const hot = iso(170, 120, 4 * fh + fh * 0.5);
  return {
    defs: `
    <radialGradient id="groundFade" cx="${cx}" cy="${cy + 60}" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="groundMask"><rect width="${W}" height="${H}" fill="url(#groundFade)"/></mask>`,
    body: `
    <g mask="url(#groundMask)" stroke="${C.light}" stroke-opacity="0.08">${ground}</g>
    <ellipse cx="${cx}" cy="${cy - 260}" rx="260" ry="320" fill="${C.accent}" opacity="0.12" filter="url(#g60)"/>
    ${plates}${edges}
    ${branches}
    ${glow(rs + supply, "g10", 1)}
    ${nodes}
    <circle cx="${f(hot[0])}" cy="${f(hot[1])}" r="34" fill="${C.bright}" opacity="0.45" filter="url(#g24)"/>
    <circle cx="${f(hot[0])}" cy="${f(hot[1])}" r="7" fill="#fff"/>
    <circle cx="${f(hot[0])}" cy="${f(hot[1])}" r="18" fill="none" stroke="${C.bright}" stroke-opacity="0.6"/>`
  };
};

// Smart meters vs leak detection: a still dial next to a living waveform.
subjects["meters-vs-detection"] = () => {
  const dx = 470;
  const dy = 450;
  const R = 190;
  let ticks = "";
  for (let i = 0; i <= 40; i++) {
    const a = (-225 + (i * 270) / 40) * (Math.PI / 180);
    const len = i % 5 === 0 ? 18 : 8;
    const r1 = R - 26;
    const r2 = r1 - len;
    ticks += `<line x1="${f(dx + Math.cos(a) * r1)}" y1="${f(dy + Math.sin(a) * r1)}" x2="${f(dx + Math.cos(a) * r2)}" y2="${f(dy + Math.sin(a) * r2)}" stroke="${C.light}" stroke-opacity="${i % 5 === 0 ? 0.55 : 0.25}" stroke-width="${i % 5 === 0 ? 2 : 1}"/>`;
  }
  const na = (-225 + 270 * 0.32) * (Math.PI / 180);
  const needle = `<line x1="${dx}" y1="${dy}" x2="${f(dx + Math.cos(na) * (R - 60))}" y2="${f(dy + Math.sin(na) * (R - 60))}" stroke="${C.light}" stroke-width="3" stroke-linecap="round"/>`;
  // living waveform: several phase-shifted traces that leave the dial
  const traces = [];
  for (let k = 0; k < 5; k++) {
    const list = [];
    for (let x = dx + R + 10; x <= W + 20; x += 10) {
      const t = (x - dx - R) / (W - dx - R);
      const env = Math.min(1, t * 3.2) * (1 - t * 0.25);
      const y = dy + env * (Math.sin(x / 38 + k * 0.7) * 70 + Math.sin(x / 91 - k * 0.4) * 55 + Math.sin(x / 17 + k) * 10 * t);
      list.push([x, y]);
    }
    traces.push(list);
  }
  const lines = traces.map((l, k) => `<path d="${smoothPath(l)}" fill="none" stroke="${k === 2 ? "url(#waveMain)" : "url(#waveSoft)"}" stroke-width="${k === 2 ? 2.6 : 1.2}" stroke-opacity="${k === 2 ? 1 : 0.5 - Math.abs(k - 2) * 0.12}"/>`).join("");
  return {
    defs: `
    <radialGradient id="dialFace" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="#1c2a33"/><stop offset="0.7" stop-color="#0b1217"/><stop offset="1" stop-color="#070b0e"/></radialGradient>
    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.light}" stop-opacity="0.6"/><stop offset="0.5" stop-color="${C.light}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.light}" stop-opacity="0.35"/></linearGradient>
    <linearGradient id="waveMain" x1="${dx + R}" x2="${W}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset="0.15" stop-color="${C.accent}"/><stop offset="0.7" stop-color="${C.bright}"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <linearGradient id="waveSoft" x1="${dx + R}" x2="${W}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.accent}" stop-opacity="0"/><stop offset="0.3" stop-color="${C.accent}"/><stop offset="1" stop-color="${C.light}"/></linearGradient>`,
    body: `
    <ellipse cx="1120" cy="${dy}" rx="480" ry="160" fill="${C.accent}" opacity="0.16" filter="url(#g60)"/>
    <circle cx="${dx}" cy="${dy + 30}" r="${R + 30}" fill="#000" opacity="0.6" filter="url(#g24)"/>
    <circle cx="${dx}" cy="${dy}" r="${R}" fill="url(#dialFace)"/>
    <circle cx="${dx}" cy="${dy}" r="${R}" fill="none" stroke="url(#rim)" stroke-width="2"/>
    <circle cx="${dx}" cy="${dy}" r="${R - 12}" fill="none" stroke="${C.light}" stroke-opacity="0.08"/>
    ${ticks}
    <circle cx="${dx}" cy="${dy + 70}" r="26" fill="none" stroke="${C.light}" stroke-opacity="0.18"/>
    <circle cx="${dx}" cy="${dy + 70}" r="2" fill="${C.light}" opacity="0.4"/>
    ${needle}
    <circle cx="${dx}" cy="${dy}" r="9" fill="#0b1217" stroke="${C.light}" stroke-opacity="0.6"/>
    <path d="M${dx - R * 0.7} ${dy - R * 0.55} A${R} ${R} 0 0 1 ${dx + R * 0.45} ${dy - R * 0.82}" fill="none" stroke="#fff" stroke-opacity="0.12" stroke-width="10" stroke-linecap="round" filter="url(#g4)"/>
    <g filter="url(#g10)" opacity="0.9">${lines}</g>${lines}`
  };
};

// Riser-level localisation: vertical risers in depth, one segment lit.
subjects["riser-level"] = () => {
  const floorsY = [];
  for (let y = 90; y < 860; y += 92) floorsY.push(y);
  let floors = floorsY.map((y) => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${C.light}" stroke-opacity="0.06"/>`).join("");
  const risers = [
    { x: 620, w: 2, o: 0.22, blur: "g4" },
    { x: 760, w: 3, o: 0.35 },
    { x: 905, w: 5, o: 0.6 },
    { x: 1060, w: 7, o: 0.9, hot: true },
    { x: 1230, w: 4, o: 0.45 },
    { x: 1360, w: 2, o: 0.2, blur: "g4" }
  ];
  let body = "";
  risers.forEach((r) => {
    const line = `<rect x="${r.x - r.w / 2}" y="0" width="${r.w}" height="${H}" fill="url(#riserG)" opacity="${r.o}"/>`;
    body += r.blur ? `<g filter="url(#${r.blur})">${line}</g>` : line;
    floorsY.forEach((y) => {
      body += `<rect x="${r.x - r.w / 2 - 3}" y="${y - 3}" width="${r.w + 6}" height="6" rx="1.5" fill="${C.light}" opacity="${r.o * 0.5}"/>`;
    });
  });
  const hot = risers[3];
  const y1 = floorsY[3];
  const y2 = floorsY[5];
  return {
    defs: `
    <linearGradient id="riserG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.light}" stop-opacity="0"/><stop offset="0.15" stop-color="${C.light}"/><stop offset="0.85" stop-color="${C.accent}"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
    <linearGradient id="hotG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bright}" stop-opacity="0.2"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="${C.bright}" stop-opacity="0.2"/></linearGradient>`,
    body: `${floors}${body}
    <rect x="${hot.x - 150}" y="${y1}" width="300" height="${y2 - y1}" fill="${C.bright}" opacity="0.06"/>
    <line x1="${hot.x - 150}" y1="${y1}" x2="${hot.x + 150}" y2="${y1}" stroke="${C.bright}" stroke-opacity="0.35"/>
    <line x1="${hot.x - 150}" y1="${y2}" x2="${hot.x + 150}" y2="${y2}" stroke="${C.bright}" stroke-opacity="0.35"/>
    <ellipse cx="${hot.x}" cy="${(y1 + y2) / 2}" rx="90" ry="150" fill="${C.bright}" opacity="0.35" filter="url(#g60)"/>
    ${glow(`<rect x="${hot.x - 5}" y="${y1}" width="10" height="${y2 - y1}" rx="5" fill="url(#hotG)"/>`, "g24", 1)}
    <circle cx="${hot.x}" cy="${(y1 + y2) / 2 + 20}" r="5" fill="#fff"/>`
  };
};

// Install time: a pipe, a clamp and a stopwatch arc sweeping a quarter hour.
subjects["install-time"] = () => {
  const cx = 980;
  const cy = 470;
  const R = 300;
  const py = cy;
  const pr = 46;
  let ticks = "";
  for (let i = 0; i < 60; i++) {
    const a = (-90 + i * 6) * (Math.PI / 180);
    const big = i % 5 === 0;
    const r1 = R + 26;
    const r2 = r1 + (big ? 16 : 7);
    ticks += `<line x1="${f(cx + Math.cos(a) * r1)}" y1="${f(cy + Math.sin(a) * r1)}" x2="${f(cx + Math.cos(a) * r2)}" y2="${f(cy + Math.sin(a) * r2)}" stroke="${C.light}" stroke-opacity="${i <= 15 ? 0.7 : big ? 0.3 : 0.14}" stroke-width="${big ? 2 : 1}"/>`;
  }
  // sweep 0 -> 15 minutes, as fading segments
  let sweep = "";
  const n = 30;
  for (let i = 0; i < n; i++) {
    const a1 = (-90 + (i * 90) / n) * (Math.PI / 180);
    const a2 = (-90 + ((i + 1) * 90) / n + 0.3) * (Math.PI / 180);
    sweep += `<path d="M${f(cx + Math.cos(a1) * R)} ${f(cy + Math.sin(a1) * R)} A${R} ${R} 0 0 1 ${f(cx + Math.cos(a2) * R)} ${f(cy + Math.sin(a2) * R)}" fill="none" stroke="${C.bright}" stroke-width="4" stroke-opacity="${f(0.08 + (0.92 * (i + 1)) / n)}"/>`;
  }
  const ea = 0;
  const ex = cx + Math.cos(ea) * R;
  const ey = cy + Math.sin(ea) * R;
  // faint wedge
  const wedge = `<path d="M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 0 1 ${ex} ${ey} Z" fill="url(#wedgeG)"/>`;
  return {
    defs: `
    <linearGradient id="pipeH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a161d"/><stop offset="0.25" stop-color="#1f3d4e"/><stop offset="0.4" stop-color="#6c9cb5"/><stop offset="0.55" stop-color="#22404f"/><stop offset="1" stop-color="#050b0f"/></linearGradient>
    <linearGradient id="clampG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2b36"/><stop offset="0.4" stop-color="#d9f2ff"/><stop offset="0.6" stop-color="#5d8aa3"/><stop offset="1" stop-color="#0b151b"/></linearGradient>
    <linearGradient id="pipeFade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.25" stop-color="#fff"/><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="pipeMask"><rect width="${W}" height="${H}" fill="url(#pipeFade)"/></mask>
    <radialGradient id="wedgeG" cx="${cx}" cy="${cy}" r="${R}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.bright}" stop-opacity="0"/><stop offset="1" stop-color="${C.bright}" stop-opacity="0.1"/></radialGradient>`,
    body: `
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.light}" stroke-opacity="0.1" stroke-width="1"/>
    ${ticks}
    ${wedge}
    <g mask="url(#pipeMask)">
      <rect x="0" y="${py + pr - 4}" width="${W}" height="40" fill="#000" opacity="0.5" filter="url(#g24)"/>
      <rect x="0" y="${py - pr}" width="${W}" height="${pr * 2}" fill="url(#pipeH)"/>
      <rect x="0" y="${py - pr * 0.22}" width="${W}" height="2" fill="#fff" opacity="0.14"/>
    </g>
    <rect x="${cx - 70}" y="${py - pr - 30}" width="140" height="26" rx="6" fill="#0e1a21" stroke="${C.light}" stroke-opacity="0.4"/>
    <circle cx="${cx + 46}" cy="${py - pr - 17}" r="4" fill="${C.bright}"/>
    <circle cx="${cx + 46}" cy="${py - pr - 17}" r="14" fill="${C.bright}" opacity="0.5" filter="url(#g10)"/>
    <rect x="${cx - 38}" y="${py - pr - 6}" width="22" height="${pr * 2 + 12}" rx="4" fill="url(#clampG)"/>
    <rect x="${cx + 16}" y="${py - pr - 6}" width="22" height="${pr * 2 + 12}" rx="4" fill="url(#clampG)"/>
    <g filter="url(#g10)">${sweep}</g>${sweep}
    <circle cx="${f(ex)}" cy="${f(ey)}" r="36" fill="${C.bright}" opacity="0.4" filter="url(#g24)"/>
    <circle cx="${f(ex)}" cy="${f(ey)}" r="7" fill="#fff"/>
    <circle cx="${cx}" cy="${cy - R}" r="4" fill="${C.light}" opacity="0.8"/>`
  };
};

// Claim cost: a curve climbing over a faint floor plan.
subjects["claim-cost"] = () => {
  // floor plan, abstract, not a real building
  const plan = `
    <rect x="300" y="160" width="1000" height="600" />
    <path d="M300 420 H620 M620 160 V760 M620 520 H900 M900 160 V520 M1080 520 V760 M900 340 H1300 M460 420 V760" />
    <path d="M620 300 a60 60 0 0 1 60 60 M900 420 a50 50 0 0 0 -50 50 M1080 640 a50 50 0 0 1 50 -50" stroke-dasharray="3 5"/>`;
  const list = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const x = 180 + t * 1260;
    const y = 760 - (Math.pow(t, 2.6) * 560 + t * 40);
    list.push([x, y]);
  }
  const curve = smoothPath(list);
  const area = curve + ` L${list[list.length - 1][0]} 800 L${list[0][0]} 800 Z`;
  const marks = [6, 12, 18, 24].map((i) => list[i]);
  const end = list[list.length - 1];
  return {
    defs: `
    <linearGradient id="curveG" x1="180" x2="1440" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.accent}" stop-opacity="0.2"/><stop offset="0.55" stop-color="${C.accent}"/><stop offset="0.85" stop-color="#ffb199"/><stop offset="1" stop-color="${C.anomaly}"/></linearGradient>
    <linearGradient id="areaG" x1="0" y1="200" x2="0" y2="800" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.anomaly}" stop-opacity="0.22"/><stop offset="0.5" stop-color="${C.accent}" stop-opacity="0.08"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></linearGradient>
    <radialGradient id="planFade" cx="800" cy="460" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="planMask"><rect width="${W}" height="${H}" fill="url(#planFade)"/></mask>`,
    body: `
    <g mask="url(#planMask)"><g transform="translate(820 650) scale(1 0.5) rotate(45) translate(-800 -460)" fill="none" stroke="${C.light}" stroke-opacity="0.3" stroke-width="1.5" vector-effect="non-scaling-stroke">${plan}</g></g>
    <path d="${area}" fill="url(#areaG)"/>
    ${glow(`<path d="${curve}" fill="none" stroke="url(#curveG)" stroke-width="3" stroke-linecap="round"/>`, "g10", 1)}
    ${marks.map(([x, y], i) => `<line x1="${f(x)}" y1="${f(y + 14)}" x2="${f(x)}" y2="800" stroke="${C.light}" stroke-opacity="0.1" stroke-dasharray="2 6"/><circle cx="${f(x)}" cy="${f(y)}" r="${i === 3 ? 6 : 4}" fill="${i === 3 ? "#fff" : C.light}"/>`).join("")}
    <circle cx="${f(end[0])}" cy="${f(end[1])}" r="60" fill="${C.anomaly}" opacity="0.35" filter="url(#g24)"/>`
  };
};

// Insurers and building data: a shield drawn by data points.
subjects["insurer-data"] = () => {
  const r = rng(21);
  const cx = 1010;
  const top = 150;
  // Shield outline as samples: a top edge that dips slightly in the middle,
  // then two sides that curve in to the tip.
  const outline = [];
  const wHalf = 250;
  for (let i = 0; i <= 40; i++) {
    const u = (i / 40) * 2 - 1;
    outline.push([cx + u * wHalf, top + 10 + 30 * (1 - u * u)]);
  }
  const side = (sign) => {
    const list = [];
    for (let i = 1; i <= 50; i++) {
      const t = i / 50;
      list.push([cx + sign * wHalf * (1 - Math.pow(t, 2.2)), top + 10 + t * 550]);
    }
    return list;
  };
  const right = side(1);
  const left = side(-1).reverse();
  const path = [...outline, ...right, ...left];
  let dots = "";
  path.forEach(([x, y], i) => {
    const s = 1.6 + r() * 2.6;
    dots += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(s)}" fill="${i % 7 === 0 ? "#fff" : C.light}" opacity="${f(0.55 + r() * 0.45)}"/>`;
  });
  // interior field
  let field = "";
  const inside = (x, y) => {
    if (y < top + 40 || y > top + 560) return false;
    const t = (y - top - 40) / 520;
    const half = wHalf * (1 - Math.pow(t, 2.2));
    return Math.abs(x - cx) < half - 18;
  };
  for (let y = top + 60; y < top + 560; y += 22) {
    for (let x = cx - wHalf; x < cx + wHalf; x += 22) {
      if (!inside(x, y)) continue;
      const d = Math.hypot(x - cx, (y - (top + 260)) * 1.1) / 300;
      const o = Math.max(0, 0.42 - d * 0.36) * (0.4 + r() * 0.8);
      field += `<circle cx="${x}" cy="${y}" r="${f(1 + r() * 1.2)}" fill="${C.accent}" opacity="${f(o)}"/>`;
    }
  }
  // a few links from outline to field
  let links = "";
  for (let i = 0; i < 14; i++) {
    const a = path[Math.floor(r() * path.length)];
    const b = [cx + (r() - 0.5) * 260, top + 120 + r() * 340];
    if (!inside(b[0], b[1])) continue;
    links += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${C.accent}" stroke-opacity="0.12"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="2.5" fill="${C.bright}" opacity="0.8"/>`;
  }
  return {
    body: `
    <ellipse cx="${cx}" cy="${top + 300}" rx="300" ry="340" fill="${C.accent}" opacity="0.14" filter="url(#g60)"/>
    <polyline points="${pts(path)}" fill="none" stroke="${C.accent}" stroke-opacity="0.18" stroke-width="1"/>
    ${field}${links}
    <g filter="url(#g4)" opacity="0.9">${dots}</g>${dots}
    <circle cx="${cx}" cy="${top + 290}" r="40" fill="${C.bright}" opacity="0.25" filter="url(#g24)"/>
    <circle cx="${cx}" cy="${top + 290}" r="5" fill="#fff"/>`
  };
};

// Portfolio rollout: an isometric skyline, nodes lighting up one by one.
subjects["rollout"] = () => {
  const r = rng(33);
  const cx = 820;
  const cy = 560;
  const iso = (x, y, z) => [cx + (x - y) * 0.866, cy + (x + y) * 0.5 - z];
  const boxes = [];
  for (let gx = -4; gx <= 4; gx++) {
    for (let gy = -4; gy <= 4; gy++) {
      if (r() < 0.25) continue;
      const h = 30 + Math.pow(r(), 1.6) * 220 * (1 - Math.hypot(gx, gy) / 8);
      boxes.push({ x: gx * 90, y: gy * 90, h, lit: r() < 0.32 });
    }
  }
  boxes.sort((a, b) => a.x + a.y - (b.x + b.y));
  const s = 56;
  let out = "";
  const litTops = [];
  boxes.forEach((b) => {
    const { x, y, h } = b;
    const top = [iso(x, y, h), iso(x + s, y, h), iso(x + s, y + s, h), iso(x, y + s, h)];
    const left = [iso(x, y + s, 0), iso(x + s, y + s, 0), iso(x + s, y + s, h), iso(x, y + s, h)];
    const right = [iso(x + s, y, 0), iso(x + s, y + s, 0), iso(x + s, y + s, h), iso(x + s, y, h)];
    const dist = Math.hypot(b.x, b.y) / 520;
    const fade = Math.max(0.15, 1 - dist);
    out += `<g opacity="${f(fade)}"><polygon points="${pts(left)}" fill="#0d171e" stroke="${C.light}" stroke-opacity="0.12"/><polygon points="${pts(right)}" fill="#0a1218" stroke="${C.light}" stroke-opacity="0.1"/><polygon points="${pts(top)}" fill="${b.lit ? "#123044" : "#101c24"}" stroke="${C.light}" stroke-opacity="${b.lit ? 0.5 : 0.2}"/></g>`;
    if (b.lit) {
      const c = iso(x + s / 2, y + s / 2, h);
      litTops.push(c);
      out += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="22" fill="${C.bright}" opacity="${f(0.5 * fade)}" filter="url(#g10)"/><circle cx="${f(c[0])}" cy="${f(c[1])}" r="4" fill="#fff" opacity="${f(fade)}"/>`;
    }
  });
  // network arcs between lit nodes, above the skyline
  let arcs = "";
  for (let i = 0; i < litTops.length - 1; i++) {
    const a = litTops[i];
    const b = litTops[i + 1];
    const mx = (a[0] + b[0]) / 2;
    const my = Math.min(a[1], b[1]) - 60 - Math.abs(a[0] - b[0]) * 0.15;
    arcs += `<path d="M${f(a[0])} ${f(a[1])} Q${f(mx)} ${f(my)} ${f(b[0])} ${f(b[1])}" fill="none" stroke="${C.accent}" stroke-opacity="0.28" stroke-width="1.2"/>`;
  }
  // ground grid
  let ground = "";
  for (let i = -6; i <= 6; i++) {
    const a = iso(i * 90 - 20, -560, 0);
    const b = iso(i * 90 - 20, 560, 0);
    const c = iso(-560, i * 90 - 20, 0);
    const d = iso(560, i * 90 - 20, 0);
    ground += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"/><line x1="${f(c[0])}" y1="${f(c[1])}" x2="${f(d[0])}" y2="${f(d[1])}"/>`;
  }
  return {
    defs: `
    <radialGradient id="rgFade" cx="${cx}" cy="${cy}" r="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="rgMask"><rect width="${W}" height="${H}" fill="url(#rgFade)"/></mask>`,
    body: `
    <g mask="url(#rgMask)" stroke="${C.light}" stroke-opacity="0.09">${ground}</g>
    ${out}
    <g filter="url(#g4)">${arcs}</g>${arcs}`
  };
};

// Liquid cooling: one aisle in true perspective, a rack row and its coolant loop.
subjects["liquid-cooling"] = () => {
  const vx = 1080;
  const vy = 420;
  const fl = 620;
  const P = (X, Y, Z) => [vx + (X * fl) / Z, vy + (Y * fl) / Z];
  const line = (a, b, attrs) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" ${attrs}/>`;
  const quad = (list, attrs) => `<polygon points="${pts(list)}" ${attrs}/>`;
  const Xl = -1.1;
  const top = -0.8;
  const floor = 0.75;
  let floorGrid = "";
  for (let z = 1.2; z < 14; z *= 1.18) floorGrid += line(P(-3, floor, z), P(3, floor, z), "");
  for (let x = -3; x <= 3; x += 0.5) floorGrid += line(P(x, floor, 1.05), P(x, floor, 16), "");
  const row = (X, strong) => {
    let out = "";
    let z = 1.85;
    let k = 0;
    while (z < 11) {
      const z2 = z + 0.6;
      const a = P(X, top, z);
      const b = P(X, top, z2);
      const c = P(X, floor, z2);
      const d = P(X, floor, z);
      const op = strong ? Math.max(0.25, 1 - (z - 1.85) / 10) : 0.2;
      out += `<g opacity="${f(op)}">`;
      out += quad([a, b, c, d], `fill="url(#rackG)" stroke="${C.light}" stroke-opacity="0.45"`);
      for (let s = 1; s < 16; s++) {
        const y = top + ((floor - top) * s) / 16;
        out += line(P(X, y, z + 0.05), P(X, y, z2 - 0.05), `stroke="${C.light}" stroke-opacity="0.09"`);
        if (strong && (s + k) % 4 === 0) {
          const led = P(X, y - 0.03, z2 - 0.1);
          out += `<circle cx="${f(led[0])}" cy="${f(led[1])}" r="${f(Math.max(0.8, 9 / z))}" fill="${C.bright}"/>`;
        }
      }
      out += line(P(X, top, (z + z2) / 2), P(X, floor, (z + z2) / 2), `stroke="${C.light}" stroke-opacity="0.14"`);
      out += `</g>`;
      if (strong) {
        const zm = z + 0.2;
        out += line(P(X + 0.12, -0.95, zm), P(X + 0.12, top, zm), `stroke="url(#dropG)" stroke-width="${f(Math.max(1, 18 / zm))}" stroke-linecap="round" opacity="${f(op)}"`);
        const j = P(X + 0.12, -0.95, zm);
        out += `<circle cx="${f(j[0])}" cy="${f(j[1])}" r="${f(Math.max(1.5, 26 / zm))}" fill="${C.bright}" opacity="${f(op * 0.5)}" filter="url(#g10)"/>`;
      }
      z = z2 + 0.14;
      k++;
    }
    return out;
  };
  const sup = [P(Xl + 0.12, -0.95, 1.05), P(Xl + 0.12, -0.95, 12)];
  const ret = [P(Xl + 0.26, -1.02, 1.05), P(Xl + 0.26, -1.02, 12)];
  const supPoly = pts([P(Xl + 0.12, -0.93, 1.05), P(Xl + 0.12, -0.93, 12), P(Xl + 0.12, -0.97, 12), P(Xl + 0.12, -0.97, 1.05)]);
  return {
    defs: `
    <linearGradient id="rackG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4456"/><stop offset="1" stop-color="#101d26"/></linearGradient>
    <linearGradient id="dropG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.bright}"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0.3"/></linearGradient>
    <linearGradient id="supG" x1="${f(sup[0][0])}" y1="${f(sup[0][1])}" x2="${f(sup[1][0])}" y2="${f(sup[1][1])}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.bright}"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0.2"/></linearGradient>
    <radialGradient id="floorFade" cx="${vx}" cy="${vy + 200}" r="900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="floorMask"><rect width="${W}" height="${H}" fill="url(#floorFade)"/></mask>`,
    body: `
    <ellipse cx="${vx}" cy="${vy}" rx="220" ry="160" fill="${C.bright}" opacity="0.18" filter="url(#g60)"/>
    <g mask="url(#floorMask)" stroke="${C.light}" stroke-opacity="0.1">${floorGrid}</g>
    ${row(1.1, false)}
    ${row(Xl, true)}
    ${line(ret[0], ret[1], `stroke="${C.light}" stroke-opacity="0.35" stroke-width="10"`)}
    <polygon points="${supPoly}" fill="url(#supG)" filter="url(#g10)"/>
    <polygon points="${supPoly}" fill="url(#supG)"/>
    ${line(sup[0], sup[1], `stroke="#fff" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="14 40"`)}`
  };
};

// Non-invasive: an ultrasonic V-path through a pipe, sensors outside.
subjects["non-invasive"] = () => {
  const py = 470;
  const pr = 120;
  const ax = 620;
  const bx = 1180;
  const mid = (ax + bx) / 2;
  const v = [[ax, py - pr + 6], [mid, py + pr - 6], [bx, py - pr + 6]];
  let streams = "";
  for (let k = 0; k < 9; k++) {
    const y = py - pr + 22 + k * ((pr * 2 - 44) / 8);
    const speed = 1 - Math.pow((y - py) / pr, 2);
    streams += `<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}" stroke="${C.accent}" stroke-opacity="${f(0.05 + speed * 0.12)}" stroke-dasharray="${f(30 + speed * 90)} ${f(40 + (1 - speed) * 60)}"/>`;
  }
  // wavefront arcs along the beam
  let fronts = "";
  for (let i = 1; i < 10; i++) {
    const t = i / 10;
    const seg = t < 0.5 ? 0 : 1;
    const lt = seg === 0 ? t * 2 : (t - 0.5) * 2;
    const p = [v[seg][0] + (v[seg + 1][0] - v[seg][0]) * lt, v[seg][1] + (v[seg + 1][1] - v[seg][1]) * lt];
    const ang = Math.atan2(v[seg + 1][1] - v[seg][1], v[seg + 1][0] - v[seg][0]) * (180 / Math.PI);
    fronts += `<path d="M0 -16 A16 16 0 0 1 0 16" transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(ang)})" fill="none" stroke="${C.bright}" stroke-opacity="0.45" stroke-width="1.4"/>`;
  }
  const sensor = (x) => `
    <rect x="${x - 54}" y="${py - pr - 58}" width="108" height="46" rx="10" fill="url(#sensorG)" stroke="${C.light}" stroke-opacity="0.35"/>
    <rect x="${x - 30}" y="${py - pr - 14}" width="60" height="10" rx="2" fill="#0d1a22" stroke="${C.light}" stroke-opacity="0.3"/>
    <circle cx="${x}" cy="${py - pr - 2}" r="26" fill="${C.bright}" opacity="0.45" filter="url(#g10)"/>`;
  return {
    defs: `
    <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfeaf7" stop-opacity="0.5"/><stop offset="1" stop-color="#3b6b85" stop-opacity="0.2"/></linearGradient>
    <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.accent}" stop-opacity="0.04"/><stop offset="0.5" stop-color="${C.accent}" stop-opacity="0.12"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0.04"/></linearGradient>
    <linearGradient id="sensorG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f313c"/><stop offset="1" stop-color="#0b141a"/></linearGradient>
    <linearGradient id="hFade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.2" stop-color="#fff"/><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="hMask"><rect width="${W}" height="${H}" fill="url(#hFade)"/></mask>`,
    body: `
    <g mask="url(#hMask)">
      <rect x="0" y="${py - pr}" width="${W}" height="${pr * 2}" fill="url(#waterG)"/>
      ${streams}
      <rect x="0" y="${py - pr - 10}" width="${W}" height="10" fill="url(#wallG)"/>
      <rect x="0" y="${py + pr}" width="${W}" height="10" fill="url(#wallG)" opacity="0.6"/>
      <rect x="0" y="${py + pr + 10}" width="${W}" height="60" fill="#000" opacity="0.4" filter="url(#g24)"/>
    </g>
    ${sensor(ax)}${sensor(bx)}
    ${glow(`<polyline points="${pts(v)}" fill="none" stroke="${C.bright}" stroke-width="3" stroke-linejoin="round"/>`, "g10", 1)}
    <polyline points="${pts(v)}" fill="none" stroke="#fff" stroke-width="1" stroke-linejoin="round" opacity="0.8"/>
    ${fronts}
    <circle cx="${mid}" cy="${py + pr - 6}" r="40" fill="${C.bright}" opacity="0.35" filter="url(#g24)"/>
    <circle cx="${mid}" cy="${py + pr - 6}" r="5" fill="#fff"/>`
  };
};

// Most leaks go unnoticed: a dark still surface with a single ripple.
subjects["unnoticed"] = () => {
  const cx = 1040;
  const cy = 560;
  let rings = "";
  for (let i = 0; i < 9; i++) {
    const rx = 40 + i * 62 + i * i * 4;
    const ry = rx * 0.22;
    const o = Math.max(0, 0.75 - i * 0.085);
    rings += `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${C.light}" stroke-opacity="${f(o)}" stroke-width="${f(Math.max(0.8, 2.4 - i * 0.2))}"/>`;
    // highlight on the near edge
    rings += `<path d="M${f(cx - rx * 0.6)} ${f(cy + ry * 0.8)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx * 0.6)} ${f(cy + ry * 0.8)}" fill="none" stroke="${C.bright}" stroke-opacity="${f(o * 0.7)}" stroke-width="${f(Math.max(1, 3 - i * 0.25))}"/>`;
  }
  // surface lines (horizon reflections)
  let surface = "";
  for (let k = 0; k < 26; k++) {
    const y = 380 + Math.pow(k / 26, 1.7) * 520;
    surface += `<line x1="0" y1="${f(y)}" x2="${W}" y2="${f(y)}" stroke="${C.light}" stroke-opacity="${f(0.015 + (k / 26) * 0.03)}"/>`;
  }
  return {
    defs: `
    <linearGradient id="waterSurf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.42" stop-color="#06131b" stop-opacity="0.8"/><stop offset="1" stop-color="#02070a"/></linearGradient>`,
    body: `
    <rect x="0" y="360" width="${W}" height="${H - 360}" fill="url(#waterSurf)"/>
    <ellipse cx="${cx}" cy="370" rx="700" ry="18" fill="${C.light}" opacity="0.08" filter="url(#g10)"/>
    ${surface}
    <ellipse cx="${cx}" cy="${cy}" rx="420" ry="90" fill="${C.accent}" opacity="0.18" filter="url(#g60)"/>
    <g filter="url(#g4)" opacity="0.8">${rings}</g>${rings}
    <ellipse cx="${cx}" cy="${cy}" rx="10" ry="3" fill="#fff"/>
    <circle cx="${cx}" cy="${cy - 170}" r="5" fill="${C.light}" opacity="0.9"/>
    <line x1="${cx}" y1="${cy - 160}" x2="${cx}" y2="${cy - 20}" stroke="${C.light}" stroke-opacity="0.12" stroke-dasharray="2 8"/>`
  };
};

// Stage settings per id: where the focus sits, tint.
const STAGE = {
  "hidden-leaks": { fx: 1010, fy: 420, tint2: "#2a1410" },
  "flow-baseline": { fx: 900, fy: 480, gridR: 760 },
  "digital-twin": { fx: 900, fy: 420 },
  "meters-vs-detection": { fx: 900, fy: 450, gridR: 700 },
  "riser-level": { fx: 1060, fy: 420, grid: false },
  "install-time": { fx: 980, fy: 470 },
  "claim-cost": { fx: 1100, fy: 380, tint2: "#2a1410", gridR: 720 },
  "insurer-data": { fx: 1010, fy: 440 },
  "rollout": { fx: 820, fy: 420, gridR: 600 },
  "liquid-cooling": { fx: 1030, fy: 410, grid: false, tint: "#00c8e0" },
  "non-invasive": { fx: 900, fy: 470, gridR: 700 },
  "unnoticed": { fx: 1040, fy: 520, grid: false }
};

function svgFor(id) {
  if (!subjects[id]) throw new Error(`No cover subject for post id "${id}"`);
  return stage({ ...STAGE[id], subject: subjects[id]() });
}

function englishPosts() {
  const dir = path.join(ROOT, "content", "blog", "en");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((file) => {
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    const id = (src.match(/^id:\s*(.+)$/m) || [])[1].trim();
    const slug = ((src.match(/^slug:\s*(.+)$/m) || [])[1] || file.replace(/\.md$/, "")).trim();
    return { id, slug };
  });
}

const PY = `
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
im.save(out + ".webp", "WEBP", quality=82, method=6)
im.resize((800, 450), Image.LANCZOS).save(out + "-800.webp", "WEBP", quality=80, method=6)
# 1200x630: crop 1600x840 from the centre, then scale
og = im.crop((0, 30, 1600, 870)).resize((1200, 630), Image.LANCZOS)
og.save(out + "-og.jpg", "JPEG", quality=84, optimize=True, progressive=True)
`;

async function main() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (err) {
    console.error("Playwright not found. Run with NODE_PATH=$(npm root -g).");
    process.exit(1);
  }
  const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const posts = englishPosts().filter((p) => !only.length || only.includes(p.id));
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "covers-"));
  const pyFile = path.join(tmp, "encode.py");
  fs.writeFileSync(pyFile, PY);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  for (const p of posts) {
    const svg = svgFor(p.id);
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#000">${svg}</body></html>`);
    const png = path.join(tmp, `${p.slug}.png`);
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: W, height: H } });
    execFileSync("python3", ["-I", pyFile, png, path.join(OUT, p.slug)]);
    const kb = (n) => Math.round(fs.statSync(path.join(OUT, n)).size / 1024);
    console.log(`${p.id.padEnd(20)} ${p.slug}  ${kb(p.slug + ".webp")} KB / ${kb(p.slug + "-800.webp")} KB / ${kb(p.slug + "-og.jpg")} KB`);
  }
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
