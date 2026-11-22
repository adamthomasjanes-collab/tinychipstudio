import React, { useRef, useState } from 'react';
import { projects } from '../projects';
import { transformations } from '../transformations';
import { tidy, names } from '../lib/typography';
import { startInquiry } from '../lib/inquiry';
import BeforeAfter from '../fx/BeforeAfter';
import { websiteAction } from '../lib/project-links';
import { track } from '../lib/track';

const byId = (id) => projects.find((p) => p.id === id);

/**
 * Before / after: real businesses, their site as we found it, our redesign,
 * and the three things we changed and why. Each one is labelled exactly
 * (concept, approved design…). Hired work lives in Clients.jsx.
 */
export default function Work({ onOpen }) {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const t = transformations[active];
  const project = byId(t.project);

  const onKey = (e) => {
    const n = transformations.length;
    const go = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: n - 1 }[e.key];
    if (go === undefined) return;
    e.preventDefault();
    const next = (go + n) % n;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="work" className="work section-pad on-dark" data-guide="work" aria-labelledby="work-title">
      <div className="work-heading">
      <div className="work-heading-copy">
      <h2 id="work-title" className="display-head reveal">
        BEFORE. AFTER.
        <br />
        <em>AND WHY.</em>
      </h2>
      <p className="work-intro">
        {tidy(
          'Drag Chip to compare. Read the story behind each design, or explore the website where a demo is available.',
        )}
      </p>

      </div>
      <div className="ba-picker"><p className="section-tag">CHOOSE A BEFORE &amp; AFTER</p>
      <div className="ba-tabs" role="tablist" aria-label="Before and after projects" onKeyDown={onKey}>
        {transformations.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => (tabs.current[i] = el)}
            type="button"
            role="tab"
            id={`ba-tab-${x.id}`}
            aria-selected={i === active}
            aria-controls="ba-panel"
            tabIndex={i === active ? 0 : -1}
            className="ba-tab"
            onClick={() => { setActive(i); track('comparison_select', { project: x.id }); }}
          >
            <span className="ba-tab-n">{String(i + 1).padStart(2, '0')}</span>
            {/* Compact labels need word breaks, including older data with NBSPs. */}
            <strong>{x.name.replace(/\u00a0/g, ' ')}</strong>
            <small>{x.place.replace(/\u00a0/g, ' ')}</small>
          </button>
        ))}
      </div>

      </div></div>

      <div className="ba-panel" id="ba-panel" role="tabpanel" aria-labelledby={`ba-tab-${t.id}`} key={t.id}>
        <div className="ba-media">
          <BeforeAfter before={t.before} after={t.after} label={t.name} url={t.url ? t.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${t.name} · archived design`} />
          <p className="ba-notes">
            <span>BEFORE / {t.before.note}</span>
            <span>AFTER / {t.after.note}</span>
          </p>
        </div>

        <div className="ba-story">
          <p className={`ba-status ba-status--${t.kind}`}>{t.status}</p>
          <h3>{names(t.name)}</h3>
          <p className="ba-idea">{tidy(t.headline)}</p>
          <p className="ba-sector">
            {names(t.sector)} · {names(t.place)}
          </p>

          <div className="ba-explore">
            {t.url && <a className="button button-lime" href={t.url} target="_blank" rel="noopener noreferrer" onClick={() => track('concept_open', { project: t.id, source: 'comparison' })}>
              {websiteAction(t.kind)} <span aria-hidden="true">↗</span>
            </a>}
            <p>{t.url ? 'Explore the website · opens in a new tab' : 'Archived design · screenshots and case study available here'}</p>
            {project && <button type="button" className="text-link" onClick={(e) => { track('case_study_open', { project: t.id, source: 'comparison' }); onOpen(project, e.currentTarget); }}>READ CASE STUDY <span aria-hidden="true">↑</span></button>}
          </div>

          <details className="ba-way-more">
            <summary>WHAT WAS IN THE WAY</summary>
            <ul className="ba-way">
              {t.inTheWay.map((w) => (
                <li key={w}>{tidy(w)}</li>
              ))}
            </ul>
          </details>

          <h4 className="ba-h">WHAT WE CHANGED → WHY</h4>
          <ol className="ba-moves">
            {t.moves.map((m, i) => (
              <li key={m.did}>
                <span className="ba-move-n">{String(i + 1).padStart(2, '0')}</span>
                <p className="ba-did">{tidy(m.did)}</p>
                <p className="ba-why">
                  <span>WHY</span> {tidy(m.why)}
                </p>
              </li>
            ))}
          </ol>

          {t.game && (
            <p className="ba-game">
              <a className="text-link" href={t.game.url} target="_blank" rel="noopener noreferrer" data-track={`work-${t.id}-game`}>
                PLAY {t.game.name.toUpperCase()} ↗<span className="visually-hidden"> (opens in a new tab)</span>
              </a>
              <span>{t.game.description}</span>
            </p>
          )}

          <div className="ba-actions">
            <button type="button" className="text-link" onClick={() => startInquiry({ project: t.name, source: `work-${t.id}` })}>
              TALK ABOUT A WEBSITE LIKE THIS <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </div>

      <p className="work-note">
        {tidy('Concepts are independent redesigns—not commissioned work. No business results are claimed.')}
      </p>
    </section>
  );
}
