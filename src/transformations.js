// Before / after. Each "before" is the business's own website as we found it
// (captured October 2026, or from the Internet Archive where noted). Each "after"
// is our redesign. Statuses stay exact: a concept is never presented as a client
// project, and no traffic, booking or revenue result is claimed for any of them.

const B = '/assets/work/ba/';

export const transformations = [
  {
    id: 'pioneer-mill',
    project: 'pioneer-mill',
    name: 'Pioneer Mill',
    place: 'Tiffin,\u00a0Ohio',
    sector: 'Destination dining',
    status: 'Redesign concept · not commissioned',
    kind: 'concept',
    before: { src: B + 'pioneer-before', alt: 'Pioneer Mill’s current homepage: the restaurant name over a dining-room photo, a row of links, and a large photo of a steak under “View Our New Menu”', note: 'Their current site, captured October 2026' },
    after: { src: B + 'pioneer-after', alt: 'Our Pioneer Mill redesign: “Gather at the Mill” over guests at a table, with Reserve a table and Full menu buttons and a visit-planning bar', note: 'Our custom WordPress concept' },
    url: 'https://pioneermill.adamthomasjanes.com/',
    linkLabel: 'EXPLORE THE LIVE CONCEPT',
    headline: 'Sell the evening, not the entrée.',
    inTheWay: [
      'The first thing you see is one plate of food. Nothing says why a 200-year-old mill is worth the drive.',
      'Reservations, the menu, banquets and history all sit in one row, with the same weight.',
      'The building’s story, the real reason people come, is a link away.',
    ],
    moves: [
      { did: 'Opened on people at the table and one line: “Gather at the Mill.”', why: 'Destination dining is chosen for the night out. Show the night out.' },
      { did: 'Put Reserve a table and View the full menu right under the headline.', why: 'Those are the two jobs almost every visitor arrives with.' },
      { did: 'Added a planning bar: your visit, dining spaces, directions, private gatherings.', why: 'Practical questions get answered without hunting through menus.' },
    ],
  },
  {
    id: 'crush',
    project: 'crush',
    name: 'Crush Wine Bar',
    place: 'Sandusky,\u00a0Ohio',
    sector: 'Wine bar & restaurant',
    status: 'Design sold & approved · build pending',
    kind: 'approved',
    before: { src: B + 'crush-before', alt: 'Crush Wine Bar’s previous homepage: a logo over a wine-cork photo, a row of links and a “Welcome…” paragraph', note: 'Their site, Internet Archive capture, July 2026' },
    after: { src: B + 'crush-after', alt: 'Our Crush redesign: the storefront on a summer evening and the line “Date night, dinner with friends, or one more glass.”', note: 'Our client-approved design' },
    url: 'https://adamthomasjanes.com/crush/',
    linkLabel: 'SEE THE APPROVED DESIGN',
    headline: 'Plan the night before you get there.',
    inTheWay: [
      'The page opens with “Welcome…”, which tells a guest nothing they came to find out.',
      'Corks and close-ups don’t show the room, the patio or the street it sits on.',
      'Careers gets the same billing as Book a Table.',
    ],
    moves: [
      { did: 'Led with the reasons people actually come: date night, dinner with friends, one more glass.', why: 'People pick a wine bar for the evening they’re planning.' },
      { did: 'Kept the phone, the full menu and Reserve a table in the header on every page.', why: 'Those are the three things a guest needs at 6 p.m.' },
      { did: 'Designed a staff dashboard for posting menus, events and notices.', why: 'A restaurant site is only useful if the team can keep it current.' },
    ],
  },
  {
    id: 'aquablast',
    project: 'aquablast',
    name: 'AquaBlast',
    place: 'Marblehead,\u00a0Ohio',
    sector: 'Exterior cleaning',
    status: 'Redesign concept · not commissioned',
    kind: 'concept',
    before: { src: B + 'aquablast-before', alt: 'AquaBlast’s current homepage: a work truck parked by a house with “Quality is everything!” and a Request a Free Estimate button', note: 'Their current site, captured October 2026' },
    after: { src: B + 'aquablast-after', alt: 'Our AquaBlast redesign: “Your property should look cared for.” beside a technician washing a house, with Get an estimate and See what we clean buttons', note: 'Our interactive concept' },
    url: 'https://adamthomasjanes.com/aquablast/',
    linkLabel: 'TRY THE INTERACTIVE DEMO',
    headline: 'Start with the customer’s house, not the truck.',
    inTheWay: [
      '“Quality is everything!” could be on any company’s homepage.',
      'The photo shows the truck, not a clean house.',
      'The services sit in a dropdown, so people have to guess what to ask for. (The phone and estimate buttons were already easy to find. We kept that.)',
    ],
    moves: [
      { did: 'Wrote the headline about the customer’s property: “Your property should look cared for.”', why: 'People buy the result, not the equipment.' },
      { did: 'Added “Start with what needs attention,” a chooser for house, roof, concrete and more.', why: 'Customers know their problem, not the service names.' },
      { did: 'Put real before-and-after work right next to the estimate button.', why: 'Proof belongs where the decision gets made.' },
    ],
  },
  {
    id: 'debacco',
    project: 'debacco-mancinetti',
    name: 'DeBacco | Mancinetti',
    place: 'Port Clinton,\u00a0Ohio',
    sector: 'Criminal defense',
    status: 'Redesign concept · not commissioned',
    kind: 'concept',
    before: { src: B + 'debacco-before', alt: 'DeBacco Mancinetti’s current homepage: the logo, a cropped photo of an attorney, the logo again, and small italic paragraphs', note: 'Their current site, captured October 2026' },
    after: { src: B + 'debacco-after', alt: 'Our DeBacco Mancinetti redesign: the firm name, “Your future deserves a serious defense,” and a Discuss your situation button', note: 'Our design concept' },
    url: 'https://adamthomasjanes.com/debacco-mancinetti/',
    linkLabel: 'VIEW THE DESIGN CONCEPT',
    headline: 'When someone is scared, say it plainly.',
    inTheWay: [
      'The logo appears twice before a single sentence about what the firm does.',
      'The strongest facts (criminal defense, decades in court) are in small grey italics.',
      'There’s no clear next step on the first screen, and the phone number isn’t in the header.',
    ],
    moves: [
      { did: 'Said it in one breath: criminal defense, exclusively, in Ottawa County and throughout Ohio.', why: 'Someone facing a charge needs to know in seconds they’re in the right place.' },
      { did: 'Put “Discuss your situation” and the phone up front, and explained what happens when you call.', why: 'A calm, specific next step makes calling a lawyer less frightening.' },
      { did: 'Gave the practice, the record and the people their own clear routes.', why: 'People check credibility at their own pace. Let them.' },
    ],
  },
  {
    id: 'joshua',
    project: 'joshua-janes',
    name: 'Joshua Janes',
    place: 'Illustrator',
    sector: 'Creative portfolio',
    status: 'Independent concept · built and live as a demo',
    kind: 'concept',
    before: { src: B + 'joshua-before', alt: 'Joshua Janes’s current portfolio homepage: a red “Artistic Flavors” sidebar listing categories like Light Arts, Dark Arts and Hordefy beside a six-image grid of his artwork', note: 'His current site, captured October 2026' },
    after: { src: B + 'joshua-after', alt: 'Our Joshua Janes portfolio: a spinning globe covered in his artwork with “I made a lot of stuff. Then I made more.”', note: 'Our built, interactive portfolio' },
    url: 'https://adamthomasjanes.com/joshuajanes/',
    linkLabel: 'EXPLORE THE LIVE EXPERIENCE',
    headline: 'Show the range in one look.',
    inTheWay: [
      'A category sidebar — Light Arts, Dark Arts, T-shirt Art, Books — sits in low-contrast red-on-red text that’s easy to miss.',
      'You only see six pieces at a time. To see more you have to pick a flavor first; there’s no way to take in the whole archive at once.',
      'Nothing on the page signals the scale of the work. A plain grid undersells someone who has made this much.',
    ],
    moves: [
      { did: 'Wrapped the archive around an interactive globe you can spin.', why: 'The volume of work becomes the first impression.' },
      { did: 'Wrote it in Joshua’s voice: “I made a lot of stuff. Then I made more.”', why: 'An artist’s site should sound like the artist.' },
      { did: 'Kept named sections and a project carousel next to the playful part.', why: 'Exploring is fun. Getting lost isn’t.' },
    ],
  },
];

/** The work we were hired for. These open the full case-study sheet. */
export const clientWork = ['jt-auto', 'ams-mystical-treasures', 'camp-perry'];
