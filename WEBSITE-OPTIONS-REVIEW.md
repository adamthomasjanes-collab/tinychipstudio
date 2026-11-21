# Historical review

Superseded October 31, 2026 by `src/offers.js`, `COMMERCIAL-REVIEW.md` and `QA-REPORT-2026-11-01.md`. Earlier pricing and commitment terms below are historical, not the current offer.

# Website options — local review package

October 19, 2026. Proposed copy only. No deployment, upload, push, checkout, invoicing or subscription backend was added or triggered during this task.

## Changes

- Reviewed the current dirty working tree and both supplied specifications. Kept existing work, hero, Chip, hired-client proof, portfolio, navigation and inquiry form architecture.

- Added YOUR WEBSITE. YOUR TERMS. within Services, after the existing service list and before the scorecard. Build & Own is the first lime panel; Build + Care is the second dark panel; standalone care is a quieter strip.

- All three CTAs use startInquiry and the existing need field. The existing form handler merges the selection into the draft rather than replacing typed fields. No Contact.jsx changes were necessary.

- Updated ownership and launch/handoff language to accommodate the installment schedule, while retaining one-time ownership with no required care.

- Offer and FAQ data share src/offers.js, re-exported by src/data.js. The homepage OfferCatalog, visible FAQ and FAQPage data use the same source. Homepage meta descriptions and ProfessionalService priceRange are consistent. All seven generated city pages include the same care/ownership FAQs and offer catalog, plus a link to the choices.

- Fixed existing 320px client-card overflow with min-width: 0 and wrapping; preserved the card design.

## Files touched for this task

- New: src/offers.js, src/components/WebsiteOptions.jsx, scripts/qa-options.mjs, WEBSITE-OPTIONS-REVIEW.md.

- Updated: src/data.js, src/components/Services.jsx, src/conversion.css, src/site.js, index.html, scripts/cities.mjs, OWNERSHIP-QA.md.

- Regenerated: public/{bowling-green,findlay,fremont,port-clinton,sandusky,tiffin,toledo}/index.html and ignored dist output.

- Local QA artifacts: test-results/options-before-{desktop,mobile}.png; test-results/website-options/options-{320,390,768,1024,1440,1920}.png; viewport screenshots and results.json in the same directory.

## Offer wording for approval

TWO WAYS TO GET YOUR WEBSITE. NO SURPRISES.

YOUR WEBSITE. YOUR TERMS.

Some businesses want to pay once and take the keys. Others would rather spread the cost and let us handle the upkeep. Either way, the scope and price are clear before we start.

### Build & Own

From $1,200 · ONE TIME

A scoped custom website built around your business. Own the agreed custom deliverables after full payment, subject to third-party licenses. No mandatory maintenance contract. You choose who manages it next.

Take the keys. Choose your hosting. Future help is optional.

CTA: BUILD IT & OWN IT

### Build + Care

From $300 setup · + $149/MONTH FOR 18 MONTHS

A smaller upfront payment for an eligible starter website. We handle the agreed upkeep while you pay off the build. After 18 months, the build is paid in full and future care is your choice.

$50 build + $99 care each month. $2,982 total over 18 months: $1,200 build + $1,782 care.

CTA: ASK ABOUT THE MONTHLY OPTION

### Website Care

From $99/month · FOR EXISTING WEBSITES

Keep your website and your provider if they fit. We can support qualifying Wix, WordPress and other websites after a review. No automatic hosting move; platform and third-party fees remain separate unless agreed.

Care only. A new website build is not included.

CTA: TALK ABOUT WEBSITE CARE

### Shared terms

Starting rates require an agreed scope and written quote. Build + Care is for eligible starter websites and requires an 18-month agreement. Early cancellation requires only the unpaid agreed build balance, not future undelivered care fees. Domains, premium apps, platform fees and custom integrations may cost extra.

## FAQ wording

### Do I have to pay Tiny Chip Studio every month?

No. Build & Own starts at $1,200 one time, with no required care plan. Build + Care is an optional 18-month agreement starting at $300 setup plus $149/month: $50 toward the build and $99 for care. That totals $2,982: $1,200 for the build and $1,782 for care. All starting rates require a scope and written quote.

### What exactly is included in website care?

From $99/month for qualifying sites: agreed routine uptime and technical monitoring, key link/SSL and basic technical SEO checks, inquiry-form testing where applicable, supported security/dependency maintenance, hosting management where eligible, and a short monthly summary. Includes up to 30 minutes of minor text or image updates using supplied content each month, with no rollover. The checklist, access, support hours and turnaround are agreed before work starts.

### What is not included in care?

