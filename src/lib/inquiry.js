import { track } from './track';

/**
 * Hand the visitor to the inquiry form with some context, from anywhere on the
 * page: a service card ("need"), a case study ("project"). The form adds the
 * context next to what the visitor types; it never replaces their words.
 */
export const INQUIRY_EVENT = 'tcs:inquiry';

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Scroll to the form and move focus to its heading (no keyboard pop-up on phones). */
export function revealContact() {
  const section = document.getElementById('contact');
  if (!section) return;
  section.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  document.getElementById('contact-title')?.focus({ preventScroll: true });
  if (window.location.hash !== '#contact') window.history.replaceState(null, '', '#contact');
}

/**
 * @param {{ need?: string, project?: string, source: string }} detail
 * @param {{ reveal?: boolean }} opts  reveal=false when the click is a plain #contact link
 */
export function startInquiry(detail, { reveal = true } = {}) {
  window.dispatchEvent(new CustomEvent(INQUIRY_EVENT, { detail }));
  if (detail.project) track('case_study_inquiry', { project: detail.project, source: detail.source });
  if (detail.need) track('service_select', { service: detail.need, source: detail.source });
  if (reveal) revealContact();
}
