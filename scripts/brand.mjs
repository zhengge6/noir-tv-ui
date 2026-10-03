#!/usr/bin/env node
// Generates the NOIR brand SVGs in ./brand from pure geometry (no fonts, no raster).
// Usage: node scripts/brand.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "brand");
mkdirSync(OUT, { recursive: true });
const f = (n) => +n.toFixed(2);

/* ------------------------------------------------------------------ */
/* Letterforms on a 100-unit cap height. s = stroke weight.            */
/* Each returns { w, d } : advance width and path data at origin 0,0.  */
/* ------------------------------------------------------------------ */
const G = {
  N(s) {
    const w = 84, dx = w - 2 * s, k = 100 - 2 * s * 0.9; // diagonal drop
    return { w, d: `M0 100V0H${s}L${w - s} ${f(k)}V0H${w}V100H${w - s}L${s} ${f(100 - k)}V100Z` };
  },
  O(s, rim = 0) {
    // rim > 0 shifts the counter up-left, so the ring thickens toward the lower right like the mark's crescent
    const r = 51, c = 51, ri = r - s * 1.04 - rim * 0.15, o = rim * 0.62, ci = c - o, cy = 50 - o;
    return { w: 102, d: `M${c} ${50 - r}A${r} ${r} 0 1 1 ${c} ${50 + r}A${r} ${r} 0 1 1 ${c} ${50 - r}Z` +
      `M${f(ci)} ${f(cy - ri)}A${f(ri)} ${f(ri)} 0 1 0 ${f(ci)} ${f(cy + ri)}A${f(ri)} ${f(ri)} 0 1 0 ${f(ci)} ${f(cy - ri)}Z` };
  },
  I(s) { return { w: s, d: `M0 0H${s}V100H0Z` }; },
  R(s) {
    const bh = 60, r = bh / 2, bx = 48, ri = r - s, leg = s * 1.12;
    const lx = 36;                       // leg starts here on the bowl's bottom edge
    return { w: 80, d:
      `M0 0H${s}V100H0Z` +
      `M${s} 0H${bx}A${r} ${r} 0 0 1 ${bx} ${bh}H${s}Z` +
      `M${s} ${s}V${bh - s}H${bx}A${ri} ${ri} 0 0 0 ${bx} ${s}Z` +
      `M${lx} ${bh - 2}H${f(lx + leg)}L80 100H${f(80 - leg)}Z` };
  },
  T(s) { const w = 78; return { w, d: `M0 0H${w}V${s}H0Z M${f(w / 2 - s / 2)} 0H${f(w / 2 + s / 2)}V100H${f(w / 2 - s / 2)}Z` }; },
  V(s) {
    const w = 88, t = s * 1.12, ax = w / 2;
    const slope = (ax - t / 2) / 100;           // dx per dy of outer edge
    const yi = (ax - t) / slope;                 // inner apex height
    return { w, d: `M0 0H${f(t)}L${ax} ${f(yi)}L${f(w - t)} 0H${w}L${f(ax + t / 2)} 100H${f(ax - t / 2)}Z` };
  },
  U(s) {
    const w = 76, r = w / 2, ri = r - s, y = 100 - r;
    return { w, d: `M0 0H${s}V${y}A${ri} ${ri} 0 0 0 ${w - s} ${y}V0H${w}V${y}A${r} ${r} 0 0 1 0 ${y}Z` };
  },
};
// optical side bearings (round letters sit tighter)
const SB = { N: [0, 0], O: [-5, -5], I: [0, 0], R: [0, -2], T: [-2, -2], V: [-3, -3], U: [0, 0] };

function word(text, s, track, rim = 0) {
  let x = 0, d = "";
  [...text].forEach((ch, i) => {
    if (ch === " ") { x += 40; return; }
    const g = ch === "O" ? G.O(s, rim) : G[ch](s), [l, r] = SB[ch];
    x += l;
    d += `<path transform="translate(${f(x)} 0)" d="${g.d}"/>`;
    x += g.w + r + (i < text.length - 1 ? track : 0);
  });
  return { w: x, d };
}

