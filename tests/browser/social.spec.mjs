import { test, expect } from '@playwright/test';
import { noOverflow, observeErrors, ready, settle } from './helpers.mjs';

// Text zoom in an embedded browser can enlarge fixed-pixel fonts too. This
// stress test changes glyph sizes without enlarging cards or hiding overflow.
async function enlargeLabels(page, scale) {
  const labels = page.locator('.ba-tab strong,.ba-tab small,.guide-dock-label,.guide-mobile-cta');
  await labels.evaluateAll(elements => elements.forEach(element => element.style.removeProperty('font-size')));
  await settle(page);
  await labels.evaluateAll((elements, scale) => {
    const sizes = elements.map(element => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => element.style.setProperty('font-size', sizes[index] * scale + 'px', 'important'));
  }, scale);
  await settle(page);
}

async function textOutsideControl(page, selector) {
  return page.locator(selector).evaluateAll(controls => controls.flatMap(control => {
    const bounds = control.getBoundingClientRect();
    const walker = document.createTreeWalker(control, NodeFilter.SHOW_TEXT);
    const failures = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!node.textContent.trim() || parent.closest('.visually-hidden,[aria-hidden=true]') ||
          !parent.getClientRects().length || getComputedStyle(parent).visibility === 'hidden') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width && (rect.left < bounds.left + 1 || rect.right > bounds.right - 1 ||
            rect.top < bounds.top || rect.bottom > bounds.bottom)) {
          failures.push({control: control.id || control.className, text: node.textContent.trim()});
        }
      }
    }
    return failures;
  }));
}

test('@mobile @social comparison labels and dock fit at 100–200% text size', async ({page}, info) => {
  test.skip(!info.project.name.endsWith('-phone'), 'Phone text enlargement');
  await page.goto('/');
  await ready(page);
  for (const width of [320, 360, 375, 390, 393, 412, 430]) {
    await page.setViewportSize({width, height: 750});
    for (const scale of [1, 1.25, 1.5, 2]) {
      await enlargeLabels(page, scale);
      await page.locator('.ba-picker').evaluate(e => scrollTo(0, scrollY + e.getBoundingClientRect().top - 90));
      await expect(page.locator('.guide')).toBeVisible();
      await settle(page);
      expect(await textOutsideControl(page, '.ba-tab,.guide-dock a'), width + 'px / ' + scale).toEqual([]);
      const minimum = await page.locator('.ba-tab strong,.ba-tab small,.guide-dock-label').evaluateAll(es =>
        Math.min(...es.map(e => parseFloat(getComputedStyle(e).fontSize))));
      expect(minimum).toBeGreaterThanOrEqual(14);
      await noOverflow(page);
    }
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await settle(page);
    const footer = await page.locator('.footer-base').boundingBox();
    const dock = await page.locator('.guide').boundingBox();
    expect(footer.y + footer.height, 'Footer clears enlarged dock at ' + width).toBeLessThanOrEqual(dock.y);
  }
  const tabs = page.getByRole('tab');
  await tabs.last().tap();
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  await tabs.last().focus();
  await page.keyboard.press('Home');
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await page.locator('.guide-mobile-cta').tap();
  await expect(page.locator('#contact')).toBeInViewport();
});

test('@visual @social enlarged comparison picker and contact dock', async ({page}, info) => {
  test.skip(!info.project.name.endsWith('-phone'), 'Phone composition');
  await page.setViewportSize({width: 360, height: 750});
  await page.goto('/');
  await ready(page);
  await enlargeLabels(page, 1.5);
  await page.locator('.ba-picker').evaluate(e => scrollTo(0, scrollY + e.getBoundingClientRect().top - 90));
  await expect(page.locator('.guide')).toBeVisible();
  await expect(page).toHaveScreenshot('enlarged-picker.png', {
    scale: 'css', style: '.guide-bubble {visibility:hidden!important}',
  });
});

