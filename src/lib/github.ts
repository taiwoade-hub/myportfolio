import { getGitHubUsername } from "@/lib/site";
import { projects } from "@/lib/projects";

/**
 * Server-side GitHub integration.
 *
 * - Reads the configured username from GITHUB_USERNAME (never hardcoded,
 *   never invented).
 * - Requests are cached for an hour via Next.js fetch revalidation.
 * - Any failure — no configuration, rate limits, network errors — falls
 *   back to the locally maintained project catalogue, so pages never
 *   break because an API did.
 * - No tokens or secrets are used or exposed; the public API needs none.
 */

const REVALIDATE_SECONDS = 3600;

export interface GitHubRepoView {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  updatedAt: string | null;
  archived: boolean;
  topics: string[];
  /** Which side of the fallback boundary this view came from. */
  source: "live" | "fallback";
}

export interface GitHubProfileView {
  login: string;
  name: string | null;
  bio: string | null;
  url: string;
  avatarUrl: string | null;
  publicRepos: number;
  followers: number;
  createdAt: string | null;
}

export interface GitHubData {
  configured: boolean;
  source: "live" | "fallback";
  profile: GitHubProfileView | null;
  repos: GitHubRepoView[];
}

interface GHUserResponse {
  login: string;
  name: string | null;
  bio: string | null;
  html_url: string;
  avatar_url: string | null;
  public_repos: number;
  followers: number;
  created_at: string;
}

interface GHRepoResponse {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

/** Small, tasteful language colors for repo dots. */
export const languageColors: Record<string, string> = {
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  SQL: "#e38c00",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  Vue: "#41b883",
};

function fallbackFromCatalogue(): GitHubData {
  // Curated local view: catalogue projects with repo names, no live stats.
  const curated = projects.filter((p) => p.repo);
  return {
    configured: false,
    source: "fallback",
    profile: null,
    repos: curated.slice(0, 8).map((p) => ({
      name: p.repo as string,
      description: p.tagline,
      url: "",
      stars: 0,
      language: p.tech[0] ?? null,
      updatedAt: null,
      archived: false,
      topics: [],
      source: "fallback" as const,
    })),
  };
}

export async function getGitHubData(): Promise<GitHubData> {
  const username = getGitHubUsername();

  if (!username) {
    return fallbackFromCatalogue();
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: REVALIDATE_SECONDS } },
      ),
    ]);

    // Rate limited or profile unavailable → local catalogue.
    if (!userRes.ok || !reposRes.ok) {
      return fallbackFromCatalogue();
    }

    const user = (await userRes.json()) as GHUserResponse;
    const allRepos = (await reposRes.json()) as GHRepoResponse[];

    const repos: GitHubRepoView[] = allRepos
      .filter((r) => !r.fork)
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return (b.pushed_at ?? "").localeCompare(a.pushed_at ?? "");
      })
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
        updatedAt: r.pushed_at,
        archived: r.archived,
        topics: r.topics ?? [],
        source: "live" as const,
      }));

    return {
      configured: true,
      source: "live",
      profile: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        url: user.html_url,
        avatarUrl: user.avatar_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        createdAt: user.created_at,
      },
      repos,
    };
  } catch {
    // Network failure of any kind → local catalogue.
    return fallbackFromCatalogue();
  }
}

/** Absolute repositories URL, only when the profile is configured. */
export function getRepositoriesUrl(): string | null {
  const username = getGitHubUsername();
  return username ? `https://github.com/${username}?tab=repositories` : null;
}

/** Repository URL for a project, only when fully resolvable. */
export function getRepoUrl(repo: string | undefined): string | null {
  const username = getGitHubUsername();
  if (!username || !repo) return null;
  return `https://github.com/${username}/${repo}`;
}