/* ------------------------------------------------------------------ */
/* Mark: "Rim" — a red disc eclipsed by a black disc on a dark tile,   */
/* leaving a thin crescent of rim light (the signature noir lighting). */
/* ------------------------------------------------------------------ */
function mark(id) {
  // Annular "rim light": red disc R, black occluder r, offset so the occluder is tangent at the top-left.
  const C = 64, R = 37, r = 32.5, d = (R - r) / Math.SQRT2 - 0.35, oc = f(C - d);
  return `
  <defs>
    <linearGradient id="${id}-tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#18181A"/><stop offset="1" stop-color="#0A0A0B"/>
    </linearGradient>
    <linearGradient id="${id}-red" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
      <stop offset="0" stop-color="#8E040B"/><stop offset=".5" stop-color="#E50914"/><stop offset="1" stop-color="#FF5A62"/>
    </linearGradient>
    <mask id="${id}-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128">
      <rect width="128" height="128" fill="#fff"/><circle cx="${oc}" cy="${oc}" r="${r}" fill="#000"/>
    </mask>
    <filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    <clipPath id="${id}-clip"><rect width="128" height="128" rx="30"/></clipPath>
  </defs>
  <g clip-path="url(#${id}-clip)">
    <rect width="128" height="128" fill="url(#${id}-tile)"/>
    <circle cx="${C}" cy="${C}" r="${R}" fill="#E50914" opacity=".42" mask="url(#${id}-cut)" filter="url(#${id}-blur)"/>
    <circle cx="${C}" cy="${C}" r="${R}" fill="url(#${id}-red)" mask="url(#${id}-cut)"/>
  </g>
  <rect x=".5" y=".5" width="127" height="127" rx="29.5" fill="none" stroke="#fff" stroke-opacity=".1"/>`;
}

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <title>${title}</title>${body}
</svg>
`;
}

export function lockup(theme, id = "nl") {
  const ink = theme === "dark" ? "#FFFFFF" : "#0A0A0A";
  const sub = theme === "dark" ? "#8C8C8C" : "#6B6B6B";
  const rule = theme === "dark" ? "#3A3A3A" : "#D4D4D4";
  const W = word("NOIR", 18, 27, 6);
  const D = word("TV UI", 15, 26);
  const cap = 64, sc = cap / 100, dcap = 26, dsc = dcap / 100;
  const markSize = 120, gap = 34;
  const wx = markSize + gap, wy = (markSize - cap) / 2;
  const rx = wx + W.w * sc + 30, dx = rx + 30, dy = (markSize - dcap) / 2;
  const width = Math.ceil(dx + D.w * dsc + 4);
  const body = `
  <g transform="scale(${markSize / 128})">${mark(id)}</g>
  <g fill="${ink}" transform="translate(${wx} ${wy}) scale(${sc})">${W.d}</g>
  <rect x="${f(rx)}" y="${markSize / 2 - 20}" width="1.5" height="40" fill="${rule}"/>
  <g fill="${sub}" transform="translate(${f(dx)} ${f(dy)}) scale(${dsc})">${D.d}</g>`;
  return { w: width, h: markSize, body };
}

export function social() {
  const L = lockup("dark", "sp");
  const lw = 430, ls = lw / L.w;
  // a few abstract "posters" (gradients only, no imagery)
  const pal = [["#3a0d12", "#0d0d10"], ["#1b2735", "#0b0d12"], ["#2a1238", "#0c0a10"], ["#40150b", "#0e0b0a"], ["#10302c", "#0a0d0c"]];
  let posters = "", defs = "";
  pal.forEach((p, i) => {
    defs += `<linearGradient id="pg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient>`;
    const x = 800 + i * 112, y = 392 - (i % 2) * 16, w = 100, h = 150;
    posters += `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#pg${i})"/>` +
      `<rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="11.5" fill="none" stroke="#fff" stroke-opacity=".07"/>` +
      (i === 1 ? `<rect x="${x + 10}" y="${y + h - 14}" width="${w - 20}" height="3" rx="1.5" fill="#fff" fill-opacity=".22"/><rect x="${x + 10}" y="${y + h - 14}" width="${(w - 20) * .62}" height="3" rx="1.5" fill="#E50914"/>` : "") +
      `</g>`;
  });
  const C = 1040, Cy = 268, R = 236, r = 214, d = (R - r) / Math.SQRT2 - 1;
  const body = `
  <defs>
    <radialGradient id="bg" cx="0.78" cy="0.38" r="0.75"><stop offset="0" stop-color="#1a0c0e"/><stop offset=".55" stop-color="#0b0b0c"/><stop offset="1" stop-color="#070707"/></radialGradient>
    <linearGradient id="ring" x1="0.1" y1="0.1" x2="0.9" y2="0.9"><stop offset="0" stop-color="#5e0207"/><stop offset=".55" stop-color="#E50914"/><stop offset="1" stop-color="#FF5A62"/></linearGradient>
    <mask id="ringcut" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="640"><rect width="1280" height="640" fill="#fff"/><circle cx="${C - d}" cy="${Cy - d}" r="${r}" fill="#000"/></mask>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="28"/></filter>
    <linearGradient id="fadeR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070707" stop-opacity="0"/><stop offset="1" stop-color="#070707" stop-opacity=".92"/></linearGradient>
    ${defs}
  </defs>
  <rect width="1280" height="640" fill="url(#bg)"/>
  <circle cx="${C}" cy="${Cy}" r="${R}" fill="#E50914" opacity=".3" mask="url(#ringcut)" filter="url(#soft)"/>
  <circle cx="${C}" cy="${Cy}" r="${R}" fill="url(#ring)" mask="url(#ringcut)"/>
  ${posters}
  <rect x="740" y="420" width="540" height="220" fill="url(#fadeR)"/>
  <g transform="translate(90 132) scale(${f(ls)})">${L.body}</g>
  <text x="90" y="318" fill="#EDEDED" font-family="Inter, Geist, 'Helvetica Neue', Arial, sans-serif" font-size="44" font-weight="600" letter-spacing="-1">Cinematic UI for the big screen.</text>
  <text x="90" y="366" fill="#8F8F8F" font-family="Inter, Geist, 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="400">Design tokens, poster rows, D-pad focus and a</text>
  <text x="90" y="398" fill="#8F8F8F" font-family="Inter, Geist, 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="400">WebView-safe back stack. Zero dependencies.</text>
  ${["Vanilla JS", "React", "Vue 3", "Android TV", "WebView"].reduce((a, t) => {
    const w = 26 + t.length * 10.4;
    a.s += `<g transform="translate(${f(a.x)} 446)"><rect width="${f(w)}" height="36" rx="18" fill="#fff" fill-opacity=".05" stroke="#fff" stroke-opacity=".14"/><text x="${f(w / 2)}" y="23.5" text-anchor="middle" fill="#CFCFCF" font-family="Inter, Geist, sans-serif" font-size="15" font-weight="500">${t}</text></g>`;
    a.x += w + 10; return a; }, { x: 90, s: "" }).s}
  <text x="90" y="566" fill="#5E5E5E" font-family="'Geist Mono', 'Roboto Mono', monospace" font-size="17">github.com/zhengge6/noir-tv-ui</text>`;
  return body;
}

