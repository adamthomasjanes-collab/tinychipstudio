import { BOOKING_URL, BOOK_URL } from '../site';

/**
 * Where "Book a 15-minute call" goes. With a scheduling link set in site.js
 * (BOOKING_URL), visitors go straight to the calendar; the UTM tags tell
 * Calendly which button they used (Calendly keeps UTM values on the booking).
 * Without one, the in-site call-request panel (#book-call) takes over.
 */
export function bookingHref(source) {
  if (!BOOKING_URL) return BOOK_URL;
  try {
    const u = new URL(BOOKING_URL);
    u.searchParams.set('utm_source', 'tinychipstudio.com');
    u.searchParams.set('utm_medium', 'website');
    u.searchParams.set('utm_campaign', 'book-call');
    if (source) u.searchParams.set('utm_content', source);
    return u.toString();
  } catch {
    return BOOKING_URL;
  }
}

/** Props for a booking link: direct to the calendar in a new tab, tracked as `track`. */
export function bookingProps(source, track) {
  const external = Boolean(BOOKING_URL);
  return {
    href: bookingHref(source),
    'data-track': track,
    ...(external ? { target: '_blank', rel: 'noopener' } : {}),
  };
}
export const BOOKING_IS_EXTERNAL = Boolean(BOOKING_URL);
