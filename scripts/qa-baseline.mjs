// Evidence capture only; never updates approved regression snapshots.
import { chromium, webkit } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const out = process.env.QA_CAPTURE_DIR || 'test-results/mobile-before';
await mkdir(out, { recursive: true });
const results = [];
for (const [engine, launcher] of Object.entries({ chromium, webkit })) {
  const browser = await launcher.launch();
  try {
    for (const [width, height] of [[320,568],[390,844],[768,1024],[820,1180],[1024,768],[1180,820],[1440,1000],[812,375]]) {
      const context = await browser.newContext({ viewport:{width,height}, isMobile:width<1200, hasTouch:true, reducedMotion:'reduce' });
      const page = await context.newPage();
      await page.goto(process.env.QA_BASE_URL || 'http://localhost:4193/');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path:`${out}/${engine}-${width}-hero.png` });
      const header = await page.locator('.header').evaluate(e => ({ width:e.getBoundingClientRect().width, scroll:e.scrollWidth, height:e.getBoundingClientRect().height }));
      const small = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.childNodes.length && [...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()) && e.getClientRects().length && !e.closest('[aria-hidden=true],.visually-hidden,script,style')).filter(e=>parseFloat(getComputedStyle(e).fontSize)<14).map(e=>({tag:e.tagName,classes:e.className,size:getComputedStyle(e).fontSize,text:e.textContent.slice(0,70)})));
      if (await page.locator('.menu-toggle').isVisible()) { await page.locator('.menu-toggle').click(); await page.screenshot({path:`${out}/${engine}-${width}-menu.png`}); await page.keyboard.press('Escape'); }
      for (const section of ['work','services','process','contact']) { await page.locator(`#${section}`).scrollIntoViewIfNeeded(); await page.screenshot({path:`${out}/${engine}-${width}-${section}.png`}); }
      results.push({engine,width,height,header,small});
      await context.close();
    }
  } finally { await browser.close(); }
}
await writeFile(`${out}/findings.json`, JSON.stringify(results,null,2));
console.log(`Captured ${results.length} browser/viewport combinations in ${out}`);
