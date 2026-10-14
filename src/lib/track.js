/**
 * Analytics and lead tracking.
 *
 * Google Analytics 4 and Microsoft Clarity load only on the live domain, and
 * only when their IDs are set as Netlify environment variables
 * (VITE_GA_ID = "G-…", VITE_CLARITY_ID = "abc123xyz"). Local dev, deploy
 * previews and the prerender never load them, so test traffic stays out of
 * the numbers.
 *
 * Events (all show up in GA4 → Reports → Engagement → Events, and as Clarity
 * custom tags you can filter session recordings by):
 *   lead_click       { action }  any link/button with data-track="…", plus every
 *                                 email / phone / text link on the page
 *   generate_lead    { form }    a form really reached us (project-starter,
 *                                 call-request, scorecard-plan). Mark this one as a
 *                                 Key event in GA4.
 *   scorecard_start / scorecard_finish
 *   crew_found       { crew, found }  someone found a hidden chip (found = 1…5)
 *   crew_complete                      all five found
 */
const GA_ID = import.meta.env.VITE_GA_ID || '';
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID || '';
const LIVE_HOSTS = ['www.tinychipstudio.com', 'tinychipstudio.com'];

let started = false;

export function startAnalytics() {
  if (started || typeof window === 'undefined') return;
  if (!LIVE_HOSTS.includes(window.location.hostname)) return;
  started = true;

  if (GA_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.append(s);
  }

  if (CLARITY_ID) {
    window.clarity =
      window.clarity ||
      function clarity() {
        (window.clarity.q = window.clarity.q || []).push(arguments); // eslint-disable-line prefer-rest-params
      };
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    document.head.append(s);
  }
}

/** Send one event to whatever analytics is running. Safe to call anywhere. */
export function track(name, params = {}) {
  try {
    window.gtag?.('event', name, params);
    window.clarity?.('event', name);
  } catch {
    /* analytics must never break the page */
  }
}

// Names used around the site, mapped onto the events above.
const FORM_LEADS = { 'form-sent': 'project-starter', 'call-request': 'call-request', 'scorecard-plan': 'scorecard-plan' };

export function trackLead(name) {
  if (FORM_LEADS[name]) return track('generate_lead', { form: FORM_LEADS[name] });
  if (name === 'scorecard-start') return track('scorecard_start');
  if (name === 'scorecard-finished') return track('scorecard_finish');
  if (name === 'form-fallback') return track('form_fallback');
  return track('lead_click', { action: name });
}

export function installTracking() {
  startAnalytics();
  const onClick = (e) => {
    const el = e.target.closest?.('[data-track], a[href^="mailto:"], a[href^="tel:"], a[href^="sms:"]');
    if (!el) return;
    const tag = el.getAttribute('data-track');
    if (tag) return trackLead(tag);
    const href = el.getAttribute('href') || '';
    trackLead(href.startsWith('mailto:') ? 'email' : href.startsWith('tel:') ? 'call' : 'text');
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
