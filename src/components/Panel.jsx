import React, { useCallback, useEffect, useRef, useState } from 'react';

const EXIT_MS = 610; // matches .case-sheet's exit transition
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A bottom sheet for tools that live inside the site (the scorecard, booking a
 * call). Same look and modal behaviour as the case-study sheet: slides up, locks
 * the page behind it, traps focus, Esc or the backdrop closes it, and focus
 * goes back where it came from.
 */
export default function Panel({ id, sys, title, closeLabel = 'CLOSE', onClose, children }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  const [phase, setPhase] = useState('enter');
  const dismiss = useCallback(() => setPhase('leave'), []);

  useEffect(() => {
    let b;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => {
        setPhase((p) => (p === 'enter' ? 'open' : p));
        closeRef.current?.focus();
      });
    });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, []);

  useEffect(() => {
    if (phase !== 'leave') return undefined;
    const t = setTimeout(onClose, reduced() ? 0 : EXIT_MS);
    return () => clearTimeout(t);
  }, [phase, onClose]);

  useEffect(() => {
    const before = document.activeElement;
    const shell = document.getElementById('app-shell');
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    shell?.setAttribute('inert', '');
    const onKey = (e) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      shell?.removeAttribute('inert');
      before?.focus?.();
    };
  }, [dismiss]);

  const state = phase === 'open' ? 'is-up' : 'is-down';
  return (
    <div className={`sheet-backdrop ${state}`} onMouseDown={(e) => e.target === e.currentTarget && dismiss()}>
      <section ref={ref} className={`case-sheet panel-sheet panel-sheet--${id} ${state}`} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
        <div className="sheet-toolbar">
          <div className="sheet-grip" aria-hidden="true" />
          <span className="sheet-sys">{sys}</span>
          <button ref={closeRef} type="button" className="sheet-eject" onClick={dismiss}>
            {closeLabel} <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="sheet-content panel-content">
          <h2 id={`${id}-title`} className="panel-title">
            {title}
          </h2>
          {children({ close: dismiss })}
        </div>
      </section>
    </div>
  );
}
