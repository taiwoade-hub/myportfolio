import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  Cloud,
  Code2,
  Database,
  GraduationCap,
  Download,
  Lock,
  Plug,
  Server,
  Terminal,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Taiwo Adebola — a cybersecurity student and aspiring software engineer who learns by building: full-stack applications, security tooling, automation, and self-hosted infrastructure.",
  openGraph: { title: "About — Taiwo Adebola" },
};

const interests = [
  {
    icon: Code2,
    title: "Software engineering & full-stack development",
    body: "Applications end to end — data model, API, interface. The projects I keep returning to are document tools, planning systems and this website.",
  },
  {
    icon: Terminal,
    title: "Web & mobile application development",
    body: "Interfaces that respect the user's device and attention. Mobile-first layouts, honest loading states, and interactions that never block the task.",
  },
  {
    icon: Lock,
    title: "Cybersecurity & security research",
    body: "My field of study. I approach it as a builder — inspection tools and verification pipelines that teach me how systems expose themselves.",
  },
  {
    icon: Bot,
    title: "Artificial intelligence & machine learning",
    body: "Intelligence applied narrowly: bots that remember, agents with bounded actions, and automation that removes repetition without removing judgement.",
  },
  {
    icon: Cloud,
    title: "DevOps, cloud infrastructure & deployment",
    body: "Running real infrastructure myself — Coolify, Docker, PostgreSQL, Redis, EC2 over SSH. Deployment as practiced skill, not theory.",
  },
  {
    icon: Server,
    title: "Linux, open source & automation",
    body: "Linux as daily driver and lab. Open source as both toolchain and curriculum — reading other people's code is half the education.",
  },
  {
    icon: Plug,
    title: "APIs, bots, integrations & developer tooling",
    body: "The connective tissue of software — Telegram bots, GitHub integrations, CLI utilities, and the small tools that make daily work lighter.",
  },
  {
    icon: Database,
    title: "Data & systems thinking",
    body: "Ledgers over balances, evidence over verdicts, inventory before defence. How data is shaped decides what the system can honestly do.",
  },
];

const principles = [
  {
    title: "Build to understand",
    body: "I don't trust knowledge I can't reconstruct. Reading about DNS taught me less than one evening of broken records did.",
  },
  {
    title: "Say what it actually does",
    body: "Concept, in development, working — the labels matter. My portfolio keeps them distinct because credibility is the whole product.",
  },
  {
    title: "Boring is a feature",
    body: "Logs before restarts. One variable at a time. The unglamorous discipline is what keeps systems alive.",
  },
  {
    title: "Leave the judgements to humans",
    body: "Automation should absorb repetition, not responsibility. My bots report; my tools flag leads; the conclusions stay mine to make.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-16 max-w-2xl">
        <p className="label-mono text-accent-blue">About</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          A builder, a student, and an operator.
        </h1>
      </header>

      {/* Story */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Reveal>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              I&apos;m {site.name}, a cybersecurity student and aspiring
              software engineer based in {site.location}. The honest summary
              of what I do: I build things to understand them.
            </p>
            <p>
              That habit started with small scripts and utilities and grew
              into the collection you can see in{" "}
              <Link href="/projects" className="text-accent-blue underline-offset-4 hover:underline">
                my projects
              </Link>{" "}
              — a church service planner with a live document preview, a
              Telegram bot with memory, a fintech prototype built around a
              proper ledger, and a self-hosted deployment environment I
              operate and troubleshoot myself. None of it is decorative. Each
              project exists because I wanted to know how that kind of system
              actually works, and building it was the only honest way to find
              out.
            </p>
            <p>
              The thread connecting it all is a pull toward the layer beneath
              the layer — what the browser actually sends, what the proxy
              actually does with it, what the database actually records. My
              study of cybersecurity sharpened that instinct into a discipline:
              understand the system before you trust it, and describe the
              system accurately before you claim anything about it.
            </p>
            <p>
              I distinguish carefully between what I&apos;ve built and what
              I&apos;m becoming. I&apos;m not yet a professional engineer with
              years of production experience — I&apos;m a serious student of
              the craft with a growing portfolio of real, working projects and
              the discipline to label them accurately. What I can offer today
              is genuine curiosity, honest engineering, and the habit of
              finishing what I start.
            </p>
          </div>
        </Reveal>

        {/* Currently + CV panel */}
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <aside
              aria-label="Current focus"
              className="rounded-lg border border-border bg-card p-6"
            >
              <p className="label-mono flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                Currently
              </p>
              <ul className="mt-4 space-y-3.5 text-sm">
                {[
                  { k: "Studying", v: "Cybersecurity — web security, Linux, networking" },
                  { k: "Building", v: "Order of Service and Verify Hub" },
                  { k: "Operating", v: "Self-hosted infrastructure on Coolify" },
                  { k: "Reading", v: "Anything about systems design and web security" },
                ].map((row) => (
                  <li key={row.k} className="grid grid-cols-[92px_1fr] gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-blue">
                      {row.k}
                    </span>
                    <span className="leading-relaxed text-muted-foreground">{row.v}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="rounded-lg border border-border bg-card p-6">
              <p className="label-mono text-muted-foreground">Curriculum vitae</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A one-page PDF summary of my focus areas, projects and skills —
                the same content as this site, printable.
              </p>
              <a
                href={site.cvPath}
                download
                className="group mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-foreground/25 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
                <span className="font-mono text-[11px] text-muted-foreground/70">PDF</span>
              </a>
            </aside>
          </div>
        </Reveal>
      </div>

      {/* Interests */}
      <section className="mt-20" aria-labelledby="interests-heading">
        <h2 id="interests-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          What I&apos;m interested in
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Interests, not endorsements — each of these shows up in real
          projects, at varying stages of depth.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {interests.map((interest, i) => (
            <Reveal key={interest.title} delay={0.04 * (i % 2)}>
              <div className="h-full rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20">
                <interest.icon className="h-5 w-5 text-accent-blue" aria-hidden="true" />
                <h3 className="mt-3 text-[15px] font-medium leading-snug tracking-tight">
                  {interest.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {interest.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="mt-20" aria-labelledby="principles-heading">
        <h2 id="principles-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How I work
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={0.04 * (i % 2)}>
              <div className="h-full rounded-lg border border-border bg-card p-5">
                <p className="label-mono text-accent-blue">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-[15px] font-medium tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  );
}
