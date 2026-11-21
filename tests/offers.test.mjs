import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {
  offers,
  monthlyOffers,
  disclosure,
  total,
  growthTotal,
  offerFaq,
  offerCatalog,
  offerSummary,
  heroDisclosure,
  growthAvailability,
} from "../src/offers.js";
test("monthly choices retain approved terms and onboarding scope", () => {
  assert.equal(total, 2364);
  assert.equal(growthTotal, 3564);
  assert.match(disclosure, /197.*12-month.*0 upfront.*qualifying/);
  assert.deepEqual(
    monthlyOffers.map((o) => o.name),
    ["Website + Growth", "Website + Care"],
  );
  assert.match(offers[0].detail, /qualifying.*12-month.*3,564/);
  assert.match(growthAvailability, /configure and test.*during onboarding/);
  assert.match(offers[0].comparison.flat().join(" "), /60 minutes.*per month/);
  assert.match(offers[1].comparison.flat().join(" "), /30 minutes.*per month/);
  assert.match(heroDisclosure, /0 upfront.*qualifying.*12-month/);
  assert.doesNotMatch(JSON.stringify({ offers, offerFaq, offerCatalog, offerSummary, heroDisclosure }), /PREVIEW FOR ADAM|FOR ADAM.S APPROVAL|proposed|subject to approval|no numeric usage allowance has been approved/i);
  assert.match(offers[2].cadence, /NO REQUIRED CARE PLAN/);
  assert.match(offers[3].detail, /No new website build/);
  assert.doesNotMatch(
    JSON.stringify({ offers, offerFaq, offerCatalog }),
    /18-month|\$149|\$300 setup|unpaid agreed build balance/,
  );
});
test("all city pages disclose both packages without internal notes", async () => {
  execFileSync(process.execPath, ["scripts/cities.mjs"]);
  for (const slug of [
    "tiffin",
    "findlay",
    "fremont",
    "bowling-green",
    "toledo",
    "sandusky",
    "port-clinton",
  ]) {
    const html = await readFile(`public/${slug}/index.html`, "utf8");
    for (const text of [
      "197",
      "297",
      "12-month",
      "2,364",
      "3,564",
      "Setup for your business",
    ])
      assert.ok(html.includes(text), `${slug}: ${text}`);
    assert.doesNotMatch(
      html,
      /Build \+ Care|18-month|pioneermill\.adamthomasjanes|PREVIEW FOR ADAM|FOR ADAM.S APPROVAL|Proposed qualifying terms/i,
    );
  }
});
test("metadata generation is repeatable and preserves literal dollar prices in no-script copy", async () => {
  execFileSync(process.execPath, ["scripts/sync-offers.mjs"]);
  const before = await readFile("index.html", "utf8");
  execFileSync(process.execPath, ["scripts/sync-offers.mjs"]);
  const after = await readFile("index.html", "utf8");
  assert.equal(after, before);
  assert.equal((after.match(/<noscript>/g) || []).length, 1);
  assert.doesNotMatch(after, /PREVIEW FOR ADAM|FOR ADAM.S APPROVAL|New-client proposal:/i);
  assert.match(
    after.match(/<noscript>([\s\S]*?)<\/noscript>/)[1],
    /\$197.*\$297.*\$1,200/,
  );
});
