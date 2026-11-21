import React, { useCallback, useEffect, useRef, useState } from 'react';
import { tidy, names } from '../lib/typography';
import { startInquiry } from '../lib/inquiry';
import { websiteAction } from '../lib/project-links';
import { track } from '../lib/track';

// Must match the exit transition on .case-sheet (0.58s) in style.css.
const EXIT_MS = 610;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Bottom-entry case study sheet. Mount when a project is selected; unmount from `onClose`.
 * phase: 'enter' (parked off-screen) → 'open' (slid up) → 'leave' (sliding down)
 */
export default function CaseStudySheet({ project, returnFocus, onClose }) {
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [phase, setPhase] = useState('enter');
  // Set when the sheet closes to go somewhere (the inquiry form) instead of
  // handing focus back to the card that opened it.
  const afterClose = useRef(null);

  const dismiss = useCallback(() => setPhase('leave'), []);
  const inquire = (source, context = project.name) => {
    afterClose.current = () => startInquiry({ project: context, source });
    dismiss();
  };

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
    // Safari does not focus buttons on a pointer click; remember the actual opener.
    const previouslyFocused = returnFocus || document.activeElement;
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
      if (afterClose.current) afterClose.current();
      else previouslyFocused?.focus?.();
    };
  }, [dismiss, returnFocus]);

  const state = phase === 'open' ? 'is-up' : 'is-down';
  const p = project;

  return (
    <div
      className={`sheet-backdrop ${state}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <section ref={sheetRef} className={`case-sheet ${p.id === 'ams-mystical-treasures' ? 'case-sheet--ams' : ''} ${state}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="sheet-toolbar">
          <div className="sheet-grip" aria-hidden="true" />
          <span className="sheet-sys">TINY CHIP / FILE {p.number} / OPEN CASE STUDY</span>
          <button ref={closeButtonRef} type="button" className="sheet-eject" onClick={dismiss} aria-label="Close case study">
            CLOSE CASE STUDY <span aria-hidden="true">↓</span>
          </button>
        </div>

        <div className="sheet-content">
          <div className="sheet-lead">
            <span className="sheet-kicker">[ THE EVIDENCE / {p.type} ]</span>
            <h2 id="dialog-title" className={p.id === 'ams-mystical-treasures' ? 'sheet-title--ams' : undefined}>
              {p.id === 'ams-mystical-treasures' ? (
                <>
                  <span className="sheet-title-line">AM’s Mystical </span>
                  <span className="sheet-title-line">Treasures<span className="period">.</span></span>
                </>
              ) : <>{p.name}<span className="period">.</span></>}
            </h2>
            <p>{tidy(p.headline)}</p>
            <span className="sheet-stamp" aria-hidden="true">
              NOT JUST
              <br />
              PIXELS ↗
            </span>
          </div>

          {p.url && <div className="sheet-cta sheet-explore">
            <a className="button button-lime" href={p.url} target="_blank" rel="noopener noreferrer" onClick={() => track('concept_open', { project: p.id, source: 'case-study' })}>{websiteAction(p.kind)} ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
            <p>{p.status} · Opens in a new tab</p>
          </div>}
          <div className="sheet-image">
            <img src={p.image} srcSet={p.srcSet} sizes={p.srcSet ? '(max-width: 900px) 100vw, 1100px' : undefined} alt={p.alt} width={p.imageSize[0]} height={p.imageSize[1]} decoding="async" />
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

          <h3 className="sheet-decisions-title">03 / DESIGN DECISIONS</h3>
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
                {d.link && (
                  <div className="decision-links">
                    <a className="text-link" href={d.link.url} target="_blank" rel="noopener noreferrer" data-track={`case-${p.id}-game`}>
                      {d.link.label} ↗<span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                    {d.inquiry && (
                      <button type="button" className="text-link" onClick={() => inquire(`case-${p.id}-game-inquiry`, d.inquiry)}>
                        ASK ABOUT A GAME FOR YOUR VENUE ↗
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>

          {p.gallery.length > 0 && (
            <div className="sheet-gallery">
              {p.gallery.map((g) => (
                <figure key={g.src}>
                  <img src={g.src} srcSet={g.srcSet} sizes={g.srcSet ? '(max-width: 900px) 100vw, 1100px' : undefined} alt={g.alt} width={g.size[0]} height={g.size[1]} loading="lazy" decoding="async" />
                  <figcaption>{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <p className="sheet-note">
            <span>STATUS NOTE</span> {tidy(p.note)}
          </p>

          <div className="sheet-close-cta">
            <p>{tidy('Want something like this for your business? Tell us what your website should make easier.')}</p>
            <button type="button" className="button button-lime" onClick={() => inquire(`case-${p.id}-end`)}>
              TALK ABOUT A WEBSITE LIKE THIS <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="sheet-foot">
            <small>{tidy('Work by studio founder Adam Thomas Janes.')}</small>
            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer">
              {websiteAction(p.kind)} ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>}
            <button type="button" onClick={dismiss}>
              CLOSE CASE STUDY ↓
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
