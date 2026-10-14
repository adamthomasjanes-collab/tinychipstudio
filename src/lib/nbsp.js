// House typography rules, shared by the React site (via typography.jsx) and the
// static city pages (scripts/cities.mjs). Plain JS, no JSX, so Node can import it.
//
//  1. Proper nouns never split across lines: "Port Clinton", "Tiny Chip Studio",
//     "Wood County", "Bowling Green, Ohio".
//  2. A non-breaking space joins the first two and last two words of every
//     sentence (no one-word first lines, no widows).

export const NBSP = ' ';

// Multi-word names that must stay on one line. Longest first so the
// longer name wins when one contains another.
const PROPER_NOUNS = [
  'Bowling Green State University',
  'Rutherford B. Hayes Presidential Library',
  'AM’s Mystical Treasures',
  'Tiny Chip Studio',
  'Adam Thomas Janes',
  'J&T Auto Service',
  'Crush Wine Bar',
  'DeBacco | Mancinetti',
  'DeBacco Mancinetti',
  'Heidelberg University',
  'Tiffin University',
  'University of Findlay',
  'Northwest Ohio',
  'Lake Erie',
  'Cedar Point',
  'Port Clinton',
  'Bowling Green',
  'Pioneer Mill',
  'Camp Perry',
  'Joshua Janes',
  'Sandusky Bay',
  'Sandusky River',
  'Flag City',
  'Google Search Console',
  'Google Business Profile',
  'Google Analytics',
  'Microsoft Clarity',
].sort((a, b) => b.length - a.length);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NAMES_RE = new RegExp(PROPER_NOUNS.map((n) => escapeRe(n).replace(/ /g, '[ \\u00a0]')).join('|'), 'g');

// "Tiffin, Ohio" / "Toledo, OH". Two-word towns ("Port Clinton") are already
// joined by the list above, so this only needs to glue the last word to the state.
const CITY_STATE_RE = /\b([A-Z][\w’'-]*), (Ohio|OH)\b/g;
// "Seneca County", "Ottawa County"
const COUNTY_RE = /\b([A-Z][a-z]+) (County)\b/g;

const glue = (s) => s.replace(/ /g, NBSP);

/** Rule 1 only: keep proper nouns together. Safe on labels, names and headings. */
export function names(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(NAMES_RE, glue)
    .replace(CITY_STATE_RE, glue)
    .replace(COUNTY_RE, glue);
}

/** Rules 1 and 2. Use on sentences and paragraphs. */
export function tidy(text) {
  if (typeof text !== 'string') return text;
  return names(text)
    // Split on ordinary spaces only, so "B. Hayes" doesn't read as a sentence end.
    .split(/(?<=[.!?…]) +/)
    .map((sentence) => {
      const words = sentence.split(' ');
      if (words.length < 2) return sentence;
      if (words.length <= 3) return words.join(NBSP);
      const head = words.slice(0, 2).join(NBSP);
      const tail = words.slice(-2).join(NBSP);
      return `${head} ${words.slice(2, -2).join(' ')} ${tail}`.replace(/ {2,}/g, ' ');
    })
    .join(' ');
}
