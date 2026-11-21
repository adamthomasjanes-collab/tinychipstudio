import { writeFileSync } from 'node:fs';
import { offers, offerFaq, heroTeaser, heroDisclosure, allowanceReview } from '../src/offers.js';
const text=`# V3 copy and publication review — November 2, 2026

## Positioning

Tiny Chip Studio builds distinctive websites and helps businesses handle the opportunities they create. ATTRACT / CONVERT / UNDERSTAND connects design, contact opportunities and practical reporting. Your website. Your business. Your call.

The $297 Growth package is featured. The $197 Care package remains a complete website-and-care service. Ownership and narrower existing-site care are meaningful, quieter alternatives. Services are configured and tested for each customer during onboarding.

## Before and after

| Area | Published baseline | V3 preview |
|---|---|---|
| Hero | A BETTER WEBSITE. A BETTER WAY TO GET ONE. | A BETTER WEBSITE. A BETTER WAY TO GROW. |
| Supporting message | Professional design and ongoing support; upkeep, updates and technical details | Distinctive websites that help people understand your business and get in touch. We handle the care and reporting, with inquiry and follow-up tools configured during onboarding with Growth. |
| Offer hierarchy | Featured $197 Care, $1,200 Build & Own, $99 existing-site care | Featured $297 Growth beside $197 Care; ownership and existing-site care below |
| Benefits | Build / care / direct support | Attract / convert / understand; shared website-and-care foundation retained |
| Updates | Up to 30 minutes each week | Proposed 30 minutes/month Care and 60 minutes/month Growth; previous allowance explicitly disclosed, existing agreements unchanged |
| Inquiry choices | Three offers and not sure | New website, four offers, inquiry/follow-up help and not sure; no new required field |
| FAQ | Website, care and ownership | Adds Growth readiness, usage/AI charges, CRM learning, availability and next steps |

## Homepage copy

Hero: A BETTER WEBSITE. A BETTER WAY TO GROW.

${heroTeaser}

${heroDisclosure}

Primary: SEE IF MY BUSINESS QUALIFIES. Secondary: SEE WHAT’S INCLUDED. The hero qualification CTA starts a neutral “Not sure yet” inquiry; package CTAs select that package without erasing entered information. Buy-once link and before/after comparison remain visible.

Benefits: GOOD BUSINESS. BETTER FOLLOW-THROUGH.

- ATTRACT: Make a great first impression. A website that makes your business easy to understand and trust.
- CONVERT: Make it easy to reach you. Useful contact forms, clear next steps and appointment options where appropriate.
- UNDERSTAND: Keep opportunities in view. Practical reporting today. Organized inquiries and follow-up tools configured for your business with Growth.

Pricing: A STRONG START. ROOM TO GROW. Two primary monthly packages, three scannable benefits per package, expandable complete inclusions, and clearly visible price/commitment/readiness. Growth uses dark ink and restrained lime emphasis. Care uses paper and ink. Ownership/care-only choices use quieter editorial rows.

Shared foundation: BUILT WITH CARE. BACKED BY PEOPLE. Three existing-service accordions: website worth sharing, care without technical chores, reporting you can use. Free scorecard retained.

Final CTA: LET’S FIND THE RIGHT FIT. A new website, ongoing care or better follow-through? Tell us what would help your business. We’ll reply by email with a clear next step. Explore our work remains available.

## Final package copy

${offers.map(o=>`### ${o.name} — ${o.price}

${o.cadence}

${o.description}

${o.detail}

${o.availability||''}

${(o.comparison||[]).map(([a,b])=>`- **${a}:** ${b}`).join('\n')}

CTA: ${o.cta}`).join('\n\n')}

## Approval notice

${allowanceReview}

The approval banner is a review aid. Remove it only after the commercial decisions have been recorded and approved copy replaces proposals. Adam approved offering scoped services configured during onboarding. This does not assert that the studio’s own automation is already running.

## FAQ copy

${offerFaq.map(f=>`### ${f.q}\n\n${f.a}`).join('\n\n')}

## Deployment authority and publication steps

Verified source: adamthomasjanes-collab/adamthomasjanes, main, base tinychipstudio, command npm run build, publish dist. The standalone adamthomasjanes-collab/tinychipstudio repo is not the live Git deployment source. Published deploy 6ae6c9bcee944be84e305fee uses commit fd7512cec60aca3bc38a648e513ee74ef3047293 (see the exact authoritative SHA in deployment-authority-2026-11-02.json).

Implementation lives in the isolated local branch codex/tinychip-growth-v3 under test-results/v3/tinychipstudio. The user's original working copies and unrelated client projects were preserved. Local node_modules junctions reuse already-installed dependencies; they are ignored, not source artifacts.

1. Record Adam’s decisions from COMMERCIAL-REVIEW.md. Approve or revise the new-client allowances and Growth qualifying terms; agree usage and operational availability. Existing signed contracts remain unchanged.
2. Apply the approved decisions in src/offers.js, update the review notice, run npm run build and npm test, then npx playwright test. Review changed screenshot baselines intentionally. Never blindly update them to hide a failure.
3. Recheck the live Netlify published SHA and repository mapping. Fetch the authoritative GitHub repo into a clean checkout; integrate this scoped branch/patch onto its latest main. Resolve only Tiny Chip files and inspect the diff; do not overwrite dirty original work or unrelated projects. The local clone shares objects with the parent, so retain both until changes have been transferred.
4. Keep existing netlify.toml, site ID, DNS and repository routing. Use the existing site 69267e41-d884-4c6b-951d-f08688b97161 for a draft/PR preview. Review physical-device Facebook and Instagram behavior, real authorized form delivery and client workflow setup and testing separately.
5. Only after Adam explicitly approves publication, merge the reviewed Tiny Chip changes into the authoritative repo's main branch. Git-connected Netlify then builds the tinychipstudio directory with npm run build and publishes dist. No direct production deploy is required.
6. Verify the resulting published commit, home/local pages, pricing and form behavior. Fix forward through the same reviewed path if necessary. Do not change routing or use the standalone repo as a shortcut.

No production push, merge or publication has been authorized or performed in this task. No new Netlify project, HighLevel upgrade, Stripe subscription or integration was created.
`;
writeFileSync(new URL('../docs/V3-REVIEW.md',import.meta.url),text);
