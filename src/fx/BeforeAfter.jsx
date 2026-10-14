import React, { useEffect, useRef, useState } from 'react';
import Chip from '../chip/Chip';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Img = ({ src, alt, eager, sizes }) => (
  <img
    src={`${src}.webp`}
    srcSet={`${src}-768.webp 768w, ${src}.webp 1280w`}
    sizes={sizes}
    alt={alt}
    width="1280"
    height="720"
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    draggable="false"
  />
);

/**
 * Before / after comparison. The before shot is clipped from the left; Chip is
 * the handle and walks whichever way you drag him. The whole frame is a native
 * range input underneath, so it works with mouse, touch and keyboard (arrow
 * keys, Home/End), and screen readers announce the split.
 *
 * The first time it scrolls into view, Chip gives it a quick demo wipe
 * (skipped for reduced motion, and as soon as the visitor touches it).
 */
export default function BeforeAfter({ before, after, label, url, eager = false, sizes = '(max-width: 700px) 100vw, 60vw', start = 50, className = '' }) {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const posRef = useRef(start);
  const [walk, setWalk] = useState(null); // null | 'left' | 'right'
  const [touched, setTouched] = useState(false);
  const stopT = useRef(0);
  const demo = useRef(0);

  const place = (v, dir) => {
    const next = Math.max(0, Math.min(100, v));
    if (dir === undefined) dir = next < posRef.current ? 'left' : next > posRef.current ? 'right' : null;
    posRef.current = next;
    ref.current?.style.setProperty('--pos', `${next}%`);
    if (inputRef.current) {
      if (Number(inputRef.current.value) !== Math.round(next)) inputRef.current.value = Math.round(next);
      inputRef.current.setAttribute('aria-valuetext', `${Math.round(next)}% old site, ${100 - Math.round(next)}% redesign`);
    }
    if (dir) {
      setWalk(dir);
      clearTimeout(stopT.current);
      stopT.current = setTimeout(() => setWalk(null), 220);
    }
  };

  // A one-time demo wipe when the comparison first comes into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const keys = [[0, start], [700, 78], [1500, 24], [2300, start]];
        const t0 = performance.now() + 500;
        const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
        const tick = (now) => {
          const t = now - t0;
          if (t < 0) { demo.current = requestAnimationFrame(tick); return; }
          let i = keys.findIndex(([k]) => k > t);
          if (i === -1) { place(start); return; }
          const [ta, a] = keys[i - 1];
          const [tb, b] = keys[i];
          place(a + (b - a) * ease((t - ta) / (tb - ta)));
          demo.current = requestAnimationFrame(tick);
        };
        demo.current = requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(demo.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const grab = () => {
    cancelAnimationFrame(demo.current);
    setTouched(true);
  };

  return (
    <figure className={`ba ${walk ? 'is-dragging' : ''} ${className}`.trim()} ref={ref} style={{ '--pos': `${start}%` }}>
      <div className="ba-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{url}</span>
      </div>
      <div className="ba-stage">
        <div className="ba-after">
          <Img {...after} eager={eager} sizes={sizes} />
        </div>
        <div className="ba-before">
          <Img {...before} eager={eager} sizes={sizes} />
        </div>
        <span className="ba-tag ba-tag--before" aria-hidden="true">BEFORE</span>
        <span className="ba-tag ba-tag--after" aria-hidden="true">AFTER</span>
        <div className="ba-handle" aria-hidden="true">
          <span className="ba-line" />
          <span className={`ba-chip ${walk === 'left' ? 'is-back' : ''}`}>
            <Chip pose={walk ? 'walk' : 'idle'} moving={Boolean(walk)} />
          </span>
          {!touched && <span className="ba-hint">DRAG ME</span>}
        </div>
        <input
          ref={inputRef}
          className="ba-range"
          type="range"
          min="0"
          max="100"
          step="1"
          defaultValue={start}
          aria-label={`${label}: before and after. Higher values show more of the old site.`}
          aria-valuetext={`${start}% old site, ${100 - start}% redesign`}
          onPointerDown={grab}
          onKeyDown={grab}
          onInput={(e) => place(Number(e.target.value))}
        />
      </div>
    </figure>
  );
}
