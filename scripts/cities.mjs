// Builds the city landing pages: public/<slug>/index.html.
// Run: npm run cities   (also runs automatically before every build)
//
// Edit the copy in CITIES below, not the generated HTML. Each page has its own
// intro, audiences, nearby work and questions so they read as real local pages,
// not one template with the town name swapped. Statuses on work cards stay exact:
// concepts are labeled as concepts, and no results are claimed.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tidy, names } from '../src/lib/nbsp.js';
import { AREAS } from '../src/areas.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://tinychipstudio.com';
const PHONE = '419-341-8519';
const TEL = '+14193418519';
const W = '/assets/work/';

/* ------------------------------------------------------------------ work */

const WORK = {
  'pioneer-mill': {
    name: 'Pioneer Mill', place: 'Tiffin', img: W + 'pioneer-hero.webp', kind: 'concept',
    status: 'Redesign concept · not commissioned',
    line: 'Sell the evening, not the entrée.',
    url: 'https://pioneermill.adamthomasjanes.com/', label: 'Explore the concept',
    alt: 'Pioneer Mill destination-dining website concept',
  },
  crush: {
    name: 'Crush Wine Bar', place: 'Sandusky', img: W + 'crush-hero.webp', kind: 'approved',
    status: 'Design sold & approved · build pending',
    line: 'Plan the night before you get there.',
    url: 'https://adamthomasjanes.com/crush/', label: 'See the approved design',
    alt: 'Crush Wine Bar client-approved hospitality website design',
  },
  aquablast: {
    name: 'AquaBlast', place: 'Marblehead', img: W + 'aquablast-hero.webp', kind: 'concept',
    status: 'Redesign concept · not commissioned',
    line: 'Start with the customer’s house, not the truck.',
    url: 'https://adamthomasjanes.com/aquablast/', label: 'Try the interactive demo',
    alt: 'AquaBlast exterior-cleaning website concept',
  },
  debacco: {
    name: 'DeBacco Mancinetti', place: 'Port Clinton', img: W + 'debacco-hero.webp', kind: 'concept',
    status: 'Redesign concept · not commissioned',
    line: 'When someone is scared, say it plainly.',
    url: 'https://adamthomasjanes.com/debacco-mancinetti/', label: 'View the design concept',
    alt: 'DeBacco Mancinetti legal-services website concept',
  },
  'camp-perry': {
    name: 'Camp Perry', place: 'Port Clinton', img: W + 'camp-perry-hero.webp', kind: 'hired',
    status: 'Hired work · 2018–2020, through InGenesis',
    line: 'One destination. Different reasons to visit.',
    url: 'https://cplcc.com/', label: 'View the current venue site',
    alt: 'Camp Perry Lodging and Conference Center website preview',
  },
  'jt-auto': {
    name: 'J&T Auto Service', place: 'Bowling Green', img: W + 'jt-hero.webp', kind: 'hired',
    status: 'Hired work · live website',
    line: 'Start with the driver. Not the diagnosis.',
    url: 'https://jtautobg.com/', label: 'Visit the live site',
    alt: 'J&T Auto Service website with a car-trouble headline and a Call J&T button',
  },
  ams: {
    name: 'AM’s Mystical Treasures', place: null, img: W + 'ams-hero.webp', kind: 'hired',
    status: 'Hired work · live website',
    line: 'An invitation to explore. A clear place to shop.',
    url: 'https://amsmysticaltreasuresllc.com/', label: 'Visit the live site',
    alt: 'AM’s Mystical Treasures collector’s gallery website',
  },
};

/* ---------------------------------------------------------------- cities */

const COST_FAQ = {
  q: 'What does a website cost?',
  a: 'Most small-business websites start at $1,200. After a short call we send a fixed quote in writing, so you know the cost, scope and timing before any paid work starts. No hourly meter.',
};

