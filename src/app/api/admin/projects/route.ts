import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getLiveProjects } from "@/lib/dynamic-data";

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Return all projects including unpublished ones for admin
  const projects = await getLiveProjects(true);
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    slug,
    name,
    tagline,
    summary,
    category,
    status,
    statusNote,
    repo,
    liveUrl,
    tech,
    cover,
    featured,
    published,
    caseStudy,
  } = body;

  if (!slug || !name) {
    return NextResponse.json({ error: "Slug and name are required." }, { status: 422 });
  }

  const cleanSlug = String(slug)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  const techJson = Array.isArray(tech) ? JSON.stringify(tech) : JSON.stringify([]);
  const caseStudyJson = caseStudy ? JSON.stringify(caseStudy) : JSON.stringify({
    overview: [summary || tagline || ""],
    problem: tagline || "",
    intendedUsers: "Developers and users",
    keyFeatures: [],
    implementation: [],
    challenges: [],
    status: status || "active",
    future: [],
  });

  const isPublished = published !== undefined ? Boolean(published) : true;

  const project = await db.projectItem.upsert({
    where: { slug: cleanSlug },
    update: {
      name,
      tagline: tagline || "",
      summary: summary || "",
      category: category || "software",
      status: status || "active",
      statusNote: statusNote || null,
      repo: repo || null,
      liveUrl: liveUrl || null,
      techJson,
      cover: cover || "terminal",
      featured: Boolean(featured),
      published: isPublished,
      caseStudyJson,
    },
    create: {
      slug: cleanSlug,
      name,
      tagline: tagline || "",
      summary: summary || "",
      category: category || "software",
      status: status || "active",
      statusNote: statusNote || null,
      repo: repo || null,
      liveUrl: liveUrl || null,
      techJson,
      cover: cover || "terminal",
      featured: Boolean(featured),
      published: isPublished,
      caseStudyJson,
    },
  });

  return NextResponse.json({ ok: true, project });
}

export async function PATCH(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, published, featured } = body;
  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const project = await db.projectItem.update({
    where: { slug },
    data: {
      published: published !== undefined ? Boolean(published) : undefined,
      featured: featured !== undefined ? Boolean(featured) : undefined,
    },
  });

  return NextResponse.json({ ok: true, project });
}

export async function DELETE(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  await db.projectItem.delete({
    where: { slug },
  });

  return NextResponse.json({ ok: true });
}
