import type { Project } from "@/lib/project-types";

/**
 * Projects — Software Engineering, Web Development & Cybersecurity.
 * Written honestly: concepts are labelled as concepts, work in progress
 * as in development. No invented metrics, screenshots or claims.
 */
export const softwareProjects: Project[] = [
  {
    slug: "order-of-service",
    name: "Order of Service",
    tagline: "Real-time service planning for church teams.",
    summary:
      "A modern church order-of-service planning application with real-time document preview, inline editing and reusable liturgy blueprints — built so teams stop juggling Word files and WhatsApp threads.",
    category: "software",
    status: "in-development",
    repo: "order-of-service",
    tech: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    cover: "window",
    featured: true,
    caseStudy: {
      overview: [
        "Order of Service is a planning application for drafting, refining and sharing the running order of church services. Instead of a Word document attached to a group chat, the service programme lives in a structured, editable document that updates its preview as you type.",
        "The project began as a fix for a workflow I saw first-hand: service outlines passed around as files, revised out-of-order, and handed to the media team too late to be useful. It has grown into a broader exploration of document-style applications — how structure, templates and live previews change the way teams plan a recurring event.",
      ],
      problem:
        "Service programmes are recurring, structural documents that are treated like one-off files. Every week the same sections are re-typed, changes arrive via chat messages, and the people who present the service — media, musicians, coordinators — each see a different version of the truth. The problem is not document editing; it is keeping a structured document alive across a team without a specialised tool.",
      intendedUsers:
        "Church service coordinators who draft the programme, administrators who maintain liturgy content, and media/production teams who need the final running order accurately and early enough to rehearse.",
      keyFeatures: [
        "Real-time preview of the running order as it is edited",
        "Inline editing of individual items directly in the flow of the document",
        "Liturgy blueprints — reusable templates for recurring service patterns",
        "Typed sections (songs, scripture, announcements) instead of free-form text",
        "A clean, print-friendly output for sharing the final programme",
      ],
      implementation: [
        "The application models a service as a typed document: an ordered collection of section blocks, each with its own fields and presentation rules. That model is what makes everything else possible — the preview, the blueprint templates and the print output are all projections of the same structured data rather than separate artefacts.",
        "The editing experience is built around optimistic, inline updates: selecting an item focuses it in context, and the preview pane reflects the change immediately. Blueprints are simply frozen documents whose sections can be cloned into a new draft, which keeps templating cheap to implement and easy to reason about.",
      ],
      challenges: [
        {
          challenge:
            "A service document has to be two things at once: an editor (dense, structured, keyboard-friendly) and a programme (clean, readable, presentable). Naively these pull in opposite directions.",
          solution:
            "Treating them as two views over one data model. The editor works on typed blocks; the preview renders the same blocks with presentation styles. No syncing layer is needed because there is only ever one source of truth.",
        },
        {
          challenge:
            "Liturgy varies widely between churches — section types that fit one tradition are noise to another.",
          solution:
            "Starting from a small, opinionated set of section types and keeping the block schema open, so new section kinds can be added without reworking the document model.",
        },
      ],
      status:
        "In active development. The document model, inline editing and preview flow are the current focus; blueprint management follows. Statuses on this page are maintained by hand.",
      future: [
        "Collaborative editing for coordinators and media teams",
        "A presentation mode for projection during the service itself",
        "Cloud sync with offline-friendly drafts",
        "A mobile companion for last-minute changes backstage",
      ],
    },
  },
  {
    slug: "xl-drive",
    name: "XL Drive",
    tagline: "A ride-hailing web experience with a clear booking journey.",
    summary:
      "A ride-hailing website project inspired by modern transportation platforms — a responsive interface with polished interactions and booking-oriented user journeys, built to study product-grade front-end work.",
    category: "software",
    status: "in-development",
    repo: "xl-drive",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    cover: "map",
    caseStudy: {
      overview: [
        "XL Drive is a front-end study of what a modern ride-hailing product feels like on the web. It focuses on the part riders actually experience: choosing a route, selecting a vehicle class, understanding a fare and confirming a trip — in a responsive interface that stays fast on modest devices and connections.",
        "The goal of the project is craft. Ride-hailing is a saturated category with mature conventions, which makes it an ideal training ground for interaction design: there is a well-understood user journey to measure my work against, and nothing to hide behind.",
      ],
      problem:
        "Multi-step booking flows are where front-end quality is most visible — and easiest to get wrong. State has to stay coherent across steps, loading and empty states matter, and the interface must remain usable on a small screen in one hand. The project exists to practise that whole surface area against a realistic domain.",
      intendedUsers:
        "Riders on mobile web — the hardest case — plus anyone evaluating the front-end as a portfolio piece.",
      keyFeatures: [
        "A step-by-step booking flow with a clear sense of progress",
        "Responsive layouts designed mobile-first",
        "Vehicle class and fare presentation with honest loading states",
        "Polished micro-interactions that never block the flow",
      ],
      implementation: [
        "The interface is componentised around the booking state machine: each step renders from the current state, and transitions animate opacity and transform only, keeping the flow smooth without layout thrash.",
        "Styling is utility-first with a small set of design tokens, so spacing, radius and elevation stay consistent across the many small components a booking UI produces.",
      ],
      challenges: [
        {
          challenge:
            "Making a multi-step flow feel light rather than like a long questionnaire.",
          solution:
            "Reducing each step to one decision, communicating progress without clutter, and allowing back-navigation without losing entered state.",
        },
      ],
      status:
        "In development as a front-end project. No backend booking service is claimed — that is explicitly future work.",
      future: [
        "Interactive map integration for pickup and destination selection",
        "A driver-side view to explore the other half of the marketplace",
        "A real booking API behind the interface",
      ],
    },
  },
  {
    slug: "terrific-bank",
    name: "Terrific Bank · Terry Coin",
    tagline: "A fintech prototype: wallets, transfers and multi-currency ledgers.",
    summary:
      "A financial-technology prototype exploring digital wallets, currency conversion, transfers and ledger records, with Terry Coin as its native currency concept — a study of how money movement should actually be modelled in software.",
    category: "software",
    status: "concept",
    repo: "terrific-bank",
    tech: ["TypeScript", "React", "SQL"],
    cover: "ledger",
    caseStudy: {
      overview: [
        "Terrific Bank is a prototype for a digital wallet application: accounts in multiple currencies, transfers between them, conversion, and a transaction ledger that records every movement. Terry Coin is the native currency concept woven through it — the fictional asset that gives the prototype its identity.",
        "The project is really about ledgers. Balances are easy to render; the interesting engineering question is how to record money movement so that history is complete, explainable and auditable — the difference between a number that happens to be displayed and a system that knows what happened.",
      ],
      problem:
        "Payment apps look simple from the outside and are quietly rigorous underneath. Building a credible prototype means confronting that rigour: every transfer touches two sides, conversion happens at a rate that must be recorded, and the ledger has to stay consistent even when the interface makes change look instant.",
      intendedUsers:
        "Prototype users moving and converting currency — and me, as the engineer learning the domain by constructing it.",
      keyFeatures: [
        "Multi-currency wallets with per-currency balances",
        "Transfers between accounts with complete ledger records",
        "Currency conversion with recorded exchange rates",
        "A transaction history that explains every movement",
        "Terry Coin as a native currency concept within the wallet",
      ],
      implementation: [
        "The design direction is ledger-first: money movement is recorded as immutable ledger entries, and balances are derived views over those entries rather than the source of truth. This mirrors how serious financial systems think and turns correctness into a property of the data model instead of the UI code.",
        "Conversion is modelled as two-sided movement — value leaves one currency and arrives in another at a recorded rate — so the ledger reads as a coherent story rather than an unexplained balance jump.",
      ],
      challenges: [
        {
          challenge:
            "Conversion is easy to present and easy to get subtly wrong — rounding, ordering, and the temptation to mutate balances directly.",
          solution:
            "Recording every conversion as paired ledger entries with the applied rate, and treating displayed balances as derived state. It is more work up front and dramatically easier to reason about afterwards.",
        },
      ],
      status:
        "Concept / prototype stage. It is a domain study, not a financial service — no real funds, no production claims.",
      future: [
        "Full double-entry structure with strict invariants",
        "Statements and exportable history",
        "Budgeting views over the ledger",
      ],
    },
  },
  {
    slug: "productivityos",
    name: "ProductivityOS",
    tagline: "A distraction-free workspace built around a timed Focus Mode.",
    summary:
      "A productivity application concept centred on a timed Focus Mode and a calm, distraction-free workspace — enough structure to organise deep work, without becoming another thing to manage.",
    category: "software",
    status: "concept",
    tech: ["TypeScript", "React"],
    cover: "grid",
    caseStudy: {
      overview: [
        "ProductivityOS is a concept for a workspace that takes focus seriously. Its centrepiece is a timed Focus Mode: a single, deliberate block of time in which the interface contracts to the work at hand and everything else recedes.",
        "The concept is a reaction to productivity tools that multiply surfaces — boards, dashboards, charts — until managing the system replaces doing the work. The design question here is the opposite: what is the minimum structure that supports deep work?",
      ],
      problem:
        "Most productivity software optimises for organising intentions rather than protecting attention. The problem this concept explores is an interface that is structurally committed to a single focus session at a time.",
      intendedUsers:
        "Knowledge workers and students who want a workspace that helps them start, hold and finish a focused block of work.",
      keyFeatures: [
        "A timed Focus Mode with a deliberately reduced interface",
        "A distraction-free workspace surface for the session's work",
        "Session history to see focus accumulate over time",
        "Lightweight organisation of what is up next",
      ],
      implementation: [
        "As a concept, the emphasis so far is interaction design: how the interface contracts when a session starts, how the timer stays present without becoming pressure, and how the workspace restores afterwards. The implementation approach follows the design — a session state machine that the whole UI subscribes to.",
      ],
      challenges: [
        {
          challenge:
            "Timers are trivial; making time visible without making it anxious is not.",
          solution:
            "Designing the timer as ambient state — perceptible at a glance, never flashing, never counting down loudly — and letting the user choose how present it is.",
        },
      ],
      status:
        "Concept. Interaction direction is being explored before deeper implementation.",
      future: [
        "Ambient session soundscapes and end-of-session rituals",
        "Integration with the Todo, Habits and Goals system",
      ],
    },
  },
  {
    slug: "todo-habits-goals",
    name: "Todo, Habits & Goals",
    tagline: "Tasks, habits and goals in one connected system.",
    summary:
      "A personal-productivity concept connecting task management, habit streaks, goal breakdown, calendar integration and Telegram notifications — the connected system I wanted for myself and couldn't find shaped quite this way.",
    category: "software",
    status: "concept",
    tech: ["TypeScript", "SQL", "Telegram Bot API"],
    cover: "grid",
    caseStudy: {
      overview: [
        "This project connects three things that usually live in three apps: what I need to do (tasks), what I want to keep doing (habits), and where I am heading (goals). The concept links them — goals decompose into tasks, tasks repeat as habits, and the calendar shows the whole shape of a week.",
        "The distinctive piece is delivery: reminders and digests arrive through Telegram, which is already where attention goes on a phone. A productivity system that lives behind an app icon competes with every other app; one that arrives as a message meets you where you are.",
      ],
      problem:
        "Fragmentation. Tasks, habits and goals drift apart because they are stored apart, and reminders fail when they require opening an app. The concept treats the three as one connected model with one delivery channel.",
      intendedUsers:
        "Individuals — starting with me — who want a single honest view of commitments, routines and direction.",
      keyFeatures: [
        "Task management with scheduling and priorities",
        "Habit tracking with streaks and history",
        "Goal breakdown into tasks and milestones",
        "A calendar view that unifies all three",
        "Telegram notifications for reminders and daily digests",
      ],
      implementation: [
        "The data model joins the three domains through shared scheduling: a calendar entry can originate from a task, a habit or a goal milestone, which keeps one timeline truthful. The Telegram side is a bot that reads the schedule and pushes reminders — delivery logic lives outside the core model so other channels can be added without touching it.",
      ],
      challenges: [
        {
          challenge:
            "Connected systems breed notification noise — everything wants to remind you of itself.",
          solution:
            "A single daily digest as the default, with per-item opt-in for immediate reminders. Quiet by default, loud only on request.",
        },
      ],
      status:
        "Concept. The Telegram notification path is the piece with the most prior hands-on experience behind it.",
      future: [
        "Natural-language quick capture through the bot",
        "Weekly review flows over goals and habits",
      ],
    },
  },
  {
    slug: "developer-portfolio",
    name: "Developer Portfolio",
    tagline: "This website — an exercise in restraint.",
    summary:
      "My personal engineering portfolio: Next.js App Router, TypeScript and Tailwind CSS with carefully budgeted motion, a maintained project catalogue, a GitHub integration with graceful fallback, and a real contact pipeline.",
    category: "software",
    status: "active",
    liveUrl: "/",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Motion", "Prisma"],
    cover: "window",
    featured: true,
    caseStudy: {
      overview: [
        "The portfolio you are reading is itself a project: a deliberately restrained, typography-first website that presents my work without pretending to be something it is not. Every section — including this case study — is generated from a structured project catalogue rather than hand-built pages.",
        "The interesting constraints were self-imposed: honest content only (no invented metrics or screenshots), Server Components by default, animation only where it earns its keep, and a GitHub integration that degrades gracefully instead of breaking when the API is unavailable.",
      ],
      problem:
        "A portfolio has three audiences — recruiters scanning for signal, clients evaluating capability, and engineers judging craft — and it must serve all three without bloat. The deeper problem: it is easy for a portfolio to imply more than its owner can defend. This one is built to be defensible.",
      intendedUsers:
        "Recruiters, potential clients and fellow developers who want to understand what I build and how I think.",
      keyFeatures: [
        "A structured project catalogue driving cards, filters and every case-study page",
        "GitHub integration with cached API requests and a local fallback catalogue",
        "A real contact form — validated, spam-protected, stored in a database",
        "Light and dark themes with no flash and full reduced-motion support",
        "A downloadable CV and honest project status labels",
        "Semantic HTML, keyboard-friendly navigation, sitemap and Open Graph metadata",
      ],
      implementation: [
        "Pages are Server Components by default; client components exist only where interactivity demands them — navigation state, theme toggle, project filters, animations and the contact form. Motion is confined to opacity and transforms, driven by viewport detection, and disabled for users who prefer reduced motion.",
        "The GitHub integration reads the configured username server-side, caches responses, and falls back to the local catalogue on failure or rate limits — the page never breaks because an API did. All professional links are environment-driven and simply do not render when unconfigured, which is how the site avoids inventing URLs.",
      ],
      challenges: [
        {
          challenge:
            "Modelling honesty in data. 'Concept', 'in development' and 'active' mean very different things, and most portfolio templates flatten them all into 'project'.",
          solution:
            "A status field with explicit labels and plain-language notes on every case study — the catalogue is the single place statuses are maintained, and every page inherits them.",
        },
        {
          challenge:
            "Keeping client-side JavaScript small while still feeling alive.",
          solution:
            "Doing structure and content in Server Components, delegating simple hover and active feedback to CSS transitions, and reserving motion for entrances and state changes that genuinely benefit from it.",
        },
      ],
      status:
        "Live and maintained. It evolves with the project catalogue — which is the point of building it this way.",
      future: [
        "MDX-based authoring for case studies and articles",
        "Full-text search across projects and writing",
        "Live GitHub activity when the profile is configured",
      ],
    },
  },
  {
    slug: "verify-hub",
    name: "Verify Hub",
    tagline: "Website verification and inspection, reported where you already work.",
    summary:
      "A website verification and inspection project exploring URL checks, browser automation, screenshots, error reporting, GitHub integration and Telegram notifications — so checks land where the team already is.",
    category: "security",
    status: "in-development",
    repo: "verify-hub",
    tech: ["Python", "Browser Automation", "Telegram Bot API", "GitHub API"],
    cover: "rings",
    featured: true,
    caseStudy: {
      overview: [
        "Verify Hub is a verification pipeline for websites: give it a URL and it checks availability, drives a real browser to capture what the page actually rendered, collects errors, and reports the result through Telegram and GitHub — the channels a small team already watches.",
        "It sits at the intersection of my interests in browser automation and web reliability, and it is scoped deliberately: it verifies availability, rendering and configuration. It does not claim to be a comprehensive security scanner, and its reports are careful to say so.",
      ],
      problem:
        "Knowing whether a deployment actually works is scattered across curl, DevTools, uptime dashboards and memory. For a small team — or one developer wearing every hat — the checks exist but the reporting never arrives where decisions happen. The problem is delivery as much as detection.",
      intendedUsers:
        "Developers and webmasters who want scheduled or on-demand verification of their deployments, reported into chat and issue trackers rather than another dashboard.",
      keyFeatures: [
        "URL availability and response checks",
        "Browser-automated page rendering with screenshot capture",
        "Error collection from the page and console",
        "GitHub integration for filing and tracking what broke",
        "Telegram notifications for immediate reporting",
      ],
      implementation: [
        "The architecture is a pipeline: check → capture → evaluate → report. Each stage is independent, which keeps the core honest — the check stage can run without reporting, and reporting can be extended without touching capture. Provider-based notification means Telegram and GitHub are implementations of one notifier interface, not hardwired paths.",
        "Browser automation runs real page loads with explicit timeouts and retries, because flaky automation that cries wolf destroys trust in the reports. Captures are treated as evidence attached to a verdict, not as the verdict itself.",
      ],
      challenges: [
        {
          challenge:
            "Browser automation is inherently flaky — slow pages, transient DNS, headless environment quirks. A verification tool that fails randomly is worse than no tool.",
          solution:
            "Explicit timeout budgets per stage, retries with backoff for transient failures, and distinguishing 'the site is broken' from 'the check could not complete' in every report.",
        },
        {
          challenge:
            "The temptation to over-claim: availability checks drifting into implying security assurance.",
          solution:
            "Scoping the language. Reports describe what was checked, and the documentation is explicit that this is availability and rendering verification — not a security audit.",
        },
      ],
      status:
        "In development. The check-and-capture pipeline is the current focus; notification integrations are being wired behind the provider interface.",
      future: [
        "Scheduled recurring checks with change detection",
        "TLS certificate and response-header checks",
        "Visual diffs between captures",
        "A small web dashboard over the history",
      ],
    },
  },
  {
    slug: "dataguard",
    name: "DataGuard",
    tagline: "Making data visible, organised and monitored.",
    summary:
      "A data-management and security-oriented dashboard concept built on SQLite — exploring what it means to give data the same visibility, organisation and monitoring care that we give to interfaces.",
    category: "security",
    status: "concept",
    tech: ["SQL", "SQLite", "TypeScript"],
    cover: "rings",
    caseStudy: {
      overview: [
        "DataGuard is a dashboard concept for working with structured data deliberately: seeing what exists, organising it, and monitoring how it changes. It is built on SQLite, which keeps the whole stack local and inspectable — the database file is the system, not a black box behind a service.",
        "The security orientation is about posture rather than scanning: knowing what data you hold, where it lives, and what changed is the foundation every other security practice builds on. The concept treats that visibility as a first-class interface problem.",
      ],
      problem:
        "Data accumulates silently. Tables grow, duplicates drift, and nobody can say precisely what is stored or what changed last month. Security thinking starts with inventory — and inventory is exactly what most small projects lack.",
      intendedUsers:
        "Developers and small teams who want a real picture of the data their applications actually hold.",
      keyFeatures: [
        "Organised, browsable views over structured data",
        "Visibility layers — what exists, where, and how much",
        "Monitoring views over data growth and change",
        "A local-first SQLite foundation with no external dependencies",
      ],
      implementation: [
        "The concept leans on SQLite's strengths: a single-file, zero-configuration database that can be inspected with standard tooling. The dashboard is a lens over schema and content rather than an ownership layer — it shows what is there instead of hiding it.",
      ],
      challenges: [
        {
          challenge:
            "Dashboards drift into decoration — charts that look like monitoring but convey nothing actionable.",
          solution:
            "Starting from questions ('what changed?', 'what grew?', 'what is unused?') and letting views earn their place by answering them.",
        },
      ],
      status: "Concept. Schema exploration and view design are the current work.",
      future: [
        "Change-log views with diffs",
        "Data retention and cleanup suggestions",
        "Export and reporting",
      ],
    },
  },
  {
    slug: "web-intelligence-platform",
    name: "Web Intelligence Platform",
    tagline: "Examining what websites reveal about themselves.",
    summary:
      "A website-inspection and investigation concept for examining technologies, page structure, publicly accessible information, configuration issues and potential vulnerabilities — a workbench for learning how the web leaks information.",
    category: "security",
    status: "concept",
    tech: ["Python", "Browser Automation", "HTTP Analysis"],
    cover: "nodes",
    caseStudy: {
      overview: [
        "The Web Intelligence Platform is a concept for an investigation workbench: point it at a website and it assembles a picture of what that site exposes — technologies in use, page structure, publicly accessible files and endpoints, configuration observations, and potential vulnerabilities flagged for human review.",
        "It is, openly, a learning instrument. Web security is learned by looking at real surfaces and asking what they reveal, and the platform is the structured way to do that looking — the tool I want to exist while I study.",
      ],
      problem:
        "Security assessment output is only as good as its honesty. Automated tools either drown the user in false certainty or hide their methodology. The problem this concept attacks is traceability: every observation should show the evidence it came from, and every finding should be a lead, not a verdict.",
      intendedUsers:
        "Security learners and analysts examining sites they are authorised to assess, who want observations they can verify rather than a score they can't.",
      keyFeatures: [
        "Technology fingerprinting from page and header evidence",
        "Page structure and metadata mapping",
        "Discovery of publicly exposed files and endpoints",
        "Configuration observations — headers, cookies, redirects",
        "Potential-vulnerability flags framed explicitly as leads for manual review",
      ],
      implementation: [
        "Findings are modelled as evidence chains: a claim, the raw observation behind it, and a confidence framing. This structure is what keeps the tool honest — nothing is reported that cannot show its source, and the 'potential vulnerability' label is reserved for observations a human must confirm.",
        "Collection uses standard HTTP analysis plus browser automation for what only a rendered page reveals, with the two kept clearly separated because their evidentiary weight differs.",
      ],
      challenges: [
        {
          challenge:
            "The line between investigation and intrusion is thin, and tools in this space are easily misused.",
          solution:
            "Designing for authorised targets, deliberate scope, and report language that never overstates — plus an approach that treats findings as study material first. Ethics are part of the design, not a disclaimer bolted on.",
        },
      ],
      status: "Concept — architecture and evidence model being designed.",
      future: [
        "Report export with full evidence trails",
        "Comparison between scans over time",
        "A study mode that explains why each finding matters",
      ],
    },
  },
];