const CITIES = [
  {
    slug: 'tiffin',
    name: 'Tiffin',
    county: 'Seneca County',
    distance: 'Home base',
    title: 'Web Design in Tiffin, Ohio | Tiny Chip Studio',
    description:
      'Web design from a studio that’s actually in Tiffin. Tiny Chip Studio builds clear, fast websites for Tiffin and Seneca County businesses. Fixed quotes from $1,200.',
    subhead: 'The studio is here in Tiffin, so the first meeting can happen across a table instead of across a video call.',
    intro: [
      'Tiffin runs on word of mouth. Somebody’s cousin recommends you, then they look you up. What they find in the next ten seconds decides whether they call.',
      'Tiny Chip Studio is based in Tiffin and builds websites for Seneca County businesses: shops downtown, trades and home services, restaurants, nonprofits, and the businesses that keep two universities’ worth of students fed, housed and repaired. A clear message, fast on a phone, and an obvious next step.',
    ],
    audiences: [
      { t: 'Downtown shops & restaurants', d: 'Hours, menus and directions that are actually right, plus a reason to come in that isn’t just “we’re open.”' },
      { t: 'Trades & home services', d: 'Say what you fix, where you go and how to reach you, before the visitor goes back to the search results.' },
      { t: 'Nonprofits & community groups', d: 'Events, volunteers and donations in one place, set up so someone on your team can keep it current.' },
    ],
    work: ['pioneer-mill', 'jt-auto', 'camp-perry'],
    faq: [
      { q: 'Can we meet in person?', a: 'Yes. The studio is in Tiffin, so a sit-down meeting is easy. Phone and video work too, if that suits you better.' },
      { q: 'Our website is fine, just old. Do we need a new one?', a: 'Maybe not. Plenty of Tiffin businesses have a site that mostly works and has gone out of date. We start by finding what’s getting in the way. Sometimes that’s a few fixes, not a rebuild.' },
      COST_FAQ,
    ],
    nearby: ['fremont', 'findlay', 'sandusky', 'bowling-green'],
  },
  {
    slug: 'port-clinton',
    name: 'Port Clinton',
    county: 'Ottawa County',
    distance: 'Under an hour from the studio',
    title: 'Web Design in Port Clinton, Ohio | Tiny Chip Studio',
    description:
      'Web design for Port Clinton and Ottawa County: marinas, charters, rentals, restaurants and the trades that keep the lakeshore running. Fixed quotes from $1,200.',
    subhead: 'The season is short. Your website should be ready before the first ferry runs.',
    intro: [
      'Port Clinton businesses make most of their year in a few busy months, and visitors decide from a phone, usually from a hotel room or a dock. If they can’t find your hours, your rates or how to book, they book the next place down the shore.',
      'We build websites for Port Clinton and Ottawa County businesses that make the season easy: current hours, clear booking or calling, and pages that still give people a reason to plan ahead in February.',
    ],
    audiences: [
      { t: 'Marinas, charters & rentals', d: 'Rates, availability and booking up front. Nobody wants to send an email to ask whether the boat is free Saturday.' },
      { t: 'Restaurants & lodging', d: 'Menus, seasonal hours and directions a visitor can find in one tap, on a phone, with one bar of signal.' },
      { t: 'Trades & year-round services', d: 'The people who keep the lakeshore running need a website that works in January, not just July.' },
    ],
    work: ['camp-perry', 'debacco', 'aquablast'],
    proof: {
      id: 'camp-perry',
      label: 'We’ve already worked in Port Clinton',
      body: 'Camp Perry Lodging & Conference Center, on the lakeshore here in Port Clinton, hired us for the website, the identity, the maps and floor plans, the brochures and the guest emails. Lodging guests, wedding parties and conference organizers each got their own route through it. The venue has run the site themselves since.',
      meta: 'Commissioned through InGenesis · 2018–2020 · now managed by the client',
    },
    faq: [
      { q: 'Can a website handle the busy season and the slow months?', a: 'That gets planned from the start. Seasonal hours, events and rates get a place that’s easy to change, and the off-season pages give people a reason to book ahead.' },
      { q: 'Do you meet in Port Clinton?', a: 'Yes. The studio is in Tiffin, under an hour away, and we’re glad to come to you. Phone and video work too.' },
      COST_FAQ,
    ],
    nearby: ['sandusky', 'fremont', 'toledo', 'tiffin'],
  },
  {
    slug: 'sandusky',
    name: 'Sandusky',
    county: 'Erie County',
    distance: 'Under an hour from the studio',
    title: 'Web Design in Sandusky, Ohio | Tiny Chip Studio',
    description:
      'Web design for Sandusky and Erie County businesses that serve both locals and visitors. Clear, fast websites from Tiny Chip Studio. Fixed quotes from $1,200.',
    subhead: 'Plenty of people pass through Sandusky every summer. Your website is how the ones who’ve never heard of you decide to stop.',
    intro: [
      'Sandusky businesses serve two crowds: locals who’ve known you for years and visitors who found you ten minutes ago. Both are looking at a phone. One wants your hours. The other wants a reason to pick you over the place next door.',
      'Tiny Chip Studio builds websites for Sandusky and Erie County businesses that answer both: what you do, why you’re worth the stop, and the fastest way to call, book or get directions.',
    ],
    audiences: [
      { t: 'Restaurants & bars', d: 'Menus, events and a reserve button that’s easy to find at 6 p.m., when people are actually deciding.' },
      { t: 'Hospitality & attractions', d: 'Help visitors plan the trip before they arrive, not while they’re circling the block looking for parking.' },
      { t: 'Local services', d: 'Plain, trustworthy pages for the businesses Sandusky relies on year-round, long after the summer crowd heads home.' },
    ],
    work: ['crush', 'aquablast', 'camp-perry'],
    faq: [
      { q: 'We get a lot of first-time visitors. What matters most?', a: 'Answering the first questions fast: what you are, where you are, when you’re open and how to get in. Then a reason to choose you. We design the first screen around those.' },
      { q: 'Do you meet in Sandusky?', a: 'Yes. The studio is in Tiffin, under an hour away. In person, by phone or by video, whichever is easier for you.' },
      COST_FAQ,
    ],
    nearby: ['port-clinton', 'fremont', 'tiffin', 'toledo'],
  },
  {
    slug: 'bowling-green',
    name: 'Bowling Green',
    county: 'Wood County',
    distance: 'Under an hour from the studio',
    title: 'Web Design in Bowling Green, Ohio | Tiny Chip Studio',
    description:
      'Web design for Bowling Green and Wood County businesses that serve longtime locals and BGSU students. Fixed quotes from $1,200, from Tiny Chip Studio.',
    subhead: 'A college town has two audiences. Your website has to talk to both.',
    intro: [
      'Bowling Green businesses serve families who’ve been here for generations and a new wave of Bowling Green State University students every August. The students search on their phones and don’t know where anything is yet. The locals already know you and just want your hours.',
      'We build websites for Bowling Green and Wood County businesses that work for both: services in plain words, real directions and a phone number one tap away. J&T Auto Service on Bishop Road is one of ours.',
    ],
    audiences: [
      { t: 'Auto, repair & home services', d: 'Start with the customer’s problem, not your service menu. People know what’s wrong. They don’t always know what it’s called.' },
      { t: 'Shops & restaurants near campus', d: 'Hours, menus and directions written for someone who moved here last week and doesn’t know which side of town you’re on.' },
      { t: 'Professional services', d: 'Show who you are and how to reach you, plainly, so new residents can choose you with confidence.' },
    ],
    work: ['jt-auto', 'ams', 'pioneer-mill'],
    proof: {
      id: 'jt-auto',
      label: 'We built the site for a shop on Bishop Road',
      body: 'J&T Auto Service of BG hired us to design and build their website. It starts with what the driver noticed, not what the part is called, puts the services one tap away, and makes calling the obvious next step. There’s a page written for BGSU students, too.',
      quote: { text: 'I like the colors and it’ll be helpful to my customers.', by: 'Jeremy, J&T Auto Service' },
      meta: 'Hired work · live website',
    },
    faq: [
      { q: 'Do you work with businesses that serve BGSU students?', a: 'Yes. J&T Auto Service has a page written just for students, covering what to do when you’re new in town and the car starts making a noise. We think about who’s new and what they don’t know yet.' },
      { q: 'Do you meet in Bowling Green?', a: 'Yes. We’ve already built for a Bowling Green business, and it’s under an hour from the studio in Tiffin.' },
      COST_FAQ,
    ],
    nearby: ['toledo', 'findlay', 'fremont', 'tiffin'],
  },
  {
    slug: 'toledo',
    name: 'Toledo',
    county: 'Lucas County',
    distance: 'About an hour from the studio',
    title: 'Web Design for Toledo, Ohio Businesses | Tiny Chip Studio',
    description:
      'A small web design studio for Toledo and Lucas County businesses: talk directly to the person building your site, with one fixed quote from $1,200.',
    subhead: 'A small studio for Toledo businesses that want the person they hire to be the person doing the work.',
    intro: [
      'Toledo has plenty of agencies, and some of them are great. If you’d rather talk directly to the person designing and building your site, with one fixed price and no account manager in the middle, that’s how we work.',
      'Tiny Chip Studio builds websites for Toledo and Lucas County businesses: service companies, shops, restaurants and professional practices. A clear message, fast on a phone, and a next step people can see.',
    ],
    audiences: [
      { t: 'Service businesses', d: 'Say what you do and where you go in the first screen, so the visitor doesn’t have to scroll to find out if you’re a fit.' },
      { t: 'Professional practices', d: 'Law, health, finance and consulting: a calm, credible site that explains who you help and what happens when they call.' },
      { t: 'Restaurants & retail', d: 'Menus, hours, events and directions that are right today, and easy for your team to keep right tomorrow.' },
    ],
    work: ['jt-auto', 'crush', 'ams'],
    faq: [
      { q: 'Why hire a Tiffin studio instead of a Toledo agency?', a: 'You might not need to. But if you want one fixed quote, direct contact with the person building your site, and about a week of build time once content is in, it’s worth a conversation.' },
      { q: 'Do you meet in Toledo?', a: 'Yes, by arrangement. Toledo is about an hour from the studio in Tiffin. Most check-ins happen by phone or video, and we’re glad to meet in person when it helps.' },
      COST_FAQ,
    ],
    nearby: ['bowling-green', 'fremont', 'port-clinton', 'findlay'],
  },
  {
    slug: 'findlay',
    name: 'Findlay',
    county: 'Hancock County',
    distance: 'Under an hour from the studio',
    title: 'Web Design in Findlay, Ohio | Tiny Chip Studio',
    description:
      'Web design for Findlay and Hancock County businesses, from industrial services to downtown shops. Clear, fast websites with fixed quotes from $1,200.',
    subhead: 'Findlay customers find you the way everyone does now: a search, a phone and about ten seconds.',
    intro: [
      'Findlay has a busy mix of manufacturing, industrial services, downtown shops, restaurants and the University of Findlay. Whatever your customers come for, they’re deciding on a phone screen whether you look like the right call.',
      'Tiny Chip Studio builds websites for Findlay and Hancock County businesses that make that decision easy: say what you do, show why you can be trusted, and put the next step where people can see it.',
    ],
    audiences: [
      { t: 'Trades & industrial services', d: 'Show capabilities and service areas clearly enough that a purchasing manager or a homeowner can tell you’re a fit.' },
      { t: 'Downtown shops & restaurants', d: 'Give people a reason to come downtown, and make the hours and parking easy to find once they’ve decided to.' },
      { t: 'Professional services', d: 'A credible, plainspoken site that explains what you do and what happens after someone gets in touch.' },
    ],
    work: ['jt-auto', 'pioneer-mill', 'ams'],
    faq: [
      { q: 'Our customers are other businesses. Does that change the website?', a: 'Yes. Business buyers want capabilities, proof and a clear contact path, often so they can pass it to someone else for approval. We structure the site around how that decision actually gets made.' },
      { q: 'Do you meet in Findlay?', a: 'Yes. Findlay is under an hour from the studio in Tiffin. Phone and video work too.' },
      COST_FAQ,
    ],
    nearby: ['tiffin', 'bowling-green', 'fremont', 'toledo'],
  },
  {
    slug: 'fremont',
    name: 'Fremont',
    county: 'Sandusky County',
    distance: 'About half an hour from the studio',
    title: 'Web Design in Fremont, Ohio | Tiny Chip Studio',
    description:
      'Web design for Fremont and Sandusky County businesses from a studio half an hour away in Tiffin. Clear, fast websites with fixed quotes from $1,200.',
    subhead: 'Fremont is close enough that we can see your business in person before we design a thing.',
    intro: [
      'Fremont businesses depend on neighbors and on people passing through on the way to the lake. Both look you up before they stop. A site that’s clear and quick on a phone turns that search into a visit.',
      'We build websites for Fremont and Sandusky County businesses: local services, restaurants, retailers, and the organizations that make Fremont a place people want to stay a while.',
    ],
    audiences: [
      { t: 'Local services', d: 'What you do, the towns you cover and how to reach you, all on the first screen and all readable on a phone.' },
      { t: 'Restaurants & retail', d: 'Catch the people passing through with hours, directions and one good reason to pull off the road.' },
      { t: 'Community organizations', d: 'Events, history and ways to get involved, set up so the people running things can keep them current.' },
    ],
    work: ['pioneer-mill', 'crush', 'jt-auto'],
    faq: [
      { q: 'Can you come see our business before designing?', a: 'Yes. Fremont is about half an hour from the studio in Tiffin, and seeing the place helps us describe it honestly.' },
      { q: 'We’re a small business. Is $1,200 a real starting price?', a: 'Yes. It covers a focused small-business website. More pages or a more custom build costs more, and you’ll see the fixed number before anything starts.' },
      COST_FAQ,
    ],
    nearby: ['tiffin', 'sandusky', 'port-clinton', 'toledo'],
  },
];

