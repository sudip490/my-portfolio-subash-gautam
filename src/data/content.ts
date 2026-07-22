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

/* ---- System diagram (case-study "Architecture" section) ----
   Tiers render as columns, left to right — clients in, data out.
   Layout is computed by ArchDiagram; this is pure topology. */
export type ArchNode = {
  id: string;
  label: string;
  /* Smaller mono second line — protocol, cadence, or the point. */
  sub?: string;
  /* The part of the system this case study is about. Accent outline. */
  accent?: boolean;
  /* External system we talk to, not something we run. Dashed outline. */
  ext?: boolean;
};

export type Architecture = {
  tiers: { label: string; nodes: ArchNode[] }[];
  /* from/to are node ids. Dashed = async / scheduled flows. */
  edges: { from: string; to: string; label?: string; dashed?: boolean }[];
  /* One-line caption under the diagram. */
  note?: string;
};

/* ---- Animated terminal (case-study "API in action" section) ----
   Values are illustrative — shaped like the real responses, not
   captured from production systems. */
export type ApiDemo = {
  /* Terminal title-bar text. */
  title: string;
  /* The command typed into the prompt, one string per line. */
  request: string[];
  /* Response lines revealed after the request. hl = accent line. */
  response: { text: string; hl?: boolean }[];
  /* Trailing status line. err renders red — sometimes the deny IS the feature. */
  status: { text: string; tone: "ok" | "err" };
  /* Lede shown beside the terminal: why this call is the story. */
  note: string;
};

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
  /* Optional system diagram — the section is skipped when absent. */
  architecture?: Architecture;
  /* Optional terminal demo — the section is skipped when absent. */
  apiDemo?: ApiDemo;
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
  /* Looping ~6s backdrop clip in /public/work/motion (Pexels, free
     license); its poster frame is the same path with .jpg. When set it
     replaces ProjectVisual's generated canvas behind the device mockup. */
  motion?: string;
  study: CaseStudy;
};

