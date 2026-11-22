// Local-only browser QA. No remote submissions; POST responses are intercepted.
// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { offers, pricing, monthly, total } from '../src/offers.js';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const out = 'test-results/website-options';
await mkdir(out, { recursive: true });
const errors = [];
const results = [];
try {
  assert.equal(pricing.months * pricing.websiteMonthly, total);
  assert.equal(monthly, 197);
  assert.equal(total, 2364);
  const html = await readFile('dist/index.html', 'utf8');
  assert.match(html, /data-prerendered="true"/);
  for (const offer of offers) assert.ok(html.includes(offer.cta.replaceAll('&', '&amp;')));
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.goto('http://localhost:4191/');
  await page.locator('#contact input[name="name"]').fill('Local QA');
  await page.locator('#contact input[name="email"]').fill('local@example.test');
  await page.locator('#contact textarea').fill('Keep all my existing project details.');
  await page.locator('#contact input[name="website"]').fill('https://example.test/');
  await page.getByRole('button', { name: /ADD BUDGET/ }).click();
  await page.locator('select[name="budget"]').selectOption('Under $2,500');
  await page.locator('select[name="timeline"]').selectOption('Just exploring');
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('#website-options').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/viewport-${width}.png` });
    await page.locator('#website-options').screenshot({ path: `${out}/options-${width}.png`, style: '.header, .header *, .guide, .guide *, .skip { visibility: hidden !important; }' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `horizontal overflow at ${width}`);
    for (const offer of offers) {
      const link = page.getByRole('link', { name: offer.cta, exact: true });
      await link.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#contact-title').evaluate((el) => el === document.activeElement), true);
      assert.equal(await page.locator('#contact input[name="need"]:checked').inputValue(), offer.name);
      assert.equal(await page.locator('#contact input[name="name"]').inputValue(), 'Local QA');
      assert.equal(await page.locator('#contact textarea').inputValue(), 'Keep all my existing project details.');
      assert.equal(await page.locator('select[name="budget"]').inputValue(), 'Under $2,500');
      assert.equal(await page.locator('select[name="timeline"]').inputValue(), 'Just exploring');
      assert.equal(await page.locator('#contact input[name="email"]').inputValue(), 'local@example.test');
      assert.equal(await page.locator('#contact input[name="website"]').inputValue(), 'https://example.test/');
    }
    results.push({ width, overflow, keyboardSelectionAndDraft: 'passed' });
  }
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#contact input[name="name"]').value === 'Local QA');
  assert.equal(await page.locator('#contact input[name="need"]:checked').inputValue(), 'Website Care');
  await page.getByRole('link', { name: 'Ownership & cancellation', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#ownership-cancellation');
  const question = page.locator('#ownership-cancellation summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  assert.equal(await question.evaluate((el) => el.parentElement.open), true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('link', { name: offers[2].cta, exact: false }).click();
  assert.equal(await page.locator('#contact-title').evaluate((el) => el === document.activeElement), true);
  let payload;
  await page.route('http://localhost:4191/', (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    payload = new URLSearchParams(route.request().postData());
    return route.fulfill({ status: 405, body: '' });
  });
  await page.getByRole('button', { name: 'Send my inquiry' }).click();
  await page.getByRole('link', { name: /OPEN THE EMAIL/ }).waitFor();
  assert.equal(payload.get('need'), 'Website Care');
  await page.getByRole('button', { name: /BACK TO YOUR MESSAGE/ }).click();
  assert.equal(await page.locator('#contact textarea').inputValue(), 'Keep all my existing project details.');
  await page.route('http://localhost:4191/', (route) => route.request().method() === 'POST' ? route.fulfill({ status: 200, body: 'accepted locally for QA' }) : route.continue());
  await page.getByRole('button', { name: 'Send my inquiry' }).click();
  await page.getByText('MESSAGE RECEIVED', { exact: true }).waitFor();
  // Expected 405 from the deliberately simulated unavailable form endpoint.
  const unexpected = errors.filter((error) => !error.includes('405'));
  assert.deepEqual(unexpected, []);
  await writeFile(`${out}/results.json`, JSON.stringify({ results, hydrationAndConsole: unexpected, form: 'intercepted fallback, draft reload, payload and success passed', math: 'passed' }, null, 2));
  console.log(JSON.stringify(results));
} finally { await browser.close(); }

