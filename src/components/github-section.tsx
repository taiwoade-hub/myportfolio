import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { languageColors, getRepositoriesUrl } from "@/lib/github";
import type { GitHubData } from "@/lib/github";
import { cn } from "@/lib/utils";
import { ArchitecturalSpotlightLayer } from "@/components/motion/architectural-spotlight";

/**
 * GitHub section — live data when the profile is configured, the locally
 * maintained catalogue otherwise. Live stats are shown only when they
 * come from the API; the fallback never fabricates numbers.
 */
export function GitHubSection({ data }: { data: GitHubData }) {
  const reposUrl = getRepositoriesUrl();
  const isLive = data.source === "live" && data.profile;
  const profile = data.profile;

  return (
    <section className="container-site py-20 md:py-28" aria-labelledby="github-heading">
      <SectionHeading
        index="04"
        label="GitHub"
        title={isLive ? "Open source & repositories" : "From my repositories"}
        description={
          isLive
            ? `Live from the GitHub API — public repositories I maintain, refreshed hourly and cached server-side.`
            : "A curated view of the repositories behind these projects, maintained locally in the portfolio catalogue."
        }
      />

      <Reveal>
        {isLive && profile ? (
          <div className="mb-8 flex flex-col gap-5 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={`${profile.login} avatar`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-border"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-muted font-mono text-lg font-semibold"
              >
                {profile.login.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-lg font-medium tracking-tight">
                  {profile.name ?? profile.login}
                </p>
                <a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[13px] text-muted-foreground transition-colors hover:text-accent-blue"
                >
                  @{profile.login}
                </a>
              </div>
              {profile.bio ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              ) : null}
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[12px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Public repositories</dt>
                  <dd>{profile.publicRepos} repositories</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">Followers</dt>
                  <dd>{profile.followers} followers</dd>
                </div>
                {profile.createdAt ? (
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Joined</dt>
                    <dd>since {new Date(profile.createdAt).getFullYear()}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
            {reposUrl ? (
              <a
                href={reposUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-foreground/25 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Explore all repositories
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </a>
            ) : null}
          </div>
        ) : null}

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.repos.map((repo) => {
            const languageColor = repo.language
              ? (languageColors[repo.language] ?? "currentColor")
              : null;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate font-mono text-[14px] font-medium text-foreground transition-colors group-hover:text-accent-blue">
                    {repo.name}
                  </p>
                  {repo.source === "live" ? (
                    <span className="flex shrink-0 items-center gap-3 font-mono text-[12px] text-muted-foreground">
                      <span className="flex items-center gap-1" title="Stars">
                        <Star className="h-3 w-3" aria-hidden="true" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1" title="Forks">
                        <GitFork className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </span>
                  ) : null}
                </div>
                {repo.description ? (
                  <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-muted-foreground">
                    {repo.description}
                  </p>
                ) : (
                  <p className="mt-1.5 min-h-[2.5rem] text-[13px] italic text-muted-foreground/60">
                    No description
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4 font-mono text-[12px] text-muted-foreground">
                  {repo.language ? (
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className="inline-block h-[7px] w-[7px] rounded-full"
                        style={{ backgroundColor: languageColor ?? "currentColor" }}
                      />
                      {repo.language}
                    </span>
                  ) : null}
                  {repo.archived ? (
                    <span className="text-muted-foreground/70">Archived</span>
                  ) : null}
                  {repo.updatedAt ? (
                    <span>Updated {formatRelative(repo.updatedAt)}</span>
                  ) : null}
                </div>
              </>
            );

            return (
              <li key={`${repo.source}-${repo.name}`}>
                {repo.source === "live" && repo.url ? (
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-spotlight-card
                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ArchitecturalSpotlightLayer />
                    {inner}
                  </a>
                ) : (
                  <div
                    data-spotlight-card
                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5"
                  >
                    <ArchitecturalSpotlightLayer />
                    {inner}
                    <Link
                      href="/projects"
                      className="label-mono mt-3 text-muted-foreground/70 transition-colors hover:text-accent-blue"
                    >
                      See case study →
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!isLive ? (
          <p className="mt-6 text-sm text-muted-foreground/70">
            The live GitHub feed activates when the profile is configured on
            the server — the catalogue above is maintained by hand in the
            meantime.{" "}
            <Link
              href="/projects"
              className={cn("text-accent-blue underline-offset-4 hover:underline")}
            >
              Browse the full project catalogue
            </Link>
            .
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const now = Date.now();
  const diffDays = Math.floor((now - date.getTime()) / 86_400_000);
  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
