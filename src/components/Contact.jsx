import React, { useEffect, useRef, useState } from 'react';
import Chip from '../chip/Chip';
import { starter } from '../data';
import { sendForm } from '../lib/forms';
import { EMAIL, FORM_NAME, LOCATION, PHONE_DISPLAY, PHONE_TEL, SCORECARD_URL, BOOK_URL, mailto } from '../site';
import { trackLead } from '../lib/track';
import { tidy } from '../lib/typography';

const EMPTY = { name: '', email: '', website: '', need: '', budget: starter.budgets[0], timeline: starter.timelines[0], message: '' };

/** Plain-text version of the inquiry, for the email fallback. */
const asText = (f) =>
  [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    f.website && `Current website: ${f.website}`,
    `Looking for: ${f.need || 'Not sure yet'}`,
    `Budget: ${f.budget}`,
    `Timing: ${f.timeline}`,
    '',
    'What I’d like my website to make easier:',
    f.message,
  ]
    .filter((l) => l !== false && l !== undefined)
    .join('\n');

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = 'Please add your name.';
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Please add an email address we can reply to.';
  if (f.message.trim().length < 10) e.message = 'A sentence or two is plenty.';
  return e;
}

const send = (f) => sendForm(FORM_NAME, f);

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | fallback
  const [copied, setCopied] = useState(false);

  // Chip follows along: the three required fields fill a little pixel meter.
  const progress = [form.name.trim(), /^\S+@\S+\.\S+$/.test(form.email.trim()), form.message.trim().length >= 10].filter(Boolean).length;
  const pose =
    state === 'sent' ? 'cheer' : state === 'sending' ? 'think' : Object.values(errors).some(Boolean) ? 'wow' : progress === 3 ? 'cheer' : 'point';
  const formRef = useRef(null);
  const doneRef = useRef(null);

  // Service cards pre-select what the visitor is looking for.
  useEffect(() => {
    const onNeed = (e) => setForm((f) => ({ ...f, need: e.detail }));
    window.addEventListener('tcs:need', onNeed);
    return () => window.removeEventListener('tcs:need', onNeed);
  }, []);

  useEffect(() => {
    if (state === 'sent' || state === 'fallback') doneRef.current?.focus();
    if (state === 'sent' || state === 'fallback') trackLead(`form-${state}`);
  }, [state]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form['bot-field']) return;
    const errs = validate(form);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setState('sending');
    try {
      setState((await send(form)) ? 'sent' : 'fallback');
    } catch {
      setState('fallback');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — the address stays visible and selectable */
    }
  };

  const err = (k) =>
    errors[k] ? (
      <span className="field-error" id={`${k}-error`}>
        {errors[k]}
      </span>
    ) : null;
  const described = (k, hint) => [errors[k] && `${k}-error`, hint].filter(Boolean).join(' ') || undefined;

  return (
    <section id="contact" className="contact section-pad" data-guide="contact" aria-labelledby="contact-title">
      <p className="section-tag">[ 09 / YOUR NEXT STEP ]</p>
      <div className="contact-head">
        <h2 id="contact-title" className="reveal">
          GOOD WORK.
          <br />
          <em>STARTS HERE.</em>
        </h2>
      </div>

      <div className="contact-layout">
        <div className="contact-aside">
          <p className="contact-lede">
            {tidy(
              'What should your website make easier for your customers? Start there. You may be wondering if this turns into a hard sell. It doesn’t. Tell us what’s going on, and we’ll tell you honestly whether we can help.',
            )}
          </p>
          <ol className="contact-next">
            {starter.next.map((t, i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                {tidy(t)}
              </li>
            ))}
          </ol>
          <div className="contact-ledge">
            <p className="section-tag">NOT READY FOR A WHOLE PROJECT?</p>
            <p>{tidy('That’s fine. Three smaller ways to start:')}</p>
            <a className="text-link" href={BOOK_URL} data-track="book-call-contact">
              BOOK A 15-MINUTE CALL <span aria-hidden="true">☎</span>
            </a>
            <a className="text-link" href={SCORECARD_URL} data-track="scorecard">
              SCORE YOUR WEBSITE, FREE <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href={mailto('One quick question')}>
              ASK US ONE QUESTION BY EMAIL <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="contact-details">
            <a href={mailto()}>{EMAIL} ↗</a>
            <button type="button" className="copy-email" onClick={copyEmail}>
              {copied ? 'COPIED ✓' : 'COPY EMAIL'}
            </button>
            <span className="visually-hidden" role="status">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY} ↗</a>
            <span>{`${LOCATION} / REMOTE PROJECTS WELCOME`.toUpperCase().replace('TIFFIN, OHIO', 'TIFFIN, OHIO')}</span>
          </div>
        </div>

        {/* Chip rides along in the form column: he parks in the whitespace over the card's
            top-right corner and sticks there while you scroll the form, so you can see him
            react to every field. On narrow screens the one by the send button takes over. */}
        <div className="contact-form-col">
          <div className="contact-chip-rail" aria-hidden="true">
            <div className="contact-chip contact-chip--float">
              <Chip pose={pose} look={state === 'idle' && progress > 0 ? 'left' : null} className="contact-mascot" />
              {state === 'idle' && (
                <div className="contact-meter" style={{ '--p': progress / 3 }}>
                  <span>{progress === 3 ? 'READY' : `${progress}/3`}</span>
                  <i />
                </div>
              )}
            </div>
          </div>

          {state === 'sent' ? (
          <div className="starter-done" tabIndex={-1} ref={doneRef}>
            <div className="done-chip" aria-hidden="true">
              <Chip pose="cheer" />
            </div>
            <p className="section-tag">MESSAGE RECEIVED</p>
            <h3>Thanks, {form.name.split(' ')[0]}. It’s in.</h3>
            <p>{tidy('We read every message and reply by email. Keep an eye on your inbox, and check spam just in case.')}</p>
          </div>
        ) : state === 'fallback' ? (
          <div className="starter-done" tabIndex={-1} ref={doneRef}>
            <p className="section-tag">ONE MORE STEP</p>
            <h3>Let’s send this by email instead.</h3>
            <p>{tidy('The form couldn’t send from here, so we’ve written the email for you. Open it, check it, and hit send.')}</p>
            <a className="button button-lime" href={mailto('Project inquiry — Tiny Chip Studio', asText(form))}>
              OPEN THE EMAIL <span aria-hidden="true">↗</span>
            </a>
            <button type="button" className="text-link starter-back" onClick={() => setState('idle')}>
              ← BACK TO THE FORM
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            className="starter"
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            noValidate
            aria-label="Start a project"
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <p className="starter-trap" aria-hidden="true">
              <label>
                Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" onChange={set('bot-field')} />
              </label>
            </p>

            <fieldset className="starter-needs">
              <legend>What are you looking for?</legend>
              <div className="pill-row">
                {starter.needs.map((n) => (
                  <label key={n} className={`pill ${form.need === n ? 'is-on' : ''}`}>
                    <input type="radio" name="need" value={n} checked={form.need === n} onChange={set('need')} />
                    {n}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="starter-row">
              <label className="field">
                <span>Your name</span>
                <input
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={set('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={described('name')}
                />
                {err('name')}
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={described('email')}
                />
                {err('email')}
              </label>
            </div>

            <label className="field">
              <span>
                Current website <small>(optional)</small>
              </span>
              <input name="website" type="url" inputMode="url" placeholder="https://" value={form.website} onChange={set('website')} />
            </label>

            <div className="starter-row">
              <label className="field">
                <span>Budget range</span>
                <select name="budget" value={form.budget} onChange={set('budget')}>
                  {starter.budgets.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Timing</span>
                <select name="timeline" value={form.timeline} onChange={set('timeline')}>
                  {starter.timelines.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>What should your website make easier?</span>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={set('message')}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={described('message', 'message-hint')}
              />
              <small id="message-hint" className="field-hint">
                {tidy('For example: “People keep calling to ask our hours” or “Our site doesn’t look like us anymore.”')}
              </small>
              {err('message')}
            </label>

            <div className="starter-submit">
              <button type="submit" className="button button-lime" disabled={state === 'sending'}>
                {state === 'sending' ? 'SENDING…' : 'SEND IT OVER'} <span aria-hidden="true">↗</span>
              </button>
              <p>{tidy('No hard sell. Just a reply.')}</p>
              {/* Chip again, down here, so you can see him react while you type and hit send. */}
              <div className="submit-chip" aria-hidden="true">
                <Chip pose={pose} look={progress > 0 && progress < 3 ? 'up' : null} />
                <div className="contact-meter" style={{ '--p': progress / 3 }}>
                  <span>{progress === 3 ? 'READY' : `${progress}/3`}</span>
                  <i />
                </div>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
