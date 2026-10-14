/**
 * Chip — Tiny Chip Studio's mascot, drawn on a 32 × 32 pixel grid.
 *
 * Every part of Chip is a layer of pixels. Layers are painted here with small
 * rectangle helpers, then compiled into horizontal runs so each row becomes a
 * handful of <rect>s. The same data drives the React component, the logo files
 * and the "built by" badge, so Chip looks identical everywhere.
 *
 * Colour keys (resolved through CSS variables, so the crew can recolour):
 *   K package edge · L package · S shade · H highlight · F face glow · W eye shine
 *   M metal leads · P cheek · X marks (zzz, ?) · G ground shadow
 */

export const SIZE = 32;

const blank = () => Array.from({ length: SIZE }, () => Array(SIZE).fill('.'));
const fill = (g, x, y, w, h, c) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < SIZE) g[j][i] = c;
};
const dots = (g, pts, c) => pts.forEach(([x, y]) => fill(g, x, y, 1, 1, c));

/** Paint a layer with a callback, then compile it to rect runs. */
function layer(paint) {
  const g = blank();
  paint(g);
  return compile(g);
}

/** Turn a painted grid into [{c,x,y,w}] runs (h is always 1). */
export function compile(g) {
  const runs = [];
  g.forEach((row, y) => {
    let x = 0;
    while (x < SIZE) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let w = 1;
      while (x + w < SIZE && row[x + w] === c) w++;
      runs.push({ c, x, y, w });
      x += w;
    }
  });
  return runs;
}

/* ------------------------------------------------------------------ body */

// The package: a 20 × 18 chip (x 6–25, y 6–23) with a bevelled pin-1 corner,
// a pin-1 dot, and short, evenly spaced leads on every side.
const TOP_PINS = [8, 11, 14, 17, 20, 23];
const SIDE_PINS = [10, 13, 16, 19];

export const body = layer((g) => {
  // leads (M = metal). Bottom leads 11 and 20 are Chip's legs, drawn separately.
  TOP_PINS.forEach((x) => { fill(g, x, 4, 1, 2, 'M'); if (x !== 11 && x !== 20) fill(g, x, 24, 1, 2, 'M'); });
  SIDE_PINS.forEach((y) => { fill(g, 4, y, 2, 1, 'M'); fill(g, 26, y, 2, 1, 'M'); });
  // package outline + fill
  fill(g, 6, 6, 20, 18, 'K');
  fill(g, 7, 7, 18, 16, 'L');
  // bevelled pin-1 corner (top-left) and squared others
  dots(g, [[6, 6], [7, 6], [6, 7]], '.'); dots(g, [[7, 7], [8, 7], [7, 8]], 'K');
  // top highlight + bottom/right shade (a little depth)
  fill(g, 9, 7, 15, 1, 'H'); fill(g, 7, 9, 1, 13, 'H');
  fill(g, 8, 22, 17, 1, 'S'); fill(g, 24, 8, 1, 14, 'S');
  // pin-1 dot
  fill(g, 9, 9, 2, 2, 'D');
});

/* ------------------------------------------------------------------ legs */

// Legs are just two bottom leads, bent into feet.
export const legs = {
  stand: layer((g) => { fill(g, 11, 24, 1, 3, 'M'); fill(g, 9, 27, 3, 1, 'M'); fill(g, 20, 24, 1, 3, 'M'); fill(g, 20, 27, 3, 1, 'M'); }),
  stepA: layer((g) => { fill(g, 11, 24, 1, 2, 'M'); fill(g, 9, 26, 3, 1, 'M'); fill(g, 20, 24, 1, 3, 'M'); fill(g, 20, 27, 3, 1, 'M'); }),
  stepB: layer((g) => { fill(g, 11, 24, 1, 3, 'M'); fill(g, 9, 27, 3, 1, 'M'); fill(g, 20, 24, 1, 2, 'M'); fill(g, 20, 26, 3, 1, 'M'); }),
  runA: layer((g) => { dots(g, [[11, 24], [10, 25], [9, 26]], 'M'); fill(g, 7, 26, 2, 1, 'M'); dots(g, [[20, 24], [21, 25], [22, 26]], 'M'); fill(g, 22, 27, 3, 1, 'M'); }),
  runB: layer((g) => { fill(g, 11, 24, 1, 3, 'M'); fill(g, 11, 27, 3, 1, 'M'); dots(g, [[20, 24], [19, 25], [18, 26]], 'M'); fill(g, 16, 26, 2, 1, 'M'); }),
  hop: layer((g) => { fill(g, 11, 24, 1, 2, 'M'); fill(g, 10, 26, 2, 1, 'M'); fill(g, 20, 24, 1, 2, 'M'); fill(g, 20, 26, 2, 1, 'M'); }),
};

