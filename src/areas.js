// The towns with their own landing page, in the order they appear in the footer.
// Single source of truth: the React footer imports this, and so does
// scripts/cities.mjs, which writes the pages themselves. Add a town here and in
// the CITIES copy block in scripts/cities.mjs, then run `npm run cities`.

export const AREAS = [
  { slug: 'tiffin', name: 'Tiffin' },
  { slug: 'fremont', name: 'Fremont' },
  { slug: 'findlay', name: 'Findlay' },
  { slug: 'bowling-green', name: 'Bowling Green' },
  { slug: 'port-clinton', name: 'Port Clinton' },
  { slug: 'sandusky', name: 'Sandusky' },
  { slug: 'toledo', name: 'Toledo' },
];
