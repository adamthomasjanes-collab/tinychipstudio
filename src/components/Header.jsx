import React, { useEffect, useRef, useState } from 'react';
import Logo from '../chip/Logo';
import { PHONE_DISPLAY, PHONE_TEL } from '../site';

const links = [
  { href: '#work', label: 'WORK' },
  { href: '#process', label: 'PROCESS' },
  { href: '#services', label: 'SERVICES' },
  { href: '#about', label: 'ABOUT' },
];
const SECTION_IDS = links.map((l) => l.href.slice(1));

/**
 * Sticky header. Gains a shadow once the page moves, and a thin lime line
 * along its bottom edge fills as you read down the page. The nav link for
 * whichever section is on screen gets an active state, so the menu works
 * like a map of where you are.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const ref = useRef(null);
  const close = () => setOpen(false);

  // Scroll-spy: track every nav section's visibility and pick the one
  // nearest the top of the viewport as "current." IntersectionObserver
  // does the measuring, so this costs nothing on scroll.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });
        if (visible.size) {
          const [topId] = [...visible.entries()].sort((a, b) => sections.findIndex((s) => s.id === a[0]) - sections.findIndex((s) => s.id === b[0]));
          setActiveId(topId[0]);
        }
      },
      // A band just under the sticky header: a section becomes "current" once
      // its top crosses that band, and stays current until the next one does.
      { rootMargin: '-104px 0px -70% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.classList.toggle('is-scrolled', window.scrollY > 8);
      el.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : '0');
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="header" ref={ref}>
      <a className="brand" href="#top" onClick={close} aria-label="Tiny Chip Studio, back to top">
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
            <a key={l.href} href={l.href} className={isActive ? 'is-active' : ''} aria-current={isActive ? 'true' : undefined} onClick={close}>
              {l.label}
            </a>
          );
        })}
        <a className="nav-phone" href={`tel:${PHONE_TEL}`} data-track="header-call">
          {PHONE_DISPLAY}
        </a>
        <a className="nav-contact" href="#contact" onClick={close} data-track="header-start">
          START A PROJECT <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <span className="header-read" aria-hidden="true" />
    </header>
  );
}