test('@mobile @social short landing, shared anchor, refresh and Back', async ({ page }, info) => {
  test.skip(!info.project.name.endsWith('-phone'), 'Phone navigation');
  const errors = observeErrors(page);
  await page.setViewportSize({width: 393, height: 650});
  await page.goto('/?utm_source=instagram', {referer: 'https://l.instagram.com/'});
  await ready(page);
  const cta = page.locator('.hero-actions .button');
  const box = await cta.boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(650);
  await cta.tap();
  await expect(page.locator('#contact-title')).toBeFocused();
  await page.goto('/?utm_source=instagram#work');
  const heading = page.locator('#work .section-top');
  await expect(heading).toBeInViewport();
  await page.reload();
  await expect(heading).toBeInViewport();
  await page.goto('/tiffin/');
  await page.goBack();
  await expect(page).toHaveURL(/#work$/);
  await expect(heading).toBeInViewport();
  // Keep the reading scale usable when a visitor enlarges the default font.
  await page.addStyleTag({content: 'html {font-size: 125%}'});
  await expect(page.locator('.studio-deck')).toHaveCSS('font-size', '20px');
  await noOverflow(page);
  expect(errors).toEqual([]);
});

test.describe('Instagram phone typography', () => {
  test.use({userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7; wv) AppleWebKit/537.36 Mobile Safari/537.36 Instagram 365 Android'});

  test('@mobile @social compact text stays readable and fits its controls', async ({page}, info) => {
    test.skip(!info.project.name.endsWith('-phone'), 'Phone typography');
    await page.goto('/', {referer: 'https://l.instagram.com/'});
    await ready(page);
    for (const width of [320, 360, 375, 390, 393, 412, 430]) {
      await page.setViewportSize({width, height: 700});
      await expect(page.locator('.studio-deck')).toHaveCSS('font-size', '14px');
      await expect(page.locator('#browser-title')).toBeVisible();
      await expect(page.locator('.ba-tab strong').first()).toHaveCSS('font-size', '16px');
      await page.locator('.ba-picker').evaluate(e => e.scrollIntoView({block:'center'}));
      await expect(page.locator('.guide')).toBeVisible();
      await enlargeLabels(page, 2);
      expect(await textOutsideControl(page, '.ba-tab,.guide-dock a')).toEqual([]);
      await noOverflow(page);
      await enlargeLabels(page, 1);
    }
    await page.addStyleTag({content: 'html {font-size: 125%}'});
    await expect(page.locator('.studio-deck')).toHaveCSS('font-size', '17.5px');
    await page.locator('.ba-tab').last().tap();
    await expect(page.locator('.ba-tab').last()).toHaveAttribute('aria-selected', 'true');
  });
});

test('@mobile @social vertical scroll preserves the comparison and horizontal drag changes it', async ({ page }, info) => {
  test.skip(info.project.name !== 'chromium-phone', 'Trusted multi-point touch input uses Chromium CDP');
  await page.setViewportSize({width: 393, height: 650});
  await page.goto('/');
  await ready(page);
  const session = await page.context().newCDPSession(page);
  {
    const slider = page.locator('#work .ba-range');
    const swipe = async (dx, dy) => {
      await slider.evaluate(e => e.scrollIntoView({block: 'center', behavior: 'instant'}));
      await settle(page);
      const box = await slider.boundingBox();
      const x = Math.round(box.x + box.width * .25);
      const y = Math.round(box.y + box.height * .6);
      expect(await slider.evaluate((e, [x, y]) => document.elementFromPoint(x, y) === e, [x, y])).toBe(true);
      const scroll = await page.evaluate(() => scrollY);
      await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
      for (let i = 1; i <= 8; i++) {
        await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x + dx*i/8, y: y + dy*i/8}]});
      }
      await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
      await settle(page);
      return (await page.evaluate(() => scrollY)) - scroll;
    };
    const initial = await slider.inputValue();
    expect(await swipe(0, -100)).toBeGreaterThan(20);
    await expect(slider).toHaveValue(initial);
    expect(Math.abs(await swipe(175, 0))).toBeLessThanOrEqual(2);
    expect(Number(await slider.inputValue())).toBeGreaterThan(65);
  }
});
