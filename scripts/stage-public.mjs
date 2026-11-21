import { cp, mkdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public');
const output = join(root, 'dist');

// Publish only the studio's own pages, badges and portfolio assets.
const publicFiles = [
  '404.html', 'apple-touch-icon.png', 'favicon-32.png', 'favicon.svg',
  'humans.txt', 'icon-192.png', 'icon-512.png', 'llms.txt', 'og-image.png',
  'privacy.html', 'robots.txt', 'site.webmanifest', 'sitemap.xml',
];
const publicDirs = [
  'assets', 'badge', 'brand',
  'bowling-green', 'findlay', 'fremont',
  'port-clinton', 'sandusky', 'tiffin', 'toledo',
];

for (const path of publicFiles) {
  await mkdir(dirname(join(output, path)), { recursive: true });
  await cp(join(source, path), join(output, path));
}
for (const path of publicDirs) {
  // Badge integration notes are repository documentation, not public assets.
  await cp(join(source, path), join(output, path), {
    recursive: true,
    filter: (file) => extname(file).toLowerCase() !== '.md',
  });
}

console.log(`stage-public: copied ${publicFiles.length} files and ${publicDirs.length} approved folders`);
