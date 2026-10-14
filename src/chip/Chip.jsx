import React, { useEffect, useRef, useState } from 'react';
import * as S from './sprite';
import { ACT_MS, CALM, PERSONALITY, between, pick } from './personality';
import { finePointer, reducedMotion, watchPointer } from './pointer';

/**
 * <Chip /> — the animated mascot.
 *
 * Frames swap with CSS steps() (see chip.css). What Chip does and when is decided
 * here: see useLife(). Nothing animates when the visitor prefers reduced motion,
 * or while Chip is off-screen.
 *
 * Props
 *  pose    idle | wave | point | cheer | think | wow | sleep | walk | run
 *  look    null | left | right | up      (overrides the pose's eyes)
 *  talking bool  — mouth flaps
 *  boot    bool  — face flickers on when first shown
 *  crew    chip | byte | pixel | glitch | boot | bit  (colour, prop, personality)
 *  life    bool  — blinks, glances and idle moments on its own clock (default on)
 *  calm    bool  — quieter temperament (the header logo)
 *  moving  bool  — force two-frame poses on/off (otherwise they play in bursts)
 *  title   accessible name; without it Chip is decorative
 */

const R = ({ runs }) =>
  runs.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={S.COLORS[r.c]} />);

const L = (runs, className) => (
  <g className={className}>
    <R runs={runs} />
  </g>
);

const POSES = {
  idle: { arms: [S.arms.idle], eyes: 'open', mouth: [S.mouths.smile], legs: [S.legs.stand], blink: true },
  wave: { arms: [S.arms.waveA, S.arms.waveB], eyes: 'happy', mouth: [S.mouths.grin], legs: [S.legs.stand], fast: true, burst: [2400, 5000, 10000] },
  point: { arms: [S.arms.point], eyes: 'right', mouth: [S.mouths.smile], legs: [S.legs.stand], blink: true },
  cheer: { arms: [S.arms.cheer], eyes: 'happy', mouth: [S.mouths.grin], legs: [S.legs.hop], hop: true, extra: S.extras.sparks, burst: [1800, 4000, 8000] },
  think: { arms: [S.arms.think], eyes: 'up', mouth: [S.mouths.flat], legs: [S.legs.stand], extra: S.extras.question, cheeks: false },
  wow: { arms: [S.arms.idle], eyes: 'wide', mouth: [S.mouths.oh], legs: [S.legs.stand] },
  sleep: { arms: [S.arms.idle], eyes: 'sleep', mouth: [S.mouths.flat], legs: [S.legs.stand], extra: S.extras.zzz, cheeks: false, breathe: true },
  run: { arms: [S.arms.runA, S.arms.runB], eyes: 'right', mouth: [S.mouths.grin], legs: [S.legs.runA, S.legs.runB], fast: true, bob: true, extra: S.extras.speed, always: true },
  walk: { arms: [S.arms.idle], eyes: 'right', mouth: [S.mouths.smile], legs: [S.legs.stepA, S.legs.stepB], blink: true, bob: true, burst: [3000, 3000, 6000] },
};

