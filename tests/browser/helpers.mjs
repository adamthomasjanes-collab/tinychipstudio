import { expect } from '@playwright/test';
export const studioRoutes = ['/', '/tiffin/', '/findlay/', '/fremont/', '/bowling-green/', '/toledo/', '/sandusky/', '/port-clinton/', '/privacy.html', '/404.html', '/badge/'];
export async function ready(page) {
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(i=>i.loading!=='lazy').map(i=>i.decode().catch(()=>{}))); });
}
export async function settle(page) {
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
export async function noOverflow(page) {
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
}
export function observeErrors(page) {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response', r => {
    const url = new URL(r.url());
    if (r.status() >= 400 && r.request().method() === 'GET' &&
        url.origin === new URL(page.url()).origin && url.pathname !== '/404.html') {
      errors.push(`${r.status()} ${url.pathname}`);
    }
  });
  page.on('console',m=>{if(m.type()==='error' && !/Failed to load resource.*(?:405|500)/.test(m.text())) errors.push(m.text());});
  return errors;
}
export async function imageChecks(page) {
  const missing = await page.evaluate(async()=>{
    const images=[...document.images];
    images.forEach(i=>i.loading='eager');
    await Promise.all(images.map(i=>i.decode().catch(()=>{})));
    return images.filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src'));
  });
  expect(missing).toEqual([]);
}
// Visible direct text only. Decorative/offscreen and intentionally clipped
// comparison images are excluded; document overflow is checked separately.
export async function readability(page) {
  return page.evaluate(()=>[...document.querySelectorAll('main *,footer *,header *')].filter(e=>
    !e.closest('[aria-hidden=true],.visually-hidden,script,style,svg,.ba-bar') && e.getClientRects().length && getComputedStyle(e).visibility!=='hidden' &&
    [...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())
  ).filter(e=>parseFloat(getComputedStyle(e).fontSize)<14).map(e=>({selector:e.tagName+'.'+String(e.className).split(' ').join('.'),size:getComputedStyle(e).fontSize})));
}
