import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './style.css';
import './chip/chip.css';
import './site.css';
import './conversion.css';
import './responsive.css';

// The build prerenders the whole page into #root (scripts/prerender.mjs). Hydrate
// that markup instead of throwing it away: the headline, copy and buttons that are
// already on screen stay put (no second paint of the LCP headline), and React just
// attaches behaviour. Without prerendered markup (dev server), render from scratch.
const root = document.getElementById('root');
if (root.hasAttribute('data-prerendered')) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);

if (__QA_ENABLED__ && new URLSearchParams(location.search).get('qa') === '1') {
  const previewHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || (location.hostname.endsWith('.netlify.app') && location.hostname.includes('--'));
  if (previewHost) import('./qa/diagnostics').then(({ installDiagnostics }) => installDiagnostics());
}
