import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch();
try{
 await mkdir('test-results/process-review',{recursive:true});
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.goto('http://localhost:4294');await page.evaluate(()=>document.fonts.ready);
 for(const width of [390,768,1054,1440]){
  await page.setViewportSize({width,height:1000});
  await page.locator('.process-grid').scrollIntoViewIfNeeded();
  await page.screenshot({path:`test-results/process-review/process-${width}.png`});
 }
}finally{await browser.close();}