/* ------------------------------------------------------------------ arms */

// Arms are side leads that bend when Chip has something to say. Every arm starts
// on top of an existing lead, so the pin count stays honest.

export const arms = {
  idle: layer(() => {}),
  waveA: layer((g) => { fill(g, 26, 13, 2, 1, 'M'); fill(g, 28, 9, 1, 5, 'M'); fill(g, 28, 7, 2, 2, 'M'); }),
  waveB: layer((g) => { fill(g, 26, 13, 2, 1, 'M'); fill(g, 28, 11, 1, 2, 'M'); fill(g, 29, 9, 1, 2, 'M'); fill(g, 30, 7, 2, 2, 'M'); }),
  point: layer((g) => { fill(g, 26, 16, 5, 1, 'M'); fill(g, 30, 15, 2, 1, 'M'); }),
  cheer: layer((g) => {
    
    fill(g, 4, 13, 2, 1, 'M'); fill(g, 3, 9, 1, 5, 'M'); fill(g, 2, 7, 2, 2, 'M');
    fill(g, 26, 13, 2, 1, 'M'); fill(g, 28, 9, 1, 5, 'M'); fill(g, 28, 7, 2, 2, 'M');
  }),
  runA: layer((g) => { fill(g, 4, 16, 2, 1, 'M'); dots(g, [[3, 17], [2, 18]], 'M'); fill(g, 26, 13, 2, 1, 'M'); dots(g, [[28, 12], [29, 11]], 'M'); fill(g, 29, 10, 2, 1, 'M'); }),
  runB: layer((g) => { fill(g, 4, 13, 2, 1, 'M'); dots(g, [[3, 12], [2, 11]], 'M'); fill(g, 1, 10, 2, 1, 'M'); fill(g, 26, 16, 2, 1, 'M'); dots(g, [[28, 17], [29, 18]], 'M'); }),
  think: layer((g) => { fill(g, 26, 19, 2, 1, 'M'); fill(g, 28, 19, 1, 3, 'M'); fill(g, 25, 21, 3, 1, 'M'); }),
};

/* ------------------------------------------------------------------ eyes */

// Tall eyes: 2 × 4 at x 11–12 and 19–20, rows 11–14, with a one-pixel shine.
const EY = 11;
const eye = (g, x, shine) => { fill(g, x, EY, 2, 4, 'F'); if (shine !== null) dots(g, [[x + shine, EY]], 'W'); };

