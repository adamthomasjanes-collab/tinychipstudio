import React from 'react';
import { BADGE_CSS, badgeHtml } from './badge-kit.js';
import { BADGE_URL } from '../site';

const LABEL = BADGE_URL.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Live preview of the client-site footer badge (same markup as the embed). */
export default function Badge({ theme = 'dark' }) {
  return (
    <span className={`badge-preview badge-preview--${theme}`}>
      <style>{BADGE_CSS}</style>
      {/* eslint-disable-next-line react/no-danger */}
      <span dangerouslySetInnerHTML={{ __html: badgeHtml({ href: BADGE_URL, label: LABEL }) }} />
    </span>
  );
}
