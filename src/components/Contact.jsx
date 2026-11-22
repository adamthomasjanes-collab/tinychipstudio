import React, { useEffect, useRef, useState } from "react";
import Chip from "../chip/Chip";
import { starter } from "../data";
import { newRef, sendForm } from "../lib/forms";
import { INQUIRY_EVENT } from "../lib/inquiry";
import { bookingProps } from "../lib/booking";
import {
  EMAIL,
  FORM_NAME,
  LOCATION,
  PHONE_DISPLAY,
  PHONE_TEL,
  SCORECARD_URL,
  mailto,
} from "../site";
import { track, trackLead } from "../lib/track";
import { tidy } from "../lib/typography";

const needLabel = (value) => ({
  "New website / not sure which plan": "I need a new website",
  "Not sure yet": "Help me choose",
}[value] ?? value);

const EMPTY = {
  name: "",
  business: "",
  email: "",
  message: "",
  website: "",
  need: "",
  project: "",
  budget: starter.budgets[0],
  timeline: starter.timelines[0],
};
const DRAFT = "tcs-inquiry-draft";
const FIELDS = Object.keys(EMPTY);
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v.trim());

/** Plain-text version of the inquiry, for the email fallback. */
const asText = (f) =>
  [
    `Name: ${f.name}`,
    f.business && `Business: ${f.business}`,
    `Email: ${f.email}`,
    f.website && `Current website: ${f.website}`,
    f.project && `About: ${f.project}`,
    `Looking for: ${f.need || "Not sure yet"}`,
    `Budget: ${f.budget}`,
    `Timing: ${f.timeline}`,
    "",
    "What I’d like my website to make easier:",
    f.message,
  ]
    .filter((l) => l !== false && l !== undefined && l !== "")
    .join("\n");

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = "Please add your name.";
  if (!isEmail(f.email))
    e.email = "Please add an email address we can reply to.";
  if (f.message.trim().length < 10) e.message = "A sentence or two is plenty.";
  return e;
}

const readDraft = () => {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT) || "null");
    return d && typeof d === "object"
      ? Object.fromEntries(
          FIELDS.filter((k) => typeof d[k] === "string").map((k) => [k, d[k]]),
        )
      : null;
  } catch {
    return null;
  }
};
const saveDraft = (f) => {
  try {
    if (FIELDS.some((k) => f[k] && f[k] !== EMPTY[k]))
      sessionStorage.setItem(DRAFT, JSON.stringify(f));
    else sessionStorage.removeItem(DRAFT);
  } catch {
    /* storage blocked: the draft lives in memory for this visit */
  }
};

/**
 * The inquiry form. On phones it comes first: a short line, then the fields.
 * Three things are required (name, email, a sentence); the website is optional,
 * and budget, timing and project type sit behind an optional "add details".
 *
 * Sending never loses what the visitor typed: it stays in the form (and in this
 * tab's session storage) through errors, timeouts and the email fallback.
 */
