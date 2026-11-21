# Onboarding copy and tablet spacing follow-up

Preview: https://6ae95217e567f7581dfe689a--tinychipstudio.netlify.app/

## What changed

The process cards switched to stacked rows at tablet widths but retained the desktop 330px minimum height between 901px and 1100px. They now fit their content across the tablet range, with paragraphs using the available row width. Colors, tilted borders, mascot and desktop composition remain intact.

Adam approved offering services configured during onboarding. Website + Care includes forms, owner notifications and a basic acknowledgment configured and tested for the customer. Website + Growth adds scoped contact organization, follow-up sequences, appointment/review workflows and reporting. The hero, benefits, pricing details, FAQs, metadata and seven local pages now use this wording instead of calling these services planned or inactive.

This copy change does not implement HighLevel workflows or claim they are already operating. Features, channels, costs, usage limits and setup timing are agreed before work begins. Separate client accounts and capacity checks remain necessary.

## Validation

- Production build and publish audit passed, including existing client assets.
- 15 unit tests passed.
- 50 functional browser checks passed across Chromium and WebKit phone/tablet and Chromium desktop projects.
- The new process regression checks cover 768, 900, 901, 1024, 1054 and 1100px; they also passed against the uploaded draft in all five browser projects.
- Reviewed updated process, hero and package screenshots; visual regression uses 49 screen states across five browser projects.
- Draft diagnostics remain opt-in with `?qa=1`; remote checks confirmed no form values enter diagnostic reports and the console loads only when requested.
- Real-device Facebook/Instagram behavior and actual email/SMS delivery remain unverified. No real lead was submitted.

## Review before publishing

The proposed Care allowance of 30 minutes/month (previous public offer: 30 minutes/week), Growth allowance of 60 minutes/month, Growth agreement terms, usage charges and unresolved contract details still require approval. Existing agreements are unchanged. See COMMERCIAL-REVIEW.md and docs/V3-REVIEW.md.

Production remains at deploy `6ae6c9bcee944be84e305fee`, commit `fd7512cec60aca3bc38a648e513ee74ef3047293`. The verified source remains `adamthomasjanes-collab/adamthomasjanes`, `main`, base `tinychipstudio`, build `npm run build`, publish `dist`. No live branch was pushed and no routing was changed.

After approval, integrate the saved preview branch in a clean authoritative checkout, resolve proposed commercial copy, build and test a normal production artifact, review its draft, then publish through the existing main-branch release process. Do not publish `dist-qa` to production.
