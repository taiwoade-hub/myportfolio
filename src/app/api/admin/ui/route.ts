import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getLiveUiConfig } from "@/lib/dynamic-data";

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const config = await getLiveUiConfig();
  return NextResponse.json({ config });
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
    activeTheme,
    heroVariant,
    showAvailability,
    showGitHubStats,
    showBlog,
    showEngineering,
    showStack,
    accentColor,
  } = body;

  const updated = await db.uiConfig.upsert({
    where: { id: "singleton" },
    update: {
      activeTheme: activeTheme !== undefined ? String(activeTheme) : undefined,
      heroVariant: heroVariant !== undefined ? String(heroVariant) : undefined,
      showAvailability: showAvailability !== undefined ? Boolean(showAvailability) : undefined,
      showGitHubStats: showGitHubStats !== undefined ? Boolean(showGitHubStats) : undefined,
      showBlog: showBlog !== undefined ? Boolean(showBlog) : undefined,
      showEngineering: showEngineering !== undefined ? Boolean(showEngineering) : undefined,
      showStack: showStack !== undefined ? Boolean(showStack) : undefined,
      accentColor: accentColor !== undefined ? String(accentColor) : undefined,
    },
    create: {
      id: "singleton",
      activeTheme: activeTheme || "slate",
      heroVariant: heroVariant || "shader",
      showAvailability: showAvailability !== undefined ? Boolean(showAvailability) : true,
      showGitHubStats: showGitHubStats !== undefined ? Boolean(showGitHubStats) : true,
      showBlog: showBlog !== undefined ? Boolean(showBlog) : true,
      showEngineering: showEngineering !== undefined ? Boolean(showEngineering) : true,
      showStack: showStack !== undefined ? Boolean(showStack) : true,
      accentColor: accentColor || "#38bdf8",
    },
  });

  return NextResponse.json({ ok: true, config: updated });
}
