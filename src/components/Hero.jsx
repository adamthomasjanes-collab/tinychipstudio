import React, { useRef } from "react";
import BeforeAfter from "../fx/BeforeAfter";
import CircuitField from "../fx/CircuitField";
import { startInquiry } from "../lib/inquiry";
import { names, tidy } from "../lib/typography";
import { projects } from "../projects";
import "./browser-hero.css";

const chief = projects.find((project) => project.id === "chief-dj");
const before = {
  src: "/assets/work/ba/chief-dj-before",
  alt: "CHIEF’s original homepage with a performance photo above the Livin’ N Rockin’ title.",
};
const after = {
  src: "/assets/work/ba/chief-dj-after",
  alt: chief.alt,
};

export default function Hero({ onOpen }) {
  const frame = useRef(null);
  return (
    <section className="hero hero--ba" id="top" data-guide="hero" aria-labelledby="hero-title">
      <CircuitField chipRef={frame} />
      <div className="hero-copy">
        <p className="hero-kicker">Custom website design for small businesses</p>
        <h1 id="hero-title">Your business is great. <span className="hero-line-three">Your website should prove it<span className="period">.</span></span></h1>
        <p className="hero-sub">We build websites that help customers understand what you offer and know how to get in touch.</p>
        <div className="hero-actions">
          <a className="button button-lime" href="#contact" onClick={(event) => {
            event.preventDefault();
            startInquiry({ need: "Not sure yet", source: "hero" });
          }}>Let’s talk about your website ↗</a>
          <a className="text-link" href="#website-options">See pricing ↓</a>
        </div>
        <aside className="hero-bug chief-notice" aria-hidden="true">
          <span className="bug-cross">✳</span>
          <strong>Your website is not a toaster.</strong>
          <small>It can have a personality.</small>
        </aside>
      </div>
      <div className="hero-ba" ref={frame}>
        <p className="hero-kicker">CHIEF DJ · Website redesign</p>
        <BeforeAfter before={before} after={after} label="CHIEF DJ" url="chiefdjrocks.com" eager
          sizes="(max-width: 900px) 94vw, 50vw" />
        <p className="hero-ba-cap">Fans can find Steve’s next show. Event hosts can ask about a date.</p>
      </div>
      <article className="chief-story" aria-labelledby="chief-headline">
        <div>
          <p className="client-status">{chief.status} · {names(chief.sector)}</p>
          <h2 id="chief-headline">{tidy(chief.headline)}</h2>
          <p>{tidy(chief.summary)}</p>
          <div className="client-actions">
            <button type="button" className="button button-lime" onClick={(event) => onOpen(chief, event.currentTarget)}>Read case study ↑</button>
            <a className="text-link" href={chief.url} target="_blank" rel="noopener noreferrer" data-track="client-open-chief-dj">Visit CHIEF DJ ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
          </div>
        </div>
        <figure className="client-quote">
          <blockquote><p>“{tidy(chief.quote.text)}”</p></blockquote>
          <figcaption>{names(chief.quote.by)}</figcaption>
        </figure>
      </article>
    </section>
  );
}
