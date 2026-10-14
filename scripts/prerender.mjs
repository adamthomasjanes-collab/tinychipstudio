// Runs after `vite build`. Renders <App /> to static HTML and places it inside
// <div id="root"> in dist/index.html, so the page is readable without JavaScript
// (search engines, AI crawlers, link previews, slow phones). src/main.jsx then
// replaces it with the live app.
//
// Never fails the deploy: if anything goes wrong, it logs a warning and leaves
// the normal single-page build in place.
import { build } from 'vite';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ssrOut = join(root, '.ssr');
const page = join(root, 'dist', 'index.html');

try {
  await build({
    root,
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.jsx', outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
  });
  const { render } = await import(pathToFileURL(join(ssrOut, 'entry-server.js')).href);
  const markup = render();
  if (!markup || markup.length < 1000) throw new Error(`rendered markup looks empty (${markup?.length ?? 0} bytes)`);

  const html = await readFile(page, 'utf8');
  if (!html.includes('<div id="root"></div>')) throw new Error('could not find <div id="root"></div> in dist/index.html');
  await writeFile(page, html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${markup}</div>`));
  console.log(`prerender: wrote ${Math.round(markup.length / 1024)} KB of static HTML into dist/index.html`);
} catch (error) {
  console.warn(`prerender: skipped, the site still works as a normal single-page app. Reason: ${error?.stack || error}`);
} finally {
  await rm(ssrOut, { recursive: true, force: true });
}
