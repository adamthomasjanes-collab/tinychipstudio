import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.addInitScript(()=>{
  window.qaMetrics={lcp:0,cls:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.qaMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.qaMetrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
 });
 const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.enable');
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:100000});
 await page.goto(process.env.QA_BASE_URL || 'http://localhost:4293/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(()=>({ ...window.qaMetrics, resources:performance.getEntriesByType('resource').map(r=>({path:new URL(r.name).pathname,transfer:r.transferSize,duration:r.duration})), navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})) }));
 const report={environment:'Local Chromium, 390x844, DPR 2, reduced motion, 4x CPU slowdown, 150ms latency, 200kB/s download. Synthetic single run, not field data or a Lighthouse score.',...metrics};
 await mkdir('test-results',{recursive:true});await writeFile('test-results/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
