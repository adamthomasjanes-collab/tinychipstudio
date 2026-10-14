# QA report (v2)

## Verified (esbuild bundle + headless Chromium)
- 56 automated checks pass, run repeatedly. They cover:
  - copy and voice: no first person in the studio voice, the nbsp rules, live-site project order and URLs
  - all eight case-study sheets: focus trap, Esc, backdrop, focus restore
  - reveals and reduced motion: every Chip and the walker stop
  - JSON-LD (business + FAQ)
  - lead form: inline errors and focus, service cards pre-selecting the need, a Netlify-style POST, a success state, and the email fallback when no form backend answers
  - guide visibility rules and dismissal
  - finding all five crew, persistence, reset, and the game working with storage blocked
  - mobile menu, the sticky CTA bar, tap targets of at least 44 px
  - static files: 404, privacy, robots, sitemap, manifest, icons, badge kit, logos
- No horizontal overflow at 320, 360, 375, 414, 768, 1024, 1280, 1440, 1920 and 2560 px.
- Visual review of every section at 1440 and 390, hero at 1024 and 768, Chip's boot, wave and pointer tracking, the guide, the badge demo and the brand files.

## Not verified
- `vite build` and Prettier were not run in the build environment (npm registry unreachable). Run `npm install && npm run build && npm run format`.
- Netlify Forms delivery is untested until deployed.
- Outbound links match the live site's source but were not loaded.
- No real-device, screen-reader, Safari or Firefox testing.
