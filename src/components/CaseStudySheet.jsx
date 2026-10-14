import React, { useCallback, useEffect, useRef, useState } from 'react';
import { tidy, names } from '../lib/typography';

// Must match the exit transition on .case-sheet (0.58s) in style.css.
const EXIT_MS = 610;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Bottom-entry case study sheet. Mount when a project is selected; unmount from `onClose`.
 * phase: 'enter' (parked off-screen) → 'open' (slid up) → 'leave' (sliding down)
 */
export default function CaseStudySheet({ project, onClose }) {
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [phase, setPhase] = useState('enter');

  const dismiss = useCallback(() => setPhase('leave'), []);

  // Slide in. Two frames, so the browser paints the off-screen state first and the
  // transition actually runs (a single rAF can be batched into the first paint).
  useEffect(() => {
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        setPhase((p) => (p === 'enter' ? 'open' : p));
        closeButtonRef.current?.focus();
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  // Slide out, then unmount.
  useEffect(() => {
    if (phase !== 'leave') return undefined;
    const timer = setTimeout(onClose, prefersReducedMotion() ? 0 : EXIT_MS);
    return () => clearTimeout(timer);
  }, [phase, onClose]);

  // Modal behaviour: lock scroll, make the page inert, trap focus, restore focus.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const shell = document.getElementById('app-shell');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    shell?.setAttribute('inert', '');

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        dismiss();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const items = [...sheetRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      shell?.removeAttribute('inert');
      previouslyFocused?.focus?.();
    };
  }, [dismiss]);

  const state = phase === 'open' ? 'is-up' : 'is-down';
  const p = project;

  return (
    <div
      className={`sheet-backdrop ${state}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <section ref={sheetRef} className={`case-sheet ${state}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="sheet-toolbar">
          <div className="sheet-grip" aria-hidden="true" />
          <span className="sheet-sys">TINY CHIP / FILE {p.number} / OPEN CASE STUDY</span>
          <button ref={closeButtonRef} type="button" className="sheet-eject" onClick={dismiss} aria-label="Close case study">
            EJECT FILE <span aria-hidden="true">↓</span>
          </button>
        </div>

        <div className="sheet-content">
          <div className="sheet-lead">
            <span className="sheet-kicker">[ THE EVIDENCE / {p.type} ]</span>
            <h2 id="dialog-title">
              {names(p.name)}
              <span className="period">.</span>
            </h2>
            <p>{tidy(p.headline)}</p>
            <span className="sheet-stamp" aria-hidden="true">
              NOT JUST
              <br />
              PIXELS ↗
            </span>
          </div>

          <div className="sheet-image">
            <img src={p.image} alt={p.alt} width={p.imageSize[0]} height={p.imageSize[1]} />
            <span className="sheet-vertical" aria-hidden="true">PIXEL PROOF / REAL WORK</span>
          </div>

          <div className="sheet-status">
            STATUS / {p.status} <span aria-hidden="true">● FILE OPEN</span>
          </div>

          <div className="sheet-grid sheet-grid-two">
            <section>
              <h3>01 / THE PROJECT</h3>
              <p>{tidy(p.summary)}</p>
            </section>
            <section>
              <h3>02 / THE CONTRIBUTION</h3>
              <p>{tidy(p.contribution)}</p>
            </section>
          </div>

          <p className="sheet-roles">
            <span>FOCUS</span> {p.disciplines.join(' · ')}
          </p>

          {p.quote && (
            <figure className="sheet-quote">
              <blockquote>“{tidy(p.quote.text)}”</blockquote>
              <figcaption>{names(p.quote.by)}</figcaption>
            </figure>
          )}

          <h3 className="sheet-decisions-title">03 / THREE DECISIONS THAT SHAPED IT</h3>
          <ol className="sheet-decisions">
            {p.decisions.map((d) => (
              <li key={d.label}>
                <span className="decision-label">{d.label.toUpperCase()}</span>
                <p className="decision-question">“{d.question}”</p>
                <h4>{d.title}</h4>
                <p>{tidy(d.explanation)}</p>
                <p className="decision-built">
                  <span>BUILT</span> {tidy(d.implementation)}
                </p>
              </li>
            ))}
          </ol>

          {p.gallery.length > 0 && (
            <div className="sheet-gallery">
              {p.gallery.map((g) => (
                <figure key={g.src}>
                  <img src={g.src} alt={g.alt} width={g.size[0]} height={g.size[1]} loading="lazy" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <p className="sheet-note">
            <span>STATUS NOTE</span> {tidy(p.note)}
          </p>

          <div className="sheet-foot">
            <small>{tidy('Work by studio founder Adam Thomas Janes.')}</small>
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              {p.linkLabel} ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <button type="button" onClick={dismiss}>
              SEND THIS THING BACK DOWN ↓
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
