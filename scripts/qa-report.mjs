import { readFile, writeFile } from 'node:fs/promises';

const report = JSON.parse(await readFile('test-results/qa-results.json', 'utf8'));
const specs = [];
function collect(suite) {
  specs.push(...(suite.specs || []));
  suite.suites?.forEach(collect);
}
report.suites.forEach(collect);

function status(group, pending) {
  const tests = group.flatMap(spec => spec.tests).filter(test => test.status !== 'skipped');
  if (!tests.length) return pending;
  if (report.errors?.length || tests.some(test => test.status !== 'expected')) return 'FAIL';
  return 'PASS';
}
const visual = status(specs.filter(s => s.title.includes('@visual')), 'BASELINE PENDING');
const functional = status(specs.filter(s => !s.title.includes('@visual')), 'NOT RUN');
const { stats } = report;
const result = `# Latest studio QA run

Run started ${stats.startTime}. This table describes the tests selected for this invocation.

| Environment | Status |
| --- | --- |
| Chrome Android | NOT RUN |
| Safari iOS | NOT RUN |
| Facebook Android | NOT VERIFIED |
| Facebook iOS | NOT VERIFIED |
| Instagram Android | NOT VERIFIED |
| Instagram iOS | NOT VERIFIED |
| Messenger Android | NOT VERIFIED |
| Messenger iOS | NOT VERIFIED |
| Automated visual regression | ${visual} |
| Mobile functional regression | ${functional} |

Passed ${stats.expected}, failed ${stats.unexpected}, skipped ${stats.skipped}, flaky ${stats.flaky}. Duration ${Math.round(stats.duration/1000)} seconds.

Open the detailed evidence with \`npx playwright show-report\`. The installed-app gate requires physical-device records. **INSTAGRAM NOT VERIFIED**.
`;
await writeFile('test-results/QA-LATEST.md', result);
if (process.argv.includes('--social')) {
  const checklist = await readFile('QA-SOCIAL-CHECKLIST.md', 'utf8');
  await writeFile('test-results/QA-SOCIAL.md', result + '\n' + checklist);
}
console.log(result);
