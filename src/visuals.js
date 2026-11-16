/*
  Vector product visuals, sharp at any size. Strings come from the locale.
  CSS for these lives in styles.css under "Product visuals".

    installSvg(t)  clamp-on ultrasonic flow sensors on a riser and on the supply line feeding it
    rackSvg(t)     liquid-cooled rack row with a cooling loop and per-rack sensing
    portfolioSvg(t) row of six isometric buildings, one riser deviation and an alert
    productHeroSvg(t) signal chain: clamp-on sensor, learned baseline chart, building twin alert
    sensorSvg(t)   wireframe close-up of a clamp-on ultrasonic flow sensor and its V-path
*/

const kit = require("./sensor-kit.js");
const n2 = (v) => String(Math.round(v * 100) / 100);

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function installSvg(t, opts) {
  const compact = Boolean(opts && opts.compact);
  const L = t.product.install.labels;
  const id = compact ? "vik" : "vi";
  // riser: vertical pipe, the sensor on its left side. Supply line: horizontal pipe into the riser foot,
  // the sensor on top. Both sensors are the shared kit, as on the home hero.
  const rx = 262, rR = 20, sy = 250, sR = 12, ss = 112, rs = 128;
  let s = `<defs>${kit.defs(id + "r", "y", rx, rR)}${kit.defs(id + "s", "x", sy, sR)}</defs>`;
  s += `<rect class="vi-grid" x="0" y="0" width="400" height="300"/>`;
  s += kit.pipe(id + "s", "x", -10, rx, sy, sR);
  s += kit.pipe(id + "r", "y", -10, 310, rx, rR);
  s += kit.waves(id + "r", "y", rs, rx, rR, -1, 3);
  s += kit.waves(id + "s", "x", ss, sy, sR, -1, 3);
  s += kit.sensor(id + "r", "y", rs, rx, rR, -1);
  s += kit.sensor(id + "s", "x", ss, sy, sR, -1);
  // labels (hidden at small sizes by CSS). Leaders run through empty space only.
  const hx = rx - rR - 1 - 0.76 * rR;
  s += `<g class="vi-labels">`;
  s += `<text class="vi-text vi-text-strong" x="24" y="${rs + 5}">${esc(L.ultrasonic)}</text>`;
  s += `<path class="vi-leader" d="M142 ${rs} H${n2(hx - 4)}"/><circle class="vi-leader-end" cx="${n2(hx - 4)}" cy="${rs}" r="2.5"/>`;
  s += `<path class="vi-leader" d="M72 ${rs + 14} L${ss - 14} ${sy - sR - 0.76 * sR - 8}"/><circle class="vi-leader-end" cx="${ss - 14}" cy="${n2(sy - sR - 0.76 * sR - 8)}" r="2.5"/>`;
  s += `<text class="vi-text vi-text-muted" x="24" y="${sy + sR + 24}">${esc(L.supply)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="${rx + rR + 12}" y="44">${esc(L.riser)}</text>`;
  s += `</g>`;
  const vb = compact ? "30 40 340 255" : "0 0 400 300";
  return `<svg class="vis vis-install" viewBox="${vb}" role="img" aria-label="${esc(t.product.install.visualAlt)}" focusable="false">${s}</svg>`;
}

