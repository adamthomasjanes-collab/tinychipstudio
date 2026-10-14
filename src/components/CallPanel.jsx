import React, { useMemo, useState } from 'react';
import Chip from '../chip/Chip';
import { BOOKING_URL, PHONE_DISPLAY, PHONE_TEL } from '../site';
import { sendForm } from '../lib/forms';
import { trackLead } from '../lib/track';
import { tidy } from '../lib/typography';

const WINDOWS = ['Morning (9–12)', 'Afternoon (12–4)', 'Evening (4–6)'];
const TOPICS = ['A new website', 'Fixing my current site', 'Not sure yet'];

/** The next six weekdays, starting tomorrow. */
function weekdays() {
  const out = [];
  const d = new Date();
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    out.push({
      key: d.toISOString().slice(0, 10),
      short: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      long: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    });
  }
  return out;
}

/**
 * "Book 15 minutes." If a scheduling link is set in site.js (BOOKING_URL:
 * Calendly, Google appointment schedule, Cal.com…), this sends people there.
 * Until then it takes a call request: pick a day and a window, leave a number,
 * and the request arrives like any other form.
 */
export default function CallPanel() {
  const days = useMemo(weekdays, []);
  const [f, setF] = useState({ day: days[0].key, window: WINDOWS[0], topic: TOPICS[0], name: '', phone: '', email: '', note: '' });
  const [err, setErr] = useState({});
  const [state, setState] = useState('idle');
  const day = days.find((d) => d.key === f.day) || days[0];

  if (BOOKING_URL) {
    return (
      <div className="call">
        <Chip pose="wave" className="sc-chip" />
        <div>
          <h3>{tidy('Pick a time that suits you.')}</h3>
          <p>{tidy('Fifteen minutes, no prep needed. Tell us what’s going on and we’ll tell you honestly whether we can help.')}</p>
          <a className="button button-lime" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" data-track="book-call">
            SEE OPEN TIMES <span aria-hidden="true">↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Who should we ask for?';
    if (f.phone.replace(/\D/g, '').length < 10) x.phone = 'A 10-digit number, please.';
    setErr(x);
    if (Object.keys(x).length) return;
    setState('sending');
    try {
      const ok = await sendForm('call-request', { ...f, day: day.long });
      setState(ok ? 'sent' : 'fallback');
      if (ok) trackLead('call-request');
    } catch {
      setState('fallback');
    }
  };

  if (state === 'sent') {
    return (
      <div className="call" role="status">
        <Chip pose="cheer" className="sc-chip" />
        <div>
          <h3>{tidy(`Done. Talk ${day.short === days[0].short ? 'soon' : `on ${day.long.split(',')[0]}`}, ${f.name.split(' ')[0]}.`)}</h3>
          <p>{tidy(`Adam will call you ${day.long}, ${f.window.split(' ')[0].toLowerCase()}, from ${PHONE_DISPLAY}. Save that number so you know it’s us. If the time stops working, just text it.`)}</p>
        </div>
      </div>
    );
  }

  if (state === 'fallback') {
    return (
      <div className="call">
        <Chip pose="think" className="sc-chip" />
        <div>
          <h3>{tidy('That didn’t send from here.')}</h3>
          <p>{tidy('Quickest fix: call or text us and we’ll set a time.')}</p>
          <div className="sc-actions">
            <a className="button button-lime" href={`tel:${PHONE_TEL}`}>
              CALL {PHONE_DISPLAY}
            </a>
            <a className="text-link" href={`sms:${PHONE_TEL}?body=${encodeURIComponent(`Hi, it's ${f.name}. Can we talk ${day.long}, ${f.window}?`)}`}>
              TEXT INSTEAD
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="call call-form" onSubmit={submit} noValidate>
      <p className="call-lede">{tidy('Fifteen minutes. No prep, no pitch deck. Pick a day and a window and we’ll call you.')}</p>

      <fieldset className="call-set">
        <legend>DAY</legend>
        <div className="call-days">
          {days.map((d) => (
            <label key={d.key} className={`call-day ${f.day === d.key ? 'is-on' : ''}`}>
              <input type="radio" name="day" value={d.key} checked={f.day === d.key} onChange={() => setF({ ...f, day: d.key })} />
              <strong>{d.short}</strong>
              <small>{d.date}</small>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="call-set">
        <legend>TIME (EASTERN)</legend>
        <div className="call-pills">
          {WINDOWS.map((w) => (
            <label key={w} className={`pill ${f.window === w ? 'is-on' : ''}`}>
              <input type="radio" name="window" value={w} checked={f.window === w} onChange={() => setF({ ...f, window: w })} />
              {w}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="call-set">
        <legend>ABOUT</legend>
        <div className="call-pills">
          {TOPICS.map((t) => (
            <label key={t} className={`pill ${f.topic === t ? 'is-on' : ''}`}>
              <input type="radio" name="topic" value={t} checked={f.topic === t} onChange={() => setF({ ...f, topic: t })} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sc-fields">
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" value={f.name} aria-invalid={Boolean(err.name)} aria-describedby={err.name ? 'call-name-err' : undefined} onChange={(e) => setF({ ...f, name: e.target.value })} />
          {err.name && <em className="field-error" id="call-name-err">{err.name}</em>}
        </label>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} aria-invalid={Boolean(err.phone)} aria-describedby={err.phone ? 'call-phone-err' : undefined} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          {err.phone && <em className="field-error" id="call-phone-err">{err.phone}</em>}
        </label>
        <label>
          <span>Email (optional)</span>
          <input name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </label>
        <label className="call-note">
          <span>Anything we should look at first? (optional)</span>
          <input name="note" placeholder="Your website, or one line about the business" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        </label>
      </div>

      <div className="sc-actions">
        <button type="submit" className="button button-lime" disabled={state === 'sending'}>
          {state === 'sending' ? 'SENDING…' : `CALL ME ${day.short.toUpperCase()}`} <span aria-hidden="true">↗</span>
        </button>
        <span className="call-small">{tidy(`We’ll call from ${PHONE_DISPLAY}.`)}</span>
      </div>
    </form>
  );
}