const BY_SLUG = Object.fromEntries(CITIES.map((c) => [c.slug, c]));

/* --------------------------------------------------------------- helpers */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Visible prose: house typography, then escape, with NBSP written as &nbsp; for readability. */
const t = (s) => esc(tidy(s)).replace(/ /g, '&nbsp;');
/** Visible labels and headings: proper nouns only. */
const n = (s) => esc(names(s)).replace(/ /g, '&nbsp;');
const json = (o) => JSON.stringify(o, null, 2).replace(/</g, '\\u003c');

/* -------------------------------------------------------------- template */

/** A band for a town where we have real hired work, shown above the rest. */
function proofBand(c) {
  const w = WORK[c.proof.id];
  return `
      <section class="block wrap proof" aria-labelledby="proof">
        <p class="tag">[ Local proof ]</p>
        <div class="proof-grid">
          <img src="${w.img}" alt="${esc(w.alt)}" width="1280" height="720" loading="lazy" decoding="async" />
          <div>
            <h2 id="proof">${t(c.proof.label)}</h2>
            <p>${t(c.proof.body)}</p>
${c.proof.quote ? `            <figure class="proof-quote">
              <blockquote>“${t(c.proof.quote.text)}”</blockquote>
              <figcaption>${n(c.proof.quote.by)}</figcaption>
            </figure>` : ''}
            <p class="proof-meta">${n(c.proof.meta)}</p>
            <a class="btn btn-ghost btn-sm" href="${w.url}" target="_blank" rel="noopener">${esc(w.label)} ↗<span class="skip"> (opens in a new tab)</span></a>
          </div>
        </div>
      </section>
`;
}

