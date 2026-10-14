import React from 'react';
import { engagements } from '../data';
import { SCORECARD_URL } from '../site';
import { tidy } from '../lib/typography';
import CrewMember from '../guide/CrewMember';
import Chip from '../chip/Chip';

export default function Services() {
  return (
    <section id="services" className="services section-pad" data-guide="services">
      <div className="section-top">
        <p className="section-tag">[ 05 / WAYS TO WORK TOGETHER ]</p>
        <span>CREATIVE THINKING. PRACTICAL EXECUTION.</span>
      </div>
      <h2 className="display-head reveal">
        WHERE SHOULD
        <br />
        <em>WE START?</em>
      </h2>
      <p className="services-intro">
        {tidy(
          'You don’t need a technical brief. Start with what your business needs. Small improvements and larger website projects are both welcome. Best for owner-operated businesses, local services and independent creators.',
        )}
      </p>

      <div className="service-list">
        {engagements.map((s, i) => (
          <article className="service" key={s.topic}>
            <span className="service-n">/0{i + 1}</span>
            <div className="service-content">
              <h3>{s.title}</h3>
              <p className="service-promise">{tidy(s.intro)}</p>
              <p className="service-body">{tidy(s.detail)}</p>
              <p className="service-tags">{s.tags}</p>
              {s.price && <p className="service-price">{s.price}</p>}
            </div>
            <a
              href="#contact"
              className="service-arrow"
              aria-label={s.link}
              onClick={() => window.dispatchEvent(new CustomEvent('tcs:need', { detail: s.need }))}
            >
              ↗
            </a>
            {i === 1 && <CrewMember crew="pixel" pose="idle" peek="side" className="crew-on-service" />}
          </article>
        ))}
      </div>

      <aside className="scorecard on-dark" aria-labelledby="scorecard-title">
        <Chip pose="point" className="scorecard-chip" />
        <div>
          <span className="section-tag">A USEFUL STARTING POINT</span>
          <h3 id="scorecard-title">NOT SURE WHAT NEEDS WORK?</h3>
          <p>{tidy('Fifteen plain-language questions, about two minutes. You get a prioritized list of what to fix first, right on screen. No email required.')}</p>
        </div>
        <a className="button button-lime" href={SCORECARD_URL} data-track="scorecard">
          SEE HOW YOUR WEBSITE MEASURES UP <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </section>
  );
}