function rackSvg(t) {
  const L = t.dataCenters.visual;
  let s = "";
  s += `<rect class="vi-grid" x="0" y="0" width="480" height="300"/>`;
  // cooling loop: supply along the top, return along the bottom
  s += `<path class="vi-loop" d="M30 60 H450"/>`;
  s += `<path class="vi-loop vi-loop-return" d="M30 250 H450"/>`;
  s += `<path class="vi-loop" d="M30 60 V250"/>`;
  s += `<path class="vi-loop vi-loop-return" d="M450 60 V250"/>`;
  // racks
  const racks = [70, 160, 250, 340];
  racks.forEach((x, i) => {
    const bad = i === 2;
    s += `<g class="vi-rack${bad ? " vi-rack-bad" : ""}">`;
    s += `<rect class="vi-rack-body" x="${x}" y="100" width="70" height="112" rx="6"/>`;
    for (let u = 0; u < 7; u++) {
      s += `<rect class="vi-unit" x="${x + 8}" y="${108 + u * 14}" width="54" height="9" rx="2"/>`;
      s += `<circle class="vi-unit-led" cx="${x + 58}" cy="${112.5 + u * 14}" r="1.6" style="animation-delay: ${((i * 7 + u) * -0.37).toFixed(2)}s"/>`;
    }
    // branch from supply and to return, with a clamp-on sensor on each
    s += `<line class="vi-branch${bad ? " vi-branch-bad" : ""}" x1="${x + 20}" y1="60" x2="${x + 20}" y2="100"/>`;
    s += `<line class="vi-branch" x1="${x + 50}" y1="212" x2="${x + 50}" y2="250"/>`;
    s += `<rect class="vi-sensor" x="${x + 14}" y="76" width="12" height="8" rx="2"/>`;
    s += `<circle class="vi-ring${bad ? " vi-ring-bad" : ""}" cx="${x + 20}" cy="80" r="5" style="animation-delay: ${(-i * 0.8).toFixed(1)}s"/>`;
    s += `<rect class="vi-sensor" x="${x + 44}" y="226" width="12" height="8" rx="2"/>`;
    // coolant flow through the branch (the drifting branch runs slower and in the anomaly colour)
    s += `<circle class="vi-flow${bad ? " vi-flow-bad" : ""}" r="2" style="offset-path: path('M${x + 20} 60 L${x + 20} 100'); animation-duration: ${bad ? "4.4" : "2.2"}s; animation-delay: ${(-i * 0.5).toFixed(1)}s"/>`;
    s += `</g>`;
  });
  // flow along the supply line
  for (let i = 0; i < 3; i++) s += `<circle class="vi-flow" r="2.4" style="offset-path: path('M30 60 H450'); animation-duration: 6s; animation-delay: ${(-i * 2).toFixed(1)}s"/>`;
  for (let i = 0; i < 3; i++) s += `<circle class="vi-flow vi-flow-return" r="2.4" style="offset-path: path('M450 250 H30'); animation-duration: 6s; animation-delay: ${(-i * 2 - 1).toFixed(1)}s"/>`;
  // deviation marker on rack 3
  s += `<circle class="vi-pulse" cx="270" cy="80" r="9"/>`;
  s += `<g class="vi-labels">`;
  s += `<text class="vi-text vi-text-muted" x="30" y="44">${esc(L.supply)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="30" y="274">${esc(L.returnLine)}</text>`;
  // flow deviation label, shifted left so longer languages stay inside the frame
  const lx = Math.min(336, 470 - Math.ceil(String(L.deviation).length * 6.9));
  s += `<line class="vi-leader" x1="276" y1="74" x2="${lx - 6}" y2="30"/><circle class="vi-leader-end" cx="${lx - 6}" cy="30" r="2.5"/>`;
  s += `<text class="vi-text vi-text-bad" x="${lx}" y="34">${esc(L.deviation)}</text>`;
  s += `</g>`;
  return `<svg class="vis vis-rack" viewBox="0 0 480 300" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}


function mlSvg(t) {
  const C = t.product.data.chart;
  const riserWord = t.product.install.labels.riser;
  const W = 640, H = 480, cols = 3, rows = 2, pad = 24, gap = 16;
  const tw = (W - pad * 2 - gap * (cols - 1)) / cols, th = (H - pad * 2 - 44 - gap * (rows - 1)) / rows;
  const f1 = (n) => n.toFixed(1);
  // deterministic pseudo-random rhythms per tile
  const shapes = [
    [0.42, 0.5, 0.4, 0.52, 0.44, 0.5, 0.43, 0.48],
    [0.38, 0.52, 0.41, 0.5, 0.4, 0.51, 0.42, 0.49],
    [0.45, 0.47, 0.43, 0.5, 0.46, 0.49, 0.44, 0.5],
    [0.4, 0.53, 0.42, 0.5, 0.41, 0.52, 0.4, 0.5],
    [0.44, 0.5, 0.42, 0.51, 0.45, 0.49, 0.43, 0.47],
    [0.41, 0.5, 0.43, 0.49, 0.42, 0.5, 0.44, 0.48]
  ];
  let s = `<rect class="vi-grid" x="0" y="0" width="${W}" height="${H}"/>`;
  s += `<text class="vi-text vi-text-strong" x="${pad}" y="${pad + 14}">${esc(t.product.ml.h2)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="${W - pad}" y="${pad + 14}" text-anchor="end">${esc(C.baseline)} · ${esc(C.actual)}</text>`;
  shapes.forEach((base, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x0 = pad + col * (tw + gap), y0 = pad + 44 + row * (th + gap);
    const bad = i === 4;
    const px0 = x0 + 14, px1 = x0 + tw - 14, py0 = y0 + 34, py1 = y0 + th - 16;
    const X = (u) => px0 + (px1 - px0) * u, Y = (v) => py1 - (py1 - py0) * ((v - 0.22) / 0.72);
    const pts = base.map((v, k) => [k / (base.length - 1), v]);
    const smooth = (arr) => arr.map(([u, v], k) => {
      if (!k) return `M${f1(X(u))} ${f1(Y(v))}`;
      const [pu, pv] = arr[k - 1]; const cx = (X(pu) + X(u)) / 2;
      return `C${f1(cx)} ${f1(Y(pv))} ${f1(cx)} ${f1(Y(v))} ${f1(X(u))} ${f1(Y(v))}`;
    }).join(" ");
    const poly = smooth;
    const bandTop = pts.map(([u, v]) => [u, v + 0.07]), bandBot = pts.slice().reverse().map(([u, v]) => [u, v - 0.07]);
    const top = [smooth(bandTop)], bot = [smooth(bandBot).replace(/^M/, "L")];
    const live = bad ? pts.map(([u, v], k) => [u, k >= 5 ? v + (k - 4) * 0.12 : v + 0.01]) : pts.map(([u, v], k) => [u, v + (k % 2 ? 0.012 : -0.008)]);
    s += `<g class="vi-tile${bad ? " vi-tile-bad" : ""}">`;
    s += `<rect class="vi-tile-bg" x="${x0}" y="${y0}" width="${f1(tw)}" height="${f1(th)}" rx="12"/>`;
    s += `<text class="vi-text" x="${x0 + 14}" y="${y0 + 20}">${esc(riserWord)} ${String.fromCharCode(65 + i)}</text>`;
    s += `<circle class="vi-tile-dot" cx="${f1(x0 + tw - 18)}" cy="${y0 + 16}" r="3.5"/>`;
    s += `<path class="chart-band" d="${top[0]} ${bot[0]} Z"/>`;
    s += `<path class="chart-base" d="${poly(pts)}"/>`;
    s += `<path class="vi-tile-live${bad ? " chart-live-anomaly" : ""}" d="${poly(live)}" pathLength="1" style="animation-delay:${(-i * 0.9).toFixed(1)}s"/>`;
    if (bad) s += `<circle class="chart-flag" cx="${f1(X(1))}" cy="${f1(Y(live[live.length - 1][1]))}" r="4"/>`;
    s += `</g>`;
  });
  return `<svg class="vis vis-ml" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t.product.ml.visualAlt)}" focusable="false">${s}</svg>`;
}


