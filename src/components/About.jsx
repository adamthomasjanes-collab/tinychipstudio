import React from 'react';
import Chip from '../chip/Chip';
import { BEHANCE_URL, LINKEDIN_URL, TEAM } from '../site';
import { rich } from '../lib/typography';

const NB = ' ';

export default function About() {
  return (
    <section id="about" className="about section-pad on-dark" data-guide="about">
      <div className="section-top">
        <p className="section-tag">[ 07 / BEHIND THE WORK ]</p>
        <span>INDEPENDENT BY DESIGN.</span>
      </div>
      <div className="about-intro">
        <div className="about-statement">
          <h2 className="reveal">WE CONNECT<br /><em>THE DOTS</em><span className="period">.</span></h2>
          <span className="about-signature">TIFFIN,&nbsp;OHIO / NORTHWEST OHIO &amp; BEYOND</span>
        </div>
        <div className="about-copy">
          <Chip pose="wave" className="about-mascot" />
          <h3>BETWEEN WHAT YOUR BUSINESS DOES AND WHAT YOUR CUSTOMERS NEED TO UNDERSTAND.</h3>
          <p>{rich('We turn what makes your business worth choosing into a clear, distinctive website.')}</p>
          <p>{rich('Based in Tiffin, Ohio. Working with businesses anywhere.')}</p>
        </div>
      </div>

      <div className="about-founder" aria-labelledby="founder-heading">
        <div className="about-founder-intro">
          <p className="section-tag">[ 01 / THE PERSON BEHIND THE PIXELS ]</p>
          <h3 id="founder-heading">MEET THE <em>FOUNDER.</em></h3>
          <p>You talk directly with the person doing the work.</p>
        </div>
        <div className="about-founder-main">
          <div className="about-founder-photo">
            <img
              src={`${TEAM[0].photo}.webp`}
              srcSet={`${TEAM[0].photo}-360.webp 360w, ${TEAM[0].photo}.webp 720w`}
              sizes="(max-width: 700px) 90vw, 420px"
              alt="Adam Thomas Janes, founder of Tiny Chip Studio"
              width="720" height="720" loading="lazy" decoding="async"
            />
            <span className="person-tag">01 / FOUNDER</span>
          </div>
          <div className="about-founder-bio">
            <h4>ADAM THOMAS<br />JANES<span className="period">.</span></h4>
            <p className="about-founder-role">DESIGN / DEVELOPMENT / PRODUCTION</p>
            <p>{rich('Founder Adam Thomas Janes brings a background in web development, design and print production.')}</p>
            <p>{rich('Clear message. Careful build. Tested before launch.')}</p>
            <ol className="about-timeline" aria-label="Experience highlights">
              <li><strong>2011</strong><span>{`Bachelor’s in web${NB}development`}</span></li>
              <li><strong>2014</strong><span>{`Four publications, one production${NB}designer`}</span></li>
              <li><strong>2018</strong><span>{`Camp Perry communications${NB}lead`}</span></li>
            </ol>
            <div className="about-links">
              <a className="text-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
              <a className="text-link" href={BEHANCE_URL} target="_blank" rel="noopener noreferrer">BEHANCE ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
