import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const blockedNames = new Set([
  '.env', '.git', '.netlify', 'node_modules', 'src', 'docs', 'scripts',
  'source-archive', '_source', '_backup-before-v17', 'package.json',
  'package-lock.json', 'README.md', 'README.txt',
]);
const blockedExtensions = new Set(['.zip', '.exe', '.py', '.ps1', '.md', '.map', '.pyd']);
const findings = [];
let count = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (blockedNames.has(entry.name) || blockedExtensions.has(extname(entry.name).toLowerCase()) || entry.name.startsWith('.env')) {
      findings.push(path.slice(root.length + 1));
      continue;
    }
    if (entry.isSymbolicLink()) findings.push(path.slice(root.length + 1));
    else if (entry.isDirectory()) await walk(path);
    else count++;
  }
}

await walk(root);
const forbiddenReviewCopy = /PREVIEW FOR ADAM|FOR ADAM[’']S APPROVAL|REVIEW PROPOSED CHANGES|New-client proposal: 30 minutes|Proposed qualifying terms|no numeric usage allowance has been approved yet/i;
for (const path of ['index.html', 'llms.txt', 'tiffin/index.html', 'findlay/index.html', 'fremont/index.html', 'bowling-green/index.html', 'toledo/index.html', 'sandusky/index.html', 'port-clinton/index.html']) {
  const file = join(root, path);
  if (existsSync(file) && forbiddenReviewCopy.test(await readFile(file, 'utf8'))) {
    findings.push('[internal review copy in published file] ' + path);
  }
}
for (const path of ['badge/tcs-badge.js', 'index.html', 'privacy.html', 'og-image.png', 'tiffin/index.html']) {
  if (!existsSync(join(root, path))) findings.push('[missing published runtime] ' + path);
}
if (findings.length) throw new Error(`publish audit blocked ${findings.length} paths:\n${findings.slice(0, 30).join('\n')}`);
console.log(`publish audit: ${count} public files, no source or archive paths`);
