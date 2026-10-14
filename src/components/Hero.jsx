import React, { useEffect, useRef } from 'react';
import { BOOK_URL, REGION, SCORECARD_URL, STARTING_PRICE } from '../site';
import { transformations } from '../transformations';
import BeforeAfter from '../fx/BeforeAfter';
import { tidy } from '../lib/typography';
import CircuitField from '../fx/CircuitField';

/**
 * The "system notice" sticker sits on top of the header's bottom edge, like
 * something slapped onto the page. It peels up and fades as soon as you scroll,
 * so it never rides over the sticky nav.
 */
function useNoticePeel(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / 160));
      el.style.setProperty('--peel', p.toFixed(3));
      el.classList.toggle('is-gone', p >= 1);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [ref]);
}

export default function Hero() {
  const frameRef = useRef(null);
  const noticeRef = useRef(null);
  useNoticePeel(noticeRef);
  const t = transformations[0];

  return (
    <div className="hero-stage">
      <div className="hero-bug" ref={noticeRef} aria-hidden="true">
        <span className="bug-cross">✳</span>
        <span>SYSTEM NOTICE / 001</span>
        <strong>
          YOUR WEBSITE IS
          <br />
          NOT A TOASTER.
        </strong>
        <small>IT CAN HAVE A PERSONALITY.</small>
      </div>
      <section className="hero hero--ba" id="top" data-guide="hero">
        <CircuitField chipRef={frameRef} />

        <div className="hero-copy">
          <p className="hero-kicker">
            WEB DESIGN FOR {REGION.toUpperCase()} BUSINESSES <span>/ AND WHEREVER YOU ARE</span>
          </p>
          <h1>
            MAKE IT EASIER FOR CUSTOMERS{' '}
            <span className="hero-line-three">
              TO CHOOSE YOU<span className="period">.</span>
            </span>
          </h1>
          <p className="hero-sub">
            {tidy(
              'You do good work. Your website should make that obvious in five seconds. We plan, design and build sites that say what you do plainly, earn trust fast, and make calling you the easy next step.',
            )}
          </p>
          <div className="hero-actions">
            <a className="button button-lime" href="#contact" data-track="start">
              START A PROJECT <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-ghost" href={BOOK_URL} data-track="book-call-hero">
              BOOK A 15-MIN CALL <span aria-hidden="true">☎</span>
            </a>
          </div>
          <ul className="hero-facts" aria-label="At a glance">
            <li>
              Websites from <strong>{STARTING_PRICE}</strong>
            </li>
            <li>Fixed quote before work starts</li>
            <li>Based in Tiffin,&nbsp;Ohio</li>
          </ul>
          <a className="text-link hero-score" href={SCORECARD_URL} data-track="scorecard">
            NOT READY? SCORE YOUR WEBSITE FREE, 2 MIN <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="hero-ba" ref={frameRef}>
          <BeforeAfter before={t.before} after={t.after} label={`${t.name}, ${t.place}`} url="pioneermilloftiffin.com" eager start={58} sizes="(max-width: 900px) 100vw, 52vw" />
          <p className="hero-ba-cap">
            <strong>
              {t.name}, {t.place}.
            </strong>{' '}
            {tidy('Their site today vs. our redesign concept.')} <a href="#work">SEE ALL FIVE →</a>
          </p>
        </div>
      </section>
    </div>
  );
}