/** The same row of town links that the React footer renders. */
function areasRow(slug) {
  return AREAS.map(
    (a) =>
      `            <li>${a.slug === slug ? `<span aria-current="page">${n(a.name)}</span>` : `<a href="/${a.slug}/">${n(a.name)}</a>`}</li>`,
  ).join('\n');
}

function page(c) {
  const url = `${SITE}/${c.slug}/`;
  const others = CITIES.filter((x) => x.slug !== c.slug);
  const work = c.work.map((id) => WORK[id]);
  const nearby = c.nearby.map((s) => BY_SLUG[s]);

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Tiny Chip Studio', inLanguage: 'en-US' },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: c.title,
        description: c.description,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#studio` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: `Web design in ${c.name}`, item: url },
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#studio`,
        name: 'Tiny Chip Studio',
        url: `${SITE}/`,
        logo: `${SITE}/brand/app-icon.svg`,
        image: `${SITE}/og-image.png`,
        telephone: TEL,
        email: 'tinychipstudio@gmail.com',
        address: { '@type': 'PostalAddress', addressLocality: 'Tiffin', addressRegion: 'OH', postalCode: '44883', addressCountry: 'US' },
        areaServed: [
          { '@type': 'City', name: c.name, containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county}, Ohio` } },
          { '@type': 'AdministrativeArea', name: `${c.county}, Ohio` },
          ...others.map((o) => ({ '@type': 'City', name: o.name, containedInPlace: { '@type': 'State', name: 'Ohio' } })),
        ],
        founder: { '@type': 'Person', '@id': 'https://adamthomasjanes.com/#adam', name: 'Adam Thomas Janes' },
        priceRange: '$1,200 – $5,000',
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: c.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return `<!doctype html>
<!-- Generated by scripts/cities.mjs. Edit the copy there, then run: npm run cities -->
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b0d11" />
    <meta name="robots" content="index,follow,max-image-preview:large" />

    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Tiny Chip Studio" />
    <meta property="og:title" content="${esc(c.title)}" />
    <meta property="og:description" content="${esc(c.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(c.title)}" />
    <meta name="twitter:description" content="${esc(c.description)}" />
    <meta name="twitter:image" content="${SITE}/og-image.png" />

    <link rel="preload" href="/assets/fonts/barlow-condensed-bold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/assets/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin />

    <script type="application/ld+json">
${json(ld)}
    </script>

    <style>
      @font-face { font-family: Barlow; src: url(/assets/fonts/barlow-condensed-bold.woff2) format("woff2"); font-weight: 700; font-display: swap; }
      @font-face { font-family: Space; src: url(/assets/fonts/space-grotesk.woff2) format("woff2"); font-weight: 300 700; font-display: swap; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --ink: #0b0d11; --ink-2: #13161d; --paper: #f4f1e8;
        --muted: rgba(244, 241, 232, 0.68); --line: rgba(244, 241, 232, 0.12);
        --lime: #c7ff58; --pink: #ff69bd; --blue: #386bff;
        --display: Barlow, Impact, sans-serif; --body: Space, system-ui, sans-serif;
      }
      html { background: var(--ink); color: var(--paper); font: 17px/1.6 var(--body); -webkit-text-size-adjust: 100%; }
      body {
        min-height: 100dvh; display: flex; flex-direction: column;
        background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
        background-size: 48px 48px; background-position: -1px -1px;
        background-attachment: fixed;
      }
      body::before { content: ""; position: fixed; inset: 0; background: radial-gradient(ellipse at 50% 0%, transparent 0, var(--ink) 70%); pointer-events: none; z-index: -1; }
      a { color: var(--lime); }
      a:hover { color: var(--paper); }
      :focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
      .wrap { width: 100%; max-width: 1120px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
      .skip { position: absolute; left: -9999px; }
      .skip:focus { left: 16px; top: 16px; background: var(--lime); color: var(--ink); padding: 8px 14px; z-index: 10; }

      /* nav */
      .nav { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--line); background: var(--ink); }
      .nav .logo { display: block; line-height: 0; }
      .nav .logo img { height: 22px; width: auto; }
      .nav-right { display: flex; align-items: center; gap: 20px; }
      .nav-phone { color: var(--paper); text-decoration: none; font-size: .9rem; border-bottom: 2px solid var(--lime); }

      /* buttons */
      .btn { display: inline-block; padding: 14px 24px; border-radius: 60px; font: 700 .9rem/1.2 var(--body); text-decoration: none; letter-spacing: .02em; transition: transform .15s, box-shadow .15s, background .15s; }
      .btn-lime { background: var(--lime); color: var(--ink); box-shadow: 4px 5px 0 var(--blue); }
      .btn-lime:hover { background: var(--pink); color: var(--ink); transform: translate(-1px, -1px); box-shadow: 5px 6px 0 var(--blue); }
      .btn-ghost { border: 1.5px solid var(--line); color: var(--paper); }
      .btn-ghost:hover { border-color: var(--paper); color: var(--paper); }
      .btn-sm { padding: 10px 18px; font-size: .8rem; box-shadow: 3px 4px 0 var(--blue); }

      /* hero */
      .hero { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center; padding-top: 72px; padding-bottom: 56px; }
      .tag { font: 600 .78rem/1.4 var(--body); letter-spacing: .14em; text-transform: uppercase; color: var(--lime); margin-bottom: 18px; }
      h1 { font: 700 clamp(2.3rem, 7.4vw, 5rem)/.95 var(--display); text-transform: uppercase; letter-spacing: .01em; margin-bottom: 22px; }
      h1 em { font-style: normal; color: var(--lime); display: block; }
      .subhead { font-size: clamp(1.05rem, 2.2vw, 1.25rem); color: var(--muted); max-width: 36em; margin-bottom: 32px; }
      .cta-row { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
      .hero-card { width: 240px; background: var(--ink-2); border: 1px solid var(--line); border-radius: 14px; padding: 22px; text-align: center; box-shadow: 6px 7px 0 var(--pink); }
      .hero-card img { width: 120px; height: 120px; image-rendering: pixelated; margin: 0 auto 10px; display: block; }
      .hero-card strong { display: block; font: 700 1.3rem/1.1 var(--display); text-transform: uppercase; letter-spacing: .03em; }
      .hero-card span { display: block; font-size: .82rem; color: var(--muted); margin-top: 6px; }

      /* sections */
      section.block { padding-top: 56px; padding-bottom: 56px; border-top: 1px solid var(--line); }
      h2 { font: 700 clamp(1.9rem, 4.6vw, 3rem)/1 var(--display); text-transform: uppercase; letter-spacing: .02em; margin-bottom: 18px; }
      h2 em { font-style: normal; color: var(--lime); }
      .lead { max-width: 44em; }
      .lead p { color: var(--muted); font-size: 1.08rem; margin-bottom: 1.4em; }
      .lead p:first-child { color: var(--paper); font-size: 1.22rem; }

      .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
      .card { background: var(--ink-2); border: 1px solid var(--line); border-radius: 12px; padding: 24px; }
      .card h3 { font: 700 1.2rem/1.1 var(--display); text-transform: uppercase; letter-spacing: .04em; color: var(--lime); margin-bottom: 10px; }
      .card p { color: var(--muted); font-size: .95rem; }
      .card .price { display: block; margin-top: 14px; font-size: .74rem; letter-spacing: .12em; text-transform: uppercase; color: var(--paper); }

      .work { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
      .work article { background: var(--ink-2); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
      .work img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; display: block; border-bottom: 1px solid var(--line); }
      .work .body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
      .work h3 { font: 700 1.35rem/1.05 var(--display); text-transform: uppercase; letter-spacing: .03em; }
      .work .place { font-size: .8rem; color: var(--muted); margin: 2px 0 12px; }
      .work .line { font-size: .98rem; margin-bottom: 14px; }
      .status { align-self: flex-start; font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; border-radius: 40px; margin-bottom: 14px; border: 1px solid currentColor; }
      .status--hired { color: var(--lime); }
      .status--approved { color: var(--pink); }
      .status--concept { color: #a9b8ff; }
      .work .go { margin-top: auto; font-size: .85rem; font-weight: 700; text-decoration: none; }
      .work-note { margin-top: 18px; font-size: .82rem; color: var(--muted); max-width: 46em; }

      .steps { counter-reset: s; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; list-style: none; }
      .steps li { border-top: 3px solid var(--lime); padding-top: 16px; }
      .steps li::before { counter-increment: s; content: "0" counter(s); font: 700 2.2rem/1 var(--display); color: var(--lime); display: block; margin-bottom: 8px; }
      .steps strong { display: block; font: 700 1.2rem/1.1 var(--display); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; }
      .steps p { color: var(--muted); font-size: .95rem; }

      .faq { margin-top: 24px; max-width: 48em; }
      .faq details { border-bottom: 1px solid var(--line); }
      .faq summary { cursor: pointer; list-style: none; display: flex; justify-content: space-between; gap: 16px; padding: 18px 0; font-weight: 600; font-size: 1.05rem; }
      .faq summary::-webkit-details-marker { display: none; }
      .faq summary::after { content: "+"; color: var(--lime); font-size: 1.4rem; line-height: 1; }
      .faq details[open] summary::after { content: "–"; }
      .faq details p { color: var(--muted); padding-bottom: 20px; max-width: 42em; }

      .near { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
      .near a { border: 1px solid var(--line); border-radius: 40px; padding: 8px 16px; text-decoration: none; color: var(--paper); font-size: .9rem; }
      .near a:hover { border-color: var(--lime); color: var(--lime); }

      .close { text-align: center; padding-top: 72px; padding-bottom: 80px; border-top: 1px solid var(--line); }
      .close h2 { margin-bottom: 14px; }
      .close p { color: var(--muted); max-width: 32em; margin: 0 auto 28px; }
      .close .cta-row { justify-content: center; }

      /* local proof */
      .proof-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 32px; align-items: center; margin-top: 10px; }
      .proof-grid img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; border: 1px solid var(--line); border-radius: 12px; }
      .proof-grid h2 { font-size: clamp(1.6rem, 3.4vw, 2.3rem); margin-bottom: 14px; }
      .proof-grid > div > p { color: var(--muted); margin-bottom: 18px; }
      .proof-quote { border-left: 3px solid var(--lime); padding-left: 18px; margin-bottom: 18px; }
      .proof-quote blockquote { font-size: 1.12rem; }
      .proof-quote figcaption { margin-top: 6px; font-size: .84rem; color: var(--muted); }
      .proof-meta { font-size: .7rem !important; letter-spacing: .1em; text-transform: uppercase; color: var(--lime) !important; margin-bottom: 18px !important; }

      footer { margin-top: auto; border-top: 1px solid var(--line); background: var(--ink); }
      .footer-areas { padding-top: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--line); }
      .footer-areas .tag { margin-bottom: 12px; }
      .footer-areas ul { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; }
      .footer-areas a, .footer-areas span[aria-current] { display: block; padding: 7px 15px; border: 1px solid var(--line); border-radius: 40px; text-decoration: none; font-size: .88rem; white-space: nowrap; color: var(--paper); }
      .footer-areas a:hover { border-color: var(--lime); color: var(--lime); }
      .footer-areas span[aria-current] { border-color: var(--lime); color: var(--lime); }
      .footer-areas .note { display: flex; align-items: center; font-size: .85rem; color: var(--muted); padding-left: 4px; }
      footer .base { display: flex; flex-wrap: wrap; gap: 16px 28px; justify-content: space-between; align-items: center; padding-top: 28px; padding-bottom: 28px; font-size: .85rem; color: var(--muted); }
      footer nav { display: flex; flex-wrap: wrap; gap: 18px; }
      footer a { color: var(--muted); text-decoration: none; }
      footer a:hover { color: var(--paper); }

      @media (max-width: 860px) {
        .hero { grid-template-columns: 1fr; padding-top: 48px; }
        .hero-card { display: none; }
        .cards, .work, .steps, .proof-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 480px) {
        .wrap { padding-left: 18px; padding-right: 18px; }
        .nav-phone { display: none; }
        .btn { width: 100%; text-align: center; }
      }
      @media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
    </style>
  </head>
  <body>
    <a class="skip" href="#main">Skip to content</a>
    <header class="nav wrap">
      <a href="/" class="logo" aria-label="Tiny Chip Studio home"><img src="/brand/logo-line-on-dark.svg" alt="Tiny Chip Studio" width="155" height="22" /></a>
      <div class="nav-right">
        <a class="nav-phone" href="tel:${TEL}">${PHONE}</a>
        <a href="/#contact" class="btn btn-lime btn-sm">Get a fixed quote</a>
      </div>
    </header>

    <main id="main">
      <section class="hero wrap">
        <div>
          <p class="tag">[ Web design / ${n(`${c.name}, Ohio`)} ]</p>
          <h1>Web design in <em>${n(`${c.name}, Ohio`)}</em></h1>
          <p class="subhead">${t(c.subhead)}</p>
          <div class="cta-row">
            <a href="/#contact" class="btn btn-lime">Start a project ↗</a>
            <a href="/#scorecard" class="btn btn-ghost">Free website scorecard</a>
          </div>
        </div>
        <aside class="hero-card" aria-label="Where we are">
          <img src="/brand/chip-on-dark.svg" alt="" width="120" height="120" />
          <strong>${n(c.distance)}</strong>
          <span>${t(`Based in Tiffin, Ohio. Meeting in ${c.name} is easy.`)}</span>
        </aside>
      </section>

      <section class="block wrap">
        <div class="lead">
${c.intro.map((p) => `          <p>${t(p)}</p>`).join('\n')}
        </div>
      </section>

${c.proof ? proofBand(c) : ''}
      <section class="block wrap" aria-labelledby="who">
        <p class="tag">[ 01 / Who we build for ]</p>
        <h2 id="who">Built for ${n(c.name)} <em>businesses.</em></h2>
        <div class="cards">
${c.audiences
  .map(
    (a) => `          <div class="card">
            <h3>${n(a.t)}</h3>
            <p>${t(a.d)}</p>
          </div>`,
  )
  .join('\n')}
        </div>
      </section>

      <section class="block wrap" aria-labelledby="work">
        <p class="tag">[ 02 / Work close to home ]</p>
        <h2 id="work">Real projects. <em>Labeled honestly.</em></h2>
        <div class="work">
${work
  .map(
    (w) => `          <article>
            <img src="${w.img}" alt="${esc(w.alt)}" width="1280" height="720" loading="lazy" decoding="async" />
            <div class="body">
              <span class="status status--${w.kind}">${esc(w.status)}</span>
              <h3>${n(w.name)}</h3>
              <p class="place">${w.place ? n(`${w.place}, Ohio`) : 'Live client website'}</p>
              <p class="line">${t(w.line)}</p>
              <a class="go" href="${w.url}" target="_blank" rel="noopener">${esc(w.label)} ↗<span class="skip"> (opens in a new tab)</span></a>
            </div>
          </article>`,
  )
  .join('\n')}
        </div>
        <p class="work-note">${t('Concepts are our own redesigns of real businesses’ websites, made to show what we’d change. They weren’t commissioned, and we don’t claim results for them.')} <a href="/#work">${t('See the before-and-after comparisons')} ↗</a></p>
      </section>

      <section class="block wrap" aria-labelledby="services">
        <p class="tag">[ 03 / What we do ]</p>
        <h2 id="services">Three ways <em>to start.</em></h2>
        <div class="cards">
          <div class="card">
            <h3>New website</h3>
            <p>${t('Strategy, custom design and responsive development, from the first content decision through launch. WordPress or a custom build, chosen for the job.')}</p>
            <span class="price">From $1,200 · fixed quote</span>
          </div>
          <div class="card">
            <h3>Website improvement</h3>
            <p>${t('Clearer messaging, easier navigation and technical fixes for a site that already exists. We start with whatever is getting in the way.')}</p>
            <span class="price">Fixed quote after a 15-minute call</span>
          </div>
          <div class="card">
            <h3>Website review</h3>
            <p>${t('A written, prioritized look at your message, navigation and customer journey, so you know what deserves attention first.')}</p>
            <span class="price">Fee agreed before we start</span>
          </div>
        </div>
      </section>

      <section class="block wrap" aria-labelledby="how">
        <p class="tag">[ 04 / How it works ]</p>
        <h2 id="how">No hourly meter. <em>No surprises.</em></h2>
        <ol class="steps">
          <li><strong>Clarify</strong><p>${t('We learn your business, your customers and the one thing you want visitors to do next.')}</p></li>
          <li><strong>Create</strong><p>${t('We shape the message, design the pages and build the working website. You approve what goes live.')}</p></li>
          <li><strong>Deliver</strong><p>${t('We test, refine and hand off something dependable. Most builds take about a week once content is in.')}</p></li>
        </ol>
      </section>

      <section class="block wrap" aria-labelledby="questions">
        <p class="tag">[ 05 / Questions from ${n(c.name)} ]</p>
        <h2 id="questions">Before <em>you call.</em></h2>
        <div class="faq">
${c.faq
  .map(
    (f) => `          <details>
            <summary>${n(f.q)}</summary>
            <p>${t(f.a)}</p>
          </details>`,
  )
  .join('\n')}
        </div>
      </section>

      <section class="block wrap" aria-labelledby="nearby">
        <p class="tag">[ 06 / Also serving ]</p>
        <h2 id="nearby">${n(c.county)} <em>and nearby.</em></h2>
        <p class="lead" style="color:var(--muted)">${t(`Tiny Chip Studio works with businesses across Northwest Ohio, in person or by phone and video.`)}</p>
        <nav class="near" aria-label="Other areas we serve">
${nearby.map((x) => `          <a href="/${x.slug}/">${n(`Web design in ${x.name}`)}</a>`).join('\n')}
        </nav>
      </section>

      <section class="close wrap">
        <h2>Ready when <em>you are.</em></h2>
        <p>${t('Tell us what’s going on with your website. We’ll reply with honest next steps and, if it’s a fit, a fixed quote.')}</p>
        <div class="cta-row">
          <a href="/#contact" class="btn btn-lime">Start the conversation ↗</a>
          <a href="tel:${TEL}" class="btn btn-ghost">Call ${PHONE}</a>
        </div>
      </section>
    </main>

    <footer>
      <nav class="footer-areas wrap" aria-label="Areas we serve">
        <p class="tag">Web design in</p>
        <ul>
${areasRow(c.slug)}
          <li class="note">and across ${n('Northwest Ohio')}</li>
        </ul>
      </nav>
      <div class="wrap base">
        <span>© 2026 ${n('Tiny Chip Studio')} · ${n('Tiffin, Ohio')}</span>
        <nav aria-label="Footer">
          <a href="/">Home</a>
          <a href="/#work">Work</a>
          <a href="/#scorecard">Free scorecard</a>
          <a href="/privacy.html">Privacy</a>
        </nav>
      </div>
    </footer>
  </body>
</html>
`;
}

for (const c of CITIES) {
  const out = join(ROOT, 'public', c.slug, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(c));
}
console.log(`cities: wrote ${CITIES.length} pages`);
