# Tiny Chip V3 preview — November 2, 2026

## Latest follow-up

[Open the updated draft](https://6ae95217e567f7581dfe689a--tinychipstudio.netlify.app/). This supersedes the preview URLs below: tablet process cards now fit their content, and Care/Growth describe services configured during onboarding. Add `?qa=1` only when using optional diagnostics. Production is unchanged.

[Follow-up changes, checks and remaining decisions](test-results/v3/tinychipstudio/ONBOARDING-AND-SPACING-REVIEW.md). The latest durable source handoff is `V3-ONBOARDING.bundle`, branch `codex/tinychip-growth-v3`; it includes the earlier V3 and mobile QA work. Use this bundle instead of the older bundles below. The original dirty projects remain untouched.

15 unit tests and 50 functional browser checks passed. The new tablet spacing checks also passed against the uploaded draft. Visual regression covers 49 states. Physical Facebook/Instagram testing and real inbox delivery remain unverified.

The new-client update allowances and unresolved Growth agreement/usage terms still require approval. Adam approved presenting the services as configured during onboarding; the previous wording that they remain merely planned is superseded. This does not claim that HighLevel workflows have already been implemented.

## Earlier preview history

Mobile QA follow-up: [diagnostics-enabled draft](https://6ae8ee1851243215cfa441c5--tinychipstudio.netlify.app/?qa=1). The ordinary page remains unchanged with diagnostics disabled. See [follow-up findings and real-device checklist](test-results/v3/tinychipstudio/QA-IN-APP-FOLLOWUP.md). `V3-MOBILE-QA.bundle` includes the V3 work plus the subsequent QA infrastructure changes; it supersedes the earlier bundle for source handoff. Actual Facebook/Messenger device checks remain NOT VERIFIED.

[Open the verified Netlify draft](https://6ae8eb16bfafe06f74cf71a3--tinychipstudio.netlify.app/). Production is unchanged. The draft is noindex and contains a visible approval notice.

The authoritative production source is `adamthomasjanes-collab/adamthomasjanes`, branch `main`, directory `tinychipstudio`, not this standalone repository. Work was isolated to preserve both original dirty working copies.

Local preview source: `test-results/v3/tinychipstudio`.

Local branch: `codex/tinychip-growth-v3`; commit `024345546f10380abb78df861472e838dc1f325c`.

Durable handoff: `V3-PREVIEW.bundle` contains that branch and all 88 changed files (including 49 visual PNGs). It was verified and requires the already-published base commit `fd7512cec60aca3bc38a648e513ee74ef3047293` in the receiving monorepo. Keep the bundle if cleaning test-results. No remote push was performed.

## Review files

- [Copy comparison, complete packages/FAQs and publication steps](test-results/v3/tinychipstudio/docs/V3-REVIEW.md)
- [Commercial approvals and withheld operational promises](test-results/v3/tinychipstudio/COMMERCIAL-REVIEW.md)
- [Internal cost/capacity scenarios](test-results/v3/tinychipstudio/docs/COMMERCIAL-MODEL-2026-11-02.md)
- [QA findings and coverage limits](test-results/v3/tinychipstudio/QA-REPORT-2026-11-02.md)
- [Complete changed-file inventory](test-results/v3/tinychipstudio/docs/V3-CHANGED-FILES.txt)

## Run locally

From this workspace, in PowerShell:

```powershell
Set-Location test-results/v3/tinychipstudio
npm run preview -- --port 4293 --strictPort
```

Open http://localhost:4293. The full build is already present. Dependencies are local junctions into the existing installation; a fresh checkout should install the lockfile dependencies instead. Tests use port 4294; optional diagnostics use `npm run qa:preview` on 4295.

## Decisions before publication

Approve or revise new-client Care updates of 30 minutes/month (currently 30/week), Growth updates of 60 minutes/month, proposed qualifying Growth commitment terms, usage costs/limits and written contract details. Existing signed agreements are unchanged. Growth CRM/follow-up features remain planned until individually verified. Reserve separate Starter accounts for Tiny Chip and Craig; verify actual allocation before promising another client workspace.

15 unit tests and 45 browser checks passed. A separate visual comparison passed across 49 reviewed screen states. Real-device Facebook/Instagram behavior and actual inbox delivery remain unverified; no real leads were sent. The source-only final whitespace cleanup in llms.txt does not change the draft's displayed content.

After Adam approves, integrate the saved branch into a clean checkout of the authoritative monorepo, recheck current production mapping, apply approved commercial decisions, build/test and review its preview. Only then merge/push to its live main branch through the existing release process. Do not publish from the standalone repository or change Netlify routing.
