import React from 'react';
import Chip from '../chip/Chip';
import CrewMember from '../guide/CrewMember';
import { stakes } from '../data';

/** Success vs. failure: the two ways this goes. */
export default function Stakes() {
  return (
    <section className="stakes section-pad" aria-labelledby="stakes-title" data-guide="stakes">
      <div className="section-top">
        <p className="section-tag">[ 06 / WHAT’S AT STAKE ]</p>
        <span>PICK A COLUMN.</span>
      </div>
      <h2 id="stakes-title" className="display-head reveal">
        TWO WAYS
        <br />
        <em>THIS GOES.</em>
      </h2>

      <div className="stakes-grid">
        <div className="stakes-col stakes-stay">
          <div className="stakes-chip" aria-hidden="true">
            <Chip pose="sleep" />
          </div>
          <h3>Keep the website you have.</h3>
          <ul>
            {stakes.stay.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <CrewMember crew="glitch" pose="wow" peek="up" className="crew-on-stakes" />
        </div>
        <div className="stakes-col stakes-change">
          <div className="stakes-chip" aria-hidden="true">
            <Chip pose="cheer" />
          </div>
          <h3>Make it easy to choose you.</h3>
          <ul>
            {stakes.change.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a href="#contact" className="button button-ink">
            I WANT THIS COLUMN <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
