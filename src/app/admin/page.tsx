import { notFound } from "next/navigation";
import { getIsAdmin, verifySecretKey } from "@/lib/admin-auth";
import {
  getLiveSiteSettings,
  getLiveUiConfig,
  getLiveProjects,
} from "@/lib/dynamic-data";
import { db } from "@/lib/db";
import { StealthAuthScreen } from "./stealth-auth-screen";
import { AdminDashboardClient } from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ key?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const isAuth = await getIsAdmin();
  const providedKey = params?.key;

  // Stealth 404 Camouflage:
  // If not authenticated and no valid master key provided, pretend this page does not exist.
  if (!isAuth) {
    if (!providedKey || !verifySecretKey(providedKey)) {
      notFound();
    }
    // Key matches: show the terminal unlock screen
    return <StealthAuthScreen secretKey={providedKey} />;
  }

  // Authenticated: load live operational assets
  const [site, ui, projects, skills, messages] = await Promise.all([
    getLiveSiteSettings(),
    getLiveUiConfig(),
    getLiveProjects(true),
    db.stackSkill.findMany({ orderBy: { sortOrder: "asc" } }),
    db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const serializedMessages = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
    userAgent: m.userAgent,
  }));

  return (
    <AdminDashboardClient
      initialSite={site}
      initialUi={ui}
      initialProjects={projects}
      initialSkills={skills}
      initialMessages={serializedMessages}
    />
  );
}