export const eyes = {
  open: layer((g) => { eye(g, 11, 1); eye(g, 19, 1); }),
  left: layer((g) => { fill(g, 10, EY, 2, 4, 'F'); fill(g, 18, EY, 2, 4, 'F'); dots(g, [[10, EY], [18, EY]], 'W'); }),
  right: layer((g) => { fill(g, 12, EY, 2, 4, 'F'); fill(g, 20, EY, 2, 4, 'F'); dots(g, [[13, EY], [21, EY]], 'W'); }),
  up: layer((g) => { fill(g, 11, EY - 1, 2, 4, 'F'); fill(g, 19, EY - 1, 2, 4, 'F'); dots(g, [[12, EY - 1], [20, EY - 1]], 'W'); }),
  blink: layer((g) => { fill(g, 10, EY + 2, 3, 1, 'F'); fill(g, 19, EY + 2, 3, 1, 'F'); }),
  happy: layer((g) => { dots(g, [[10, EY + 2], [11, EY + 1], [12, EY + 1], [13, EY + 2], [18, EY + 2], [19, EY + 1], [20, EY + 1], [21, EY + 2]], 'F'); }),
  wink: layer((g) => { dots(g, [[10, EY + 2], [11, EY + 1], [12, EY + 1], [13, EY + 2]], 'F'); eye(g, 19, 1); }),
  wide: layer((g) => { fill(g, 10, EY - 1, 3, 5, 'F'); fill(g, 19, EY - 1, 3, 5, 'F'); fill(g, 11, EY, 1, 2, 'W'); fill(g, 20, EY, 1, 2, 'W'); }),
  sleep: layer((g) => { fill(g, 10, EY + 2, 3, 1, 'F'); fill(g, 19, EY + 2, 3, 1, 'F'); }),
};

/* ------------------------------------------------------------------ face */

export const cheeks = layer((g) => { fill(g, 9, 16, 2, 1, 'P'); fill(g, 21, 16, 2, 1, 'P'); });

/** Soft ground shadow (rendered at low opacity). */
export const shadow = {
  full: layer((g) => { fill(g, 6, 28, 20, 1, 'G'); fill(g, 8, 29, 16, 1, 'G'); }),
  small: layer((g) => { fill(g, 9, 28, 14, 1, 'G'); }),
};

export const mouths = {
  // The signature: a lopsided grin, pulled up on Chip's left (our right).
  smile: layer((g) => { fill(g, 14, 18, 4, 1, 'F'); dots(g, [[18, 17]], 'F'); }),
  grin: layer((g) => { fill(g, 13, 17, 6, 1, 'F'); fill(g, 14, 18, 4, 1, 'F'); fill(g, 15, 18, 2, 1, 'P'); }),
  talk: layer((g) => { fill(g, 14, 17, 4, 3, 'F'); fill(g, 15, 18, 2, 1, 'P'); }),
  oh: layer((g) => { fill(g, 15, 17, 2, 2, 'F'); }),
  flat: layer((g) => { fill(g, 14, 18, 4, 1, 'F'); }),
};

/* ------------------------------------------------------------------ extras */

export const extras = {
  sparks: layer((g) => {
    fill(g, 2, 1, 1, 3, 'P'); fill(g, 1, 2, 3, 1, 'P');
    fill(g, 30, 1, 1, 3, 'P'); fill(g, 29, 2, 3, 1, 'P');
  }),
  speed: layer((g) => { fill(g, 0, 12, 3, 1, 'X'); fill(g, 0, 15, 2, 1, 'X'); fill(g, 1, 19, 2, 1, 'X'); }),
  zzz: layer((g) => {
    fill(g, 26, 0, 3, 1, 'X'); dots(g, [[27, 1]], 'X'); fill(g, 26, 2, 3, 1, 'X');
    fill(g, 29, 3, 2, 1, 'X'); dots(g, [[29, 4]], 'X'); fill(g, 29, 5, 2, 1, 'X');
  }),
  question: layer((g) => {
    fill(g, 27, 0, 3, 1, 'X'); dots(g, [[30, 1], [29, 2]], 'X'); dots(g, [[28, 3]], 'X'); dots(g, [[28, 5]], 'X');
  }),
};

/* ------------------------------------------------------------------ crew props */

