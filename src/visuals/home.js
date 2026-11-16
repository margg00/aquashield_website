/*
  Home page drawings, in the same isometric projection and line weight as the
  hero (src/hero.js). Styles and motion in src/css/home.css.

    homeClampSvg(t)      a sensor snaps onto a pipe and sends waves along it
    homeLearnSvg(t)      the building's normal rhythm: a calm waveform in a soft band
    homeLocateSvg(t)     a building outline, one riser segment lights up, a pin drops
    portfolioStageSvg(t) a block of monitored buildings, one flags, an alert card,
                         then a check mark (wide composition plus a phone one)

  Each plays once when its frame gets is-playing (script.js), then idles.
  Under reduced motion the finished state shows.
*/

const COS = Math.cos(Math.PI / 6);
const ER = 1.2247, EB = 0.7071;
const n2 = (v) => String(Math.round(v * 100) / 100);
const pt = (p) => `${n2(p[0])},${n2(p[1])}`;
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const proj = (ox, oy, k = 1) => (x, y, z) => [ox + (x - z) * COS * k, oy + ((x + z) * 0.5 - y) * k];
const seg = (A, B) => `M${n2(A[0])} ${n2(A[1])}L${n2(B[0])} ${n2(B[1])}`;
const poly = (pts) => `M${pts.map(pt).join("L")}Z`;

// Front (visible) half of a ring of radius r around an axis through c (3D), sampled.
// axis: "x" ring in the y-z plane, "y" ring in the x-z plane. Visible half faces the viewer (x+y+z grows).
function ringFront(P, c, r, axis, back) {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const phi = (-Math.PI / 4) + (Math.PI * i) / 24 + (back ? Math.PI : 0);
    const a = r * Math.cos(phi), b = r * Math.sin(phi);
    const q = axis === "x" ? [c[0], c[1] + a, c[2] + b] : [c[0] + a, c[1], c[2] + b];
    pts.push(P(...q));
  }
  return `M${pts.map(pt).join("L")}`;
}

// Iso box faces (three visible faces) for x0..x1, y0..y1, z0..z1.
function box(P, x0, x1, y0, y1, z0, z1) {
  return {
    left: poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
    right: poly([P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)]),
    top: poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]),
    edges: seg(P(x0, y1, z0), P(x1, y1, z0)) + seg(P(x1, y1, z0), P(x1, y1, z1)) + seg(P(x1, y1, z1), P(x0, y1, z1)) + seg(P(x0, y1, z1), P(x0, y1, z0)) +
      seg(P(x1, y0, z0), P(x1, y1, z0)) + seg(P(x1, y0, z1), P(x1, y1, z1)) + seg(P(x0, y0, z1), P(x0, y1, z1)) +
      seg(P(x1, y0, z0), P(x1, y0, z1)) + seg(P(x1, y0, z1), P(x0, y0, z1))
  };
}

const svgOpen = (cls, vb, label) => `<svg class="vis hm-svg ${cls}" viewBox="${vb}" role="img" aria-label="${esc(label)}" focusable="false">`;

