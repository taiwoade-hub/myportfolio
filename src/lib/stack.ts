/**
 * Tech stack — grouped by discipline.
 *
 * Honesty model: every item carries a level.
 *  - "core"      — I reach for it by default and can work unassisted
 *  - "working"   — used in real projects, still deepening
 *  - "exploring" — actively learning; listed as interest, not proficiency
 *
 * No skill bars, no percentages, no charts pretending to measure expertise.
 */

export type StackLevel = "core" | "working" | "exploring";

export interface StackItem {
  name: string;
  note: string;
  level: StackLevel;
}

export interface StackGroup {
  id: string;
  title: string;
  blurb: string;
  items: StackItem[];
}

export const stackGroups: StackGroup[] = [
  {
    id: "languages",
    title: "Languages",
    blurb: "The grammars I think in — general-purpose languages I use across projects.",
    items: [
      {
        name: "Python",
        note: "My automation workhorse — bots, tooling, pipelines and analysis.",
        level: "core",
      },
      {
        name: "TypeScript",
        note: "The web stack of choice; this portfolio and its interfaces.",
        level: "working",
      },
      {
        name: "JavaScript",
        note: "Everywhere TypeScript started; still the lingua franca of the web.",
        level: "core",
      },
      {
        name: "SQL",
        note: "SQLite and PostgreSQL — schemas, queries, ledgers and reporting views.",
        level: "working",
      },
      {
        name: "HTML & CSS",
        note: "Hand-authored layouts, semantic markup and the discipline of restraint.",
        level: "core",
      },
      {
        name: "Bash",
        note: "Server work, scripting and the glue between everything else.",
        level: "working",
      },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces that stay fast, readable and honest on every device.",
    items: [
      {
        name: "React",
        note: "Component thinking as a habit — props, state and derived views.",
        level: "working",
      },
      {
        name: "Next.js",
        note: "App Router, Server Components and metadata done properly — this site.",
        level: "working",
      },
      {
        name: "Tailwind CSS",
        note: "Design tokens and utility-first styling with consistent spacing.",
        level: "working",
      },
      {
        name: "shadcn/ui",
        note: "Accessible primitives composed instead of reinvented.",
        level: "working",
      },
      {
        name: "Motion (Framer Motion)",
        note: "Opacity and transforms only — entrance, reveal and state transitions.",
        level: "working",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs, services and the data layers behind the interfaces.",
    items: [
      {
        name: "FastAPI",
        note: "Python services — validation, typing and docs that stay in sync.",
        level: "working",
      },
      {
        name: "Node.js",
        note: "JavaScript on the server; API routes and tooling.",
        level: "working",
      },
      {
        name: "NestJS",
        note: "Structured backend architecture — exploring its conventions.",
        level: "exploring",
      },
      {
        name: "REST API design",
        note: "Resource modelling, status codes, and boundaries that don't leak.",
        level: "working",
      },
      {
        name: "Prisma",
        note: "Typed data access for the contact pipeline on this site.",
        level: "working",
      },
    ],
  },
  {
    id: "security",
    title: "Cybersecurity",
    blurb: "A student's discipline: fundamentals first, tools in service of understanding.",
    items: [
      {
        name: "Linux",
        note: "Daily driver and lab environment — users, permissions, processes, logs.",
        level: "working",
      },
      {
        name: "Web security fundamentals",
        note: "OWASP Top 10 as a study map — understood before weaponised.",
        level: "exploring",
      },
      {
        name: "Browser automation",
        note: "Driving real browsers for inspection, verification and evidence capture.",
        level: "working",
      },
      {
        name: "Security tooling",
        note: "Learning the standard toolkit — deliberately listed as studying, not certified.",
        level: "exploring",
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    blurb: "Infrastructure I operate myself — deployment practice, not just theory.",
    items: [
      {
        name: "Docker",
        note: "Containerised services with persistent state where it matters.",
        level: "working",
      },
      {
        name: "Git & GitHub",
        note: "Branch discipline, review habits and repository hygiene.",
        level: "core",
      },
      {
        name: "AWS EC2",
        note: "Ubuntu instances over SSH — deployment and remote management.",
        level: "working",
      },
      {
        name: "Coolify",
        note: "My self-hosting workbench — deploys, domains and DNS troubleshooting.",
        level: "working",
      },
      {
        name: "Cloudflare Tunnel",
        note: "Exposing local work securely; DNS management at the edge.",
        level: "working",
      },
      {
        name: "PostgreSQL",
        note: "Durable data for services I run — schemas and operational habits.",
        level: "working",
      },
      {
        name: "Redis",
        note: "Caching and fast-access patterns in my self-hosted stack.",
        level: "exploring",
      },
      {
        name: "Nginx",
        note: "Reverse proxy duties in front of self-hosted services.",
        level: "exploring",
      },
    ],
  },
  {
    id: "ai",
    title: "AI & Automation",
    blurb: "Intelligence applied narrowly — bots, agents and pipelines with jobs to do.",
    items: [
      {
        name: "LLM integrations",
        note: "Conversational features with bounded output and graceful fallback.",
        level: "working",
      },
      {
        name: "Python automation",
        note: "Scripts that remove the repetitive parts of real workflows.",
        level: "core",
      },
      {
        name: "Telegram bots (aiogram)",
        note: "Miro and siblings — long-running, stateful, reliable-by-discipline bots.",
        level: "working",
      },
      {
        name: "yt-dlp",
        note: "Media pipelines and the ergonomics built on top of capable engines.",
        level: "working",
      },
    ],
  },
];

export const stackLevelMeta: Record<
  StackLevel,
  { label: string; description: string }
> = {
  core: {
    label: "Core",
    description: "Reached for by default; can work unassisted.",
  },
  working: {
    label: "Working",
    description: "Used in real projects; still deepening.",
  },
  exploring: {
    label: "Exploring",
    description: "Actively learning — an interest, not yet a proficiency.",
  },
};