// One small prop each, sitting above the top leads, so the crew read as
// different characters even at a glance (Bit is the one without: it's smaller).
export const props = {
  // Byte keeps the work organized: a pencil, parked.
  byte: layer((g) => {
    fill(g, 10, 2, 1, 2, 'K'); fill(g, 11, 2, 2, 2, 'T'); fill(g, 13, 2, 6, 2, 'Y');
    fill(g, 19, 2, 1, 2, 'M'); fill(g, 20, 2, 2, 2, 'P');
  }),
  // Pixel sweats the details: a neat little bow.
  pixel: layer((g) => {
    fill(g, 18, 0, 3, 4, 'P'); fill(g, 23, 0, 3, 4, 'P'); fill(g, 21, 1, 2, 2, 'K');
    dots(g, [[18, 0], [25, 3]], '.');
  }),
  // Glitch finds what's broken: a bent, sparking antenna.
  glitch: layer((g) => {
    dots(g, [[23, 3], [24, 2], [23, 1], [24, 0]], 'M'); dots(g, [[26, 0], [27, 2], [21, 1]], 'Y');
  }),
  // Boot gets things started: an antenna with a power light.
  boot: layer((g) => { fill(g, 15, 2, 1, 4, 'M'); fill(g, 14, 0, 3, 2, 'D'); }),
};

/** Colour keys → CSS custom properties (with defaults). */
export const COLORS = {
  K: 'var(--chip-edge, #0b0d11)',
  L: 'var(--chip-body, #fffdf6)',
  S: 'var(--chip-shade, #e6e0cf)',
  H: 'var(--chip-light, #ffffff)',
  F: 'var(--chip-face, #0b0d11)',
  W: 'var(--chip-shine, #ffffff)',
  M: 'var(--chip-metal, #0b0d11)',
  D: 'var(--chip-dot, #c7ff58)',
  P: 'var(--chip-cheek, #ff69bd)',
  X: 'var(--chip-mark, #0b0d11)',
  G: 'var(--chip-ground, rgba(11,13,17,.16))',
  Y: 'var(--chip-yellow, #ffcf3f)',
  T: 'var(--chip-wood, #f2d3a2)',
};

/**
 * The crew: same chip, different body colour. Each one is hiding somewhere on the site.
 */
export const CREW = {
  chip: { name: 'Chip', body: '#fffdf6', shade: '#e6e0cf', role: 'The guide' },
  byte: { name: 'Byte', body: '#c9d8ff', shade: '#9fb6f2', role: 'Keeps the work organized' },
  pixel: { name: 'Pixel', body: '#ffc9e6', shade: '#f59cc9', role: 'Sweats the details' },
  glitch: { name: 'Glitch', body: '#ffd99a', shade: '#f2b75a', role: 'Finds what’s broken' },
  boot: { name: 'Boot', body: '#bff5e6', shade: '#86e0c6', role: 'Gets things started' },
  bit: { name: 'Bit', body: '#e4ff9f', shade: '#bde85c', role: 'The smallest one' },
};

/** Serialise runs to SVG <rect> markup (used by the static generators). */
export function runsToSvg(runs, colors = COLORS) {
  return runs.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${colors[r.c]}"/>`).join('');
}

/* ------------------------------------------------------------------ mini Chip */

/**
 * A 16 × 16 Chip for favicons, the footer badge and anywhere under ~40px,
 * where the full sprite's detail would turn to mush.
 */
export const MINI = 16;
const miniLayer = (paint) => {
  const g = Array.from({ length: MINI }, () => Array(MINI).fill('.'));
  const f = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j] && i >= 0 && i < MINI) g[j][i] = c; };
  paint(f);
  const runs = [];
  g.forEach((row, y) => { let x = 0; while (x < MINI) { const c = row[x]; if (c === '.') { x++; continue; } let w = 1; while (x + w < MINI && row[x + w] === c) w++; runs.push({ c, x, y, w }); x += w; } });
  return runs;
};

