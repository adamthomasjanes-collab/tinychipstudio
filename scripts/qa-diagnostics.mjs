import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const base=process.env.QA_BASE_URL || 'http://localhost:4295';
try {
 const page=await browser.newPage();
 await page.goto(base+'/');assert.equal(await page.locator('#qa-diagnostics').count(),0);
 await page.goto(base+'/?qa=1&example=PRIVATE-SYNTHETIC-QUERY', {referer:'https://l.instagram.com/'});await page.locator('#qa-diagnostics summary').waitFor();
 await page.locator('#contact input[name=name]').fill('PRIVATE-SYNTHETIC-NAME');
 await page.setViewportSize({width:393,height:650});
 await page.waitForFunction(()=>window.innerWidth === 393);
 await page.waitForTimeout(250); // checkpoint coalesces resize events after 180ms
 await page.locator('#qa-diagnostics summary').click();await page.locator('#qa-diagnostics #scan').click();
 const report=await page.locator('#qa-diagnostics pre').innerText();assert.equal(report.includes('PRIVATE-SYNTHETIC-NAME'),false);
 const parsed=JSON.parse(report);assert.ok(parsed.viewport.width);assert.ok(parsed.visualViewport.width);
 assert.equal(report.includes('PRIVATE-SYNTHETIC-QUERY'), false);
 assert.equal(parsed.appSignals.instagramReferrer, true);
 assert.equal(parsed.safeArea.Top, '0px');
 assert.ok(parsed.typePixels.h1 && parsed.layout.documentHeight > 650);
 for(const event of ['initial','focusin','window resize']) assert.ok(parsed.checkpoints.some(c=>c.event===event),event);
 await page.locator('#qa-diagnostics #highlight').click();
 await page.locator('#qa-diagnostics #console').click();await page.waitForFunction(()=>Boolean(window.eruda));
 console.log('PASS: diagnostics require qa=1, report geometry without form values, highlight overflow, and load Eruda only on request.');
}finally{await browser.close();}
