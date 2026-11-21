# Website QA workflow

The suite covers the studio site, seven city landing pages, privacy, 404 and badge demo. Independent client projects under `public/` retain their own QA requirements.

Before asking Adam to test a change, lead with its deployment status and the exact link to open. If the fix is preview-only, explicitly say that the existing Instagram bio link still opens production. After a production release, verify the public URL and tell him he can test through the bio. Use each project's own publishing workflow for its preview pages.

## Setup and repeatable commands

Use Node 22 and the committed package lock. Initial setup:

```powershell
npm ci
npx playwright install chromium webkit
```

Run commands individually:

```powershell
npm test
npm run qa:mobile
npm run qa:visual
npm run qa:social
npm run qa:full
npm run qa:report
npx playwright show-report
npm run build
```

`qa:mobile` checks Chromium phone/tablet interactions. `qa:visual` compares five browser/viewport projects. `qa:full` includes all functional, route, accessibility and visual tests in Chromium and WebKit. `qa:build` builds/prerenders/stages the studio only, avoiding unnecessary client-project builds. The unchanged `build` command also assembles and audits the separate client sites. There are no configured lint or TypeScript scripts; this is a JavaScript project. Do not mistake bundling or automated axe checks for a complete accessibility audit.

Tests use port 4294. Do not run Playwright commands concurrently: reports and temporary artifacts share an output directory. Form requests are intercepted locally; the tests send no real leads or emails. Unit tests mock the email provider. Netlify delivery still needs a controlled staging test.

Reports, traces, performance measurements, candidate screenshots and before/after captures are ignored under `test-results/`; HTML reports go in `playwright-report/`. Approved PNG baselines are versioned under `tests/browser/snapshots/`.

`qa:social` exercises short portrait landings, anchor refresh and Back, viewport contraction, form editing and the compact hero in both phone engines. Chromium also supplies native touch sequences for vertical scrolling and horizontal comparison drags. The command generates `test-results/QA-SOCIAL.md` with browser results and a fresh copy of the Pixel 7 checklist. Record installed-app sessions independently using `QA-SOCIAL-CHECKLIST.md`.

## Visual baseline review

The initial baselines were captured/reviewed on Windows using the pinned Playwright browsers, per browser/viewport project. Compare in that environment. Different operating systems or browser versions can change text rasterization. Fonts and images are awaited; reduced motion is enabled; randomized circuit artwork, decorative hero sticker and timed guide bubbles are hidden only during screenshot assertions. The guide dock and core content remain in state captures. Full-page captures additionally hide the fixed guide.

Never use snapshot updates to turn an unexplained failure green. Inspect expected, actual and difference images in the HTML report. To capture candidates without changing approved baselines:

```powershell
$env:QA_CANDIDATES='1'
npx playwright test --grep '@visual' --update-snapshots
Remove-Item Env:QA_CANDIDATES
```

Review `test-results/visual-candidates/`, then copy only reviewed images to the matching project under `tests/browser/snapshots/`. Run normal visual comparison afterward. Browser upgrades require a fresh review. CI checks functionality on Windows and uploads evidence; local visual comparison uses the reviewed Windows environment, without automatic approval.

## Preview diagnostics

```powershell
npm run qa:preview
```

Open `http://localhost:4295/?qa=1`. On a phone sharing this machine's network, use the machine's local address only if explicitly included in the hostname allowlist; by default only localhost/127.0.0.1 and Netlify deploy-preview hostnames are enabled. Use a Netlify preview for actual remote-device checks.

After a full `npm run build`, run `npm run qa:artifact`. This copies the tested runtime files into ignored `dist-qa/`, builds the QA entry there and prerenders it; `dist/` remains the production artifact. Deploy `dist-qa/` only as a draft on the existing site. Do not change the production Netlify build command. A normal production build eliminates diagnostics; `CONTEXT=production` blocks QA artifact creation. The runtime also rejects the production hostname. A query parameter alone cannot turn it on.

The optional overlay reports viewport/visualViewport geometry, DPR, user agent, capabilities, potential clipping/overflow, fixed/sticky bounds and error counts. It can highlight overflow and copy the report. Eruda loads only after the console button is pressed. Reports exclude field values, storage, cookies, query strings, request bodies and error messages. Use synthetic data when opening the optional console. Nothing is sent to a reporting server.

Verification: `npm run qa:diagnostics` against the QA server on 4295. Synthetic local performance: run a production preview on 4293, then `npm run qa:performance`. Both accept `QA_BASE_URL` to test another explicitly selected URL. The older `qa-options.mjs` and `qa-baseline.mjs` are supplementary legacy helpers; the Playwright suite is the maintained workflow.

## Physical in-app browser gate — NOT VERIFIED

Use the diagnostics-enabled draft recorded in `QA-SOCIAL-2026-11-10.md` for the Instagram typography check. The earlier draft in `QA-IN-APP-FOLLOWUP.md` predates this change. Local automated engine tests cannot reproduce Facebook, Messenger or Instagram browser chrome, keyboards, navigation or OS behavior.

Run on Google Pixel 7 in installed Facebook and Messenger, and on a real iPhone in installed Facebook and Messenger. Repeat in Instagram when available, plus standalone Chrome/Safari as controls. Record actual device, OS version, app version, date, URL and result. Confirm the link opened inside the app rather than an external browser.

1. Open the staging link from within the app; capture the initial hero/header.
2. Scroll slowly, rapidly, back upward and to the top. Expand/collapse browser controls; check header stability and dock clearance.
3. Open the navigation at the top and deep in the page. Reach every item in portrait and short landscape. Close it, follow Pricing/Work/FAQ/Contact and verify headings clear the sticky header.
4. Compare every project, drag the before/after divider by touch, open/close case studies and the scorecard, and return from external project links. Pioneer Mill must open the supplied prototype URL.
5. Focus each contact field using synthetic data. Check actual keyboard appearance, scroll-to-input, submit reachability, unwanted zoom and scroll position after dismissal. Do not submit to a live backend unless using an explicitly authorized controlled delivery test.
6. Check Website + Growth, Website + Care, Build & Own and Website Care CTAs preserve entered text and select the intended approach. Open optional budget/timing and package inclusions; exercise validation.
7. Test phone text enlargement, pinch zoom, reduced motion, rotation, returning from another screen and reloading with a saved draft.
8. Open `?qa=1` on the QA preview, refresh/copy the geometry report and capture discrepancies. Diagnose with synthetic values only.

| Device/browser | Outcome | Evidence |
| --- | --- | --- |
| Pixel 7 / Facebook | NOT VERIFIED | Physical device unavailable |
| Android / Messenger | NOT VERIFIED | Physical device unavailable |
| iPhone / Facebook | NOT VERIFIED | Physical device unavailable |
| iPhone / Messenger | NOT VERIFIED | Physical device unavailable |
| Android and iOS / Instagram | NOT VERIFIED | Physical device unavailable |

For each failure, record route, orientation, scroll position, keyboard/browser-controls state, screenshot and reproduction steps. Retest the fix on the same physical device. Real screen-reader and native keyboard checks also remain manual.
