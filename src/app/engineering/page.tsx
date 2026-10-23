import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Bug,
  Cloud,
  Database,
  Globe,
  Layers,
  Lock,
  Plug,
  Terminal,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { InfraDiagram } from "@/components/infra-diagram";

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "How I work beyond the interface — architecture, APIs, databases, Linux, containerization, DNS, troubleshooting and security-conscious development, each connected to a real project.",
  openGraph: { title: "Engineering — Taiwo Adebola" },
};

interface Capability {
  icon: typeof Layers;
  title: string;
  body: string;
  projects: { label: string; href: string }[];
}

const capabilities: Capability[] = [
  {
    icon: Layers,
    title: "Application architecture",
    body: "Structure before surface: typed document models, state machines for flows, and features composed as projections of one data model. I design the shape of the data first and let the interface follow.",
    projects: [
      { label: "Order of Service", href: "/projects/order-of-service" },
      { label: "Developer Portfolio", href: "/projects/developer-portfolio" },
    ],
  },
  {
    icon: Plug,
    title: "API design & integration",
    body: "Resource modelling, honest status codes, and boundaries that don't leak internals. On the consuming side: provider adapters, retries with backoff, and failure paths designed as carefully as the happy path.",
    projects: [
      { label: "Verify Hub", href: "/projects/verify-hub" },
      { label: "Media Storage API", href: "/projects/media-storage-api" },
      { label: "Miro", href: "/projects/miro" },
    ],
  },
  {
    icon: Database,
    title: "Database design & data management",
    body: "Ledgers over balances, evidence over verdicts. Schema-first thinking: what the database records decides what the system can honestly claim, so I spend real time on that layer before writing interfaces.",
    projects: [
      { label: "Terrific Bank", href: "/projects/terrific-bank" },
      { label: "DataGuard", href: "/projects/dataguard" },
    ],
  },
  {
    icon: Terminal,
    title: "Linux development environments",
    body: "Linux as daily driver and lab — users, permissions, processes, logs, and the shell habits that make remote operation feel local. My bots, tools and servers all live here first.",
    projects: [
      { label: "Self-Hosted Infrastructure", href: "/projects/self-hosted-infrastructure" },
      { label: "Desktop Voice AI", href: "/projects/desktop-voice-ai" },
    ],
  },
  {
    icon: Boxes,
    title: "Containerization & deployment",
    body: "Docker for isolation, Coolify for orchestration: applications deploy from GitHub into containers behind a managed proxy, with environment configuration kept out of application code.",
    projects: [
      { label: "Coolify Deployment", href: "/projects/coolify-deployment" },
      { label: "Media Storage API", href: "/projects/media-storage-api" },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud server management",
    body: "Ubuntu instances on AWS EC2, operated over key-based SSH. Every open port is a decision; every change is verified layer by layer — locally, through the security group, then from outside.",
    projects: [{ label: "AWS EC2 Deployment", href: "/projects/aws-ec2-deployment" }],
  },
  {
    icon: Globe,
    title: "Domain & DNS configuration",
    body: "Registrars, records, resolvers and propagation — configured by hand and debugged in a fixed order, because DNS is where impatience goes to break things that were quietly working.",
    projects: [{ label: "Coolify Deployment", href: "/projects/coolify-deployment" }],
  },
  {
    icon: Bug,
    title: "Troubleshooting & debugging",
    body: "Logs before restarts; one variable at a time; a fixed diagnostic order from DNS to proxy to container to application. The skill I practice most, because infrastructure teaches it daily.",
    projects: [
      { label: "Coolify Deployment", href: "/projects/coolify-deployment" },
      { label: "AWS EC2 Deployment", href: "/projects/aws-ec2-deployment" },
    ],
  },
  {
    icon: Lock,
    title: "Security-conscious development",
    body: "Validation at the boundary, least exposure by default, and reports that never overstate scope. My security study and my build practice reinforce each other — the contact form on this site is spam-protected for the same reason my inspection tools don't over-claim.",
    projects: [
      { label: "Verify Hub", href: "/projects/verify-hub" },
      { label: "Web Intelligence Platform", href: "/projects/web-intelligence-platform" },
    ],
  },
  {
    icon: ArrowRight,
    title: "Automation & operational tooling",
    body: "Scripts and bots that absorb repetition without absorbing responsibility: link pipelines, tunnel utilities, notification providers, and CLIs that make capable engines pleasant to drive.",
    projects: [
      { label: "LinkLens", href: "/projects/linklens" },
      { label: "Tunnel Sharing Utility", href: "/projects/tunnel-sharing-utility" },
      { label: "Alchemist", href: "/projects/alchemist" },
    ],
  },
];

export default function EngineeringPage() {
  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-16 max-w-2xl">
        <p className="label-mono text-accent-blue">Engineering</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          The work that happens before the interface.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Anyone can list technologies. This page is about the connective
          tissue — how systems are shaped, deployed, debugged and secured —
          and each capability is connected to projects where it&apos;s
          actually exercised. No fictional pipelines, no claims of stacks I
          haven&apos;t run.
        </p>
      </header>

      {/* Capabilities */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {capabilities.map((cap, i) => (
          <Reveal key={cap.title} delay={0.04 * (i % 2)}>
            <article className="flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20">
              <cap.icon className="h-5 w-5 text-accent-blue" aria-hidden="true" />
              <h2 className="mt-3 text-[17px] font-medium tracking-tight">{cap.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {cap.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                {cap.projects.map((p) => (
                  <li key={p.href + p.label}>
                    <Link
                      href={p.href}
                      className="label-mono inline-flex items-center gap-1 text-muted-foreground/70 transition-colors hover:text-accent-blue"
                    >
                      {p.label}
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Infrastructure diagram */}
      <section className="mt-20" aria-labelledby="infra-heading">
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <p className="label-mono text-muted-foreground">The environment</p>
            <h2 id="infra-heading" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              The stack I run, end to end.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              A simplified map of my self-hosted environment: deploys flow
              from GitHub through Coolify on an Ubuntu host; requests arrive
              through a reverse proxy into application containers backed by
              PostgreSQL and Redis; I operate the whole thing over SSH, and a
              Cloudflare Tunnel exposes local work when something needs
              sharing. Drawn from practice — the documented deployments, not
              an aspirational architecture.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <figure className="rounded-lg border border-border bg-card p-6 md:p-10">
            <InfraDiagram />
            <figcaption className="mt-6 border-t border-border pt-4 text-center font-mono text-[11px] tracking-wide text-muted-foreground/60">
              Self-hosted development infrastructure — operated and
              troubleshooted by hand.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal className="mt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            What this diagram deliberately doesn&apos;t show: CI pipelines I
            haven&apos;t built, monitoring I haven&apos;t wired, or redundancy
            I don&apos;t run. Those are on the{" "}
            <Link
              href="/projects/coolify-deployment"
              className="text-accent-blue underline-offset-4 hover:underline"
            >
              infrastructure roadmap
            </Link>
            . The projects page keeps the record honest about what exists
            today.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
