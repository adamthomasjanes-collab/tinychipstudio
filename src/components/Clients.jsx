import React from 'react';
import { projects } from '../projects';
import { clientWork } from '../transformations';
import { names, tidy } from '../lib/typography';
import CrewMember from '../guide/CrewMember';

const byId = (id) => projects.find((p) => p.id === id);

// Phone-sized copies of the 1280px previews (public/assets/work/*-768.webp).
const srcSet = (src) => (/\.webp$/.test(src) ? `${src.replace(/\.webp$/, '-768.webp')} 768w, ${src} 1280w` : undefined);

export default function Clients({ onOpen }) {
  const rest = clientWork.filter((id) => id !== 'chief-dj').map(byId).filter(Boolean);

  return (
    <section id="clients" className="clients section-pad on-dark" data-guide="guide" aria-labelledby="clients-title">
      <h2 id="clients-title" className="clients-title reveal">
        REAL CLIENTS. <em>LIVE WEBSITES.</em>
      </h2>

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
