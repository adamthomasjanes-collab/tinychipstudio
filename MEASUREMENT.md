# Conversion measurement and inquiry delivery

What the site measures, what it deliberately doesn't, and the few settings that live outside the code.

## Events (GA4 + Clarity)

Analytics only load on the live domain, and only when `VITE_GA_ID` / `VITE_CLARITY_ID` are set in Netlify (see `src/lib/track.js`). No event carries anything a visitor typed: no names, email addresses, phone numbers, websites or messages.

| Event | Fires when | Parameters |
| --- | --- | --- |
| `contact_start` | First focus in the project form (once per visit) | `context`: direct, service or case-study |
| `generate_lead` | A form was **accepted** by Netlify Forms | `form`: project-starter, scorecard-plan, call-request |
| `form_error` | Validation stopped a send, or a send failed | `form`, `reason` (validation, failed, timeout, unavailable), `fields` (names only) |
| `form_fallback` | No form backend answered, so the visitor got a pre-written email | none |
| `case_study_inquiry` | "Talk about a website like this" | `project`, `source` (where on the page) |
| `service_select` | A service card's button | `service`, `source` |
| `booking_click` | A "Book a 15-minute call" link was clicked | `source` (book-call-hero, book-call-contact, book-call-scorecard…) |
| `booking_confirmed` | The visitor came back from Calendly's confirmation redirect | none (needs the Calendly setting below) |
| `lead_click` | Unchanged: any `data-track` link, plus email, phone and text links | `action` |
| `scorecard_start`, `scorecard_finish`, `crew_found`, `crew_complete` | Unchanged | |

**A booking click is not a booking.** Compare `booking_click` with confirmed bookings in Calendly, or with `booking_confirmed` once the redirect below is set up.

Page views keep campaign tags (`utm_*`, `gclid`) and drop every other query parameter, so details a third party appends to a link never reach analytics.

### GA4 settings (one time)
1. Admin → Events: mark `generate_lead` as a key event (if it isn't already). Optionally `booking_confirmed` too.
2. Admin → Custom definitions: add event-scoped dimensions for `form`, `reason`, `project`, `service`, `source` and `context`, so they show up in reports.
3. Suggested funnel (Explore → Funnel exploration): `contact_start` → `generate_lead`, broken down by `context`.

### Measuring completed Calendly bookings (external setup)
Every booking link carries `utm_source=tinychipstudio.com`, `utm_medium=website`, `utm_campaign=book-call` and `utm_content=<button>`. Two ways to count real bookings:

1. **In Calendly (no code):** Calendly stores UTM values on each booking. Event Types → the 15-minute event → bookings/exports show `utm_content`, i.e. which button produced the booking. (Calendly's own UTM tracking and reporting depends on your plan.)
2. **In GA4:** In Calendly, open the event type → *Confirmation page* → *Redirect to an external site* and enter
   `https://www.tinychipstudio.com/?booking=confirmed`
   Leave "Pass event details to your redirected page" **off**. The site then records `booking_confirmed` and removes the query string from the address bar before analytics loads. (The redirect option requires a paid Calendly plan.)
   Calendly's direct GA4 integration (Integrations → Google Analytics) is an alternative; it reports inside Calendly's own pages, so expect its event names rather than `booking_confirmed`.

The `/book` short link (netlify.toml) redirects straight to the calendar with `utm_medium=short-link`.

## Inquiry delivery (`netlify/functions/submission-created.mjs`)

Netlify Forms stores every submission **before** this function runs; the function only sends the notification email (Resend).

- **Duplicate protection.** Each email carries an `Idempotency-Key` built from the form name and the submitted fields (Netlify's IP/user-agent fields and the form's `ref` are excluded). For 24 hours Resend answers a repeat with the original result instead of sending again, so function retries, platform retries and a visitor re-sending the same message after a timeout don't produce duplicate emails. An edited message gets a new key and is sent.
- **Retries.** Network errors, per-attempt timeouts (2.5 s), HTTP 429 and 5xx are retried up to 3 attempts within ~8 s, inside Netlify's 10 s function limit. Permanent errors (400/401/403/422) are not retried.
- **Failure reporting.** If the email can't be sent, the function logs `EMAIL NOT SENT for form "…", submission <id>` and returns **HTTP 500** (it used to return 200 regardless). Failures show in Netlify → Logs → Functions → `submission-created`.
- **Missing key.** No `RESEND_API_KEY` → logged as `EMAIL NOT SENT … RESEND_API_KEY is not set` and HTTP 500.

### When a notification email fails
1. Netlify → Forms → open the form (project-starter, scorecard-plan or call-request). The submission is there.
2. Reply from your inbox as usual. The email subject carries the form's `ref` code when there is one, which also helps spot repeats.
3. Recommended backup channel: Netlify → Forms → Form notifications → add an email notification. It is sent by Netlify independently of Resend, so a Resend outage can't hide an inquiry. (It will duplicate the Resend email while both work; turn one off if that's noisy.)

Netlify doesn't document whether it re-invokes `submission-created` after a non-2xx response. The function doesn't rely on it: retries happen inside the function, and any platform retry is absorbed by the idempotency key.

### On the page (`src/lib/forms.js`)
- Every form request is bounded at 15 s. After 6 s the button area says it's still sending; the send button stays disabled, so it can't be double-submitted.
- Results are explicit: **sent** (Netlify accepted it), **failed** (nothing was accepted; offer retry or email), **timeout** (it may or may not have arrived; say so, keep the text, and explain that re-sending the same message won't email twice), **unavailable** (no form backend; open a pre-written email).
- What the visitor typed is never cleared until a send is confirmed. The draft is also kept in this tab's `sessionStorage` (cleared on success or when the tab closes).

### Tests
`npm test` runs the function against a mocked Resend API (success, 5xx, 429/409 retries, permanent 422, a stalled provider, missing key, honeypot, idempotency keys, HTML escaping). No network calls, no emails.
