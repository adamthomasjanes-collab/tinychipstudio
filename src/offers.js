// Approved public offers; individual scope and usage are agreed in writing.
export const pricing = {
  build: 1200,
  setup: 0,
  websiteMonthly: 197,
  growthMonthly: 297,
  careMonthly: 99,
  months: 12,
  updateMinutes: 30,
  growthUpdateMinutes: 60,
};
export const money = (value) => `$${value.toLocaleString("en-US")}`;
export const monthly = pricing.websiteMonthly;
export const total = monthly * pricing.months;
export const growthTotal = pricing.growthMonthly * pricing.months;
export const primaryCta = "SEE IF MY BUSINESS QUALIFIES";
export const heroTeaser = `Websites from ${money(monthly)}/month. Website + Growth ${money(pricing.growthMonthly)}/month.`;
export const heroDisclosure = `$0 upfront build fee for qualifying projects with a ${pricing.months}-month initial agreement. Scope, setup and any usage costs are agreed before work begins.`;
export const disclosure = `${money(monthly)}/month with a ${pricing.months}-month initial agreement. $0 upfront build fee for qualifying projects.`;
export const firstYear = `${money(total)} total first-year payments.`;
export const growthDisclosure = `$0 upfront build fee for qualifying projects with a ${pricing.months}-month initial agreement. ${money(growthTotal)} total first-year payments.`;
export const growthAvailability =
  "We set up your inquiry and follow-up system around your business. We agree on the features, usage limits and launch timeline before work begins, then configure and test your workflows during onboarding.";
export const limitations =
  "Qualifying builds generally include up to five core pages. Major redesigns, new pages, custom applications, complex commerce, extensive copywriting and integrations need a separate scope. No unlimited revisions, messaging or AI services. No guaranteed rankings, leads, sales or revenue.";
export const terms =
  "We agree on the project scope, support, ownership and any third-party costs in writing before work starts. Monthly plans also spell out early-exit arrangements, offboarding and your options after the initial year. Domains and third-party subscriptions may cost extra.";
