# Tiny Chip Studio

Work in `D:\Dev\sites\tinychipstudio` on the `preview` branch. Push this branch in GitHub Desktop to save your work. Run `npm run deploy:preview` to build and update https://preview--tinychipstudio-review.netlify.app/. Production still deploys from the original studio folder in the monorepo. This checkout contains the studio site and portfolio media only.

React 18 + Vite site for Tiny Chip Studio, with Chip as the on-page guide. Approved pricing and service terms live in `src/offers.js`: Website + Care ($197/month, qualifying $0 upfront builds with a 12-month initial agreement), Build & Own (from $1,200 once), and existing-site Website Care (from $99/month). See `COMMERCIAL-REVIEW.md` for unresolved contract decisions.

## Local setup
```
npm install
npm run dev        # local preview
npm run build      # production build → dist/
npm run preview    # serve the build
npm run brand      # regenerate logo, favicon, Chip and badge files in public/
npm run format
npm test           # offer, typography and mocked email-provider checks
npm run qa:full    # studio build + Chromium/WebKit functional and visual QA
```
On Windows PowerShell, run these one at a time (older PowerShell doesn't accept `&&`).

## Page order
The homepage introduces the offer and choice, explains the service, then shows the process, real work and answers. The portfolio and mascot remain part of the studio identity.

| # | Section | Job | File |
| --- | --- | --- | --- |
| – | Hero | Main offer, visible 12-month disclosure, qualifying CTA and buy-once alternative | `components/Hero.jsx` |
| 01 | Website partner | Benefits, flagship service details, three offers and free scorecard | `components/Services.jsx` + `WebsiteOptions.jsx` |
| 02 | How it works | Three steps, agreement principles and founder | `components/Process.jsx` + `Founder.jsx` |
| 03 | Hired work | J&T Auto Service, AM's and Camp Perry | `components/Clients.jsx` |
| 04 | Before & after | Labelled concepts and approved designs, including Pioneer Mill prototype | `components/Work.jsx` |
| 05 | Questions | Offer, scope, ownership and care answers with matching structured data | `components/Faq.jsx` |
| 06 | Let's find the right fit | Short qualification form, first on phones | `components/Contact.jsx` |

`Problem.jsx`, `Proof.jsx`, `Stakes.jsx` and `About.jsx` are no longer rendered; they are kept for reference. Current layout layers are `src/conversion.css` and `src/responsive.css`, with responsive corrections loaded last.

## Chip (the mascot)
- `src/chip/sprite.js` is the single source: every pose, the 16 px mini Chip, the crew colours and the pixel wordmark letters, drawn on a 32 × 32 grid.
- `src/chip/Chip.jsx` renders and animates him (`pose`: idle, wave, point, cheer, think, wow, sleep, walk, run; `look`; `talking`; `boot`; `crew`). Animation is CSS only (`src/chip/chip.css`), pauses off-screen and is off for reduced-motion visitors.
- `src/chip/Logo.jsx` is the header lockup and the `Wordmark`.
- On dark backgrounds, add `on-dark` to the section so Chip's leads turn light.

## The guide and the hidden crew
- `src/guide/Guide.jsx` is the floating Chip. Sections opt in with `data-guide="key"`; his lines live in `guideLines` in `src/data.js`. On phones he becomes the sticky START A PROJECT bar.
- Five crew members hide on the page (`<CrewMember crew="byte" … />` in Clients, Services, Process, Faq and Footer). Finding all five unlocks a celebration and a CTA. Progress is kept in the visitor's browser only.

## Lead form
`components/Contact.jsx`. Name, email and a project description are required. Business name and current website are optional; the preferred approach is visible; budget and timing are optional expandable fields. Service buttons and project inquiry links preselect context without replacing typed content (`src/lib/inquiry.js`).

It's set up for **Netlify Forms**: deploy to Netlify, then turn on form detection (Site → Forms). Submissions appear in the Netlify dashboard, and `netlify/functions/submission-created.mjs` emails them via Resend.
- Somewhere else? Put a form service URL (Formspree, Basin…) in `FORM_ENDPOINT` in `src/site.js`.
- Sends are bounded (15 s) and never claim success early; on failure or timeout the text stays put and the visitor can retry or email. If no form backend answers, it hands the visitor a pre-written email.
- The hidden twin of the form in `index.html` must keep the same field names, including `business`, `project` and `ref`.
- Delivery, retries, duplicate protection and analytics events: see `MEASUREMENT.md`. `npm test` checks the email function against a mocked provider.

## Booking
"Book a 15-minute call" links go straight to `BOOKING_URL` (Calendly) in a new tab, tagged with UTM values for the button used (`src/lib/booking.js`). `/book` redirects there too. The in-page call-request sheet (`#book-call`) only appears if `BOOKING_URL` is emptied, or for old `#book-call` links.

## "Website by" badge for client sites
Generated into `public/badge/` by `npm run brand`. Open `/badge/` on the live site for a demo and copy-paste code. Three options: paste the snippet, use the `<tcs-badge>` script tag, or use the image files. The link and label come from `scripts/brand.mjs` (`SITE`, `LABEL`) and `BADGE_URL` in `src/site.js`.

## Brand files
`npm run brand` writes `public/favicon.svg`, `public/brand/*.svg` (stacked and one-line logos for light and dark, wordmark, Chip, animated Chip, crew, app icon, 404 Chip) and the badge kit. The PNGs (`og-image.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `favicon-32.png`) were exported from those SVGs; re-export them if Chip changes.

## Keeping copy in sync with adamthomasjanes.com
Keep project histories and founder facts aligned with the personal portfolio. Tiny Chip's approved offer directive and `src/offers.js` are the source of truth for studio pricing and service terms; do not overwrite them with older personal-site offer copy.

| adamthomasjanes source | tinychipstudio file |
| --- | --- |
| `src/data/portfolio.ts` | `src/projects.js` |
| `components/portfolio/WebPortfolio.tsx` (hero, belief, about, timeline) | `Hero`, `Problem`, `About` |
| `Engagements.tsx` | `Services`, `Process`, `src/data.js` |
| `BeforeWeBegin.tsx` | `src/data.js` (`faq`) |
| `ContactSection.tsx` | `Contact` |
| `data/identity.ts` | `src/site.js`, `index.html` JSON-LD |

StoryBrand-only copy (problem, proof, ownership, stakes, Chip's lines, form options) lives in `src/data.js` below the StoryBrand marker.

The studio's philosophy remains “Your website. Your business. Your call.” Build & Own and Website + Care have distinct rights and service arrangements. Preserve the distinction, especially the flagship's pending written contract details. See `COMMERCIAL-REVIEW.md`, `QA-GUIDE.md` and `QA-REPORT-2026-11-01.md` for the current review; earlier QA/ownership documents are historical.

## Voice rules
- Studio voice: "we" and "our". No "I", "me" or "my" in the studio's own copy, and no headcount claims. Adam Thomas Janes is named as founder.
- Visitor voice keeps "I": FAQ questions, decision questions, client quotes, form options, "I WANT THIS COLUMN".
- Chip is a character and speaks as himself.
- Only real numbers and real quotes. Label concepts, approved designs, live and commissioned work exactly as the live site does.
