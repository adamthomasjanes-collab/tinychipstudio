import React from "react";
import {
  monthlyOffers,
  own,
  maintenance,
  terms,
  offerCatalog,
  pricing,
  money,
} from "../offers";
import { startInquiry } from "../lib/inquiry";
function InquiryLink({ offer }) {
  return (
    <a
      className="button option-cta"
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        startInquiry({ need: offer.name, source: "website-options" });
      }}
    >
      {offer.cta}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
export default function WebsiteOptions() {
  return (
    <div className="website-options">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...offerCatalog,
          }),
        }}
      />
      <div className="options-heading">
        <h2 id="options-title">
          A STRONG START.
          <br />
          <em>ROOM TO GROW.</em>
        </h2>
        <ul className="pricing-routes" aria-label="Website pricing options">
          <li><a href="#website-care">Website + Care · {money(pricing.websiteMonthly)}/month</a></li>
          <li><a href="#website-growth">Website + Growth · {money(pricing.growthMonthly)}/month</a></li>
          <li><a href="#build-own">Buy once from {money(pricing.build)}</a></li>
        </ul>
        <p>
          Website + Care keeps your website working for you. The extra{" "}
          {money(pricing.growthMonthly - pricing.websiteMonthly)}/month for
          Website + Growth adds a service that helps organize
          inquiries, follow up and make sense of the results.
        </p>
      </div>
      <div className="options-pair">
        {monthlyOffers.map((offer) => (
          <article
            className={`option option--${offer.id === "website-growth" ? "featured" : "care"}`}
            key={offer.id}
            id={offer.id}
            data-offer={offer.id}
          >
            <p className="option-code">{offer.code}</p>
            <h4>{offer.name}</h4>
            <p className="option-price">
              {offer.price}
              <span>{offer.cadence}</span>
            </p>
            <p>{offer.description}</p>
            <p className="option-detail">{offer.detail}</p>
            {offer.availability && (
              <p className="option-readiness">
                <strong>SET UP AROUND YOUR BUSINESS</strong>{offer.availability}
              </p>
            )}
            <ul className="option-highlights">
              {(offer.id === "website-growth"
                ? [
                    "The agreed Website + Care foundation",
                    "Organized inquiries and follow-up sequences",
                    "Appointments and opportunity reporting",
                  ]
                : [
                    "Custom website, hosting and technical care",
                    "Contact forms, notifications and basic acknowledgment",
                    "Website reporting and direct support",
                  ]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <details className="option-inclusions">
              <summary>
                WHAT’S INCLUDED <span aria-hidden="true">+</span>
              </summary>
              <dl className="option-comparison">
                {offer.comparison.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
            <InquiryLink offer={offer} />
          </article>
        ))}
      </div>
      <div className="options-alternatives">
        {[own, maintenance].map((offer) => (
          <article
            className="options-existing"
            key={offer.id}
            id={offer.id}
            data-offer={offer.id}
          >
            <div>
              <p className="option-code">{offer.code}</p>
              <h4>
                {offer.name}
                <span>{offer.price}</span>
              </h4>
              <p className="alternative-cadence">{offer.cadence}</p>
            </div>
            <div>
              <p>{offer.description}</p>
              <p className="option-detail">{offer.detail}</p>
              <InquiryLink offer={offer} />
            </div>
          </article>
        ))}
      </div>
      <div className="options-terms">
        <p>{terms}</p>
        <a href="#ownership-cancellation">
          Ownership & cancellation <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
