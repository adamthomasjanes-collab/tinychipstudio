/**
 * Generates the brand files in public/ from the same pixel data the site uses:
 *   public/favicon.svg
 *   public/brand/*.svg            logo lockups, Chip, app icon, crew
 *   public/badge/*                "website by" badge: embed snippet, script, demo, image versions
 *
 * Run:  npm run brand        (no dependencies; plain Node 18+)
 * PNG exports (apple-touch-icon, manifest icons, og-image) are made separately;
 * see README → "Brand files".
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from '../src/chip/sprite.js';
import { BADGE_CSS, badgeChipSvg, badgeHtml } from '../src/chip/badge-kit.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, s) => {
  const f = path.join(root, 'public', p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, s.trim() + '\n');
  console.log('wrote public/' + p);
};

const INK = '#0b0d11';
const PAPER = '#f4f1e8';
const base = { K: INK, L: '#fffdf6', S: '#e6e0cf', H: '#ffffff', F: INK, W: '#ffffff', M: INK, D: '#c7ff58', P: '#ff69bd', X: INK, G: 'rgba(11,13,17,.16)' };
const onDark = { ...base, M: PAPER, X: PAPER, G: 'rgba(244,241,232,.14)' };

const rects = (runs, pal, dx = 0, dy = 0) =>
  runs.map((r) => `<rect x="${r.x + dx}" y="${r.y + dy}" width="${r.w}" height="1" fill="${pal[r.c]}"/>`).join('');
const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"${extra}>${body}</svg>`;

const chipIdle = [S.body, S.legs.stand, S.arms.idle, S.eyes.open, S.cheeks, S.mouths.smile];
const chipMark = [S.body, S.legs.stand, S.eyes.open, S.cheeks, S.mouths.smile];
const miniChip = [S.mini.legs, S.mini.body, S.mini.face];

/* ---------------------------------------------------------------- favicon */
out('favicon.svg', svg(16, 16, miniChip.map((l) => rects(l, base)).join('')));

/* ---------------------------------------------------------------- Chip */
out('brand/chip.svg', svg(32, 32, [S.shadow.full, ...chipIdle].map((l) => rects(l, base)).join('')));
out('brand/chip-on-dark.svg', svg(32, 32, [S.shadow.full, ...chipIdle].map((l) => rects(l, onDark)).join('')));

// Animated Chip: waves, blinks. Works as an <img>; respects reduced motion.
const g = (cls, layers, pal = base) => `<g class="${cls}">${layers.map((l) => rects(l, pal)).join('')}</g>`;
const animStyle = `<style>
.b,.w2{opacity:0}
@media (prefers-reduced-motion:no-preference){
.o{animation:o 4.6s steps(1,end) infinite}.b{animation:s 4.6s steps(1,end) infinite}
.w1{animation:a .64s steps(1,end) infinite}.w2{animation:c .64s steps(1,end) infinite}
.f{animation:h 1s steps(1,end) infinite}}
@keyframes o{0%,100%{opacity:1}93%{opacity:0}96%{opacity:1}}
@keyframes s{0%,100%{opacity:0}93%{opacity:1}96%{opacity:0}}
@keyframes a{0%{opacity:1}50%{opacity:0}}@keyframes c{0%{opacity:0}50%{opacity:1}}
@keyframes h{0%{transform:none}50%{transform:translateY(-1px)}}
</style>`;
out(
  'brand/chip-animated.svg',
  svg(
    32,
    32,
    animStyle +
      g('', [S.shadow.full]) +
      `<g class="f">` +
      g('', [S.legs.stand, S.body]) +
      g('w1', [S.arms.waveA]) +
      g('w2', [S.arms.waveB]) +
      g('', [S.cheeks, S.mouths.grin]) +
      g('o', [S.eyes.happy]) +
      g('b', [S.eyes.blink]) +
      `</g>`,
  ),
);

// Lost Chip, for the 404 page.
out('brand/chip-lost.svg', svg(32, 32, [S.shadow.full, S.body, S.legs.stand, S.arms.think, S.eyes.up, S.mouths.oh, S.extras.question].map((l) => rects(l, base)).join('')));

/* ---------------------------------------------------------------- crew */
Object.entries(S.CREW).forEach(([k, c]) => {
  out(`brand/crew-${k}.svg`, svg(32, 32, chipIdle.map((l) => rects(l, { ...base, L: c.body, S: c.shade })).join('')));
});

/* ---------------------------------------------------------------- logos */
const L1 = S.word('TINY CHIP', { x0: 35, y0: 6 });
const L2 = S.word('STUDIO', { x0: 35, y0: 17 });
const stackW = 35 + Math.max(L1.width, L2.width);
const ONE = S.word('TINY CHIP STUDIO', { x0: 20, y0: 4 });
const lineW = 20 + ONE.width;