No unlimited revisions, new pages or features, e-commerce, custom booking integrations, large design changes, content creation, full SEO campaigns, guaranteed rankings or 24/7 emergency support. These are excluded or separately quoted. Domains, premium apps, plugins, hosting and other third-party platform costs may be separate.

### Can you care for my existing Wix or WordPress website?

Yes, if it qualifies after a technical and scope review. You do not automatically need to change hosting providers. You keep control of your platform and domain accounts; Wix, WordPress hosting and other provider charges remain separate unless explicitly included. Website Care does not include a new build.

### What happens after the 18 months?

The agreed starter build is paid in full. You own the agreed custom deliverables, subject to third-party licenses, and receive the files and access specified in your agreement. You can manage the site yourself, choose another provider or separately agree to optional care. No automatic care renewal without clear consent. Hosting and domain provider fees may still apply.

### Can I cancel Build + Care early?

Yes, under the written agreement. Only the unpaid agreed build balance remains due; there is no charge for future undelivered care. For the starter example, after six paid months, $300 setup plus six $50 build payments equals $600 paid toward the $1,200 build, leaving $600. Notice, final payment, access and handoff terms are agreed in writing before you sign.

### Is standalone Website Care a long-term commitment?

Website Care for an existing qualifying site is month-to-month with an agreed notice period. It is separate from the 18-month Build + Care agreement. We define scope, third-party costs and cancellation terms in writing before you agree.

## Ownership pledge

YOUR WEBSITE. YOUR BUSINESS. YOUR CALL.

Pay once or choose a clear payment schedule. Ownership stays the point.

Choose Build & Own or the agreed Build + Care payment schedule. After full payment, the agreed custom work is yours, subject to third-party licenses.

Build & Own has no mandatory care plan. Build + Care includes care for its 18-month term; future care is optional. No ongoing fee to Tiny Chip Studio just to keep a paid-off site online.

You control your hosting and domain accounts. Provider and third-party service fees may still apply.

Choose who helps next. We’re here for optional updates and support, quoted separately.

We build websites for our clients. Not subscriptions they can’t escape.

## Delivery step

Launch after your approval under the agreed payment schedule. After full payment, you own the agreed custom work. Files, access and handoff terms are set out before we start.

## Verification

- npm test: 11/11 existing tests passed.

- npm run build: passed, including seven city pages and 115 KB of prerendered homepage markup.

- Local production browser QA in Edge/Chromium: all six widths passed, with no horizontal page overflow. All six offer screenshots visually reviewed.

- Each of the three CTAs tested at every width using keyboard activation. Contact heading receives focus; name, email, message, URL, budget and timing remain intact.

- Draft restoration after reload, selected offer in the form POST payload, unavailable-backend email fallback, back-to-form preservation, and simulated success passed. POST requests intercepted locally; no inquiry was sent.

- FAQ keyboard disclosure, reduced-motion and normal-motion selection passed. No unexpected console warnings, errors or React hydration errors.

- Starting price remains $1,200. Arithmetic verified: $300 + 18 × $50 = $1,200; $50 + $99 = $149; $300 + 18 × $149 = $2,982.

- git diff --check passed. Existing CRLF normalization notices are not whitespace errors.

- Readable 16px minimum notes, 18px offer body, visible focus outlines and 48px minimum offer CTAs. Dark/paper/lime colors retained; blue eyebrow uses existing accessible #2448c4.

## Scope of verification

Local Edge/Chromium, including emulated responsive widths. Real phones, Safari/Firefox, screen-reader use and live form delivery have not been tested. This is marketing and lead qualification only; no payments or subscriptions are represented as available to purchase.

## Decisions before publication

- Approve the design and exact wording above, including the proposed prices and 18-month agreement.

- Define starter-site eligibility: pages/sections, revisions, content duties, integrations and launch scope.

- Approve the actual care checklist, hosting allowance, platform access, support hours/turnaround and tracking of the 30-minute allowance.

- Finalize written notice, unpaid-build calculation, payment schedule, licensing, account access and handoff terms. Standalone care notice period remains to be agreed; no automatic renewal without clear consent.

- Recommendation: publish this ownership-first presentation only after those commercial and operational details are approved. Batch it with the other projects when Adam explicitly requests deployment.

## Screenshots

[Before desktop](test-results/options-before-desktop.png) · [Before mobile](test-results/options-before-mobile.png)

[After 320px](test-results/website-options/options-320.png)

[After 390px](test-results/website-options/options-390.png)

[After 768px](test-results/website-options/options-768.png)

[After 1024px](test-results/website-options/options-1024.png)

[After 1440px](test-results/website-options/options-1440.png)

[After 1920px](test-results/website-options/options-1920.png)