export const projects: Project[] = [
  {
    slug: "capital-market",
    device: "phone",
    motion: "/work/motion/capital-market.mp4",
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
      architecture: {
        tiers: [
          {
            label: "Channels",
            nodes: [
              { id: "imepay", label: "IME Pay" },
              { id: "khalti", label: "Khalti" },
              { id: "gib", label: "Global IME Bank" },
            ],
          },
          {
            label: "Edge",
            nodes: [{ id: "api", label: "Capital Market API", sub: "one API, three apps" }],
          },
          {
            label: "Services",
            nodes: [
              { id: "market", label: "Live Market Data", sub: "tick ingest" },
              { id: "pnl", label: "P&L Engine", sub: "computed in real time", accent: true },
              { id: "portfolio", label: "Portfolio Analytics", sub: "read-optimized" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { id: "nepse", label: "NEPSE Feed", sub: "live ticks", ext: true },
              { id: "pg", label: "PostgreSQL", sub: "holdings + txns" },
            ],
          },
        ],
        edges: [
          { from: "imepay", to: "api" },
          { from: "khalti", to: "api" },
          { from: "gib", to: "api" },
          { from: "api", to: "market" },
          { from: "api", to: "pnl" },
          { from: "api", to: "portfolio" },
          { from: "market", to: "pnl" },
          { from: "market", to: "nepse", label: "subscribes", dashed: true },
          { from: "pnl", to: "pg" },
          { from: "portfolio", to: "pg" },
        ],
        note: "Prices flow in once and fan out to three apps. Every P&L figure is derived against the live tick at read time — nothing is a stored snapshot that can go stale.",
      },
      apiDemo: {
        title: "capital-market — portfolio summary",
        request: [
          "curl -s https://api.capital.internal/v1/portfolio/summary \\",
          '  -H "Authorization: Bearer <channel-token>"',
        ],
        response: [
          { text: "{" },
          { text: '  "holdings": 34,' },
          { text: '  "invested": "12,50,000.00",' },
          { text: '  "market_value": "14,18,200.00",' },
          { text: '  "pnl": "+1,68,200.00 (+13.45%)",', hl: true },
          { text: '  "receivable": "25,400.00",' },
          { text: '  "priced_at": "live tick, 2s ago"' },
          { text: "}" },
        ],
        status: { text: "200 OK · computed on read, correct as the price moves", tone: "ok" },
        note: "The numbers people open the app for — P&L, valuation, receivables — are derived at request time against the live NEPSE tick. Nothing in this response is a stored snapshot that can go stale.",
      },
    },
  },
  {
    slug: "brish-terminal",
    device: "browser",
    motion: "/work/motion/brish-terminal.mp4",
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
      architecture: {
        tiers: [
          { label: "Client", nodes: [{ id: "browser", label: "Trader's Browser" }] },
          {
            label: "Edge",
            nodes: [
              { id: "nginx", label: "Nginx", sub: "tls + proxy" },
              { id: "next", label: "Next.js", sub: "terminal ui" },
            ],
          },
          {
            label: "Engine",
            nodes: [
              { id: "ingest", label: "Floorsheet Ingest", sub: "every trade, live" },
              { id: "whale", label: "Whale Detector", sub: "block-trade radar", accent: true },
              { id: "replay", label: "Replay Engine", sub: "vs NEPSE index" },
            ],
          },
          {
            label: "Source",
            nodes: [{ id: "nepse", label: "NEPSE Floorsheet", sub: "public record", ext: true }],
          },
        ],
        edges: [
          { from: "browser", to: "nginx", label: "wss" },
          { from: "nginx", to: "next" },
          { from: "next", to: "ingest", label: "stream" },
          { from: "next", to: "whale", label: "alerts" },
          { from: "next", to: "replay" },
          { from: "ingest", to: "whale" },
          { from: "nepse", to: "ingest", label: "every tick", dashed: true },
        ],
        note: "The floorsheet arrives as a firehose. The pipeline reads every trade as it lands and turns it into alerts a trader can act on while the market is still open.",
      },
      apiDemo: {
        title: "brish — block-trade radar",
        request: ['curl -s "https://brish.swifttech.com.np/api/radar?window=5m"'],
        response: [
          { text: "[" },
          { text: "  {" },
          { text: '    "symbol": "NABIL",' },
          { text: '    "side": "BUY",' },
          { text: '    "qty": 50000,' },
          { text: '    "value": 25600000,' },
          { text: '    "flag": "BLOCK_TRADE",', hl: true },
          { text: '    "source": "floorsheet, live"' },
          { text: "  }" },
          { text: "]" },
        ],
        status: { text: "200 OK · surfaced while the market is open, not after", tone: "ok" },
        note: "Large trades show up in the floorsheet before they show up in the price. The radar surfaces them the moment they land — after the fact, the edge is gone.",
      },
    },
  },
  {
    slug: "global-smart-plus",
    device: "phone",
    motion: "/work/motion/global-smart-plus.mp4",
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
      architecture: {
        tiers: [
          {
            label: "Channels",
            nodes: [
              { id: "web", label: "Web Banking" },
              { id: "mobile", label: "Mobile Banking" },
            ],
          },
          { label: "Edge", nodes: [{ id: "gw", label: "API Gateway", sub: "one contract" }] },
          {
            label: "Services",
            nodes: [
              { id: "auth", label: "Auth" },
              { id: "accounts", label: "Accounts" },
              { id: "transfers", label: "Transfers", sub: "the money path", accent: true },
              { id: "statements", label: "Statements" },
            ],
          },
          {
            label: "Core",
            nodes: [{ id: "cbs", label: "Core Banking", sub: "bank of record", ext: true }],
          },
        ],
        edges: [
          { from: "web", to: "gw" },
          { from: "mobile", to: "gw" },
          { from: "gw", to: "auth", label: "gRPC" },
          { from: "gw", to: "accounts" },
          { from: "gw", to: "transfers" },
          { from: "gw", to: "statements" },
          { from: "accounts", to: "cbs" },
          { from: "transfers", to: "cbs" },
        ],
        note: "One backend, every channel. Web and mobile are views onto the same services — and each service scales on its own axis on Kubernetes, because the transfer path and the statement path never share a load profile.",
      },
      apiDemo: {
        title: "grpcurl — funds transfer",
        request: [
          "grpcurl -d '{",
          '    "from":   "0170010012345",',
          '    "to":     "0170010067890",',
          '    "amount": "25,000.00"',
          "  }' smartplus.internal:443 \\",
          "  transfers.v1.Transfers/Execute",
        ],
        response: [
          { text: "{" },
          { text: '  "status": "SETTLED",', hl: true },
          { text: '  "txnId": "TXN-2022-084921",' },
          { text: '  "channel": "MOBILE",' },
          { text: '  "balance": "1,83,500.00"' },
          { text: "}" },
        ],
        status: { text: "0 OK · one generated contract, every channel", tone: "ok" },
        note: "A transfer over the platform's gRPC contract. Web and mobile call this exact service — the channel changes, the rules can't, because there's only one copy of them.",
      },
    },
  },
  {
    slug: "global-biznex",
    device: "browser",
    motion: "/work/motion/global-biznex.mp4",
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
      architecture: {
        tiers: [
          {
            label: "Corporate",
            nodes: [
              { id: "maker", label: "Maker", sub: "raises payments" },
              { id: "approver", label: "Approver", sub: "releases them" },
            ],
          },
          { label: "Edge", nodes: [{ id: "gw", label: "Corporate Gateway" }] },
          {
            label: "Services",
            nodes: [
              { id: "bulk", label: "Bulk Payments", sub: "payroll-scale batches" },
              { id: "access", label: "Access Control", sub: "maker–checker", accent: true },
              { id: "transfers", label: "Fund Transfers" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { id: "ledger", label: "Ledger" },
              { id: "audit", label: "Audit Log", sub: "who signed off" },
            ],
          },
        ],
        edges: [
          { from: "maker", to: "gw", label: "raise" },
          { from: "approver", to: "gw", label: "release" },
          { from: "gw", to: "access", label: "every call" },
          { from: "access", to: "bulk" },
          { from: "access", to: "transfers" },
          { from: "bulk", to: "ledger" },
          { from: "transfers", to: "ledger" },
          { from: "bulk", to: "audit", label: "trail", dashed: true },
        ],
        note: "No payment reaches the ledger without passing access control, and no release happens on the credentials that raised it. The hierarchy lives in the backend — it is the product.",
      },
      apiDemo: {
        title: "biznex — bulk payment batch",
        request: [
          "curl -s -X POST https://biznex.internal/v1/bulk/submit \\",
          '  -H "X-Role: maker" --data-binary @payroll-july.csv',
        ],
        response: [
          { text: "{" },
          { text: '  "batch": "PAYROLL-2024-07",' },
          { text: '  "items": 1240,' },
          { text: '  "accepted": 1237,' },
          { text: '  "failed": 3,' },
          { text: '  "failures": "itemized, retryable",' },
          { text: '  "state": "HELD_FOR_APPROVAL",', hl: true },
          { text: '  "release_requires": "approver"' },
          { text: "}" },
        ],
        status: { text: "202 Accepted · nothing moves until an approver signs", tone: "ok" },
        note: "A payroll-sized batch raised by a maker: the three failures stay itemized and recoverable instead of poisoning the batch, and not one rupee moves until someone with release rights signs off.",
      },
    },
  },
  {
    slug: "global-junior",
    device: "phone",
    motion: "/work/motion/global-junior.mp4",
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
      architecture: {
        tiers: [
          {
            label: "Clients",
            nodes: [
              { id: "child", label: "Child App", sub: "spends" },
              { id: "parent", label: "Parent App", sub: "sets the rules" },
            ],
          },
          { label: "Edge", nodes: [{ id: "gw", label: "API Gateway", sub: "gRPC inside" }] },
          {
            label: "Services",
            nodes: [
              { id: "controls", label: "Parental Controls", sub: "enforced server-side", accent: true },
              { id: "ledger", label: "Core Ledger", sub: "the money path" },
              { id: "tasks", label: "Tasks & Savings", sub: "own services" },
            ],
          },
          { label: "Data", nodes: [{ id: "db", label: "Ledger Store" }] },
        ],
        edges: [
          { from: "child", to: "gw", label: "spend" },
          { from: "parent", to: "gw", label: "limits" },
          { from: "gw", to: "controls", label: "authorize" },
          { from: "gw", to: "tasks" },
          { from: "controls", to: "ledger" },
          { from: "tasks", to: "ledger" },
          { from: "ledger", to: "db" },
        ],
        note: "Two people with different permissions over the same money. The child spends, the parent sets the boundary, and the backend referees — neither client is trusted with the rules.",
      },
      apiDemo: {
        title: "grpcurl — spend authorization",
        request: [
          "grpcurl -d '{",
          '    "child":    "acct_7031",',
          '    "merchant": "GameZone",',
          '    "amount":   "1,500.00"',
          "  }' junior.internal:443 \\",
          "  junior.v1.SpendAuthz/Authorize",
        ],
        response: [
          { text: "{" },
          { text: '  "decision": "DENIED",', hl: true },
          { text: '  "rule": "DAILY_LIMIT",' },
          { text: '  "limit": "1,000.00",' },
          { text: '  "spent_today": "850.00",' },
          { text: '  "set_by": "parent",' },
          { text: '  "enforced_at": "service boundary"' },
          { text: "}" },
        ],
        status: { text: "7 PERMISSION_DENIED · the rule held, whatever the client sent", tone: "err" },
        note: "A spend attempt past the parent's daily limit, denied at the service boundary. This deny is the feature: a limit that lived in the mobile app would be a suggestion.",
      },
    },
  },
  {
    slug: "sani-securities",
    device: "browser",
    motion: "/work/motion/sani-securities.mp4",
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
      architecture: {
        tiers: [
          { label: "Client", nodes: [{ id: "web", label: "Trader Web" }] },
          {
            label: "Edge",
            nodes: [
              { id: "rest", label: "REST API" },
              { id: "ws", label: "WebSocket Feed", sub: "pushed, not polled", accent: true },
            ],
          },
          {
            label: "Services",
            nodes: [
              { id: "trading", label: "Trading", sub: "order lifecycle" },
              { id: "portfolio", label: "Portfolio Insights", sub: "derived on read" },
            ],
          },
          {
            label: "Data",
            nodes: [
              { id: "nepse", label: "NEPSE", sub: "live market", ext: true },
              { id: "db", label: "Holdings DB" },
            ],
          },
        ],
        edges: [
          { from: "web", to: "rest" },
          { from: "web", to: "ws", label: "live ticks" },
          { from: "rest", to: "trading" },
          { from: "rest", to: "portfolio" },
          { from: "trading", to: "nepse", label: "orders" },
          { from: "nepse", to: "ws", label: "ticks", dashed: true },
          { from: "portfolio", to: "db" },
        ],
        note: "A brokerage backend has one non-negotiable: the price on screen is the price at the exchange. Ticks are pushed the moment they land — a second of lag is a wrong number.",
      },
      apiDemo: {
        title: "wscat — live market stream",
        request: [
          "wscat -c wss://api.sani.internal/stream \\",
          "  -x '{\"subscribe\": [\"NIFRA\", \"NABIL\"]}'",
        ],
        response: [
          { text: '< { "s": "NIFRA", "ltp": 312.50, "chg": "+1.8%" }' },
          { text: '< { "s": "NABIL", "ltp": 512.00, "chg": "-0.4%" }' },
          { text: '< { "s": "NIFRA", "ltp": 313.00, "chg": "+1.9%" }', hl: true },
        ],
        status: { text: "connected · ticks pushed as they happen, no polling", tone: "ok" },
        note: "A WebSocket subscription to live NEPSE symbols. The server pushes every tick as it lands — the screen never waits on the next poll to learn the truth.",
      },
    },
  },
  {
    slug: "gold-silver",
    device: "browser",
    motion: "/work/motion/gold-silver.mp4",
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
      architecture: {
        tiers: [
          { label: "Client", nodes: [{ id: "browser", label: "Browser", sub: "tola + 10g, NPR" }] },
          {
            label: "App",
            nodes: [{ id: "next", label: "Next.js on Vercel", sub: "app + api routes" }],
          },
          {
            label: "Services",
            nodes: [
              { id: "sync", label: "Price Sync", sub: "every 5 minutes", accent: true },
              { id: "alerts", label: "Alert Engine" },
            ],
          },
          {
            label: "Sources",
            nodes: [
              { id: "gp", label: "GoldPrice.org", sub: "spot prices", ext: true },
              { id: "nrb", label: "NRB", sub: "official fx rates", ext: true },
            ],
          },
        ],
        edges: [
          { from: "browser", to: "next" },
          { from: "next", to: "sync", label: "latest" },
          { from: "next", to: "alerts" },
          { from: "sync", to: "gp", label: "5m poll", dashed: true },
          { from: "sync", to: "nrb", label: "official fx", dashed: true },
        ],
        note: "Spot prices convert against the exchange rate Nepal actually publishes — Nepal Rastra Bank's — instead of a market approximation, on the five-minute refresh the whole app honours.",
      },
      apiDemo: {
        title: "gold & silver — nepal spot",
        request: ['curl -s "https://goldsilver-brown.vercel.app/api/prices?market=np"'],
        response: [
          { text: "{" },
          { text: '  "unit": "per tola, NPR",' },
          { text: '  "gold": "1,98,500",', hl: true },
          { text: '  "silver": "2,410",' },
          { text: '  "high_24h": "1,99,100",' },
          { text: '  "low_24h": "1,97,800",' },
          { text: '  "fx_source": "Nepal Rastra Bank",' },
          { text: '  "refreshed": "94s ago"' },
          { text: "}" },
        ],
        status: { text: "200 OK · five-minute refresh, NRB official rates", tone: "ok" },
        note: "The Nepal rate in the units people actually use — per tola, in rupees — with the 24-hour range and the official exchange rate doing the honest work underneath.",
      },
    },
  },
  {
    slug: "k-cha-news",
    device: "phone",
    motion: "/work/motion/k-cha-news.mp4",
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
      architecture: {
        tiers: [
          {
            label: "On Device",
            nodes: [
              { id: "app", label: "K Cha App", sub: "react native" },
              { id: "query", label: "TanStack Query", sub: "request cache" },
              { id: "storage", label: "AsyncStorage", sub: "survives launches", accent: true },
            ],
          },
          {
            label: "Network",
            nodes: [{ id: "api", label: "K Cha Khabar API", sub: "5-min freshness", ext: true }],
          },
          {
            label: "Sources",
            nodes: [{ id: "rooms", label: "35+ Newsrooms", sub: "attributed", ext: true }],
          },
        ],
        edges: [
          { from: "app", to: "query" },
          { from: "query", to: "storage" },
          { from: "query", to: "api", label: "when online", dashed: true },
          { from: "api", to: "rooms", label: "aggregates", dashed: true },
        ],
        note: "The interesting tier is the device. When the network goes away — and in Nepal it does — the cache is the app: stories stay readable, images persist, refresh tolerates silence.",
      },
      apiDemo: {
        title: "k cha khabar — today's feed",
        request: ['curl -s "https://api.kchakhabar.com/v1/today?lang=ne"'],
        response: [
          { text: "{" },
          { text: '  "articles": [' },
          { text: '    { "title": "आजका मुख्य समाचार…",' },
          { text: '      "source": "Kantipur", "lang": "ne" },' },
          { text: "    …" },
          { text: "  ]," },
          { text: '  "newsrooms": 37,', hl: true },
          { text: '  "fresh_for": "300s"' },
          { text: "}" },
        ],
        status: { text: "200 OK · honours the 5-minute freshness contract", tone: "ok" },
        note: "One call aggregates 35+ newsrooms with attribution intact. The app respects the API's freshness contract instead of hammering it — and serves the cache when the network disappears.",
      },
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
