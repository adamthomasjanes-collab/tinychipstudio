import { useEffect } from 'react';

// Fades `.reveal` elements in as they scroll into view. The hidden starting state lives in
// CSS (html.js .reveal, motion-allowed only), so reduced-motion, no-JS and no-IntersectionObserver
// visitors see everything.
export default function useReveal() {
  useEffect(() => {
    const pending = new Set(document.querySelectorAll('.reveal'));
    let observer;
    const show = (el) => {
      el.classList.add('is-visible');
      pending.delete(el);
      observer?.unobserve(el);
    };

    if (!('IntersectionObserver' in window)) {
      pending.forEach(show);
      return undefined;
    }

    observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && show(entry.target)),
      { rootMargin: '0px 0px -10% 0px' },
    );
    pending.forEach((el) => observer.observe(el));

    // Jumping past an element (End key, scrollbar drag) can skip the observer entirely,
    // so anything already scrolled above the viewport is revealed too.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        pending.forEach((el) => el.getBoundingClientRect().bottom < 0 && show(el));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);
}
