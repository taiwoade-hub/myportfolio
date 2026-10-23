import type { Project } from "@/lib/project-types";

/**
 * Projects — AI, Automation & Bots.
 * Jurix and RunX are intentionally thin: their descriptions will be
 * completed only after a proper repository review. No functionality is
 * invented for projects whose source has not been inspected.
 */
export const aiProjects: Project[] = [
  {
    slug: "miro",
    name: "Miro · Miro Alex",
    tagline: "A Telegram AI and music bot with memory.",
    summary:
      "A Telegram bot built with Python and aiogram blending conversational AI, music features, per-user memory and administrative commands — my longest-running experiment in making a bot feel alive rather than mechanical.",
    category: "ai",
    status: "experimental",
    repo: "miro",
    tech: ["Python", "aiogram", "LLM APIs", "SQLite"],
    cover: "nodes",
    featured: true,
    caseStudy: {
      overview: [
        "Miro is a Telegram bot with a personality. Around a Python and aiogram core, it combines conversational AI, music-related features, memory of the people it talks to, and the administrative commands a group actually needs. Its sibling variant, Miro Alex, carries the same architecture with a different character.",
        "The project is where I learned that the hard part of a bot is not replying — it is everything around replying: holding state across conversations, surviving restarts, respecting rate limits, and behaving consistently when a dozen people are talking at once.",
      ],
      problem:
        "Most bots are vending machines: press a command, receive a canned response. The problem Miro explores is continuity — a bot that remembers who you are, participates in the ambient conversation of a group, and still performs concrete jobs like music playback and admin tasks when asked.",
      intendedUsers:
        "Telegram group members who want a bot that is useful and pleasant to have around, and group admins who need moderation tooling that blends in.",
      keyFeatures: [
        "Conversational AI woven into ordinary group chat",
        "Music features and playback-related commands",
        "Memory integration — the bot retains context about users over time",
        "Administrative commands for group management",
        "A consistent personality across features",
      ],
      implementation: [
        "The aiogram layer is organised as domain handlers — conversation, music, memory, admin — behind a shared context object, so features compose instead of colliding. Memory lives in SQLite keyed per user and per chat, which keeps recall cheap and restart-safe.",
        "AI responses are bounded and purposeful: the bot knows when it is being addressed, keeps replies within a deliberate length, and falls back gracefully when the AI backend is slow or unavailable. The bot is a long-running process, so every subsystem is written to fail independently rather than take the process down.",
      ],
      challenges: [
        {
          challenge:
            "A long-running bot is a reliability problem wearing a chat interface. Memory leaks, unawaited tasks and unhandled exceptions all surface as the bot going quiet — the worst failure mode, because it looks like absence.",
          solution:
            "Strict lifecycle discipline around the event loop, supervisor-style restarts, error boundaries per handler, and logging that makes 'why did Miro stop talking' answerable from logs alone.",
        },
        {
          challenge:
            "Memory cuts both ways: remembering everything is creepy and expensive; remembering nothing defeats the point.",
          solution:
            "Scoped, purposeful memory — the bot keeps what serves the conversation (names, preferences, running jokes) and expires what doesn't, with retention rules per memory type.",
        },
      ],
      status:
        "Experimental — actively iterated on and used in the small groups it serves. It is a hobby-scale system and is described that way.",
      future: [
        "A plugin architecture so features can be enabled per chat",
        "Smarter memory retrieval instead of full-context injection",
        "Voice interaction in chats",
      ],
    },
  },
  {
    slug: "jurix",
    name: "Jurix",
    tagline: "A Telegram bot project.",
    summary:
      "A Telegram bot project. I'm deliberately keeping this description minimal until I revisit the repository and document what it actually does — a case study written from memory would be a case study with invented details.",
    category: "ai",
    status: "experimental",
    statusNote: "Functionality to be confirmed from the repository",
    repo: "jurix",
    tech: ["Telegram Bot API"],
    cover: "nodes",
    caseStudy: {
      overview: [
        "Jurix is a Telegram bot project from my automation work. That is, honestly, everything this page should claim today: the full case study will be written after a proper repository review, with features documented from the code rather than from memory.",
        "I hold my project pages to a simple standard — nothing is described as working unless the source confirms it. This page is what that standard looks like when applied to itself.",
      ],
      problem:
        "To be documented during the repository review, alongside the feature inventory and architecture notes.",
      intendedUsers: "To be confirmed from the repository.",
      keyFeatures: [
        "Telegram bot functionality — details pending repository review",
      ],
      implementation: [
        "Pending review. The architecture section will cover how the bot is structured once the source has been re-read.",
      ],
      challenges: [
        {
          challenge:
            "Documenting a project accurately months after touching it last.",
          solution:
            "Not documenting it from memory at all — reviewing the repository first, then writing. This page will be replaced by the real case study.",
        },
      ],
      status:
        "Experimental. A repository review is scheduled to determine the accurate current state and feature set.",
      future: [
        "A complete, code-verified case study on this page",
      ],
    },
  },
  {
    slug: "alphahunter",
    name: "AlphaHunter",
    tagline: "An AI agent concept for the Mantle and Somnia ecosystems.",
    summary:
      "An AI-agent concept exploring the Mantle and Somnia ecosystems — what an autonomous assistant could meaningfully observe and do on-chain, built as an investigation rather than a product.",
    category: "ai",
    status: "concept",
    tech: ["Python", "LLM APIs"],
    cover: "nodes",
    caseStudy: {
      overview: [
        "AlphaHunter is a concept for an AI agent that lives in the Mantle and Somnia ecosystems. The interest is not trading automation — it is agency: what can an LLM-driven agent perceive on-chain, what actions are meaningful, and where does autonomy stop being useful and start being risk.",
        "The project treats the agent loop itself as the product: perception of ecosystem state, reasoning over what changed, and a constrained set of actions with human-visible explanations for every decision.",
      ],
      problem:
        "Agent frameworks are easy to demo and hard to trust. The concept explores the boring-but-decisive parts: bounded action spaces, explainable decisions, and failure modes that degrade to 'ask the human' instead of improvising.",
      intendedUsers:
        "Developers and explorers of on-chain ecosystems who want an assistant that surfaces what matters instead of acting on its own initiative.",
      keyFeatures: [
        "Ecosystem observation across Mantle and Somnia",
        "An agent loop with explicitly constrained actions",
        "Explainable decisions — every action carries its reasoning",
        "Human-in-the-loop defaults for anything consequential",
      ],
      implementation: [
        "The concept architecture separates perception (data collection from the ecosystems), cognition (LLM reasoning over observations) and action (a whitelist of operations the agent may perform). The action whitelist is the safety model — autonomy is earned per action, not assumed.",
      ],
      challenges: [
        {
          challenge:
            "On-chain actions are irreversible, which makes agent errors expensive in a way web-app errors never are.",
          solution:
            "Defaulting to observation and recommendation; any execution path is opt-in, bounded and simulated before it is real.",
        },
      ],
      status: "Concept. Ecosystem research and agent architecture exploration.",
      future: [
        "A simulation environment for agent behaviour",
        "Action audit logs with human-readable reasoning",
      ],
    },
  },
  {
    slug: "desktop-voice-ai",
    name: "Desktop Voice AI",
    tagline: "An offline-first Ubuntu desktop assistant.",
    summary:
      "A desktop assistant concept for Ubuntu focused on voice interaction, offline speech recognition and desktop integration — AI that works on your machine without depending on someone else's cloud.",
    category: "ai",
    status: "concept",
    tech: ["Python", "Speech Recognition", "Linux Desktop APIs"],
    cover: "rings",
    caseStudy: {
      overview: [
        "Desktop Voice AI is a concept for an Ubuntu assistant you talk to. Voice in, actions out: launch applications, find files, control the desktop — with speech recognition that runs locally and keeps working when the network doesn't.",
        "The project is interesting to me precisely because of its constraints. Offline recognition trades accuracy for autonomy and privacy, and Linux desktop integration is unfashionable, under-documented territory — which makes it a genuinely good place to learn how systems fit together.",
      ],
      problem:
        "Voice assistants are overwhelmingly cloud products: convenient, always-listening, and useless without connectivity. The concept asks what a credible local-first alternative looks like on the desktop most people don't associate with voice at all.",
      intendedUsers:
        "Linux users who want hands-free control of their machine without sending their voice to a third party.",
      keyFeatures: [
        "Voice input with offline speech recognition",
        "Desktop actions — launching apps, finding files, system queries",
        "A local-first design that degrades gracefully offline",
        "Responses that respect the terminal-first nature of Linux",
      ],
      implementation: [
        "The concept pipeline is: capture → local speech-to-text → intent mapping → desktop action. Intent mapping is deliberately rule-based rather than LLM-dependent for core actions, so the assistant's basics survive without any AI backend; language model integration is an enhancement layer, not a dependency.",
      ],
      challenges: [
        {
          challenge:
            "Offline speech recognition quality varies dramatically across accents and hardware.",
          solution:
            "Designing commands as short, structured phrases the recognizer can be tuned for, rather than free-form conversation — matching the assistant's scope to what local models actually do well.",
        },
      ],
      status: "Concept. Feasibility work on recognition quality and desktop APIs.",
      future: [
        "Wake-word detection",
        "A small plugin system for custom actions",
      ],
    },
  },
  {
    slug: "linklens",
    name: "LinkLens",
    tagline: "A command-line media utility, built around yt-dlp.",
    summary:
      "A CLI media utility that wraps yt-dlp with a friendlier workflow — inspecting links, listing formats and handling batches — with a graphical interface planned once the core settles.",
    category: "ai",
    status: "in-development",
    repo: "linklens",
    tech: ["Python", "yt-dlp", "CLI"],
    cover: "pipeline",
    caseStudy: {
      overview: [
        "LinkLens is a command-line utility for working with media links. Built on yt-dlp, it focuses on the workflow around downloading: inspecting what a link actually contains, comparing formats and quality, and processing many links at once without babysitting each one.",
        "The name is the intent — a lens on links. Rather than memorising extractor flags, the tool answers the questions you actually have before downloading: what is this, what quality exists, and what will I get.",
      ],
      problem:
        "yt-dlp is extraordinarily capable and correspondingly dense. For everyday tasks — check a link, pick a sensible quality, grab a batch — the interface tax is real. The problem LinkLens solves is ergonomics: a small, predictable surface over a large, capable engine.",
      intendedUsers:
        "People who live in a terminal and want media handling to be a one-liner, not a research project.",
      keyFeatures: [
        "Link inspection with available formats and metadata",
        "Quality and format selection with sensible defaults",
        "Batch processing of many links",
        "A clean CLI with helpful errors",
        "A graphical interface, planned",
      ],
      implementation: [
        "LinkLens wraps yt-dlp as an engine rather than reimplementing extraction — metadata queries flow through it, results are normalised into a small set of meaningful options, and the CLI layer owns all the ergonomics. Keeping the engine swappable is deliberate: upstream does extraction best, and the value here is the interface.",
      ],
      challenges: [
        {
          challenge:
            "Wrapping a fast-moving upstream tool: extractors break, options change.",
          solution:
            "A thin integration layer with the CLI owning defaults, plus honest error messages when an extractor fails rather than pretending the link is bad.",
        },
      ],
      status:
        "In development as a CLI. The graphical interface is planned, not started — and labelled accordingly.",
      future: [
        "The planned graphical interface",
        "Output presets for common destinations",
        "Library-style mode for use from other tools",
      ],
    },
  },
  {
    slug: "runx",
    name: "RunX",
    tagline: "A Visual Studio Code extension project.",
    summary:
      "A Visual Studio Code extension project. Like Jurix, this page stays deliberately minimal until I complete a repository review — the feature list will come from the code, not from optimism.",
    category: "ai",
    status: "experimental",
    statusNote: "Features to be confirmed from the repository",
    repo: "runx",
    tech: ["TypeScript", "VS Code Extension API"],
    cover: "grid",
    caseStudy: {
      overview: [
        "RunX is a Visual Studio Code extension project — an exploration of developer tooling inside the editor, where the smallest friction reduction pays off many times a day.",
        "What it does today is a question I will answer from the source: the honest version of this page arrives after a repository review documents the extension's actual commands, configuration and behaviour. Until then, this is intentionally a placeholder that admits it.",
      ],
      problem:
        "To be documented during the repository review — what friction the extension removes and for whom.",
      intendedUsers: "To be confirmed from the repository.",
      keyFeatures: [
        "VS Code extension functionality — details pending repository review",
      ],
      implementation: [
        "Pending review; the extension architecture and command surface will be documented from the code.",
      ],
      challenges: [
        {
          challenge:
            "Extensions rot quietly — APIs deprecate, the marketplace moves on, and 'it worked when I shipped it' is not documentation.",
          solution:
            "The planned review doubles as maintenance: verify against current VS Code APIs, then write the case study.",
        },
      ],
      status:
        "Experimental. Feature documentation is pending a repository review.",
      future: [
        "A complete, code-verified case study on this page",
        "Publication to the marketplace if the review justifies it",
      ],
    },
  },
  {
    slug: "location-mapper",
    name: "Location Mapper",
    tagline: "Interactive maps with open-source tooling.",
    summary:
      "An interactive mapping project exploring open-source mapping libraries — global navigation, location visualisation and what maps can communicate that lists never can.",
    category: "ai",
    status: "experimental",
    tech: ["TypeScript", "OpenStreetMap", "Mapping Libraries"],
    cover: "map",
    caseStudy: {
      overview: [
        "Location Mapper is an exploration of interactive maps as an interface medium. Using open-source mapping libraries and open map data, it covers the fundamentals of geographic visualisation: plotting locations, navigating globally, and rendering data in a spatial context.",
        "Maps are a distinct engineering discipline from typical UI work — tile rendering, projection, zoom-dependent detail, and interaction patterns that feel wrong if ported naively from non-spatial interfaces. The project exists to learn that discipline properly.",
      ],
      problem:
        "Location data is intuitive when mapped and opaque when listed. The problem is the gap between 'a table of coordinates' and 'an interface where space is legible' — projection, performance at different zooms, and interaction that respects how people actually read maps.",
      intendedUsers:
        "Anyone exploring what spatial presentation does for a dataset — the project itself being the current audience as much as any end user.",
      keyFeatures: [
        "Interactive mapping with global navigation",
        "Location visualisation over open map data",
        "Zoom-aware presentation of detail",
        "Open-source libraries throughout — no proprietary map dependencies",
      ],
      implementation: [
        "Built on open-source mapping libraries over open data (OpenStreetMap ecosystem), keeping every layer inspectable. The interesting work is in the data layer: converting ordinary lists into map-ready collections with sensible clustering and zoom behaviour.",
      ],
      challenges: [
        {
          challenge:
            "Performance degrades non-linearly with the number of rendered points, and the naive fix — always clustering — throws away the detail maps exist to show.",
          solution:
            "Zoom-dependent strategies: aggregate at low zoom, reveal detail as the viewport narrows, so density and detail trade off deliberately instead of accidentally.",
        },
      ],
      status: "Experimental — a working exploration rather than a product.",
      future: [
        "Richer data overlays and heat visualisation",
        "Route drawing and distance tooling",
      ],
    },
  },
  {
    slug: "terminal-chat",
    name: "Terminal Chat",
    tagline: "Chat where developers live: the terminal.",
    summary:
      "A terminal-based chat application concept — exploring what communication looks like when the interface is text, and what a TUI can do that a GUI quietly can't.",
    category: "ai",
    status: "concept",
    tech: ["Terminal UI", "WebSockets"],
    cover: "terminal",
    caseStudy: {
      overview: [
        "Terminal Chat is a concept for conversation without leaving the terminal. The premise is the developer's reality: the shell is already home, and a chat that lives there — keyboard-first, scriptable, composable with everything else — is a different product from a smaller web chat, not a lesser one.",
        "The interesting design space is what TUIs do uniquely well: density, speed, keyboard-native interaction, and integration with the pipeline idioms of the command line.",
      ],
      problem:
        "Chat applications pull context-switches: leave the terminal, enter a window, return. The concept asks whether lightweight, terminal-resident communication is viable for the cases that matter — quick questions, standing rooms, pair-debugging conversations.",
      intendedUsers:
        "Developers and operators who keep a terminal open the way others keep a browser open.",
      keyFeatures: [
        "Terminal-native chat interface",
        "Keyboard-first interaction throughout",
        "Multiple channels or conversations from one session",
        "Real-time messaging over WebSockets (planned transport)",
      ],
      implementation: [
        "As a concept, the architecture is deliberately minimal: a TUI client speaking to a relay service over WebSockets, with presence and history as the two server-side responsibilities. The TUI layer is the design centre — layout, scrollback and keyboard interaction decide whether the concept is credible.",
      ],
      challenges: [
        {
          challenge:
            "Terminal rendering varies wildly across emulators, fonts and platforms — a TUI that is beautiful in one is broken in another.",
          solution:
            "Targeting a conservative feature set of the TUI vocabulary and testing across the emulators that matter, rather than chasing pixel-perfect terminal art.",
        },
      ],
      status: "Concept.",
      future: [
        "A working relay and TUI prototype",
        "Integration with existing chat transports",
      ],
    },
  },
];