for (const [suffix, pal, text] of [
  ['', base, INK],
  ['-on-dark', onDark, PAPER],
]) {
  const t = { K: text };
  out(`brand/logo-stacked${suffix}.svg`, svg(stackW, 32, chipMark.map((l) => rects(l, pal)).join('') + rects(L1.runs, t) + rects(L2.runs, t)));
  out(`brand/logo-line${suffix}.svg`, svg(lineW, 16, miniChip.map((l) => rects(l, pal)).join('') + rects(ONE.runs, t)));
  const W1 = S.word('TINY CHIP STUDIO');
  out(`brand/wordmark${suffix}.svg`, svg(W1.width, 9, rects(W1.runs, t)));
}

// App icon / social avatar: Chip on a lime tile.
out('brand/app-icon.svg', svg(40, 40, `<rect width="40" height="40" fill="#c7ff58"/>` + chipMark.map((l) => rects(l, base, 4, 3)).join('')));

/* ---------------------------------------------------------------- badge */
const SITE = 'https://www.tinychipstudio.com/';
const LABEL = 'tinychipstudio.com';
const snippet = `<style>${BADGE_CSS}</style>\n${badgeHtml({ href: SITE, label: LABEL })}`;

out('badge/snippet.html', `<!-- Tiny Chip Studio "website by" badge. Paste into the client site's footer.
     It inherits the footer's text colour; Chip's body stays white. -->
${snippet}`);

out(
  'badge/tcs-badge.js',
  `/* Tiny Chip Studio badge — <script src="${SITE}badge/tcs-badge.js" defer></script> then <tcs-badge></tcs-badge> */
(()=>{if(customElements.get('tcs-badge'))return;const css=${JSON.stringify(BADGE_CSS)};const html=${JSON.stringify(badgeHtml({ href: SITE, label: LABEL }))};
customElements.define('tcs-badge',class extends HTMLElement{connectedCallback(){if(this.shadowRoot)return;const r=this.attachShadow({mode:'open'});r.innerHTML='<style>:host{display:inline-block;color:inherit}'+css+'</style>'+html;}});})();`,
);

// Image-only versions for places that strip <style> (e.g. some page builders).
for (const [name, color] of [
  ['badge-ink', INK],
  ['badge-paper', PAPER],
]) {
  const chip = badgeChipSvg().replace(/currentColor/g, color);
  const inner = chip.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  out(
    `badge/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 32" width="200" height="32" shape-rendering="crispEdges">
<style>.tcs-shut{opacity:0}@media (prefers-reduced-motion:no-preference){.tcs-open{animation:o 5.2s steps(1,end) infinite}.tcs-shut{animation:s 5.2s steps(1,end) infinite}}@keyframes o{0%,100%{opacity:1}94%{opacity:0}97%{opacity:1}}@keyframes s{0%,100%{opacity:0}94%{opacity:1}97%{opacity:0}}
text{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;fill:${color}}</style>
<g transform="translate(2 2) scale(1.75)">${inner}</g>
<text x="38" y="13" font-size="8.5" letter-spacing=".9" opacity=".75">WEBSITE BY</text>
<text x="38" y="26" font-size="13" font-weight="700">${LABEL}</text>
</svg>`,
  );
}

out(
  'badge/index.html',
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tiny Chip Studio badge</title><meta name="robots" content="noindex">
<style>body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#f4f1e8;color:#0b0d11}main{max-width:760px;margin:0 auto;padding:48px 20px}
.demo{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:22px 24px;margin:16px 0 34px;border:2px solid #0b0d11}
.dark{background:#0b0d11;color:#f4f1e8}.blue{background:#5c89ff;color:#0b0d11}pre{white-space:pre-wrap;word-break:break-all;background:#fff;border:2px solid #0b0d11;padding:16px;font-size:12px}</style></head>
<body><main><h1>“Website by” badge</h1><p>The badge takes the footer’s text colour. Chip blinks every few seconds and waves on hover. Animation is off for visitors who prefer reduced motion.</p>
<div class="demo"><span>© Client Business</span>${snippet}</div>
<div class="demo dark"><span>© Client Business</span>${badgeHtml({ href: SITE, label: LABEL })}</div>
<div class="demo blue"><span>© Client Business</span>${badgeHtml({ href: SITE, label: LABEL })}</div>
<h2>Option 1: paste the snippet</h2><pre>${snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>
<h2>Option 2: script + tag</h2><pre>&lt;script src="${SITE}badge/tcs-badge.js" defer&gt;&lt;/script&gt;\n&lt;tcs-badge&gt;&lt;/tcs-badge&gt;</pre>
<h2>Option 3: image only</h2><p>For page builders that strip styles: <code>badge-ink.svg</code> (light footers) or <code>badge-paper.svg</code> (dark footers), wrapped in a link.</p>
<p><img src="badge-ink.svg" alt="Website by tinychipstudio.com" width="200" height="32"></p>
<p class="dark" style="padding:10px"><img src="badge-paper.svg" alt="Website by tinychipstudio.com" width="200" height="32"></p>
</main></body></html>`,
);
