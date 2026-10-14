import { FORM_ENDPOINT } from '../site';

/**
 * Send a form to Netlify Forms (each form has a static twin in index.html so
 * Netlify can detect it at deploy time), or to FORM_ENDPOINT if one is set.
 * Resolves true only when the message was really accepted; on a plain static
 * host the POST just returns this page's HTML, which counts as not sent.
 */
export async function sendForm(formName, fields) {
  if (FORM_ENDPOINT) {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: formName, ...fields }),
    });
    return res.ok;
  }
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ 'form-name': formName, ...fields }).toString(),
  });
  if (!res.ok) return false;
  const text = await res.text();
  return !text.includes('id="root"');
}
