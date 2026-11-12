/*
  Drawings for the Data centres page. Styles in src/css/data-centers.css.

    dcIcons(t)    small line pictograms (24px) for the comparison cards and the path
    dcClampSvg(t) step 1: coolant line, clamp-on sensor, ultrasonic V-path
    dcLearnSvg(t) step 2: four branch flows moving in sync inside learned bands
    dcFlagSvg(t)  step 3: the same four flows, branch 3 leaves its band
    bridgeSvg(t)  residential risers and a cooling loop feeding one model
*/

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const f1 = (n) => n.toFixed(1);

// ---------- Pictograms ----------
function icon(body) {
  return `<svg class="dc-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">${body}</svg>`;
}

function dcIcons() {
  return {
    // pipe with a crack and a drop
    leak: icon(`<rect x="2.5" y="4.5" width="19" height="6" rx="2"/><path d="M10.6 7.6l1.4 1.4 1.4-1.4"/><path d="M12 13.2c-1.5 2-2.4 3.3-2.4 4.5a2.4 2.4 0 0 0 4.8 0c0-1.2-.9-2.5-2.4-4.5z"/>`),
    // eye with a slash
    unseen: icon(`<path d="M2.5 12s3.5-5.8 9.5-5.8 9.5 5.8 9.5 5.8-3.5 5.8-9.5 5.8S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/><path d="M4.5 4.5l15 15"/>`),
    // drop reaching a floor line, alarm rays
    floor: icon(`<path d="M12 3.5c-1.3 1.8-2.1 3-2.1 4a2.1 2.1 0 0 0 4.2 0c0-1-.8-2.2-2.1-4z"/><path d="M2.5 20.5h19"/><path d="M7 17.6c3-1.1 7-1.1 10 0"/><path d="M4.2 12.5l2 1.4M19.8 12.5l-2 1.4M12 11.6v2"/>`),
    // rack with a rising thermometer
    hot: icon(`<rect x="3.5" y="3" width="10" height="18" rx="1.6"/><path d="M6.5 7h4M6.5 11h4M6.5 15h4"/><path d="M18.5 4.5a1.6 1.6 0 0 1 1.6 1.6v7.6a2.8 2.8 0 1 1-3.2 0V6.1a1.6 1.6 0 0 1 1.6-1.6z"/><path d="M18.5 9v6.5"/>`),
    // three flows, the last one breaks away
    drift: icon(`<path d="M2.5 6h19M2.5 12h19"/><path d="M2.5 18h9l3.5-4h6.5"/><circle cx="15" cy="14" r="1.1"/>`),
    // location pin
    pin: icon(`<path d="M12 21s-6.2-5.4-6.2-10.6a6.2 6.2 0 0 1 12.4 0C18.2 15.6 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>`),
    // shield with a check
    shield: icon(`<path d="M12 2.8l7.2 2.9v5.4c0 4.6-3 8.3-7.2 10.1-4.2-1.8-7.2-5.5-7.2-10.1V5.7z"/><path d="M8.6 12.2l2.3 2.3 4.6-4.6"/>`),
    // three racks
    racks: icon(`<rect x="2.5" y="4" width="5.4" height="16" rx="1"/><rect x="9.3" y="4" width="5.4" height="16" rx="1"/><rect x="16.1" y="4" width="5.4" height="16" rx="1"/><path d="M4 8h2.4M10.8 8h2.4M17.6 8h2.4M4 11.5h2.4M10.8 11.5h2.4M17.6 11.5h2.4"/>`),
    // clamp on a pipe with a sound arc
    clamp: icon(`<path d="M2.5 13h19M2.5 19h19"/><rect x="8" y="7.5" width="8" height="5.5" rx="1.2"/><path d="M9.5 4.8a4 4 0 0 1 5 0"/>`),
    // bell
    bell: icon(`<path d="M6.2 16.5v-5a5.8 5.8 0 0 1 11.6 0v5l1.6 2H4.6z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>`)
  };
}

