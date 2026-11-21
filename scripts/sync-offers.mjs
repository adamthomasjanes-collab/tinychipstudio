// Generated public copies share the same commercial source as React.
import { readFileSync, writeFileSync } from "node:fs";
import {
  offers,
  offerSummary,
  terms,
  pricing,
  own,
  money,
} from "../src/offers.js";
const root = new URL("../", import.meta.url);
const esc = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const file = new URL("index.html", root);
// Search and share previews lead with the visitor's side of the story (the
// hero headline), then the plain prices. The full terms stay in the page,
// the structured data and llms.txt.
const metaSummary = `Your business is great. Your website should prove it. Web design for Northwest Ohio businesses, from Tiffin. Websites from ${money(pricing.websiteMonthly)}/month, or own yours ${own.price.toLowerCase()}.`;
let html = readFileSync(file, "utf8");
html = html.replace(
  /(<meta\s+(?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]*("\s*\/?>)/g,
  (_, a, b) => a + esc(metaSummary) + b,
);
html = html.replace(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  (_, json) => {
    const data = JSON.parse(json);
    for (const item of data["@graph"] || [])
      if (item["@type"] === "ProfessionalService") {
        item.description = offerSummary;
        item.priceRange = offers.map((o) => `${o.name}: ${o.price}`).join("; ");
      }
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`;
  },
);
html = html.replace(
  /<noscript>[\s\S]*?<\/noscript>/,
  () =>
    `<noscript><p>${esc(offerSummary)} <a href="mailto:adam@tinychipstudio.com">Contact Tiny Chip Studio</a> or call <a href="tel:+14193418519">419-341-8519</a>.</p></noscript>`,
);
writeFileSync(file, html);
const llms = new URL("public/llms.txt", root);
const tail = readFileSync(llms, "utf8").split("## How a project works")[1];
writeFileSync(
  llms,
  `# Tiny Chip Studio\n\n> Website design and business growth in Tiffin, Ohio. Attract attention, make contact easier, and understand what follows. Your website. Your business. Your call.\n\n${offerSummary}\n\n## Services\n\n${offers.map((o) => `- ${o.name}: ${o.price}. ${o.cadence}. ${o.description} ${o.detail} ${o.availability || ""}`.trimEnd()).join("\n")}\n\n${terms}\n\n## How a project works${tail}`,
);
console.log("offers: synchronized metadata and llms.txt");
