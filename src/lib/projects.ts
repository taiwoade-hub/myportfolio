import type {
  CategoryMeta,
  Project,
  ProjectCategory,
  ProjectStatus,
} from "@/lib/project-types";
import { softwareProjects } from "@/lib/data/projects-software";
import { aiProjects } from "@/lib/data/projects-ai";
import { infraProjects } from "@/lib/data/projects-infra";

export type { Project, ProjectCategory, ProjectStatus, CategoryMeta } from "@/lib/project-types";

/**
 * The full project catalogue — one source of truth for the projects page,
 * the home page, case studies, the sitemap and the GitHub fallback view.
 */
export const projects: Project[] = [
  ...softwareProjects,
  ...aiProjects,
  ...infraProjects,
];

export const categories: CategoryMeta[] = [
  {
    id: "software",
    label: "Software & Web Development",
    shortLabel: "Software",
    blurb:
      "Applications and interfaces — from document-style planning tools to fintech prototypes and this website.",
  },
  {
    id: "security",
    label: "Cybersecurity & Web Intelligence",
    shortLabel: "Security",
    blurb:
      "Verification, inspection and data visibility — security-minded tooling built and scoped responsibly.",
  },
  {
    id: "ai",
    label: "AI, Automation & Bots",
    shortLabel: "AI & Automation",
    blurb:
      "Telegram bots, agents and utilities that automate the repetitive and explore what intelligence adds.",
  },
  {
    id: "devops",
    label: "DevOps, Cloud & Infrastructure",
    shortLabel: "DevOps",
    blurb:
      "Self-hosting, deployment practice and infrastructure operated by hand — documented as practiced.",
  },
  {
    id: "trading",
    label: "Trading Technology",
    shortLabel: "Trading",
    blurb:
      "Market-structure analysis software — built as engineering and research, never as financial advice.",
  },
];

export const statusMeta: Record<
  ProjectStatus,
  { label: string; hint: string; tone: "accent" | "foreground" | "muted" }
> = {
  active: {
    label: "Active",
    hint: "Live and maintained",
    tone: "accent",
  },
  "in-development": {
    label: "In development",
    hint: "Currently being built",
    tone: "foreground",
  },
  experimental: {
    label: "Experimental",
    hint: "Working exploration, not a product",
    tone: "foreground",
  },
  concept: {
    label: "Concept",
    hint: "Designed, not yet built",
    tone: "muted",
  },
  ongoing: {
    label: "Ongoing",
    hint: "Continuous practice, not a deliverable",
    tone: "foreground",
  },
};

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category === category);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  prev: Project | undefined;
  next: Project | undefined;
} {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? projects[index - 1] : undefined,
    next: index < projects.length - 1 ? projects[index + 1] : undefined,
  };
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getCategoryMeta(
  category: ProjectCategory,
): CategoryMeta | undefined {
  return categories.find((c) => c.id === category);
}