export function markOnly(id = "nm") { return mark(id); }
export { word };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const t of ["dark", "light"]) {
    const L = lockup(t, `n${t[0]}`);
    writeFileSync(join(OUT, `logo-${t}.svg`), svg(L.w, L.h, L.body, "NOIR TV UI"));
  }
  writeFileSync(join(OUT, "mark.svg"), svg(128, 128, mark("nm"), "NOIR mark"));
  const W = word("NOIR", 18, 27, 6);
  for (const t of ["dark", "light"]) {
    writeFileSync(join(OUT, `wordmark-${t}.svg`), svg(Math.ceil(W.w), 100,
      `<g fill="${t === "dark" ? "#FFFFFF" : "#0A0A0A"}">${W.d}</g>`, "NOIR"));
  }
  {
    // README header: the dark lockup on a #0A0A0A canvas, 1000 px wide, centred in 1280x400 (used in light and dark mode)
    const L = lockup("dark", "rh"), sc = 1000 / L.w, x = (1280 - 1000) / 2, y = (400 - L.h * sc) / 2;
    writeFileSync(join(OUT, "readme-logo.svg"), svg(1280, 400,
      `<rect width="1280" height="400" fill="#0A0A0A"/><g transform="translate(${f(x)} ${f(y)}) scale(${f(sc * 1000) / 1000})">${L.body}</g>`, "NOIR TV UI"));
  }
  {
    // The eclipse ring alone (transparent), used as a motif in docs/illustrations
    const C = 300, R = 236, r = 212, d = (R - r) / Math.SQRT2 - 1;
    writeFileSync(join(OUT, "ring.svg"), svg(600, 600, `
  <defs>
    <linearGradient id="rg" x1="0.1" y1="0.1" x2="0.9" y2="0.9"><stop offset="0" stop-color="#5e0207"/><stop offset=".55" stop-color="#E50914"/><stop offset="1" stop-color="#FF5A62"/></linearGradient>
    <mask id="rm" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600"><rect width="600" height="600" fill="#fff"/><circle cx="${f(C - d)}" cy="${f(C - d)}" r="${r}" fill="#000"/></mask>
    <filter id="rb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <circle cx="${C}" cy="${C}" r="${R}" fill="#E50914" opacity=".34" mask="url(#rm)" filter="url(#rb)"/>
  <circle cx="${C}" cy="${C}" r="${R}" fill="url(#rg)" mask="url(#rm)"/>`, "NOIR ring"));
  }
  writeFileSync(join(OUT, "social-preview.svg"), svg(1280, 640, social(), "NOIR TV UI"));
  console.log("brand/: social-preview.svg logo-dark.svg logo-light.svg mark.svg wordmark-dark.svg wordmark-light.svg");
}
