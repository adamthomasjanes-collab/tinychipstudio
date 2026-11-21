# Historical review

Superseded October 31, 2026 by `COMMERCIAL-REVIEW.md` and `QA-REPORT-2026-11-01.md`. Preserve this document as implementation history; its earlier offer terms are not current public policy.

# Ownership positioning — October 18, 2026

The existing process agreement now carries “YOUR WEBSITE. YOUR BUSINESS. YOUR CALL.” in three typographic beats, using the existing paper, blue, lime, display type and hard shadows. “We don’t hold websites hostage” stays a secondary label. The block retains its existing contact CTA and hidden crew member.

Services explain the custom build and optional future support. CLARIFY and CREATE retain fixed scope, price, timing and approval assurances; DELIVER makes ownership and handoff explicit. Three added FAQs cover monthly fees, another provider, and help after launch. Ownership is limited to agreed custom work after full payment, with third-party licensing, account costs and support scope explained.

No new top-level section or animation was added. The existing hero, work, navigation and conversion controls remain in place.

## Verification

- Production build passed, including seven city pages and 104 KB of prerendered homepage HTML.
- All 11 existing tests passed (`npm test`; email provider mocked).
- Browser inspection used the production preview at 390 × 844, 768 × 1024, 1440 × 900 and 1920 × 1080. No horizontal page overflow or overflowing text in the changed content at those sizes.
- Inspected the rendered ownership block at all four sizes; Services on phone and desktop; the revised process layout on phone and tablet.
- Verified the existing agreement CTA reaches contact, service selection supplies “A new website,” the phone menu opens and closes, and FAQ disclosures respond to Enter/Space and clicks.
- Opened the scorecard and J&T case-study sheets and dismissed them with Escape. The comparison slider responds to the keyboard (50 → 51).
- All nine FAQ entries match the FAQPage JSON-LD. The canonical URL, page title and single H1 remain intact. No production console warnings or errors were observed.
- Responsive refinements: the existing before/after gallery uses a shrinkable single column below 1000 px to prevent long preview URLs from widening the page; process steps stack at tablet widths so the handoff copy has room.

Screenshots and viewport measurements are in the ignored `test-results/ownership/` directory.

Live form delivery, external booking and cross-browser/device testing were not performed. This change was built and checked locally; it was not deployed.


## October 19, 2026 — optional ownership and care offers

This local update supersedes the earlier pay-once-only copy: Build & Own remains available from $1,200 one time with no required care. Build + Care is an optional 18-month agreement ($300 setup + $149/month, split $50 build / $99 care), with future care optional and early exit limited to the unpaid build balance. Website Care starts at $99/month for qualifying existing platforms without required migration.

See WEBSITE-OPTIONS-REVIEW.md for the exact copy, files, screenshots, passing six-width browser QA and approval decisions. No deployment or push was performed.
