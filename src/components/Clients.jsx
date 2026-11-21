import React from 'react';
import { projects } from '../projects';
import { clientWork } from '../transformations';
import { names, tidy } from '../lib/typography';
import CrewMember from '../guide/CrewMember';

const byId = (id) => projects.find((p) => p.id === id);
const FEATURED = 'chief-dj';
// Phone-sized copies of the 1280px previews (public/assets/work/*-768.webp).
const srcSet = (src) => (/\.webp$/.test(src) ? `${src.replace(/\.webp$/, '-768.webp')} 768w, ${src} 1280w` : undefined);

/**
 * Hired work, straight after the hero: one real client up front with their own
 * words, the other client projects beside it. Only the statuses the projects
 * already carry; no results are claimed.
 */
export default function Clients({ onOpen }) {
  const f = byId(FEATURED);
  const rest = clientWork.filter((id) => id !== FEATURED).map(byId).filter(Boolean);

  return (
    <section id="clients" className="clients section-pad on-dark" data-guide="guide" aria-labelledby="clients-title">
      <div className="section-top">
        <p className="section-tag">[ 02 / CLIENT WORK ]</p>
        <span>REAL CLIENTS. THEIR WORDS.</span>
      </div>
      <h2 id="clients-title" className="clients-title reveal">
        REAL CLIENTS. <em>LIVE WEBSITES.</em>
      </h2>

      <article className="client-feature" style={{ '--project-color': f.color }}>
        <button type="button" className="client-feature-image" onClick={(e) => onOpen(f, e.currentTarget)} aria-label={`Open the ${f.name} case study`}>
          <img src={f.image} srcSet={srcSet(f.image)} sizes="(max-width: 900px) 92vw, 52vw" alt={f.alt} width={f.imageSize[0]} height={f.imageSize[1]} loading="lazy" decoding="async" />
        </button>
        <div className="client-feature-copy">
          <p className="client-status">
            {f.status} · {names(f.sector)}
          </p>
          <h3>{names(f.name)}</h3>
          <p className="client-headline">{tidy(f.headline)}</p>
          <p>{tidy(f.summary)}</p>
          <figure className="client-quote">
            <blockquote>
              <p>“{tidy(f.quote.text)}”</p>
            </blockquote>
            <figcaption>{names(f.quote.by)}</figcaption>
          </figure>
          <div className="client-actions">
            <a className="button button-lime" href={f.url} target="_blank" rel="noopener noreferrer" data-track={`client-open-${f.id}`}>OPEN CLIENT WEBSITE ↗<span className="visually-hidden"> (opens in a new tab)</span></a>
            <button type="button" className="text-link" onClick={(e) => onOpen(f, e.currentTarget)}>READ CASE STUDY ↑</button>
          </div>
        </div>
      </article>

      <div className="client-more">
        {rest.map((p, i) => (
          <article key={p.id} className="client-card" style={{ '--project-color': p.color }}>
            <button type="button" className="client-card-hit" onClick={(e) => onOpen(p, e.currentTarget)}>
              <img src={p.image} srcSet={srcSet(p.image)} sizes="(max-width: 700px) 92vw, 45vw" alt="" width={p.imageSize[0]} height={p.imageSize[1]} loading="lazy" decoding="async" />
              <span className="client-status">{p.type}</span>
              <span className="client-card-name">{names(p.name)}</span>
              {p.quote ? (
                <span className="client-card-quote">
                  <q>{tidy(p.quote.text)}</q> <cite>{names(p.quote.by.split(',')[0])}</cite>
                </span>
              ) : (
                <span className="client-card-line">{tidy(p.headline)}</span>
              )}
              <span className="client-card-open">
                READ CASE STUDY <span aria-hidden="true">↑</span>
              </span>
            </button>
            {i === 0 && <CrewMember crew="byte" pose="wow" peek="up" className="crew-on-card" />}
          </article>
        ))}
      </div>
      <p className="client-gallery-bridge"><a className="text-link" href="#work">EXPLORE BEFORE &amp; AFTER REDESIGNS ↓</a></p>
    </section>
  );
}