// ---------- Step 1: clamp on ----------
function dcClampSvg() {
  const cy = 176, R = 40, wall = 6, x0 = 0, x1 = 400;
  const ax = 150, bx = 250, mx = 200;
  const top = cy - R, bot = cy + R;
  let s = `<defs><clipPath id="dc-bore"><rect x="${x0}" y="${top + wall}" width="${x1}" height="${2 * (R - wall)}"/></clipPath></defs>`;
  s += `<rect class="dc-frame-bg" x="0" y="0" width="400" height="300"/>`;
  // pipe: liquid, walls, shell
  s += `<rect class="dc-liquid" x="${x0}" y="${top + wall}" width="${x1}" height="${2 * (R - wall)}"/>`;
  s += `<path class="dc-shell" d="M${x0} ${top} H${x1} M${x0} ${bot} H${x1}"/>`;
  s += `<path class="dc-wall" d="M${x0} ${top + wall} H${x1} M${x0} ${bot - wall} H${x1}"/>`;
  s += `<line class="dc-pipe-hl" x1="${x0}" y1="${top + 3}" x2="${x1}" y2="${top + 3}"/>`;
  // coolant flow: chevrons that drift left to right inside the bore
  let chev = "";
  for (let x = -40; x <= 440; x += 40) {
    chev += `M${x - 5} ${cy - 6} L${x + 3} ${cy} L${x - 5} ${cy + 6} `;
  }
  s += `<g clip-path="url(#dc-bore)"><path class="dc-chevron" d="${chev.trim()}"/></g>`;
  // clamp straps beside each transducer
  [ax - 34, bx + 26].forEach((x) => { s += `<rect class="dc-strap" x="${x}" y="${top - 5}" width="8" height="${2 * R + 10}" rx="3"/>`; });
  // ultrasonic V-path: A, reflection off the far wall, B
  const v = `M${ax} ${top + wall} L${mx} ${bot - wall} L${bx} ${top + wall}`;
  s += `<path class="dc-beam" d="${v}" pathLength="1"/>`;
  [7, 13].forEach((r, i) => { s += `<path class="dc-ripple" d="M${mx - r} ${bot - wall - 1} A${r} ${r} 0 0 1 ${mx + r} ${bot - wall - 1}" style="animation-delay:${(0.75 + i * 0.16).toFixed(2)}s"/>`; });
  s += `<circle class="dc-beam-dot" r="3.5" style="offset-path: path('${v}')"/>`;
  // transducers on top of the pipe
  [ax, bx].forEach((x) => {
    s += `<rect class="dc-tx" x="${x - 18}" y="${top - 24}" width="36" height="24" rx="5"/>`;
    s += `<line class="dc-tx-face" x1="${x - 11}" y1="${top - 4}" x2="${x + 11}" y2="${top - 4}"/>`;
  });
  // electronics box and cables
  const ex = 160, ey = 34, ew = 80, eh = 38;
  s += `<path class="dc-cable" d="M${ax} ${top - 24} C${ax} ${ey + eh + 20} ${ex + 16} ${ey + eh + 16} ${ex + 16} ${ey + eh} M${bx} ${top - 24} C${bx} ${ey + eh + 20} ${ex + ew - 16} ${ey + eh + 16} ${ex + ew - 16} ${ey + eh}"/>`;
  s += `<rect class="dc-box" x="${ex}" y="${ey}" width="${ew}" height="${eh}" rx="8"/>`;
  s += `<rect class="dc-box-line" x="${ex + 12}" y="${ey + 12}" width="38" height="2" rx="1"/>`;
  s += `<rect class="dc-box-line" x="${ex + 12}" y="${ey + 21}" width="24" height="2" rx="1"/>`;
  s += `<circle class="dc-led" cx="${ex + ew - 14}" cy="${ey + 19}" r="3.5"/>`;
  return `<svg class="dc-vis dc-vis-clamp" viewBox="0 0 400 300" aria-hidden="true" focusable="false">${s}</svg>`;
}

// ---------- Steps 2 and 3: four branch flows ----------
const LANES = [84, 138, 192, 246];
const LX0 = 58, LX1 = 376;
const wave = (u, k) => LANES[k] + 6 * Math.sin(u * 2.6 * Math.PI + 0.4) + 2 * Math.sin(u * 7 * Math.PI);
function lanePath(k, from, to, shift) {
  const N = 40;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const u = from + (to - from) * (i / N);
    const y = wave(u, k) + (shift ? shift(u) : 0);
    d += (i ? " L" : "M") + f1(LX0 + (LX1 - LX0) * u) + " " + f1(y);
  }
  return d;
}
function bandPath(k, h) {
  const N = 40;
  let top = "", bot = "";
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = f1(LX0 + (LX1 - LX0) * u);
    top += (i ? " L" : "M") + x + " " + f1(wave(u, k) - h);
    const ub = 1 - u;
    bot += " L" + f1(LX0 + (LX1 - LX0) * ub) + " " + f1(wave(ub, k) + h);
  }
  return top + bot + " Z";
}
function lanesFrame(title, titleClass) {
  let s = `<rect class="dc-frame-bg" x="0" y="0" width="400" height="300"/>`;
  s += `<g class="chart-grid">${LANES.slice(0, -1).map((y) => `<line x1="${LX0}" y1="${y + 27}" x2="${LX1}" y2="${y + 27}"/>`).join("")}</g>`;
  s += `<text class="${titleClass}" x="30" y="40">${esc(title)}</text>`;
  return s;
}

