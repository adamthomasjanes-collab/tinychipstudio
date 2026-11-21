import React from "react";
import { faq } from "../data";
import { tidy } from "../lib/typography";
import CrewMember from "../guide/CrewMember";

const groups = [...new Set(faq.map((item) => item.group))].map((title) => ({
  title,
  questions: faq.filter((item) => item.group === title).map((item) => item.q),
}));

export default function Faq() {
  return (
    <section
      id="faq"
      className="faq section-pad"
      aria-labelledby="faq-title"
      data-guide="faq"
    >
      <div className="faq-head">
        <p className="section-tag">[ 09 / QUESTIONS ]</p>
        <h2 id="faq-title" className="reveal">
          A LITTLE LESS
          <br />
          <em>GUESSWORK.</em>
        </h2>
        <p>{tidy("Cost, timing, ownership and what happens next.")}</p>
      </div>
      {/* FAQ rich results, generated from the same copy that's on the page. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="faq-list">
        {groups.map((group) => (
          <section
            className="faq-group"
            key={group.title}
            aria-label={group.title}
          >
            <h3>{group.title}</h3>
            {group.questions
              .map((question) => faq.find((item) => item.q === question))
              .filter(Boolean)
              .map((item) => (
                <details key={item.q}>
                  <summary>
                    {item.q}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{tidy(item.a)}</p>
                </details>
              ))}
          </section>
        ))}
      </div>
      <CrewMember crew="glitch" pose="wow" peek="up" className="crew-on-faq" />
    </section>
  );
}
