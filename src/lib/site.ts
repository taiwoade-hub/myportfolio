/**
 * Site configuration.
 *
 * Professional links (GitHub, LinkedIn, email) are read from environment
 * variables and rendered ONLY when configured. This portfolio never
 * invents contact details, usernames or profile URLs — unset links simply
 * do not appear.
 *
 * .env keys:
 *   GITHUB_USERNAME            e.g. taiwoadebola
 *   LINKEDIN_URL               full URL to the LinkedIn profile
 *   CONTACT_EMAIL              shown on the contact page / hero
 *   NEXT_PUBLIC_AVAILABLE_FOR  availability text; when unset, no badge shows
 *   NEXT_PUBLIC_SITE_URL       canonical URL used for metadata & sitemap
 */

export const site = {
  name: "Taiwo Adebola",
  firstName: "Taiwo",
  roles: [
    "Software Engineer",
    "Cybersecurity",
    "DevOps",
    "AI & Automation",
  ],
  headline: "I build software, solve problems, and turn ideas into working products.",
  intro:
    "I'm a cybersecurity student and aspiring software engineer interested in building useful applications, secure systems, intelligent automation and reliable infrastructure. I enjoy learning by creating real projects and exploring how technology works beneath the surface.",
  location: "Nigeria",
  cvPath: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cv/taiwo-adebola-cv.pdf`,
} as const;

export interface SocialLinks {
  github: string | null;
  linkedin: string | null;
  email: string | null;
}

/** Read configured professional links (server-side). */
export function getSocialLinks(): SocialLinks {
  const username = process.env.GITHUB_USERNAME?.trim();
  const linkedin = process.env.LINKEDIN_URL?.trim();
  const email = process.env.CONTACT_EMAIL?.trim();

  return {
    github: username ? `https://github.com/${username}` : null,
    linkedin: linkedin && /^https?:\/\//.test(linkedin) ? linkedin : null,
    email: email || null,
  };
}

/** GitHub username, when configured. Server-side only. */
export function getGitHubUsername(): string | null {
  const username = process.env.GITHUB_USERNAME?.trim();
  return username || null;
}

/** Availability text for the hero badge — empty means "don't show it". */
export function getAvailability(): string | null {
  const text = process.env.NEXT_PUBLIC_AVAILABLE_FOR?.trim();
  return text || null;
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url && /^https?:\/\//.test(url)) return url.replace(/\/$/, "");
  return "http://localhost:3011";
}

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/stack", label: "Tech Stack" },
  { href: "/engineering", label: "Engineering" },
  { href: "/contact", label: "Contact" },
] as const;
