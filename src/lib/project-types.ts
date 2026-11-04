/**
 * Shared project data types.
 *
 * The portfolio is driven entirely by this catalogue — cards, filters and
 * case-study pages all render from the same data, so nothing is hardcoded
 * per page.
 */

export type ProjectStatus =
  | "active"
  | "in-development"
  | "experimental"
  | "concept"
  | "ongoing";

export type ProjectCategory =
  | "software"
  | "security"
  | "ai"
  | "devops"
  | "trading";

/**
 * Cover art variants — abstract, typographic compositions rendered as SVG.
 * These are designed covers, deliberately *not* screenshots: this portfolio
 * never fabricates product imagery.
 */
export type CoverVariant =
  | "window"
  | "rings"
  | "nodes"
  | "pipeline"
  | "market"
  | "map"
  | "grid"
  | "ledger"
  | "terminal";

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface ProjectCaseStudy {
  /** Opening paragraphs — what this project is. */
  overview: string[];
  /** The problem it sets out to solve. */
  problem: string;
  /** Who it is intended for. */
  intendedUsers: string;
  /** The feature set — honest: only what is designed or actually built. */
  keyFeatures: string[];
  /** How it is (or is planned to be) built — architecture & approach. */
  implementation: string[];
  /** Engineering challenges and how they were approached. */
  challenges: ProjectChallenge[];
  /** Plain-language current status. */
  status: string;
  /** Potential future improvements. */
  future: string[];
}

export interface Project {
  slug: string;
  name: string;
  /** One-line positioning statement shown on cards and page headers. */
  tagline: string;
  /** Two-sentence card description. */
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Optional honest note, e.g. "details pending repository review". */
  statusNote?: string;
  /**
   * Repository name on the configured GitHub account. Links are only
   * rendered when GITHUB_USERNAME is set — this portfolio never links to
   * a repository it cannot verify exists.
   */
  repo?: string;
  /** Verified live demo URL, when one exists. */
  liveUrl?: string;
  tech: string[];
  cover: CoverVariant;
  /** Featured projects appear on the home page. */
  featured?: boolean;
  published?: boolean;
  caseStudy: ProjectCaseStudy;
}

export interface CategoryMeta {
  id: ProjectCategory;
  label: string;
  shortLabel: string;
  blurb: string;
}
