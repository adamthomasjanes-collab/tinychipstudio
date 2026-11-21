# Mobile and in-app browser QA follow-up — November 2, 2026

Diagnostics staging: https://6ae8ee1851243215cfa441c5--tinychipstudio.netlify.app/?qa=1

Ordinary view of the same staging artifact: https://6ae8ee1851243215cfa441c5--tinychipstudio.netlify.app/

This follows the supplied master mobile/Facebook directive. It extends the completed V3 QA; it does not replace the commercial review or authorize production publication.

## Coverage and results

React 18/Vite 5; homepage, seven city pages, privacy, 404 and badge page. Existing Chromium/WebKit phone/tablet and Chromium desktop coverage spans 320–1920px, with touch, reduced motion, form failure/success simulations, focus recovery, portfolio interactions, scorecard, accessibility scans and metadata checks. The previous full run passed 45 tests; see QA-REPORT-2026-11-02.md and test-results/qa-full-v3.json. Those results were reused where the application remained unchanged.

This follow-up executed five new viewport tests across all configured browser projects. Heights 568/844/420/844 at 390px width exercise repeated viewport contraction/expansion, scrolling down/up/to top, menu bounds, contact anchors, editing, and submit/dock separation. These pass. They simulate geometry changes, not native phone keyboards or Facebook chrome.

Five visual tests against the compiled QA artifact passed all 49 existing reviewed image comparisons. No baseline was changed. This verifies the QA build has the same disabled-mode composition as the sales preview.

Diagnostics passed locally and on the new Netlify draft: absent without the query flag, available with it, geometry populated, synthetic form name excluded from the report, overflow highlighting works, and Eruda loads on explicit request. No real forms were submitted. The copied report contains geometry/capabilities/error counts, not form contents, cookies, storage or raw error messages. The optional console is for synthetic data only.

| Gate | Result |
|---|---|
| Production build | PASS in V3 run; unchanged production build command |
| Separate compiled QA artifact and prerender | PASS this follow-up |
| Automated mobile | PASS: prior 40 functional checks plus 5 new viewport tests |
| Visual regression | PASS this follow-up: 49 comparisons, unchanged baselines |
| Accessibility | PASS in V3 scans; application markup/styles unchanged by this follow-up |
| Android Facebook | NOT VERIFIED — physical device unavailable |
| iOS Facebook | NOT VERIFIED — physical device unavailable |
| Android Messenger | NOT VERIFIED — physical device unavailable |
| iOS Messenger | NOT VERIFIED — physical device unavailable |
| Instagram / real screen reader / actual keyboard | NOT VERIFIED |

## Issues addressed

| Severity | Route/component | Observed issue and cause | Correction | Verification |
|---|---|---|---|---|
| Medium, QA coverage | Existing draft / diagnostic entry | Sales draft used production compilation, so ?qa=1 correctly did nothing; remote-device diagnostics were unavailable | Separate ignored dist-qa output and a new draft; production artifact unchanged | Local and remote diagnostic checks pass; all 49 disabled-mode screenshots match |
| Low | QA-GUIDE and helper scripts | Hardcoded 4193/4195 ports disagreed with isolated preview's 4293/4295; manual guide still claimed no staging URL | Updated defaults, QA_BASE_URL support, current staging reference and four-offer checklist | Diagnostics/performance commands execute successfully |
| Medium, test coverage | Header/menu/dock/contact | Existing checks did not repeatedly exercise scroll reversal and short/tall viewport contraction | Added five-engine/project viewport regression cases | Five pass; no additional application CSS fix was needed |

No new major application layout defect was reproduced. Earlier Care contrast, badge readability and copy-generation corrections are documented in the V3 report, including their causes and verification.

## Practical performance measurement

One local Chromium run on the production artifact: 390×844, DPR 2, reduced motion, 4× CPU slowdown, 150ms latency and 200kB/s download. LCP: 1,836ms. CLS: 0.00000596. DOM content loaded: 2,777ms; load: 2,782ms. Raw evidence: test-results/performance.json. These are synthetic single-run observations, not Lighthouse scores, field metrics or evidence of native app smoothness.

The optional Eruda chunk is about 160.6KB gzip and loads only after pressing its console button. It is excluded from ordinary production builds. No reason was found to remove the site's animation or imagery based on this measurement. Scrolling performance with normal animation on physical devices remains part of the manual gate.

## Reusable commands

Existing qa:mobile, qa:visual, qa:full and qa:report remain. New qa:artifact prepares a compiled staging artifact from the existing full dist build; qa:diagnostics and qa:performance run focused checks. QA_BASE_URL selects an already-running server for those helpers and Playwright, avoiding unintended local-server startup. The QA artifact command refuses CONTEXT=production. Build/publish paths and Netlify production configuration are unchanged.

Full setup, baseline review instructions and the physical-device procedure are in QA-GUIDE.md. Open this draft link from inside the installed Facebook app on Pixel 7, confirm it stays in the embedded browser, and repeat in Messenger. Repeat on a real iPhone. Record device, OS/app version, date, orientation, keyboard/browser-controls state, outcome and screenshot evidence. Never submit a real lead as part of an unapproved delivery check.

Production was rechecked after staging: published deploy 6ae6c9bcee944be84e305fee, commit fd7512cec60aca3bc38a648e513ee74ef3047293. No live branch push, DNS or routing change occurred.

Changed files: .gitignore, package.json, playwright.config.mjs, scripts/prerender.mjs, scripts/qa-artifact.mjs, scripts/qa-diagnostics.mjs, scripts/qa-performance.mjs, tests/browser/viewport.spec.mjs, QA-GUIDE.md and this report. Changes remain on the isolated codex/tinychip-growth-v3 branch.
