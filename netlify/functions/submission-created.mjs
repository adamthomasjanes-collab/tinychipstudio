/**
 * Netlify serverless function: submission-created
 *
 * Fires automatically for every Netlify Forms submission on this site.
 * Sends a notification email to tinychipstudio@gmail.com via Resend.
 *
 * Required env var (set in Netlify → Project configuration → Variables):
 *   RESEND_API_KEY   – your Resend API key (free tier at resend.com,
 *                      no credit card required)
 *
 * The function is dependency-free: it uses Node 18's built-in fetch.
 */

/** Escape a value for safe insertion into HTML */
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body);
    const { form_name: formName, data } = payload;

    // Fallback so the subject is never "New undefined submission"
    const label = formName || 'unknown form';

    const submitterEmail = data?.email || data?.Email || null;

    // Format the submitted fields as a simple list
    const textRows = Object.entries(data || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const htmlRows = Object.entries(data || {})
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
      .join('');

    const html = `
<!doctype html>
<html><body style="font-family:system-ui,sans-serif;color:#111;max-width:520px;margin:40px auto;padding:0 16px">
<h2 style="margin:0 0 16px">New submission: ${escapeHtml(label)}</h2>
<table style="border-collapse:collapse;width:100%">${htmlRows}</table>
<p style="margin-top:24px;color:#555;font-size:13px">Sent from Tiny Chip Studio — Netlify Forms</p>
</body></html>`;

    const emailPayload = {
      // tinychipstudio.com is a verified sending domain in Resend, so we can
      // send from our own address instead of the onboarding@resend.dev sandbox.
      from: 'Tiny Chip Forms <forms@tinychipstudio.com>',
      // FORM_NOTIFY_TO (Netlify env var) picks the inbox.
      to: [process.env.FORM_NOTIFY_TO || 'tinychipstudio@gmail.com'],
      subject: `New ${label} submission`,
      text: textRows,
      html,
    };

    // If the submitter included an email, set reply-to so you can reply directly
    if (submitterEmail) {
      emailPayload.reply_to = submitterEmail;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      // Log the full Resend response so it appears in Netlify function logs
      console.error(`Resend rejected email for "${label}": HTTP ${res.status} — ${err}`);
    } else {
      const result = await res.json();
      console.log(`Form email sent for "${label}" — Resend ID: ${result.id}`);
    }

    // Always return 200 — Netlify retries non-2xx and we'd get duplicate emails
    return { statusCode: 200 };
  } catch (err) {
    console.error('submission-created error:', err);
    return { statusCode: 200 };
  }
};
