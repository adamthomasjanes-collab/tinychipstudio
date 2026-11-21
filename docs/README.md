# Tiny Chip Studio "Website by" badge (v2)

Open `index.html` to see it on light, dark and coloured footers, with copy-paste code.

| File | Use it for |
| --- | --- |
| `snippet.html` | Paste into any footer (HTML, WordPress Custom HTML block, Divi Code module) |
| `tcs-badge.css` | The styles alone, if you'd rather put them in the site's stylesheet |
| `tcs-badge.js` | Host at tinychipstudio.com/badge/, then `<tcs-badge></tcs-badge>` anywhere |
| `TcsBadge.jsx` | React / Vite sites: `<TcsBadge />` (brings its own CSS) |
| `badge-ink.svg` / `badge-paper.svg` | Image-only fallback for light / dark footers. Original files with C2PA content credentials intact; display at 300×48 or larger |

## Settings

- `--tcs-size` (default `18px`): scales the whole badge. At 18px the "Website by" line is 14px, matching the studio's type floor.
- `--tcs-color` (default: the surrounding text colour): set it to the footer's main text colour when the badge sits in a muted row.

Set either on the footer, on a wrapper, or on the badge itself, e.g. `footer { --tcs-color: #f4f1e8; }`.

## What changed from v1

- Default size raised from 12px to 18px, so the smallest text is 14px instead of about 9px. Chip scales with the text (30px at the default).
- `--tcs-size` and `--tcs-color` settings.
- Visible focus ring for keyboard users. Chip still waves on focus.
- Slightly less fading (opacity .85 overall, .8 on "Website by") for better contrast.
- React component added.
- Image versions are your original files with C2PA credentials intact; they are shown larger instead of redrawn.

The SVGs are your original files, unmodified, so their C2PA content credentials are still valid. Editing them in any way breaks the credentials, so change the display size only (width="300" height="48" or larger keeps the small text legible).
