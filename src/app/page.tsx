import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { GitHubSection } from "@/components/github-section";
import { ArticleRow } from "@/components/article-row";
import { ArchitecturalSpotlightLayer } from "@/components/motion/architectural-spotlight";
import { WaterCursorSchool } from "@/components/motion/water-cursor-school";
import { getGitHubData } from "@/lib/github";
import {
  getLiveSiteSettings,
  getLiveUiConfig,
  getLiveFeaturedProjects,
  getLiveArticles,
  getLiveStackGroups,
} from "@/lib/dynamic-data";

export default async function HomePage() {
  const [siteSettings, uiConfig, featured, articlesList, stackGroupsList, github] =
    await Promise.all([
      getLiveSiteSettings(),
      getLiveUiConfig(),
      getLiveFeaturedProjects(),
      getLiveArticles(),
      getLiveStackGroups(),
      getGitHubData(),
    ]);

  const social = {
    github: siteSettings.githubUsername ? `https://github.com/${siteSettings.githubUsername}` : null,
    linkedin: siteSettings.linkedinUrl || null,
    email: siteSettings.contactEmail || null,
  };
  const availability = uiConfig.showAvailability ? siteSettings.availableFor : null;
  const articles = articlesList.slice(0, 3);

  return (
    <div className="relative">
      <WaterCursorSchool />
      <div className="relative z-10">
      <Hero
        social={social}
        availability={availability}
        cvPath={siteSettings.cvPath}
        name={siteSettings.name}
        headline={siteSettings.headline}
        intro={siteSettings.intro}
        roles={siteSettings.roles}
        heroVariant={uiConfig.heroVariant}
      />

      {/* ── Selected work ─────────────────────────────────────── */}
      <section className="container-site py-20 md:py-28" aria-labelledby="work-heading">
        <SectionHeading
          index="01"
          label="Selected Work"
          title="Projects I'm building — and a few I'm still designing."
          description="Projects that show the range: document tooling, verification pipelines, bots, infrastructure practice and market analysis. Every entry carries an honest status label."
          action={{ href: "/projects", label: "All projects" }}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={0.06 * (i % 2)}
              label={`WORK_0${i + 1}`}
            >
              <ProjectCard project={project} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── About teaser ──────────────────────────────────────── */}
      <section className="border-t border-border bg-card/40" aria-labelledby="about-heading">
        <div className="container-site grid grid-cols-1 gap-12 py-20 md:py-28 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              index="02"
              label="About"
              title="A builder who wants to know how things work."
              action={{ href: "/about", label: "More about me" }}
              className="mb-8"
            />
            <Reveal label="ABOUT_COPY">
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  I&apos;m {siteSettings.name} — a cybersecurity student and aspiring
                  software engineer from {siteSettings.location}. My work moves between
                  building applications, exploring how systems fail, and
                  running the infrastructure software depends on.
                </p>
                <p>
                  I learn by building. That means a church service planner with
                  a live document preview, a Telegram bot that remembers its
                  people, a verification pipeline that reports where teams
                  already work, and a self-hosted deployment environment I
                  operate and troubleshoot myself.
                </p>
                <p>
                  I care about the difference between{" "}
                  <span className="text-foreground">concept</span>,{" "}
                  <span className="text-foreground">in development</span> and{" "}
                  <span className="text-foreground">working</span> — this
                  portfolio labels all three honestly, because engineering
                  credibility starts with accurate claims.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.08} label="FOCUS_PANEL">
            <aside
              aria-label="Current focus"
              className="h-fit rounded-lg border border-border bg-card p-6"
            >
              <p className="label-mono text-muted-foreground">Currently</p>
              <ul className="mt-4 space-y-3.5">
                {[
                  { k: "Studying", v: "Cybersecurity — web security fundamentals, Linux, networking" },
                  { k: "Building", v: "Order of Service, this portfolio, and automated verification tools" },
                  { k: "Operating", v: "A self-hosted environment — Coolify, Docker, PostgreSQL, Redis" },
                  { k: "Exploring", v: "AI agents, market-structure analysis, and developer tooling" },
                ].map((row) => (
                  <li key={row.k} className="grid grid-cols-[92px_1fr] gap-3 text-sm">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent-blue">
                      {row.k}
                    </span>
                    <span className="leading-relaxed text-muted-foreground">{row.v}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ── Stack teaser ──────────────────────────────────────── */}
      {uiConfig.showStack && (
        <section className="container-site py-20 md:py-28" aria-labelledby="stack-heading">
          <SectionHeading
            index="03"
            label="Tech Stack"
            title="Tools I reach for, grouped by discipline."
            description="Core, working and exploring — an honest vocabulary instead of skill bars. Each entry reflects what my repositories and practice actually show."
            action={{ href: "/stack", label: "Full stack" }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stackGroupsList.slice(0, 6).map((group, i) => (
              <Reveal
                key={group.id}
                delay={0.05 * (i % 3)}
                label={`STACK_0${i + 1}`}
              >
                <Link
                  href="/stack"
                  data-spotlight-card
                  className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <ArchitecturalSpotlightLayer />
                  <p className="label-mono text-muted-foreground">{group.title}</p>
                  <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[13px] text-foreground/80">
                    {group.items.slice(0, 4).map((item) => (
                      <span key={item.name}>{item.name}</span>
                    ))}
                    {group.items.length > 4 ? (
                      <span className="text-muted-foreground/60">
                        +{group.items.length - 4}
                      </span>
                    ) : null}
                  </p>
                  <span className="label-mono mt-4 inline-flex items-center gap-1 text-muted-foreground/60 transition-colors group-hover:text-accent-blue">
                    Details
                    <ArrowRight
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── GitHub ────────────────────────────────────────────── */}
      {uiConfig.showGitHubStats && (
        <div className="border-t border-border bg-card/40">
          <GitHubSection data={github} />
        </div>
      )}

      {/* ── Writing ───────────────────────────────────────────── */}
      {uiConfig.showBlog && (
        <section className="container-site py-20 md:py-28" aria-labelledby="writing-heading">
          <SectionHeading
            index="05"
            label="Writing"
            title="Notes from the work."
            description="Field reports from building things — self-hosting, bot engineering, and learning security by constructing instruments."
            action={{ href: "/blog", label: "All writing" }}
          />
          <Reveal label="WRITING_LIST">
            <ul className="border-t border-border">
              {articles.map((article) => (
                <ArticleRow key={article.slug} article={article} />
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* ── Contact CTA ───────────────────────────────────────── */}
      <section className="border-t border-border bg-card/40" aria-labelledby="cta-heading">
        <div className="container-site flex flex-col items-start py-20 md:py-28 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-xl" label="CTA_PROMPT">
            <p className="label-mono text-accent-blue">Next step</p>
            <h2 id="cta-heading" className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              If any of this is interesting, let&apos;s talk.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              I&apos;m open to discussing projects, engineering opportunities,
              collaborations — or just comparing notes on self-hosting and
              bots. The contact form reaches a real inbox pipeline, and I reply
              to every genuine message.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-8 lg:mt-0" label="CTA_ACTION">
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
            >
              Get In Touch
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>
      </div>
    </div>
  );
}
