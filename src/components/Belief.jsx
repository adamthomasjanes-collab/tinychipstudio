import React from 'react';
import Mascot from '../Mascot';
import { tidy } from '../lib/typography';

export default function Belief() {
  return (
    <>
      <div className="interruption-strip" aria-hidden="true">
        <span>NOTICE: FORGETTABLE WEBSITES MAY BE REDESIGNED HERE</span>
        <span>✳</span>
        <span>NOTICE: FORGETTABLE WEBSITES MAY BE REDESIGNED HERE</span>
      </div>

      <section className="intro section-pad" aria-labelledby="belief-title">
        <p className="section-tag">[ THE THINKING BEHIND THE WORK ]</p>
        <h2 id="belief-title" className="reveal">
          A CLEAR WEBSITE MAKES <span>CHOOSING YOU EASIER.</span>
        </h2>
        <div className="intro-lower">
          <Mascot className="intro-mascot" />
          <p>
            {tidy(
              'When people have to piece your story together, they move on. We start with your customer, clarify the message, then design a distinctive experience with a clear next step.',
            )}
          </p>
        </div>
      </section>
    </>
  );
}
