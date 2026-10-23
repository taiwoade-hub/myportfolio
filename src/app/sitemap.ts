import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/projects";
import { getArticles } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/stack`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/engineering`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: `${base}/projects/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = getArticles().map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(`${a.date}T00:00:00`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
