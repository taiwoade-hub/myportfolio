import { db } from "@/lib/db";
import { site, getSocialLinks, getAvailability, getGitHubUsername } from "@/lib/site";
import { projects } from "@/lib/projects";
import { stackGroups } from "@/lib/stack";
import { articles } from "@/lib/articles";

export async function ensureSeeded() {
  try {
    // 1. Seed SiteSetting
    const existingSite = await db.siteSetting.findUnique({
      where: { id: "singleton" },
    });
    if (!existingSite) {
      const socials = getSocialLinks();
      await db.siteSetting.create({
        data: {
          id: "singleton",
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
          rolesJson: JSON.stringify(site.roles),
        },
      });
      console.log("[seed] Site settings initialized.");
    }

    // 2. Seed UiConfig
    const existingUi = await db.uiConfig.findUnique({
      where: { id: "singleton" },
    });
    if (!existingUi) {
      await db.uiConfig.create({
        data: {
          id: "singleton",
          activeTheme: "slate",
          heroVariant: "shader",
          showAvailability: true,
          showGitHubStats: true,
          showBlog: true,
          showEngineering: true,
          showStack: true,
          accentColor: "#38bdf8",
        },
      });
      console.log("[seed] UI config initialized.");
    }

    // 3. Seed Projects
    const projectCount = await db.projectItem.count();
    if (projectCount === 0) {
      console.log(`[seed] Seeding ${projects.length} initial projects...`);
      let order = 0;
      for (const p of projects) {
        await db.projectItem.create({
          data: {
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            summary: p.summary,
            category: p.category,
            status: p.status,
            statusNote: p.statusNote || null,
            repo: p.repo || null,
            liveUrl: p.liveUrl || null,
            techJson: JSON.stringify(p.tech),
            cover: p.cover,
            featured: Boolean(p.featured),
            sortOrder: order++,
            caseStudyJson: JSON.stringify(p.caseStudy),
          },
        });
      }
      console.log("[seed] Projects seeded successfully.");
    }

    // 4. Seed Tech Stack
    const skillCount = await db.stackSkill.count();
    if (skillCount === 0) {
      console.log("[seed] Seeding initial tech stack...");
      for (const group of stackGroups) {
        let sort = 0;
        for (const item of group.items) {
          await db.stackSkill.create({
            data: {
              groupId: group.id,
              groupTitle: group.title,
              groupBlurb: group.blurb,
              name: item.name,
              note: item.note,
              level: item.level,
              sortOrder: sort++,
            },
          });
        }
      }
      console.log("[seed] Tech stack seeded successfully.");
    }

    // 5. Seed Articles
    const articleCount = await db.articleItem.count();
    if (articleCount === 0) {
      console.log(`[seed] Seeding ${articles.length} initial articles...`);
      for (const a of articles) {
        await db.articleItem.create({
          data: {
            slug: a.slug,
            title: a.title,
            description: a.description,
            date: a.date,
            tagsJson: JSON.stringify(a.tags),
            minutes: a.minutes,
            blocksJson: JSON.stringify(a.blocks),
            published: true,
          },
        });
      }
      console.log("[seed] Articles seeded successfully.");
    }
  } catch (error) {
    console.error("[seed] Error during auto-seed:", error);
  }
}

// Allow standalone execution
if (import.meta.url.endsWith(process.argv[1] || "")) {
  ensureSeeded()
    .then(() => {
      console.log("[seed] Complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
