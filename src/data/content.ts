/* ---------------------------------------------------------------
   ALL SITE CONTENT LIVES HERE.
   Every value below drives the whole site — nav, hero, case studies,
   metadata and JSON-LD — so nothing needs editing in components.
   --------------------------------------------------------------- */

export const site = {
  name: "Subash Gautam",
  /* Feeds the page title, the OG card, and JSON-LD's jobTitle at once.
     "Backend Developer" undersold a résumé that also includes a shipped
     React Native app, a Next.js frontend, and three npm packages. */
  role: "Software Engineer",
  location: "",
  available: true,
  summary:
    "Software engineer working on the microservices behind Nepal's digital banking — Node.js, Express, and gRPC — with live stock data and portfolio analytics running inside IME Pay, Khalti, and Global IME Bank. Also ships React Native apps and open-source tooling on npm.",
  email: "suwaz.gautam@gmail.com",
  /* 800x800 in /public. Also feeds JSON-LD's Person.image, so search
     results and shared links can show a face. */
  photo: "/subash.jpg",
  /* Points at the /resume route rather than a checked-in PDF: the page is
     generated from resume.ts, so it can't drift from the site, and its
     Download button hands off to the browser's own print-to-PDF. Swap to
     "/resume.pdf" if you'd rather serve a fixed file. */
  resumeUrl: "/resume",
  socials: [
    { label: "GitHub", href: "https://github.com/sudip490" },
    { label: "npm", href: "https://www.npmjs.com/~subashgautam" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/subashgautam22/" },
    { label: "Email", href: "mailto:suwaz.gautam@gmail.com" },
  ],
};

export const hero = {
  // Rendered as stacked oversized lines.
  headline: ["Backend", "Developer", "& Systems", "Builder"],
  intro:
    "I work on the microservices behind digital banking — gRPC services, omni-channel APIs, and the data flow that keeps money moving correctly.",
  stats: [
    { value: "4+", label: "Years Shipping Backends" },
    { value: "6", label: "Financial Platforms Worked On" },
    { value: "3", label: "Apps Running Capital Market" },
  ],
};

/* The proof strip between the hero and the work — where the work actually
   runs, ticker-style. Short claims only: it scrolls, so anything long
   turns into a paragraph on a conveyor belt. */
export const ticker = [
  "Live in IME Pay",
  "Live in Khalti",
  "Live in Global IME Bank",
  "Real-time NEPSE data",
  "4+ years shipping backends",
  "gRPC microservices",
  "3 packages on npm",
  "Kathmandu, Nepal",
];

export type StackItem = {
  name: string;
  /* simple-icons key, minus the `si` prefix and lowercased. Null where the
     set has no icon (gRPC), in which case the card falls back to type. */
  icon: string | null;
  label: string;
};

/* The arc. Ordered so the fan reads roughly bottom-of-stack outward —
   runtime and transport at the centre, tooling at the edges. */
export const stack: StackItem[] = [
  { name: "Git", icon: "git", label: "Version control" },
  { name: "Linux", icon: "linux", label: "Platform" },
  { name: "Nginx", icon: "nginx", label: "Proxy" },
  { name: "RabbitMQ", icon: "rabbitmq", label: "Messaging" },
  { name: "Neo4j", icon: "neo4j", label: "Graph" },
  { name: "MongoDB", icon: "mongodb", label: "Database" },
  { name: "Redis", icon: "redis", label: "Cache" },
  { name: "PostgreSQL", icon: "postgresql", label: "Database" },
  { name: "Node.js", icon: "nodedotjs", label: "Runtime" },
  { name: "gRPC", icon: null, label: "Transport" },
  { name: "Express", icon: "express", label: "Framework" },
  { name: "TypeScript", icon: "typescript", label: "Language" },
  { name: "Docker", icon: "docker", label: "Containers" },
  { name: "Kubernetes", icon: "kubernetes", label: "Orchestration" },
  { name: "Next.js", icon: "nextdotjs", label: "Frontend" },
  { name: "React", icon: "react", label: "Frontend" },
  { name: "MCP", icon: "modelcontextprotocol", label: "Protocol" },
];

export type CaseStudy = {
  /* Shown as the case-study lede. */
  overview: string;
  role: string;
  timeline: string;
  team: string;
  /* Each becomes a numbered section on the detail page. */
  sections: { heading: string; body: string }[];
  /* Headline numbers for the results strip. Optional: the strip is
     skipped entirely rather than filled with numbers we can't stand
     behind. Add real figures here as they're confirmed. */
  outcomes?: { value: string; label: string }[];
  /* Optional live/repo links — omitted keys simply don't render. */
  links?: { label: string; href: string }[];
};

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  year: string;
  category: string;
  tags: string[];
  metric: string;
  href?: string;
  featured?: boolean;
  /* Which frame the card's screen mockup renders in — the device the
     product actually ships on. Drives ProjectScreen placement. */
  device: "phone" | "browser";
  study: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "capital-market",
    device: "phone",
    title: "Capital Market",
    blurb:
      "Capital-market module embedded in IME Pay, Khalti, and the Global IME Bank app — live stock data, real-time profit and loss, and large-scale portfolio analytics.",
    /* TODO(subash): year inferred from the 2.5-year build — confirm. */
    year: "2024",
    category: "Trading",
    tags: ["Node.js", "Microservices", "PostgreSQL", "REST API"],
    metric: "Live in IME Pay, Khalti & Global IME Bank",
    featured: true,
    study: {
      overview:
        "Capital Market brings live stock data and portfolio analytics into apps people already have on their phones — IME Pay, Khalti, and the Global IME Bank app. It integrates live market data for analytics and reporting, and calculates real-time profit and loss, receivable amounts, and transaction summaries.",
      role: "Associate Software Developer — Capital Market team, Swift Technology",
      /* TODO(subash): confirm this is the build duration. */
      timeline: "2.5 years",
      team: "Capital Market team",
      sections: [
        {
          heading: "Live Market Data",
          body: "The module integrates live stock data — last traded price, change percentage, and the rest of the tick — and feeds it into analytics and reporting. Market data is only worth showing if it's current: a portfolio valued against a stale price is a wrong number presented confidently, which is worse than showing no number at all.",
        },
        {
          heading: "Portfolio At Scale",
          body: "Portfolio data is large and read-heavy — every holding and every transaction, across every user, re-valued against a price that never stops moving. The work here was in the database: optimizing queries so large-scale portfolio data could be processed efficiently, rather than fanning out into a query per holding and paying for it on every load.",
        },
        {
          heading: "Numbers People Actually Check",
          body: "On top of the data sit the figures users open the app for: profit and loss, receivable amounts, and transaction summaries, computed in real time. These are derived rather than stored, which keeps them correct as prices move — and puts the whole burden on making the computation fast enough to feel instant.",
        },
      ],
    },
  },
  {
    slug: "brish-terminal",
    device: "browser",
    title: "Brish Terminal",
    blurb:
      "NEPSE portfolio analytics terminal — real-time floorsheet, whale-trade alerts, portfolio replay against the index, and a live block-trade radar.",
    year: "2026",
    category: "Trading",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "Nginx"],
    metric: "Real-time floorsheet + whale-trade radar",
    featured: true,
    href: "https://brish.swifttech.com.np/",
    study: {
      overview:
        "Where Nepal's smart money moves first. Brish Terminal puts NEPSE intelligence in one place — a real-time floorsheet, whale-trade alerts, portfolio replay against the NEPSE index, and a live block-trade radar. Built for NEPSE traders.",
      /* TODO(subash): confirm — you said you did the frontend "also", which
         I've read as full-stack. Correct this if you only did one side. */
      role: "Full stack — backend and frontend",
      timeline: "—",
      team: "—",
      sections: [
        {
          heading: "The Floorsheet, Live",
          body: "The floorsheet is NEPSE's record of every trade that actually happened — who bought, who sold, at what price. It's public, and it's where the real signal lives, but it arrives as a firehose rather than an answer. Brish takes it in real time and turns it into something a trader can read while the market is still open.",
        },
        {
          heading: "Following The Whales",
          body: "Large trades move the market, and they show up in the floorsheet before they show up in the price. Whale-trade alerts and the block-trade radar exist to surface those the moment they land, rather than after the fact when the edge is gone.",
        },
        {
          heading: "Replay Against The Index",
          body: "Portfolio replay answers the question every investor actually has: did I beat the market, or did the market carry me? Measuring a portfolio against the NEPSE index over time separates the two, which a raw profit-and-loss number never does.",
        },
      ],
      links: [{ label: "Live Site", href: "https://brish.swifttech.com.np/" }],
    },
  },
  {
    slug: "global-smart-plus",
    device: "phone",
    title: "Global Smart Plus",
    blurb:
      "Secure omni-channel banking platform delivering seamless web and mobile banking, built on microservices with gRPC.",
    year: "2022",
    category: "Digital Banking",
    tags: ["Node.js", "gRPC", "Microservices", "Docker", "Kubernetes"],
    metric: "Omni-channel — web + mobile banking",
    featured: true,
    study: {
      overview:
        "Global Smart Plus is a secure omni-channel banking platform offering seamless web and mobile banking. It is built with microservices communicating over gRPC, running on Node.js and packaged with Docker and Kubernetes.",
      role: "Backend Developer — Swift Technology",
      timeline: "From January 2022",
      team: "Swift Technology platform team",
      sections: [
        {
          heading: "The Product",
          body: "Omni-channel means one banking backend serving every surface a customer touches — the same accounts, balances, and transfers reachable from web and from mobile, without each channel growing its own divergent copy of the rules. The backend is the single source of truth; the channels are just views onto it.",
        },
        {
          heading: "Service Architecture",
          body: "The platform is decomposed into microservices that communicate over gRPC rather than sharing a database or passing JSON over REST. gRPC's generated contracts mean a change to a service's interface is a compile-time concern rather than something discovered in production when a field quietly changes shape.",
        },
        {
          heading: "Deployment",
          body: "Services are containerized with Docker and orchestrated on Kubernetes, so each one scales on its own axis — the transfer path and the statement path have very different load profiles, and neither should have to be provisioned for the other's peak.",
        },
      ],
    },
  },
  {
    slug: "global-biznex",
    device: "browser",
    title: "Global Biznex",
    blurb:
      "Corporate internet banking platform offering fund transfers, bulk payments, and granular access control for business customers.",
    year: "2024",
    category: "Digital Banking",
    tags: ["Node.js", "gRPC", "Microservices", "Docker", "Kubernetes"],
    metric: "Fund transfers, bulk payments, access control",
    featured: true,
    study: {
      overview:
        "Global Biznex is a secure, microservices-based corporate internet banking platform built with gRPC, Node.js, Docker, and Kubernetes, offering fund transfers, bulk payments, and access control.",
      role: "Backend Developer — Swift Technology",
      timeline: "From April 2024",
      team: "Swift Technology platform team",
      sections: [
        {
          heading: "Corporate Is Not Retail",
          body: "A retail customer moves their own money. A corporate customer moves the company's money, and rarely alone — payments get raised by one person and released by another, against limits set by a third. The interesting work in corporate banking is less about the transfer itself than about who is permitted to do what, and who signed off.",
        },
        {
          heading: "Bulk Payments",
          body: "Bulk payment is where corporate banking stops resembling retail entirely: one instruction can carry a payroll's worth of individual transfers. That shifts the backend's problem from 'is this transfer valid' to 'how does a batch of thousands succeed, fail, or partially fail in a way that's recoverable and auditable'.",
        },
        {
          heading: "Access Control",
          body: "Access control is a first-class feature rather than a wrapper around the API. Corporate hierarchies — makers, checkers, approvers, limits per role — have to be modelled in the backend, because they're the product, not an implementation detail bolted on at the edge.",
        },
      ],
    },
  },
  {
    slug: "global-junior",
    device: "phone",
    title: "Global Junior",
    blurb:
      "Secure child banking app with parental controls, tasks, savings, and smart spending — built on the same microservices core.",
    year: "2023",
    category: "Digital Banking",
    tags: ["Node.js", "gRPC", "Microservices", "Docker", "Kubernetes"],
    metric: "Parental controls, tasks, savings",
    study: {
      overview:
        "Global Junior is a secure, microservices-based child banking app built with gRPC, Node.js, Docker, and Kubernetes, offering parental controls, tasks, savings, and smart spending.",
      role: "Backend Developer — Swift Technology",
      timeline: "From October 2023",
      team: "Swift Technology platform team",
      sections: [
        {
          heading: "Two Users, One Account",
          body: "A child banking product has an unusual shape: the account holder and the account controller are different people with different permissions over the same money. The child spends; the parent sets the boundaries. Both need their own view, and the backend has to enforce the relationship rather than trust either client.",
        },
        {
          heading: "Parental Controls",
          body: "Controls are enforced server-side, which is the only place they mean anything. A limit that lives in the mobile app is a suggestion — the rule has to hold at the service boundary regardless of what the client sends.",
        },
        {
          heading: "Tasks And Savings",
          body: "Tasks, savings goals, and smart spending turn the account into something closer to a teaching tool than a wallet. Each is a small piece of product logic, and keeping them in their own services meant they could evolve without touching the core ledger path.",
        },
      ],
    },
  },
  {
    slug: "sani-securities",
    device: "browser",
    title: "Sani Securities",
    blurb:
      "Backend services for a NEPSE-licensed brokerage platform, enabling real-time trading, portfolio insights, and secure user transactions.",
    year: "2024",
    category: "Trading",
    tags: ["Node.js", "Microservices", "REST API", "WebSockets"],
    metric: "Real-time NEPSE trading backend",
    study: {
      overview:
        "Developed and optimized backend services for Sani Securities Company Limited, a NEPSE-licensed brokerage platform — enabling real-time trading, portfolio insights, and secure user transactions.",
      role: "Backend Developer",
      timeline: "From April 2024",
      team: "—",
      sections: [
        {
          heading: "Real-Time Is The Requirement",
          body: "A brokerage is a different animal from a bank. A bank's balance can settle a second late and nobody notices; a trading screen a second late is actively misleading, because the price you're looking at is the price you think you're getting. Market data has to move as it happens.",
        },
        {
          heading: "Portfolio Insights",
          body: "Portfolio views are read-heavy and derived — holdings, valuations, and position changes computed against live market data rather than stored as facts. The work is in making those reads fast enough to feel instant while staying correct against a price that never stops moving.",
        },
        {
          heading: "NEPSE Compliance",
          body: "Operating under a NEPSE licence means the platform's constraints are regulatory as well as technical. Secure user transactions aren't a feature you can defer to a later sprint — they're the condition of being allowed to run at all.",
        },
      ],
    },
  },
  {
    slug: "gold-silver",
    device: "browser",
    title: "Gold & Silver",
    blurb:
      "Real-time precious-metals tracker covering Nepal and 13 international markets, with historical charts, price alerts, and official NRB exchange rates.",
    year: "2026",
    category: "Personal",
    tags: ["TypeScript", "REST API", "Charts", "Vercel"],
    metric: "13 markets, 5-minute refresh",
    href: "https://goldsilver-brown.vercel.app/",
    study: {
      overview:
        "Track real-time gold and silver prices across Nepal and global markets. Nepal rates are shown per tola and per 10 grams with 24-hour highs and lows, alongside a 13-country comparison table, historical charts, price alerts, portfolio tools, and official Nepal Rastra Bank exchange rates.",
      role: "Solo — design, backend, and frontend",
      timeline: "2026",
      team: "Solo",
      sections: [
        {
          heading: "Why It Exists",
          body: "Gold and silver pricing in Nepal is quoted per tola, in rupees, and it matters to ordinary people — but the reliable numbers are scattered across news pages and market sites that assume you want grams and dollars. This puts the Nepal rate and the global rate on one screen, in the units people actually use.",
        },
        {
          heading: "Live Data",
          body: "Prices come from the GoldPrice.org API on a five-minute refresh cycle, with Nepal Rastra Bank's official exchange rates layered on so international prices convert against the rate the country actually publishes rather than a market approximation.",
        },
        {
          heading: "Beyond The Number",
          body: "A spot price alone doesn't answer 'should I buy today'. Historical charts across 1W, 1M, 6M, 1Y, and ALL show where the number came from; alerts and portfolio tools let you track a position instead of re-checking a page.",
        },
      ],
      outcomes: [
        { value: "13", label: "Countries tracked" },
        { value: "5min", label: "Price refresh cycle" },
        { value: "24h", label: "High / low window" },
      ],
      links: [
        { label: "Live Site", href: "https://goldsilver-brown.vercel.app/" },
        { label: "Source", href: "https://github.com/sudip490/goldsilver" },
      ],
    },
  },
  {
    slug: "k-cha-news",
    device: "phone",
    title: "K Cha News",
    blurb:
      "React Native news reader aggregating 35+ Nepali newsrooms, bilingual in English and नेपाली, with offline-tolerant caching.",
    year: "2026",
    category: "Personal",
    tags: ["React Native", "Expo", "TypeScript", "TanStack Query"],
    metric: "35+ newsrooms, bilingual",
    study: {
      overview:
        "A news reader for Nepal built on the public K cha khabar API, pulling today's headlines from more than 35 newsrooms into three feeds — Today, Finance, and World — readable in English or नेपाली with an instant toggle.",
      role: "Solo — design and build",
      timeline: "2026",
      team: "Solo",
      sections: [
        {
          heading: "Bilingual, Not Translated",
          body: "Nepali readers move between English and नेपाली constantly, often mid-article. The toggle is instant and preserves your place rather than reloading a translated page, because switching language shouldn't feel like navigating somewhere else.",
        },
        {
          heading: "Offline Tolerance",
          body: "Connectivity in Nepal is not a given, so the app is built to degrade rather than fail — cached stories stay readable, images persist to disk, and pull-to-refresh tolerates a request that doesn't come back. TanStack Query handles the caching; AsyncStorage keeps it across launches.",
        },
        {
          heading: "Respecting The Source",
          body: "The upstream API publishes a five-minute freshness contract, and the app honours it rather than hammering for updates nobody asked for. Every story carries publisher attribution back to K cha khabar and the newsroom that wrote it.",
        },
      ],
      links: [{ label: "Source", href: "https://github.com/sudip490/k-cha-news" }],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const contact = {
  /* The pitch. Lived hardcoded in Contact.tsx until it went stale — it
     still said "backend and infrastructure" long after the work stopped
     being only that. */
  pitch:
    "Open to backend and full-stack work. If you have a system that needs to survive real traffic — or a product that needs building end to end — I'd like to hear about it.",
};

export const about = {
  heading: "I work on the parts nobody sees until they break.",
  paragraphs: [
    "I'm a backend developer at Swift Technology, where I've spent the last four years working on financial platforms for Nepal. I'm on the Capital Market team — the live stock data, portfolio analytics, and real-time profit and loss you'll find inside IME Pay, Khalti, and the Global IME Bank app. I've also worked across the bank's platforms: omni-channel retail banking, corporate internet banking, and a child banking app, all on a microservices core that talks over gRPC.",
    "Most of my work is invisible when it's going well, which is the point. Banking backends are judged on the days they don't make the news. I care about the boring parts: services with contracts you can't accidentally break, data flow you can follow, and systems that fail in ways someone can actually recover from.",
    "Outside work I keep shipping. A real-time gold and silver tracker for the Nepali market, a React Native reader that pulls 35+ Nepali newsrooms into one bilingual feed, and three packages on npm — including tooling that scaffolds Model Context Protocol servers. Small things, but they're mine, and they're public.",
    "I studied Computer Science and Engineering at Dr. Ambedkar Institute of Technology, and I'm based in Kathmandu. I serve as Sergeant at Arms at the IME Pioneering Toastmasters Club. Cricket, music, reading, and writing fill in the rest.",
  ],
  principles: [
    {
      title: "Correctness First",
      body: "A fast wrong answer is still wrong. In banking, the guarantee is the product.",
    },
    {
      title: "Contracts Over Convention",
      body: "gRPC's generated interfaces catch at compile time what REST discovers in production.",
    },
    {
      title: "Enforce At The Boundary",
      body: "A rule that lives in the client is a suggestion. It has to hold at the service.",
    },
    {
      title: "Design For 3AM",
      body: "Systems get debugged by tired people. Optimize for that reader.",
    },
  ],
};

export type Pkg = {
  name: string;
  blurb: string;
  /* Monthly npm downloads. Point-in-time — refresh when it matters. */
  downloads: string;
  version: string;
  href: string;
  /* Rendered as a copyable one-liner where it's genuinely useful. */
  try?: string;
};

/* Published npm packages. Deliberately a compact strip rather than case
   studies — they're small, and pretending otherwise next to Capital
   Market would read as padding. */
export const packages: Pkg[] = [
  {
    name: "@subashgautam/mcp-scaffold",
    blurb: "Generate a working Model Context Protocol server from an interactive wizard or a config file.",
    downloads: "877",
    version: "0.5.0",
    href: "https://www.npmjs.com/package/@subashgautam/mcp-scaffold",
    try: "npx @subashgautam/mcp-scaffold",
  },
  {
    name: "@subashgautam/vpn-guard",
    blurb: "Block visitors using a VPN, proxy, or Tor — in the browser and as Express middleware.",
    downloads: "170",
    version: "1.0.1",
    href: "https://www.npmjs.com/package/@subashgautam/vpn-guard",
  },
  {
    name: "@subashgautam/router-mcp",
    blurb: "MCP server and CLI to monitor and control WiFi routers from an AI assistant. Ships with OpenWrt and mock adapters.",
    downloads: "45",
    version: "0.1.0",
    href: "https://www.npmjs.com/package/@subashgautam/router-mcp",
    try: "npx @subashgautam/router-mcp status --adapter mock",
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  blurb: string;
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Swift Technology Pvt. Ltd.",
    title: "Associate Software Developer",
    period: "Sept 2021 — Present",
    blurb:
      "On the Capital Market team, working on the stock and portfolio module that ships inside IME Pay, Khalti, and the Global IME Bank app. Also worked across the bank's platforms — Global Smart Plus (omni-channel retail), Global Biznex (corporate internet banking), and Global Junior (child banking) — on Node.js and gRPC, deployed with Docker and Kubernetes.",
    stack: ["Node.js", "gRPC", "Microservices", "PostgreSQL", "Docker", "Kubernetes"],
  },
];

export type Credential = {
  title: string;
  org: string;
  period: string;
  note?: string;
};

export const education: Credential[] = [
  {
    title: "B.E. Computer Science and Engineering",
    org: "Dr. Ambedkar Institute of Technology",
    period: "2017 — 2021",
  },
];

export const volunteering: Credential[] = [
  {
    title: "Sergeant at Arms",
    org: "IME Pioneering Toastmasters Club",
    period: "2023 — Present",
    note: "Toastmasters International. I run meeting logistics and work on the part of engineering nobody trains you for — standing up and explaining it.",
  },
];

/* Not decoration. A backend engineer who can hold a room is rarer than one
   who can hold a p99, and the résumé says so — this is where that lives. */
export const interests = ["Cricket", "Music", "Reading", "Writing"];

export const skills = [
  {
    group: "Languages & Runtimes",
    items: ["Node.js", "TypeScript", "JavaScript", "C++"],
  },
  {
    group: "Data & Messaging",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Neo4j", "Redis", "RabbitMQ", "Sequelize"],
  },
  {
    group: "Infrastructure",
    items: ["Docker", "Kubernetes", "Linux", "Nginx", "Git"],
  },
  {
    group: "Frameworks & Protocols",
    items: ["Express.js", "gRPC", "REST API", "WebSockets", "Microservices"],
  },
  {
    group: "Frontend & Mobile",
    items: ["Next.js", "React", "React Native", "Expo"],
  },
];