// ---------- 1. Clamp on ----------
function homeClampSvg(t) {
  const P = proj(200, 158);
  const r = 30; // pipe radius
  const x0 = -260, x1 = 150;
  const A = P(x0, 0, 0), B = P(x1, 0, 0);
  const nrm = [0.5, -0.866]; // screen normal of an x-axis tube, pointing up-right
  const w = ER * r;
  const side = (p, s) => [p[0] + nrm[0] * w * s, p[1] + nrm[1] * w * s];
  let s = `<defs><linearGradient id="hm-pipe" gradientUnits="userSpaceOnUse" x1="${n2(200 + nrm[0] * w)}" y1="${n2(158 + nrm[1] * w)}" x2="${n2(200 - nrm[0] * w)}" y2="${n2(158 - nrm[1] * w)}">` +
    `<stop offset="0" stop-color="#3b5466"/><stop offset="0.35" stop-color="#2a4152"/><stop offset="1" stop-color="#0d151b"/></linearGradient>` +
    `<linearGradient id="hm-steel" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#cdd6dd"/><stop offset="1" stop-color="#5d6a74"/></linearGradient></defs>`;
  // pipe body, shine, open end with water
  s += `<path fill="url(#hm-pipe)" d="${poly([side(A, 1), side(B, 1), side(B, -1), side(A, -1)])}"/>`;
  s += `<path class="hm-shine" d="${seg(side(A, 0.55), side(B, 0.55))}"/>`;
  s += `<path class="hm-pipe-edge" d="${seg(side(A, 1), side(B, 1))}${seg(side(A, -1), side(B, -1))}"/>`;
  s += `<ellipse class="hm-pipe-end" cx="${n2(B[0])}" cy="${n2(B[1])}" rx="${n2(ER * r)}" ry="${n2(EB * r)}" transform="rotate(-60 ${n2(B[0])} ${n2(B[1])})"/>`;
  s += `<ellipse class="hm-water-end" cx="${n2(B[0])}" cy="${n2(B[1])}" rx="${n2(ER * (r - 5))}" ry="${n2(EB * (r - 5))}" transform="rotate(-60 ${n2(B[0])} ${n2(B[1])})"/>`;
  // waves: the shared wave style (arcs that spread from the wall under the sensor and fade, as on the home
  // hero), clipped to the pipe body
  const along = [COS, 0.5];
  const C = P(-50, r, 0);
  const ang = Math.atan2(along[1], along[0]) * 180 / Math.PI;
  const arc = (k) => `M${n2(C[0] - along[0] * k * 1.3)} ${n2(C[1] - along[1] * k * 1.3)}A${n2(k * 1.3)} ${n2(k)} ${n2(ang)} 0 0 ${n2(C[0] + along[0] * k * 1.3)} ${n2(C[1] + along[1] * k * 1.3)}`;
  s += `<defs><clipPath id="hm-body"><path d="${poly([side(A, 1), side(B, 1), side(B, -1), side(A, -1)])}"/></clipPath></defs>`;
  let waves = "";
  for (let i = 0; i < 3; i++) waves += `<path class="sk-wave" d="${arc(2 * w)}" style="stroke-width:2;transform-origin:${n2(C[0])}px ${n2(C[1])}px;animation-delay:${n2(1 + i * 0.6)}s"/>`;
  s += `<g clip-path="url(#hm-body)">${waves}<path class="sk-wave-still" style="stroke-width:2" d="${arc(0.7 * w)}${arc(1.3 * w)}"/></g>`;
  // sensor: the shared housing (4.1 r long, 0.76 r deep, lighter lip, hairlines, LED) and two steel bands
  // at its ends, as on the home hero
  let sensor = "";
  [-106, 6].forEach((x) => {
    sensor += `<path class="hm-strap" d="${ringFront(P, [x, 0, 0], r + 2, "x")}"/>`;
  });
  const bx = box(P, -112, 12, r - 2, r + 21, -14, 14);
  sensor += `<path class="hm-house-l" d="${bx.left}"/><path class="hm-house-r" d="${bx.right}"/><path class="hm-house-t" d="${bx.top}"/><path class="hm-house-e" d="${bx.edges}"/>`;
  sensor += `<path class="hm-house-line" d="${seg(P(-96, r + 13, 14), P(-66, r + 13, 14))}${seg(P(-96, r + 8, 14), P(-78, r + 8, 14))}"/>`;
  const led = P(-2, r + 9, 14);
  sensor += `<circle class="hm-led" cx="${n2(led[0])}" cy="${n2(led[1])}" r="2.6"/>`;
  s += `<g class="hm-sensor">${sensor}</g>`;
  return svgOpen("hm-clamp", "0 0 400 300", t.home.how.steps[0].alt) + s + `</svg>`;
}

