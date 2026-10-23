import type { Metadata } from "next";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { StatusBadge } from "@/components/badges";
import { projects, statusMeta } from "@/lib/projects";
import type { ProjectStatus } from "@/lib/project-types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The full project catalogue — software, security tooling, bots, infrastructure practice and trading technology, each with an honest status and a full case study.",
  openGraph: {
    title: "Projects — Taiwo Adebola",
    description:
      "The full project catalogue with honest statuses and case studies.",
  },
};

const statusOrder: ProjectStatus[] = [
  "active",
  "in-development",
  "experimental",
  "concept",
  "ongoing",
];

export default function ProjectsPage() {
  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="label-mono text-accent-blue">Catalogue</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Everything I&apos;m building, labelled honestly.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          {projects.length} projects across five disciplines. Some are
          concepts, some are in development, a few are running — and two are
          deliberately left as placeholders until I re-read their source and
          write what they actually do. Every card opens a full case study.
        </p>
      </header>

      {/* Status legend — the honesty key */}
      <aside
        aria-label="Status legend"
        className="mb-10 rounded-lg border border-border bg-card p-5"
      >
        <p className="label-mono mb-4 text-muted-foreground">Status key</p>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {statusOrder.map((status) => (
            <div key={status} className="flex items-baseline gap-3">
              <dt className="shrink-0">
                <StatusBadge status={status} />
              </dt>
              <dd className="text-[13px] leading-relaxed text-muted-foreground">
                {statusMeta[status].hint}
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <ProjectsExplorer projects={projects} />
    </div>
  );
}
