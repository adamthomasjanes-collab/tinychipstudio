import React, { useEffect, useRef } from "react";
import { heroTeaser, heroDisclosure, primaryCta, own } from "../offers";
import { startInquiry } from "../lib/inquiry";

import { transformations } from "../transformations";
import BeforeAfter from "../fx/BeforeAfter";
import { tidy } from "../lib/typography";
import CircuitField from "../fx/CircuitField";

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
      el.style.setProperty("--peel", p.toFixed(3));
      el.classList.toggle("is-gone", p >= 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

export default function Hero() {
  const frameRef = useRef(null);
  const noticeRef = useRef(null);
  useNoticePeel(noticeRef);
  // The hero is a deliberate feature, independent of the comparison tab order.
  const t = transformations.find((project) => project.id === "pioneer-mill");

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
          <p className="hero-kicker">WEBSITE DESIGN & BUSINESS GROWTH</p>
          <h1>
            YOUR BUSINESS IS GREAT.{" "}
            <span className="hero-line-three">
              YOUR WEBSITE SHOULD PROVE IT<span className="period">.</span>
            </span>
          </h1>
          <p className="hero-sub">
            {tidy(
              "Distinctive websites that help people understand your business and get in touch. We handle the care and reporting, and set up inquiry and follow-up tools around your business with Growth.",
            )}
          </p>
          <p className="hero-offer">
            <strong>{heroTeaser}</strong>
            <span>{heroDisclosure}</span>
          </p>
          <div className="hero-actions">
            <a
              className="button button-lime"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                startInquiry({ need: "Not sure yet", source: "hero" });
              }}
            >
              {primaryCta} <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#services">
              SEE WHAT’S INCLUDED <span aria-hidden="true">↓</span>
            </a>
          </div>
          <ul className="hero-facts" aria-label="At a glance">
            <li>Based in Tiffin, Ohio · working with businesses anywhere</li>
          </ul>
          <a className="text-link hero-score" href="#website-options">
            PREFER TO BUY ONCE? BUILD &amp; OWN {own.price.toUpperCase()} ↗
          </a>
        </div>

        <div className="hero-ba" ref={frameRef}>
          <BeforeAfter
            before={t.before}
            after={t.after}
            label={`${t.name}, ${t.place}`}
            url="Pioneer Mill · design concept"
            eager
            start={58}
            sizes="(max-width: 900px) 100vw, 52vw"
          />
          <p className="hero-ba-cap">
            <strong>
              {t.name}, {t.place}.
            </strong>{" "}
            {tidy(
              "October 2026 screenshots: original site vs. our redesign concept.",
            )}{" "}
            <a
              className="hero-concept-link"
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="hero-concept-open"
            >
              OPEN PIONEER MILL CONCEPT ↗
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>{" "}
            <a href="#work">COMPARE MORE WEBSITES ↓</a>
          </p>
        </div>
      </section>
    </div>
  );
}