// ---------- 2. Learn ----------
function homeLearnSvg(t) {
  const L = 170; // one day, the pattern repeats
  const y0 = 158;
  // daily rhythm: quiet night, morning peak, midday plateau, evening peak
  const day = [[0, 26], [0.3, 2], [0.42, -30], [0.6, -12], [0.78, -36], [1, 26]];
  const pts = [];
  for (let d = -1; d < 4; d++) day.forEach(([u, v], i) => { if (i === 0 && d > -1) return; pts.push([20 + (d + u) * L, y0 + v]); });
  const smooth = (arr, dy = 0) => {
    let p = `M${n2(arr[0][0])} ${n2(arr[0][1] + dy)}`;
    for (let i = 1; i < arr.length; i++) {
      const a = arr[i - 1], c = arr[i], mx = (a[0] + c[0]) / 2;
      p += `C${n2(mx)} ${n2(a[1] + dy)} ${n2(mx)} ${n2(c[1] + dy)} ${n2(c[0])} ${n2(c[1] + dy)}`;
    }
    return p;
  };
  const top = smooth(pts, -26), bottom = smooth(pts.slice().reverse(), 26);
  const band = `${top}L${bottom.slice(1)}Z`;
  // the live line wobbles a little around the centre of the band
  const live = pts.map(([x, y], i) => [x, y + (i % 3 === 0 ? 3 : i % 3 === 1 ? -2 : 1)]);
  let s = `<defs><linearGradient id="hm-fade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.14" stop-color="#fff"/><stop offset="0.86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="hm-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="300"><rect x="0" y="0" width="400" height="300" fill="url(#hm-fade)"/></mask></defs>`;
  s += `<g mask="url(#hm-mask)"><g class="hm-learn-in"><g class="hm-drift">`;
  s += `<path class="hm-band" d="${band}"/>`;
  s += `<path class="hm-live" pathLength="1" d="${smooth(live)}"/>`;
  s += `</g></g></g>`;
  return svgOpen("hm-learn", "0 0 400 300", t.home.how.steps[1].alt) + s + `</svg>`;
}

// ---------- 3. Locate ----------
function homeLocateSvg(t) {
  const P = proj(186, 198);
  const W = 120, D = 90, F = 34, N = 5, H = F * N;
  const rx = 62, rz = 45, rr = 3.4, hotF = 2;
  let s = "";
  s += `<path class="hm-ground" d="${poly([P(-24, 0, -24), P(W + 24, 0, -24), P(W + 24, 0, D + 24), P(-24, 0, D + 24)])}"/>`;
  // back walls, floors
  s += `<path class="hm-wall-back" d="${poly([P(0, 0, 0), P(W, 0, 0), P(W, H, 0), P(0, H, 0)])}${poly([P(0, 0, 0), P(0, 0, D), P(0, H, D), P(0, H, 0)])}"/>`;
  let floors = "";
  for (let k = 1; k < N; k++) floors += poly([P(0, k * F, 0), P(W, k * F, 0), P(W, k * F, D), P(0, k * F, D)]);
  s += `<path class="hm-floors" d="${floors}"/>`;
  // floors to check (3 to 5) and the riser as a tube
  s += `<path class="hm-zone" d="${poly([P(rx - 22, hotF * F + 0.5, rz - 22), P(rx + 22, hotF * F + 0.5, rz - 22), P(rx + 22, hotF * F + 0.5, rz + 22), P(rx - 22, hotF * F + 0.5, rz + 22)])}"/>`;
  const a = P(rx, 0, rz), b = P(rx, H - 6, rz);
  s += `<path class="hm-riser" stroke-width="${n2(2 * ER * rr)}" d="${seg(a, b)}"/>`;
  s += `<path class="hm-riser-hi" d="${seg([a[0] - 0.42 * ER * rr, a[1]], [b[0] - 0.42 * ER * rr, b[1]])}"/>`;
  s += `<ellipse class="hm-riser-cap" cx="${n2(b[0])}" cy="${n2(b[1])}" rx="${n2(ER * rr)}" ry="${n2(EB * rr)}"/>`;
  const h0 = P(rx, hotF * F, rz), h1 = P(rx, (hotF + 1) * F, rz);
  s += `<g class="hm-hot"><path class="hm-hot-glow" stroke-width="${n2(2 * ER * rr + 9)}" d="${seg(h0, h1)}"/><path class="hm-hot-line" stroke-width="${n2(2 * ER * rr)}" d="${seg(h0, h1)}"/></g>`;
  // front glass and outline, drawn as one path (draws itself in)
  s += `<path class="hm-glass" d="${poly([P(0, 0, D), P(W, 0, D), P(W, H, D), P(0, H, D)])}${poly([P(W, 0, 0), P(W, 0, D), P(W, H, D), P(W, H, 0)])}"/>`;
  const bx = box(P, 0, W, 0, H, 0, D);
  s += `<path class="hm-outline" pathLength="1" d="${bx.edges}"/>`;
  // pin, dropping onto the hot segment
  const pm = P(rx, hotF * F + F / 2, rz);
  s += `<g class="hm-ping">${`<ellipse class="hm-ping-ring" cx="${n2(pm[0])}" cy="${n2(pm[1])}" rx="${n2(ER * 12)}" ry="${n2(EB * 12)}"/>`}</g>`;
  s += `<g class="hm-pin"><path class="hm-pin-body" d="M${n2(pm[0])} ${n2(pm[1] - 4)}C${n2(pm[0] - 4)} ${n2(pm[1] - 16)} ${n2(pm[0] - 15)} ${n2(pm[1] - 24)} ${n2(pm[0] - 15)} ${n2(pm[1] - 36)}A15 15 0 0 1 ${n2(pm[0] + 15)} ${n2(pm[1] - 36)}C${n2(pm[0] + 15)} ${n2(pm[1] - 24)} ${n2(pm[0] + 4)} ${n2(pm[1] - 16)} ${n2(pm[0])} ${n2(pm[1] - 4)}Z"/><circle class="hm-pin-hole" cx="${n2(pm[0])}" cy="${n2(pm[1] - 36)}" r="5.5"/></g>`;
  return svgOpen("hm-locate", "0 0 400 300", t.home.how.steps[2].alt) + s + `</svg>`;
}

