import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { offers, total, growthTotal, growthAvailability } from '../../src/offers.js';
import { studioRoutes, ready, settle, noOverflow, observeErrors, imageChecks, readability } from './helpers.mjs';

test('@mobile navigation, anchors, dismissal and resized landscape',async({page},info)=>{
  const errors=observeErrors(page);
  await page.goto('/');await ready(page);
  const toggle=page.getByRole('button',{name:'Open navigation'});
  if(await toggle.isVisible()) {
    await toggle.tap();await expect(page.locator('#main-nav')).toBeVisible();
    const bounds=await page.locator('#main-nav').boundingBox();expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(page.viewportSize().width+1);
    await page.keyboard.press('Escape');await expect(toggle).toBeFocused();
    await toggle.tap();await page.locator('#main-nav a[href="#website-options"]').tap();
    await expect(page.locator('#main-nav')).toBeHidden();await expect(page.locator('#website-options')).toBeFocused();
    await page.setViewportSize({width:812,height:375});await toggle.tap();
    await page.locator('#main-nav .nav-contact').tap();await expect(page.locator('#contact')).toBeFocused();
    await expect(page.locator('#main-nav')).toBeHidden();
    await toggle.tap();await page.setViewportSize({width:1280,height:800});await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');
    await page.setViewportSize({width:820,height:1180});await expect(page.locator('#main-nav')).toBeHidden();
  } else {
    const brand=await page.locator('.brand').boundingBox(),nav=await page.locator('#main-nav').boundingBox();expect(brand.x+brand.width+12).toBeLessThan(nav.x);
    await page.locator('#main-nav a[href="#services"]').click();
  }
  await noOverflow(page);expect(errors).toEqual([]);
});

