/*
  Vector product visuals, sharp at any size. Strings come from the locale.
  CSS for these lives in styles.css under "Product visuals".

    installSvg(t)  clamp-on ultrasonic sensor on a riser, pressure sensor on a tap
    rackSvg(t)     liquid-cooled rack row with a cooling loop and per-rack sensing
*/

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function installSvg(t, opts) {
  const compact = Boolean(opts && opts.compact);
  const L = t.product.install.labels;
  let s = "";
  // riser: vertical pipe, slightly right of centre
  const px = 236, pw = 34, top = 0, bottom = 300;
  s += `<defs>
    <linearGradient id="vi-pipe" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#1b2a36"/><stop offset="0.35" stop-color="#3a5366"/><stop offset="0.6" stop-color="#22343f"/><stop offset="1" stop-color="#101b22"/>
    </linearGradient>
    <linearGradient id="vi-body" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#2a2f34"/><stop offset="1" stop-color="#15181b"/>
    </linearGradient>
    <linearGradient id="vi-clamp" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#8e9ba6"/><stop offset="0.5" stop-color="#d7dee4"/><stop offset="1" stop-color="#7a8792"/>
    </linearGradient>
  </defs>`;
  s += `<rect class="vi-grid" x="0" y="0" width="400" height="300"/>`;
  // pipe body with insulation cut away in the middle
  s += `<rect class="vi-pipe" x="${px}" y="${top}" width="${pw}" height="${bottom}" fill="url(#vi-pipe)"/>`;
  s += `<rect class="vi-insul" x="${px - 9}" y="${top}" width="${pw + 18}" height="78"/>`;
  s += `<rect class="vi-insul" x="${px - 9}" y="222" width="${pw + 18}" height="78"/>`;
  s += `<line class="vi-pipe-hl" x1="${px + 9}" y1="78" x2="${px + 9}" y2="222"/>`;
  // flow inside the pipe (dots moving up)
  const fx = px + pw / 2;
  for (let i = 0; i < 4; i++) {
    s += `<circle class="vi-flow" r="2.2" style="offset-path: path('M${fx + (i % 2 ? 5 : -5)} 300 L${fx + (i % 2 ? 5 : -5)} 0'); animation-delay: ${(-i * 1.1).toFixed(1)}s"/>`;
  }
  // clamp bracket: two bands around the pipe
  [118, 182].forEach((y) => {
    s += `<rect class="vi-band" x="${px - 7}" y="${y - 6}" width="${pw + 14}" height="12" rx="4" fill="url(#vi-clamp)"/>`;
    s += `<rect class="vi-band-shade" x="${px - 7}" y="${y + 2}" width="${pw + 14}" height="4" rx="2"/>`;
  });
  // transducer rail on the left side of the pipe, two transducers at an angle
  s += `<rect class="vi-rail" x="${px - 30}" y="112" width="24" height="76" rx="5" fill="url(#vi-body)"/>`;
  s += `<rect class="vi-tx" x="${px - 26}" y="118" width="16" height="12" rx="2"/>`;
  s += `<rect class="vi-tx" x="${px - 26}" y="170" width="16" height="12" rx="2"/>`;
  // ultrasonic path across the pipe (diagonal, bouncing off the far wall)
  s += `<path class="vi-beam" d="M${px - 10} 124 L${px + pw} 150 L${px - 10} 176" pathLength="1"/>`;
  s += `<circle class="vi-beam-dot" r="2.4" style="offset-path: path('M${px - 10} 124 L${px + pw} 150 L${px - 10} 176')"/>`;
  s += `<circle class="vi-beam-dot vi-beam-dot-2" r="2.4" style="offset-path: path('M${px - 10} 176 L${px + pw} 150 L${px - 10} 124')"/>`;
  // wavefront arcs from the upper transducer
  for (let i = 0; i < 3; i++) {
    s += `<path class="vi-wave" d="M${px - 8} 116 A14 14 0 0 1 ${px - 8} 132" style="animation-delay: ${(i * 0.7).toFixed(1)}s"/>`;
  }
  // sensor body on the right, with LED and cable
  s += `<rect class="vi-body" x="${px + pw + 10}" y="108" width="74" height="84" rx="10" fill="url(#vi-body)"/>`;
  s += `<rect class="vi-body-line" x="${px + pw + 22}" y="124" width="50" height="2" rx="1"/>`;
  s += `<rect class="vi-body-line" x="${px + pw + 22}" y="134" width="34" height="2" rx="1"/>`;
  s += `<circle class="vi-led" cx="${px + pw + 24}" cy="176" r="3.5"/>`;
  s += `<path class="vi-cable" d="M${px + pw + 84} 150 C ${px + pw + 110} 150, ${px + pw + 100} 60, ${px + pw + 92} 0"/>`;
  s += `<line class="vi-bridge" x1="${px + pw}" y1="130" x2="${px + pw + 10}" y2="130"/>`;
  s += `<line class="vi-bridge" x1="${px + pw}" y1="170" x2="${px + pw + 10}" y2="170"/>`;
  // pressure sensor on a tap, lower left
  s += `<line class="vi-tap-pipe" x1="60" y1="300" x2="60" y2="236"/>`;
  s += `<rect class="vi-tap" x="48" y="222" width="24" height="16" rx="3"/>`;
  s += `<circle class="vi-gauge" cx="60" cy="204" r="16"/>`;
  s += `<circle class="vi-gauge-dot" cx="60" cy="204" r="3"/>`;
  s += `<line class="vi-gauge-needle" x1="60" y1="204" x2="70" y2="194"/>`;
  // labels (hidden at small sizes by CSS)
  s += `<g class="vi-labels">`;
  s += `<line class="vi-leader" x1="${px - 32}" y1="150" x2="150" y2="96"/><circle class="vi-leader-end" cx="150" cy="96" r="2.5"/>`;
  s += `<text class="vi-text" x="24" y="76"><tspan class="vi-text-strong" x="24" dy="0">${esc(L.ultrasonic)}</tspan><tspan x="24" dy="16">${esc(L.time)}. ${esc(L.cut)}.</tspan></text>`;
  s += `<line class="vi-leader" x1="78" y1="204" x2="118" y2="252"/><circle class="vi-leader-end" cx="118" cy="252" r="2.5"/>`;
  s += `<text class="vi-text" x="126" y="256">${esc(L.pressure)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="${px + pw + 47}" y="214" text-anchor="middle">${esc(L.riser)}</text>`;
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
    // coolant flow through the branch
    s += `<circle class="vi-flow" r="2" style="offset-path: path('M${x + 20} 60 L${x + 20} 100'); animation-duration: 2.2s; animation-delay: ${(-i * 0.5).toFixed(1)}s"/>`;
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
  s += `<line class="vi-leader" x1="276" y1="74" x2="330" y2="30"/><circle class="vi-leader-end" cx="330" cy="30" r="2.5"/>`;
  s += `<text class="vi-text vi-text-bad" x="336" y="34">${esc(L.deviation)}</text>`;
  s += `<text class="vi-text vi-text-muted" x="240" y="296" text-anchor="middle">${esc(L.sensor)}</text>`;
  s += `</g>`;
  return `<svg class="vis vis-rack" viewBox="0 0 480 300" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

module.exports = { installSvg, rackSvg };
