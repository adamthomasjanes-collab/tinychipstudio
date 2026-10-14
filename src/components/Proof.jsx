import React from 'react';
import Chip from '../chip/Chip';
import { proof } from '../data';
import { projects } from '../projects';
import { tidy } from '../lib/typography';
import CountUp from '../fx/CountUp';

const quotes = projects.filter((p) => p.quote);

/** The guide beat: empathy, then authority. Only real numbers and real quotes. */
export default function Proof() {
  return (
    <section className="proof section-pad" aria-labelledby="proof-title" data-guide="guide">
      <div className="proof-head">
        <p className="section-tag">[ 02 / YOUR GUIDE ]</p>
        <h2 id="proof-title" className="reveal">
          WE GET IT.
          <br />
          <em>WE’VE GOT YOU.</em>
        </h2>
        <p>
          {tidy(
            'Most websites aren’t failing because of bad design. They’re failing because a stranger can’t quickly answer two questions: what do you do, and why should they trust you? That’s the problem we solve.',
          )}
        </p>
      </div>

      <dl className="proof-stats">
        {proof.map((s) => (
          <div className="proof-stat reveal" key={s.n}>
            <dt>
              <CountUp to={s.n} />
            </dt>
            <dd>{tidy(s.label)}</dd>
          </div>
        ))}
      </dl>

      <div className="proof-quotes">
        {quotes.map((p, i) => (
          <figure className={`proof-quote proof-quote-${i}`} key={p.id}>
            <blockquote>
              <p>“{p.quote.text}”</p>
            </blockquote>
            <figcaption>
              <strong>{p.quote.by.split(',')[0]}</strong>
              <span>{p.quote.by.split(',').slice(1).join(',').trim()} · {p.status}</span>
            </figcaption>
          </figure>
        ))}
        <div className="proof-chip" aria-hidden="true">
          <Chip pose="cheer" />
        </div>
      </div>
    </section>
  );
}
