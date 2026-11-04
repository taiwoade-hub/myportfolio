import { NextRequest, NextResponse } from "next/server";
import { checkApiAuth } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}

export async function PATCH(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, read } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const updated = await db.contactMessage.update({
    where: { id },
    data: { read: Boolean(read) },
  });

  return NextResponse.json({ ok: true, message: updated });
}

export async function DELETE(request: NextRequest) {
  if (!checkApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