// Poses calm enough for little idle moments (glances, hops, nods…).
const FIDGETS = new Set(['idle', 'point', 'think', 'wow']);
const GLANCES = [[-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];

/** Pause animation while off-screen. */
function useOnScreen(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return on;
}

/** Crew members recolour the package through CSS custom properties. */
function crewStyle(crew, style) {
  const c = S.CREW[crew];
  if (!c || crew === 'chip') return style;
  return { ...style, '--chip-body': c.body, '--chip-shade': c.shade };
}

/** Two-frame helper: frame A, plus frame B when there is one. */
const frames = (list, cls) =>
  list.length > 1 ? (
    <>
      {L(list[0], `${cls} fa`)}
      {L(list[1], `${cls} fb`)}
    </>
  ) : (
    L(list[0], cls)
  );

/**
 * Chip's inner life. Instead of looping forever, every Chip runs on its own
 * irregular clock: blinks at random, has a small "moment" now and then
 * (glance, squint, hop, nod… depending on who it is), plays two-frame poses
 * in short bursts with rests in between, and keeps an eye on the cursor.
 * Transient states are classes set straight on the <svg>, so none of this
 * re-renders React. All of it is off for reduced motion and while off-screen.
 */
function useLife({ ref, gazeRef, onScreen, pose, p, life, temper, gazeable, blinkable, moving: forced, talking }) {
  const auto = p.burst && forced === undefined;
  const [bursting, setBursting] = useState(Boolean(p.burst));

  // Bursts: play the two-frame pose for a while, rest, repeat.
  useEffect(() => {
    if (!auto || !onScreen || reducedMotion()) return undefined;
    const [play, a, b] = p.burst;
    let t;
    const on = () => { setBursting(true); t = setTimeout(off, play); };
    const off = () => { setBursting(false); t = setTimeout(on, between([a, b])); };
    on();
    return () => clearTimeout(t);
  }, [auto, onScreen, pose]); // eslint-disable-line react-hooks/exhaustive-deps

  const moving = p.always || talking || (forced !== undefined ? forced : p.burst ? bursting : false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || !life || !onScreen || reducedMotion()) return undefined;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };
    const flag = (cls, ms) => { svg.classList.add(cls); later(() => svg.classList.remove(cls), ms); };

    // Eyes ----------------------------------------------------------------
    let aim = [0, 0];
    let held = false; // a glance overrides the cursor for a moment
    const setEyes = ([x, y]) => gazeRef.current?.setAttribute('transform', `translate(${x} ${y})`);
    let lagT = 0;
    const aimAt = (next) => {
      if (next[0] === aim[0] && next[1] === aim[1]) return;
      aim = next;
      clearTimeout(lagT);
      lagT = setTimeout(() => !held && setEyes(aim), temper.lag);
    };

    // Blinks --------------------------------------------------------------
    const blink = () => {
      if (blinkable) {
        flag('is-blink', 120);
        if (Math.random() < temper.double) later(() => flag('is-blink', 110), 260);
      }
      later(blink, between(temper.blink));
    };
    later(blink, between(temper.blink) * 0.6);

    // Idle moments --------------------------------------------------------
    const act = () => {
      if (FIDGETS.has(pose) && !svg.classList.contains('is-moving')) {
        const name = pick(temper.acts);
        const ms = ACT_MS[name];
        if (name === 'glance') {
          if (gazeable) {
            held = true;
            setEyes(GLANCES[Math.floor(Math.random() * GLANCES.length)]);
            later(() => { held = false; setEyes(aim); }, ms);
          }
        } else if (name === 'squint') {
          if (blinkable) flag('is-squint', ms);
        } else {
          flag(`act-${name}`, ms);
        }
      }
      later(act, between(temper.rest));
    };
    later(act, between(temper.rest) * 0.7);

    // Cursor --------------------------------------------------------------
    let stop = () => {};
    if (finePointer() && temper.gaze) {
      stop = watchPointer((pos) => {
        if (!pos) { aimAt([0, 0]); svg.classList.remove('is-happy', 'is-shy'); return; }
        const r = svg.getBoundingClientRect();
        if (!r.width) return;
        const rad = r.width / 2;
        const dx = pos.x - (r.left + rad);
        const dy = pos.y - (r.top + r.height * 0.42);
        const d = Math.hypot(dx, dy) || 1;
        if (temper.shy) svg.classList.toggle('is-shy', d < rad * 2.4);
        else svg.classList.toggle('is-happy', blinkable && d < rad * 0.55);
        if (!gazeable) return;
        if (d < rad * 0.45) { aimAt([0, 0]); return; }
        const ux = dx / d;
        const uy = dy / d;
        const s = temper.gaze;
        aimAt([
          s * (Math.abs(ux) > 0.38 ? Math.sign(ux) : 0),
          s * (uy < -0.55 ? -1 : uy > 0.72 ? 1 : 0),
        ]);
      });
    }

    return () => {
      stop();
      clearTimeout(lagT);
      timers.forEach(clearTimeout);
      svg.classList.remove('is-blink', 'is-squint', 'is-happy', 'is-shy', ...Object.keys(ACT_MS).map((k) => `act-${k}`));
      setEyes([0, 0]);
    };
  }, [life, onScreen, pose, gazeable, blinkable, temper]); // eslint-disable-line react-hooks/exhaustive-deps

  return moving;
}

