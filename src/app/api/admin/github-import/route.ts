import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getGitHubUsername } from "@/lib/site";
import type { CoverVariant, ProjectCategory } from "@/lib/project-types";

function pickCoverVariant(category: string, language: string | null): CoverVariant {
  const lang = (language || "").toLowerCase();
  if (lang.includes("shell") || lang.includes("bash") || lang.includes("c")) return "terminal";
  if (category === "ai") return "nodes";
  if (category === "devops") return "pipeline";
  if (category === "security") return "terminal";
  if (category === "trading") return "market";
  return "window";
}

function detectCategory(topics: string[], desc: string, language: string | null): ProjectCategory {
  const combined = (topics.join(" ") + " " + desc + " " + (language || "")).toLowerCase();
  if (combined.includes("bot") || combined.includes("ai") || combined.includes("agent") || combined.includes("llm")) return "ai";
  if (combined.includes("security") || combined.includes("vulnerability") || combined.includes("osint") || combined.includes("recon")) return "security";
  if (combined.includes("docker") || combined.includes("devops") || combined.includes("infra") || combined.includes("caddy") || combined.includes("ansible")) return "devops";
  if (combined.includes("trading") || combined.includes("crypto") || combined.includes("fintech") || combined.includes("market")) return "trading";
  return "software";
}

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const repoInput = searchParams.get("repo")?.trim();
  const fetchList = searchParams.get("list");

  const defaultOwner = getGitHubUsername() || "taiwoade-hub";

  // If asking to list owner's public repos
  if (fetchList === "true" || !repoInput) {
    try {
      const res = await fetch(`https://api.github.com/users/${defaultOwner}/repos?sort=updated&per_page=30`, {
        headers: { "User-Agent": "Portfolio-Admin-Engine" },
      });
      if (!res.ok) {
        return NextResponse.json({ error: `GitHub API error: ${res.statusText}` }, { status: res.status });
      }
      const data = await res.json();
      const repos = Array.isArray(data)
        ? data.map((r) => ({
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            topics: r.topics || [],
            url: r.html_url,
            homepage: r.homepage,
            updatedAt: r.updated_at,
          }))
        : [];
      return NextResponse.json({ repos, owner: defaultOwner });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  // Fetch single repo details
  const fullPath = repoInput.includes("/") ? repoInput : `${defaultOwner}/${repoInput}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${fullPath}`, {
      headers: { "User-Agent": "Portfolio-Admin-Engine" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `GitHub repository not found (${res.statusText})` }, { status: res.status });
    }
    const r = await res.json();

    // Fetch README if available
    let readmeText = "";
    try {
      const rmRes = await fetch(`https://api.github.com/repos/${fullPath}/readme`, {
        headers: { "User-Agent": "Portfolio-Admin-Engine" },
      });
      if (rmRes.ok) {
        const rmData = await rmRes.json();
        if (rmData.content) {
          readmeText = Buffer.from(rmData.content, "base64").toString("utf8");
        }
      }
    } catch {}

    const topics: string[] = r.topics || [];
    const tech: string[] = [r.language, ...topics].filter(Boolean) as string[];
    const category = detectCategory(topics, r.description || "", r.language);
    const cover = pickCoverVariant(category, r.language);

    // Draft a high quality case study from metadata and readme
    // Sanitize README lines: strip HTML tags and badge markdown
    const firstLines = readmeText
      .split("\n")
      .map((l) => l.trim())
      .map((l) => l.replace(/<[^>]*>/g, "").trim())
      .map((l) => l.replace(/!\[.*?\]\(.*?\)/g, "").trim())
      .map((l) => l.replace(/\[(.*?)\]\(.*?\)/g, "$1").trim())
      .filter((l) => l.length > 30 && !l.startsWith("#") && !l.startsWith("---") && !l.startsWith("`"))
      .slice(0, 3);

    const draft = {
      slug: r.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: r.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
      tagline: r.description || `${r.name} — engineered with ${r.language || "modern technologies"}.`,
      summary: r.description || `An open source project hosted on GitHub focusing on ${category}.`,
      category,
      status: "active",
      repo: r.name,
      liveUrl: r.homepage || undefined,
      tech: tech.slice(0, 8),
      cover,
      featured: false,
      published: true,
      caseStudy: {
        overview:
          firstLines.length > 0
            ? firstLines
            : [r.description || `An open-source ${category} project hosted and maintained on GitHub.`],
        problem: `Addressing challenges in ${category} with reliable, modern tooling.`,
        intendedUsers: "Developers, engineers, and users seeking reliable tooling.",
        keyFeatures:
          topics.length > 0
            ? topics.map((t) => `Engineered around ${t}`)
            : ["Modular architecture", "Documented repository"],
        implementation: [
          `Primary language: ${r.language || "TypeScript / Python"}`,
          `Repository features ${r.stargazers_count} stars and continuous maintenance.`,
        ],
        challenges: [
          {
            challenge: "Ensuring robustness and performance.",
            solution: "Applied clean code practices and modular structure.",
          },
        ],
        status: "Active and maintained.",
        future: ["Expand feature set", "Enhance performance and documentation"],
      },
    };

    return NextResponse.json({ draft, raw: r });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { draft } = body;
  if (!draft || !draft.slug || !draft.name) {
    return NextResponse.json({ error: "Invalid project draft." }, { status: 422 });
  }

  const isPublished = draft.published !== undefined ? Boolean(draft.published) : true;

  const project = await db.projectItem.upsert({
    where: { slug: draft.slug },
    update: {
      name: draft.name,
      tagline: draft.tagline || "",
      summary: draft.summary || "",
      category: draft.category || "software",
      status: draft.status || "active",
      statusNote: draft.statusNote || null,
      repo: draft.repo || null,
      liveUrl: draft.liveUrl || null,
      techJson: JSON.stringify(draft.tech || []),
      cover: draft.cover || "window",
      featured: Boolean(draft.featured),
      published: isPublished,
      caseStudyJson: JSON.stringify(draft.caseStudy || {}),
    },
    create: {
      slug: draft.slug,
      name: draft.name,
      tagline: draft.tagline || "",
      summary: draft.summary || "",
      category: draft.category || "software",
      status: draft.status || "active",
      statusNote: draft.statusNote || null,
      repo: draft.repo || null,
      liveUrl: draft.liveUrl || null,
      techJson: JSON.stringify(draft.tech || []),
      cover: draft.cover || "window",
      featured: Boolean(draft.featured),
      published: isPublished,
      caseStudyJson: JSON.stringify(draft.caseStudy || {}),
    },
  });

  return NextResponse.json({ ok: true, project });
}
