import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/contact — real message pipeline.
 *
 * Validation (zod), honeypot spam trap, in-memory rate limiting
 * (5 messages/hour/IP), and durable storage via Prisma. Success is only
 * returned after the database write succeeds — this form never fakes a
 * successful submission.
 */

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(60, "Name is too long."),
  email: z
    .email("Please enter a valid email address.")
    .max(120, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters — give me something to work with.")
    .max(2000, "Message is too long (2000 characters maximum)."),
  // Honeypot — must remain empty. Bots that fill it are silently dropped.
  website: z.string().max(200).optional(),
});

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  // Opportunistic cleanup so the map doesn't grow forever.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.ADMIN_TOKEN ?? "portfolio-static-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "Validation failed.", fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot triggered — pretend success, store nothing.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages from this address. Please try again later.",
      },
      { status: 429 },
    );
  }

  try {
    await db.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
        ipHash: hashIp(ip),
        userAgent: request.headers.get("user-agent")?.slice(0, 255) ?? null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] storage failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Your message could not be delivered right now — please try again in a moment.",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/contact?token=ADMIN_TOKEN — read the inbox.
 * Only available when ADMIN_TOKEN is configured on the server.
 */
export async function GET(request: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Not configured." }, { status: 404 });
  }
  const provided = request.nextUrl.searchParams.get("token") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(token);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      message: true,
      read: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ messages });
}
