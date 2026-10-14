/**
 * How each member of the crew behaves when nobody is asking them to do
 * anything. Same body, different temperament.
 *
 *  blink   [min, max] ms between blinks; `double` is the chance of a double blink
 *  rest    [min, max] ms between little idle moments ("acts")
 *  acts    weighted list of idle moments (see ACT_MS)
 *  gaze    1 follows the cursor, -1 looks away from it (shy), 0 ignores it
 *  lag     ms before the eyes catch up with the cursor
 *  shy     ducks and squeezes its eyes shut when the cursor comes close
 */

export const ACT_MS = {
  glance: 1100, // looks somewhere else for a moment
  squint: 900, // happy eyes, like a little smile
  hop: 560, // a single small jump
  nod: 760, // two small dips, "yep, got it"
  wiggle: 520, // side-to-side shuffle
  glitch: 460, // flickers out of phase for a beat
  peek: 1300, // ducks, then comes back up
};

export const PERSONALITY = {
  // Friendly, attentive, easy-going. The guide.
  chip: { blink: [2600, 6200], double: 0.2, rest: [3800, 8500], acts: { glance: 3, squint: 2, hop: 1, wiggle: 1 }, gaze: 1, lag: 60 },
  // Calm and methodical. Rarely fidgets; nods along.
  byte: { blink: [4200, 8000], double: 0.05, rest: [6000, 11000], acts: { nod: 3, glance: 1 }, gaze: 1, lag: 140 },
  // Curious about everything. Blinks a lot, squints to look closer.
  pixel: { blink: [1800, 4200], double: 0.35, rest: [2600, 6000], acts: { squint: 3, glance: 3, wiggle: 1 }, gaze: 1, lag: 30 },
  // Never quite in sync. Flickers, and the eyes lag behind.
  glitch: { blink: [2400, 7000], double: 0.25, rest: [3000, 7000], acts: { glitch: 4, glance: 1 }, gaze: 1, lag: 380 },
  // Ready to go. Bounces on the spot.
  boot: { blink: [3000, 6000], double: 0.1, rest: [2400, 5200], acts: { hop: 4, wiggle: 2 }, gaze: 1, lag: 40 },
  // The smallest and shyest. Looks away, ducks when you get close.
  bit: { blink: [2600, 5200], double: 0.15, rest: [4000, 8000], acts: { peek: 2, glance: 2, squint: 1 }, gaze: -1, lag: 200, shy: true },
};

/** The header logo: same Chip, quieter. Blinks and watches; no hopping around the nav. */
export const CALM = { blink: [3200, 7400], double: 0.15, rest: [7000, 14000], acts: { glance: 2, squint: 2 }, gaze: 1, lag: 80 };

export const between = ([a, b]) => a + Math.random() * (b - a);

export function pick(weights) {
  const entries = Object.entries(weights);
  let r = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[0][0];
}
