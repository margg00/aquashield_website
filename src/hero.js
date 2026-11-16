/*
  Home hero: the launch video as one 11.2 second CSS sequence in three acts.
  It plays once and rests on act 3 (no loop).

    Act 1   0 to 2.5 s    inside the pipe: a cut-away riser in isometric 3D, water
                          streaming up, a clamp-on sensor sending waves across it
            2.5 to 4.4 s  the camera pulls back: the pipe becomes riser B
    Act 2   4.4 to 8.6 s  the glass building: water rises through the floors,
                          riser B lights up at floor 3, a callout names it
            8.6 to 10.6 s the camera pulls back again
    Act 3  from 10.6 s    the portfolio: a city block, every building monitored,
                          the flagged building outlined (in by 11.2 s). It stays:
                          only the blue node pulses and the flag ring keep moving.

  Everything is drawn in one isometric projection. Pipes are tubes: in this
  projection a tube of radius r along any of the three axes is 2.45 r wide on
  screen, so a stroke of that width with a highlight and ellipse caps and
  collars is geometrically exact. Painter order is storey by storey (slab,
  then what stands on it), back to front inside a storey.

  The camera is a CSS transform on two groups (the world and the close-up),
  with keyframes computed here so both stay locked together during the zoom.
  They are emitted in a <style> next to the drawing, inside a
  prefers-reduced-motion: no-preference query. The default (static) state is
  the resting act 3 view, so reduced motion shows where the sequence ends.
  Styles live in src/css/home.css (its --hx-seq must equal SEQ below).

  heroBuildingSvg(t, { twin: true }) returns the static building alone (Product
  and Team pages).
*/

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const COS = Math.cos(Math.PI / 6);
const TW = 2 * 1.2247; // on-screen width of a tube per unit radius
const ER = 1.2247, EB = 0.7071; // horizontal circle of radius 1: ellipse semi-axes on screen
const n2 = (v) => String(Math.round(v * 100) / 100);
const pt = (p) => `${n2(p[0])},${n2(p[1])}`;
const proj = (ox, oy) => (x, y, z) => [ox + (x - z) * COS, oy + (x + z) * 0.5 - y];

