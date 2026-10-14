import React from 'react';
import Chip from '../chip/Chip';
import { BEHANCE_URL, LINKEDIN_URL, PORTFOLIO_URL, TEAM } from '../site';
import { rich } from '../lib/typography';

const NB = ' ';

/** One person. With no photo yet, the card holds the spot with Chip and a frame. */
function Person({ p, i }) {
  if (!p.photo) {
    return (
      <li className="person person--soon">
        <div className="person-photo person-photo--soon" aria-hidden="true">
          <Chip pose="think" crew="pixel" />
        </div>
        <p className="person-name">{p.name || 'Spot reserved'}</p>
        <p className="person-role">{p.role || 'Photo and introduction coming soon'}</p>
      </li>
    );
  }
  return (
    <li className="person">
      <div className="person-photo">
        <img
          src={`${p.photo}.webp`}
          srcSet={`${p.photo}-360.webp 360w, ${p.photo}.webp 720w`}
          sizes="(max-width: 700px) 70vw, 280px"
          alt={`${p.name}, ${p.role.split('·')[0].trim()} of Tiny Chip Studio`}
          width="720"
          height="720"
          loading="lazy"
          decoding="async"
        />
        <span className="person-tag" aria-hidden="true">0{i + 1}</span>
      </div>
      <p className="person-name">{p.name}</p>
      <p className="person-role">{p.role}</p>
      {p.line && <p className="person-line">{p.line}</p>}
    </li>
  );
}

export default function About() {
  return (
    <section id="about" className="about section-pad on-dark" data-guide="about">
      <div className="section-top">
        <p className="section-tag">[ 07 / BEHIND THE WORK ]</p>
        <span>INDEPENDENT BY DESIGN.</span>
      </div>
      <div className="about-grid">
        <div>
          <h2 className="reveal">
            WE CONNECT
            <br />
            <em>THE DOTS</em>
            <span className="period">.</span>
          </h2>
          <span className="about-signature">TIFFIN,&nbsp;OHIO / NORTHWEST OHIO &amp; BEYOND</span>
        </div>

        <div className="about-copy">
          <Chip pose="wave" className="about-mascot" />
          <h3>BETWEEN WHAT YOUR BUSINESS DOES AND WHAT YOUR CUSTOMERS NEED TO UNDERSTAND.</h3>
          <p>
            {rich(
              'Most websites aren’t failing because of bad design. They’re failing because a stranger can’t quickly answer two questions: what do you do, and why should they trust you? That’s the problem we solve. We plan, design and build websites from Tiffin, Ohio, for businesses across Northwest Ohio and beyond. Custom frontends and WordPress, starting with your customer and working back to the page.',
            )}
          </p>
          <p>
            {rich(
              'Tiny Chip Studio was founded by **Adam Thomas Janes**, who came to the web through print deadlines that don’t move. Four recurring publications, 156 weekly editions, one production designer. That habit came along: structure first, then the details, then testing.',
            )}
          </p>
          <ul className="about-timeline">
            <li>
              <strong>2011</strong>
              {`Bachelor’s in web${NB}development`}
            </li>
            <li>
              <strong>2014</strong>
              {`Four publications, one production${NB}designer`}
            </li>
            <li>
              <strong>2018</strong>
              {`Camp Perry communications${NB}lead`}
            </li>
          </ul>
          <div className="about-links">
            <a className="text-link" href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
              ADAM’S PORTFOLIO ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <a className="text-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LINKEDIN ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <a className="text-link" href={BEHANCE_URL} target="_blank" rel="noopener noreferrer">
              BEHANCE ↗<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="team">
        <div className="team-head">
          <p className="section-tag">WHO YOU’LL ACTUALLY TALK TO</p>
          <p>{rich('No account managers, no handoffs. The people below answer the phone, do the work and stick around after launch.')}</p>
        </div>
        <ul className="team-list">
          {TEAM.map((p, i) => (
            <Person key={p.name || i} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
