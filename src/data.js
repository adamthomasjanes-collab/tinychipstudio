// Studio copy. Mirrors adamthomasjanes.com (src/components/WebPortfolio.tsx and friends),
// written in the studio's "we" voice. See README for the file-by-file sync map.

export const engagements = [
  {
    topic: 'Improve an existing website',
    title: 'IMPROVE AN EXISTING WEBSITE.',
    intro: 'Your business has moved forward. Your website can, too.',
    detail:
      'Targeted redesign, clearer content, easier navigation and technical refinement. We’ll identify what is getting in the way and decide what deserves attention first.',
    tags: 'Redesign / Usability / Content / Performance',
    price: 'FIXED QUOTE AFTER A 15-MIN CALL',
    link: 'Talk about improvements',
    need: 'Improve my current website',
  },
  {
    topic: 'Design & build a website',
    title: 'DESIGN & BUILD A WEBSITE.',
    intro: 'Bring the message, the experience and the technology together.',
    detail:
      'Strategy, custom design and responsive development, from the first content decisions through testing and handoff. WordPress or a custom frontend, chosen for the work it needs to do.',
    tags: 'Strategy / Custom design / Development / WordPress',
    price: 'FROM $1,200 · FIXED QUOTE',
    link: 'Discuss a new website',
    need: 'A new website',
  },
  {
    topic: 'Website review',
    title: 'START WITH A WEBSITE REVIEW.',
    intro: 'A clear set of priorities before you commit to a bigger change.',
    detail:
      'A scoped professional review of your message, navigation and customer journey, with written recommendations. We agree on the pages, testing depth, deliverable and fee before work begins.',
    tags: 'Agreed scope / Prioritized recommendations / Agreed fee',
    price: 'FEE AGREED BEFORE WE START',
    link: 'Ask about a website review',
    need: 'A website review',
  },
];

export const steps = [
  { n: '01', title: 'CLARIFY', body: 'Understand your business, customers, and the next action.' },
  { n: '02', title: 'CREATE', body: 'Shape the message, design, and working website.' },
  { n: '03', title: 'DELIVER', body: 'Test, refine, and hand off a dependable result.' },
];

// Questions are phrased the way a visitor would ask them; answers are the studio's.
export const faq = [
  {
    q: 'Is this going to turn into a hard sell?',
    a: 'No. Tell us what’s going on and we’ll tell you honestly whether we can help. If a different fix suits you better, we’ll say so.',
  },
  {
    q: 'Do I actually need a whole new website?',
    a: 'Maybe not. You may need a clearer message, a simpler route through the pages, or a few technical fixes. We start with what is getting in the way. A scoped review can set priorities before you commit to a bigger project, and we agree on its scope and fee first.',
  },
  {
    q: 'How long does a website take?',
    a: 'A typical website takes about a week of build time once your content and approvals are in. Larger or more custom projects take longer. You’ll have a timeline before paid work starts.',
  },
  {
    q: 'What will it cost?',
    a: 'Most small-business websites start at $1,200. Where yours lands depends on the number of pages, the content and how custom the build needs to be. After a short call we quote a fixed price, so you know the cost, scope and timing before paid work starts. No hourly meter.',
  },
  {
    q: 'Do you only work with Northwest Ohio businesses?',
    a: 'No. We’re based in Tiffin and love working with businesses around Northwest Ohio, where we can meet in person. Plenty of projects happen entirely by phone and video, wherever you are.',
  },
  {
    q: 'What if I don’t know what to ask for?',
    a: 'You don’t need a technical brief. Tell us what your business does, what customers struggle to find or understand, and what you wish worked better. That is enough to begin a useful conversation.',
  },
  {
    q: 'Will I be able to update the website myself?',
    a: 'That’s decided before the build. WordPress suits regular content updates; a custom frontend suits a more specialized experience. We’ll talk through what you need to change, who will handle it, and what support you want.',
  },
  {
    q: 'What happens after I get in touch?',
    a: 'We read your message and reply by email. We start with your goals and your current situation. If there’s a useful way to work together, we discuss scope, timing and cost before paid work starts. You see exactly what will be sent before anything goes out.',
  },
];

/* ---------------------------------------------------------------------------
   StoryBrand layer. The visitor is the hero; the studio is the guide; Chip is
   the studio's mascot and narrates. Chip speaks as himself ("I"), which is a
   character voice, not the studio's.
--------------------------------------------------------------------------- */

