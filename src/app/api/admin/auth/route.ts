import { NextRequest, NextResponse } from "next/server";
import {
  generateSessionCookieHeader,
  ADMIN_COOKIE_NAME,
  verifyAdminPassword,
  verifySecretKey,
  checkApiAuth,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const isAuth = checkApiAuth(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { password, secretKey } = body || {};

  let isValid = false;
  if (password && typeof password === "string" && verifyAdminPassword(password)) {
    isValid = true;
  } else if (secretKey && typeof secretKey === "string" && verifySecretKey(secretKey)) {
    isValid = true;
  }

  if (!isValid) {
    // Artificial delay to mitigate brute force
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ error: "Access Denied" }, { status: 401 });
  }

  const cookieData = generateSessionCookieHeader();
  const response = NextResponse.json({ ok: true, message: "Vault session granted" });
  response.cookies.set(cookieData.name, cookieData.value, cookieData.options as any);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, message: "Session ended" });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
