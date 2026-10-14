import React, { useEffect, useRef, useState } from 'react';

const still = () =>
  typeof window === 'undefined' || !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A number that ticks up from zero the first time it scrolls into view, like an
 * odometer. The final value is always in the DOM for screen readers and no-JS;
 * the moving digits are decorative.
 */
export default function CountUp({ to, duration = 1400 }) {
  const target = Number(to);
  const ref = useRef(null);
  const [n, setN] = useState(target);

  useEffect(() => {
    if (still() || !('IntersectionObserver' in window) || !Number.isFinite(target)) return undefined;
    const el = ref.current;
    // Already on screen at load? Leave it alone rather than flashing a zero.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return undefined;
    setN(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setN(Math.round(target * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return (
    <span className="count-up" ref={ref} data-to={to}>
      <span aria-hidden="true" className={n === target ? 'is-done' : ''}>
        {n}
      </span>
      <span className="visually-hidden">{to}</span>
    </span>
  );
}
