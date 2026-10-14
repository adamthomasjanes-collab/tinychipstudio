// Contact details and URLs live here only. To move to a dedicated studio inbox, change EMAIL.
export const SITE_URL = 'https://www.tinychipstudio.com/';
export const EMAIL = 'tinychipstudio@gmail.com';
export const PHONE_DISPLAY = '419-341-8519';
export const PHONE_TEL = '+14193418519';
export const LOCATION = 'Tiffin, Ohio';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/adamthomasjanes/';
export const BEHANCE_URL = 'https://www.behance.net/adaminprint';
export const PORTFOLIO_URL = 'https://adamthomasjanes.com/';
// The scorecard and the call booking now live inside this site (sheets opened by these hashes).
export const SCORECARD_URL = '#scorecard';
export const BOOK_URL = '#book-call';
// Paste a Calendly / Google appointment-schedule / Cal.com link here and "Book a
// 15-minute call" will send people there instead of taking a call request.
export const BOOKING_URL = 'https://calendly.com/adamthomasjanes/30min';

// Shown in the hero, services and FAQ.
export const STARTING_PRICE = '$1,200';
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
