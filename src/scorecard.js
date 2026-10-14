// The Website Scorecard, ported from adamthomasjanes.com/scorecard (same
// questions, same scoring). It reports what the owner tells us, not a scan.
export const answerOptions = [
  { label: "Yes", value: 2 },
  { label: "Partly", value: 1 },
  { label: "No", value: 0 },
  { label: "Not sure / not yet tested", value: null },
];
export const labels = {
  clarity: "Message clarity",
  trust: "Trust & credibility",
  usability: "Finding & using",
  action: "Taking action",
  reliability: "Reliable next steps",
  visibility: "Being found",
  measurement: "Learning & upkeep",
};
export const questions = [
  {
    id: "offer",
    area: "clarity",
    question: "Can a new visitor quickly tell what your business offers?",
    helper:
      "Think about the first screen, before someone scrolls or opens a menu.",
    priority: 6,
    title: "Make the offer easier to recognize",
    why: "A visitor needs to know whether you can help before deciding to stay.",
    investigate:
      "Show the opening to someone unfamiliar with the business. Ask what they think you offer, without giving hints.",
    try: "Put a recognizable service or product near the main headline. Keep useful personality; remove only what makes the offer harder to find.",
    help: "A message review may help if the same misunderstanding keeps appearing.",
  },
  {
    id: "services",
    area: "clarity",
    question: "Are your services or products easy to understand?",
    helper:
      "Could someone explain the options without knowing your industry’s terminology?",
    priority: 9,
    title: "Help people choose between your options",
    why: "Unclear labels can make a suitable service feel difficult to choose.",
    investigate:
      "Ask a customer to pick the right option for a realistic need and explain their choice.",
    try: "Give each option a plain-language name, who it helps and a concrete next step.",
    help: "Content or page-structure support may help when the offer has many overlapping options.",
  },
  {
    id: "proof",
    area: "trust",
    question: "Can visitors find a reason to trust you?",
    helper:
      "Use genuine work, practical detail, an accurate location, real credentials or a clear way to reach you.",
    priority: 8,
    title: "Bring genuine reassurance into the decision",
    why: "Someone may understand the offer and still need a reason to feel comfortable contacting you.",
    investigate:
      "Ask what they would want to know before choosing you. Check whether that information is easy to find.",
    try: "Add one relevant example of real work or a useful explanation near the inquiry action. Get permission for any customer material.",
    help: "An evidence or content review can help select proof you already have; it should never invent it.",
  },
  {
    id: "next",
    area: "action",
    question: "Is the next useful action obvious?",
    helper:
      "A call, estimate, purchase or appointment can all be valid. Choose what fits your business.",
    priority: 4,
    title: "Make the next step understandable",
    why: "A person who is interested should know what to do and what will happen next.",
    investigate:
      "Ask a visitor how they would start. Watch what they choose and ask what they expect after clicking.",
    try: "Use a specific label and explain the next step. Match the destination to that expectation.",
    help: "A journey review may help if different pages send people in conflicting directions.",
  },
  {
    id: "contact",
    area: "action",
    question: "Is it straightforward to contact or buy from you on a phone?",
    helper:
      "Try the actual path, including forms, calling links or checkout—not only the homepage.",
    priority: 2,
    title: "Remove friction from the customer’s next step",
    why: "A difficult form or checkout can interrupt an otherwise useful visit.",
    investigate:
      "Complete the journey on a phone with safe test details. Note confusing fields, extra steps and error messages.",
    try: "Ask only for information needed at this stage. Explain required fields and preserve entries when something goes wrong.",
    help: "Development support is useful for broken controls, checkout integrations or inaccessible validation.",
  },
  {
    id: "mobile",
    area: "usability",
    question: "Does the site work comfortably on a small screen?",
    helper:
      "Look for readable text, usable controls and pages that do not require sideways scrolling.",
    priority: 5,
    title: "Check the experience on a real phone",
    why: "Small-screen obstacles can make information and actions harder to use.",
    investigate:
      "Try key pages on an actual phone, both portrait and landscape. Zoom text and use every important control.",
    try: "Fix the first concrete obstruction you observe. Keep readable type and comfortable targets instead of shrinking everything.",
    help: "Responsive and accessibility work may help when layout or controls prevent completion.",
  },
  {
    id: "discovery",
    area: "visibility",
    question: "Can people find the right page for what you do?",
    helper:
      "Consider service, product or location searches. If you have not checked actual searches or reports, choose Not sure.",
    priority: 11,
    title: "Find out how people discover relevant pages",
    why: "A useful page still needs a route by which the right audience can discover it.",
    investigate:
      "Review actual search queries and landing pages in Search Console, if available. Ask new customers how they found you.",
    try: "Match important services to useful pages with accurate titles and location details where relevant. Record a baseline before changing things.",
    help: "A visibility review may help interpret indexing or query data. This answer does not establish a ranking defect.",
  },
  {
    id: "searchBasics",
    area: "visibility",
    question: "Have your search-facing page details been reviewed?",
    helper:
      "Someone responsible for the site can check titles, descriptions and whether important pages are available to search engines.",
    priority: 12,
    title: "Verify the search foundations",
    why: "Incorrect or outdated page information can make discovery less useful.",
    investigate:
      "Ask whoever manages the site to inspect important URLs, titles and indexing status. A search snippet alone does not prove the cause.",
    try: "Correct inaccurate titles and outdated service details on priority pages. Verify indexing before assuming content is the problem.",
    help: "Technical SEO assistance may help if page availability, redirects or indexing are unclear.",
  },
  {
    id: "outcomes",
    area: "measurement",
    question:
      "Do you know which website actions become real inquiries or sales?",
    helper:
      "A button click or prepared email is different from a received inquiry, booking or completed purchase.",
    priority: 13,
    title: "Separate interest from confirmed outcomes",
    why: "Counting clicks as customers can lead to the wrong decisions about what to improve.",
    investigate:
      "Trace one real inquiry or order from its starting point to the business record. Confirm what each event actually measures.",
    try: "Keep a simple record of received outcomes and their known sources. Add only the privacy-conscious measurement you need.",
    help: "Measurement setup may help connect events to reliable receipt without collecting unnecessary personal information.",
  },
  {
    id: "owner",
    area: "measurement",
    question: "Is someone responsible for keeping the website useful?",
    helper:
      "This could be you, a colleague or a specialist. Think about access, updates and a way to request changes.",
    priority: 14,
    title: "Make upkeep someone’s responsibility",
    why: "Even a strong website needs a clear owner when the business or technology changes.",
    investigate:
      "Confirm who can edit content, renew services and recover access. Check that business-owned accounts are accessible.",
    try: "Keep an access and update checklist in a secure place. Choose a practical review rhythm and named owner.",
    help: "Ongoing support may help if you lack time or access; it is not automatically necessary for every business.",
  },
  {
    id: "navigation",
    area: "usability",
    question: "Can someone find a key service or product without help?",
    helper:
      "Give a first-time visitor one realistic task. Let them choose their own route through the site.",
    priority: 3,
    title: "Give important information an obvious route",
    why: "A person should not have to learn your internal organization to find what they need.",
    investigate:
      "Watch someone look for a specific service, price explanation or contact detail. Record the first wrong turn.",
    try: "Rename confusing navigation in customer language and place the most useful links where the task begins.",
    help: "Information architecture support may help when the same navigation difficulty affects several tasks.",
  },
  {
    id: "waiting",
    area: "usability",
    question: "Can visitors use important pages without a frustrating wait?",
    helper:
      "Try an ordinary phone connection. If you only checked fast office Wi-Fi, Not sure is a useful answer.",
    priority: 7,
    title: "Investigate the wait before changing the site",
    why: "A delay can interrupt a visitor before the page has a chance to help.",
    investigate:
      "Repeat a key journey on a typical mobile connection. Use a performance tool to investigate any delay you can reproduce.",
    try: "Check large images, autoplay media and unnecessary third-party code on the slow page. Measure before and after a targeted fix.",
    help: "Performance analysis may help identify the cause. A self-report cannot establish a Core Web Vitals failure.",
  },
  {
    id: "receipt",
    area: "reliability",
    question: "Have you confirmed that an inquiry or order actually arrives?",
    helper:
      "Check the receiving inbox, booking system or order record after a safe test. A success screen is not enough.",
    priority: 1,
    title: "Verify that the business receives the next step",
    why: "A customer can believe they contacted you even when the business has no record of it.",
    investigate:
      "Make one clearly labeled test using a permitted test path. Confirm the actual inbox or system record and any notification, not only the success message.",
    try: "If it fails, keep a clear working contact alternative visible while the delivery issue is investigated. Do not repeatedly submit after an uncertain timeout.",
    help: "Technical help is useful for failed delivery, spam filtering, payment or booking integration. Do not share passwords in an inquiry.",
  },
  {
    id: "paths",
    area: "reliability",
    question: "Do important links and error paths lead somewhere useful?",
    helper:
      "Check the main buttons, a missing page and what happens when a form cannot be completed.",
    priority: 10,
    title: "Check the paths people depend on",
    why: "A dead link or lost form entry can leave someone unsure how to continue.",
    investigate:
      "Click the main actions, test a missing URL and use invalid test input. Check that errors explain a way forward.",
    try: "Repair the broken destination you observe. Keep useful navigation and preserve form entries through recoverable errors.",
    help: "A focused QA or development session may help reproduce intermittent failures.",
  },
  {
    id: "current",
    area: "measurement",
    question: "Are your important business details still accurate?",
    helper:
      "Check hours, services, prices where shown, availability and the contact details people rely on.",
    priority: 15,
    title: "Keep decision-making details current",
    why: "An outdated practical detail can undermine trust even when the design works well.",
    investigate:
      "Compare the website’s key facts with how the business operates today. Ask the person closest to each fact to confirm it.",
    try: "Correct the highest-impact outdated information and note who should review it next time it changes.",
    help: "A content update process may help if details live across many pages or systems.",
  },
];
export const planningSteps = [
  {
    title: "Choose one customer task",
    copy: "Describe who you want to help, what they need and the next action the website should support.",
  },
  {
    title: "Gather the proof and practical details",
    copy: "Collect accurate service information, real work examples and the questions customers already ask.",
  },
  {
    title: "Plan a dependable next step",
    copy: "Choose how inquiries or orders will reach the business, who owns them, and how you will verify receipt before launch.",
  },
];

