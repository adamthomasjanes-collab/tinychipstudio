import { FORM_ENDPOINT } from '../site';

/** How long a form may wait for an answer before we stop and say so. */
export const SEND_TIMEOUT_MS = 15000;

/**
 * Send a form to Netlify Forms (each form has a static twin in index.html so
 * Netlify can detect it at deploy time), or to FORM_ENDPOINT if one is set.
 *
 * Resolves to one of:
 *   'sent'        the message was really accepted
 *   'unavailable' no form backend answered (a plain static host just returns
 *                 this page's HTML); offer the pre-written email instead
 *   'failed'      the request failed (offline, server error); nothing was accepted
 *   'timeout'     no answer within SEND_TIMEOUT_MS. It may or may not have
 *                 arrived, so callers must not claim success or failure.
 *
 * Never throws, and never touches the visitor's input: callers keep it.
 */
export async function sendForm(formName, fields, { timeoutMs = SEND_TIMEOUT_MS } = {}) {
  const controller = typeof AbortController === 'undefined' ? null : new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller?.abort();
  }, timeoutMs);

  try {
    let res;
    if (FORM_ENDPOINT) {
      res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formName, ...fields }),
        signal: controller?.signal,
      });
      return res.ok ? 'sent' : 'failed';
    }
    res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ 'form-name': formName, ...stringify(fields) }).toString(),
      signal: controller?.signal,
    });
    if (res.status === 404 || res.status === 405) return 'unavailable';
    if (!res.ok) return 'failed';
    const text = await res.text();
    // A host without form handling answers the POST with this page itself.
    return text.includes('id="root"') ? 'unavailable' : 'sent';
  } catch {
    return timedOut ? 'timeout' : 'failed';
  } finally {
    clearTimeout(timer);
  }
}

const stringify = (fields) =>
  Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, String(v)]));

/** A short reference shown to the visitor and included with the inquiry, so repeats are easy to spot. */
export const newRef = () => Math.random().toString(36).slice(2, 8).toUpperCase();
