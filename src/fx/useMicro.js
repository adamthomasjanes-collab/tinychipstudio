import { useEffect } from 'react';

/**
 * Page-wide micro-interactions, wired once by event delegation so components
 * don't have to know about them. Fine pointers and motion-OK visitors only.
 *
 * - Magnetic buttons: .button leans a few pixels toward the cursor.
 * - Section tags decode: "[ 02 / YOUR GUIDE ]" scrambles in like a terminal
 *   the first time it scrolls into view.
 */
const GLYPHS = '01<>/[]#*+=_';

export default function useMicro() {
  useEffect(() => {
    if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const cleanups = [];

    // --- magnetic buttons
    if (window.matchMedia('(pointer: fine)').matches) {
      let current = null;
      let raf = 0;
      const release = () => {
        if (current) current.style.translate = '';
        current = null;
      };
      const onMove = (e) => {
        if (raf) return;
        const { clientX, clientY, target } = e;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const btn = target instanceof Element ? target.closest('.button') : null;
          if (btn !== current) release();
          if (!btn || btn.disabled) return;
          current = btn;
          const r = btn.getBoundingClientRect();
          const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
          btn.style.translate = `${(dx * 5).toFixed(1)}px ${(dy * 4).toFixed(1)}px`;
        });
      };
      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', release);
      cleanups.push(() => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', release);
        cancelAnimationFrame(raf);
        release();
      });
    }

    // --- decoding section tags
    if ('IntersectionObserver' in window) {
      const timers = new Set();
      const decode = (el) => {
        // Edit the existing text node in place so React's reference stays valid.
        const node = el.firstChild;
        const final = node.nodeValue;
        const started = performance.now();
        const run = () => {
          const k = Math.min(1, (performance.now() - started) / 650);
          const keep = Math.floor(final.length * k);
          node.nodeValue =
            final.slice(0, keep) +
            final
              .slice(keep)
              .replace(/[^\s[\]/]/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]);
          if (k < 1) timers.add(setTimeout(run, 40));
          else node.nodeValue = final;
        };
        run();
      };
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            decode(en.target);
          }),
        { rootMargin: '0px 0px -10% 0px' },
      );
      // Only tags that start off-screen, so nothing flickers at load. React owns
      // these text nodes but never re-renders them, and they end as they began.
      document.querySelectorAll('main .section-tag').forEach((el) => {
        const single = el.childNodes.length === 1 && el.firstChild.nodeType === 3;
        if (single && el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
      });
      cleanups.push(() => {
        io.disconnect();
        timers.forEach(clearTimeout);
      });
    }

    return () => cleanups.forEach((f) => f());
  }, []);
}