export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | timeout | failed | fallback
  const [slow, setSlow] = useState(false);
  const [more, setMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const ref = useRef("");
  const started = useRef(false);

  // Chip follows along: the three required fields fill a little pixel meter.
  const progress = [
    form.name.trim(),
    isEmail(form.email),
    form.message.trim().length >= 10,
  ].filter(Boolean).length;
  const busy = state === "sending";
  const pose =
    state === "sent"
      ? "cheer"
      : busy
        ? "think"
        : Object.values(errors).some(Boolean)
          ? "wow"
          : progress === 3
            ? "cheer"
            : "point";

  // Bring back an unsent draft (after a reload, or a trip to another tab).
  useEffect(() => {
    const d = readDraft();
    if (d) setForm((f) => ({ ...f, ...d }));
  }, []);
  useEffect(() => {
    if (state !== "sent") saveDraft(form);
  }, [form, state]);

  // Service cards and case studies add context. Only the context fields change:
  // whatever the visitor already typed stays exactly as it is.
  useEffect(() => {
    const onInquiry = (e) => {
      const { need, project } = e.detail || {};
      setForm((f) => ({
        ...f,
        ...(need ? { need } : {}),
        ...(project ? { project } : {}),
      }));
      setState((s) => (s === "sent" ? s : "idle"));
    };
    window.addEventListener(INQUIRY_EVENT, onInquiry);
    return () => window.removeEventListener(INQUIRY_EVENT, onInquiry);
  }, []);

  useEffect(() => {
    if (
      state === "sent" ||
      state === "fallback" ||
      state === "timeout" ||
      state === "failed"
    )
      doneRef.current?.focus();
    if (state === "sent") {
      trackLead("form-sent");
      saveDraft(EMPTY);
    }
    if (state === "fallback") trackLead("form-fallback");
  }, [state]);

  // Bounded feedback while sending: after a few seconds, say we're still on it.
  useEffect(() => {
    if (!busy) return undefined;
    const t = setTimeout(() => setSlow(true), 6000);
    return () => {
      clearTimeout(t);
      setSlow(false);
    };
  }, [busy]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track("contact_start", {
      context: form.project ? "case-study" : form.need ? "service" : "direct",
    });
  };

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const clear = (k) => setForm((f) => ({ ...f, [k]: "" }));

  const submit = async () => {
    if (form["bot-field"]) return;
    const errs = validate(form);
    setErrors(errs);
    const bad = Object.keys(errs);
    if (bad.length) {
      track("form_error", {
        form: FORM_NAME,
        reason: "validation",
        fields: bad.join(","),
      });
      formRef.current?.querySelector(`[name="${bad[0]}"]`)?.focus();
      return;
    }
    if (!ref.current) ref.current = newRef();
    setState("sending");
    const { "bot-field": _bot, ...fields } = form; // eslint-disable-line no-unused-vars
    const result = await sendForm(FORM_NAME, { ...fields, ref: ref.current });
    if (result === "sent") {
      ref.current = "";
      setState("sent");
      return;
    }
    track("form_error", { form: FORM_NAME, reason: result });
    setState(result === "unavailable" ? "fallback" : result);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!busy) submit();
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
  const described = (k, hint) =>
    [errors[k] && `${k}-error`, hint].filter(Boolean).join(" ") || undefined;
  const emailIt = mailto("Project inquiry — Tiny Chip Studio", asText(form));
  const backToForm = (
    <button
      type="button"
      className="text-link starter-back"
      onClick={() => setState("idle")}
    >
      ← BACK TO YOUR MESSAGE
    </button>
  );

  return (
    <section
      id="contact"
      className="contact contact--v2 section-pad"
      data-guide="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-head">
        <p className="section-tag">Start a project</p>
        <h2 id="contact-title" tabIndex={-1}>
          LET’S FIND <em>THE RIGHT FIT.</em>
        </h2>
        <p className="contact-lede">
          {tidy(
            "A new website, ongoing care or better follow-through? Tell us what would help your business. We’ll reply by email with a clear next step.",
          )}{" "}
          <a href="#clients">Explore our client work →</a>
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-form-col">
          {state === "sent" ? (
            <div
              className="starter-done"
              tabIndex={-1}
              ref={doneRef}
              role="status"
            >
              <div className="done-chip" aria-hidden="true">
                <Chip pose="cheer" />
              </div>
              <p className="section-tag">MESSAGE RECEIVED</p>
              <h3>Thanks, {form.name.split(" ")[0]}. It’s in.</h3>
              <p>
                {tidy(
                  "We read every message and reply by email. Keep an eye on your inbox, and check spam just in case.",
                )}
              </p>
            </div>
          ) : state === "fallback" ? (
            <div className="starter-done" tabIndex={-1} ref={doneRef}>
              <p className="section-tag">ONE MORE STEP</p>
              <h3>Let’s send this by email instead.</h3>
              <p>
                {tidy(
                  "The form couldn’t send from here, so we’ve written the email for you. Open it, check it, and hit send.",
                )}
              </p>
              <a className="button button-lime" href={emailIt}>
                OPEN THE EMAIL <span aria-hidden="true">↗</span>
              </a>
              {backToForm}
            </div>
          ) : state === "timeout" ? (
            <div
              className="starter-done starter-done--warn"
              tabIndex={-1}
              ref={doneRef}
            >
              <p className="section-tag">STILL WAITING TO HEAR BACK</p>
              <h3>We couldn’t confirm it arrived.</h3>
              <p>
                {tidy(
                  "The connection went quiet, so your message may or may not have reached us. Everything you typed is still here. If it did arrive, sending the same message again won’t email us twice.",
                )}
              </p>
              <div className="starter-actions">
                <button
                  type="button"
                  className="button button-lime"
                  onClick={submit}
                >
                  TRY AGAIN <span aria-hidden="true">↻</span>
                </button>
                <a className="text-link" href={emailIt}>
                  EMAIL IT INSTEAD <span aria-hidden="true">↗</span>
                </a>
              </div>
              {backToForm}
            </div>
          ) : state === "failed" ? (
            <div
              className="starter-done starter-done--warn"
              tabIndex={-1}
              ref={doneRef}
            >
              <p className="section-tag">NOT SENT YET</p>
              <h3>That didn’t go through.</h3>
              <p>
                {tidy(
                  "Nothing was sent, and nothing you typed is lost. Check your connection and try again, or send it by email.",
                )}
              </p>
              <div className="starter-actions">
                <button
                  type="button"
                  className="button button-lime"
                  onClick={submit}
                >
                  TRY AGAIN <span aria-hidden="true">↻</span>
                </button>
                <a className="text-link" href={emailIt}>
                  EMAIL IT INSTEAD <span aria-hidden="true">↗</span>
                </a>
              </div>
              {backToForm}
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
              onFocus={onStart}
              noValidate
              aria-labelledby="contact-title"
              aria-busy={busy}
            >
              <input type="hidden" name="form-name" value={FORM_NAME} />
              <p className="starter-trap" aria-hidden="true">
                <label>
                  Leave this empty{" "}
                  <input
                    name="bot-field"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={set("bot-field")}
                  />
                </label>
              </p>

              {(form.project || form.need) && (
                <div className="starter-context">
                  <span className="starter-context-label">ABOUT</span>
                  {form.project && (
                    <span className="starter-chip">
                      {tidy(`A website like ${form.project}`)}
                      <button
                        type="button"
                        onClick={() => clear("project")}
                        aria-label={`Remove “a website like ${form.project}”`}
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {form.need && (
                    <span className="starter-chip">
                      {needLabel(form.need)}
                      <button
                        type="button"
                        onClick={() => clear("need")}
                        aria-label={`Remove “${needLabel(form.need)}”`}
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              <div className="starter-row">
                <label className="field">
                  <span>Your name</span>
                  <input
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={described("name")}
                    required
                  />
                  {err("name")}
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={described("email")}
                    required
                  />
                  {err("email")}
                </label>
              </div>

              <label className="field">
                <span>
                  Business name <small>(optional)</small>
                </span>
                <input
                  name="business"
                  autoComplete="organization"
                  value={form.business}
                  onChange={set("business")}
                />
              </label>
              <fieldset className="starter-needs">
                <legend>What would you like help with?</legend>
                <div className="pill-row">
                  {starter.needs.map((n) => (
                    <label
                      key={n}
                      className={`pill ${form.need === n ? "is-on" : ""}`}
                    >
                      <input
                        type="radio"
                        name="need"
                        value={n}
                        checked={form.need === n}
                        onChange={set("need")}
                      />
                      {needLabel(n)}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="field">
                <span>What should your website make easier?</span>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={described("message", "message-hint")}
                  required
                />
                <small id="message-hint" className="field-hint">
                  {tidy(
                    "A sentence or two is plenty. For example: “Our site no longer feels like us.”",
                  )}
                </small>
                {err("message")}
              </label>

              <label className="field">
                <span>
                  Current website <small>(optional)</small>
                </span>
                <input
                  name="website"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://"
                  value={form.website}
                  onChange={set("website")}
                />
              </label>

              <div className="starter-more">
                <button
                  type="button"
                  className="starter-more-toggle"
                  aria-expanded={more}
                  aria-controls="starter-more"
                  onClick={() => setMore((m) => !m)}
                >
                  <span aria-hidden="true">{more ? "−" : "+"}</span>{" "}
                  {more ? "HIDE PROJECT DETAILS" : "ADD BUDGET & TIMING"}{" "}
                  <em>(OPTIONAL)</em>
                </button>
                <div
                  id="starter-more"
                  className="starter-more-body"
                  hidden={!more}
                >
                  <div className="starter-row">
                    <label className="field">
                      <span>Budget range</span>
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={set("budget")}
                      >
                        {starter.budgets.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      <span>Timing</span>
                      <select
                        name="timeline"
                        value={form.timeline}
                        onChange={set("timeline")}
                      >
                        {starter.timelines.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="starter-submit">
                <button
                  type="submit"
                  className="button button-lime"
                  disabled={busy}
                >
                  {busy ? "SENDING…" : "Send my inquiry"}{" "}
                  <span aria-hidden="true">↗</span>
                </button>
                <p role="status">
                  {busy
                    ? slow
                      ? tidy("Still sending. Hang on a moment.")
                      : tidy("Sending…")
                    : tidy("No hard sell. Just a reply.")}
                </p>
                {/* Chip reacts while you type and hit send. */}
                <div className="submit-chip" aria-hidden="true">
                  <Chip
                    pose={pose}
                    look={progress > 0 && progress < 3 ? "up" : null}
                  />
                  <div
                    className="contact-meter"
                    style={{ "--p": progress / 3 }}
                  >
                    <span>{progress === 3 ? "READY" : `${progress}/3`}</span>
                    <i />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="contact-aside">
          <p className="section-tag">WHAT HAPPENS NEXT</p>
          <ol className="contact-next">
            {starter.next.map((t, i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                {tidy(t)}
              </li>
            ))}
          </ol>
          <div className="contact-ledge">
            <p className="section-tag">PREFER ANOTHER WAY?</p>
            <a
              className="text-link"
              {...bookingProps("contact", "book-call-contact")}
            >
              BOOK A 15-MINUTE CALL <span aria-hidden="true">↗</span>
              <span className="visually-hidden">
                {" "}
                (opens the calendar in a new tab)
              </span>
            </a>
            <a
              className="text-link"
              href={SCORECARD_URL}
              data-track="scorecard"
            >
              Take the free 2-minute website scorecard
            </a>
            <small>No email needed to see your results.</small>
          </div>
          <div className="contact-details">
            <a href={mailto()}>{EMAIL} ↗</a>
            <button type="button" className="copy-email" onClick={copyEmail}>
              {copied ? "COPIED ✓" : "COPY EMAIL"}
            </button>
            <span className="visually-hidden" role="status">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY} ↗</a>
            <span>{`${LOCATION} / REMOTE PROJECTS WELCOME`.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
