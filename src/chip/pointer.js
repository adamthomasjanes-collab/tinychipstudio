/**
 * One shared pointer for every Chip on the page. A single passive listener,
 * batched to animation frames, fans out to whichever Chips are on screen and
 * watching. Only fine pointers (mouse, trackpad): on touch, Chips glance
 * around on their own instead.
 */

const subs = new Set();
let pos = null;
let raf = 0;
let bound = false;

const flush = () => {
  raf = 0;
  subs.forEach((fn) => fn(pos));
};

const onMove = (e) => {
  pos = { x: e.clientX, y: e.clientY };
  if (!raf) raf = requestAnimationFrame(flush);
};

const onLeave = () => {
  pos = null;
  if (!raf) raf = requestAnimationFrame(flush);
};

const onScroll = () => {
  // Rects move under a still cursor while scrolling: re-aim.
  if (pos && !raf) raf = requestAnimationFrame(flush);
};

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function watchPointer(fn) {
  if (!bound && typeof window !== 'undefined') {
    bound = true;
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  subs.add(fn);
  if (pos) fn(pos);
  return () => subs.delete(fn);
}
