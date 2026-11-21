import React, { useEffect, useRef, useState } from "react";
import { startInquiry } from "../lib/inquiry";
import "./browser-hero.css";

const widths = [390, 560, 760, 1000, 1280];
const min = widths[0];
const max = widths[widths.length - 1];
const asset = (name) => "/assets/work/chief-demo/" + name + ".webp";

function BrowserDemo() {
  const [width, setWidth] = useState(max);
  const [booking, setBooking] = useState(false);
  const [manual, setManual] = useState(false);
  const area = useRef(null);

  const drag = useRef(null);
  const capture = widths.reduce(
    (best, candidate) =>
      Math.abs(width - candidate) < Math.abs(width - best) ? candidate : best,
    max,
  );
  const phone = width === min;

  function resize(value) {
    setManual(true);
    setBooking(false);
    setWidth(Math.round(Math.max(min, Math.min(max, value))));
  }

  useEffect(() => {
    if (manual) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let raf, start;
    function animate(now) {
      start ??= now;
      const elapsed = now - start;
      const progress = Math.min(1, Math.max(0, (elapsed - 1600) / 1700));
      setWidth(
        Math.round(
          max - (max - min) * progress * progress * (3 - 2 * progress),
        ),
      );
      if (elapsed < 4400) raf = requestAnimationFrame(animate);
      else setBooking(true);
    }
    const stop = () => cancelAnimationFrame(raf);
    const observer = new IntersectionObserver(([entry]) => {
      stop();
      if (entry.isIntersecting && !motion.matches) {
        start = undefined;
        raf = requestAnimationFrame(animate);
        observer.disconnect();
      }
    });
    observer.observe(area.current);
    motion.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      stop();
      motion.removeEventListener("change", stop);
    };
  }, [manual]);

  function beginDrag(event) {
    const boardWidth = area.current.getBoundingClientRect().width;
    const phoneFraction = Number(
      getComputedStyle(area.current).getPropertyValue("--phone-fraction"),
    );
    drag.current = {
      x: event.clientX,
      width,
      pixelsPerUnit: (boardWidth * (1 - phoneFraction)) / (max - min),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setManual(true);
  }
  function keyResize(event) {
    const targets = {
      ArrowLeft: width - 50,
      ArrowRight: width + 50,
      Home: min,
      End: max,
    };
    if (event.key in targets) {
      event.preventDefault();
      resize(targets[event.key]);
    }
  }

  return (
    <figure className="project-demo">
      <div className="demo-heading">
        <span>Client work</span>
        <a
          href="https://chiefdjrocks.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit CHIEF DJ ↗
        </a>
      </div>
      <div className="demo-board" ref={area}>
        <div className="wire" aria-hidden="true">
          <i />
          <i />
          <b />
        </div>
        <div
          className="demo-window"

          style={{ "--viewport-progress": (width - min) / (max - min) }}
        >
          <div className="demo-chrome" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>chiefdjrocks.com</span>
          </div>
          <div className="demo-screen">
            <img
              className="site-capture"
              src={asset(booking ? "form" : capture)}
              alt={
                booking
                  ? "Blank Booking Inquiry form on the CHIEF DJ website"
                  : "CHIEF DJ homepage at a responsive viewport width"
              }
            />
            {phone && !booking && (
              <button
                className="demo-book"
                aria-label="Preview the CHIEF DJ booking form"
                onClick={() => {
                  setManual(true);
                  setBooking(true);
                }}
              >
                <img src="/brand/crew-chip.svg" alt="" />
              </button>
            )}
          </div>
          <div
            className="demo-handle"
            role="slider"
            tabIndex={0}
            aria-label="Resize the CHIEF DJ website preview"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={width}
            aria-valuetext={width + " pixels"}
            onKeyDown={keyResize}
            onPointerDown={beginDrag}
            onPointerMove={(event) => {
              if (drag.current)
                resize(
                  drag.current.width +
                    (event.clientX - drag.current.x) /
                      drag.current.pixelsPerUnit,
                );
            }}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
          >
            <img src="/brand/crew-pixel.svg" alt="" />
            <span aria-hidden="true">↔</span>
          </div>
        </div>
      </div>
      <figcaption>
        <span>Drag Pixel to resize</span>
        <div aria-label="Preview sizes">
          <button aria-pressed={width === max} onClick={() => resize(max)}>
            Desktop
          </button>
          <button aria-pressed={phone && !booking} onClick={() => resize(min)}>
            Phone
          </button>
          <button
            aria-pressed={booking}
            onClick={() => {
              resize(min);
              setBooking(true);
            }}
          >
            Booking
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section
      className="browser-hero"
      id="top"
      data-guide="hero"
      aria-labelledby="browser-title"
    >
      <div className="studio-intro">
        <p className="studio-location">
          Independent design studio · Tiffin, Ohio
        </p>
        <h1 id="browser-title">
          Custom <em>websites</em>
          <br />
          for small
          <br /> businesses.
        </h1>
        <p className="studio-deck">
          Give your customers a clear path from “Do they do what I need?” to
          “How do I book?”
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
            Talk about my website ↗
          </a>
          <a href="#clients">See client work ↓</a>
        </div>
      </div>
      <BrowserDemo />
    </section>
  );
}
