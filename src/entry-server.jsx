// Server entry used only at build time by scripts/prerender.mjs. It renders the
// page to plain HTML so search engines and AI crawlers that don't run JavaScript
// still see every word. The browser entry is still src/main.jsx.
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export const render = () => renderToString(<App />);
