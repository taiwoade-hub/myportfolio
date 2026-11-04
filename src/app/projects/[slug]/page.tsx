import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Globe } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { Reveal } from "@/components/reveal";
import { StatusBadge, TechChip } from "@/components/badges";
import { getAdjacentProjects, getCategoryMeta, getProject, getProjectSlugs, statusMeta } from "@/lib/projects";
import { getLiveProject } from "@/lib/dynamic-data";
import { getRepoUrl } from "@/lib/github";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getLiveProject(slug)) || getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.name} — Case Study`,
    description: project.summary,
    openGraph: {
      title: `${project.name} — Taiwo Adebola`,
      description: project.summary,
      url: `${getSiteUrl()}/projects/${project.slug}`,
      type: "article",
    },
  };
}

function CaseSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      <h2 className="label-mono flex items-center gap-3 text-muted-foreground">
        <span className="text-accent-blue">{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-border" />
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = (await getLiveProject(slug)) || getProject(slug);
  if (!project) notFound();

  const category = getCategoryMeta(project.category);
  const { prev, next } = getAdjacentProjects(project.slug);
  const repoUrl = getRepoUrl(project.repo);
  const { caseStudy } = project;

  return (
    <article className="container-site py-14 md:py-20">
      {/* Breadcrumb */}
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        />
        All projects
      </Link>

      {/* Header */}
      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {category ? (
            <span className="label-mono text-muted-foreground">{category.label}</span>
          ) : null}
          <StatusBadge status={project.status} />
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {project.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {project.tagline}
        </p>

        {/* Links — only what can be verified */}
        {(repoUrl || project.liveUrl) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {repoUrl ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View source
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              </a>
            ) : null}
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium transition-all duration-200 hover:border-foreground/25 hover:bg-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                Live demo
              </Link>
            ) : null}
          </div>
        )}

        {project.statusNote ? (
          <p className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Note —</span>{" "}
            {project.statusNote}. This page stays deliberately minimal rather
            than describing functionality that hasn&apos;t been verified
            against the source.
          </p>
        ) : null}
      </header>

      {/* Cover */}
      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
          <div className="aspect-[16/8] w-full sm:aspect-[21/9]">
            <CoverArt variant={project.cover} name={project.name} />
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-[11px] tracking-wide text-muted-foreground/60">
          Designed cover artwork — not a product screenshot. This portfolio
          doesn&apos;t fabricate imagery.
        </p>
      </Reveal>

      {/* Body */}
      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div className="min-w-0 space-y-12">
          <Reveal>
            <CaseSection index="01" title="Overview">
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {caseStudy.overview.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </CaseSection>
          </Reveal>

          <Reveal>
            <CaseSection index="02" title="The problem">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {caseStudy.problem}
              </p>
            </CaseSection>
          </Reveal>

          <Reveal>
            <CaseSection index="03" title="Intended users">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {caseStudy.intendedUsers}
              </p>
            </CaseSection>
          </Reveal>

          <Reveal>
            <CaseSection index="04" title="Key features">
              <ul className="space-y-3">
                {caseStudy.keyFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-4 text-[15px] leading-relaxed">
                    <span className="mt-1.5 font-mono text-[11px] tracking-wider text-accent-blue">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CaseSection>
          </Reveal>

          <Reveal>
            <CaseSection index="05" title="Implementation">
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                {caseStudy.implementation.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <TechChip key={t} label={t} />
                ))}
              </div>
            </CaseSection>
          </Reveal>

          {caseStudy.challenges.length > 0 ? (
            <Reveal>
              <CaseSection index="06" title="Engineering challenges">
                <ul className="space-y-4">
                  {caseStudy.challenges.map((c, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-[110px_minmax(0,1fr)]"
                    >
                      <div>
                        <p className="label-mono text-muted-foreground">Challenge</p>
                        <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">
                          {c.challenge}
                        </p>
                      </div>
                      <div className="sm:border-l sm:border-border sm:pl-4">
                        <p className="label-mono text-accent-blue">Approach</p>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                          {c.solution}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            </Reveal>
          ) : null}

          <Reveal>
            <CaseSection index="07" title="Current status">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                <span className="mr-2 inline-flex items-center rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] tracking-wide text-foreground">
                  {statusMeta[project.status].label}
                </span>
                {caseStudy.status}
              </p>
            </CaseSection>
          </Reveal>

          <Reveal>
            <CaseSection index="08" title="What's next">
              <ul className="space-y-2.5">
                {caseStudy.future.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 rounded-full bg-accent-blue/60" />
                    {f}
                  </li>
                ))}
              </ul>
            </CaseSection>
          </Reveal>
        </div>

        {/* Aside */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="label-mono text-muted-foreground">Project file</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="label-mono mb-2 text-muted-foreground/60">Status</dt>
                <dd className="text-foreground">
                  <StatusBadge status={project.status} />
                </dd>
              </div>
              <div>
                <dt className="label-mono mb-2 text-muted-foreground/60">Category</dt>
                <dd className="text-muted-foreground">{category?.label}</dd>
              </div>
              <div>
                <dt className="label-mono mb-2 text-muted-foreground/60">Technologies</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <TechChip key={t} label={t} />
                  ))}
                </dd>
              </div>
              <div>
                <dt className="label-mono mb-2 text-muted-foreground/60">Links</dt>
                <dd className="flex flex-col gap-2">
                  {repoUrl ? (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent-blue"
                    >
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      Source code
                    </a>
                  ) : null}
                  {project.liveUrl ? (
                    <Link
                      href={project.liveUrl}
                      className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-accent-blue"
                    >
                      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                      Live demo
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground/50">
                      <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                      No verified live deployment
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 px-1 text-xs leading-relaxed text-muted-foreground/60">
            This case study is generated from a maintained project catalogue
            and reviewed by hand. Details change as the work changes.
          </p>
        </aside>
      </div>

      {/* Prev / next */}
      <nav
        aria-label="Project navigation"
        className="mt-20 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="label-mono block text-muted-foreground/60">Previous</span>
              <span className="mt-1 block truncate text-sm font-medium transition-colors group-hover:text-accent-blue">
                {prev.name}
              </span>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex flex-row-reverse items-center gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:col-start-2"
          >
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="label-mono block text-muted-foreground/60">Next</span>
              <span className="mt-1 block truncate text-sm font-medium transition-colors group-hover:text-accent-blue">
                {next.name}
              </span>
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
