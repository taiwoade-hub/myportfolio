/**
 * Articles — structured TypeScript content.
 *
 * The blog is deliberately small and maintainable: every article is data
 * in this file, rendered by one shared page template. No CMS, no build
 * magic, no unfinished machinery — if I can't maintain it, I don't ship it.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string };

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date
  tags: string[];
  minutes: number; // honest reading-time estimate
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "notes-from-self-hosting",
    title: "Notes from self-hosting my own infrastructure",
    description:
      "What running Coolify, Docker, PostgreSQL and DNS by hand teaches that managed platforms never will — a field report from my own deployment practice.",
    date: "2026-10-18",
    tags: ["DevOps", "Self-hosting", "Linux"],
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "There is a moment every self-hoster knows. You type the domain into the browser, the page fails to load, and you realise the cause could live in any one of five places: the registrar, the DNS resolver, the proxy, the container, or the application itself. Nothing tells you which. That moment — more than any feature — is why I self-host.",
      },
      {
        type: "p",
        text: "I run my own deployment environment on an Ubuntu host with Coolify: applications deploy from GitHub repositories into containers, a proxy layer terminates TLS and routes my configured domains, and PostgreSQL and Redis back the services that need them. It is not a production platform serving customers under an SLA. It is a personal workbench, and it has quietly reorganised how I think about software.",
      },
      { type: "h2", text: "Managed platforms teach you the abstraction" },
      {
        type: "p",
        text: "I do not think managed platforms are bad — they are often the right engineering decision. But they teach you their interface, not the system underneath. Push to deploy, and a hundred deliberate decisions happen on your behalf: which ports open, how TLS is renewed, where logs land, what happens when a container dies at 3am. You learn the button. You do not learn the machine.",
      },
      {
        type: "p",
        text: "Operating the stack myself forced the questions into the open. When a deployment fails behind a proxy, the 502 you see is a symptom, never the cause. The cause is one layer deeper — in the container's exit logs, or the proxy's error log, or the application's own stdout. Nobody surfaces this for you. You develop a reading habit: container logs, then proxy logs, then application logs, in that order, every time.",
      },
      { type: "h2", text: "DNS is where patience is manufactured" },
      {
        type: "p",
        text: "My hardest-won lesson had nothing to do with containers. DNS records propagate asynchronously, resolvers cache aggressively, and 'it works for me' is a meaningless sentence in a world where different resolvers hold different opinions about your domain. Early on, I reconfigured a perfectly correct setup out of impatience, breaking something that was quietly on its way to working.",
      },
      {
        type: "p",
        text: "Now I follow a fixed diagnostic order — registrar first, then resolver caches, then direct DNS queries, then the proxy — and I wait before changing anything. Boring discipline beats clever debugging. The DNS zone that resolves eventually and the one you broke in a hurry look identical from the outside.",
      },
      {
        type: "quote",
        text: "Logs before restarts. One variable at a time. Boring is a feature you install in yourself.",
      },
      { type: "h2", text: "The habits transfer everywhere" },
      {
        type: "p",
        text: "What surprised me most is how portable the discipline turned out to be. The habit of reading logs in sequence is the same skill as reading a stack trace properly. The instinct to change one variable at a time is the same instinct that makes debugging scientific instead of superstitious. The reflex to verify each layer — locally, then through the firewall, then from outside — is just the scientific method wearing an operations uniform.",
      },
      {
        type: "ul",
        items: [
          "Logs before restarts — a restart destroys the evidence you need.",
          "One variable at a time — two changes teach you nothing about either.",
          "Verify layer by layer — every failing layer will announce itself if you ask in order.",
          "Backups you haven't restored are superstition, not safety.",
        ],
      },
      { type: "h2", text: "Would I recommend it?" },
      {
        type: "p",
        text: "If you are a student of systems — of how the web actually delivers a request from a URL to a process and back — self-hosting is the most honest education available. You will lose evenings to DNS. You will learn what a reverse proxy actually does because you configured its routing yourself. And the first time a service you deployed stays up for a month, quietly serving requests through infrastructure you understand end-to-end, something clicks that no tutorial can manufacture.",
      },
      {
        type: "p",
        text: "Start small: one host, one service, one domain. Add PostgreSQL when something needs it, Redis when something needs that. Let the infrastructure be pulled into existence by real projects rather than pushed into shape by enthusiasm. That is how mine grew, and it is the only way I would recommend growing one.",
      },
    ],
  },
  {
    slug: "what-telegram-bots-taught-me",
    title: "What building Telegram bots taught me about software design",
    description:
      "Long-running processes, state that must survive restarts, and interfaces measured in messages — lessons from building Miro, my Python and aiogram bot with memory and music.",
    date: "2026-10-08",
    tags: ["Python", "aiogram", "Bots", "Software Design"],
    minutes: 6,
    blocks: [
      {
        type: "p",
        text: "Most software I build starts, runs, and stops within a request. A Telegram bot does not. It is a process that must stay alive for weeks, remember who it talked to, respond to a dozen people at once, and fail without ever appearing to fail. Building Miro — a Python and aiogram bot with conversational AI, music features, memory and admin commands — taught me more about software design than any course on the subject.",
      },
      { type: "h2", text: "The worst failure mode is silence" },
      {
        type: "p",
        text: "A web app that crashes shows an error page. A bot that crashes simply stops talking. From the outside, a dead bot and an ignored bot are indistinguishable — the failure is invisible unless you are watching the process. This changes what you optimise for. Uptime is not a metric on a dashboard; it is the bot's entire personality. A bot that vanishes twice a week is not a bot with an availability problem, it is a bot people stop talking to.",
      },
      {
        type: "p",
        text: "The answer is boring and absolute: every handler gets an error boundary, every background task is supervised, and the process is run under something that restarts it when it dies. None of this is clever. All of it is load-bearing.",
      },
      { type: "h2", text: "State is a design decision, not an accident" },
      {
        type: "p",
        text: "A bot accumulates state whether you plan for it or not: which users exist, what they asked for, what the bot was in the middle of doing when a restart happened. My early versions held conversational context in memory, which meant every deploy quietly amputated every ongoing conversation. The lesson was structural: state that matters belongs in storage, and in-memory state is a cache with an attitude problem.",
      },
      {
        type: "p",
        text: "Miro now keeps its memory in SQLite, keyed per user and per chat, with retention rules per memory type. It remembers what serves the conversation — names, preferences, running jokes — and deliberately forgets the rest. Memory design is a product decision wearing a database hat.",
      },
      {
        type: "code",
        lang: "text",
        code: "what memory teaches you:\n\n  everything remembered = expensive + creepy\n  nothing remembered    = vending machine\n  purposeful memory     = a bot that knows you",
      },
      { type: "h2", text: "The message is the interface" },
      {
        type: "p",
        text: "Chat imposes a brutal constraint: your entire interface is text, delivered in the order you send it, with no layout, no hover states and no undo. That constraint is clarifying. There is nowhere to hide a badly designed flow behind a nice screen. If your bot asks for five pieces of information, users feel every one of them.",
      },
      {
        type: "p",
        text: "The discipline I arrived at: short messages, one idea each, and commands that do one thing. Telegram's formatting is a gift here — a little monospace and a couple of line breaks do more for readability than any amount of words. And an AI-backed bot needs the same restraint: bounded reply lengths, a clear sense of when it is being addressed, and graceful fallback when the AI backend is slow. A bot that posts a paragraph every time it is mentioned is a bot that gets muted.",
      },
      { type: "h2", text: "Personality is engineering" },
      {
        type: "p",
        text: "The temptation with an AI bot is to make it say clever things. The work is making it say things consistently. A personality that drifts between responses feels broken in a way users can name but not diagnose. Consistency of tone, predictable boundaries on length, reliable behaviour when commands collide — these are engineering constraints, and they are what makes a bot feel like a character rather than a random process with a profile picture.",
      },
      {
        type: "p",
        text: "I keep Miro experimental and hobby-scale, and I describe it that way, because that is what it is. But the lessons scale far past hobbies: design for the worst failure mode, treat state as architecture, respect the interface's constraints, and be consistent on purpose. Every service I have built since — including this website's contact pipeline — is more reliable for them.",
      },
    ],
  },
  {
    slug: "learning-security-by-building",
    title: "Learning web security by building inspection tools",
    description:
      "Reading about the OWASP Top 10 is a map, not a journey. How building verification and inspection tools — scoped honestly — is teaching me web security from the evidence outward.",
    date: "2026-09-27",
    tags: ["Cybersecurity", "Web", "Learning"],
    minutes: 5,
    blocks: [
      {
        type: "p",
        text: "Security is the field where reading the most and understanding the least is easiest. I can recite the OWASP Top 10, name the vulnerability classes, and still not be able to look at a live website and tell you anything true about its exposure. That gap — between vocabulary and perception — is the actual problem a security student has to solve.",
      },
      {
        type: "p",
        text: "My answer has been to build tools that force me to look. Two projects carry most of that weight: Verify Hub, which checks whether websites are up, rendering correctly and configured sanely; and a web-intelligence concept that examines what sites expose about themselves. Neither is a security scanner. Both are instruments for learning to see.",
      },
      { type: "h2", text: "The map is not the territory" },
      {
        type: "p",
        text: "Reading about SQL injection is a map. Noticing that an error page leaks a stack trace with a framework version, forming a hypothesis about what that enables, and checking it carefully — that is the territory. Building inspection tools moved me from the first activity to the second, because a tool has to answer real questions with real evidence or it produces nothing at all.",
      },
      {
        type: "p",
        text: "So the web-intelligence concept is built around evidence chains: every finding carries the observation behind it and a confidence framing. Nothing is reported that cannot show its source. That constraint is partly honesty and partly pedagogy — when your tool refuses to overstate, you inherit the habit.",
      },
      {
        type: "quote",
        text: "Every finding is a lead, not a verdict. The moment your tool claims certainty it doesn't have, you have taught yourself to stop thinking.",
      },
      { type: "h2", text: "Scoping is a security skill" },
      {
        type: "p",
        text: "The most important security engineering I have done is deciding what my tools will not do. Verify Hub checks availability, rendering and configuration — and its documentation says so, plainly, because a verification tool that implies it is a comprehensive security scanner is itself a security problem. It would produce false confidence, which is a vulnerability in the operator, not the target.",
      },
      {
        type: "ul",
        items: [
          "Test only what you are authorised to test — authorisation is not a formality, it is the boundary of the work.",
          "Report what was checked, not what was implied — scope belongs in the report, not the README alone.",
          "Flag potential issues as leads for human review — 'potential' must mean 'unconfirmed' or it means nothing.",
          "Prefer observability to exploitation — seeing the mechanism is the skill; damaging nothing is the discipline.",
        ],
      },
      { type: "h2", text: "What I would tell another student" },
      {
        type: "p",
        text: "Build the small, honest version of the tool you wish existed. A link checker that reports a screenshot and three facts about a page's configuration, built properly, will teach you more than a grand plan for a scanner you will never finish. You will meet HTTP headers as things with consequences, browser automation as an evidence-collection discipline, and error pages as objects of genuine interest.",
      },
      {
        type: "p",
        text: "And hold the line on language. Security is a field where overstatement is easy and consequences are real. Say what you checked. Say what you found. Leave the certainty to the evidence. That discipline — more than any tool or technique — is the foundation the rest of security gets built on.",
      },
    ],
  },
];

export function getArticles(): Article[] {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getAdjacentArticles(slug: string): {
  prev: Article | undefined;
  next: Article | undefined;
} {
  const sorted = getArticles();
  const index = sorted.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}
