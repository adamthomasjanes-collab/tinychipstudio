import { test, expect } from '@playwright/test';
import { ready, noOverflow } from './helpers.mjs';

test('@mobile tablet process panels follow content height',async({page})=>{
 await page.goto('/');await ready(page);
 for(const width of [768,900,901,1024,1054,1100]){
  await page.setViewportSize({width,height:900});
  const gaps=await page.locator('.process-item').evaluateAll(items=>items.map(item=>{
   const box=item.getBoundingClientRect();
   const bottom=Math.max(...[...item.children].map(child=>child.getBoundingClientRect().bottom));
   return box.bottom-bottom;
  }));
  expect(Math.max(...gaps),`Unused process space at ${width}`).toBeLessThan(75);
  await noOverflow(page);
 }
});

test('@mobile @social viewport contraction, scroll reversal and editing dock clearance',async({page})=>{
 await page.goto('/');await ready(page);
 await page.setViewportSize({width:390,height:844});
 for(const height of [568,844,420,844]){
  await page.setViewportSize({width:390,height});
  for(const y of [0,1200,6000,900,0]){
   await page.evaluate(y=>scrollTo(0,y),y);
   const header=await page.locator('.header').boundingBox();
   expect(header.y).toBeGreaterThanOrEqual(-1);expect(header.y).toBeLessThanOrEqual(1);
  }
  await page.getByRole('button',{name:'Open navigation'}).click();
  const menu=page.locator('#main-nav');const box=await menu.boundingBox();
  expect(box.y+box.height).toBeLessThanOrEqual(height+2);
  await menu.locator('.nav-contact').click();await expect(menu).toBeHidden();
  await page.locator('#contact [name=email]').fill('keyboard-check@example.test');
  await expect(page.locator('.guide')).not.toBeVisible();
  await page.locator('#contact textarea').fill('Synthetic viewport check; never submitted.');
  await page.locator('#contact textarea').blur();
  await page.getByRole('button',{name:'SEND IT OVER'}).scrollIntoViewIfNeeded();
  const button=await page.getByRole('button',{name:'SEND IT OVER'}).boundingBox();
  const dock=await page.locator('.guide').boundingBox();
  if(dock)expect(button.y+button.height).toBeLessThanOrEqual(dock.y+2);
  await noOverflow(page);
 }
});