test('@mobile all offers, inquiry qualification, validation, draft, error, fallback and success',async({page})=>{
  await page.addInitScript(()=>{window.qaEvents=[];window.gtag=(...args)=>window.qaEvents.push(args);});
  const errors=observeErrors(page);await page.goto('/');await ready(page);
  await expect(page.locator('#browser-title')).toContainText('Custom websites');
  await expect(page.locator('[data-offer=website-care]')).toContainText('$2,364');expect(total).toBe(2364);expect(growthTotal).toBe(3564);
  await expect(page.locator('[data-offer=website-growth] .option-readiness')).toHaveText('SET UP AROUND YOUR BUSINESS' + growthAvailability);
  for(const detail of await page.locator('.option-inclusions').all()) {await detail.locator('summary').click();await expect(detail).toHaveAttribute('open','');await detail.locator('summary').click();}
  await page.locator('.hero-actions a').first().click();
  await expect(page.locator('[name=need]:checked')).toHaveValue('Not sure yet');
  await page.getByRole('button',{name:'SEND IT OVER'}).click();await expect(page.locator('#name-error')).toBeVisible();
  await page.locator('#contact [name=name]').fill('Local QA');await page.locator('#contact [name=business]').fill('Synthetic test business');
  await page.locator('#contact [name=email]').fill('local@example.test');await page.locator('#contact textarea').fill('A small business website with straightforward content.');
  for(const offer of offers) {
    await page.locator('.website-options').getByRole('link',{name:offer.cta,exact:false}).click();
    await expect(page.locator('[name=need]:checked')).toHaveValue(offer.name);
    await expect(page.locator('#contact [name=business]')).toHaveValue('Synthetic test business');
  }
  await page.reload();await expect(page.locator('#contact [name=name]')).toHaveValue('Local QA');
  let payload;let status=500;
  await page.route('**/*',route=>{
    if(route.request().method()!=='POST')return route.continue();
    payload=new URLSearchParams(route.request().postData());return route.fulfill({status,body:status===200?'Accepted locally':'Unavailable'});
  });
  await page.getByRole('button',{name:'SEND IT OVER'}).click();await expect(page.getByText('NOT SENT YET',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:/BACK TO YOUR MESSAGE/}).click();
  await expect(page.locator('#contact textarea')).toHaveValue('A small business website with straightforward content.');
  expect(await page.evaluate(()=>window.qaEvents.filter(e=>e[1]==='generate_lead'))).toEqual([]);
  status=405;await page.getByRole('button',{name:'SEND IT OVER'}).click();await expect(page.getByRole('link',{name:/OPEN THE EMAIL/})).toHaveAttribute('href',/Synthetic%20test%20business/);
  await page.getByRole('button',{name:/BACK TO YOUR MESSAGE/}).click();status=200;
  await page.getByRole('button',{name:'SEND IT OVER'}).click();await expect(page.getByText('MESSAGE RECEIVED',{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>window.qaEvents.filter(e=>e[1]==='generate_lead').map(e=>e[2]))).toEqual([{form:'project-starter'}]);
  expect(payload.get('business')).toBe('Synthetic test business');expect(payload.get('need')).toBe('Website Care');expect(errors).toEqual([]);
});

test('@mobile comparisons, modal focus, scorecard and FAQ',async({page})=>{
  const errors=observeErrors(page);await page.goto('/');await ready(page);
  const slider=page.locator('#work .ba-range');await slider.focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await expect(slider).toHaveValue('1');await expect(slider).toHaveAttribute('aria-valuetext','1% old site, 99% redesign');
  if(await page.evaluate(()=>navigator.maxTouchPoints>0))await slider.tap();else await slider.click();
  await expect(slider).not.toHaveValue('1');
  const tabs=page.locator('[role=tab]');
  for(let i=0;i<await tabs.count();i++) {await tabs.nth(i).click();await expect(tabs.nth(i)).toHaveAttribute('aria-selected','true');await imageChecks(page);await noOverflow(page);}
  await page.locator('#ba-tab-pioneer-mill').click();await page.locator('.ba-explore button').click();
  const modal=page.getByRole('dialog');await expect(modal).toBeVisible();
  await expect(modal.locator('a[target=_blank]').first()).toHaveAttribute('href','https://adamthomasjanes.com/concept/prototype/');
  await page.keyboard.press('Shift+Tab');expect(await modal.evaluate(e=>e.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);await expect(page.locator('.ba-explore button')).toBeFocused();
  await page.locator('.review-note a').click();await expect(modal).toBeVisible();await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);
  await page.locator('#faq summary').first().click();await expect(page.locator('#faq details').first()).toHaveAttribute('open','');
  await page.goto('/#scorecard');await expect(modal).toBeVisible();await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('@mobile accessibility and text standards',async({page})=>{
  await page.goto('/');await ready(page);await imageChecks(page);
  expect(await readability(page)).toEqual([]);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  if(await page.locator('.menu-toggle').isVisible()) {await page.locator('.menu-toggle').click();const open=await new AxeBuilder({page}).include('.header').withTags(['wcag2a','wcag2aa']).analyze();expect(open.violations).toEqual([]);}
});

test('@mobile no WebGL, blocked storage and enlarged text',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};
    Storage.prototype.setItem=()=>{throw Error('Storage blocked for QA');};
  });
  const errors=observeErrors(page);await page.goto('/');await ready(page);await expect(page.locator('h1')).toBeVisible();
  await page.addStyleTag({content:'body { font-size: 24px !important; } .header a, .header button { font-size: 24px !important; }'});
  await noOverflow(page);
  await page.locator('.hero-actions a').first().click();await page.locator('#contact [name=name]').fill('QA');await expect(page.locator('.guide')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('@full every studio route: assets, links, pricing, phone and tablet widths',async({page},info)=>{
  test.setTimeout(180000);
  const errors=observeErrors(page);
  const widths=info.project.name.includes('phone')?[320,360,375,390,393,412,430]:info.project.name.includes('tablet')?[600,700,768,820,912,1024,1100,1180]:[1280,1440,1920];
  for(const route of studioRoutes) {
    await page.goto(route);await ready(page);await imageChecks(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Tiny Chip Studio/);
    expect(await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='error').map(f=>f.family))).toEqual([]);
    if(!['/404.html','/badge/'].includes(route)) {
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://tinychipstudio.com${route}`);
      await expect(page.locator('meta[name=description]')).toHaveAttribute('content',/.{30,}/);
    } else await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
    if(route==='/' || route.endsWith('/') && route!=='/badge/') {
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',`https://tinychipstudio.com${route}`);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
    }
    const brokenAnchors=await page.locator('a[href^="#"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')).filter(h=>h.length>1&&!['#scorecard','#book-call'].includes(h)&&!document.getElementById(h.slice(1))));
    expect(brokenAnchors).toEqual([]);
    expect(await page.locator('script[type="application/ld+json"]').evaluateAll(es=>es.map(e=>{try{JSON.parse(e.textContent);return true;}catch{return false;}}))).not.toContain(false);
    if(info.project.name==='chromium-desktop' && route!=='/') {
      const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
    }
    const hrefs=await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
    expect(hrefs.some(h=>h.includes('pioneermill.adamthomasjanes'))).toBe(false);
    expect(await page.locator('body').innerText()).not.toMatch(/Build \+ Care|18.month|\$149|\$300 setup|â€|Â·|â†/);
    expect(await readability(page),route).toEqual([]);
    for(const width of widths) {
      await page.setViewportSize({width,height:width<=430?568:900});await settle(page);await noOverflow(page);
      if(route==='/') {
        const textOutside=await page.locator('h1,h2,h3,.button,.option-cta').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&!e.closest('[aria-hidden=true]')).filter(e=>{const r=e.getBoundingClientRect();return r.left < -2 || r.right>innerWidth+2;}).map(e=>e.className));
        expect(textOutside,`${route} at ${width}`).toEqual([]);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('@mobile production diagnostics are absent even with query opt-in',async({page})=>{
  const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto('/?qa=1');await ready(page);
  await expect(page.locator('#qa-diagnostics')).toHaveCount(0);expect(requests.some(u=>/eruda|diagnostics/.test(u))).toBe(false);
});

test('@mobile scorecard results, safe lead states, analytics and booking destination',async({page})=>{
  const errors=observeErrors(page);
  await page.addInitScript(()=>{window.qaEvents=[];window.gtag=(...args)=>window.qaEvents.push(args);});
  let status=500, payload;
  await page.route('**/*',route=>{
    if(route.request().method()!=='POST')return route.continue();
    payload=new URLSearchParams(route.request().postData());return route.fulfill({status,body:status===200?'Accepted locally':'Unavailable'});
  });
  await page.goto('/#scorecard');const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  await dialog.locator('.sc-opt').first().click();
  for(let i=0;i<15;i++)await dialog.locator('.sc-opt').first().click();
  await expect(dialog.getByText('YOUR RESULTS · BASED ON YOUR ANSWERS, NOT A SCAN')).toBeVisible();
  await dialog.getByRole('button',{name:'SEND ME THE FIRST FIX'}).click();await expect(dialog.locator('#sc-lead-error')).toBeVisible();
  await dialog.locator('[name=name]').fill('Local QA');await dialog.locator('[name=email]').fill('local@example.test');
  await dialog.getByRole('button',{name:'SEND ME THE FIRST FIX'}).click();await expect(dialog.locator('#sc-lead-error')).toContainText('nothing was sent');
  expect(await page.evaluate(()=>window.qaEvents.filter(e=>e[1]==='generate_lead'))).toEqual([]);
  status=200;await dialog.getByRole('button',{name:'SEND ME THE FIRST FIX'}).click();await expect(dialog.getByRole('status')).toContainText('On its way');
  expect(payload.get('form-name')).toBe('scorecard-plan');
  expect(await page.evaluate(()=>window.qaEvents.filter(e=>e[1]==='generate_lead').map(e=>e[2]))).toEqual([{form:'scorecard-plan'}]);
  await noOverflow(page);const scan=await new AxeBuilder({page}).include('[role=dialog]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(scan.violations).toEqual([]);
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
  await page.goto('/#book-call');await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link',{name:/SEE OPEN TIMES/})).toHaveAttribute('href',/^https:\/\/calendly\.com\/adamthomasjanes\/30min\?/);
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);expect(errors).toEqual([]);
});