export const serviceGroups = [
  {
    title: "A website worth sharing.",
    summary: "Custom design, built around your customers.",
    details:
      "Responsive development, generally up to five core pages, basic accessibility and technical SEO, contact forms and useful business links. WordPress hosting is outside our current active scope.",
  },
  {
    title: "Care without the technical chores.",
    summary: "A dependable home for your website.",
    details:
      "Managed hosting and SSL, appropriate maintenance, backups, monitoring, scoped minor updates and direct support. Contact forms notify your business and confirm receipt to the visitor. We configure and test a basic acknowledgment during onboarding.",
  },
  {
    title: "Reporting you can actually use.",
    summary: "Know what people do next.",
    details:
      "GA4 and Search Console setup where applicable, website analytics and a monthly summary. Growth adds inquiry, source, response and opportunity reporting, configured around the agreed workflows during onboarding.",
  },
];
export const care = {
  id: "website-care",
  name: "Website + Care",
  code: "A GREAT WEBSITE. LOOKED AFTER.",
  price: `${money(monthly)}/month`,
  cadence: `${pricing.months}-MONTH INITIAL AGREEMENT`,
  description:
    "Get a website you’re proud to share, with someone handling the hosting, upkeep and small updates.",
  detail: `$0 upfront build fee for qualifying projects. ${firstYear}`,
  cta: "Ask about Care",
  comparison: [
    [
      "Website & technical care",
      "Custom design, generally up to five pages; hosting, SSL, maintenance, backups and monitoring.",
    ],
    [
      "Inquiries",
      "Contact forms, notifications to your business and a basic ‘we received your message’ acknowledgment. We configure and test acknowledgment delivery during onboarding; the delivery channel and any usage costs are agreed first.",
    ],
    [
      "Understand your website",
      "Basic technical SEO, GA4 and Search Console where applicable, analytics and a monthly summary.",
    ],
    [
      "Minor content updates",
      `${pricing.updateMinutes} minutes of minor content updates per month.`,
    ],
    [
      "Support",
      "Direct help from the people who build and maintain your site.",
    ],
  ],
};
export const growth = {
  id: "website-growth",
  name: "Website + Growth",
  code: "FEATURED / MORE FOLLOW-THROUGH",
  price: `${money(pricing.growthMonthly)}/month`,
  cadence: `${pricing.months}-MONTH INITIAL AGREEMENT`,
  description:
    "Your website and ongoing care, plus a system for keeping inquiries organized, following up and seeing which opportunities turn into business.",
  detail: growthDisclosure,
  availability: growthAvailability,
  cta: "Ask about Growth",
  comparison: [
    [
      "Website & technical care",
      "The agreed Website + Care foundation, with a more complete lead-management service.",
    ],
    [
      "Organize opportunities",
      "Separate client contact records and a pipeline suited to your business, where supported.",
    ],
    [
      "Keep in touch",
      "Follow-up sequences, appointments and reminders, review requests, and eligible missed-call text-back.",
    ],
    [
      "Understand what follows",
      "Lead source, response and opportunity tracking, expanded reporting and automation support.",
    ],
    [
      "Minor content updates",
      `${pricing.growthUpdateMinutes} minutes of minor content updates per month.`,
    ],
    [
      "Email, SMS & usage",
      "Allowances and additional charges agreed before activation. No unlimited messaging or AI.",
    ],
  ],
};
export const own = {
  id: "build-own",
  name: "Build & Own",
  code: "PREFER TO BUY ONCE?",
  price: `From ${money(pricing.build)}`,
  cadence: "ONE TIME · NO REQUIRED CARE PLAN",
  description:
    "A distinctive website purchased outright. Agreed custom deliverables transfer after full payment, subject to third-party licenses. Choose your hosting and future provider.",
  detail:
    "No mandatory care subscription. Hosting and domain costs are separate; growth services can be scoped separately when appropriate.",
  cta: "Ask about buying outright",
};
export const maintenance = {
  id: "existing-care",
  name: "Website Care",
  code: "ALREADY HAVE A WEBSITE?",
  price: `From ${money(pricing.careMonthly)}/month`,
  cadence: "FOR QUALIFYING EXISTING SITES",
  description:
    "Technical care and minor updates after a review of your site, platform and access. WordPress hosting is outside our current active scope.",
  detail:
    "No new website build, full CRM setup, advanced automation, campaign management or complete Growth reporting package. Scope and costs are agreed separately.",
  cta: "Ask about care for my existing site",
};
export const monthlyOffers = [growth, care];
export const offers = [...monthlyOffers, own, maintenance];
export const offerSummary = `${heroTeaser} $0 upfront builds for qualifying projects with a ${pricing.months}-month initial agreement. ${own.name} ${own.price.toLowerCase()} with no required care plan.`;
export const offerFaq = [
  {
    group: "CHOOSING YOUR PLAN",
    q: `What does ${money(monthly)}/month include?`,
    a: `${disclosure} ${firstYear} Custom design, generally up to five pages, hosting and SSL, maintenance, backups, monitoring, basic technical SEO, contact forms, direct support and a monthly website summary. GA4 and Search Console are set up where applicable. Forms notify your business and include a basic ‘we received your message’ acknowledgment, configured and tested during onboarding. We agree the delivery channel and any usage costs first. Multi-step follow-up sequences and lead management belong to Growth.`,
  },
  {
    group: "CHOOSING YOUR PLAN",
    q: `What does ${money(pricing.growthMonthly)}/month add?`,
    a: `Website + Growth adds lead management to the agreed Website + Care foundation: organized contacts and inquiries, follow-up sequences, appointments, reminders, review requests and clearer opportunity reporting. ${growthAvailability} ${growthDisclosure}`,
  },
  {
    group: "CHOOSING YOUR PLAN",
    q: "Can I buy my website outright?",
    a: `Yes. ${own.name} starts at ${money(pricing.build)} once, with no required care subscription. The agreed custom deliverables transfer after full payment, subject to third-party licenses. You choose your hosting and future provider; growth services can be scoped separately.`,
  },
  {
    group: "CHOOSING YOUR PLAN",
    q: "Can you work with an existing website?",
    a: `Yes, subject to a technical review. ${maintenance.name} starts at ${money(pricing.careMonthly)}/month for narrower technical care and minor updates. Follow-up help can be discussed separately, with availability and scope confirmed first. No new build, CRM or full Growth package is automatically included. WordPress hosting is outside our active scope.`,
  },
  {
    group: "SCOPE & EVERYDAY USE",
    q: "How much time is included for content updates?",
    a: `Website + Care includes ${pricing.updateMinutes} minutes of minor content updates per month. Website + Growth includes ${pricing.growthUpdateMinutes} minutes per month. New pages, major redesigns and custom features are quoted separately. We agree on scheduling and whether unused time carries over before work begins.`,
  },
  {
    group: "SCOPE & EVERYDAY USE",
    q: "Are there extra usage or AI charges?",
    a: "Email, SMS, phone and other usage are not unlimited. We explain included usage, rates and any extra costs in your agreement before activating those services. AI receptionists, advanced AI, high-volume campaigns, paid advertising, full-service SEO and complex integrations require a separate proposal and approval.",
  },
  {
    group: "SCOPE & EVERYDAY USE",
    q: "Will I need to learn CRM software?",
    a: "No. With Website + Growth, we set up the agreed contact and follow-up tools for your business and show you what you need to know. We'll decide together what you handle and what we take care of.",
  },
  {
    group: "SCOPE & EVERYDAY USE",
    q: "What kinds of websites qualify?",
    a: "Straightforward small-business websites, generally up to five core pages. We review content, functionality, integrations and timing first. Complex commerce, custom applications, extensive copywriting and substantial integrations need a separate proposal. We agree revisions and a realistic schedule before work begins.",
  },
  {
    group: "Ownership & cancellation",
    q: "Why is there a 12-month commitment?",
    a: `The qualifying $0 upfront arrangement includes design and development in a continuing service relationship. Website + Care has a ${pricing.months}-month initial agreement and ${money(total)} in first-year payments. Website + Growth also has a ${pricing.months}-month initial agreement, with ${money(growthTotal)} in first-year payments. These are ongoing services, not simply financing a ${money(pricing.build)} project.`,
  },
  {
    group: "Ownership & cancellation",
    q: "Who controls my domain, content and website?",
    a: "Your domain and the content you provide remain yours. Build & Own custom deliverables transfer after full payment, subject to third-party licenses. For monthly plans, the timing and extent of website/source-code rights and offboarding deliverables must be defined in the written agreement before commitment.",
  },
  {
    group: "Ownership & cancellation",
    q: "What happens if I leave or the initial year ends?",
    a: "The written agreement provided before you commit defines early exit, any agreed buyout, service choices after the initial year, offboarding and transferable licenses. We will walk through those details with you before you sign, including any costs and what you receive when services end. Your domain and supplied content remain yours.",
  },
  {
    group: "GETTING STARTED",
    q: "What happens after I contact you?",
    a: "We read your inquiry, reply by email and talk through your business, current site and goals. You receive a clear scope, availability, timeline, costs and written terms before deciding. Your inquiry is not a subscription or a commitment to buy.",
  },
  {
    group: "GETTING STARTED",
    q: "Do you guarantee more customers?",
    a: "No. We help businesses make a strong impression, handle inquiries and understand what is happening. We do not guarantee lead volume, search rankings, customers, sales or revenue.",
  },
];
export const offerCatalog = {
  "@type": "OfferCatalog",
  "@id": "https://tinychipstudio.com/#website-options",
  name: "Website and business growth options",
  itemListElement: offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    description: `${o.price}. ${o.cadence}. ${o.detail} ${o.availability || ""}`,
    itemOffered: {
      "@type": "Service",
      name: o.name,
      description: o.description,
    },
  })),
};
