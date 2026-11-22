import React from 'react';
import Chip from '../chip/Chip';
import { BEHANCE_URL, LINKEDIN_URL, TEAM } from '../site';
import { rich } from '../lib/typography';

const NB = ' ';

/** The founder, briefly: who you'll actually talk to. (Longer version: About.jsx.) */
export default function Founder() {
  return (
    <div className="founder on-dark">
      <div className="founder-photo">
        <img
          src={`${TEAM[0].photo}.webp`}
          srcSet={`${TEAM[0].photo}-360.webp 360w, ${TEAM[0].photo}.webp 720w`}
          sizes="(max-width: 700px) 40vw, 300px"
          alt="Adam Thomas Janes, founder of Tiny Chip Studio"
          width="720"
          height="720"
          loading="lazy"
          decoding="async"
        />
        <Chip pose="wave" className="founder-chip" />
      </div>
      <div className="founder-bio">
        <p className="section-tag">Who you’ll work with</p>
        <h2 id="founder-heading">
          ADAM THOMAS JANES<span className="period">.</span>
        </h2>
        <p className="founder-role">FOUNDER / DESIGN / DEVELOPMENT</p>
        <p>{rich('Adam has worked in design and communications since 2007: newspapers and magazines, college web design courses, a full brand and website program for Camp Perry, and now websites for Northwest Ohio businesses. You talk with him directly, from the first call to launch and after.')}</p>
        <ol className="about-timeline" aria-label="Experience highlights">
          <li><strong>2007</strong><span>{`Started in design and${NB}print`}</span></li>
          <li><strong>2009</strong><span>{`Associate’s in web${NB}design`}</span></li>
          <li><strong>2011</strong><span>{`Bachelor’s in web${NB}development`}</span></li>
          <li><strong>2014</strong><span>{`Four publications, one production${NB}designer`}</span></li>
          <li><strong>2017</strong><span>{`Taught web design at Terra${NB}State`}</span></li>
          <li><strong>2018</strong><span>{`Camp Perry brand and website${NB}lead`}</span></li>
          <li><strong>2026</strong><span>{`Opened Tiny Chip Studio in${NB}Tiffin`}</span></li>
        </ol>
        <div className="about-links">
          <a className="text-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
        </div>
      </div>
    </div>
  );
}
