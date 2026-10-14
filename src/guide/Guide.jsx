import React, { useEffect, useState } from 'react';
import Chip from '../chip/Chip';
import { CREW } from '../chip/sprite';
import { guideLines } from '../data';
import { HIDDEN, useGuide } from './GuideContext';
import { PHONE_DISPLAY, PHONE_TEL } from '../site';

const DISMISS = 'tcs-guide-hidden';

/**
 * Chip, floating in the corner once the visitor leaves the hero. Says one short
 * line per section (the StoryBrand beat that section is doing), celebrates found
 * crew, and on phones doubles as the sticky contact dock (call, text, start a
 * project). Dismissing Chip on a phone keeps the dock and lets Chip go.
 *
 * The section lines are decorative (the sections say it all themselves), so only
 * crew news is announced to screen readers.
 */
export default function Guide() {
  const { found, news, total } = useGuide();
  const [section, setSection] = useState(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      setHidden(sessionStorage.getItem(DISMISS) === '1');
    } catch {
      /* storage blocked: guide simply shows */
    }
  }, []);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      const hero = document.getElementById('top');
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.55 : true;
      let key = null;
      document.querySelectorAll('[data-guide]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) key = el.getAttribute('data-guide');
      });
      setSection(key);
      setVisible(pastHero && key !== 'contact');
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISS, '1');
    } catch {
      /* fine */
    }
  };

  // Each new section pops the tip open for a few seconds, then it tucks away.
  useEffect(() => {
    if (!section) return undefined;
    setOpen(true);
    const t = setTimeout(() => setOpen(false), 7000);
    return () => clearTimeout(t);
  }, [section]);

  const line = guideLines[section] || guideLines.default;
  const showNews = Boolean(news);
  const text = showNews ? news.text : line.text;
  const pose = showNews ? 'cheer' : line.pose;

  return (
    <>
      {/* Crew news is the only thing worth announcing. */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {news ? news.text : ''}
      </p>

      <aside
        className={`guide ${visible || showNews ? 'is-visible' : ''} ${(open || showNews) && !hidden ? 'is-open' : ''} ${hidden ? 'is-dismissed' : ''}`}
        aria-label="Chip, your guide"
      >
        <div className="guide-bubble" aria-hidden={!showNews}>
          <p key={text} className="guide-text">
            {text}
          </p>
          {showNews && news.done && (
            <a className="guide-cta" href="#contact">
              START A PROJECT <span aria-hidden="true">→</span>
            </a>
          )}
          <div className="guide-crew" title={`Crew found: ${found.length} of ${total}`}>
            <span>CREW</span>
            <span className="guide-dots" aria-hidden="true">
              {HIDDEN.map((k) => (
                <i key={k} style={found.includes(k) ? { background: CREW[k].body } : undefined} />
              ))}
            </span>
            <span>
              {found.length}/{total}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="guide-chip"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Hide Chip’s tip' : 'Show Chip’s tip'}
        >
          <Chip pose={pose} talking={!showNews && open && line.pose === 'point'} />
        </button>

        <nav className="guide-dock" aria-label="Quick contact">
          <a className="guide-dock-btn" href={`tel:${PHONE_TEL}`} data-track="dock-call">
            <span className="guide-dock-ico" aria-hidden="true">☎</span>
            <span className="guide-dock-label">CALL</span>
            <span className="visually-hidden"> {PHONE_DISPLAY}</span>
          </a>
          <a className="guide-dock-btn" href={`sms:${PHONE_TEL}`} data-track="dock-text">
            <span className="guide-dock-ico" aria-hidden="true">✉</span>
            <span className="guide-dock-label">TEXT</span>
            <span className="visually-hidden"> {PHONE_DISPLAY}</span>
          </a>
          <a className="guide-mobile-cta" href="#contact" data-track="dock-start">
            <span>START<span className="guide-dock-more"> A PROJECT</span></span> <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button type="button" className="guide-close" onClick={dismiss} aria-label="Dismiss Chip for this visit">
          ×
        </button>
      </aside>
    </>
  );
}
