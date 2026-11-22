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
      <Founder />
    </section>
  );
}
