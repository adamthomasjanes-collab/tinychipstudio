// Studio copy. Mirrors adamthomasjanes.com (src/components/WebPortfolio.tsx and friends),
// written in the studio's "we" voice. See README for the file-by-file sync map.
import { own, offers, offerFaq } from "./offers.js";
export { offers, terms, offerCatalog } from "./offers.js";

export const engagements = [
  {
    topic: "Improve an existing website",
    title: "IMPROVE AN EXISTING WEBSITE.",
    intro: "Make your current site work harder.",
    detail:
      "Clearer content, easier navigation and fixes where customers get stuck.",
    tags: "Redesign / Usability / Content / Performance",
    price: "FIXED QUOTE",
    link: "Talk about improvements",
    need: "Improve my current website",
  },
  {
    topic: "Design & build a website",
    title: "DESIGN & BUILD A WEBSITE.",
    intro: "A clear message. A website that feels like you.",
    detail:
      "Strategy, custom design, development and a clear handoff. Own the agreed custom work after full payment, subject to third-party licenses. Future support is your choice.",
    tags: "Strategy / Custom design / Responsive development",
    price: `${own.price.toUpperCase()} · FIXED QUOTE`,
    link: "Discuss a new website",
    need: "A new website",
  },
  {
    topic: "Website review",
    title: "START WITH A WEBSITE REVIEW.",
    intro: "Know what to fix first.",
    detail:
      "Get a written plan for improving your site. Scope and fee agreed first.",
    tags: "Agreed scope / Prioritized recommendations / Agreed fee",
    price: "AGREED FEE",
    link: "Ask about a website review",
    need: "A website review",
  },
];

export const steps = [
  {
    n: "01",
    title: "LET’S TALK",
    body: "Tell us about your business. We learn what you need, check eligibility and agree which option makes sense.",
  },
  {
    n: "02",
    title: "CREATE",
    body: "We shape the message, design and working website. You review and approve it before launch.",
  },
  {
    n: "03",
    title: "LOOK AFTER",
    body: "Your agreed plan covers what follows launch. Care keeps the website running; Growth adds follow-up systems configured during onboarding. Build & Own has a defined handoff and optional future help.",
  },
];

// Questions are phrased the way a visitor would ask them; answers are the studio's.
export const faq = offerFaq;

/* ---------------------------------------------------------------------------
   StoryBrand layer. The visitor is the hero; the studio is the guide; Chip is
   the studio's mascot and narrates. Chip speaks as himself ("I"), which is a
   character voice, not the studio's.
--------------------------------------------------------------------------- */

// The problem, three ways: what visitors do, how it feels, why it matters.
export const problems = [
  {
    tag: "WHAT HAPPENS",
    title: "Visitors can’t tell what you do.",
    body: "People move on when your offer isn’t clear.",
  },
  {
    tag: "HOW IT FEELS",
    title: "You hesitate to share the link.",
    body: "Your website no longer reflects the work you do.",
  },
  {
    tag: "WHAT IT COSTS",
    title: "The next step is a guessing game.",
    body: "Interested visitors leave without getting in touch.",
  },
];

// Authority, using only facts that already appear elsewhere on the site.
export const proof = [
  { n: "12", label: "Documented projects, with clear status labels" },
  { n: "156", label: "Weekly print editions delivered" },
  {
    n: "2",
    label: "Monthly website packages, with outright purchase available",
  },
  { n: "1", label: "Fixed quote before work starts" },
];

// The agreement: ownership of the custom work, with third-party costs made clear.
export const ownership = {
  headline: ["YOUR BUSINESS.", "YOUR WEBSITE.", "YOUR CALL."],
  lead: "Choose a continuing partnership or a one-time project. You deserve clear terms either way.",
  body: [
    "Your domain and the content you provide remain yours. We agree on access, responsibilities and expected third-party costs before work starts.",
    "Build & Own has no mandatory care subscription. Rights to agreed custom deliverables transfer after full payment, subject to third-party licenses.",
    "Both monthly website plans have a 12-month initial commitment for qualifying $0-upfront builds. We put website rights, early-exit details, offboarding and your options after the initial year in writing before you commit.",
  ],
  belief: "Good relationships start with a clear understanding.",
};

// Stakes: the two ways this goes.
export const stakes = {
  stay: [
    "Visitors keep guessing what you do.",
    "Good leads choose whoever explains it faster.",
    "You keep apologizing for the link.",
    "Updating the site stays a chore nobody owns.",
  ],
  change: [
    "People understand your offer in seconds.",
    "The right customers reach out, ready to talk.",
    "You share your website with confidence.",
    "You know exactly how to keep it current.",
  ],
};

// Chip's one-liners, keyed by each section's data-guide attribute.
export const guideLines = {
  default: {
    pose: "idle",
    text: "I’m Chip. Five of my friends are hiding on this page. Just saying.",
  },
  problem: {
    pose: "think",
    text: "It sounds like your website is underselling you. Most good businesses have this problem. It’s fixable.",
  },
  guide: {
    pose: "point",
    text: "Real clients, real quotes. No made-up stats here.",
  },
  work: {
    pose: "point",
    text: "Drag to compare. Open the concept website to try it.",
  },
  plan: {
    pose: "walk",
    text: "Here’s the plan. Three steps, no mystery handoff.",
  },
  services: {
    pose: "idle",
    text: "Ongoing support or a one-time build? You get to choose.",
  },
  stakes: {
    pose: "think",
    text: "Two ways this can go. I’m rooting for the column on the right.",
  },
  audit: {
    pose: "wow",
    text: "It seems weird to say this stuff out loud. That’s exactly why we do.",
  },
  about: {
    pose: "wave",
    text: "That’s Adam. He started the studio. I just live here.",
  },
  faq: {
    pose: "idle",
    text: "Sounds like you’ve still got questions. Good. If yours isn’t here, just ask.",
  },
};

// The awkward part (Chris Voss's "accusation audit"): name the visitor's worries
// before they have to. Answers only repeat promises made elsewhere on the site.
export const audit = [
  {
    thought: "This is going to cost more than I planned.",
    answer:
      "Fair worry. That’s why the price is fixed and agreed before any paid work starts. If it doesn’t fit, you find out early.",
  },
  {
    thought: "They’ll talk me into a whole new website I don’t need.",
    answer:
      "You might not need one. Sometimes the fix is a clearer message or a simpler route through the pages. A scoped review can set priorities first.",
  },
  {
    thought: "I’ll be stuck calling them every time I need a typo fixed.",
    answer:
      "Who updates the site, and how, is decided before the build. Not discovered after it.",
  },
  {
    thought: "This will drag on for months.",
    answer:
      "A typical website takes about a week of build time once content and approvals are in. You’ll have a timeline before paid work starts.",
  },
  {
    thought: "A studio with a cartoon mascot can’t be serious.",
    answer:
      "Strategy in the thinking. Character in the details. Chip makes the site memorable. The plan behind it is all business.",
  },
];

// Project starter form options.
export const starter = {
  needs: [
    "New website / not sure which plan",
    ...offers.map((offer) => offer.name),
    "Inquiry & follow-up help",
    "Not sure yet",
  ],
  budgets: [
    "Not sure yet",
    "Under $2,500",
    "$2,500–$5,000",
    "$5,000–$10,000",
    "$10,000+",
  ],
  timelines: [
    "Not sure yet",
    "As soon as possible",
    "In the next 1–3 months",
    "Just exploring",
  ],
  next: [
    "We read your message and reply by email.",
    "We talk through what you need.",
    "You get a clear scope, timeline and written terms.",
  ],
};
