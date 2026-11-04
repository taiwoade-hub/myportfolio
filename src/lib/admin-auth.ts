import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "taiwo_vault_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function getAdminSecrets() {
  const secretKey = process.env.ADMIN_SECRET_KEY?.trim() || "vault-taiwo-2026";
  const password = process.env.ADMIN_PASSWORD?.trim() || "admin-taiwo-2026";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() || "salt_taiwo_session_secure_key_991823";
  return { secretKey, password, sessionSecret };
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function signSessionPayload(expiryTimestamp: number, secret: string): string {
  const payload = `admin:${expiryTimestamp}`;
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const [role, expiryStr] = payload.split(":");
  if (role !== "admin" || !expiryStr) return false;

  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  const { sessionSecret } = getAdminSecrets();
  const expectedHmac = createHmac("sha256", sessionSecret).update(payload).digest("hex");
  return safeCompare(signature, expectedHmac);
}

/** Check if current request in Server Component has valid admin session */
export async function getIsAdmin(): Promise<boolean> {
  const cookieJar = await cookies();
  const token = cookieJar.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** Check if API request has valid session or valid header key */
export function checkApiAuth(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifySessionToken(token)) return true;

  // Also allow Authorization: Bearer <ADMIN_SECRET_KEY>
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerKey = authHeader.slice(7).trim();
    const { secretKey } = getAdminSecrets();
    if (safeCompare(bearerKey, secretKey)) return true;
  }

  return false;
}

export function generateSessionCookieHeader(): { name: string; value: string; options: object } {
  const { sessionSecret } = getAdminSecrets();
  const expiryTimestamp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = signSessionPayload(expiryTimestamp, sessionSecret);

  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  };
}

export function verifySecretKey(provided: string): boolean {
  const { secretKey } = getAdminSecrets();
  return safeCompare(provided.trim(), secretKey);
}

export function verifyAdminPassword(provided: string): boolean {
  const { password } = getAdminSecrets();
  return safeCompare(provided.trim(), password);
}
