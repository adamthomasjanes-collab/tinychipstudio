// Independent concepts: portfolio evidence, not commissioned launches.
const B = '/assets/work/ba/';
const shot = (id, side) => ({
  src: `${B}${id}-${side}.webp`,
  srcSet: `${B}${id}-${side}-768.webp 768w, ${B}${id}-${side}.webp 1280w`,
  size: [1280, 720],
});

// Supplied source captures stay at their original dimensions: they are the
// record of the comparison, not an art-directed crop made for this portfolio.
const officialScreenshot = (file) => ({
  src: `${B}${file}.png`,
  size: [1920, 1080],
});

export const additionalConcepts = [
  {
    id: 'experience-the-peninsula', number: '11', name: 'Experience the Peninsula',
    place: 'Port Clinton, Ohio', sector: 'Group outings & destination planning',
    color: '#d9d0b9', url: 'https://adamthomasjanes.com/experience/site/',
    headline: 'Help a group imagine the day, then start planning it.',
    summary: 'A destination-planning concept for Kristina Tilson, connecting Lake Erie experiences, local knowledge and a group’s first itinerary ideas.',
    contribution: 'Art direction, identity refinement, content structure and responsive frontend development, including an interactive outing builder and a planning handoff.',
    disciplines: ['Destination storytelling', 'Interactive planning', 'Frontend development'],
    beforeAlt: 'Experience the Peninsula’s existing homepage with a large badge, three columns of planning information and a group-photo carousel',
    afterAlt: 'Experience the Peninsula concept with “Lake Erie, by arrangement”, a Marblehead Lighthouse photograph and a Start a group plan action',
    beforeNote: 'Existing website · captured October 17, 2026',
    inTheWay: [
      'The existing opening presents several messages at once, making the starting point harder to pick out.',
      'Outings, local partners and group requirements need a connected route into planning.',
      'A group organizer needs a way to gather ideas before making an inquiry.',
    ],
    decisions: [
      { label: 'Place', question: 'What kind of day could we have?', title: 'Start with the destination.',
        explanation: 'The opening gives Lake Erie a recognizable sense of place before introducing the planning service.',
        implementation: '“Lake Erie, by arrangement” pairs lighthouse imagery with a concise explanation of Kristina’s role.',
        did: 'Built the opening around Lake Erie and a clear group-planning invitation.', why: 'Organizers can picture the destination and understand the service together.' },
      { label: 'Exploration', question: 'What would suit our group?', title: 'Connect inspiration to useful choices.',
        explanation: 'Experience, group and peninsula pages offer different ways to explore the same destination.',
        implementation: 'Named routes connect outings, local places, partners and a sample itinerary.',
        did: 'Gave experiences, group types and local places clear routes.', why: 'Different organizers can explore through the question they already have.' },
      { label: 'Planning', question: 'How do we turn ideas into an inquiry?', title: 'Let visitors sketch a day.',
        explanation: 'An outing builder collects initial choices without pretending that a trip has been booked.',
        implementation: 'A sample Day Sheet carries choices into a planner with review, copy, download and email-handoff options. The concept has no submission backend.',
        did: 'Connected an interactive Day Sheet to the planning form.', why: 'The first conversation can begin with the group’s own ideas.' },
    ],
    gallery: [
      { ...shot('peninsula', 'planner'), alt: 'Experience the Peninsula concept planning form and group-outing handoff', caption: 'Concept · group planning and inquiry preparation' },
    ],
    note: 'Independent concept prepared for Kristina Tilson. Not an approved business launch or a booking service. Planning and inquiry tools demonstrate the proposed experience; no travel bookings, submissions or business results are claimed. Destination imagery is illustrative of place, not evidence of a commissioned trip.',
    asset: 'peninsula',
  },
  {
    id: 'cutters', number: '12', name: 'Cutter’s', place: 'Port Clinton, Ohio',
    sector: 'Tree care & land management', color: '#dfb477',
    url: 'https://adamthomasjanes.com/hondo/',
    headline: 'Show the work. Make asking about the job straightforward.',
    summary: 'A tree-care and land-management concept prepared for Hondo, built around equipment, job footage and clear routes to discuss a property.',
    contribution: 'Website strategy, content organization, visual design and responsive frontend development, with service pages, a media gallery and estimate-request preparation.',
    disciplines: ['Service architecture', 'Project media', 'Frontend development'],
    beforeAlt: 'Cutter’s existing GoDaddy homepage with its chainsaw logo behind the tree-removal heading and company information below',
    afterAlt: 'Cutter’s concept with “When it has to come down”, a bucket-truck photograph, a free-estimate action and a Watch the work link',
    beforeNote: 'Existing GoDaddy website · archived October 2026 screenshot',
    inTheWay: [
      'The existing site contains useful work imagery, but service information and contact paths compete across a long page.',
      'A homeowner needs to recognize the right service before reading the entire company story.',
      'Job photographs and recordings need context alongside the next action.',
    ],
    decisions: [
      { label: 'Message', question: 'Can you help with this tree or property?', title: 'Make the work recognizable.',
        explanation: 'The opening connects the customer’s concern with real equipment and a direct service introduction.',
        implementation: '“When it has to come down” sits beside a bucket-truck photograph and links to service information.',
        did: 'Paired a direct headline with existing equipment photography.', why: 'Visitors can recognize the type of work before they ask for an estimate.' },
      { label: 'Evidence', question: 'What does the work look like?', title: 'Make the media useful.',
        explanation: 'A browsable gallery and job recordings provide detail beyond the opening photograph.',
        implementation: 'The concept includes gallery filters, accessible media dialogs and recordings loaded on interaction. Its internal property-comparison pair remains unverified.',
        did: 'Organized photographs and job recordings into a browsable work section.', why: 'People can inspect the work relevant to their concern.' },
      { label: 'Inquiry', question: 'How do I ask about my property?', title: 'Keep the first conversation practical.',
        explanation: 'Call, text and estimate-preparation paths give visitors a clear way to describe the job.',
        implementation: 'A validated form prepares a request to copy and share. It does not transmit messages, accept uploads or book appointments.',
        did: 'Connected service pages to call, text and estimate-preparation options.', why: 'The next step matches the information a property owner can provide.' },
    ],
    gallery: [
      { ...shot('cutters', 'work'), alt: 'Cutter’s concept work gallery with project imagery and media choices', caption: 'Concept · browsable work and media gallery' },
    ],
    note: 'Independent concept prepared for Hondo, not a commissioned or approved business launch. The original business website remains separate. The estimate form prepares a request without delivering it; no booking, traffic or revenue results are claimed. The concept’s property-comparison images are not presented here as verified before-and-after job evidence.',
    asset: 'cutters',
  },
  {
    id: 'flashback-dj', number: '13', name: 'Flashback DJ Entertainment', place: 'Port Clinton, Ohio',
    sector: 'DJ & event entertainment', color: '#ef64c3',
    url: 'https://adamthomasjanes.com/flashback/',
    headline: 'Make the night easy to picture, then easy to ask about.',
    summary: 'A DJ and event-entertainment concept for Josh O’Lalde’s Flashback, built like a mixtape: real event photography, the listed rates, and simple ways to start a conversation about a date.',
    contribution: 'Art direction built from the existing logo, content strategy, conversion copy and responsive frontend development, with a two-sided inquiry form, a price mixer, a venue-night calculator and a free song planner.',
    disciplines: ['Identity extension', 'Conversion tools', 'Frontend development'],
    beforeAlt: 'Flashback’s existing Wix homepage with a navigation bar, a row of underlined event types, the pink FLASHBACK logo with its DJ character, and a black area below the tagline',
    afterAlt: 'Flashback concept with “The nights you remember start here.”, real event photographs as tilted prints, and a quick ask for the occasion and date',
    beforeNote: 'Existing Wix website · official supplied screenshot',
    screenshots: {
      before: officialScreenshot('flashback-official-before'),
      after: officialScreenshot('flashback-official-after'),
    },
    inTheWay: [
      'The logo and personality are strong, but the opening shows the logo, a tagline and a lot of empty black before it says what Flashback does or how to book it.',
      'Weddings, private parties and bar or venue nights each need different information, and they share one path.',
      'Prices are listed on the site, but a visitor has to add up services and night lengths in their head.',
    ],
    decisions: [
      { label: 'Message', question: 'Is this the right DJ for our night?', title: 'Say what it is in the first screen.',
        explanation: 'The opening keeps Flashback’s pink-and-cyan identity and states the offer plainly: wedding, party and venue DJ from Port Clinton.',
        implementation: '“The nights you remember start here.” sits beside real event photographs, with a one-line description of the services and a quick ask for the occasion and date.',
        did: 'Built the opening from the existing logo colors, real event photos and a plain description of the services.', why: 'Visitors know what Flashback offers before they scroll.' },
      { label: 'Price', question: 'What will this cost?', title: 'Let people do the math themselves.',
        explanation: 'The listed rates become tools a visitor can use instead of a table to decode.',
        implementation: 'A price mixer adds up listed services with faders and channel lights; a venue-night calculator prices hours and karaoke and prints a rate card. DJ time is shown as quoted, not invented.',
        did: 'Turned the published rates into a mixer and a venue-night calculator.', why: 'The price question gets answered before it becomes a reason not to ask.' },
      { label: 'Inquiry', question: 'How do I ask about our date?', title: 'Make the first ask feel small.',
        explanation: 'A two-sided cassette J-card asks about the night first and the person second, and plays the answers back before anything is sent.',
        implementation: 'The form saves drafts on the device, takes a phone number or an email, and can attach a free Mixtape song list. Without an endpoint it prepares a text message to Josh and says plainly that nothing has been sent.',
        did: 'Designed a two-step inquiry with a summary and a free song planner that rides along.', why: 'Couples and venue owners can start with what they already know.' },
    ],
    gallery: [
      { ...officialScreenshot('flashback-official-before'), alt: 'Official screenshot of Flashback DJ Entertainment’s existing Wix page with the Flashback DJ Entertainment logo, event links and 2026 dates', caption: 'Official existing-site screenshot · supplied by the studio' },
      { ...shot('flashback', 'mixer'), alt: 'Flashback concept price mixer with channel faders for DJ, sound, ceremony sound, photos, video and officiant, and a listed-rates total', caption: 'Concept · price mixer built from the listed rates' },
      { ...shot('flashback', 'mixtape'), alt: 'Flashback concept Mixtape Planner opening with “Make the mixtape for your night.” beside the Flashback DJ illustration', caption: 'Concept · free song planner that attaches to the inquiry' },
    ],
    note: 'Independent concept prepared for Flashback DJ Entertainment, not a commissioned or approved business launch. The original business website remains separate. Rates shown in the concept come from the existing site and still need the owner’s confirmation. The inquiry form prepares a message without sending it; no bookings, traffic or revenue results are claimed.',
    asset: 'flashback',
  },
].map((p) => {
  const after = p.screenshots?.after ?? shot(p.asset, 'after');
  return {
    ...p, kind: 'concept', type: 'INDEPENDENT CONCEPT', status: 'Independent concept · Not a business launch',
    image: after.src, srcSet: after.srcSet,
    imageSize: after.size, alt: p.afterAlt, linkLabel: 'EXPLORE THE DESIGN CONCEPT',
  };
});

export const additionalComparisons = additionalConcepts.map((p) => ({
  id: p.id, project: p.id, name: p.name, place: p.place, sector: p.sector,
  kind: p.kind, status: p.status, headline: p.headline, url: p.url, linkLabel: p.linkLabel,
  before: { ...(p.screenshots?.before ?? shot(p.asset, 'before')), alt: p.beforeAlt, note: p.beforeNote },
  after: { ...(p.screenshots?.after ?? shot(p.asset, 'after')), alt: p.afterAlt, note: p.screenshots ? 'Our independent design concept · official supplied screenshot' : 'Our independent design concept' },
  inTheWay: p.inTheWay,
  moves: p.decisions.map(({ did, why }) => ({ did, why })),
}));
