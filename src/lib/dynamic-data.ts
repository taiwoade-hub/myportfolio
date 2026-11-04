import { db } from "@/lib/db";
import { site, getSocialLinks, getAvailability, getGitHubUsername } from "@/lib/site";
import { projects as fallbackProjects, categories as fallbackCategories, statusMeta } from "@/lib/projects";
import type { Project, ProjectCategory, ProjectStatus, CoverVariant, ProjectCaseStudy } from "@/lib/project-types";
import { stackGroups as fallbackStackGroups, type StackGroup, type StackLevel } from "@/lib/stack";
import { articles as fallbackArticles, type Article, type ArticleBlock } from "@/lib/articles";

export interface LiveSiteSettings {
  name: string;
  firstName: string;
  headline: string;
  intro: string;
  location: string;
  cvPath: string;
  availableFor: string | null;
  githubUsername: string | null;
  linkedinUrl: string | null;
  contactEmail: string | null;
  roles: string[];
}

export interface LiveUiConfig {
  activeTheme: "slate" | "obsidian" | "cyberpunk" | "emerald" | "monochrome";
  heroVariant: "shader" | "particles" | "terminal" | "clean";
  showAvailability: boolean;
  showGitHubStats: boolean;
  showBlog: boolean;
  showEngineering: boolean;
  showStack: boolean;
  accentColor: string;
}

