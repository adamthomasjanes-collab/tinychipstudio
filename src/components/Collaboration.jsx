import React from 'react';
import { collaboration } from '../data';
import { tidy } from '../lib/typography';

export default function Collaboration() {
  return (
    <section className="collab section-pad" aria-labelledby="collab-title">
      <div className="section-top">
        <p className="section-tag">[ 05 / WORKING TOGETHER / WHAT TO EXPECT ]</p>
        <span>NO TECHNICAL BRIEF REQUIRED.</span>
      </div>
      <h2 id="collab-title" className="display-head reveal">
        A REAL CONVERSATION.
        <br />
        <em>A CLEAR WAY FORWARD.</em>
      </h2>
      <p className="collab-intro">
        {tidy(
          'Not sure what needs fixing yet? That’s a perfectly useful place to start. We can begin with your goals and what’s happening on your current site—no technical brief required.',
        )}
      </p>
      <div className="collab-grid">
        {collaboration.map((c) => (
          <article className="collab-item" key={c.label}>
            <span className="collab-label">{c.label.toUpperCase()}</span>
            <h3>{c.title}</h3>
            <p>{tidy(c.body)}</p>
          </article>
        ))}
      </div>
      <a href="#contact" className="text-link collab-link">
        TELL US WHAT YOU’RE WORKING ON <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
