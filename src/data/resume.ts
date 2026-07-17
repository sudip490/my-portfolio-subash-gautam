/* ---------------------------------------------------------------
   RESUME CONTENT.
   Separate from content.ts on purpose: a resume is a different
   document with different conventions — terser, verb-first, and
   written for a parser as much as a person.

   Format follows current ATS guidance: single column (parsers read
   left-to-right and scramble two-column layouts), standard section
   headings, no tables or graphics, real selectable text, and both
   the acronym and the expansion where a term has one.
   --------------------------------------------------------------- */

export const resumeHeader = {
  name: "Subash Gautam",
  title: "Software Engineer",
  location: "Kathmandu, Nepal",
  email: "suwaz.gautam@gmail.com",
  phone: "+977 974-569-6149",
  links: [
    { label: "github.com/sudip490", href: "https://github.com/sudip490" },
    { label: "linkedin.com/in/subashgautam22", href: "https://www.linkedin.com/in/subashgautam22/" },
    { label: "npmjs.com/~subashgautam", href: "https://www.npmjs.com/~subashgautam" },
  ],
};

/* Keywords land hardest in the summary and the first bullet of each role —
   both ATS weighting and how a human skims. Front-load accordingly. */
export const resumeSummary =
  "Software engineer with 4+ years building the microservices behind Nepal's digital banking. Backend focus — Node.js, Express, and gRPC — with work running inside IME Pay, Khalti, and the Global IME Bank app. Comfortable across the stack: Next.js and React on the web, React Native on mobile, and open-source developer tooling published to npm.";

export type ResumeRole = {
  title: string;
  org: string;
  location: string;
  period: string;
  projects: { name: string; note: string; bullets: string[] }[];
};

export const resumeExperience: ResumeRole[] = [
  {
    title: "Associate Software Developer",
    org: "Swift Technology Pvt. Ltd.",
    location: "Kathmandu, Nepal",
    period: "September 2021 — Present",
    projects: [
      {
        name: "Capital Market",
        note: "live in IME Pay, Khalti, and the Global IME Bank app",
        bullets: [
          "Integrated live stock market data — last traded price (LTP) and change percentage — into analytics and reporting for a capital-market module embedded in three consumer finance apps.",
          "Optimized database queries to process large-scale portfolio data efficiently.",
          "Developed modules calculating real-time profit and loss, receivable amounts, and transaction summaries as derived values, keeping them correct against continuously moving prices.",
        ],
      },
      {
        name: "Brish Terminal",
        note: "NEPSE portfolio analytics",
        bullets: [
          "Full-stack work on a Nepal Stock Exchange (NEPSE) intelligence terminal: real-time floorsheet, whale-trade alerts, portfolio replay against the NEPSE index, and a live block-trade radar.",
          "Built with Next.js, React, and TypeScript, served behind Nginx.",
        ],
      },
      {
        name: "Global Smart Plus",
        note: "omni-channel retail banking",
        bullets: [
          "Backend services for a secure omni-channel banking platform delivering web and mobile banking from a single microservices core.",
          "Services communicate over gRPC on Node.js, containerized with Docker and orchestrated on Kubernetes.",
        ],
      },
      {
        name: "Global Biznex",
        note: "corporate internet banking",
        bullets: [
          "Backend for corporate internet banking — fund transfers, bulk payments, and granular access control across maker/checker/approver hierarchies.",
          "Microservices over gRPC on Node.js, Docker, and Kubernetes.",
        ],
      },
      {
        name: "Global Junior",
        note: "child banking",
        bullets: [
          "Backend for a child banking app with parental controls, tasks, savings, and smart spending, enforcing a two-user permission model server-side.",
        ],
      },
      {
        name: "Sani Securities Company Limited",
        note: "NEPSE-licensed brokerage",
        bullets: [
          "Developed and optimized backend services enabling real-time trading, portfolio insights, and secure user transactions.",
        ],
      },
    ],
  },
];

export const resumeOpenSource = [
  {
    name: "@subashgautam/mcp-scaffold",
    downloads: "877 downloads",
    note: "Generates a working Model Context Protocol (MCP) server from an interactive wizard or a config file. TypeScript, MIT.",
  },
  {
    name: "@subashgautam/vpn-guard",
    downloads: "170 downloads",
    note: "Blocks VPN, proxy, and Tor traffic — in the browser and as Express middleware. TypeScript, MIT.",
  },
  {
    name: "@subashgautam/router-mcp",
    downloads: "45 downloads",
    note: "MCP server and CLI to monitor and control WiFi routers from an AI assistant. Pluggable adapters; ships OpenWrt (SSH/ubus) and a mock backend. TypeScript, MIT.",
  },
];

export const resumeProjects = [
  {
    name: "Gold & Silver",
    href: "goldsilver-brown.vercel.app",
    note: "Real-time gold and silver price tracker covering Nepal and 13 international markets. Per-tola and per-10g rates with 24-hour highs and lows, historical charts, price alerts, and official Nepal Rastra Bank exchange rates on a five-minute refresh. TypeScript, Next.js.",
  },
  {
    name: "K Cha News",
    href: "github.com/sudip490/k-cha-news",
    note: "React Native (Expo) news reader aggregating 35+ Nepali newsrooms into bilingual English/Nepali feeds, with offline-tolerant caching via TanStack Query.",
  },
];

/* Grouped, and spelled out where a parser might only know one form —
   guidance is to carry both the acronym and the expansion. */
export const resumeSkills = [
  { group: "Languages & Runtimes", items: "Node.js, TypeScript, JavaScript, C++" },
  {
    group: "Backend",
    items: "Express.js, gRPC, REST APIs, WebSockets, microservices architecture",
  },
  {
    group: "Databases",
    items: "PostgreSQL, MySQL, MongoDB, Neo4j (graph database), Redis, Sequelize ORM",
  },
  { group: "Messaging", items: "RabbitMQ" },
  {
    group: "Infrastructure & DevOps",
    items: "Docker, Kubernetes, Linux, Nginx, Git",
  },
  { group: "Frontend & Mobile", items: "Next.js, React, React Native, Expo" },
];

export const resumeEducation = {
  degree: "Bachelor of Engineering (B.E.), Computer Science and Engineering",
  org: "Dr. Ambedkar Institute of Technology",
  period: "2017 — 2021",
};

export const resumeLeadership = {
  title: "Sergeant at Arms",
  org: "IME Pioneering Toastmasters Club — Toastmasters International",
  period: "2023 — Present",
  note: "Support meeting logistics and develop leadership while helping others grow as communicators.",
};
