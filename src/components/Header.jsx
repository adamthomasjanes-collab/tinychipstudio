import React, { useEffect, useRef, useState } from 'react';
import Logo from '../chip/Logo';
import { PHONE_DISPLAY, PHONE_TEL } from '../site';

// Same order as the page, top to bottom.
const links = [
  { href: '#clients', label: 'WORK' },
  { href: '#about', label: 'ABOUT' },
  { href: '#services', label: 'SERVICES' },
  { href: '#website-options', label: 'PRICING' },
  { href: '#process', label: 'PROCESS' },
  { href: '#faq', label: 'FAQ' },
];
const PANELS = ['scorecard', 'book-call'];

/**
 * Sticky header. Gains a shadow once the page moves, and a thin lime line
 * along its bottom edge fills as you read down the page. The nav item for the
 * section you're reading stays lit: a section takes over once its top passes a
 * reading line below the sticky header, and the page's last section
 * wins at the very bottom. While a nav click is scrolling the page, the clicked
 * item stays lit instead of flickering through every section on the way.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState('top');
  const activeId = { problem: 'top', work: 'clients' }[sectionId] ?? sectionId;
  const ref = useRef(null);
  const lock = useRef(null);
  const close = (event) => {
    setOpen(false);
    const id = event?.currentTarget?.getAttribute('href')?.slice(1);
    const target = id && document.getElementById(id);
    if (target) {
      // Held until the scroll comes to rest (scrollend, or a quiet 200ms), 3s at most.
      lock.current = { until: performance.now() + 3000 };
      setSectionId(id);
    }
    if (target) requestAnimationFrame(() => {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('nav-is-open');
    const outside = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      ref.current?.querySelector('.menu-toggle')?.focus();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    return () => {
      document.documentElement.classList.remove('nav-is-open');
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)');
    const reset = () => setOpen(false);
    desktop.addEventListener('change', reset);
    return () => desktop.removeEventListener('change', reset);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const sections = Array.from(document.querySelectorAll('main > section[id], #footer'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.classList.toggle('is-scrolled', window.scrollY > 8);
      el.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
      const headerBottom = el.getBoundingClientRect().height;
      const line = headerBottom + Math.min(window.innerHeight * 0.18, 144);
      let current = 'top';
      for (const section of sections) {
        if (section.getBoundingClientRect().top > line) break;
        current = section.id;
      }
      if (max > 0 && window.scrollY >= max - 2) current = 'footer';
      const held = lock.current;
      if (held && performance.now() < held.until) {
        // Keep the clicked item lit while the page scrolls to it.
        return;
      }
      lock.current = null;
      setSectionId(current);

    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    // A nav click's scroll has finished: release the hold and read the page again.
    let idle = 0;
    const settle = () => {
      if (!lock.current) return;
      lock.current = null;
      onScroll();
    };
    const onScrollIdle = () => {
      clearTimeout(idle);
      if (lock.current) idle = setTimeout(settle, 200);
    };
    window.addEventListener('scroll', onScrollIdle, { passive: true });
    window.addEventListener('scrollend', settle);
    const measure = () => {
      document.documentElement.style.setProperty('--header-height', `${el.getBoundingClientRect().height}px`);
      document.querySelectorAll('main > section[id]').forEach((section) => {
        section.style.setProperty('--anchor-inset', getComputedStyle(section).paddingTop);
      });
      onScroll();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    document.querySelectorAll('main > section[id]').forEach((section) => resize.observe(section));
    measure();
    update();
    const hash = window.location.hash.slice(1);
    const deepLink = hash && !PANELS.includes(hash) && document.getElementById(hash);
    if (deepLink) {
      (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(() => {
        if (window.location.hash.slice(1) === hash) deepLink.scrollIntoView({ block: 'start', behavior: 'auto' });
      }));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScrollIdle);
      window.removeEventListener('scrollend', settle);
      clearTimeout(idle);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="header" ref={ref}>
      <a aria-current={activeId === 'top' ? 'location' : undefined} className="brand" href="#top" onClick={close} aria-label="Tiny Chip Studio, back to top">
        <Logo />
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? 'CLOSE' : 'MENU'} <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <nav id="main-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        {links.map((l) => {
          const isActive = activeId === l.href.slice(1);
          return (
            <a key={l.href} href={l.href} className={isActive ? 'is-active' : ''} aria-current={isActive ? 'location' : undefined} onClick={close}>
              <span className="nav-label">{l.label}</span>
            </a>
          );
        })}
        <a className="nav-phone" href={`tel:${PHONE_TEL}`} data-track="header-call">
          {PHONE_DISPLAY}
        </a>
        <a className="nav-contact" aria-current={activeId === 'contact' ? 'location' : undefined} href="#contact" onClick={close} data-track="header-start">
          LET’S TALK <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <span className="header-read" aria-hidden="true" />
    </header>
  );
}
