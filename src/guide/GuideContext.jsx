import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CREW } from '../chip/sprite';
import { track } from '../lib/track';

/**
 * Chip the guide + the hidden crew.
 *
 * Sections opt in with data-guide="key"; the floating guide shows the line for
 * whichever section is in view. Crew members hidden around the page call
 * `find(key)`. Progress is kept in localStorage purely as a convenience: if
 * storage is unavailable the game still works for the visit.
 */

export const HIDDEN = ['byte', 'pixel', 'glitch', 'boot', 'bit'];

const STORE = 'tcs-crew-v1';
const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(v) ? v.filter((k) => HIDDEN.includes(k)) : [];
  } catch {
    return [];
  }
};
const write = (v) => {
  try {
    localStorage.setItem(STORE, JSON.stringify(v));
  } catch {
    /* private mode / blocked storage: progress lasts for this visit only */
  }
};

const Ctx = createContext(null);

export function GuideProvider({ children }) {
  const [found, setFound] = useState([]);
  const [news, setNews] = useState(null); // a found-crew moment: { key, text, done }
  const foundRef = useRef([]);
  const timer = useRef(0);

  useEffect(() => {
    foundRef.current = read();
    setFound(foundRef.current);
    return () => clearTimeout(timer.current);
  }, []);

  const find = useCallback((key) => {
    if (foundRef.current.includes(key)) return;
    const next = [...foundRef.current, key];
    foundRef.current = next;
    setFound(next);
    write(next);
    const c = CREW[key];
    const done = next.length === HIDDEN.length;
    // How many people play, and how far they get: "found" is 1 for a first find, 5 when they finish.
    track('crew_found', { crew: key, found: next.length });
    if (done) track('crew_complete');
    setNews({
      key,
      done,
      text: done
        ? 'That’s the whole crew! You notice the details. So do we.'
        : `You found ${c.name}! ${c.role}. ${next.length} of ${HIDDEN.length}.`,
    });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNews(null), done ? 9000 : 4200);
  }, []);

  const reset = useCallback(() => {
    foundRef.current = [];
    write([]);
    setFound([]);
  }, []);

  const value = useMemo(() => ({ found, find, news, reset, total: HIDDEN.length }), [found, find, news, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useGuide = () => useContext(Ctx);
