/**
 * Netlify serverless function: submission-created
 *
 * Fires automatically for every Netlify Forms submission on this site and
 * emails it to the studio via Resend. The submission itself is already stored
 * in Netlify Forms before this runs; nothing here can lose it.
 *
 * Environment (Netlify → Project configuration → Variables):
 *   RESEND_API_KEY   required. Resend API key.
 *   FORM_NOTIFY_TO   optional. Inbox for notifications (default tinychipstudio@gmail.com).
 *
 * Delivery rules
 *   - Every send carries an Idempotency-Key built from the form name and the
 *     submitted fields. Resend keeps keys for 24 hours and answers a repeat with
 *     the original result instead of sending again, so a retry (ours, Netlify's,
 *     or a visitor pressing "try again" with the same message) never produces a
 *     second email.
 *   - Temporary problems (network errors, timeouts, HTTP 429 and 5xx) are retried
 *     a few times with a short back-off, inside a fixed time budget.
 *   - If the email still can't be sent, the function logs an error that names the
 *     submission and returns HTTP 500, so the failure shows up in the function's
 *     logs and metrics instead of passing as a success. The submission stays in
 *     Netlify Forms (Forms → project-starter) to follow up by hand. See
 *     MEASUREMENT.md → "When a notification email fails".
 *
 * Dependency-free: Node 18+ built-in fetch and crypto.
 */
import { createHash } from 'node:crypto';

const RESEND_URL = 'https://api.resend.com/emails';
const DEFAULT_TO = 'tinychipstudio@gmail.com';
const FROM = 'Tiny Chip Forms <forms@tinychipstudio.com>';

// Netlify's synchronous functions stop at 10 s by default; stay well inside it.
const ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 2500;
const BACKOFF_MS = [400, 1200];

// Fields that differ between otherwise-identical submissions (Netlify's request
// details, and the form's own per-visit reference), left out of the key.
const VOLATILE = new Set(['ip', 'user_agent', 'referrer', 'created_at', 'ref']);

/** Escape a value for safe insertion into HTML */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Same form + same visible fields → same key. Built from content rather than the
 * Netlify submission id, so a visitor re-sending an identical message after a
 * timeout is recognised too.
 */
export function idempotencyKey(formName, data) {
  const stable = Object.keys(data || {})
    .filter((k) => !VOLATILE.has(k))
    .sort()
    .map((k) => [k, String(data[k] ?? '').trim()]);
  const hash = createHash('sha256').update(JSON.stringify([formName, stable])).digest('hex').slice(0, 40);
  return `tcs-${String(formName || 'form').replace(/[^a-z0-9-]/gi, '').slice(0, 40)}-${hash}`;
}

export function buildEmail(formName, data, to) {
  const label = formName || 'unknown form';
  const fields = Object.entries(data || {});
  const ref = data?.ref ? ` · ref ${String(data.ref).slice(0, 12)}` : '';
  const textRows = fields.map(([k, v]) => `${k}: ${v}`).join('\n');
  const htmlRows = fields
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
    .join('');
  const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#111;max-width:520px;margin:40px auto;padding:0 16px">
<h2 style="margin:0 0 16px">New submission: ${escapeHtml(label)}</h2>
<table style="border-collapse:collapse;width:100%">${htmlRows}</table>
<p style="margin-top:24px;color:#555;font-size:13px">Sent from Tiny Chip Studio — Netlify Forms</p>
</body></html>`;
  const email = { from: FROM, to: [to], subject: `New ${label} submission${ref}`, text: textRows, html };
  const reply = data?.email || data?.Email;
  if (reply && /^\S+@\S+\.\S+$/.test(String(reply).trim())) email.reply_to = String(reply).trim();
  return email;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** True when trying again could succeed. */
const retryable = (status, body) =>
  status === 429 || status >= 500 || (status === 409 && /concurrent/i.test(body || ''));

/**
 * Deliver one submission. Injected fetch/env/sleep make it testable without
 * sending real email (see tests/submission-created.test.mjs).
 * @returns {{ ok: boolean, statusCode: number, attempts: number, id?: string, error?: string }}
 */
export async function deliver(event, { fetchImpl = fetch, env = process.env, wait = sleep, log = console } = {}) {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body));
  } catch (err) {
    log.error(`submission-created: unreadable event body (${err.message}). Nothing to send.`);
    // A malformed event can't be fixed by retrying.
    return { ok: false, statusCode: 400, attempts: 0, error: 'bad-event' };
  }
  const { form_name: formName, data = {}, id: submissionId } = payload || {};
  const label = formName || 'unknown form';
  const where = `form "${label}", submission ${submissionId || 'without id'}`;

  // Spam caught by the honeypot never needs an email.
  if (data['bot-field']) {
    log.log(`submission-created: skipped honeypot ${where}.`);
    return { ok: true, statusCode: 200, attempts: 0 };
  }

  if (!env.RESEND_API_KEY) {
    log.error(`submission-created: EMAIL NOT SENT for ${where}: RESEND_API_KEY is not set. The submission is safe in Netlify Forms.`);
    return { ok: false, statusCode: 500, attempts: 0, error: 'missing-api-key' };
  }

  const email = buildEmail(formName, data, env.FORM_NOTIFY_TO || DEFAULT_TO);
  const key = idempotencyKey(formName, data);
  let last = '';
  let tries = 0;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    tries = attempt;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
    try {
      const res = await fetchImpl(RESEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Idempotency-Key': key,
        },
        body: JSON.stringify(email),
        signal: controller.signal,
      });
      const body = await res.text();
      if (res.ok) {
        let id = '';
        try {
          id = JSON.parse(body).id || '';
        } catch {
          /* fine: the status is what matters */
        }
        log.log(`submission-created: email sent for ${where} (Resend ${id || 'ok'}, attempt ${attempt}).`);
        return { ok: true, statusCode: 200, attempts: attempt, id };
      }
      last = `HTTP ${res.status}: ${body.slice(0, 300)}`;
      if (!retryable(res.status, body)) {
        last += ' (not retryable)';
        break;
      }
    } catch (err) {
      last = err?.name === 'AbortError' ? `timed out after ${ATTEMPT_TIMEOUT_MS} ms` : `network error: ${err?.message || err}`;
    } finally {
      clearTimeout(timer);
    }
    if (attempt < ATTEMPTS) await wait(BACKOFF_MS[attempt - 1] ?? 1500);
  }

  log.error(`submission-created: EMAIL NOT SENT for ${where} after retries (${last}). The submission is safe in Netlify Forms; follow up from there.`);
  return { ok: false, statusCode: 500, attempts: tries, error: last };
}

export const handler = async (event) => {
  try {
    const result = await deliver(event);
    return { statusCode: result.statusCode };
  } catch (err) {
    console.error('submission-created: unexpected error. The submission is safe in Netlify Forms.', err);
    return { statusCode: 500 };
  }
};
