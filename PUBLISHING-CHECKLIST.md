# Publishing checklist

1. Secure the domain. Then confirm `https://www.tinychipstudio.com/` in `index.html` (canonical, Open Graph, JSON-LD), `src/site.js`, `public/robots.txt`, `public/sitemap.xml` and `scripts/brand.mjs` (badge link), and run `npm run brand`.
2. `npm install`, `npm run build`, `npm run preview`; no console errors.
3. Deploy (Netlify recommended for the form). Turn on form detection, send one test inquiry, and add an email notification for new submissions.
4. Decide on a studio inbox. If it changes, update `EMAIL` in `src/site.js`, the `<noscript>` block and JSON-LD in `index.html`, and `public/privacy.html`.
5. Read `public/privacy.html` and make sure it matches how you actually handle inquiries.
6. Open every case study and outbound link; compare against adamthomasjanes.com.
7. Test on a real phone, plus Safari and Firefox. Find all five crew members.
8. Screen reader pass over the nav, case-study sheet, form and FAQ.
9. Check the share image in a link previewer.
10. Add the badge to client sites you've built (see `/badge/`).
