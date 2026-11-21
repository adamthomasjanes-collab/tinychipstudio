// Keep concept, approved and commissioned destinations distinct.
export const websiteAction = (kind) => ({
  concept: 'OPEN CONCEPT WEBSITE',
  approved: 'VIEW APPROVED DESIGN',
  live: 'OPEN CLIENT WEBSITE',
  historical: 'VIEW CURRENT VENUE WEBSITE',
}[kind] || 'OPEN WEBSITE');
