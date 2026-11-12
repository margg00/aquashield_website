/*
  Insurance page drawings. Strings come from t.insurance. CSS lives in src/css/insurance.css.

    lossTimelineSvg(t)        wide timeline: a leak without monitoring vs. with AquaShield
    lossTimelineSvgMobile(t)  the same story in portrait, time running downwards (under 640px)
    bookSvg(t)                book of business: 40 buildings, 12 selected and monitored, one leak caught early

  Every animated element carries its start time in --d. Default styles are the finished state.
*/

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
const f1 = (n) => (Math.round(n * 10) / 10).toString();
const d = (s) => `style="--d:${s.toFixed(2)}s"`;

// split a label into at most two lines near the middle, for narrow layouts
function lines(label, max) {
  const s = String(label);
  if (s.length <= max) return [s];
  const words = s.split(" ");
  let best = [s], bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
    const score = Math.max(a.length, b.length);
    if (score < bestScore) { bestScore = score; best = [a, b]; }
  }
  return best;
}
function text(cls, x, y, label, opts) {
  const o = opts || {};
  const parts = o.max ? lines(label, o.max) : [String(label)];
  const anchor = o.anchor ? ` text-anchor="${o.anchor}"` : "";
  const lh = o.lh || 16;
  if (parts.length === 1) return `<text class="${cls}" x="${f1(x)}" y="${f1(y)}"${anchor}>${esc(parts[0])}</text>`;
  return `<text class="${cls}" x="${f1(x)}" y="${f1(y)}"${anchor}>` + parts.map((p, i) => `<tspan x="${f1(x)}" dy="${i ? lh : 0}">${esc(p)}</tspan>`).join("") + `</text>`;
}

/* Timing shared by both compositions (seconds after the card is revealed). */
const T = { bar1: 0.3, bar1Len: 3.4, bar2: 0.3, flagged: 0.9, located: 1.3 };
const DAMAGE = [0.2, 0.4, 0.61, 0.82];       // where each damage lands on track 1 (0..1)
const EARLY = 0.12, LOCATED = 0.18;          // where the deviation is flagged, where the riser is located
const TICKS = [0, 0.36, 0.78];
const at = (u) => T.bar1 + T.bar1Len * u;     // track 1 grows linearly, so damage appears as it is reached

