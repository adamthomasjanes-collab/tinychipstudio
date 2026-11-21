import React from "react";
import WebsiteOptions from "./WebsiteOptions";

/** Plans and prices as their own stop on the page (and in the nav). */
export default function Pricing() {
  return (
    <section
      id="website-options"
      className="pricing section-pad"
      data-guide="services"
      aria-labelledby="options-title"
    >
      <div className="section-top">
        <p className="section-tag">[ 06 / PRICING ]</p>
        <span>PLANS & PRICES.</span>
      </div>
      <WebsiteOptions />
    </section>
  );
}