export default function Chip({
  pose = 'idle',
  look = null,
  talking = false,
  boot = false,
  crew = 'chip',
  life = true,
  calm = false,
  moving,
  title,
  className = '',
  style,
}) {
  const ref = useRef(null);
  const gazeRef = useRef(null);
  const onScreen = useOnScreen(ref);
  // The power-on sequence plays once, the first time Chip is seen.
  const [booted, setBooted] = useState(!boot);
  useEffect(() => {
    if (booted || !onScreen) return undefined;
    const t = setTimeout(() => setBooted(true), 1500);
    return () => clearTimeout(t);
  }, [booted, onScreen]);
  const p = POSES[pose] || POSES.idle;
  const eyeKey = look || p.eyes;
  const blinkable = Boolean(p.blink && !look);
  const gazeable = blinkable && eyeKey === 'open';
  const temper = calm ? CALM : PERSONALITY[crew] || PERSONALITY.chip;
  const isMoving = useLife({ ref, gazeRef, onScreen, pose, p, life: life && booted, temper, gazeable, blinkable, moving, talking });
  const mouth = talking ? [S.mouths.talk, p.mouth[0]] : p.mouth;

  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' };
  const cls = [
    'chip',
    `chip--${pose}`,
    `chip-crew--${crew}`,
    onScreen && 'is-on',
    isMoving && 'is-moving',
    !booted && 'chip--boot',
    p.bob && 'chip--bob',
    p.hop && 'chip--hop',
    p.fast && 'chip--fast',
    p.breathe && 'chip--breathe',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const face = (
    <>
      {blinkable ? (
        <>
          <g ref={gazeRef} className="chip-gaze">
            {L(S.eyes[eyeKey], 'chip-eyes chip-eyes--open')}
            {L(S.eyes.blink, 'chip-eyes chip-eyes--blink')}
          </g>
          {L(S.eyes.happy, 'chip-eyes chip-eyes--happy')}
        </>
      ) : (
        L(S.eyes[eyeKey], 'chip-eyes')
      )}
      {frames(mouth, 'chip-mouth')}
    </>
  );

  return (
    <svg
      ref={ref}
      className={cls}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={crewStyle(crew, style)}
      {...a11y}
    >
      {L(p.hop ? S.shadow.small : S.shadow.full, 'chip-shadow')}
      <g className="chip-figure">
        <g className="chip-act">
          {frames(p.legs, 'chip-legs')}
          {L(S.body, 'chip-body')}
          {frames(p.arms, 'chip-arms')}
          <g className="chip-face">
            {face}
            {p.cheeks !== false && L(S.cheeks, 'chip-cheeks')}
          </g>
          {S.props[crew] && L(S.props[crew], 'chip-prop')}
          {p.extra && L(p.extra, 'chip-extra')}
        </g>
      </g>
    </svg>
  );
}

/** The 16 × 16 mini Chip, for tight spots (header, badge, favicons). */
export function MiniChip({ className = '', title, wave = false, crew = 'chip' }) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' };
  return (
    <svg
      className={`chip chip-mini is-on ${wave ? 'chip--fast' : ''} ${className}`.trim()}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      style={crewStyle(crew)}
      {...a11y}
    >
      {L(S.mini.legs, 'chip-legs')}
      {L(S.mini.body, 'chip-body')}
      {wave ? (
        <>
          {L(S.mini.armsDown, 'chip-arms fa')}
          {L(S.mini.armsWave, 'chip-arms fb')}
        </>
      ) : null}
      {L(S.mini.face, 'chip-eyes chip-eyes--open')}
      {L(S.mini.blink, 'chip-eyes chip-eyes--blink')}
    </svg>
  );
}