function lossTimelineSvg(t) {
  const L = t.insurance.story.timeline;
  const dmg = t.insurance.visual.milestones;
  const W = 960, H = 330, xa = 210, xb = 936;
  const X = (u) => xa + (xb - xa) * u;
  const y1 = 104, y2 = 222, bh = 16, ax = 290;
  let s = `<defs><linearGradient id="lt-bad" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#ff6b4a" stop-opacity="0.35"/><stop offset="1" stop-color="#ff6b4a"/></linearGradient>`;
  s += `<linearGradient id="lt-good" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#38b6ff" stop-opacity="0.55"/><stop offset="1" stop-color="#00f0ff"/></linearGradient></defs>`;
  // time grid and axis
  TICKS.forEach((u, i) => {
    s += `<line class="lt-grid" x1="${f1(X(u))}" y1="40" x2="${f1(X(u))}" y2="${ax}"/>`;
    s += `<line class="lt-axis" x1="${f1(X(u))}" y1="${ax}" x2="${f1(X(u))}" y2="${ax + 6}"/>`;
    s += text("vi-text vi-text-muted lt-tick", X(u), ax + 24, L.ticks[i], { anchor: i ? "middle" : "start" });
  });
  s += `<line class="lt-axis" x1="${xa}" y1="${ax}" x2="${xb}" y2="${ax}"/><path class="lt-axis-head" d="M${xb} ${ax - 4} L${xb + 8} ${ax} L${xb} ${ax + 4} Z"/>`;

  // track 1: without monitoring
  s += text("vi-text vi-text-strong lt-track lt-track-bad", 0, y1 + 5, L.without);
  s += `<rect class="lt-rail" x="${xa}" y="${y1 - bh / 2}" width="${xb - xa}" height="${bh}" rx="${bh / 2}"/>`;
  s += `<rect class="lt-bar lt-grow" ${d(T.bar1)} x="${xa}" y="${y1 - bh / 2}" width="${xb - xa}" height="${bh}" rx="${bh / 2}" fill="url(#lt-bad)"/>`;
  DAMAGE.forEach((u, i) => {
    const x = X(u), up = i % 2 === 0, ty = up ? y1 - 26 : y1 + 38;
    s += `<g class="lt-pop" ${d(at(u))}>`;
    s += `<line class="lt-stem" x1="${f1(x)}" y1="${up ? y1 - 8 : y1 + 8}" x2="${f1(x)}" y2="${up ? y1 - 18 : y1 + 22}"/>`;
    s += `<circle class="lt-dmg" cx="${f1(x)}" cy="${y1}" r="5"/>`;
    s += text("vi-text lt-label", x, ty, dmg[i], { anchor: "middle" });
    s += `</g>`;
  });
  // end flag: discovered by a tenant
  const fx = xb - 2;
  s += `<g class="lt-pop" ${d(at(1) + 0.15)}>`;
  s += `<line class="lt-pole lt-pole-bad" x1="${fx}" y1="${y1 - 8}" x2="${fx}" y2="22"/><path class="lt-flag-bad" d="M${fx} 22 L${fx - 18} 28 L${fx} 34 Z"/>`;
  s += text("vi-text lt-flag-text lt-flag-text-bad", fx - 24, 33, t.insurance.visual.discovered, { anchor: "end" });
  s += `</g>`;

  // track 2: with AquaShield
  const ex = X(EARLY), lx = X(LOCATED);
  s += text("vi-text vi-text-strong lt-track lt-track-good", 0, y2 + 5, L.with);
  // the loss-avoided outline starts flush where the riser is located
  s += `<rect class="lt-avoid lt-pop" ${d(at(1) + 0.4)} x="${f1(lx)}" y="${y2 - 15}" width="${f1(xb - lx)}" height="30" rx="15"/>`;
  s += `<g class="lt-pop" ${d(at(1) + 0.55)}>` + text("vi-text lt-avoid-text", (lx + xb) / 2, y2 + 5, L.avoided, { anchor: "middle" }) + `</g>`;
  // second step of the response: a lighter segment from the flag on to the riser, tucked under the end of the first bar
  s += `<rect class="lt-seg2 lt-bar-short lt-grow" ${d(T.flagged)} x="${f1(ex - bh)}" y="${y2 - bh / 2}" width="${f1(lx - ex + bh)}" height="${bh}" rx="${bh / 2}"/>`;
  s += `<rect class="lt-bar lt-bar-short lt-grow" ${d(T.bar2)} x="${xa}" y="${y2 - bh / 2}" width="${f1(ex - xa)}" height="${bh}" rx="${bh / 2}" fill="url(#lt-good)"/>`;
  s += `<g class="lt-pop" ${d(T.flagged)}>`;
  s += `<line class="lt-pole lt-pole-good" x1="${f1(ex)}" y1="${y2 - 8}" x2="${f1(ex)}" y2="${y2 - 62}"/><path class="lt-flag-good" d="M${f1(ex)} ${y2 - 62} L${f1(ex + 18)} ${y2 - 56} L${f1(ex)} ${y2 - 50} Z"/>`;
  s += text("vi-text lt-flag-text lt-flag-text-good", ex + 24, y2 - 51, L.flagged);
  s += `</g>`;
  s += `<g class="lt-pop" ${d(T.located)}>`;
  s += `<line class="lt-tickmark" x1="${f1(lx)}" y1="${y2 - 11}" x2="${f1(lx)}" y2="${y2 + 11}"/><circle class="lt-loc" cx="${f1(lx)}" cy="${y2}" r="4"/>`;
  s += `<line class="lt-stem" x1="${f1(lx)}" y1="${y2 + 14}" x2="${f1(lx)}" y2="${y2 + 22}"/>`;
  s += text("vi-text lt-label lt-label-good", lx, y2 + 38, L.located, { anchor: "middle" });
  s += `</g>`;
  return `<svg class="lt lt-h" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

function lossTimelineSvgMobile(t) {
  const L = t.insurance.story.timeline;
  const dmg = t.insurance.visual.milestones;
  const W = 360, H = 590, ya = 74, yb = 530, bw = 12;
  const Y = (u) => ya + (yb - ya) * u;
  const ca = 14, cb = 190;            // bar centres of the two columns
  let s = `<defs><linearGradient id="ltm-bad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff6b4a" stop-opacity="0.35"/><stop offset="1" stop-color="#ff6b4a"/></linearGradient>`;
  s += `<linearGradient id="ltm-good" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#38b6ff" stop-opacity="0.55"/><stop offset="1" stop-color="#00f0ff"/></linearGradient></defs>`;
  // column heads
  s += text("vi-text vi-text-strong lt-track lt-track-bad", 0, 20, L.without, { max: 18, lh: 17 });
  s += text("vi-text vi-text-strong lt-track lt-track-good", cb - 6, 20, L.with, { max: 18, lh: 17 });
  // time grid: tick labels sit at the right edge, above each line
  TICKS.forEach((u, i) => {
    s += `<line class="lt-grid" x1="0" y1="${f1(Y(u))}" x2="${W}" y2="${f1(Y(u))}"/>`;
    s += text("vi-text vi-text-muted lt-tick", W, Y(u) - 6, L.ticks[i], { anchor: "end" });
  });
  // track 1
  s += `<rect class="lt-rail" x="${ca - bw / 2}" y="${ya}" width="${bw}" height="${yb - ya}" rx="${bw / 2}"/>`;
  s += `<rect class="lt-bar lt-grow lt-grow-v" ${d(T.bar1)} x="${ca - bw / 2}" y="${ya}" width="${bw}" height="${yb - ya}" rx="${bw / 2}" fill="url(#ltm-bad)"/>`;
  DAMAGE.forEach((u, i) => {
    const y = Y(u);
    s += `<g class="lt-pop" ${d(at(u))}><circle class="lt-dmg" cx="${ca}" cy="${f1(y)}" r="5"/><line class="lt-stem" x1="${ca + 8}" y1="${f1(y)}" x2="${ca + 16}" y2="${f1(y)}"/>`;
    s += text("vi-text lt-label", ca + 22, y + 4.5, dmg[i], { max: 17 }) + `</g>`;
  });
  s += `<g class="lt-pop" ${d(at(1) + 0.15)}><line class="lt-pole lt-pole-bad" x1="${ca}" y1="${yb}" x2="${ca}" y2="${yb + 18}"/><path class="lt-flag-bad" d="M${ca} ${yb + 18} L${ca + 18} ${yb + 24} L${ca} ${yb + 30} Z"/>`;
  s += text("vi-text lt-flag-text lt-flag-text-bad", ca + 24, yb + 28, t.insurance.visual.discovered, { max: 18 }) + `</g>`;
  // track 2
  const ey = Y(0.1), ly = Y(0.2); // a little more room than the wide layout so the labels can stack
  s += `<rect class="lt-avoid lt-pop" ${d(at(1) + 0.4)} x="${cb - bw / 2}" y="${f1(ly)}" width="${bw}" height="${f1(yb - ly)}" rx="${bw / 2}"/>`;
  s += `<g class="lt-pop" ${d(at(1) + 0.55)}>` + text("vi-text lt-avoid-text", cb + 18, Y(0.6) + 4.5, L.avoided, { max: 18 }) + `</g>`;
  s += `<rect class="lt-seg2 lt-bar-short lt-grow lt-grow-v" ${d(T.flagged)} x="${cb - bw / 2}" y="${f1(ey - bw)}" width="${bw}" height="${f1(ly - ey + bw)}" rx="${bw / 2}"/>`;
  s += `<rect class="lt-bar lt-bar-short lt-grow lt-grow-v" ${d(T.bar2)} x="${cb - bw / 2}" y="${ya}" width="${bw}" height="${f1(ey - ya)}" rx="${bw / 2}" fill="url(#ltm-good)"/>`;
  s += `<g class="lt-pop" ${d(T.flagged)}><line class="lt-pole lt-pole-good" x1="${cb + 6}" y1="${f1(ey)}" x2="${cb + 12}" y2="${f1(ey)}"/><path class="lt-flag-good" d="M${cb + 12} ${f1(ey - 5)} L${cb + 24} ${f1(ey)} L${cb + 12} ${f1(ey + 5)} Z"/>`;
  s += text("vi-text lt-flag-text lt-flag-text-good", cb + 30, ey + 4.5, L.flagged, { max: 16 }) + `</g>`;
  s += `<g class="lt-pop" ${d(T.located)}><line class="lt-tickmark" x1="${cb - 11}" y1="${f1(ly)}" x2="${cb + 11}" y2="${f1(ly)}"/><circle class="lt-loc" cx="${cb}" cy="${f1(ly)}" r="4"/><line class="lt-stem" x1="${cb + 14}" y1="${f1(ly)}" x2="${cb + 22}" y2="${f1(ly)}"/>`;
  s += text("vi-text lt-label lt-label-good", cb + 30, ly + 4.5, L.located, { max: 16 }) + `</g>`;
  return `<svg class="lt lt-v" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

function bookSvg(t) {
  const L = t.insurance.book.visual;
  const W = 560, H = 380, cols = 8, rows = 5, sz = 46, gap = 12;
  const gw = cols * sz + (cols - 1) * gap, x0 = (W - gw) / 2, y0 = 70;
  const sel = { c0: 2, c1: 5, r0: 1, r1: 3 };      // 4 x 3 = 12 tiles
  const caught = { c: 4, r: 2 };
  const order = [];
  for (let r = sel.r0; r <= sel.r1; r++) for (let c = sel.c0; c <= sel.c1; c++) order.push(`${c},${r}`);
  const tileStart = 1.3, step = 0.14;
  const caughtAt = tileStart + order.length * step + 0.3;
  let s = `<rect class="vi-grid" x="0" y="0" width="${W}" height="${H}"/>`;
  // header: book label left, frame swatch right
  s += `<g class="vi-labels">`;
  s += text("vi-text vi-text-strong", x0, 40, L.book);
  s += `<rect class="bk-swatch" x="${f1(W - x0 - 14)}" y="29" width="14" height="14" rx="3"/>`;
  s += text("vi-text vi-text-muted bk-sel-text", W - x0 - 22, 40, L.selected, { anchor: "end" });
  s += `</g>`;
  let tiles = "", on = "", caughtG = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = x0 + c * (sz + gap), y = y0 + r * (sz + gap);
    // a small building: body plus 2 x 3 windows, height varies per tile
    const hgt = [30, 36, 26, 34, 30, 38, 28, 32][(c + r * 3) % 8];
    const bx = x + 13, by = y + sz - 7 - hgt, bwid = 20;
    let win = "";
    for (let wy = 0; wy < Math.floor((hgt - 6) / 8); wy++) for (let wx = 0; wx < 2; wx++) win += `M${f1(bx + 4 + wx * 8)} ${f1(by + 5 + wy * 8)}h4v3h-4z`;
    tiles += `<g class="bk-tile"><rect class="bk-cell" x="${x}" y="${y}" width="${sz}" height="${sz}" rx="8"/><rect class="bk-bldg" x="${bx}" y="${f1(by)}" width="${bwid}" height="${hgt}" rx="2"/><path class="bk-win" d="${win}"/></g>`;
    const k = order.indexOf(`${c},${r}`);
    if (k >= 0) {
      const isC = c === caught.c && r === caught.r;
      on += `<g class="bk-on" ${d(tileStart + k * step)}><rect class="bk-cell-on" x="${x}" y="${y}" width="${sz}" height="${sz}" rx="8"/><rect class="bk-bldg-on" x="${bx}" y="${f1(by)}" width="${bwid}" height="${hgt}" rx="2"/><path class="bk-win-on" d="${win}"/><circle class="bk-sensor" cx="${x + sz - 9}" cy="${y + sz - 9}" r="3"/></g>`;
      if (isC) {
        const cx = x + sz - 2, cy = y + 2;
        caughtG += `<rect class="bk-flash" ${d(caughtAt)} x="${x}" y="${y}" width="${sz}" height="${sz}" rx="8"/>`;
        caughtG += `<g class="bk-caught" ${d(caughtAt + 1.1)}><circle class="bk-halo" cx="${cx}" cy="${cy}" r="10"/><circle class="bk-badge" cx="${cx}" cy="${cy}" r="10"/><path class="bk-check" pathLength="1" d="M${cx - 4.5} ${cy + 0.5} l3 3 l6 -6.5"/></g>`;
      }
    }
  }
  s += tiles + on + caughtG;
  // selection frame around the 12 tiles, drawn once
  const fx = x0 + sel.c0 * (sz + gap) - 7, fy = y0 + sel.r0 * (sz + gap) - 7;
  const fw = (sel.c1 - sel.c0 + 1) * (sz + gap) - gap + 14, fh = (sel.r1 - sel.r0 + 1) * (sz + gap) - gap + 14;
  s += `<rect class="bk-frame" ${d(0.3)} pathLength="1" x="${f1(fx)}" y="${f1(fy)}" width="${f1(fw)}" height="${f1(fh)}" rx="12"/>`;
  return `<svg class="vis vis-book" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(L.alt)}" focusable="false">${s}</svg>`;
}

module.exports = { lossTimelineSvg, lossTimelineSvgMobile, bookSvg };
