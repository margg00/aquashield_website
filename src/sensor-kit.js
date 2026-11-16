/*
  One clamp-on sensor for every flat (side view) drawing, drawn like the home hero close-up:
  a dark housing (#1d2328) with a lighter lip, two steel bands around the pipe at the housing's
  ends, a green LED, and light blue wave arcs that spread from the pipe wall into the water.

  Proportions follow the hero, in units of the pipe radius R:
    housing length along the pipe 4.1 R, depth 0.76 R, bands 0.23 R wide, inset 0.1 R.

  axis "x": a horizontal pipe, the housing sits on top (side = -1) or below (side = 1).
  axis "y": a vertical pipe, the housing sits on the right (side = 1) or left (side = -1).
  Ids are prefixed with `id` so several drawings can share a page.
  Styles: styles.css, "Sensor kit". Motion: sk-wave, sk-led, sk-stream (reduced motion shows still arcs).
*/

const n2 = (v) => String(Math.round(v * 100) / 100);

// gradients for one pipe: metal across the pipe, steel for the bands, water inside
function defs(id, axis, c, R) {
  const across = axis === "x" ? `x1="0" x2="0" y1="${n2(c - R)}" y2="${n2(c + R)}"` : `x1="${n2(c - R)}" x2="${n2(c + R)}" y1="0" y2="0"`;
  const ri = R * 0.8;
  const acrossIn = axis === "x" ? `x1="0" x2="0" y1="${n2(c - ri)}" y2="${n2(c + ri)}"` : `x1="${n2(c - ri)}" x2="${n2(c + ri)}" y1="0" y2="0"`;
  return `<linearGradient id="${id}-metal" gradientUnits="userSpaceOnUse" ${across}><stop offset="0" stop-color="#16232c"/><stop offset="0.3" stop-color="#3b5466"/><stop offset="0.55" stop-color="#25384a"/><stop offset="1" stop-color="#0d151b"/></linearGradient>` +
    `<linearGradient id="${id}-steel" gradientUnits="userSpaceOnUse" ${across}><stop offset="0" stop-color="#5d6a74"/><stop offset="0.35" stop-color="#cdd6dd"/><stop offset="1" stop-color="#4d5963"/></linearGradient>` +
    `<linearGradient id="${id}-water" gradientUnits="userSpaceOnUse" ${acrossIn}><stop offset="0" stop-color="#0b3550"/><stop offset="0.45" stop-color="#14608f"/><stop offset="1" stop-color="#0a2c42"/></linearGradient>`;
}

// rectangle helper in pipe coordinates: s along the pipe, c across it
const rect = (axis, s0, s1, c0, c1, extra) => axis === "x"
  ? `x="${n2(s0)}" y="${n2(c0)}" width="${n2(s1 - s0)}" height="${n2(c1 - c0)}"${extra || ""}`
  : `x="${n2(c0)}" y="${n2(s0)}" width="${n2(c1 - c0)}" height="${n2(s1 - s0)}"${extra || ""}`;
const line = (axis, s0, s1, c) => axis === "x" ? `M${n2(s0)} ${n2(c)}H${n2(s1)}` : `M${n2(c)} ${n2(s0)}V${n2(s1)}`;

// a straight pipe from s0 to s1, centred on c. win = [w0, w1] cuts a window that shows the water.
function pipe(id, axis, s0, s1, c, R, win) {
  const ri = R * 0.8;
  let g = `<rect class="sk-pipe" ${rect(axis, s0, s1, c - R, c + R)} fill="url(#${id}-metal)"/>`;
  if (win) {
    g += `<rect class="sk-cut" ${rect(axis, win[0], win[1], c - R, c + R)}/>`;
    g += `<rect ${rect(axis, win[0], win[1], c - ri, c + ri)} fill="url(#${id}-water)"/>`;
  }
  g += `<path class="sk-edge" d="${line(axis, s0, s1, c - R)}${line(axis, s0, s1, c + R)}"/>`;
  const hi = c - R * 0.42 * (axis === "x" ? 1 : 1);
  g += win
    ? `<path class="sk-shine" style="stroke-width:${n2(R * 0.2)}" d="${line(axis, s0, win[0], hi)}${line(axis, win[1], s1, hi)}"/>`
    : `<path class="sk-shine" style="stroke-width:${n2(R * 0.2)}" d="${line(axis, s0, s1, hi)}"/>`;
  return g;
}

