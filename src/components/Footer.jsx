import React from 'react';
import Chip from '../chip/Chip';
import { Wordmark } from '../chip/Logo';
import { CREW } from '../chip/sprite';
import Badge from '../chip/Badge';
import CrewMember from '../guide/CrewMember';
import { HIDDEN, useGuide } from '../guide/GuideContext';
import { AREAS } from '../areas';
import { names } from '../lib/typography';
import { BEHANCE_URL, EMAIL, LINKEDIN_URL, PHONE_DISPLAY, PHONE_TEL, PORTFOLIO_URL, mailto } from '../site';

const ext = { target: '_blank', rel: 'noopener noreferrer' };
const NewTab = () => <span className="visually-hidden"> (opens in a new tab)</span>;

export default function Footer() {
  const { found, total, reset } = useGuide();
  const all = found.length === total;

  return (
    <footer className="site-footer on-dark">
      <div className="footer-cta">
        <p className="section-tag">STILL SCROLLING?</p>
        <a className="footer-big-link" href="#contact">
          LET’S MAKE IT EASIER <em>TO CHOOSE YOU.</em> <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="footer-grid">
        <nav aria-label="Footer">
          <p className="footer-label">SITE</p>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <p className="footer-label">TALK</p>
          <a href={mailto()}>{EMAIL}</a>
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
          <span>Tiffin,&nbsp;Ohio / remote projects welcome</span>
        </div>
        <div>
          <p className="footer-label">ELSEWHERE</p>
          <a href={LINKEDIN_URL} {...ext}>
            LinkedIn ↗<NewTab />
          </a>
          <a href={BEHANCE_URL} {...ext}>
            Behance ↗<NewTab />
          </a>
          <a href={PORTFOLIO_URL} {...ext}>
            Adam’s portfolio ↗<NewTab />
          </a>
        </div>
        <div className="footer-crew">
          <p className="footer-label">
            THE CREW <span>{found.length}/{total} FOUND</span>
          </p>
          <ul className="crew-lineup">
            <li className="is-guide" title="Chip, your guide. He's not hiding.">
              <Chip pose="wave" />
              <span>CHIP</span>
            </li>
            {HIDDEN.map((k) => (
              <li key={k} className={found.includes(k) ? 'is-found' : 'is-missing'} title={found.includes(k) ? CREW[k].name : 'Still hiding'}>
                <Chip crew={k} pose={found.includes(k) ? 'idle' : 'sleep'} />
                <span>{found.includes(k) ? CREW[k].name : '?'}</span>
              </li>
            ))}
          </ul>
          <p className="footer-crew-note">
            {all ? 'All found. Respect.' : 'Chip’s five friends are hiding on this page. Click one to say hi.'}
            {all && (
              <button type="button" className="text-link" onClick={reset}>
                HIDE THEM AGAIN
              </button>
            )}
          </p>
        </div>
      </div>

      {/* The town pages, linked from every page so they aren't orphans. */}
      <nav className="footer-areas" aria-label="Areas we serve">
        <p className="footer-label">WEB DESIGN IN</p>
        <ul>
          {AREAS.map((a) => (
            <li key={a.slug}>
              <a href={`/${a.slug}/`}>{names(a.name)}</a>
            </li>
          ))}
          <li className="footer-areas-note">
            <span>and across Northwest&nbsp;Ohio</span>
          </li>
        </ul>
      </nav>

      <div className="footer-badge">
        <p>Every website we build carries a tiny Chip in its footer.</p>
        <Badge theme="dark" />
      </div>

      <div className="footer-mark" aria-hidden="true">
        <Wordmark lines={1} />
      </div>

      <div className="footer-base">
        <span>
          © {new Date().getFullYear()} TINY CHIP STUDIO · <a href="/privacy.html">PRIVACY</a>
        </span>
        <CrewMember crew="bit" pose="idle" peek="up" className="crew-on-footer" />
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
