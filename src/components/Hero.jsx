import React, { useEffect, useRef } from "react";
import { startInquiry } from "../lib/inquiry";
import "./key-hero.css";

export default function Hero() {
  const track = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const section = track.current;
    const panel = stage.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pending = 0;
    function paint() {
      pending = 0;
      const distance = section.offsetHeight - panel.offsetHeight;
      // Measure against the sticky inset, including the site's existing header.
      const inset = parseFloat(getComputedStyle(panel).top) || 0;
      const progress =
        distance > 0
          ? Math.max(
              0,
              Math.min(
                1,
                (inset - section.getBoundingClientRect().top) / distance,
              ),
            )
          : 1;
      const frame = reduced.matches ? 35 : Math.round(progress * 35);
      panel.style.setProperty("--key-x", (frame % 6) * 20 + "%");
      panel.style.setProperty("--key-y", Math.floor(frame / 6) * 20 + "%");
      panel.style.setProperty(
        "--chip-show",
        reduced.matches ? 1 : Math.max(0, Math.min(1, (progress - 0.52) * 5)),
      );
    }
    function update() {
      if (!pending) pending = requestAnimationFrame(paint);
    }
    const observer = new ResizeObserver(update);
    observer.observe(section);
    paint();
    window.addEventListener("scroll", update, { passive: true });
    reduced.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      reduced.removeEventListener("change", update);
      observer.disconnect();
      cancelAnimationFrame(pending);
    };
  }, []);

  return (
    <section
      className="key-track"
      ref={track}
      id="top"
      data-guide="hero"
      aria-labelledby="key-title"
    >
      <div className="key-stage" ref={stage}>
        <div className="key-copy">
          <p className="key-kicker">Independent web design · Tiffin, Ohio</p>
          <h1 id="key-title">
            Make it easy
            <br />
            to <em>choose you.</em>
          </h1>
          <p className="key-deck">
            Your next customer is on your website. I design the path from “Do
            they do what I need?” to “Let’s talk.”
          </p>
          <div className="hero-actions">
            <a
              className="button button-lime"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                startInquiry({ need: "Not sure yet", source: "hero" });
              }}
            >
              Talk about my website ↗
            </a>
            <a className="key-work" href="#clients">
              See client work ↓
            </a>
          </div>
        </div>
        <figure className="key-shot">
          <div
            className="key-film"
            role="img"
            aria-label="A lime Contact key lifts, revealing Chip inside its mechanical socket."
          >
            <img
              className="key-chip"
              src="/brand/crew-chip.svg"
              alt=""
              width="32"
              height="32"
            />
          </div>
          <figcaption>Scroll to lift the key ↓</figcaption>
        </figure>
      </div>
    </section>
  );
}
