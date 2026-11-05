/*
  Hero animation: an isometric wireframe building that tells the product story
  in one 16 second loop, driven entirely by CSS keyframes in styles.css.

    0 to 8 %   the building draws itself in
    8 to 45 %  learning: sensors take readings, a scan sweeps the floors,
               packets flow to the model, the chart builds the normal band
   45 to 60 %  deviation: riser B floor 3 departs from normal, chart tail rises
   60 to 80 %  localisation: the twin narrows it to riser B, floors 3 to 5
   80 to 96 %  reviewed with the maintenance team
   96 to 100 % fade, restart

  Every string comes from the locale (t.building.*). With prefers-reduced-motion
  the animations are off and the default styles show the localised state as a
  still frame.
*/

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

module.exports = function heroBuildingSvg(t) {
  const b = t.building;
  const cos = Math.cos(Math.PI / 6);
  const sin = Math.sin(Math.PI / 6);
  const f1 = (n) => n.toFixed(1);

  // Projection with a movable origin so background buildings can be placed.
  const proj = (ox, oy) => (x, y, z) => [ox + (x - z) * cos, oy + (x + z) * sin - y];
  const P = proj(250, 302);
  const pt = (p) => `${f1(p[0])},${f1(p[1])}`;
  const line = (Pf, a, c, cls, extra = "") => {
    const A = Pf(...a), C = Pf(...c);
    return `<line class="${cls}" x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(C[0])}" y2="${f1(C[1])}" pathLength="1"${extra}/>`;
  };

  const W = 180, D = 130, F = 46, N = 5, H = F * N;
  let s = "";

  // --- Background portfolio buildings (faint, behind) ---
  const bgBuilding = (ox, oy, w, d, fh, n) => {
    const Pb = proj(ox, oy);
    let g = `<g class="hb-bg">`;
    for (let f = 0; f <= n; f++) {
      const y = f * fh;
      g += line(Pb, [0, y, 0], [w, y, 0], "hb-bg-edge") + line(Pb, [w, y, 0], [w, y, d], "hb-bg-edge") + line(Pb, [0, y, d], [w, y, d], "hb-bg-edge") + line(Pb, [0, y, 0], [0, y, d], "hb-bg-edge");
    }
    [[0, 0], [w, 0], [w, d], [0, d]].forEach(([x, z]) => { g += line(Pb, [x, 0, z], [x, n * fh, z], "hb-bg-edge"); });
    g += `<line class="hb-bg-pipe" x1="${f1(Pb(w * 0.5, 0, d * 0.5)[0])}" y1="${f1(Pb(w * 0.5, 0, d * 0.5)[1])}" x2="${f1(Pb(w * 0.5, n * fh, d * 0.5)[0])}" y2="${f1(Pb(w * 0.5, n * fh, d * 0.5)[1])}"/>`;
    return g + `</g>`;
  };
  s += bgBuilding(96, 214, 96, 70, 30, 4);
  s += bgBuilding(452, 236, 84, 64, 30, 5);

  // --- Ground pad and grid ---
  s += `<polygon class="hb-ground" points="${pt(P(-30, 0, -30))} ${pt(P(W + 30, 0, -30))} ${pt(P(W + 30, 0, D + 30))} ${pt(P(-30, 0, D + 30))}"/>`;
  for (let i = 1; i < 6; i++) {
    const gx = -30 + (W + 60) * (i / 6), gz = -30 + (D + 60) * (i / 6);
    s += line(P, [gx, 0, -30], [gx, 0, D + 30], "hb-grid");
    s += line(P, [-30, 0, gz], [W + 30, 0, gz], "hb-grid");
  }

  // --- Scan plane (sweeps up during learning) ---
  s += `<polygon class="hb-scan" points="${pt(P(0, 0, 0))} ${pt(P(W, 0, 0))} ${pt(P(W, 0, D))} ${pt(P(0, 0, D))}"/>`;

  // --- Main building: faces, floors, edges, windows ---
  s += `<g class="hb-faces">`;
  s += `<polygon class="hb-face" points="${pt(P(0, 0, D))} ${pt(P(W, 0, D))} ${pt(P(W, H, D))} ${pt(P(0, H, D))}"/>`;
  s += `<polygon class="hb-face" points="${pt(P(W, 0, 0))} ${pt(P(W, 0, D))} ${pt(P(W, H, D))} ${pt(P(W, H, 0))}"/>`;
  s += `<polygon class="hb-roof" points="${pt(P(0, H, 0))} ${pt(P(W, H, 0))} ${pt(P(W, H, D))} ${pt(P(0, H, D))}"/>`;
  s += `</g>`;
  // All edges as two paths (one animation each) instead of ~40 animated lines.
  const seg = (a, c) => { const A = P(...a), C = P(...c); return `M${f1(A[0])} ${f1(A[1])} L${f1(C[0])} ${f1(C[1])} `; };
  let dThin = "", dStrong = "";
  for (let f = 0; f <= N; f++) {
    const y = f * F;
    const d = seg([0, y, 0], [W, y, 0]) + seg([0, y, 0], [0, y, D]) + seg([W, y, 0], [W, y, D]) + seg([0, y, D], [W, y, D]);
    if (f === 0 || f === N) dStrong += d; else dThin += d;
  }
  [[0, 0], [W, 0], [W, D], [0, D]].forEach(([x, z]) => { dStrong += seg([x, 0, z], [x, H, z]); });
  s += `<g class="hb-edges"><path class="hb-edge" d="${dThin.trim()}" pathLength="1"/><path class="hb-edge hb-edge-strong" d="${dStrong.trim()}" pathLength="1"/></g>`;
  s += `<g class="hb-windows">`;
  for (let f = 0; f < N; f++) {
    const y0 = f * F + 12, y1 = f * F + 34;
    for (let w = 0; w < 5; w++) {
      const x0 = 14 + w * 34, x1 = x0 + 22;
      s += `<polygon class="hb-win" points="${pt(P(x0, y0, D))} ${pt(P(x1, y0, D))} ${pt(P(x1, y1, D))} ${pt(P(x0, y1, D))}"/>`;
    }
    for (let w = 0; w < 3; w++) {
      const z0 = 16 + w * 40, z1 = z0 + 24;
      s += `<polygon class="hb-win" points="${pt(P(W, y0, z0))} ${pt(P(W, y0, z1))} ${pt(P(W, y1, z1))} ${pt(P(W, y1, z0))}"/>`;
    }
  }
  s += `</g>`;

  // --- Risers, sensors, flow ---
  const risers = [
    { x: 40, z: 98, id: "A" },
    { x: 92, z: 62, id: "B" },
    { x: 146, z: 26, id: "C" }
  ];
  const aFloor = 2; // riser B, third floor
  const rB = risers[1];

  // highlighted section (floors 3 to 5 around riser B), shown at localisation
  s += `<g class="hb-section">`;
  s += `<polygon class="hb-section-wall" points="${pt(P(rB.x - 16, aFloor * F, rB.z + 16))} ${pt(P(rB.x + 16, aFloor * F, rB.z + 16))} ${pt(P(rB.x + 16, N * F, rB.z + 16))} ${pt(P(rB.x - 16, N * F, rB.z + 16))}"/>`;
  s += `<polygon class="hb-section-floor" points="${pt(P(rB.x - 16, aFloor * F, rB.z - 16))} ${pt(P(rB.x + 16, aFloor * F, rB.z - 16))} ${pt(P(rB.x + 16, aFloor * F, rB.z + 16))} ${pt(P(rB.x - 16, aFloor * F, rB.z + 16))}"/>`;
  s += `</g>`;

  // supply below ground
  s += `<g class="hb-supply">`;
  s += line(P, [risers[0].x, -18, risers[0].z], [risers[2].x, -18, risers[2].z], "hb-pipe");
  s += line(P, [risers[0].x - 50, -18, risers[0].z + 35], [risers[0].x, -18, risers[0].z], "hb-pipe");
  s += `</g>`;

  risers.forEach((r, ri) => {
    s += `<g class="hb-riser hb-riser-${r.id}">`;
    for (let f = 0; f < N; f++) {
      const y0 = f * F, y1 = (f + 1) * F, by = f * F + 24;
      s += line(P, [r.x, y0, r.z], [r.x, y1, r.z], "hb-pipe");
      s += line(P, [r.x, by, r.z], [r.x + 26, by, r.z], "hb-branch");
      s += line(P, [r.x, by, r.z], [r.x, by, r.z + 22], "hb-branch");
      // clamp-on sensor at each measuring point
      const [sx, sy] = P(r.x, by, r.z);
      const delay = -(f * 0.45 + ri * 1.15);
      s += `<g class="hb-sensor" transform="translate(${f1(sx)} ${f1(sy)})">`;
      s += `<circle class="hb-sensor-ring" r="4" style="animation-delay:${delay.toFixed(2)}s"/>`;
      s += `<rect class="hb-sensor-body" x="-4.5" y="-3" width="9" height="6" rx="1.6"/>`;
      s += `</g>`;
    }
    s += line(P, [r.x, -18, r.z], [r.x, 0, r.z], "hb-pipe");
    for (let f = 0; f <= N; f++) {
      const [jx, jy] = P(r.x, f * F, r.z);
      s += `<circle class="hb-joint" cx="${f1(jx)}" cy="${f1(jy)}" r="2.4"/>`;
    }
    s += `</g>`;
  });

  // anomaly overlay on riser B floor 3 segment and branch
  s += `<g class="hb-anomaly">`;
  s += line(P, [rB.x, aFloor * F, rB.z], [rB.x, (aFloor + 1) * F, rB.z], "hb-glow");
  s += line(P, [rB.x, aFloor * F, rB.z], [rB.x, (aFloor + 1) * F, rB.z], "hb-pipe hb-pipe-anomaly");
  s += line(P, [rB.x, aFloor * F + 24, rB.z], [rB.x + 26, aFloor * F + 24, rB.z], "hb-branch hb-pipe-anomaly");
  const [ax, ay] = P(rB.x, aFloor * F + 24, rB.z);
  s += `<circle class="hb-pulse" cx="${f1(ax)}" cy="${f1(ay)}" r="10"/>`;
  s += `<circle class="hb-pulse hb-pulse-2" cx="${f1(ax)}" cy="${f1(ay)}" r="10"/>`;
  s += `<circle class="hb-dot-anomaly" cx="${f1(ax)}" cy="${f1(ay)}" r="4"/>`;
  s += `</g>`;

  // flow dots: normal (blue) on every riser, orange on riser B after the deviation
  const pathFor = (r, toFloor) => {
    const a = P(r.x, -18, r.z), c = P(r.x, toFloor * F + 24, r.z);
    return `M${f1(a[0])} ${f1(a[1])} L${f1(c[0])} ${f1(c[1])}`;
  };
  s += `<g class="hb-flow-normal">`;
  s += `<circle class="hb-flow" r="2.6" style="offset-path: path('${pathFor(risers[0], 4)}'); animation-delay: 0s"/>`;
  s += `<circle class="hb-flow" r="2.6" style="offset-path: path('${pathFor(risers[1], 4)}'); animation-delay: -1.6s"/>`;
  s += `<circle class="hb-flow" r="2.6" style="offset-path: path('${pathFor(risers[2], 4)}'); animation-delay: -2.9s"/>`;
  s += `<circle class="hb-flow" r="2.6" style="offset-path: path('${pathFor(risers[0], 4)}'); animation-delay: -2.2s"/>`;
  s += `</g>`;
  s += `<g class="hb-flow-dev">`;
  s += `<circle class="hb-flow hb-flow-anomaly" r="2.8" style="offset-path: path('${pathFor(rB, aFloor)}'); animation-delay: -0.6s"/>`;
  s += `<circle class="hb-flow hb-flow-anomaly" r="2.8" style="offset-path: path('${pathFor(rB, aFloor)}'); animation-delay: -1.9s"/>`;
  s += `<circle class="hb-flow hb-flow-anomaly" r="2.8" style="offset-path: path('${pathFor(rB, aFloor)}'); animation-delay: -3.2s"/>`;
  s += `</g>`;

  // --- Model node: sensors stream readings to it ---
  const mx = 500, my = 34;
  s += `<g class="hb-model">`;
  risers.forEach((r, i) => {
    const top = P(r.x, H, r.z);
    const cx = (top[0] + mx) / 2 + 30, cy = Math.min(top[1], my) - 24;
    const d = `M${f1(top[0])} ${f1(top[1])} Q${f1(cx)} ${f1(cy)} ${mx} ${my}`;
    s += `<path class="hb-link" d="${d}" pathLength="1"/>`;
    s += `<circle class="hb-packet" r="2" style="offset-path: path('${d}'); animation-delay: ${(-i * 1.05).toFixed(2)}s"/>`;
    s += `<circle class="hb-packet" r="2" style="offset-path: path('${d}'); animation-delay: ${(-i * 1.05 - 1.6).toFixed(2)}s"/>`;
  });
  s += `<circle class="hb-model-ring" cx="${mx}" cy="${my}" r="14"/>`;
  s += `<circle class="hb-model-ring hb-model-ring-2" cx="${mx}" cy="${my}" r="14"/>`;
  s += `<circle class="hb-model-core" cx="${mx}" cy="${my}" r="11"/>`;
  s += `<circle class="hb-model-dot" cx="${mx}" cy="${my}" r="3.2"/>`;
  s += `<text class="hb-model-label" x="${mx}" y="${my + 30}" text-anchor="middle">${escapeHtml(b.model)}</text>`;
  s += `</g>`;

  // --- Chart panel: the model learns normal, then the live line departs ---
  const cx0 = 14, cy0 = 18, cw = 196, chh = 112;
  const px0 = cx0 + 12, px1 = cx0 + cw - 12, py0 = cy0 + 44, py1 = cy0 + chh - 14;
  const X = (u) => px0 + (px1 - px0) * u, Y = (v) => py1 - (py1 - py0) * v;
  const base = [[0, 0.42], [0.14, 0.5], [0.28, 0.4], [0.42, 0.52], [0.56, 0.44], [0.7, 0.5], [0.84, 0.43], [1, 0.48]];
  const live = [[0, 0.44], [0.14, 0.51], [0.28, 0.42], [0.42, 0.53], [0.56, 0.46], [0.66, 0.5]];
  const tail = [[0.66, 0.5], [0.76, 0.6], [0.86, 0.78], [1, 0.92]];
  const poly = (pts) => pts.map(([u, v], i) => `${i ? "L" : "M"}${f1(X(u))} ${f1(Y(v))}`).join(" ");
  const bandTop = base.map(([u, v]) => `${f1(X(u))} ${f1(Y(v + 0.1))}`);
  const bandBot = base.slice().reverse().map(([u, v]) => `${f1(X(u))} ${f1(Y(v - 0.1))}`);
  s += `<g class="hb-chart">`;
  s += `<rect class="hb-chart-bg" x="${cx0}" y="${cy0}" width="${cw}" height="${chh}" rx="10"/>`;
  s += `<text class="hb-chart-title" x="${cx0 + 12}" y="${cy0 + 18}">${escapeHtml(b.chartTitle)}</text>`;
  s += `<line class="hb-legend-base" x1="${cx0 + 12}" y1="${cy0 + 31}" x2="${cx0 + 26}" y2="${cy0 + 31}"/><text class="hb-chart-text" x="${cx0 + 31}" y="${cy0 + 34}">${escapeHtml(b.chartBase)}</text>`;
  s += `<line class="hb-legend-live" x1="${cx0 + 86}" y1="${cy0 + 31}" x2="${cx0 + 100}" y2="${cy0 + 31}"/><text class="hb-chart-text" x="${cx0 + 105}" y="${cy0 + 34}">${escapeHtml(b.chartLive)}</text>`;
  for (let i = 1; i < 4; i++) s += `<line class="hb-chart-grid" x1="${px0}" y1="${f1(Y(i / 4))}" x2="${px1}" y2="${f1(Y(i / 4))}"/>`;
  s += `<path class="hb-chart-band" d="M${bandTop.join(" L")} L${bandBot.join(" L")} Z"/>`;
  s += `<path class="hb-chart-base" d="${poly(base)}" pathLength="1"/>`;
  s += `<path class="hb-chart-live" d="${poly(live)}" pathLength="1"/>`;
  s += `<path class="hb-chart-tail-glow" d="${poly(tail)}" pathLength="1"/>`;
  s += `<path class="hb-chart-tail" d="${poly(tail)}" pathLength="1"/>`;
  s += `<circle class="hb-chart-flag" cx="${f1(X(1))}" cy="${f1(Y(0.92))}" r="3.4"/>`;
  s += `</g>`;

  // --- Label: riser B, floor 3 (localisation) ---
  const lx = 396, ly = 150;
  s += `<g class="hb-callout">`;
  s += `<line class="hb-leader" x1="${f1(ax)}" y1="${f1(ay)}" x2="${lx}" y2="${ly + 22}"/>`;
  s += `<circle class="hb-leader-end" cx="${lx}" cy="${ly + 22}" r="2.5"/>`;
  s += `<g class="hb-label">`;
  s += `<rect x="0" y="-12" rx="8" ry="8" width="150" height="46"/>`;
  s += `<text x="12" y="4" class="hb-label-title">${escapeHtml(b.riser)}, ${escapeHtml(b.floor)}</text>`;
  s += `<text x="12" y="22" class="hb-label-sub"><tspan class="hb-label-dot">●</tspan> ${escapeHtml(b.flag)}</text>`;
  s += `</g></g>`;

  // --- Legend ---
  s += `<g class="hb-legend" transform="translate(16 452)">`;
  s += `<line class="hb-pipe" x1="0" y1="0" x2="22" y2="0"/><text x="30" y="4">${escapeHtml(b.normal)}</text>`;
  s += `<line class="hb-pipe hb-pipe-anomaly" x1="150" y1="0" x2="172" y2="0"/><text x="180" y="4">${escapeHtml(b.flag)}</text>`;
  s += `<rect class="hb-sensor-body" x="300" y="-3" width="9" height="6" rx="1.6"/><text x="316" y="4">${escapeHtml(b.sensors)}</text>`;
  s += `</g>`;

  const svg = `<svg class="hero-building" viewBox="0 0 560 480" role="img" aria-labelledby="hb-title" focusable="false"><title id="hb-title">${escapeHtml(t.home.hero.visualAlt)}</title>${s}</svg>`;

  // Status line, HTML so it stays legible on phones. Same 16 s cycle.
  const status = `<p class="hero-status" aria-hidden="true">` +
    `<span class="hs hs-learn"><i></i>${escapeHtml(b.learning)}</span>` +
    `<span class="hs hs-dev"><i></i>${escapeHtml(b.deviation)}</span>` +
    `<span class="hs hs-loc"><i></i>${escapeHtml(b.localised)}</span>` +
    `<span class="hs hs-rev"><i></i>${escapeHtml(b.reviewed)}</span>` +
    `</p>`;

  return svg + status;
};