// streaks of water moving along the window (they loop with sk-stream), clipped to the window
function stream(id, axis, win, c, R, dir) {
  const ri = R * 0.8, len = win[1] - win[0];
  const rnd = [0.18, 0.74, 0.4, 0.92, 0.55, 0.27, 0.83, 0.08, 0.63];
  let d = "";
  for (let i = 0; i < 9; i++) {
    const cc = c - ri + 0.18 * R + (2 * ri - 0.36 * R) * rnd[i];
    const ss = win[0] + (i / 9) * len;
    const l = R * (0.35 + (i % 3) * 0.18);
    [0, -dir].forEach((rep) => { d += line(axis, ss + rep * len, ss + rep * len + l, cc); });
  }
  const clip = `<clipPath id="${id}-win"><rect ${rect(axis, win[0], win[1], c - ri, c + ri)}/></clipPath>`;
  const shift = axis === "x" ? `--sx:${n2(len * dir)}px;--sy:0px` : `--sx:0px;--sy:${n2(len * dir)}px`;
  return `<defs>${clip}</defs><g clip-path="url(#${id}-win)"><g class="sk-stream" style="${shift}"><path class="sk-streak" style="stroke-width:${n2(Math.max(1.4, R * 0.04))}" d="${d}"/></g></g>`;
}

// the housing and its two bands, centred at s along the pipe
function sensor(id, axis, s, c, R, side, opts) {
  const o = opts || {};
  const L = 4.1 * R, Dp = 0.76 * R, bw = 0.23 * R, inset = 0.1 * R, gap = Math.max(0.6, 0.02 * R);
  const s0 = s - L / 2, s1 = s + L / 2;
  const wall = c + side * R;
  const h0 = side > 0 ? wall + gap : wall - gap - Dp, h1 = h0 + Dp;
  const rx = Math.max(1.5, 0.09 * R);
  const outer = side > 0 ? h1 : h0;
  const lipW = Math.max(1.6, 0.17 * R);
  let g = "";
  // bands: a little wider than the pipe, rounded, steel
  [s0 + inset, s1 - inset - bw].forEach((b) => {
    g += `<rect class="sk-band" ${rect(axis, b, b + bw, c - R - 0.05 * R, c + R + 0.05 * R, ` rx="${n2(0.08 * R)}"`)} fill="url(#${id}-steel)"/>`;
  });
  g += `<rect class="sk-house" ${rect(axis, s0, s1, h0, h1, ` rx="${n2(rx)}"`)}/>`;
  // the lighter lip on the outer face
  const l0 = side > 0 ? outer - lipW : outer, l1 = side > 0 ? outer : outer + lipW;
  g += `<rect class="sk-lip" ${rect(axis, s0 + rx * 0.4, s1 - rx * 0.4, l0, l1, ` rx="${n2(rx * 0.6)}"`)}/>`;
  if (o.detail !== false) {
    // two hairlines and the LED, as on the hero housing
    const mid = (h0 + h1) / 2, ht = Math.max(0.8, 0.03 * R);
    g += `<rect class="sk-line" ${rect(axis, s0 + 0.18 * L, s0 + 0.18 * L + 0.42 * Dp * 2.2, mid - ht / 2 - 0.12 * Dp, mid + ht / 2 - 0.12 * Dp)}/>`;
    g += `<rect class="sk-line" ${rect(axis, s0 + 0.18 * L, s0 + 0.18 * L + 0.28 * Dp * 2.2, mid - ht / 2 + 0.12 * Dp, mid + ht / 2 + 0.12 * Dp)}/>`;
    const led = axis === "x" ? [s1 - 0.12 * L, mid] : [mid, s1 - 0.12 * L];
    g += `<circle class="sk-led" cx="${n2(led[0])}" cy="${n2(led[1])}" r="${n2(Math.max(1.6, 0.075 * R))}"/>`;
  }
  return g;
}

// wave arcs: from the wall under the sensor into the water, scaled up and faded by CSS (sk-wave).
// Returns the animated arcs plus two still arcs for reduced motion. Clipped to the bore.
function waves(id, axis, s, c, R, side, count) {
  const ri = R * 0.8, wall = c + side * ri;
  const reach = 2 * ri;
  const arc = (r) => axis === "x"
    ? `M${n2(s - r * 1.2)} ${n2(wall)}A${n2(r * 1.2)} ${n2(r)} 0 0 ${side > 0 ? 1 : 0} ${n2(s + r * 1.2)} ${n2(wall)}`
    : `M${n2(wall)} ${n2(s - r * 1.2)}A${n2(r)} ${n2(r * 1.2)} 0 0 ${side > 0 ? 0 : 1} ${n2(wall)} ${n2(s + r * 1.2)}`;
  const origin = axis === "x" ? `${n2(s)}px ${n2(wall)}px` : `${n2(wall)}px ${n2(s)}px`;
  const sw = n2(Math.max(1.4, R * 0.035));
  let g = `<defs><clipPath id="${id}-bore"><rect ${rect(axis, s - 3 * R, s + 3 * R, c - ri, c + ri)}/></clipPath></defs><g clip-path="url(#${id}-bore)">`;
  for (let i = 0; i < (count || 3); i++) {
    g += `<path class="sk-wave" d="${arc(reach)}" style="stroke-width:${sw};transform-origin:${origin};animation-delay:${n2(i * 0.6)}s"/>`;
  }
  g += `<path class="sk-wave-still" style="stroke-width:${sw}" d="${arc(reach * 0.36)}${arc(reach * 0.68)}"/>`;
  return g + `</g>`;
}

module.exports = { defs, pipe, stream, sensor, waves };