/** Get live site configuration (DB first, fallback to site.ts) */
export async function getLiveSiteSettings(): Promise<LiveSiteSettings> {
  try {
    const record = await db.siteSetting.findUnique({ where: { id: "singleton" } });
    if (record) {
      let roles: string[] = [...site.roles];
      try {
        roles = JSON.parse(record.rolesJson);
      } catch {}
      return {
        name: record.name,
        firstName: record.firstName,
        headline: record.headline,
        intro: record.intro,
        location: record.location,
        cvPath: record.cvPath,
        availableFor: record.availableFor,
        githubUsername: record.githubUsername,
        linkedinUrl: record.linkedinUrl,
        contactEmail: record.contactEmail,
        roles,
      };
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveSiteSettings falling back to static:", err);
  }

  const socials = getSocialLinks();
  return {
    name: site.name,
    firstName: site.firstName,
    headline: site.headline,
    intro: site.intro,
    location: site.location,
    cvPath: site.cvPath,
    availableFor: getAvailability(),
    githubUsername: getGitHubUsername(),
    linkedinUrl: socials.linkedin,
    contactEmail: socials.email,
    roles: [...site.roles],
  };
}

/** Get live UI configuration (Theme, Hero style, Section switches) */
export async function getLiveUiConfig(): Promise<LiveUiConfig> {
  try {
    const record = await db.uiConfig.findUnique({ where: { id: "singleton" } });
    if (record) {
      return {
        activeTheme: (record.activeTheme as LiveUiConfig["activeTheme"]) || "slate",
        heroVariant: (record.heroVariant as LiveUiConfig["heroVariant"]) || "shader",
        showAvailability: record.showAvailability,
        showGitHubStats: record.showGitHubStats,
        showBlog: record.showBlog,
        showEngineering: record.showEngineering,
        showStack: record.showStack,
        accentColor: record.accentColor || "#38bdf8",
      };
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveUiConfig falling back to static:", err);
  }

  return {
    activeTheme: "slate",
    heroVariant: "shader",
    showAvailability: true,
    showGitHubStats: true,
    showBlog: true,
    showEngineering: true,
    showStack: true,
    accentColor: "#38bdf8",
  };
}

function parseProjectRecord(p: any): Project {
  let tech: string[] = [];
  try {
    tech = JSON.parse(p.techJson);
  } catch {
    tech = [p.techJson];
  }

  let caseStudy: ProjectCaseStudy = {
    overview: [p.summary],
    problem: p.tagline,
    intendedUsers: "Developers and users",
    keyFeatures: [],
    implementation: [],
    challenges: [],
    status: p.status,
    future: [],
  };
  try {
    caseStudy = JSON.parse(p.caseStudyJson);
  } catch {}

  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    category: p.category as ProjectCategory,
    status: p.status as ProjectStatus,
    statusNote: p.statusNote || undefined,
    repo: p.repo || undefined,
    liveUrl: p.liveUrl || undefined,
    tech,
    cover: p.cover as CoverVariant,
    featured: Boolean(p.featured),
    published: p.published !== undefined ? Boolean(p.published) : true,
    caseStudy,
  };
}

/** Get all projects (DB first, fallback to static) */
export async function getLiveProjects(includeUnpublished = false): Promise<Project[]> {
  try {
    const where = includeUnpublished ? {} : { published: true };
    const records = await db.projectItem.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    if (records.length > 0) {
      return records.map(parseProjectRecord);
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveProjects falling back to static:", err);
  }
  return fallbackProjects;
}

export async function getLiveFeaturedProjects(): Promise<Project[]> {
  try {
    const records = await db.projectItem.findMany({
      where: { featured: true, published: true },
      orderBy: { sortOrder: "asc" },
    });
    if (records.length > 0) {
      return records.map(parseProjectRecord);
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveFeaturedProjects falling back:", err);
  }
  return fallbackProjects.filter((p) => p.featured);
}

export async function getLiveProject(slug: string, allowUnpublished = false): Promise<Project | undefined> {
  try {
    const record = await db.projectItem.findUnique({ where: { slug } });
    if (record && (record.published || allowUnpublished)) {
      return parseProjectRecord(record);
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveProject falling back:", err);
  }
  return fallbackProjects.find((p) => p.slug === slug);
}

/** Get Tech Stack grouped (DB first, fallback to stack.ts) */
export async function getLiveStackGroups(): Promise<StackGroup[]> {
  try {
    const skills = await db.stackSkill.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (skills.length > 0) {
      const groupMap = new Map<string, StackGroup>();
      for (const s of skills) {
        if (!groupMap.has(s.groupId)) {
          groupMap.set(s.groupId, {
            id: s.groupId,
            title: s.groupTitle,
            blurb: s.groupBlurb,
            items: [],
          });
        }
        groupMap.get(s.groupId)!.items.push({
          name: s.name,
          note: s.note,
          level: s.level as StackLevel,
        });
      }
      return Array.from(groupMap.values());
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveStackGroups falling back:", err);
  }
  return fallbackStackGroups;
}

/** Get articles (DB first, fallback to articles.ts) */
export async function getLiveArticles(): Promise<Article[]> {
  try {
    const items = await db.articleItem.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    if (items.length > 0) {
      return items.map((a) => {
        let tags: string[] = [];
        let blocks: ArticleBlock[] = [];
        try {
          tags = JSON.parse(a.tagsJson);
        } catch {}
        try {
          blocks = JSON.parse(a.blocksJson);
        } catch {}

        return {
          slug: a.slug,
          title: a.title,
          description: a.description,
          date: a.date,
          tags,
          minutes: a.minutes,
          blocks,
        };
      });
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveArticles falling back:", err);
  }
  return fallbackArticles;
}

export async function getLiveArticle(slug: string): Promise<Article | undefined> {
  try {
    const record = await db.articleItem.findUnique({ where: { slug } });
    if (record) {
      let tags: string[] = [];
      let blocks: ArticleBlock[] = [];
      try {
        tags = JSON.parse(record.tagsJson);
      } catch {}
      try {
        blocks = JSON.parse(record.blocksJson);
      } catch {}
      return {
        slug: record.slug,
        title: record.title,
        description: record.description,
        date: record.date,
        tags,
        minutes: record.minutes,
        blocks,
      };
    }
  } catch (err) {
    console.warn("[dynamic-data] getLiveArticle falling back:", err);
  }
  return fallbackArticles.find((a) => a.slug === slug);
}
