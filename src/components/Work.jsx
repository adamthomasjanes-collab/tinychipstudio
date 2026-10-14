import React, { useRef, useState } from 'react';
import { projects } from '../projects';
import { clientWork, transformations } from '../transformations';
import { tidy, names } from '../lib/typography';
import BeforeAfter from '../fx/BeforeAfter';
import CrewMember from '../guide/CrewMember';

const byId = (id) => projects.find((p) => p.id === id);

/**
 * The work, in two parts:
 *  1. Before / after: five real businesses, their site as we found it, our
 *     redesign, and the three things we changed and why.
 *  2. Hired work: the client projects, each opening the full case-study sheet.
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
    <section id="work" className="work section-pad on-dark" data-guide="work">
      <div className="section-top">
        <p className="section-tag">[ 03 / BEFORE &amp; AFTER ]</p>
        <span>WHAT WE CHANGED. AND WHY.</span>
      </div>
      <h2 className="display-head reveal">
        BEFORE. AFTER.
        <br />
        <em>AND WHY.</em>
      </h2>
      <p className="work-intro">
        {tidy(
          'Real Ohio businesses, their websites as we found them, and what we changed. Drag Chip to compare. Every project says plainly whether it was hired work, an approved design or a concept.',
        )}
      </p>

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
            onClick={() => setActive(i)}
          >
            <span className="ba-tab-n">0{i + 1}</span>
            <strong>{names(x.name)}</strong>
            <small>{names(x.place)}</small>
          </button>
        ))}
      </div>

      <div className="ba-panel" id="ba-panel" role="tabpanel" aria-labelledby={`ba-tab-${t.id}`} key={t.id}>
        <div className="ba-media">
          <BeforeAfter before={t.before} after={t.after} label={t.name} url={t.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} />
          <p className="ba-notes">
            <span>BEFORE / {t.before.note}</span>
            <span>AFTER / {t.after.note}</span>
          </p>
        </div>

        <div className="ba-story">
          <p className={`ba-status ba-status--${t.kind}`}>{t.status}</p>
          <h3>{tidy(t.headline)}</h3>
          <p className="ba-sector">
            {names(t.sector)} · {names(t.place)}
          </p>

          <h4 className="ba-h">WHAT WAS IN THE WAY</h4>
          <ul className="ba-way">
            {t.inTheWay.map((w) => (
              <li key={w}>{tidy(w)}</li>
            ))}
          </ul>

          <h4 className="ba-h">WHAT WE CHANGED → WHY</h4>
          <ol className="ba-moves">
            {t.moves.map((m, i) => (
              <li key={m.did}>
                <span className="ba-move-n">0{i + 1}</span>
                <p className="ba-did">{tidy(m.did)}</p>
                <p className="ba-why">
                  <span>WHY</span> {tidy(m.why)}
                </p>
              </li>
            ))}
          </ol>

          <div className="ba-actions">
            <a className="button button-lime" href={t.url} target="_blank" rel="noopener noreferrer" data-track={`work-${t.id}`}>
              {t.linkLabel} <span aria-hidden="true">↗</span>
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            {project && (
              <button type="button" className="text-link" onClick={() => onOpen(project)}>
                OPEN THE FULL CASE FILE ↑
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hired">
        <div className="hired-head">
          <p className="section-tag">HIRED WORK / LIVE NOW</p>
          <h3>{tidy('Real clients. Real websites. Their words.')}</h3>
        </div>
        <div className="work-grid work-grid--hired">
          {clientWork.map(byId).filter(Boolean).map((p, i) => (
            <article key={p.id} className={`project project-${i}`} style={{ '--project-color': p.color }}>
              <button type="button" className="project-hit" onClick={() => onOpen(p)} aria-label={`Open ${p.name} case study`}>
                <div className="project-image">
                  <img src={p.image} alt={p.alt} width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" />
                  <span className="project-circle" aria-hidden="true">↗</span>
                </div>
                <div className="project-caption">
                  <div>
                    <span className="project-number">{p.type}</span>
                    <h3>{names(p.name)}</h3>
                    <p>{names(p.sector)}</p>
                    {p.quote && (
                      <q className="project-quote">
                        {tidy(p.quote.text)} <cite>{names(p.quote.by)}</cite>
                      </q>
                    )}
                  </div>
                  <span className="project-action" aria-hidden="true">PULL UP THE FILE ↑</span>
                </div>
              </button>
              {i === 1 && <CrewMember crew="byte" pose="wow" peek="up" className="crew-on-card" />}
            </article>
          ))}
        </div>
      </div>

      <p className="work-note">
        {tidy('Concepts are our own redesigns of real businesses’ websites, made to show what we’d change. They weren’t commissioned, and we don’t claim results for them.')}
      </p>
    </section>
  );
}
