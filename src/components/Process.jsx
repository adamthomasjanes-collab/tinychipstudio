import React, { useEffect, useRef, useState } from 'react';
import Chip from '../chip/Chip';
import CrewMember from '../guide/CrewMember';
import { promises, steps } from '../data';
import { tidy } from '../lib/typography';

/**
 * Chip walks the track as you scroll through the plan: forward when you read
 * on, back (facing back) when you scroll up. He stops when you stop, and
 * turns to look at you.
 */
function useWalk(trackRef, walkerRef) {
  const [walk, setWalk] = useState({ on: false, back: false });
  useEffect(() => {
    const track = trackRef.current;
    const walker = walkerRef.current;
    if (!track || !walker) return undefined;
    let raf = 0;
    let lastY = window.scrollY;
    let stopT = 0;
    let state = { on: false, back: false };
    const place = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.62)));
      walker.style.setProperty('--walk', p.toFixed(4));
      const y = window.scrollY;
      const moved = y !== lastY;
      const back = y < lastY;
      lastY = y;
      if (!moved || p <= 0 || p >= 1) return;
      if (!state.on || state.back !== back) setWalk((state = { on: true, back }));
      clearTimeout(stopT);
      stopT = setTimeout(() => setWalk((state = { ...state, on: false })), 380);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(place); };
    place();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(stopT);
    };
  }, [trackRef, walkerRef]);
  return walk;
}

/** The plan (three steps) and the agreement (what a client can count on). */
export default function Process() {
  const trackRef = useRef(null);
  const walkerRef = useRef(null);
  const walk = useWalk(trackRef, walkerRef);
  return (
    <>
      <section id="process" className="process section-pad" data-guide="plan">
        <div className="section-top">
          <p className="section-tag">[ 04 / THE PLAN ]</p>
          <span>A CLEAR PATH FORWARD.</span>
        </div>
        <h2 className="display-head reveal">
          THREE STEPS.
          <br />
          <em>NO MYSTERY HANDOFF.</em>
        </h2>

        <div className="process-track" aria-hidden="true" ref={trackRef}>
          <div className={`process-walker${walk.on && walk.back ? ' is-back' : ''}`} ref={walkerRef}>
            <Chip pose={walk.on ? 'walk' : 'idle'} moving={walk.on} />
          </div>
        </div>

        <ol className="process-grid">
          {steps.map((s) => (
            <li className="process-item" key={s.n}>
              <span>/{s.n}</span>
              <h3>{s.title}</h3>
              <p>{tidy(s.body)}</p>
            </li>
          ))}
        </ol>

        <div className="promise">
          <p className="section-tag">THE AGREEMENT / WHAT YOU CAN COUNT ON</p>
          <ul className="promise-grid">
            {promises.map((p) => (
              <li key={p.title}>
                <h3>{p.title}</h3>
                <p>{tidy(p.body)}</p>
              </li>
            ))}
          </ul>
          <a href="#contact" className="button button-lime">
            START WITH STEP ONE <span aria-hidden="true">↗</span>
          </a>
          <CrewMember crew="boot" pose="sleep" peek="up" className="crew-on-promise" />
        </div>
      </section>

      <div className="big-idea-break" aria-hidden="true">
        <span>✳</span>
        <strong>
          BUILT TO
          <br />
          BE USED.
        </strong>
        <span>✳</span>
      </div>
    </>
  );
}
