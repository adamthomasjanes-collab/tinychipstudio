import React from 'react';
import { faq } from '../data';
import { tidy } from '../lib/typography';

export default function Faq() {
  return (
    <section id="faq" className="faq section-pad" aria-labelledby="faq-title" data-guide="faq">
      <div className="faq-head">
        <p className="section-tag">[ 08 / BEFORE WE BEGIN / ROOM FOR QUESTIONS ]</p>
        <h2 id="faq-title" className="reveal">
          A LITTLE LESS
          <br />
          <em>GUESSWORK.</em>
        </h2>
        <p>{tidy('It can be hard to know what a website project involves. You may be wondering about time, cost or whether you’re ready. Start here.')}</p>
      </div>
      {/* FAQ rich results, generated from the same copy that's on the page. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{tidy(item.a)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