// The problem, three ways: what visitors do, how it feels, why it matters.
export const problems = [
  {
    tag: 'WHAT HAPPENS',
    title: 'Visitors can’t tell what you do.',
    body: 'If it takes more than a few seconds to understand what you offer, people move on and choose someone who explained it faster.',
  },
  {
    tag: 'HOW IT FEELS',
    title: 'You hesitate to share the link.',
    body: 'You know it’s out of date. So you apologize for it before sending it, or you don’t send it at all.',
  },
  {
    tag: 'WHAT IT COSTS',
    title: 'The next step is a guessing game.',
    body: 'Call, email, fill something out? When the next step isn’t obvious, interested people quietly drift away.',
  },
];

// Authority, using only facts that already appear elsewhere on the site.
export const proof = [
  { n: '8', label: 'Projects documented, each labeled live, commissioned, approved or concept' },
  { n: '156', label: 'Weekly editions our founder shipped on print deadlines' },
  { n: '2', label: 'Ways to build: a custom frontend or WordPress, chosen for the job' },
  { n: '1', label: 'Fixed quote before any paid work starts' },
];

// The agreement: what a client can count on.
export const promises = [
  { title: 'A fixed price, agreed first.', body: 'You’ll know the cost, scope and timing before paid work starts.' },
  { title: 'You approve what goes out.', body: 'You see exactly what will be published before anything goes live.' },
  { title: 'A plan for after launch.', body: 'Content, hosting, updates and support are agreed before the build, not discovered after it.' },
];

// Stakes: the two ways this goes.
export const stakes = {
  stay: [
    'Visitors keep guessing what you do.',
    'Good leads choose whoever explains it faster.',
    'You keep apologizing for the link.',
    'Updating the site stays a chore nobody owns.',
  ],
  change: [
    'People understand your offer in seconds.',
    'The right customers reach out, ready to talk.',
    'You share your website with confidence.',
    'You know exactly how to keep it current.',
  ],
};

// Chip's one-liners, keyed by each section's data-guide attribute.
export const guideLines = {
  default: { pose: 'idle', text: 'I’m Chip. Five of my friends are hiding on this page. Just saying.' },
  problem: { pose: 'think', text: 'It sounds like your website is underselling you. Most good businesses have this problem. It’s fixable.' },
  guide: { pose: 'point', text: 'These are real numbers and real quotes. No made-up stats here.' },
  work: { pose: 'point', text: 'Open any file. Every project says exactly what it is.' },
  plan: { pose: 'walk', text: 'Here’s the plan. Three steps, no mystery handoff.' },
  services: { pose: 'idle', text: 'Seems like you might not know where to start yet. That’s normal. The scorecard is free.' },
  stakes: { pose: 'think', text: 'Two ways this can go. I’m rooting for the column on the right.' },
  audit: { pose: 'wow', text: 'It seems weird to say this stuff out loud. That’s exactly why we do.' },
  about: { pose: 'wave', text: 'That’s Adam. He started the studio. I just live here.' },
  faq: { pose: 'idle', text: 'Sounds like you’ve still got questions. Good. If yours isn’t here, just ask.' },
};

// The awkward part (Chris Voss's "accusation audit"): name the visitor's worries
// before they have to. Answers only repeat promises made elsewhere on the site.
export const audit = [
  {
    thought: 'This is going to cost more than I planned.',
    answer: 'Fair worry. That’s why the price is fixed and agreed before any paid work starts. If it doesn’t fit, you find out early.',
  },
  {
    thought: 'They’ll talk me into a whole new website I don’t need.',
    answer: 'You might not need one. Sometimes the fix is a clearer message or a simpler route through the pages. A scoped review can set priorities first.',
  },
  {
    thought: 'I’ll be stuck calling them every time I need a typo fixed.',
    answer: 'Who updates the site, and how, is decided before the build. Not discovered after it.',
  },
  {
    thought: 'This will drag on for months.',
    answer: 'A typical website takes about a week of build time once content and approvals are in. You’ll have a timeline before paid work starts.',
  },
  {
    thought: 'A studio with a cartoon mascot can’t be serious.',
    answer: 'Strategy in the thinking. Character in the details. Chip makes the site memorable. The plan behind it is all business.',
  },
];

// Project starter form options.
export const starter = {
  needs: ['Improve my current website', 'A new website', 'A website review', 'Not sure yet'],
  budgets: ['Not sure yet', 'Under $2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000+'],
  timelines: ['Not sure yet', 'As soon as possible', 'In the next 1–3 months', 'Just exploring'],
  next: [
    'We read your message and reply by email.',
    'We talk through your goals and what’s happening on your current site.',
    'If there’s a useful way to work together, you get scope, timing and a fixed price before any paid work starts.',
  ],
};
