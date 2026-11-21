import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chip from '../chip/Chip';
import { answerOptions, evaluateScorecard, planningSteps, questions, scorecardHandoff, scorecardText } from '../scorecard';
import { sendForm } from '../lib/forms';
import { track, trackLead } from '../lib/track';
import { tidy } from '../lib/typography';
import { bookingProps } from '../lib/booking';

const STAGES = [
  { value: 'established', label: "Yes, it’s been live a while" },
  { value: 'new', label: "Yes, it’s fairly new" },
  { value: 'planning', label: "No, we’re planning one" },
];

const MOOD = { 2: 'cheer', 1: 'think', 0: 'wow', null: 'think' };

/**
 * The scorecard, one question at a time. Chip reacts to each answer. Results
 * show straight away, with no email gate. After the results there's an
 * optional, free "send me the first fix" that comes to the studio as a warm
 * lead, with the visitor's own answers attached. (The full written website
 * review is a separate, paid service.)
 *
 * Each step replaces the buttons that were just pressed, so focus moves to the
 * new question's heading; otherwise it would fall back to <body>.
 */
export default function ScorecardPanel() {
  const [stage, setStage] = useState(null);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [last, setLast] = useState(undefined);
  const [lead, setLead] = useState({ name: '', email: '', website: '' });
  const [sent, setSent] = useState('idle'); // idle | sending | sent | error
  const [copied, setCopied] = useState(false);
  const headRef = useRef(null);
  const moved = useRef(false);

  const done = stage === 'planning' || (stage && i >= questions.length);
  const report = useMemo(() => (done ? evaluateScorecard(answers, stage) : null), [done, answers, stage]);

  // After the first step, every change of question (or the results) takes focus.
  useEffect(() => {
    if (!moved.current) return;
    headRef.current?.focus();
  }, [stage, i, done]);
  const step = (fn) => {
    moved.current = true;
    fn();
  };

  const answer = (q, v) => {
    setAnswers((a) => ({ ...a, [q.id]: v }));
    setLast(v);
    setI((n) => n + 1);
    if (i + 1 >= questions.length) trackLead('scorecard-finished');
  };

  const sendPlan = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(lead.email.trim())) { setSent('invalid'); return; }
    setSent('sending');
    const result = await sendForm('scorecard-plan', { ...lead, stage, summary: scorecardHandoff(report), full: scorecardText(report, answers) });
    setSent(result === 'sent' ? 'sent' : result === 'timeout' ? 'timeout' : 'error');
    if (result === 'sent') trackLead('scorecard-plan');
    else track('form_error', { form: 'scorecard-plan', reason: result });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(scorecardText(report, answers));
      setCopied(true);
    } catch {
      /* clipboard blocked; the plan is on screen */
    }
  };

  if (!stage) {
    return (
      <div className="sc">
        <div className="sc-q">
          <Chip pose="point" className="sc-chip" />
          <div>
            <p className="sc-count">BEFORE WE START</p>
            <h3 tabIndex={-1} ref={headRef}>Do you have a website right now?</h3>
            <p className="sc-help">{tidy("Fifteen quick questions, about two minutes. You’ll see your results right away, no email needed.")}</p>
            <div className="sc-options">
              {STAGES.map((s) => (
                <button key={s.value} type="button" className="sc-opt" onClick={() => step(() => { setStage(s.value); trackLead('scorecard-start'); })}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!done) {
    const q = questions[i];
    return (
      <div className="sc">
        <div className="sc-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={i} aria-label="Questions answered">
          <i style={{ '--p': i / questions.length }} />
        </div>
        <div className="sc-q" key={q.id}>
          <Chip pose={last === undefined ? 'idle' : MOOD[last]} className="sc-chip" />
          <div>
            <p className="sc-count">
              QUESTION {i + 1} OF {questions.length}
            </p>
            <h3 id="sc-question" tabIndex={-1} ref={headRef}>{q.question}</h3>
            <p className="sc-help">{tidy(q.helper)}</p>
            <div className="sc-options">
              {answerOptions.map((o) => (
                <button key={o.label} type="button" className={`sc-opt ${answers[q.id] === o.value && q.id in answers ? 'is-picked' : ''}`} aria-pressed={q.id in answers && answers[q.id] === o.value} onClick={() => step(() => answer(q, o.value))}>
                  {o.label}
                </button>
              ))}
            </div>
            {i > 0 && (
              <button type="button" className="text-link sc-back" onClick={() => step(() => setI((n) => n - 1))}>
                ← BACK
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc sc-results">
      {stage === 'planning' ? (
        <section className="sc-block">
          <p className="sc-count">YOUR STARTING PLAN</p>
          <h3 tabIndex={-1} ref={headRef}>{tidy('No site yet? Good. You get to start in the right order.')}</h3>
          <ol className="sc-plan">
            {planningSteps.map((s) => (
              <li key={s.title}>
                <strong>{s.title}</strong>
                <span>{tidy(s.copy)}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <>
          <section className="sc-block">
            <p className="sc-count">YOUR RESULTS · BASED ON YOUR ANSWERS, NOT A SCAN</p>
            <h3 tabIndex={-1} ref={headRef}>
              {report.strengths.length} strengths. {report.concerns.length} things to look at. {report.unknowns.length} worth checking.
            </h3>
            <ul className="sc-cats">
              {report.categories.map((c) => (
                <li key={c.area} className={`sc-cat sc-cat--${c.level.replace(/\s+/g, '-').toLowerCase()}`}>
                  <span>{c.label}</span>
                  <strong>{c.level}</strong>
                  <i style={{ '--p': c.possible ? c.score / c.possible : 0 }} aria-hidden="true" />
                </li>
              ))}
            </ul>
          </section>

          <section className="sc-block">
            <p className="sc-count">START HERE</p>
            {report.priorities.length ? (
              <ol className="sc-fixes">
                {report.priorities.map((q) => (
                  <li key={q.id}>
                    <h4>{q.title}</h4>
                    <p>
                      <span>WHY</span> {tidy(q.why)}
                    </p>
                    <p>
                      <span>TRY</span> {tidy(q.try)}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>{tidy('Nothing you answered points to a problem. Verify the “not sure” items, and keep doing what works.')}</p>
            )}
          </section>
        </>
      )}

      <section className="sc-block sc-lead">
        <Chip pose={sent === 'sent' ? 'cheer' : 'wave'} className="sc-chip" />
        {sent === 'sent' ? (
          <div role="status">
            <h3>{tidy(`On its way, ${lead.name.split(' ')[0] || 'friend'}.`)}</h3>
            <p>{tidy("Adam reads every one. You’ll get your plan back with the first fix we’d make—within 24 hours, and never more than 48.")}</p>
          </div>
        ) : (
          <form onSubmit={sendPlan} noValidate>
            <h3>{tidy('Want a second set of eyes on it?')}</h3>
            <p>{tidy("Send us your results. A real person (Adam) looks at your site and replies with the one fix we’d make first. That suggestion is free, with no sales call unless you ask for one.")}</p>
            <p className="sc-note">{tidy('Want the whole picture? A full written website review is a separate, paid service, with scope and fee agreed first.')}</p>
            <div className="sc-fields">
              <label>
                <span>Name</span>
                <input name="name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required value={lead.email} aria-invalid={sent === 'invalid'} aria-describedby={sent === 'invalid' || sent === 'error' || sent === 'timeout' ? 'sc-lead-error' : undefined} onChange={(e) => { setLead({ ...lead, email: e.target.value }); if (sent === 'invalid') setSent('idle'); }} />
              </label>
              {stage !== 'planning' && (
                <label>
                  <span>Website (optional)</span>
                  <input name="website" type="url" inputMode="url" placeholder="yourbusiness.com" value={lead.website} onChange={(e) => setLead({ ...lead, website: e.target.value })} />
                </label>
              )}
            </div>
            {sent === 'invalid' && <p className="field-error" id="sc-lead-error" role="alert">{tidy('Please add an email address we can reply to.')}</p>}
            {sent === 'error' && <p className="field-error" id="sc-lead-error" role="alert">{tidy('That didn’t go through, and nothing was sent. Try again, or copy your results and email them to us.')}</p>}
            {sent === 'timeout' && <p className="field-error" id="sc-lead-error" role="alert">{tidy('We couldn’t confirm it arrived. It may still reach us; sending the same results again won’t email us twice.')}</p>}
            <div className="sc-actions">
              <button type="submit" className="button button-lime" disabled={sent === 'sending'}>
                {sent === 'sending' ? 'SENDING…' : 'SEND ME THE FIRST FIX'} <span aria-hidden="true">↗</span>
              </button>
              <a className="text-link" {...bookingProps('scorecard', 'book-call-scorecard')}>
                OR BOOK A 15-MINUTE CALL ↗<span className="visually-hidden"> (opens the calendar in a new tab)</span>
              </a>
              {stage !== 'planning' && (
                <button type="button" className="text-link" onClick={copy}>
                  {copied ? 'COPIED ✓' : 'COPY MY RESULTS'}
                </button>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
