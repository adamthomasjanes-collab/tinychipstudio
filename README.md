# Tiny Chip Studio

React 18 + Vite site for Tiny Chip Studio. The copy mirrors adamthomasjanes.com in the studio's "we" voice, arranged as a StoryBrand story with Chip, the studio mascot, as the on-page guide.

## Local setup
```
npm install
npm run dev        # local preview
npm run build      # production build → dist/
npm run preview    # serve the build
npm run brand      # regenerate logo, favicon, Chip and badge files in public/
npm run format
```
On Windows PowerShell, run these one at a time (older PowerShell doesn't accept `&&`).

## Page order (StoryBrand)
| # | Section | StoryBrand beat | File |
| --- | --- | --- | --- |
| – | Hero | What the customer wants + direct and transitional CTAs | `components/Hero.jsx` |
| 01 | The problem | External / internal / philosophical problem | `components/Problem.jsx` |
| 02 | Your guide | Empathy + authority (real numbers, real quotes) | `components/Proof.jsx` |
| 03 | Selected work | Proof | `components/Work.jsx` + `CaseStudySheet.jsx` |
| 04 | The plan | Three steps + the agreement | `components/Process.jsx` |
| 05 | Ways to work together | Offers + free scorecard | `components/Services.jsx` |
| 06 | What's at stake | Failure vs. success | `components/Stakes.jsx` |
| 07 | Behind the work | Founder | `components/About.jsx` |
| 08 | Questions | Objections | `components/Faq.jsx` |
| 09 | Your next step | Lead form | `components/Contact.jsx` |

## Chip (the mascot)
- `src/chip/sprite.js` is the single source: every pose, the 16 px mini Chip, the crew colours and the pixel wordmark letters, drawn on a 32 × 32 grid.
- `src/chip/Chip.jsx` renders and animates him (`pose`: idle, wave, point, cheer, think, wow, sleep, walk, run; `look`; `talking`; `boot`; `crew`). Animation is CSS only (`src/chip/chip.css`), pauses off-screen and is off for reduced-motion visitors.
- `src/chip/Logo.jsx` is the header lockup and the `Wordmark`.
- On dark backgrounds, add `on-dark` to the section so Chip's leads turn light.

## The guide and the hidden crew
- `src/guide/Guide.jsx` is the floating Chip. Sections opt in with `data-guide="key"`; his lines live in `guideLines` in `src/data.js`. On phones he becomes the sticky START A PROJECT bar.
- Five crew members hide on the page (`<CrewMember crew="byte" … />` in Work, Services, Process, Stakes and Footer). Finding all five unlocks a celebration and a CTA. Progress is kept in the visitor's browser only.

## Lead form
`components/Contact.jsx`. Out of the box it is set up for **Netlify Forms**: deploy to Netlify, then turn on form detection (Site → Forms). Submissions appear in the Netlify dashboard; add an email notification there.
- Somewhere else? Put a form service URL (Formspree, Basin…) in `FORM_ENDPOINT` in `src/site.js`.
- If neither is available, the form never pretends to send: it hands the visitor a pre-written email instead.
- The hidden twin of the form in `index.html` must keep the same field names.

## "Website by" badge for client sites
Generated into `public/badge/` by `npm run brand`. Open `/badge/` on the live site for a demo and copy-paste code. Three options: paste the snippet, use the `<tcs-badge>` script tag, or use the image files. The link and label come from `scripts/brand.mjs` (`SITE`, `LABEL`) and `BADGE_URL` in `src/site.js`.

## Brand files
`npm run brand` writes `public/favicon.svg`, `public/brand/*.svg` (stacked and one-line logos for light and dark, wordmark, Chip, animated Chip, crew, app icon, 404 Chip) and the badge kit. The PNGs (`og-image.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `favicon-32.png`) were exported from those SVGs; re-export them if Chip changes.

## Keeping copy in sync with adamthomasjanes.com
The live site is the source of truth for services, projects, FAQ and founder facts.

| adamthomasjanes source | tinychipstudio file |
| --- | --- |
| `src/data/portfolio.ts` | `src/projects.js` |
| `components/portfolio/WebPortfolio.tsx` (hero, belief, about, timeline) | `Hero`, `Problem`, `About` |
| `Engagements.tsx` | `Services`, `Process`, `src/data.js` |
| `BeforeWeBegin.tsx` | `src/data.js` (`faq`) |
| `ContactSection.tsx` | `Contact` |
| `data/identity.ts` | `src/site.js`, `index.html` JSON-LD |

StoryBrand-only copy (problem, proof, promises, stakes, Chip's lines, form options) lives in `src/data.js` below the StoryBrand marker.

## Voice rules
- Studio voice: "we" and "our". No "I", "me" or "my" in the studio's own copy, and no headcount claims. Adam Thomas Janes is named as founder.
- Visitor voice keeps "I": FAQ questions, decision questions, client quotes, form options, "I WANT THIS COLUMN".
- Chip is a character and speaks as himself.
- Only real numbers and real quotes. Label concepts, approved designs, live and commissioned work exactly as the live site does.