function severitySvg(t) {
  const L = t.insurance.visual;
  const W = 560, H = 380, x0 = 56, x1 = 528, y0 = 318, y1 = 56;
  const f1 = (n) => n.toFixed(1);
  // severity compounds with loss duration: gentle start, steep end
  const curve = (u) => Math.pow(u, 2.2);
  const X = (u) => x0 + (x1 - x0) * u, Y = (v) => y0 - (y0 - y1) * v;
  const N = 40; let d = "";
  for (let i = 0; i <= N; i++) { const u = i / N; d += (i ? " L" : "M") + f1(X(u)) + " " + f1(Y(curve(u))); }
  const area = d + ` L${f1(X(1))} ${y0} L${x0} ${y0} Z`;
  let s = `<defs><linearGradient id="sv-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff6b4a" stop-opacity="0.35"/><stop offset="1" stop-color="#ff6b4a" stop-opacity="0.02"/></linearGradient></defs>`;
  s += `<rect class="vi-grid" x="0" y="0" width="${W}" height="${H}"/>`;
  for (let i = 1; i <= 4; i++) s += `<line class="chart-grid" x1="${x0}" y1="${f1(Y(i / 4))}" x2="${x1}" y2="${f1(Y(i / 4))}"/>`;
  s += `<line class="sv-axis" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line class="sv-axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>`;
  s += `<path class="sv-area" d="${area}" fill="url(#sv-area)"/>`;
  s += `<path class="sv-curve" d="${d}" pathLength="1"/>`;
  // milestones along the curve
  const marks = [0.42, 0.6, 0.78, 0.94];
  L.milestones.slice(0, 4).forEach((label, i) => {
    const u = marks[i], x = X(u), y = Y(curve(u));
    s += `<circle class="sv-mark" cx="${f1(x)}" cy="${f1(y)}" r="4" style="animation-delay:${(1.2 + i * 0.5).toFixed(1)}s"/>`;
    s += `<g class="vi-labels" style="animation-delay:${(1.2 + i * 0.5).toFixed(1)}s"><line class="vi-leader" x1="${f1(x)}" y1="${f1(y)}" x2="${f1(x - 10)}" y2="${f1(y - 26)}"/><text class="vi-text vi-text-muted sv-ms" x="${f1(x - 12)}" y="${f1(y - 30)}" text-anchor="end">${esc(label)}</text></g>`;
  });
  // detected early, discovered late
  const ud = 0.16, uf = 0.86;
  const dx = X(ud), dy = Y(curve(ud)), fx = X(uf), fy = Y(curve(uf));
  s += `<line class="sv-drop sv-drop-good" x1="${f1(dx)}" y1="${f1(dy)}" x2="${f1(dx)}" y2="${y0}"/>`;
  s += `<circle class="sv-dot sv-dot-good" cx="${f1(dx)}" cy="${f1(dy)}" r="6"/>`;
  s += `<g class="vi-labels sv-early"><text class="vi-text sv-lbl sv-lbl-good" x="${f1(dx - 4)}" y="${y0 + 22}" text-anchor="start">${esc(L.detected)}</text></g>`;
  s += `<line class="sv-drop sv-drop-bad" x1="${f1(fx)}" y1="${f1(fy)}" x2="${f1(fx)}" y2="${y0}"/>`;
  s += `<circle class="sv-dot sv-dot-bad" cx="${f1(fx)}" cy="${f1(fy)}" r="6"/>`;
  // label sits on the dotted line itself: a dot on the line, a short leader, text ending 8px from the line
  const ly = y0 - 22;
  s += `<g class="vi-labels sv-late"><circle class="sv-tag" cx="${f1(fx)}" cy="${ly}" r="2.6"/><line class="sv-tag-leader" x1="${f1(fx - 2.6)}" y1="${ly}" x2="${f1(fx - 8)}" y2="${ly}"/><text class="vi-text sv-lbl sv-lbl-bad" x="${f1(fx - 11)}" y="${ly + 4.5}" text-anchor="end">${esc(L.discovered)}</text></g>`;
  // axes labels
  // x-axis label under the axis, right aligned. It shares the row under the axis with the "detected" label when
  // both fit (estimated at 7px per character), otherwise it drops to a second row.
  const detEnd = dx - 4 + String(L.detected).length * 7, axStart = x1 - String(L.axis).length * 7;
  const axY = detEnd + 16 < axStart ? y0 + 22 : y0 + 44;
  s += `<g class="vi-labels sv-axes"><text class="vi-text vi-text-muted" x="${x1}" y="${axY}" text-anchor="end">${esc(L.axis)}</text>`;
  s += `<text class="vi-text vi-text-muted" transform="translate(${x0 - 14} ${y1}) rotate(-90)" text-anchor="end">${esc(L.severity)}</text>`;
  s += `<text class="vi-text vi-text-strong" x="${x0}" y="30">${esc(L.title)}</text></g>`;
  return `<svg class="vis vis-severity" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}


function portfolioSvg(t) {
  const A = t.alert;
  const f1 = (n) => n.toFixed(1);
  const cos = Math.cos(Math.PI / 6), sin = Math.sin(Math.PI / 6);
  // same isometric projection as src/hero.js, with a movable origin
  const proj = (ox, oy) => (x, y, z) => [ox + (x - z) * cos, oy + (x + z) * sin - y];
  const P = proj(125, 132);
  const pt = (p) => `${f1(p[0])},${f1(p[1])}`;
  const seg = (a, c) => { const p0 = P(...a), p1 = P(...c); return `M${f1(p0[0])} ${f1(p0[1])} L${f1(p1[0])} ${f1(p1[1])} `; };
  const ln = (a, c, cls) => { const p0 = P(...a), p1 = P(...c); return `<line class="${cls}" x1="${f1(p0[0])}" y1="${f1(p0[1])}" x2="${f1(p1[0])}" y2="${f1(p1[1])}"/>`; };
  const W = 44, D = 34, F = 22, S = 58, M = 14;
  const floors = [4, 6, 3, 5, 4, 3];
  const bad = 3, badFloor = 2; // fourth building, third floor
  const gx0 = -M, gx1 = S * (floors.length - 1) + W + M, gz0 = -M, gz1 = D + M;
  let s = `<rect class="vi-grid" x="0" y="0" width="560" height="380"/>`;
  s += `<g class="pf-scene">`;
  // ground plane and faint grid
  s += `<polygon class="pf-ground" points="${pt(P(gx0, 0, gz0))} ${pt(P(gx1, 0, gz0))} ${pt(P(gx1, 0, gz1))} ${pt(P(gx0, 0, gz1))}"/>`;
  let g = "";
  for (let x = gx0 + 29; x < gx1; x += 29) g += seg([x, 0, gz0], [x, 0, gz1]);
  for (let z = gz0 + 31; z < gz1; z += 31) g += seg([gx0, 0, z], [gx1, 0, z]);
  s += `<path class="pf-grid" d="${g.trim()}"/>`;
  floors.forEach((n, i) => {
    const x0 = i * S, x1 = x0 + W, H = n * F, cx = x0 + W / 2, cz = D / 2;
    s += `<g class="pf-bldg">`;
    s += `<polygon class="pf-face" points="${pt(P(x0, 0, D))} ${pt(P(x1, 0, D))} ${pt(P(x1, H, D))} ${pt(P(x0, H, D))}"/>`;
    s += `<polygon class="pf-face" points="${pt(P(x1, 0, 0))} ${pt(P(x1, 0, D))} ${pt(P(x1, H, D))} ${pt(P(x1, H, 0))}"/>`;
    s += `<polygon class="pf-roof" points="${pt(P(x0, H, 0))} ${pt(P(x1, H, 0))} ${pt(P(x1, H, D))} ${pt(P(x0, H, D))}"/>`;
    for (let f = 0; f < n; f++) {
      const y0 = f * F + 6, y1 = f * F + 16;
      [[7, 19], [25, 37]].forEach(([a, b]) => { s += `<polygon class="pf-win" points="${pt(P(x0 + a, y0, D))} ${pt(P(x0 + b, y0, D))} ${pt(P(x0 + b, y1, D))} ${pt(P(x0 + a, y1, D))}"/>`; });
      [[6, 14], [20, 28]].forEach(([a, b]) => { s += `<polygon class="pf-win" points="${pt(P(x1, y0, a))} ${pt(P(x1, y0, b))} ${pt(P(x1, y1, b))} ${pt(P(x1, y1, a))}"/>`; });
    }
    let thin = "", strong = "";
    for (let f = 0; f <= n; f++) {
      const y = f * F, d = seg([x0, y, 0], [x1, y, 0]) + seg([x0, y, 0], [x0, y, D]) + seg([x1, y, 0], [x1, y, D]) + seg([x0, y, D], [x1, y, D]);
      if (f === 0 || f === n) strong += d; else thin += d;
    }
    [[x0, 0], [x1, 0], [x1, D], [x0, D]].forEach(([x, z]) => { strong += seg([x, 0, z], [x, H, z]); });
    if (thin) s += `<path class="pf-edge" d="${thin.trim()}"/>`;
    s += `<path class="pf-edge pf-edge-strong" d="${strong.trim()}"/>`;
    s += ln([cx, 0, cz], [cx, H, cz], "pf-riser");
    if (i === bad) {
      s += `<g class="pf-anomaly">`;
      s += ln([cx, badFloor * F, cz], [cx, (badFloor + 1) * F, cz], "pf-glow");
      s += ln([cx, badFloor * F, cz], [cx, (badFloor + 1) * F, cz], "pf-riser-bad");
      s += `</g>`;
    }
    const [dx, dy] = P(cx, H, cz), delay = `animation-delay:${(-i * 0.53).toFixed(2)}s`;
    if (i === bad) {
      s += `<g class="pf-ok-only"><circle class="pf-ring" cx="${f1(dx)}" cy="${f1(dy)}" r="4" style="${delay}"/></g>`;
      s += `<circle class="pf-dot" cx="${f1(dx)}" cy="${f1(dy)}" r="4"/>`;
      s += `<g class="pf-bad"><circle class="pf-ring pf-ring-bad" cx="${f1(dx)}" cy="${f1(dy)}" r="4" style="${delay}"/><circle class="pf-dot-bad" cx="${f1(dx)}" cy="${f1(dy)}" r="4"/></g>`;
    } else {
      s += `<circle class="pf-ring" cx="${f1(dx)}" cy="${f1(dy)}" r="4" style="${delay}"/>`;
      s += `<circle class="pf-dot" cx="${f1(dx)}" cy="${f1(dy)}" r="4"/>`;
    }
    s += `</g>`;
  });
  // alert callout, upper right of the fourth building
  const l1 = `${A.building}, ${A.riser}`;
  const l2 = `${A.severityLabel}: ${A.severity}`;
  const l3 = `${A.checkLabel}: ${String(A.check).split(". ")[0].replace(/\.$/, "")}.`;
  // rough text widths (Inter, 12px bold and 11px) so long languages still fit
  const cw = Math.max(200, Math.ceil(Math.max(l1.length * 7.6, (l2.length + 2) * 6.8, l3.length * 6.8)) + 24);
  const ch = 64;
  const [ax, ay] = P(bad * S + W / 2, badFloor * F + F / 2, D / 2);
  const bx = Math.min(560 - cw - 10, ax + 70), by = 22;
  s += `<g class="vi-labels pf-callout"><g class="pf-callout-in">`;
  s += `<line class="vi-leader" x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx + 16)}" y2="${by + ch}"/>`;
  s += `<circle class="vi-leader-end" cx="${f1(ax)}" cy="${f1(ay)}" r="2.5"/>`;
  s += `<rect class="pf-callout-bg" x="${f1(bx)}" y="${by}" width="${cw}" height="${ch}" rx="8"/>`;
  s += `<text class="vi-text vi-text-strong pf-l1" x="${f1(bx + 12)}" y="${by + 20}">${esc(l1)}</text>`;
  s += `<circle class="pf-sev-dot" cx="${f1(bx + 15)}" cy="${by + 34}" r="3"/>`;
  s += `<text class="vi-text pf-l2" x="${f1(bx + 24)}" y="${by + 38.5}">${esc(l2)}</text>`;
  s += `<text class="vi-text vi-text-muted pf-l3" x="${f1(bx + 12)}" y="${by + 55}">${esc(l3)}</text>`;
  s += `</g></g>`;
  s += `</g>`;
  return `<svg class="vis vis-portfolio" viewBox="0 0 560 380" role="img" aria-label="${esc(t.realEstate.visual.alt)}" focusable="false">${s}</svg>`;
}


