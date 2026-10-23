import type { Project } from "@/lib/project-types";

/**
 * Projects — DevOps, Cloud, Infrastructure & Trading Technology.
 *
 * Infrastructure entries document *practice*, not fictional pipelines:
 * they describe work actually performed, and are labelled as ongoing
 * exploration rather than production systems.
 *
 * Trading entries are software and market-analysis projects. Nothing here
 * is financial advice, and no profit or performance is claimed.
 */
export const infraProjects: Project[] = [
  {
    slug: "coolify-deployment",
    name: "Coolify Deployment Infrastructure",
    tagline: "My practical self-hosting workbench.",
    summary:
      "Documented hands-on work deploying applications with Coolify — connecting GitHub repositories, configuring domains, troubleshooting DNS and keeping services running on my own infrastructure.",
    category: "devops",
    status: "ongoing",
    tech: ["Coolify", "Docker", "Ubuntu", "DNS", "GitHub"],
    cover: "pipeline",
    featured: true,
    caseStudy: {
      overview: [
        "This entry documents practice, not a software artefact: my ongoing work standing up and operating a self-hosted deployment environment on Coolify. Applications are deployed from GitHub repositories, exposed on configured domains, and kept running through real troubleshooting — the unglamorous half of engineering that tutorials skip.",
        "It is featured in my portfolio deliberately. Deployment is where software stops being a repository and starts being a system, and doing it yourself — on hardware you control, with a reverse proxy you configured — teaches the full request path in a way no managed platform ever will.",
      ],
      problem:
        "I wanted deployments I could understand end-to-end: from git push, through build, to a running container behind a reverse proxy with a domain pointed at it. Managed platforms abstract exactly the layers I wanted to learn, so I removed the abstraction on purpose.",
      intendedUsers:
        "Me — and anyone evaluating whether I can operate infrastructure, not just write applications that run on it.",
      keyFeatures: [
        "Application deployments connected to GitHub repositories",
        "Domain configuration with DNS record management",
        "Reverse proxy and TLS handled through Coolify",
        "Service management — start, stop, logs, environment configuration",
        "Systematic troubleshooting when something refuses to work",
      ],
      implementation: [
        "The setup is Coolify on an Ubuntu host: applications deploy from connected GitHub repositories into containers, Coolify's proxy layer terminates TLS and routes configured domains, and DNS records at the registrar point traffic at the host. Environment variables and build configuration live per-application inside Coolify, keeping deployment concerns out of application code.",
        "The workflow is deliberately boring: push to a branch, deploy, watch the logs, verify the domain, fix what's broken. The interesting part is the diagnostic muscle it builds — when a deployment fails, the cause can live anywhere in a chain from DNS propagation to proxy configuration to the application itself, and finding it requires reading each layer honestly.",
      ],
      challenges: [
        {
          challenge:
            "DNS is the classic trap: records propagate asynchronously, caches lie, and 'it works for me' is meaningless across resolvers.",
          solution:
            "A fixed diagnostic order — registrar, resolver caches, direct DNS queries, then the proxy — plus the discipline to wait out propagation instead of reconfiguring a correct setup out of impatience.",
        },
        {
          challenge:
            "When a containerised app fails behind a proxy, the error you see is rarely the error that happened.",
          solution:
            "Reading logs at every layer in sequence: container stdout, proxy access and error logs, then the application. The proxy's 502 is a symptom; the cause is usually one layer deeper.",
        },
      ],
      status:
        "Ongoing exploration — a working environment I operate continuously, documented as practiced. No fictional pipelines, no invented uptime.",
      future: [
        "Monitoring and alerting over deployed services",
        "Automated backups with tested restores",
        "Infrastructure expressed as reproducible configuration",
      ],
    },
  },
  {
    slug: "tunnel-sharing-utility",
    name: "Tunnel Sharing Utility",
    tagline: "Cloudflare Tunnel and ngrok, one command.",
    summary:
      "A utility concept for exposing locally hosted applications through configurable tunnel providers — including secure HTTPS access where supported — without touching firewall rules or router configuration.",
    category: "devops",
    status: "concept",
    tech: ["Cloudflare Tunnel", "ngrok", "CLI"],
    cover: "pipeline",
    caseStudy: {
      overview: [
        "A small utility concept with a narrow job: make local applications shareable. Rather than remembering each provider's flags and credentials, one command starts a tunnel through the provider of your choice — Cloudflare Tunnel, ngrok, or whatever comes next — and hands back the URL.",
        "It exists because local-first development keeps colliding with the reality that demos, webhooks and mobile devices need a public URL. Tunnels solve that; the friction is purely interface.",
      ],
      problem:
        "Testing a local app from another device, or receiving webhooks during development, requires a public endpoint. The tools exist but each has its own configuration, auth flow and invocation ritual — and context-switching into them breaks development flow.",
      intendedUsers:
        "Developers who need to show or receive traffic for work running on localhost.",
      keyFeatures: [
        "Provider-configurable tunnels from one interface",
        "Cloudflare Tunnel and ngrok as first-class providers",
        "Secure HTTPS access where the provider supports it",
        "Simple start, stop and status commands",
      ],
      implementation: [
        "The design wraps existing tunnel providers rather than reimplementing any tunneling — each provider is a small adapter exposing start, stop and URL retrieval. Provider credentials live in local configuration, and the utility adds the orchestration layer: choosing providers, reporting URLs, and cleaning up processes on exit.",
      ],
      challenges: [
        {
          challenge:
            "Tunnel processes are easy to start and easy to orphan — background processes that outlive their purpose and hold ports hostage.",
          solution:
            "Strict process ownership in the design: the utility tracks what it starts, cleans up on exit, and refuses to pretend a tunnel is gone while its process lives.",
        },
      ],
      status: "Concept — built on established tools, contributing ergonomics rather than tunneling.",
      future: [
        "Configuration profiles per project",
        "Automatic provider failover",
      ],
    },
  },
  {
    slug: "media-storage-api",
    name: "Media Storage API",
    tagline: "A self-hostable media pipeline, Cloudinary-inspired.",
    summary:
      "An API concept for uploading, storing and serving media files through a self-hostable service — owning the upload, storage and delivery path that applications usually rent.",
    category: "devops",
    status: "concept",
    tech: ["REST API", "File Storage", "Docker"],
    cover: "ledger",
    caseStudy: {
      overview: [
        "The Media Storage API is a concept for the boring-but-central plumbing of media on the web: an upload endpoint, organised storage, and a delivery path with sensible caching. It is inspired by what Cloudinary offers, deliberately minus the parts that make sense only at scale.",
        "The self-hostable constraint is the point. Media pipelines are where applications quietly surrender sovereignty — files scattered across third-party buckets, URLs that rot when services do. A small, ownable version of that layer is a reasonable thing for any self-hoster to want.",
      ],
      problem:
        "Every application that accepts images eventually needs the same trio: accept an upload, keep it somewhere durable, serve it back efficiently. Building it as a standalone service once — rather than per-application — turns repeated glue code into infrastructure you understand completely.",
      intendedUsers:
        "Developers self-hosting applications who want a media layer they control, on infrastructure they run.",
      keyFeatures: [
        "Upload API for media files",
        "Organised storage layout with stable identifiers",
        "Delivery with appropriate cache headers",
        "Self-hostable as a single service",
      ],
      implementation: [
        "The concept centres on a clean resource model: media as an addressable resource with metadata (type, size, checksum, timestamps) rather than a filename in a folder. Storage is abstracted behind a small interface — local disk today, anything with the same shape tomorrow — and delivery is HTTP with honest cache semantics, because that is where a media API earns its keep.",
      ],
      challenges: [
        {
          challenge:
            "Uploads are where APIs are abused — oversized payloads, wrong content types, and filenames that were never meant to be trusted.",
          solution:
            "Validation at the boundary: strict size limits, content-type verification against actual bytes, and server-generated identifiers so client-supplied names never reach the filesystem.",
        },
      ],
      status: "Concept.",
      future: [
        "Image transformation on delivery",
        "Deduplication via checksums",
        "Direct-to-storage upload flows",
      ],
    },
  },
  {
    slug: "self-hosted-infrastructure",
    name: "Self-Hosted Development Infrastructure",
    tagline: "PostgreSQL, Redis, Docker and Linux, run by hand.",
    summary:
      "My ongoing exploration of production-style infrastructure — PostgreSQL, Redis, Docker, Linux servers and reverse proxies, operated personally to learn how systems behave when you're the one responsible for them.",
    category: "devops",
    status: "ongoing",
    tech: ["PostgreSQL", "Redis", "Docker", "Linux", "Nginx"],
    cover: "grid",
    caseStudy: {
      overview: [
        "This is the infrastructure counterpart to the Coolify deployment work: a personal environment where I run and operate the services real applications depend on — PostgreSQL for durable data, Redis for caching and queues, Docker for isolation, Nginx as a reverse proxy, all on Linux.",
        "The distinction from a production system is honesty, not effort. This is infrastructure I operate continuously and learn from directly, but it is not serving customers under an SLA — and this portfolio will not pretend otherwise.",
      ],
      problem:
        "Abstractions only teach you the abstraction. The problem this work solves is my own: understanding what managed services actually manage — connection behaviour, memory pressure, persistence trade-offs, restart semantics — by being the manager for once.",
      intendedUsers:
        "Me, and my projects: every service here backs real applications I run, so the infrastructure is exercised by actual workloads rather than tutorials.",
      keyFeatures: [
        "PostgreSQL instances serving real application data",
        "Redis for caching and fast-access patterns",
        "Docker for service isolation and reproducibility",
        "Nginx as reverse proxy in front of services",
        "Linux server operation — users, permissions, processes, logs",
      ],
      implementation: [
        "Services run as isolated containers where isolation matters (databases especially), with persistent volumes so state survives restarts, and Nginx fronting the services that need HTTP exposure. The operating discipline is the real content: monitoring resource use, reading logs before restarting anything, and changing one variable at a time when something misbehaves.",
      ],
      challenges: [
        {
          challenge:
            "Redis and PostgreSQL both fail quietly and dramatically in different ways — subtle latency, memory creep, then suddenly a hard stop.",
          solution:
            "Learning each service's observability surface before its tuning knobs: what 'healthy' looks like at rest, so deviation is visible early instead of discovered at failure.",
        },
      ],
      status:
        "Ongoing exploration, operated continuously. Described as practiced — not dressed up as production operations.",
      future: [
        "Backups with tested restoration",
        "Centralised logging across services",
        "Resource monitoring with alerting",
      ],
    },
  },
  {
    slug: "aws-ec2-deployment",
    name: "AWS EC2 Deployment",
    tagline: "Ubuntu instances in the cloud, managed over SSH.",
    summary:
      "Documented experience connecting to Ubuntu EC2 instances over SSH — deploying and managing applications remotely, and learning how cloud servers actually behave when you're the one at the keyboard.",
    category: "devops",
    status: "ongoing",
    tech: ["AWS EC2", "SSH", "Ubuntu", "Linux"],
    cover: "pipeline",
    caseStudy: {
      overview: [
        "This entry documents my hands-on work with AWS EC2: launching Ubuntu instances, connecting over SSH with key-based authentication, and deploying and managing applications on remote machines.",
        "The cloud, experienced as an operator rather than a dashboard tourist, is a different thing. An EC2 instance is just Linux — until it isn't: security groups behave like a firewall you can't see, the public IP is a fact you must design around, and every long-running process is yours alone to keep alive.",
      ],
      problem:
        "Remote servers fail in ways local ones don't: network partitions, key mismanagement, instances that vanish when their billing configuration says so. The problem is building the operational habits — key discipline, explicit configuration, verification after every change — that make remote work reliable instead of lucky.",
      intendedUsers:
        "Me and my deployments; anyone assessing whether I can operate cloud infrastructure, not just launch it.",
      keyFeatures: [
        "SSH key-based access to Ubuntu instances",
        "Remote application deployment and management",
        "Security group configuration for exposed services",
        "Instance lifecycle management — launch, configure, verify",
      ],
      implementation: [
        "Access is strictly key-based SSH, with keys and known-hosts managed deliberately rather than opportunistically. Deployment follows the same discipline as local work: explicit steps, verification after each, and logs consulted before assumptions. Security groups are treated as the real firewall they are — every open port is a decision, not a default.",
      ],
      challenges: [
        {
          challenge:
            "The gap between 'the command succeeded' and 'the service is reachable' hides most cloud-starter pain — security groups, binding addresses, and public DNS all conspire silently.",
          solution:
            "A verification chain that tests locally on the instance first, then through the security group, then from outside — so the failing layer announces itself instead of a vague 'it doesn't work'.",
        },
      ],
      status:
        "Ongoing practical experience — documented as performed, never inflated into 'production cloud operations'.",
      future: [
        "Infrastructure-as-code for repeatable environments",
        "Automated deployment pipelines on push",
      ],
    },
  },
  {
    slug: "alchemist",
    name: "Alchemist",
    tagline: "A market-intelligence bot for Telegram.",
    summary:
      "A backend-oriented trading intelligence bot combining Telegram, Python and market-structure concepts — BOS, CHOCH, liquidity, fair value gaps and market regimes — as an analysis assistant, never a signal service.",
    category: "trading",
    status: "in-development",
    repo: "alchemist",
    tech: ["Python", "Telegram Bot API", "Market Data APIs"],
    cover: "market",
    featured: true,
    caseStudy: {
      overview: [
        "Alchemist is a backend-oriented bot that watches markets and reports structure. Built in Python around Telegram for delivery, it processes price data through technical concepts — break of structure (BOS), change of character (CHOCH), liquidity levels, fair value gaps (FVG) and market regimes — and turns what it observes into readable, source-cited messages.",
        "It is an analysis assistant with strict boundaries: it describes what the market did and where structure sits. It does not predict, promise, or advise — and its messages are worded so that stays true even under pressure.",
      ],
      problem:
        "Market-structure analysis is repetitive and mechanical — exactly the work software should absorb. A human analyst scanning pairs for BOS/CHOCH events, liquidity pools and unmitigated gaps is doing pattern detection at machine speed poorly. The problem is automating the observation while leaving every ounce of the judgement with the human.",
      intendedUsers:
        "One primary user: me. Alchemist is a personal research tool that surfaces structure across pairs so my own analysis starts informed instead of starting from a blank chart.",
      keyFeatures: [
        "Structure event detection — BOS and CHOCH",
        "Liquidity level identification",
        "Fair value gap tracking",
        "Market regime labelling",
        "Telegram delivery in plain, non-advisory language",
      ],
      implementation: [
        "The pipeline separates three concerns rigidly: data ingestion (market data in), structure analysis (a pure engine turning price series into labelled events), and delivery (Telegram formatting and dispatch). The analysis engine is deliberately stateless-per-scan — every observation derives from data it can re-derive — which makes reports reproducible and bugs localisable.",
        "Terminology discipline is enforced in the delivery layer: the bot reports what happened ('BOS confirmed at level X') and never what to do. That boundary lives in code, not just documentation — advisory phrasing has no template to be rendered from.",
      ],
      challenges: [
        {
          challenge:
            "Structure detection is noisy: every smoothing choice moves a BOS by candles, and a bot that cries structure constantly trains its user to ignore it.",
          solution:
            "Explicit, tunable definitions for every event — the bot reports structure with its parameters visible, so disagreements with the output are resolved by adjusting the definition rather than distrusting the bot.",
        },
        {
          challenge:
            "Anything adjacent to markets attracts profit-shaped expectations, and tools drift toward feeding them.",
          solution:
            "Non-advisory language as a design constraint, no performance claims anywhere in the product, and the project framed everywhere — including here — as analysis software, not a trading system.",
        },
      ],
      status:
        "In development. The structure engine and Telegram delivery are the active work. This is software for market analysis — it is not financial advice, and it makes no performance claims.",
      future: [
        "Backtesting the structure definitions over history",
        "Additional regime models",
        "User-tunable alert thresholds",
      ],
    },
  },
  {
    slug: "trading-market-scanner",
    name: "Trading Market Scanner",
    tagline: "Scanning pairs, simulating trades.",
    summary:
      "An exploration of market-data integration — cryptocurrency pair discovery, trading simulations and technical analysis — to understand how scanners are actually built, from data to decision surface.",
    category: "trading",
    status: "experimental",
    tech: ["Python", "Market Data APIs"],
    cover: "market",
    caseStudy: {
      overview: [
        "The Market Scanner is an exploration of the machinery behind trading tools: discovering cryptocurrency pairs, pulling their data, running technical analysis across them, and simulating trades against the results. It is a study of how scanners work — assembled honestly, piece by piece, rather than downloaded as a black box.",
        "The simulation framing matters: simulated trades are a way to test an analysis pipeline against reality without pretending any money was at stake. The scanner's output is insight into its own logic, nothing more.",
      ],
      problem:
        "Scanners look like magic and are mostly plumbing: rate limits, pagination, symbol normalisation, indicator maths, and the endless gap between 'data received' and 'data usable'. The problem this project solves is my own understanding of that plumbing — every layer built by hand.",
      intendedUsers:
        "Me, as research infrastructure; anyone curious how a market scanner is constructed.",
      keyFeatures: [
        "Cryptocurrency pair discovery across exchanges",
        "Market-data integration with respectful rate handling",
        "Technical analysis across scanned pairs",
        "Trade simulation against analysis output",
      ],
      implementation: [
        "Discovery and scanning are separated: pair discovery produces the universe, scanning evaluates it, and simulation lives behind both. Rate limiting and retry behaviour are first-class — exchanges are the hostile environment every real trading tool must survive — and results carry their timestamps because analysis without time discipline is noise.",
      ],
      challenges: [
        {
          challenge:
            "Exchange APIs disagree about everything: naming, precision, pagination, and what a 'pair' even is.",
          solution:
            "A normalisation layer with per-exchange adapters, so the analysis engine sees one consistent universe regardless of where the data came from.",
        },
      ],
      status:
        "Experimental. A research exploration of market tooling — no financial advice, no performance claims, no exceptions.",
      future: [
        "Persisted scan history for comparison",
        "More indicators and configurable scan criteria",
      ],
    },
  },
];
