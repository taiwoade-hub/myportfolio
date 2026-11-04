import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { getLiveStackGroups } from "@/lib/dynamic-data";

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await db.stackSkill.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const groups = await getLiveStackGroups();

  return NextResponse.json({ skills, groups });
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

  const { id, groupId, groupTitle, groupBlurb, name, note, level } = body;
  if (!name || !groupId) {
    return NextResponse.json({ error: "Name and group are required" }, { status: 422 });
  }

  if (id) {
    const updated = await db.stackSkill.update({
      where: { id },
      data: {
        groupId,
        groupTitle: groupTitle || "Technologies",
        groupBlurb: groupBlurb || "",
        name,
        note: note || "",
        level: level || "working",
      },
    });
    return NextResponse.json({ ok: true, skill: updated });
  } else {
    const created = await db.stackSkill.create({
      data: {
        groupId,
        groupTitle: groupTitle || "Technologies",
        groupBlurb: groupBlurb || "",
        name,
        note: note || "",
        level: level || "working",
      },
    });
    return NextResponse.json({ ok: true, skill: created });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.stackSkill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