export function evaluateScorecard(
  answers,
  stage = "established",
) {
  const rated = questions.filter((q) => typeof answers[q.id] === "number");
  const strengths = rated.filter((q) => answers[q.id] === 2);
  const concerns = rated
    .filter((q) => answers[q.id] === 0 || answers[q.id] === 1)
    .sort((a, b) => (answers[a.id] ?? 2) - (answers[b.id] ?? 2) || a.priority - b.priority);
  const unknowns = questions.filter((q) => answers[q.id] == null).sort((a, b) => a.priority - b.priority);
  const categories = Object.keys(labels).map((area) => {
    const all = questions.filter((q) => q.area === area);
    const known = all.filter((q) => typeof answers[q.id] === "number");
    const score = known.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const unknown = all.length - known.length;
    const level = !known.length
      ? "Not yet checked"
      : unknown
        ? "Partial picture"
        : known.every((q) => answers[q.id] === 2)
          ? "Reported strength"
          : known.some((q) => answers[q.id] === 0)
            ? "Worth investigating"
            : "Room to improve";
    return {
      area,
      label: labels[area],
      known: known.length,
      count: all.length,
      score,
      possible: known.length * 2,
      unknown,
      level,
    };
  });
  return {
    stage,
    categories,
    strengths: stage === "planning" ? [] : strengths,
    concerns: stage === "planning" ? [] : concerns,
    priorities: stage === "planning" ? [] : concerns.slice(0, 3),
    unknowns: stage === "planning" ? [] : unknowns,
  };
}
export function scorecardText(report, answers) {
  if (report.stage === "planning")
    return "WEBSITE STARTING PLAN\nNo existing website was assessed.\n1. Choose one customer task.\n2. Gather genuine proof and practical details.\n3. Plan and verify a dependable inquiry or order path.\nFree tool: https://www.tinychipstudio.com/#scorecard";
  return [
    "WEBSITE SCORECARD — YOUR REPORTED EXPERIENCE",
    "Based on your answers, not an independent scan or technical audit.",
    `Website stage: ${report.stage}.`,
    ...report.categories.map(
      (c) =>
        `${c.label}: ${c.level}; ${c.known}/${c.count} questions rated; ${c.unknown} unknown. ${c.known ? `Reflection points: ${c.score}/${c.possible} on rated answers only.` : "Unscored until checked."}`,
    ),
    "",
    "REPORTED STRENGTHS",
    ...report.strengths.map((q) => `• ${q.question} — Yes`),
    "",
    "PRIORITIZED CHECKS (No before Partly; customer journey breaks ties, not predicted business impact)",
    ...report.concerns.map(
      (q, i) =>
        `${i + 1}. ${q.title}\nYou reported: ${answers[q.id] === 0 ? "No" : "Partly"} — ${q.question}\nWhy it matters: ${q.why}\nInvestigate: ${q.investigate}\nTry: ${q.try}\nHelp may be useful: ${q.help}`,
    ),
    "",
    "UNKNOWN — VERIFY BEFORE DIAGNOSING",
    ...report.unknowns.map((q) => `${q.question}\nCheck: ${q.investigate}`),
    "",
    "Free tool: https://www.tinychipstudio.com/#scorecard",
  ].join("\n");
}
export function scorecardHandoff(report) {
  return report.stage === "planning"
    ? "Website starting plan: no existing website assessed. I’d like help defining the customer task, evidence and a dependable inquiry path."
    : `Website Scorecard — self-reported, not independently verified.\n${report.strengths.length} reported strengths; ${report.concerns.length} answers to investigate; ${report.unknowns.length} unknown.\nFirst checks: ${report.priorities.map((q) => q.title).join("; ") || "No concern reported; verify and maintain what works"}.\n${report.categories.map((c) => `${c.label}: ${c.level} (${c.known}/${c.count} rated)`).join("\n")}`;
}
