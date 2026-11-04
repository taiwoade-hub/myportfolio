import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getLiveSiteSettings } from "@/lib/dynamic-data";

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getLiveSiteSettings();
  return NextResponse.json({ settings });
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
    name,
    firstName,
    headline,
    intro,
    location,
    cvPath,
    availableFor,
    githubUsername,
    linkedinUrl,
    contactEmail,
    roles,
  } = body;

  const updated = await db.siteSetting.upsert({
    where: { id: "singleton" },
    update: {
      name: name !== undefined ? String(name) : undefined,
      firstName: firstName !== undefined ? String(firstName) : undefined,
      headline: headline !== undefined ? String(headline) : undefined,
      intro: intro !== undefined ? String(intro) : undefined,
      location: location !== undefined ? String(location) : undefined,
      cvPath: cvPath !== undefined ? String(cvPath) : undefined,
      availableFor: availableFor !== undefined ? (availableFor ? String(availableFor) : null) : undefined,
      githubUsername: githubUsername !== undefined ? (githubUsername ? String(githubUsername) : null) : undefined,
      linkedinUrl: linkedinUrl !== undefined ? (linkedinUrl ? String(linkedinUrl) : null) : undefined,
      contactEmail: contactEmail !== undefined ? (contactEmail ? String(contactEmail) : null) : undefined,
      rolesJson: Array.isArray(roles) ? JSON.stringify(roles) : undefined,
    },
    create: {
      id: "singleton",
      name: name || "Taiwo Adebola",
      firstName: firstName || "Taiwo",
      headline: headline || "I build software, solve problems, and turn ideas into working products.",
      intro: intro || "",
      location: location || "Nigeria",
      cvPath: cvPath || "/cv/taiwo-adebola-cv.pdf",
      availableFor: availableFor || null,
      githubUsername: githubUsername || null,
      linkedinUrl: linkedinUrl || null,
      contactEmail: contactEmail || null,
      rolesJson: Array.isArray(roles) ? JSON.stringify(roles) : JSON.stringify(["Software Engineer"]),
    },
  });

  return NextResponse.json({ ok: true, settings: updated });
}
