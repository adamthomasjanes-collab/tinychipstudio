# Tiny Chip Studio — polish audit

October 26, 2026. Read-only product audit with independent UX, art-direction and business/mentor critiques. No site source edits, commits, pushes or deployments.

## Executive judgement

The brand is memorable, but the experience asks for an inquiry before making it easy to experience the work. The concept link exists; its placement, low visual weight and competing actions make it unnecessarily difficult to discover. This is a verified hierarchy problem, not evidence of measured visitor abandonment.

## Evidence and scope

Reviewed homepage source, navigation, hero, hired proof, Services/options, before/after gallery, case-study sheet, Process/ownership/founder, FAQ, contact and footer. Browser inspection used a fresh local Vite preview at 127.0.0.1:4192, 1280 × 720. Project switching and case-study opening/closing worked. Mobile recommendations derive from responsive source and the earlier options screenshots; no new physical-device or mobile usability study was conducted. No external concept destination uptime check, live form submission, analytics review or performance benchmark was performed.

The pre-existing localhost:4188 preview is older than current source: it lacks the monthly options and shows older ownership wording. Its reveal headings remained opacity 0 and clicking Pioneer Mill did not switch the selected project. The fresh source preview did switch correctly and reveal its headings. Treat this as a separate preview reliability issue, not a demonstrated production outage.

At 1280px, the fresh source gallery begins approximately 6,588px down the page. Services occupies approximately 4,132px. The selected Pioneer Mill external concept link sits approximately 826px below the comparison panel top. Measurements describe this viewport and content, not all devices.

## Prioritized findings

### 1. High — put the concept action beside the comparison, before the explanation

Work.jsx puts three design decisions above .ba-actions. The lime button requests an inquiry; the case-file control follows; the external concept link comes last and uses text-link--quiet (85% opacity). CaseStudySheet.jsx and Clients.jsx repeat this sales-first hierarchy.

Proposed right-hand composition:

- PIONEER MILL
- Independent redesign concept · not commissioned
- Sell the evening, not the entrée.
- **OPEN CONCEPT WEBSITE ↗** — filled lime button
- Explore the working website. Opens in a new tab.
- READ CASE STUDY — secondary link
- Three concise design improvements
- WANT SOMETHING LIKE THIS? — inquiry action after proof

Use OPEN CLIENT WEBSITE for actual client sites and VIEW APPROVED DESIGN where appropriate. Never relabel a concept as a commissioned live site. Keep the comparison as a slider; do not turn its drag surface into an external link.

On mobile, put the same primary action immediately below the comparison, before narrative. Keep it in normal page flow, not another fixed bar.

### 2. High — clarify routes to work

Header.jsx WORK targets #clients; Hero.jsx SEE THE WORK targets #work. The header has no direct before/after entry and its section tracking excludes #work. During gallery inspection the header still highlighted Services.

Use explicit CLIENT WORK and BEFORE & AFTER navigation labels, or one clear Work grouping with both destinations. Add a direct bridge from hired proof to the gallery. Make the hero comparison offer OPEN PIONEER MILL CONCEPT and COMPARE MORE WEBSITES. Currently the hero features Pioneer Mill but the gallery initially selects Three Legged Dog.

### 3. High — let people experience the work before the full sales menu

Current order is Hero → Clients → Services/options/scorecard → Before & After → Process → FAQ → Contact. The enlarged Services section delays the gallery substantially.

Recommended revised order for approval: Hero → Hired-client proof → Before & After → Services and ownership options → Process/ownership/founder → FAQ → Contact. This is a proposed change to the previously approved hierarchy, not an edit made during this audit. If retaining the order, direct gallery navigation and the bridge after client proof are essential.

### 4. Medium — compact the project chooser

Nine equal text tiles occupy the heading’s right side before the comparison starts. Business names and towns alone do not announce that they switch the preview. Add CHOOSE A BEFORE & AFTER, reduce vertical padding, keep a clear selected state and repeat the selected business name by the open-concept action. Preserve keyboard tabs and all projects. Avoid replacing discoverable choices with an unexplained carousel.

### 5. Medium — separate reading from exploring

