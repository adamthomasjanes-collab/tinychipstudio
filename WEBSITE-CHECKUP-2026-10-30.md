# Website checkup — October 30, 2026

## Follow-up: replacement prototype supplied

The owner supplied the working original prototype at https://adamthomasjanes.com/concept/prototype/. This supersedes the archive-only treatment described in the initial audit below. The homepage, comparison, both case-study links, four affected city pages, city-page generator and `llms.txt` now use that address. Pioneer Mill is again labeled as an available independent concept; its copy no longer describes the linked prototype as WordPress or screenshots only. The retired WordPress destination remains removed. The replacement URL returned HTTP 200, and the updated main-site production build and prerender succeeded. Changes remain local and have not been deployed.

The following records the initial audit before that clarification.

## Result

The live Tiny Chip Studio site still links to the retired Pioneer Mill WordPress demo. The local source and production build now remove that destination everywhere found. These changes have **not been deployed**.

Pioneer Mill remains portfolio evidence, clearly labeled as an archived, independent concept. Its homepage button opens the local case study. The comparison and case-study panels omit external website buttons when no demo URL exists. Tiffin, Findlay, Fremont and Bowling Green cards link to the preserved full-design screenshot instead. `llms.txt` also links to that screenshot and explains that the hosted demo is retired. The city-page generator has been updated so a future build will preserve the fix.

The homepage caption now dates the original screenshot to October 2026 instead of calling it the business's site “today.” The case study retains its non-commissioned status and AI-generated imagery disclosure.

A narrow-phone layout issue was also corrected: the hero grid's children can now shrink to the available width, preventing right-edge clipping at 320px.

## Verification

- Production build succeeded, including the four nested client-concept builds; homepage prerendering succeeded.
- All 11 existing email-handler tests passed using a mocked provider.
- Existing inquiry-flow browser checks passed: retained drafts, optional fields, keyboard service selection, fallback after a simulated unavailable endpoint, and simulated success. No real inquiries or emails were sent.
- All nine comparison tabs were exercised. Pioneer Mill's case study opens from the hero and comparison, contains no external demo links, closes with Escape, and restores focus to the hero button.
- Keyboard comparison-tab navigation and slider Home/End controls passed; mobile navigation opens and closes correctly.
- Layout checked at 320, 390, 768, 1024, 1440 and 1920px after resize settling. Seven city pages, privacy and 404 pages checked at phone width.
- 53 image URLs and responsive variants resolved locally with image responses. No missing in-page fragment targets, browser errors or failing page-resource responses were observed.
- Automated WCAG A/AA scan of the mobile homepage with Pioneer Mill selected returned no violations. This is a scoped automated check, not a complete accessibility certification.
- Public HTTP checks: homepage, seven city pages, privacy, robots, sitemap, `llms.txt`, archived screenshot and all 12 remaining portfolio destinations returned 200. `/book` reached Calendly; an unknown URL returned the intended 404. Main-site security headers were present.
- Source/public/build searches found no remaining retired Pioneer Mill address or old demo-button labels.

## Remaining items and limits

1. **Publish the changes.** The live homepage, four city pages and `llms.txt` still contained the retired link during this audit. The workspace already contained extensive unrelated changes; this checkup did not commit or deploy them.
2. Live inquiry acceptance, email delivery and booking completion were not exercised. The form tests were intercepted locally; the booking check verified only the public destination response.
3. Nested client-demo builds emitted existing bundle-size warnings, plus font-reference warnings for Eriesponsible and script-bundling notices for Marks/Tricounty. Builds completed, but those separate demos were not audited end to end.
4. External portfolio destinations were checked for HTTP availability, not every interaction. Social-profile availability was not tested.

Detailed local evidence is in the ignored `test-results/checkup/` directory (`browser.json`, `live.json` and screenshots); existing form-flow results are in `test-results/website-options/`.