export const mini = {
  body: miniLayer((f) => {
    [4, 6, 9, 11].forEach((x) => f(x, 1, 1, 2, 'M'));
    [4, 11].forEach((x) => f(x, 13, 1, 2, 'M'));
    [4, 6, 9, 11].forEach((y) => { f(1, y, 2, 1, 'M'); f(13, y, 2, 1, 'M'); });
    f(3, 3, 10, 10, 'K'); f(4, 4, 8, 8, 'L');
    f(3, 3, 1, 1, '.'); f(4, 4, 1, 1, 'K');
    f(5, 4, 6, 1, 'H'); f(4, 11, 8, 1, 'S'); f(11, 5, 1, 6, 'S'); f(5, 5, 1, 1, 'D');
  }),
  face: miniLayer((f) => {
    f(6, 6, 1, 2, 'F'); f(9, 6, 1, 2, 'F');
    f(5, 9, 1, 1, 'P'); f(10, 9, 1, 1, 'P');
    f(6, 10, 3, 1, 'F'); f(9, 9, 1, 1, 'F');
  }),
  blink: miniLayer((f) => {
    f(6, 7, 1, 1, 'F'); f(9, 7, 1, 1, 'F');
    f(5, 9, 1, 1, 'P'); f(10, 9, 1, 1, 'P');
    f(6, 10, 3, 1, 'F'); f(9, 9, 1, 1, 'F');
  }),
  legs: miniLayer((f) => { f(6, 13, 1, 2, 'M'); f(5, 15, 1, 1, 'M'); f(9, 13, 1, 2, 'M'); f(10, 15, 1, 1, 'M'); }),
  armsDown: miniLayer(() => {}),
  armsWave: miniLayer((f) => { f(13, 6, 2, 1, 'M'); f(15, 3, 1, 4, 'M'); }),
};

/* ------------------------------------------------------------------ wordmark */

/**
 * The wordmark is built on the same pixel grid as Chip: 9 units tall,
 * 2-unit strokes, 1-unit chamfers. No font file, so it renders identically
 * in every logo file, favicon and badge.
 */
export const LETTERS = {
  T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
  I: ['##', '##', '##', '##', '##', '##', '##', '##', '##'],
  N: ['##..##', '##..##', '###.##', '###.##', '######', '##.###', '##.###', '##..##', '##..##'],
  Y: ['##..##', '##..##', '##..##', '######', '.####.', '..##..', '..##..', '..##..', '..##..'],
  C: ['.#####', '######', '##....', '##....', '##....', '##....', '##....', '######', '.#####'],
  H: ['##..##', '##..##', '##..##', '######', '######', '##..##', '##..##', '##..##', '##..##'],
  P: ['#####.', '######', '##..##', '##..##', '######', '#####.', '##....', '##....', '##....'],
  S: ['.#####', '######', '##....', '#####.', '.#####', '....##', '....##', '######', '#####.'],
  U: ['##..##', '##..##', '##..##', '##..##', '##..##', '##..##', '##..##', '######', '.####.'],
  D: ['#####.', '######', '##..##', '##..##', '##..##', '##..##', '##..##', '######', '#####.'],
  O: ['.####.', '######', '##..##', '##..##', '##..##', '##..##', '##..##', '######', '.####.'],
  E: ['######', '######', '##....', '##....', '#####.', '##....', '##....', '######', '######'],
  B: ['#####.', '######', '##..##', '#####.', '######', '##..##', '##..##', '######', '#####.'],
  M: ['##...##', '###.###', '#######', '##.#.##', '##.#.##', '##...##', '##...##', '##...##', '##...##'],
  A: ['.####.', '######', '##..##', '##..##', '######', '######', '##..##', '##..##', '##..##'],
  W: ['##...##', '##...##', '##...##', '##...##', '##.#.##', '##.#.##', '#######', '###.###', '##...##'],
  ' ': ['...', '...', '...', '...', '...', '...', '...', '...', '...'],
};

/** Lay out a word as rect runs. Returns { runs, width }. */
export function word(text, { gap = 1, x0 = 0, y0 = 0 } = {}) {
  const runs = [];
  let x = x0;
  for (const ch of text.toUpperCase()) {
    const rows = LETTERS[ch] || LETTERS[' '];
    rows.forEach((row, y) => {
      let i = 0;
      while (i < row.length) {
        if (row[i] !== '#') { i++; continue; }
        let w = 1;
        while (i + w < row.length && row[i + w] === '#') w++;
        runs.push({ c: 'K', x: x + i, y: y0 + y, w });
        i += w;
      }
    });
    x += rows[0].length + gap;
  }
  return { runs, width: x - x0 - gap };
}
