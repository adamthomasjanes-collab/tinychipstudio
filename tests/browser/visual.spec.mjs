import { test, expect } from '@playwright/test';
import { ready, imageChecks } from './helpers.mjs';

test('@visual @social compact portrait landing', async ({ page }, info) => {
  test.skip(!info.project.name.endsWith('-phone'), 'Phone composition');
  await page.setViewportSize({width: 393, height: 650});
  await page.goto('/');
  await ready(page);
  await expect(page).toHaveScreenshot('compact-hero.png', {
    scale: 'css', style: '.circuit-field,.hero-bug { visibility: hidden !important }',
  });
});
test('@visual reviewed screen states',async({page})=>{
  test.setTimeout(120000);
  await page.goto('/');await ready(page);await imageChecks(page);
  // Disable non-content randomness; identical overrides are used for capture and comparison.
  await page.addStyleTag({content:'.circuit-field,.hero-bug,.guide-bubble{visibility:hidden!important}.reveal{opacity:1!important;transform:none!important}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  await expect(page).toHaveScreenshot('hero.png',{fullPage:false,scale:'css'});
  if(await page.locator('.menu-toggle').isVisible()) {
    await page.locator('.menu-toggle').click();await expect(page).toHaveScreenshot('navigation-open.png',{scale:'css'});await page.keyboard.press('Escape');
    await page.evaluate(()=>document.activeElement?.blur());
  }
  for(const [name,selector] of [['offer','.service-foundation'],['pricing','#website-options'],['work','#work'],['form','#contact'],['footer','.site-footer']]) {
    await page.locator(selector).evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top-document.querySelector('.header').getBoundingClientRect().height-20));
    await expect(page).toHaveScreenshot(`${name}.png`,{scale:'css'});
  }
  await page.locator('[data-offer=website-growth] .option-inclusions summary').click();
  await page.locator('[data-offer=website-growth] .option-inclusions').scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot('pricing-details.png',{scale:'css'});
  await page.locator('[data-offer=website-growth] .option-inclusions summary').click();
  await page.locator('.client-feature-image').click();await expect(page.getByRole('dialog')).toBeVisible();
  // The opener's pointer can end up over the new dialog CTA. Park it outside
  // controls so screenshots do not randomly capture a hover color/transform.
  await page.mouse.move(0,0);
  await expect(page).toHaveScreenshot('case-study.png',{scale:'css'});
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.evaluate(()=>{document.activeElement?.blur();scrollTo(0,0);});
  // Full composition excludes transient guide tips but retains the dock in state captures above.
  await expect(page).toHaveScreenshot('full-page.png',{fullPage:true,scale:'css',timeout:20000,style:'.guide{visibility:hidden!important}'});
});