// ---------- 4. Portfolio stage ----------
function stage(t, layout) {
  const T = t.home.portfolio;
  const phone = layout === "phone";
  const VBW = phone ? 400 : 1120, VBH = phone ? 500 : 420;
  const P = phone ? proj(70, 160) : proj(76, 196);
  // lots: rows run along the screen horizontal (x up, z down in step)
  const lots = [];
  const cols = phone ? 3 : 7, rows = phone ? 3 : 2, step = phone ? 64 : 86, rowStep = phone ? 58 : 70;
  const heights = phone ? [4, 6, 3, 5, 3, 4, 6, 3, 5] : [5, 3, 7, 4, 6, 3, 5, 4, 6, 3, 5, 7, 4, 3];
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const sx = c * step + (row % 2) * step / 2, sz = -c * step - (row % 2) * step / 2;
      lots.push({ x: sx + row * rowStep, z: sz + row * rowStep, n: heights[(row * cols + c) % heights.length] });
    }
  }
  const flagIdx = phone ? 4 : 10; // "Building 14" in the copy
  lots.forEach((l, i) => { l.i = i; });
  const order = lots.slice().sort((p, q) => (p.x + p.z) - (q.x + q.z) || (p.x - p.z) - (q.x - q.z));
  const w = phone ? 50 : 58, d = phone ? 50 : 58, fh = phone ? 17 : 19;
  let s = "";
  // ground plane
  const gx = Math.min(...lots.map((l) => l.x)) - 40, gX = Math.max(...lots.map((l) => l.x)) + w + 40;
  const gz = Math.min(...lots.map((l) => l.z)) - 40, gZ = Math.max(...lots.map((l) => l.z)) + d + 40;
  s += `<path class="pf-ground" d="${poly([P(gx, 0, gz), P(gX, 0, gz), P(gX, 0, gZ), P(gx, 0, gZ)])}"/>`;
  let flagged = null;
  order.forEach((l, k) => {
    const h = l.n * fh;
    const bx = box(P, l.x, l.x + w, 0, h, l.z, l.z + d);
    let fl = "";
    for (let f = 1; f < l.n; f++) fl += seg(P(l.x, f * fh, l.z + d), P(l.x + w, f * fh, l.z + d)) + seg(P(l.x + w, f * fh, l.z + d), P(l.x + w, f * fh, l.z));
    const roof = P(l.x + w / 2, h, l.z + d / 2);
    const isFlag = l.i === flagIdx;
    let g = `<g class="pf-b${isFlag ? " pf-b-flag" : ""}" style="--i:${k}">`;
    g += `<path class="pf-l" d="${bx.left}"/><path class="pf-r" d="${bx.right}"/><path class="pf-t" d="${bx.top}"/>`;
    if (isFlag) g += `<path class="pf-alert-face" d="${bx.left}${bx.right}"/>`;
    g += `<path class="pf-fl" d="${fl}"/><path class="pf-e" d="${bx.edges}"/>`;
    g += `<ellipse class="pf-ring" cx="${n2(roof[0])}" cy="${n2(roof[1])}" rx="${n2(ER * 11)}" ry="${n2(EB * 11)}" style="--i:${k}"/>`;
    g += `<ellipse class="pf-node" cx="${n2(roof[0])}" cy="${n2(roof[1])}" rx="${n2(ER * 6)}" ry="${n2(EB * 6)}"/>`;
    if (isFlag) {
      g += `<ellipse class="pf-alert-ring" cx="${n2(roof[0])}" cy="${n2(roof[1])}" rx="${n2(ER * 16)}" ry="${n2(EB * 16)}"/>`;
      g += `<ellipse class="pf-alert-node" cx="${n2(roof[0])}" cy="${n2(roof[1])}" rx="${n2(ER * 7)}" ry="${n2(EB * 7)}"/>`;
      g += `<g class="pf-check"><circle cx="${n2(roof[0])}" cy="${n2(roof[1] - 22)}" r="12"/><path d="M${n2(roof[0] - 5.5)} ${n2(roof[1] - 22)}l3.8 3.8 7-7.6"/></g>`;
      flagged = roof;
    }
    g += `</g>`;
    s += g;
  });

  // alert card
  const fs = phone ? 17 : 15;
  const longest = Math.max(T.building.length, T.detail.length, T.done.length);
  const cw = phone ? 352 : Math.round(longest * fs * 0.5 + 72), ch = phone ? 92 : 82;
  const cx = phone ? 24 : Math.min(flagged[0] + 70, VBW - cw - 20), cy = phone ? 380 : flagged[1] - 30;
  const tip = phone ? [flagged[0], flagged[1] + 6] : [flagged[0] + 18, flagged[1]];
  const join = phone ? [flagged[0], cy] : [cx, cy + ch / 2];
  s += `<g class="pf-card"><path class="pf-leader" d="M${n2(tip[0])} ${n2(tip[1])}${phone ? `L${n2(join[0])} ${n2(join[1])}` : `L${n2(join[0] - 22)} ${n2(join[1])}H${n2(join[0])}`}"/>`;
  s += `<rect class="pf-card-bg" x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="14"/>`;
  s += `<g class="pf-card-alert"><circle class="pf-card-dot" cx="${cx + 24}" cy="${cy + 30}" r="5"/><text class="pf-card-title" x="${cx + 40}" y="${cy + 35}" style="font-size:${fs + 1}px">${esc(T.building)}</text><text class="pf-card-text" x="${cx + 40}" y="${cy + 60}" style="font-size:${fs}px">${esc(T.detail)}</text></g>`;
  s += `<g class="pf-card-done"><circle class="pf-card-ok" cx="${cx + 26}" cy="${cy + ch / 2}" r="11"/><path class="pf-card-tick" d="M${cx + 21} ${cy + ch / 2}l3.6 3.6 6.4-7"/><text class="pf-card-title" x="${cx + 46}" y="${cy + ch / 2 - 5}" style="font-size:${fs + 1}px">${esc(T.done)}</text><text class="pf-card-text" x="${cx + 46}" y="${cy + ch / 2 + 17}" style="font-size:${fs - 1}px">${esc(T.building)}</text></g>`;
  s += `</g>`;
  return `<svg class="pf-svg pf-${layout}" viewBox="0 0 ${VBW} ${VBH}" role="img" aria-label="${esc(T.alt)}" focusable="false">${s}</svg>`;
}

function portfolioStageSvg(t) {
  return stage(t, "desk") + stage(t, "phone");
}

module.exports = { homeClampSvg, homeLearnSvg, homeLocateSvg, portfolioStageSvg };