function dcLearnSvg(t) {
  let s = lanesFrame(t.dataCenters.how.visual.learned, "chart-text-strong");
  LANES.forEach((y, k) => {
    s += `<path class="chart-band dc-band" d="${bandPath(k, 11)}"/>`;
    s += `<text class="chart-text dc-lane-no" x="30" y="${f1(wave(0, k) + 4)}">${k + 1}</text>`;
  });
  LANES.forEach((y, k) => {
    const d = lanePath(k, 0, 1);
    s += `<path class="dc-lane" d="${d}" pathLength="1"/>`;
    s += `<circle class="dc-lane-dot" r="3.2" style="offset-path: path('${d}')"/>`;
  });
  return `<svg class="dc-vis dc-vis-learn" viewBox="0 0 400 300" aria-hidden="true" focusable="false">${s}</svg>`;
}

function dcFlagSvg(t) {
  const bad = 2, u0 = 0.6;
  const drift = (u) => (u <= u0 ? 0 : -34 * Math.pow((u - u0) / (1 - u0), 1.5));
  let s = lanesFrame(t.dataCenters.visual.deviation, "chart-text-strong dc-text-bad");
  LANES.forEach((y, k) => {
    s += `<path class="chart-band dc-band${k === bad ? " dc-band-bad" : ""}" d="${bandPath(k, 11)}"/>`;
    s += `<text class="chart-text dc-lane-no${k === bad ? " dc-lane-no-bad" : ""}" x="30" y="${f1(wave(0, k) + 4)}">${k + 1}</text>`;
  });
  LANES.forEach((y, k) => {
    if (k !== bad) { s += `<path class="dc-lane" d="${lanePath(k, 0, 1)}" pathLength="1"/>`; return; }
    s += `<path class="dc-lane dc-lane-head" d="${lanePath(k, 0, u0)}" pathLength="1"/>`;
    const tail = lanePath(k, u0, 1, drift);
    s += `<path class="dc-lane-glow" d="${tail}" pathLength="1"/>`;
    s += `<path class="dc-lane dc-lane-bad" d="${tail}" pathLength="1"/>`;
  });
  const ex = LX1, ey = wave(1, bad) + drift(1);
  s += `<circle class="dc-flag-ring" cx="${ex}" cy="${f1(ey)}" r="6"/>`;
  s += `<circle class="dc-flag" cx="${ex}" cy="${f1(ey)}" r="5"/>`;
  return `<svg class="dc-vis dc-vis-flag" viewBox="0 0 400 300" aria-hidden="true" focusable="false">${s}</svg>`;
}