OPEN THE FULL CASE FILE, HOW WE BUILT IT, EXPLORE THE LIVE CONCEPT, EXPLORE WORDPRESS DEMO and EJECT FILE make visitors decode destination and action. Standardize OPEN CONCEPT WEBSITE / READ CASE STUDY / CLOSE CASE STUDY. Keep playful file language in eyebrows and decoration. Add the concept link near the top of each case-study sheet, not only after the hero image and two explanatory sections.

### 6. Medium — let Chip help without blocking controls

The guide tip visibly overlapped the lower-right project chooser. Source opens tips on section changes. Default to collapsed in the gallery or place the tip outside controls; retain Chip and the slider handle. Suggested gallery tip: “Drag to compare. Open the concept to try it.” The current “Open any file” does not explain the difference between a case study and a website.

### 7. Medium — simplify the service decision

The site offers improvement/new website/review, then Build & Own/Build + Care/Website Care. Those are partly different decisions: project need versus payment/support preference. Introduce those groups explicitly. Later, consider separate optional form fields instead of mixing all choices into one need list. Preserve entered details and all transparent pricing.

### 8. Medium — reduce repeated explanations, not essential terms

The page repeats ownership and care terms in panels, shared terms, the ownership pledge and fifteen FAQs. Lead the pledge with the memorable human promise; keep a short practical summary. Group FAQ questions into Cost & options, Ownership & care, and Working together. Put general cost/timeline questions before specialized cancellation questions. Keep the 18-month obligation, payment split, total, exit balance and third-party fees plainly accessible.

### 9. Lower — tune the supporting hierarchy

Hero: retain the headline, preview and $1,200 signal. Give exploration an obvious route alongside Start a Project; demote competing call/scorecard actions visually.

Client proof: retain real quotes and status distinctions. Make VISIT CLIENT WEBSITE obvious; image/case study interaction should have a readable label.

Process/founder: keep the three-step structure, ownership promise and direct relationship with Adam. Reduce repeated setup spacing and long all-caps explanations rather than adding decoration.

Contact: preserve the short required fields, draft handling and optional details. Add a response window only if it is operationally reliable. No invented promise.

Footer: preserve direct links and local-service destinations. The crew hunt is a bonus, not the main next step. Keep the return-to-work path easy to find.

Motion: preserve reduced-motion support. Use reveals, scramble text, hover effects and marquee sparingly around decisions; essential headings should remain readable if enhancement fails.

## What each reviewer would say

Artist: Keep the personality. Give the actual project imagery more quiet space around it.

Designer: Reassign the brightest button to the visitor’s immediate task: opening the concept.

UX reviewer: Make the difference between choosing a project, reading its case study and opening its website explicit.

Boss: Show the product before asking for the lead. Measure exploration and qualified inquiries, not just button counts.

Mentor: The work does not need more justification before visitors can touch it. Let them explore, then explain the thinking.

## Implementation order

1. Top-right concept CTA and immediately adjacent mobile action; consistent action labels; same treatment in case-study sheet and client proof.
2. Direct before/after navigation, correct active navigation state, hero concept link and client-to-gallery bridge.
3. Compact chooser and prevent guide overlap.
4. Review proposed section reorder and simplify repeated Services/FAQ/ownership presentation.
5. Regression test all projects, destination/status correctness, keyboard order, slider operation, focus restoration, inquiry draft retention, reduced motion, mobile/touch and prerender hydration.

## Acceptance checks

- A visitor can find a clickable concept from the hero or header without opening a case-study modal.
- Desktop: selected project, comparison and primary concept CTA are visible together at a normal laptop viewport.
- Mobile: the concept action follows the image before long explanatory text.
- One obvious primary action per proof area; no guide overlap.
- Labels accurately distinguish concepts, approved designs and live client work.
- Track gallery exposure, project selection, comparison interaction, concept_open, case_study_open and subsequent inquiry, without personal data.
- Run a short task test with several people: “Find a redesign and open the website you can click through.” Observe hesitation, wrong clicks and time; do not assume a conversion lift from aesthetic changes alone.

## Evidence image

![Current concept link hierarchy](test-results/polish-audit/concept-action-current.png)

This audit recommends a focused hierarchy pass, not a rebrand. No website changes or uploads were performed.
