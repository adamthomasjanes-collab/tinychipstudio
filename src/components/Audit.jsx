import React from 'react';
import Chip from '../chip/Chip';
import { audit } from '../data';
import { SCORECARD_URL } from '../site';
import { tidy } from '../lib/typography';

/**
 * The awkward part. Says the visitor's worries out loud before they have to
 * (an "accusation audit"), answers each one with a promise the site already
 * makes, then asks a no-oriented question: saying "no" here means "let's talk".
 */
export default function Audit() {
  return (
    <section className="audit section-pad" aria-labelledby="audit-title" data-guide="audit">
      <div className="section-top">
        <p className="section-tag">[ 06½ / THE AWKWARD PART ]</p>
        <span>WE’LL GO FIRST.</span>
      </div>
      <h2 id="audit-title" className="display-head reveal">
        YOU’RE PROBABLY
        <br />
        <em>THINKING…</em>
      </h2>

      <ol className="audit-list">
        {audit.map((item, i) => (
          <li className="audit-item reveal" key={item.thought} style={{ '--i': i }}>
            <q className="audit-thought">{item.thought}</q>
            <p className="audit-answer">{tidy(item.answer)}</p>
            <span className="audit-stamp" aria-hidden="true">
              HANDLED
            </span>
          </li>
        ))}
      </ol>

      <div className="audit-ask reveal">
        <div className="audit-chip" aria-hidden="true">
          <Chip pose="think" />
        </div>
        <p className="audit-question">{tidy('So. Would it be a bad idea to tell us what’s going on with your website?')}</p>
        <div className="audit-actions">
          <a className="button button-lime" href="#contact" data-track="start">
            NO. LET’S TALK <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href={SCORECARD_URL} data-track="scorecard">
            NOT YET? SCORE YOUR SITE FIRST, FREE <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
