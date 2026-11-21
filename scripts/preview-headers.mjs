import { writeFile } from 'node:fs/promises';

await writeFile(new URL('../dist/_headers', import.meta.url), '/*\n  X-Robots-Tag: noindex, nofollow\n');
