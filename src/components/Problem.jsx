import React from 'react';
import Chip from '../chip/Chip';
import { problems } from '../data';
import { tidy } from '../lib/typography';

export default function Problem() {
  return (
    <>
      <div className="interruption-strip" aria-hidden="true">
        <span>NOTICE: FORGETTABLE WEBSITES MAY BE REDESIGNED HERE</span>
        <span>✳</span>
        <span>NOTICE: FORGETTABLE WEBSITES MAY BE REDESIGNED HERE</span>
      </div>

      <section className="problem section-pad on-dark" aria-labelledby="problem-title" data-guide="problem">
        <div className="section-top">
          <p className="section-tag">[ 01 / THE PROBLEM ]</p>
          <span>IT’S NOT YOU. IT’S THE WEBSITE.</span>
        </div>
        <h2 id="problem-title" className="display-head reveal">
          GOOD BUSINESS.
          <br />
          <em>QUIET WEBSITE.</em>
        </h2>
        <p className="problem-intro">
          {tidy('You do good work, but your website doesn’t say so fast enough. Visitors don’t wait around to find out.')}
        </p>

        <ol className="problem-grid">
          {problems.map((p, i) => (
            <li className="problem-card reveal" key={p.tag} style={{ '--i': i }}>
              <span className="problem-tag">
                /0{i + 1} {p.tag}
              </span>
              <h3>{p.title}</h3>
              <p>{tidy(p.body)}</p>
            </li>
          ))}
        </ol>

        <div className="problem-belief">
          <Chip pose="think" className="problem-chip" />
          <p className="reveal">
            A CLEAR WEBSITE MAKES <span>CHOOSING YOU EASIER.</span>
          </p>
          <p className="problem-belief-sub">
            {tidy(
              'When people have to piece your story together, they move on. We start with your customer, clarify the message, then design a distinctive experience with a clear next step.',
            )}
          </p>
        </div>
      </section>
    </>
  );
}