module.exports = function heroBuildingSvg(t, opts) {
  const twin = Boolean(opts && opts.twin);
  const b = t.building;
  const P = proj(250, 302);

  // Main building
  const W = 180, D = 130, F = 46, N = 5, H = F * N;
  const RR = 4; // riser radius
  const RBR = 2.4; // branch radius
  const risers = [{ x: 40, id: "A" }, { x: 92, id: "B" }, { x: 144, id: "C" }].map((r) => ({ ...r, z: 70 }));
  const rB = risers[1];
  const aFloor = 2; // floor 3
  const SENSOR_Y = 22;
  const seg = (A, B) => `M${n2(A[0])} ${n2(A[1])}L${n2(B[0])} ${n2(B[1])}`;
  const poly = (pts) => `M${pts.map(pt).join("L")}Z`;

  // Tube pieces. dir: "y" vertical, "x" or "z" along the floor axes.
  const HI = { y: [-0.42, 0], x: [0.5 * 0.42, -0.866 * 0.42], z: [-0.5 * 0.42, -0.866 * 0.42] };
  const tubeHi = (A, B, r, dir) => {
    const o = HI[dir].map((v) => v * ER * r);
    return seg([A[0] + o[0], A[1] + o[1]], [B[0] + o[0], B[1] + o[1]]);
  };
  const capRot = { x: -60, z: 60, y: 0 };
  const cap = (p, r, dir, cls) => `<ellipse class="${cls}" cx="${n2(p[0])}" cy="${n2(p[1])}" rx="${n2(ER * r)}" ry="${n2(EB * r)}"${capRot[dir] ? ` transform="rotate(${capRot[dir]} ${n2(p[0])} ${n2(p[1])})"` : ""}/>`;
  const ring = (p, r, cls, extra = "") => `<ellipse class="${cls}" cx="${n2(p[0])}" cy="${n2(p[1])}" rx="${n2(ER * r)}" ry="${n2(EB * r)}"${extra}/>`;

  // Clamp-on sensor on a vertical pipe of radius R whose axis passes through (cx, cy) on screen.
  // The housing sits on the pipe's right silhouette, so its faces are screen-aligned rectangles
  // (radial = screen x, tangent = screen y scaled by 0.707): that is exact for this projection.
  const u = (R) => R / 70;
  const sensor = (cx, cy, R, detail) => {
    const k = u(R), a = ER * R;
    const bandA = ER * (R + 3 * k), bandB = EB * (R + 3 * k);
    const band = (y, h) => `M${n2(cx - bandA)} ${n2(y)}A${n2(bandA)} ${n2(bandB)} 0 0 0 ${n2(cx + bandA)} ${n2(y)}L${n2(cx + bandA)} ${n2(y + h)}A${n2(bandA)} ${n2(bandB)} 0 0 1 ${n2(cx - bandA)} ${n2(y + h)}Z`;
    const hx0 = cx + a + 1 * k, hx1 = cx + a + 54 * k, top = cy - 142 * k, bot = cy + 144 * k, lip = 12 * k;
    let g = `<path class="hx-band" d="${band(cy - 136 * k, 16 * k)}${band(cy + 118 * k, 16 * k)}"/>`;
    g += `<rect class="hx-house-top" x="${n2(hx0)}" y="${n2(top)}" width="${n2(hx1 - hx0)}" height="${n2(lip)}" rx="${n2(4 * k)}"/>`;
    g += `<rect class="hx-house" x="${n2(hx0)}" y="${n2(top + lip)}" width="${n2(hx1 - hx0)}" height="${n2(bot - top - lip)}" rx="${n2(6 * k)}"/>`;
    if (detail) {
      g += `<rect class="hx-house-line" x="${n2(hx0 + 12 * k)}" y="${n2(top + 40 * k)}" width="${n2(30 * k)}" height="${n2(2 * k)}" rx="1"/>`;
      g += `<rect class="hx-house-line" x="${n2(hx0 + 12 * k)}" y="${n2(top + 50 * k)}" width="${n2(20 * k)}" height="${n2(2 * k)}" rx="1"/>`;
      g += `<circle class="hx-led" cx="${n2(hx0 + 16 * k)}" cy="${n2(bot - 26 * k)}" r="${n2(4 * k)}"/>`;
    }
    return g;
  };

  let world = "";

  // ---------- Act 3 context: the city block (behind the main building) ----------
  const S = 250;
  const city = [
    [-2, -2, 150, 120, 7], [-1, -2, 160, 110, 4], [0, -2, 140, 120, 6], [-2, -1, 150, 130, 3],
    [-1, -1, 170, 130, 8], [0, -1, 150, 110, 5], [-2, 0, 160, 120, 5], [-1, 0, 140, 120, 4]
  ];
  const FH = 36;
  if (!twin) {
    let c = `<g class="hx-city">`;
    c += `<path class="hx-city-ground" d="${poly([P(-560, 0, -560), P(240, 0, -560), P(240, 0, 190), P(-560, 0, 190)])}"/>`;
    let streets = "";
    [-310, -60].forEach((v) => { streets += seg(P(v, 0, -560), P(v, 0, 190)) + seg(P(-560, 0, v), P(240, 0, v)); });
    c += `<path class="hx-street" d="${streets}"/>`;
    city.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
    city.forEach(([i, j, w, d, n], idx) => {
      const ox = i * S + (S - 40 - w) / 2 - 40, oz = j * S + (S - 40 - d) / 2 - 40, h = n * FH;
      const Q = (x, y, z) => P(ox + x, y, oz + z);
      c += `<g class="hx-nb">`;
      c += `<path class="hx-nb-l" d="${poly([Q(0, 0, d), Q(w, 0, d), Q(w, h, d), Q(0, h, d)])}"/>`;
      c += `<path class="hx-nb-r" d="${poly([Q(w, 0, 0), Q(w, 0, d), Q(w, h, d), Q(w, h, 0)])}"/>`;
      c += `<path class="hx-nb-roof" d="${poly([Q(0, h, 0), Q(w, h, 0), Q(w, h, d), Q(0, h, d)])}"/>`;
      let fl = "";
      for (let f = 1; f < n; f++) fl += seg(Q(0, f * FH, d), Q(w, f * FH, d)) + seg(Q(w, f * FH, d), Q(w, f * FH, 0));
      c += `<path class="hx-nb-floor" d="${fl}"/>`;
      const top = Q(w / 2, h, d / 2);
      c += ring(top, 12, "hx-node-ring", ` style="animation-delay:${n2(-idx * 0.37)}s"`);
      c += ring(top, 8, "hx-node");
      c += `</g>`;
    });
    c += `</g>`;
    world += c;
  }

  // ---------- Supply main below ground, then the ground pad ----------
  const SY = -18;
  let under = "";
  under += `<path class="hx-tube" stroke-width="${n2(TW * RR)}" d="${seg(P(-60, SY, 70), P(risers[2].x, SY, 70))}"/>`;
  under += `<path class="hx-tube-hi" d="${tubeHi(P(-60, SY, 70), P(risers[2].x, SY, 70), RR, "x")}"/>`;
  risers.forEach((r) => {
    under += `<path class="hx-tube" stroke-width="${n2(TW * RR)}" d="${seg(P(r.x, SY, r.z), P(r.x, 0, r.z))}"/>`;
    under += `<path class="hx-tube-hi" d="${tubeHi(P(r.x, SY, r.z), P(r.x, 0, r.z), RR, "y")}"/>`;
  });
  under += cap(P(risers[2].x + RR, SY, 70), RR, "x", "hx-cap");
  world += `<g class="hx-under">${under}</g>`;

  let pad = `<path class="hx-ground" d="${poly([P(-34, 0, -34), P(W + 34, 0, -34), P(W + 34, 0, D + 34), P(-34, 0, D + 34)])}"/>`;
  let grid = "";
  for (let i = 1; i < 6; i++) {
    const gx = -34 + (W + 68) * (i / 6), gz = -34 + (D + 68) * (i / 6);
    grid += seg(P(gx, 0, -34), P(gx, 0, D + 34)) + seg(P(-34, 0, gz), P(W + 34, 0, gz));
  }
  pad += `<path class="hx-grid" d="${grid}"/>`;
  world += pad;

  // ---------- Back walls ----------
  world += `<path class="hx-wall-back" d="${poly([P(0, 0, 0), P(W, 0, 0), P(W, H, 0), P(0, H, 0)])}${poly([P(0, 0, 0), P(0, 0, D), P(0, H, D), P(0, H, 0)])}"/>`;
  world += `<path class="hx-edge-back" d="${seg(P(0, 0, 0), P(0, H, 0))}"/>`;

  // ---------- Water filling the building (clipped to its silhouette) ----------
  const LEVEL = H - 10;
  const sil = [P(0, H, 0), P(W, H, 0), P(W, 0, 0), P(W, 0, D), P(0, 0, D), P(0, H, D)];
  const clipId = twin ? "hx-clip-t" : "hx-clip";
  world += `<clipPath id="${clipId}"><path d="${poly(sil)}"/></clipPath>`;
  let water = `<path class="hx-water-side" d="${poly([P(W, LEVEL, 0), P(W, LEVEL, D), P(W, LEVEL - 2 * H, D), P(W, LEVEL - 2 * H, 0)])}${poly([P(0, LEVEL, D), P(W, LEVEL, D), P(W, LEVEL - 2 * H, D), P(0, LEVEL - 2 * H, D)])}"/>`;
  water += `<path class="hx-water-top" d="${poly([P(0, LEVEL, 0), P(W, LEVEL, 0), P(W, LEVEL, D), P(0, LEVEL, D)])}"/>`;
  world += `<g clip-path="url(#${clipId})"><g class="hx-water">${water}</g></g>`;

  // ---------- Storeys: slab, then what stands on it ----------
  const anomalyAt = P(rB.x, aFloor * F + 23, rB.z);
  for (let k = 0; k <= N; k++) {
    const y = k * F, th = k === 0 ? 6 : 4;
    const top = poly([P(0, y, 0), P(W, y, 0), P(W, y, D), P(0, y, D)]);
    const sides = poly([P(W, y, 0), P(W, y, D), P(W, y - th, D), P(W, y - th, 0)]) + poly([P(0, y, D), P(W, y, D), P(W, y - th, D), P(0, y - th, D)]);
    world += `<path class="hx-slab${k === N ? " hx-roof" : ""}" d="${top}"/><path class="hx-slab-side" d="${sides}"/>`;
    if (k === N) break;

    if (k === aFloor) {
      world += `<path class="hx-alert hx-alert-floor" d="${poly([P(rB.x - 26, y + 0.5, rB.z - 26), P(rB.x + 26, y + 0.5, rB.z - 26), P(rB.x + 26, y + 0.5, rB.z + 26), P(rB.x - 26, y + 0.5, rB.z + 26)])}"/>`;
    }
    const by = y + 32;
    let back = "", backHi = "", tubes = "", hi = "", front = "", frontHi = "", caps = "", collars = "";
    const top2 = k === N - 1 ? H - 8 : y + F;
    risers.forEach((r) => {
      back += seg(P(r.x, by, r.z), P(r.x, by, r.z - 26));
      backHi += tubeHi(P(r.x, by, r.z), P(r.x, by, r.z - 26), RBR, "z");
      collars += ring(P(r.x, y, r.z), RR + 2.6, "hx-collar");
      tubes += seg(P(r.x, y, r.z), P(r.x, top2, r.z));
      hi += tubeHi(P(r.x, y, r.z), P(r.x, top2, r.z), RR, "y");
      front += seg(P(r.x, by, r.z), P(r.x, by, r.z + 32));
      frontHi += tubeHi(P(r.x, by, r.z), P(r.x, by, r.z + 32), RBR, "z");
      caps += cap(P(r.x, by, r.z + 32), RBR, "z", "hx-cap");
      if (k === N - 1) caps += cap(P(r.x, top2, r.z), RR, "y", "hx-cap");
    });
    world += `<g class="hx-storey">`;
    world += `<path class="hx-tube hx-branch" stroke-width="${n2(TW * RBR)}" d="${back}"/><path class="hx-tube-hi" d="${backHi}"/>`;
    world += collars;
    world += `<path class="hx-tube" stroke-width="${n2(TW * RR)}" d="${tubes}"/><path class="hx-tube-hi" d="${hi}"/>`;
    if (k === aFloor) {
      const A = P(rB.x, y, rB.z), B2 = P(rB.x, y + F, rB.z);
      world += `<g class="hx-alert"><path class="hx-alert-glow" stroke-width="${n2(TW * RR + 9)}" d="${seg(A, B2)}"/><path class="hx-tube hx-tube-bad" stroke-width="${n2(TW * RR)}" d="${seg(A, B2)}"/><path class="hx-tube-hi hx-tube-hi-bad" d="${tubeHi(A, B2, RR, "y")}"/></g>`;
    }
    if (k === 0) risers.forEach((r) => { const s0 = P(r.x, SENSOR_Y, r.z); world += `<g class="hx-sensor">${sensor(s0[0], s0[1], RR, false)}</g>`; });
    world += `<path class="hx-tube hx-branch" stroke-width="${n2(TW * RBR)}" d="${front}"/><path class="hx-tube-hi" d="${frontHi}"/>`;
    world += caps;
    world += `</g>`;
  }

  // ---------- Front glass, mullions, edges ----------
  let mull = "";
  for (let i = 1; i < 6; i++) { const x = (W * i) / 6; mull += seg(P(x, 0, D), P(x, H, D)); }
  for (let i = 1; i < 4; i++) { const z = (D * i) / 4; mull += seg(P(W, 0, z), P(W, H, z)); }
  world += `<path class="hx-glass" d="${poly([P(0, 0, D), P(W, 0, D), P(W, H, D), P(0, H, D)])}${poly([P(W, 0, 0), P(W, 0, D), P(W, H, D), P(W, H, 0)])}"/>`;
  world += `<path class="hx-mullion" d="${mull}"/>`;
  let edges = "";
  [[W, 0], [W, D], [0, D]].forEach(([x, z]) => { edges += seg(P(x, 0, z), P(x, H, z)); });
  edges += seg(P(0, H, 0), P(W, H, 0)) + seg(P(W, H, 0), P(W, H, D)) + seg(P(W, H, D), P(0, H, D)) + seg(P(0, H, D), P(0, H, 0));
  edges += seg(P(W, 0, 0), P(W, 0, D)) + seg(P(W, 0, D), P(0, 0, D));
  world += `<path class="hx-edge" d="${edges}"/>`;

  // ---------- Flow and the alert pulse ----------
  if (!twin) {
    world += `<g class="hx-flows">`;
    risers.forEach((r, i) => {
      const a = P(r.x, SY, r.z), c = P(r.x, H - 8, r.z);
      world += `<circle class="hx-flow" r="1.7" style="offset-path:path('M${n2(a[0])} ${n2(a[1])}L${n2(c[0])} ${n2(c[1])}');animation-delay:${n2(-i * 1.3)}s"/>`;
    });
    world += `</g>`;
  }
  world += `<g class="hx-alert">${ring(anomalyAt, 13, "hx-pulse")}${ring(anomalyAt, 13, "hx-pulse hx-pulse-2")}${ring(anomalyAt, 6.5, "hx-dot")}</g>`;

  // Act 3: the flagged building, highlighted
  if (!twin) {
    world += `<g class="hx-flag">`;
    world += `<path class="hx-flag-outline" d="${poly(sil)}"/>`;
    const roof = P(W / 2, H, D / 2);
    world += ring(roof, 26, "hx-flag-ring") + ring(roof, 11, "hx-flag-dot");
    world += `</g>`;
  }

  // ---------- Callout: riser B, floor 3 ----------
  const label = `${b.riser}, ${b.floor}`;
  const lw = Math.round(label.length * 6.7 + 40);
  const lx = Math.min(414, 552 - lw), ly = 190;
  let callout = `<g class="vi-labels"><g class="hx-callout">`;
  callout += `<path class="hx-leader" d="M${n2(anomalyAt[0] + 9)} ${n2(anomalyAt[1] - 3)}L${lx - 26} ${ly + 16}H${lx}"/>`;
  callout += `<rect class="hx-label-box" x="${lx}" y="${ly}" width="${lw}" height="32" rx="9"/>`;
  callout += `<circle class="hx-label-dot" cx="${lx + 15}" cy="${ly + 16}" r="3.6"/>`;
  callout += `<text class="hx-label" x="${lx + 27}" y="${ly + 20.5}">${escapeHtml(label)}</text>`;
  callout += `</g></g>`;
  world += callout;

  if (twin) {
    return `<svg class="hero-building hb-static hx-scene hx-static" viewBox="100 40 460 430" role="img" aria-label="${escapeHtml(t.product.twin.h2)}" focusable="false">${world}</svg>`;
  }

  // ---------- Act 1: the close-up, a cut-away riser ----------
  const Cc = [228, 238];
  const Ro = 70, Ri = 58, a = ER * Ro, ai = ER * Ri, bo = EB * Ro, bi = EB * Ri;
  const K = Ro / RR;
  const y1 = Cc[1] - 90, y2 = Cc[1] + 90;
  const cx = Cc[0];
  const pTop = Cc[1] - (H - 8 - SENSOR_Y) * K, pBot = Cc[1] + (SENSOR_Y - SY) * K;
  let c1 = `<defs>`;
  c1 += `<linearGradient id="hx-metal" gradientUnits="userSpaceOnUse" x1="${n2(cx - a)}" x2="${n2(cx + a)}" y1="0" y2="0"><stop offset="0" stop-color="#16232c"/><stop offset="0.3" stop-color="#3b5466"/><stop offset="0.55" stop-color="#25384a"/><stop offset="1" stop-color="#0d151b"/></linearGradient>`;
  c1 += `<linearGradient id="hx-clampg" gradientUnits="userSpaceOnUse" x1="${n2(cx - a)}" x2="${n2(cx + a)}" y1="0" y2="0"><stop offset="0" stop-color="#5d6a74"/><stop offset="0.35" stop-color="#cdd6dd"/><stop offset="1" stop-color="#4d5963"/></linearGradient>`;
  c1 += `<linearGradient id="hx-waterg" gradientUnits="userSpaceOnUse" x1="${n2(cx - ai)}" x2="${n2(cx + ai)}" y1="0" y2="0"><stop offset="0" stop-color="#0b3550"/><stop offset="0.45" stop-color="#14608f"/><stop offset="1" stop-color="#0a2c42"/></linearGradient>`;
  c1 += `<clipPath id="hx-win"><rect x="${n2(cx - ai)}" y="${n2(y1)}" width="${n2(2 * ai)}" height="${n2(y2 - y1)}"/></clipPath>`;
  c1 += `</defs>`;
  // window: wall cut faces and the water cut face
  c1 += `<path class="hx-cut" d="M${n2(cx - a)} ${n2(y1)}H${n2(cx - ai)}V${n2(y2)}H${n2(cx - a)}ZM${n2(cx + ai)} ${n2(y1)}H${n2(cx + a)}V${n2(y2)}H${n2(cx + ai)}Z"/>`;
  c1 += `<rect x="${n2(cx - ai)}" y="${n2(y1)}" width="${n2(2 * ai)}" height="${n2(y2 - y1)}" fill="url(#hx-waterg)"/>`;
  c1 += `<g clip-path="url(#hx-win)">`;
  let streaks = "";
  const rnd = [0.12, 0.71, 0.33, 0.9, 0.52, 0.2, 0.8, 0.44, 0.63, 0.05, 0.37, 0.95];
  for (let i = 0; i < 12; i++) {
    const sx = cx - ai + 12 + (2 * ai - 24) * rnd[i];
    const sy = y1 - 60 + i * 26 + (i % 3) * 7;
    const len = 18 + (i % 4) * 9;
    for (let rep = 0; rep < 2; rep++) streaks += `M${n2(sx)} ${n2(sy + rep * 312)}v${-len}`;
  }
  c1 += `<g class="hx-streaks"><path class="hx-streak" d="${streaks}"/></g>`;
  const wy = Cc[1], wx = cx + ai;
  for (let i = 0; i < 3; i++) {
    c1 += `<path class="hx-wave" d="M${n2(wx)} ${n2(wy - 110)}A${n2(ER * 110)} 110 0 0 0 ${n2(wx)} ${n2(wy + 110)}" style="transform-origin:${n2(wx)}px ${n2(wy)}px;animation-delay:${n2(i * 0.6)}s"/>`;
  }
  c1 += `<path class="hx-wave-static" d="M${n2(wx)} ${n2(wy - 40)}A${n2(ER * 40)} 40 0 0 0 ${n2(wx)} ${n2(wy + 40)}M${n2(wx)} ${n2(wy - 76)}A${n2(ER * 76)} 76 0 0 0 ${n2(wx)} ${n2(wy + 76)}"/>`;
  c1 += `</g>`;
  // lower segment: body, its top cut face (half ring) and the water surface inside
  c1 += `<path d="M${n2(cx - a)} ${n2(y2)}A${n2(a)} ${n2(bo)} 0 0 0 ${n2(cx + a)} ${n2(y2)}V${n2(pBot)}H${n2(cx - a)}Z" fill="url(#hx-metal)"/>`;
  c1 += `<path class="hx-cut" d="M${n2(cx - a)} ${n2(y2)}A${n2(a)} ${n2(bo)} 0 0 0 ${n2(cx + a)} ${n2(y2)}H${n2(cx + ai)}A${n2(ai)} ${n2(bi)} 0 0 1 ${n2(cx - ai)} ${n2(y2)}Z"/>`;
  c1 += `<path class="hx-water-cap" d="M${n2(cx - ai)} ${n2(y2)}A${n2(ai)} ${n2(bi)} 0 0 0 ${n2(cx + ai)} ${n2(y2)}Z"/>`;
  // upper segment: its front surface hides the top of the window
  c1 += `<path d="M${n2(cx - a)} ${n2(pTop)}V${n2(y1)}A${n2(a)} ${n2(bo)} 0 0 0 ${n2(cx + a)} ${n2(y1)}V${n2(pTop)}Z" fill="url(#hx-metal)"/>`;
  c1 += `<path class="hx-pipe-edge" d="M${n2(cx - a)} ${n2(pTop)}V${n2(y1)}A${n2(a)} ${n2(bo)} 0 0 0 ${n2(cx + a)} ${n2(y1)}V${n2(pTop)}M${n2(cx - a)} ${n2(y2)}V${n2(pBot)}M${n2(cx + a)} ${n2(y2)}V${n2(pBot)}M${n2(cx - a)} ${n2(y1)}V${n2(y2)}M${n2(cx + a)} ${n2(y1)}V${n2(y2)}"/>`;
  c1 += `<path class="hx-pipe-shine" d="M${n2(cx - a * 0.42)} ${n2(pTop)}V${n2(y1 + bo * 0.9)}M${n2(cx - a * 0.42)} ${n2(y2 + bo * 0.9)}V${n2(pBot)}"/>`;
  c1 += `<g class="hx-sensor hx-sensor-big">${sensor(cx, Cc[1], Ro, true).replace('class="hx-band"', 'class="hx-band" fill="url(#hx-clampg)"')}</g>`;
  c1 += `<g class="vi-labels"><path class="hx-leader" d="M${n2(cx + a + 40)} ${n2(Cc[1] - 150)}L${n2(cx + a + 70)} ${n2(Cc[1] - 178)}H${n2(cx + a + 90)}"/><text class="hx-label hx-label-big" x="${n2(cx + a + 96)}" y="${n2(Cc[1] - 173)}">${escapeHtml(b.sensor)}</text></g>`;

  // ---------- Camera keyframes ----------
  const bPt = P(rB.x, SENSOR_Y, rB.z);
  // Act 3 framing: fit the block
  const xs = [], ys = [];
  const addBox = (ox, oz, w, d, h) => { [[0, 0], [w, 0], [w, d], [0, d]].forEach(([x, z]) => { [0, h].forEach((yy) => { const q = P(ox + x, yy, oz + z); xs.push(q[0]); ys.push(q[1]); }); }); };
  city.forEach(([i, j, w, d, n]) => addBox(i * S + (S - 40 - w) / 2 - 40, j * S + (S - 40 - d) / 2 - 40, w, d, n * FH));
  addBox(-34, -34, W + 68, D + 68, H);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const s3 = Math.min(510 / (maxX - minX), 436 / (maxY - minY));
  const Qc = [(minX + maxX) / 2, (minY + maxY) / 2];
  const V = [280, 242];
  const A1 = { s: K, f: bPt, g: Cc }, A2 = { s: 1, f: bPt, g: bPt };
  const B2 = { s: 1, f: Qc, g: Qc }, A3 = { s: s3, f: Qc, g: V };
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const at = (A, B, uu) => {
    const s = A.s * Math.pow(B.s / A.s, uu);
    const f = [A.f[0] + (B.f[0] - A.f[0]) * uu, A.f[1] + (B.f[1] - A.f[1]) * uu];
    const g = [A.g[0] + (B.g[0] - A.g[0]) * uu, A.g[1] + (B.g[1] - A.g[1]) * uu];
    return { s, t: [g[0] - s * f[0], g[1] - s * f[1]] };
  };
  const tf = (st) => `transform:translate(${n2(st.t[0])}px,${n2(st.t[1])}px) scale(${Math.round(st.s * 10000) / 10000})`;
  const closeTf = (st) => tf({ s: st.s / K, t: [st.t[0] + st.s * bPt[0] - (st.s / K) * Cc[0], st.t[1] + st.s * bPt[1] - (st.s / K) * Cc[1]] });
  // Timeline in seconds (keep in sync with --hx-seq and the act keyframes in src/css/home.css).
  const SEQ = 11.2, PULL1 = [2.5, 4.4], PULL2 = [8.6, 10.6];
  const pcs = (sec) => (sec / SEQ) * 100;
  const frames = [];
  const push = (pct, st, close) => frames.push([pct, st, close]);
  push(0, at(A1, A2, 0), true); push(pcs(PULL1[0]), at(A1, A2, 0), true);
  for (let i = 1; i <= 12; i++) push(pcs(PULL1[0] + ((PULL1[1] - PULL1[0]) * i) / 12), at(A1, A2, ease(i / 12)), true);
  push(pcs(PULL2[0]), at(B2, A3, 0));
  for (let i = 1; i <= 12; i++) push(pcs(PULL2[0] + ((PULL2[1] - PULL2[0]) * i) / 12), at(B2, A3, ease(i / 12)));
  push(100, at(B2, A3, 1));
  const pc = (v) => `${Math.round(v * 100) / 100}%`;
  let camK = "", closeK = "";
  frames.forEach(([pct, st, close]) => {
    camK += `${pc(pct)}{${tf(st)}}`;
    if (close) closeK += `${pc(pct)}{${closeTf(st)}}`;
  });
  closeK += `100%{${closeTf(at(A1, A2, 1))}}`;
  // Outside the motion query: the resting act 3 framing, also the reduced-motion still.
  const style = `<style>.hero-visual .hx-world{${tf(at(B2, A3, 1))}}@media (prefers-reduced-motion: no-preference){@keyframes hx-cam{${camK}}@keyframes hx-close{${closeK}}}</style>`;

  const svg = `<svg class="hero-building hx-scene" viewBox="0 0 560 480" role="img" aria-labelledby="hb-title" focusable="false"><title id="hb-title">${escapeHtml(t.home.hero.visualAlt)}</title>` +
    `<defs><linearGradient id="hx-fadeg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.16" stop-color="#fff"/><stop offset="0.84" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<mask id="hx-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="560" height="480"><rect width="560" height="480" fill="url(#hx-fadeg)"/></mask></defs>` +
    `<g class="hx-world">${world}</g><g mask="url(#hx-fade)"><g class="hx-close" aria-hidden="true">${c1}</g></g></svg>`;

  // Status line in HTML so it stays legible on phones, on the same timeline as the scene.
  const status = `<p class="hero-status hx-status" aria-hidden="true">` +
    `<span class="hs hx-s1"><i></i>${escapeHtml(b.listening)}</span>` +
    `<span class="hs hx-s2"><i></i>${escapeHtml(b.located)}</span>` +
    `<span class="hs hx-s3"><i></i>${escapeHtml(b.portfolio)}</span>` +
    `</p>`;

  return style + svg + status;
};