function productHeroSvg(t) {
  const L = t.product.hero.visual;
  const f1 = (n) => n.toFixed(1);
  let s = `<rect class="vi-grid" x="0" y="0" width="560" height="380"/>`;
  // stage 1: pipe segment with the shared clamp-on sensor (as on the home hero) and its wave arcs
  const pc = 214, pR = 18, psx = 86;
  s += `<defs>${kit.defs("ph", "x", pc, pR)}</defs>`;
  s += kit.pipe("ph", "x", 16, 156, pc, pR);
  s += kit.waves("ph", "x", psx, pc, pR, -1, 3);
  s += kit.sensor("ph", "x", psx, pc, pR, -1);
  // stage 2: mini chart with a learned band and the live line leaving it
  const px0 = 214, px1 = 366;
  const X = (u) => px0 + (px1 - px0) * u;
  const base = (u) => 200 + 7 * Math.sin(u * 3 * Math.PI);
  const live = (u) => base(u) + (u > 0.7 ? -66 * Math.pow((u - 0.7) / 0.3, 1.6) : 1.5 * Math.sin(u * 22));
  const N = 36;
  let top = "", bot = "", ok = "", bad = "";
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    top += (i ? " L" : "M") + f1(X(u)) + " " + f1(base(u) - 13);
    const ub = 1 - u;
    bot += " L" + f1(X(ub)) + " " + f1(base(ub) + 13);
    const p = f1(X(u)) + " " + f1(live(u));
    if (u <= 0.7 + 1e-9) ok += (i ? " L" : "M") + p;
    if (u >= 0.7 - 1e-9) bad += (bad ? " L" : "M") + p;
  }
  const end = [X(1), live(1)];
  s += `<rect class="ph-panel" x="200" y="92" width="180" height="190" rx="10"/>`;
  s += `<path class="ph-gridline" d="M${px0} 160 H${px1} M${px0} 200 H${px1} M${px0} 240 H${px1}"/>`;
  s += `<path class="ph-band" d="${top}${bot} Z"/>`;
  s += `<path class="ph-live" d="${ok}"/>`;
  s += `<path class="ph-live ph-live-bad" d="${bad}"/>`;
  s += `<circle class="ph-flag" cx="${f1(end[0])}" cy="${f1(end[1])}" r="4"/>`;
  // stage 3: building twin, five floors and two risers
  const bx = 425, bw = 100, by = 120, fh = 35, bb = by + fh * 5;
  let floors = "";
  for (let f = 1; f < 5; f++) floors += `M${bx} ${by + f * fh} H${bx + bw} `;
  s += `<line class="ph-ground" x1="410" y1="${bb}" x2="540" y2="${bb}"/>`;
  s += `<rect class="ph-bldg" x="${bx}" y="${by}" width="${bw}" height="${fh * 5}" rx="3"/>`;
  s += `<path class="ph-floor" d="${floors.trim()}"/>`;
  const rA = 455, rB = 495, fc = (n) => bb - (n - 0.5) * fh; // centre of floor n, counted from the ground
  s += `<path class="ph-riser" d="M${rA} ${by} V${bb} M${rB} ${by} V${bb}"/>`;
  s += `<line class="ph-riser-glow" x1="${rB}" y1="${fc(5)}" x2="${rB}" y2="${fc(3)}"/>`;
  s += `<line class="ph-riser-bad" x1="${rB}" y1="${fc(5)}" x2="${rB}" y2="${fc(3)}"/>`;
  [1, 3, 5].forEach((n) => {
    s += `<circle class="ph-dot" cx="${rA}" cy="${fc(n)}" r="3"/>`;
    s += `<circle class="${n >= 3 ? "ph-dot-bad" : "ph-dot"}" cx="${rB}" cy="${fc(n)}" r="3"/>`;
  });
  // alert chip above the building (text width estimated so longer languages fit)
  const cw = Math.max(100, Math.ceil(String(L.alert).length * 7.8) + 34);
  const cx = Math.min(548 - cw, Math.max(396, 475 - cw / 2)), cy = 70;
  s += `<g class="ph-alert"><rect class="ph-chip" x="${f1(cx)}" y="${cy}" width="${cw}" height="24" rx="12"/><circle class="ph-chip-dot" cx="${f1(cx + 12)}" cy="${cy + 12}" r="3"/></g>`;
  // data path: sensor to chart, through the live line, then to the alert chip
  const c1 = `M${psx + 2.05 * pR} ${n2(pc - pR - 0.4 * pR)} C150 ${n2(pc - pR - 0.4 * pR)} 175 ${f1(live(0))} ${px0} ${f1(live(0))}`;
  const c2 = `M${f1(end[0])} ${f1(end[1])} C392 ${f1(end[1])} ${f1(cx - 30)} ${cy + 12} ${f1(cx - 10)} ${cy + 12}`;
  const motion = `${c1} L${ok.slice(1)} L${bad.slice(1)} C392 ${f1(end[1])} ${f1(cx - 30)} ${cy + 12} ${f1(cx - 10)} ${cy + 12}`;
  s += `<path class="ph-data" d="${c1} ${c2}"/>`;
  s += `<circle class="ph-pulse-glow" r="9" style="offset-path: path('${motion}')"/>`;
  s += `<circle class="ph-pulse" r="4" style="offset-path: path('${motion}')"/>`;
  // labels (hidden on phones)
  s += `<g class="vi-labels">`;
  s += `<text class="vi-text vi-text-muted" x="${psx}" y="${pc + pR + 30}" text-anchor="middle">${esc(L.sensor)}</text>`;
  s += `<line class="ph-key-live" x1="214" y1="113" x2="230" y2="113"/><text class="vi-text" x="236" y="117">${esc(L.live)}</text>`;
  s += `<rect class="ph-key-band" x="214" y="126" width="16" height="9" rx="2"/><text class="vi-text vi-text-muted" x="236" y="134">${esc(L.baseline)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="475" y="${bb + 26}" text-anchor="middle">${esc(L.twin)}</text>`;
  s += `<text class="vi-text vi-text-bad ph-chip-text" x="${f1(cx + 22)}" y="${cy + 16}">${esc(L.alert)}</text>`;
  s += `</g>`;
  return `<svg class="vis vis-product-hero" viewBox="0 0 560 380" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}


function sensorSvg(t) {
  const L = t.product.sensors.visual;
  // the shared sensor close up: clamped on top of a pipe, a window in the wall shows the water flowing,
  // wave arcs cross the flow from the wall under the sensor. Three plain labels.
  const cy = 214, R = 64, x0 = 24, x1 = 616, w0 = 150, w1 = 490, sx = 320;
  let s = `<defs>${kit.defs("ss", "x", cy, R)}</defs>`;
  s += kit.pipe("ss", "x", x0, x1, cy, R, [w0, w1]);
  s += kit.stream("ss", "x", [w0, w1], cy, R, 1);
  s += kit.waves("ss", "x", sx, cy, R, -1, 3);
  s += kit.sensor("ss", "x", sx, cy, R, -1);
  const top = cy - R - 1.3 - 0.76 * R;
  const ay = cy + R + 34;
  s += `<g class="vi-labels">`;
  s += `<text class="sk-label sk-label-strong" x="${sx}" y="${n2(top - 26)}" text-anchor="middle">${esc(L.sensor)}</text>`;
  s += `<path class="vi-leader" d="M${sx} ${n2(top - 18)}V${n2(top - 4)}"/>`;
  s += `<path class="vi-leader" d="M${sx} ${ay - 8}V${cy + 18}"/><circle class="vi-leader-end" cx="${sx}" cy="${cy + 18}" r="3"/>`;
  s += `<text class="sk-label" x="${sx}" y="${ay + 14}" text-anchor="middle">${esc(L.signal)}</text>`;
  s += `<path class="sk-flow-arrow" d="M${x1 - 120} ${ay}H${x1 - 30}M${x1 - 40} ${ay - 7}L${x1 - 30} ${ay}L${x1 - 40} ${ay + 7}"/>`;
  s += `<text class="sk-label" x="${x1 - 30}" y="${ay + 30}" text-anchor="end">${esc(L.flow)}</text>`;
  s += `</g>`;
  return `<svg class="vis vis-sensor" viewBox="0 30 640 330" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

module.exports = { installSvg, rackSvg, mlSvg, severitySvg, portfolioSvg, productHeroSvg, sensorSvg };
