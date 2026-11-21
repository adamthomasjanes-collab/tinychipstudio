// Contact details and URLs live here only. To move to a dedicated studio inbox, change EMAIL.
import { pricing, money } from './offers.js';
export const SITE_URL = 'https://tinychipstudio.com/';
export const EMAIL = 'adam@tinychipstudio.com';
export const PHONE_DISPLAY = '419-341-8519';
export const PHONE_TEL = '+14193418519';
export const LOCATION = 'Tiffin, Ohio';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/adamthomasjanes/';
export const BEHANCE_URL = 'https://www.behance.net/adaminprint';
export const FACEBOOK_URL = 'https://www.facebook.com/tinychipstudio';
export const INSTAGRAM_URL = 'https://www.instagram.com/tinychipstudio/';
export const NEXTDOOR_URL = 'https://nextdoor.com/page/tiny-chip-studio-tiffin-oh/';
// The scorecard lives inside this site (a sheet opened by this hash).
export const SCORECARD_URL = '#scorecard';
// Fallback call-request sheet, used only when BOOKING_URL is empty (and for old #book-call links).
export const BOOK_URL = '#book-call';
// "Book a 15-minute call" goes straight here, in a new tab, with UTM tags for the
// button that was used (src/lib/booking.js). The Calendly event really is 15
// minutes; only its address says /30min. Also update the /book redirect in
// netlify.toml if this changes. Empty it to fall back to the call-request sheet.
export const BOOKING_URL = 'https://calendly.com/adamthomasjanes/30min';

// Shown in the hero, services and FAQ.
export const STARTING_PRICE = money(pricing.build); // Build & Own starting price.
export const REGION = 'Northwest Ohio';

// The people. Add a photo (square, ~720px, in public/assets/team/) and the card
// switches from the placeholder to the real thing.
export const TEAM = [
  {
    name: 'Adam Thomas Janes',
    role: 'Founder · Design & development',
    photo: '/assets/team/adam',
    line: 'Plans the message, designs the pages and builds the site. You talk to him from the first call to launch.',
  },
  {
    name: 'Sarah Rose Janes',
    role: 'Operations & client relations',
    photo: '', // add public/assets/team/sarah.webp + sarah-360.webp when ready
    line: 'Keeps projects on track and makes sure every client knows what’s happening and when.',
  },
];

export const mailto = (subject, body) => {
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${EMAIL}${params.length ? `?${params.join('&')}` : ''}`;
};

// Project starter form. On Netlify, submissions land in the Netlify dashboard (Forms).
// To use another service (Formspree, Basin, your own endpoint), put its URL here.
// Leave both alone and the form falls back to a pre-written email.
export const FORM_NAME = 'project-starter';
export const FORM_ENDPOINT = '';

// The "built by" badge on client sites links here.
export const BADGE_URL = SITE_URL;
