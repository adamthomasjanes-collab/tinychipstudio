import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { rmSync } from 'node:fs';
const require = createRequire(import.meta.url);

// Always produce the manual checklist alongside completed browser results,
// including runs with assertion failures. Never reuse an earlier run's JSON.
rmSync('test-results/qa-results.json', { force: true });
const run = spawnSync(process.execPath, [
  require.resolve('@playwright/test/cli'), 'test', '--grep', '@social',
  '--project', 'chromium-phone', '--project', 'webkit-phone',
], {stdio: 'inherit'});
const summary = spawnSync(process.execPath, ['scripts/qa-report.mjs', '--social'], {stdio: 'inherit'});
process.exitCode = (run.status ?? 1) || (summary.status ?? 1);