// ---------- Bridge: residential risers and a cooling loop, one model ----------
function bridgeSvg(t) {
  const L = t.dataCenters.status.visual;
  const W = 560, H = 380;
  const mx = 280, my = 92;
  let s = `<rect class="vi-grid" x="0" y="0" width="${W}" height="${H}"/>`;

  // left: residential building with two risers
  const bx = 56, bw = 136, by = 176, fh = 38, nf = 4, bb = by + fh * nf;
  s += `<g class="br-bldg">`;
  s += `<line class="br-ground" x1="30" y1="${bb}" x2="218" y2="${bb}"/>`;
  s += `<rect class="br-shell" x="${bx}" y="${by}" width="${bw}" height="${fh * nf}" rx="4"/>`;
  let floors = "";
  for (let f = 1; f < nf; f++) floors += `M${bx} ${by + f * fh} H${bx + bw} `;
  s += `<path class="br-floor" d="${floors.trim()}"/>`;
  for (let f = 0; f < nf; f++) {
    [bx + 12, bx + 58, bx + 104].forEach((x) => { s += `<rect class="br-win" x="${x}" y="${by + f * fh + 12}" width="20" height="14" rx="2"/>`; });
  }
  const r1 = bx + 46, r2 = bx + 92;
  s += `<path class="br-riser" d="M${r1} ${by - 8} V${bb} M${r2} ${by - 8} V${bb}"/>`;
  [[r1, 1], [r1, 3], [r2, 0], [r2, 2]].forEach(([x, f], i) => {
    const y = by + f * fh + fh / 2;
    s += `<rect class="br-clamp" x="${x - 6}" y="${y - 4}" width="12" height="8" rx="2"/>`;
    s += `<circle class="br-ring" cx="${x}" cy="${y}" r="5" style="animation-delay:${(-i * 0.7).toFixed(1)}s"/>`;
  });
  s += `</g>`;

  // right: rack row on a cooling loop
  const lx0 = 336, lx1 = 532, ly0 = 184, ly1 = bb;
  s += `<g class="br-loop-g">`;
  s += `<path class="br-loop" d="M${lx0} ${ly1} V${ly0} H${lx1}"/>`;
  s += `<path class="br-loop br-loop-return" d="M${lx1} ${ly0} V${ly1} H${lx0}"/>`;
  [356, 418, 480].forEach((x, i) => {
    const rw = 40, ry = 214, rh = 92;
    s += `<line class="br-branch" x1="${x + 12}" y1="${ly0}" x2="${x + 12}" y2="${ry}"/>`;
    s += `<line class="br-branch br-branch-return" x1="${x + rw - 10}" y1="${ry + rh}" x2="${x + rw - 10}" y2="${ly1}"/>`;
    s += `<rect class="br-rack" x="${x}" y="${ry}" width="${rw}" height="${rh}" rx="4"/>`;
    for (let u = 0; u < 5; u++) s += `<rect class="br-unit" x="${x + 6}" y="${ry + 8 + u * 16}" width="${rw - 12}" height="9" rx="2"/>`;
    s += `<rect class="br-clamp" x="${x + 6}" y="${ly0 + 9}" width="12" height="8" rx="2"/>`;
    s += `<circle class="br-ring" cx="${x + 12}" cy="${ly0 + 13}" r="5" style="animation-delay:${(-i * 0.9 - 0.4).toFixed(1)}s"/>`;
  });
  s += `<circle class="br-cool" r="2.4" style="offset-path: path('M${lx0} ${ly1} V${ly0} H${lx1}')"/>`;
  s += `<circle class="br-cool br-cool-2" r="2.4" style="offset-path: path('M${lx0} ${ly1} V${ly0} H${lx1}')"/>`;
  s += `</g>`;

  // data paths into the model node
  const pa = `M${bx + bw / 2} ${by - 14} C${bx + bw / 2} ${my + 10} ${mx - 90} ${my} ${mx - 34} ${my}`;
  const pb = `M${(lx0 + lx1) / 2} ${ly0 - 14} C${(lx0 + lx1) / 2} ${my + 10} ${mx + 90} ${my} ${mx + 34} ${my}`;
  [pa, pb].forEach((d, i) => {
    s += `<path class="br-data" d="${d}" pathLength="1"/>`;
    s += `<circle class="br-pulse-glow" r="8" style="offset-path: path('${d}'); animation-delay:${(i * 1.1).toFixed(1)}s"/>`;
    s += `<circle class="br-pulse" r="3.5" style="offset-path: path('${d}'); animation-delay:${(i * 1.1).toFixed(1)}s"/>`;
    s += `<circle class="br-pulse" r="3.5" style="offset-path: path('${d}'); animation-delay:${(i * 1.1 + 1.6).toFixed(1)}s"/>`;
  });
  s += `<circle class="br-port" cx="${bx + bw / 2}" cy="${by - 14}" r="3"/><circle class="br-port" cx="${(lx0 + lx1) / 2}" cy="${ly0 - 14}" r="3"/>`;

  // model node: rings, core and a small learned curve
  s += `<g class="br-model">`;
  s += `<circle class="br-model-ring" cx="${mx}" cy="${my}" r="34"/>`;
  s += `<circle class="br-model-halo" cx="${mx}" cy="${my}" r="34"/>`;
  s += `<circle class="br-model-core" cx="${mx}" cy="${my}" r="24"/>`;
  s += `<path class="br-model-band" d="M${mx - 15} ${my + 2} C${mx - 8} ${my - 12} ${mx - 2} ${my - 12} ${mx} ${my - 2} C${mx + 3} ${my + 8} ${mx + 9} ${my + 8} ${mx + 15} ${my - 4} L${mx + 15} ${my + 6} C${mx + 9} ${my + 18} ${mx + 3} ${my + 18} ${mx} ${my + 8} C${mx - 2} ${my - 2} ${mx - 8} ${my - 2} ${mx - 15} ${my + 12} Z"/>`;
  s += `<path class="br-model-line" d="M${mx - 15} ${my + 7} C${mx - 8} ${my - 7} ${mx - 2} ${my - 7} ${mx} ${my + 3} C${mx + 3} ${my + 13} ${mx + 9} ${my + 13} ${mx + 15} ${my + 1}"/>`;
  s += `</g>`;

  // labels (hidden on phones)
  s += `<g class="vi-labels">`;
  s += `<text class="vi-text vi-text-strong" x="${mx}" y="${my - 48}" text-anchor="middle">${esc(L.model)}</text>`;
  s += `<text class="vi-text vi-text-muted br-label" x="${bx + bw / 2}" y="${bb + 26}" text-anchor="middle">${esc(L.residential)}</text>`;
  s += `<text class="vi-text vi-text-muted br-label" x="${(lx0 + lx1) / 2}" y="${bb + 26}" text-anchor="middle">${esc(L.loop)}</text>`;
  s += `</g>`;
  return `<svg class="vis vis-bridge" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

module.exports = { dcIcons, dcClampSvg, dcLearnSvg, dcFlagSvg, bridgeSvg };
