import React from "react";
import Founder from "./Founder";

/** Who does the work, right after the work itself. */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="about-section section-pad"
      data-guide="about"
      aria-labelledby="founder-heading"
    >
      <div className="section-top">
        <p className="section-tag">[ 04 / WHO YOU’LL WORK WITH ]</p>
        <span>DESIGNING SINCE 2007.</span>
      </div>
      <Founder />
    </section>
  );
}
