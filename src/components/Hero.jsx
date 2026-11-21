import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { startInquiry } from "../lib/inquiry";
import "./browser-hero.css";

const min = 390;
const max = 1280;
const crushUrl = "https://adamthomasjanes.com/crush/";

function BrowserDemo() {
  const [width, setWidth] = useState(max);
  const [scale, setScale] = useState(null);
  const area = useRef(null);
  const screen = useRef(null);
  const drag = useRef(null);
  const phone = width === min;

  useEffect(() => {
    const element = screen.current;
    const measure = () => setScale(element.clientWidth / width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  function resize(value) {
    setWidth(Math.round(Math.max(min, Math.min(max, value))));
  }

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
        <span>Restaurant website concept</span>
        <a
          href={crushUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Crush ↗
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
            <span>Crush Wine Bar</span>
          </div>
          <div className="demo-screen" ref={screen}>
            <iframe
              src={crushUrl}
              title="Explore the Crush Wine Bar website concept"
              style={scale > 0 ? {
                width,
                height: (100 / scale) + "%",
                transform: "scale(" + scale + ")",
              } : undefined}
            />
          </div>
          <div
            className="demo-handle"
            role="slider"
            tabIndex={0}
            aria-label="Resize the Crush website preview"
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
          <button aria-pressed={phone} onClick={() => resize(min)}>
            Phone
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

const phoneQuery = "(max-width: 640px)";
function subscribeToPhoneLayout(callback) {
  const query = window.matchMedia(phoneQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function CrushShowcase() {
  const compact = useSyncExternalStore(
    subscribeToPhoneLayout,
    () => window.matchMedia(phoneQuery).matches,
    () => true,
  );
  if (!compact) return <BrowserDemo />;

  return (
    <figure className="crush-mobile">
      <figcaption>Crush Wine Bar · Website concept</figcaption>
      <img
        className="crush-capture"
        src="/assets/work/crush-mobile-hero.webp"
        width="780"
        height="990"
        alt="Crush Wine Bar mobile homepage featuring its storefront and sidewalk patio."
      />
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
      <CrushShowcase />
    </section>
  );
}
