import React from 'react';
import { tidy, names, NBSP } from './nbsp';

/**
 * House typography rules live in ./nbsp.js (shared with the static city pages):
 *  - proper nouns never split ("Port Clinton", "Tiny Chip Studio", "Tiffin, Ohio");
 *  - a non-breaking space joins the first two and last two words of every sentence.
 * tidy() = both rules, for sentences. names() = proper nouns only, for labels.
 */
export { tidy, names, NBSP };

/** tidy() plus **bold** markers, for the rare inline emphasis. */
export function rich(text) {
  return tidy(text)
    .split(/\*\*(.+?)\*\*/)
    .map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}
