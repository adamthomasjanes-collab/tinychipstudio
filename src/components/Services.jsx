import React from "react";
import { serviceGroups, limitations } from "../offers";
import CrewMember from "../guide/CrewMember";
export default function Services() {
  return (
    <section
      id="services"
      className="services section-pad"
      data-guide="services"
      aria-labelledby="services-title"
    >
      <div className="section-top">
        <p className="section-tag">[ 05 / WHAT’S INCLUDED ]</p>
        <span>ATTRACT. CONVERT. UNDERSTAND.</span>
      </div>
      <div className="service-introduction">
        <h2 id="services-title" className="display-head reveal">
          GOOD BUSINESS.
          <br />
          <em>BETTER FOLLOW-THROUGH.</em>
        </h2>
        <div>
          <p>
            A good website helps people see why your business is worth their
            time. What happens after they reach out matters, too.
          </p>
          <p>
            We build distinctive websites, look after the details and help you
            plan a clearer path from first interest to the next conversation.
          </p>
        </div>
      </div>
      <ol className="partner-benefits">
        <li>
          <p className="benefit-label">ATTRACT</p>
          <h3>Make a great first impression.</h3>
          <p>
            A website that makes your business easy to understand and trust.
          </p>
        </li>
        <li>
          <p className="benefit-label">CONVERT</p>
          <h3>Make it easy to reach you.</h3>
          <p>
            Useful contact forms, clear next steps and appointment options where
            appropriate.
          </p>
        </li>
        <li>
          <p className="benefit-label">UNDERSTAND</p>
          <h3>Keep opportunities in view.</h3>
          <p>
            Practical reporting, with organized inquiries and follow-up tools
            configured for your business with Growth.
          </p>
        </li>
      </ol>
      <div className="service-foundation" aria-labelledby="foundation-title">
        <div>
          <p className="section-tag">THE SHARED FOUNDATION</p>
          <h3 id="foundation-title">
            BUILT WITH CARE.
            <br />
            BACKED BY PEOPLE.
          </h3>
          <p>
            Every monthly plan begins with a properly scoped website and a
            direct relationship with the studio.
          </p>
        </div>
        <div className="flagship-services">
          {serviceGroups.map((group) => (
            <details key={group.title}>
              <summary>
                <span>{group.title}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <p className="service-summary">{group.summary}</p>
              <p>{group.details}</p>
            </details>
          ))}
          <p className="flagship-limits">{limitations}</p>
        </div>
        <CrewMember
          crew="pixel"
          pose="idle"
          peek="side"
          className="crew-on-service"
        />
      </div>
      <aside className="review-note">
        <h3>Not sure where to start?</h3>
        <p>
          The free website scorecard helps you spot what deserves attention
          first.
        </p>
        <a className="text-link" href="#scorecard" data-track="scorecard">
          FREE WEBSITE SCORECARD ↗
        </a>
      </aside>
    </section>
  );
}
