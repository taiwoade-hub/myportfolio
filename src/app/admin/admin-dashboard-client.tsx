"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Palette,
  FolderGit2,
  User,
  Cpu,
  Mail,
  Lock,
  ArrowUpRight,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Github,
  Star,
  Eye,
  Sliders,
  Sparkles,
  Save,
  Globe,
  Radio,
  X,
  FileCheck2,
  EyeOff,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import type { LiveSiteSettings, LiveUiConfig } from "@/lib/dynamic-data";
import type { Project, ProjectCategory, ProjectStatus, CoverVariant } from "@/lib/project-types";
import { StatusBadge } from "@/components/badges";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { ArchitecturalSpotlightLayer } from "@/components/motion/architectural-spotlight";
import { ScrambleText } from "@/components/motion/scramble-text";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
  userAgent?: string | null;
}

interface SkillItem {
  id: string;
  groupId: string;
  groupTitle: string;
  groupBlurb: string;
  name: string;
  note: string;
  level: string;
}

interface Props {
  initialSite: LiveSiteSettings;
  initialUi: LiveUiConfig;
  initialProjects: Project[];
  initialSkills: SkillItem[];
  initialMessages: MessageItem[];
}

export function AdminDashboardClient({
  initialSite,
  initialUi,
  initialProjects,
  initialSkills,
  initialMessages,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "github" | "ui" | "identity" | "skills" | "inbox"
  >("overview");

  // State
  const [site, setSite] = useState<LiveSiteSettings>(initialSite);
  const [ui, setUi] = useState<LiveUiConfig>(initialUi);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Projects Filter State
  const [projectFilter, setProjectFilter] = useState<"all" | "published" | "drafts">("all");
  const [projectSearch, setProjectSearch] = useState("");

  // GitHub Importer State
  const [ghRepos, setGhRepos] = useState<any[]>([]);
  const [ghLoading, setGhLoading] = useState(false);
  const [customRepoInput, setCustomRepoInput] = useState("");
  const [selectedRepoDraft, setSelectedRepoDraft] = useState<any | null>(null);

  // New Project Modal State
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    slug: "",
    tagline: "",
    summary: "",
    category: "software",
    status: "active",
    tech: [],
    cover: "window",
    featured: false,
    published: true,
  });
  const [techInput, setTechInput] = useState("");

  // New Skill State
  const [newSkill, setNewSkill] = useState({
    groupId: "languages",
    groupTitle: "Languages",
    name: "",
    note: "",
    level: "working",
  });

  // Logout / Lock Vault
  async function handleLockVault() {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Vault locked.");
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    }
  }

  // Save UI settings
  async function handleSaveUi() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ui),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success("UI settings updated.");
      } else {
        toast.error("Failed to update UI settings.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  // Save Site settings
  async function handleSaveSite() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success("Profile updated.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  // Toggle Project Published Status (Publish / Unpublish)
  async function handleTogglePublished(slug: string, currentPublished: boolean = true) {
    const nextPublished = !currentPublished;
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, published: nextPublished }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.slug === slug ? { ...p, published: nextPublished } : p))
        );
        toast.success(
          nextPublished ? `"${slug}" is now published.` : `"${slug}" has been unpublished.`
        );
      } else {
        toast.error("Failed to update publication status.");
      }
    } catch {
      toast.error("Error toggling publication state.");
    }
  }

  // Toggle Featured
  async function handleToggleFeatured(project: Project) {
    const nextFeatured = !project.featured;
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: project.slug, featured: nextFeatured }),
      });
      if (res.ok) {
        setProjects(
          projects.map((p) => (p.slug === project.slug ? { ...p, featured: nextFeatured } : p))
        );
        toast.success(
          nextFeatured ? `"${project.name}" marked as featured.` : `"${project.name}" unfeatured.`
        );
      }
    } catch {
      toast.error("Failed to update featured state.");
    }
  }

  // Delete Project
  async function handleDeleteProject(slug: string) {
    if (!confirm(`Are you sure you want to permanently delete "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.slug !== slug));
        toast.success("Project removed.");
      }
    } catch {
      toast.error("Failed to delete project.");
    }
  }

  // Create Project
  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject.name || !newProject.slug) {
      toast.error("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success("Project saved.");
        setShowNewProjectModal(false);
        const prjRes = await fetch("/api/admin/projects");
        const prjData = await prjRes.json();
        if (prjData.projects) setProjects(prjData.projects);
      } else {
        toast.error(data.error || "Failed to create project.");
      }
    } catch {
      toast.error("Error creating project.");
    } finally {
      setSaving(false);
    }
  }

  // Fetch GitHub Repositories
  async function handleFetchGitHubRepos() {
    setGhLoading(true);
    try {
      const res = await fetch("/api/admin/github-import?list=true");
      const data = await res.json();
      if (res.ok && data.repos) {
        setGhRepos(data.repos);
        toast.success(`Loaded ${data.repos.length} repositories from ${data.owner}`);
      } else {
        toast.error(data.error || "Failed to fetch repositories.");
      }
    } catch {
      toast.error("Network error fetching repositories.");
    } finally {
      setGhLoading(false);
    }
  }

  // Preview GitHub Repo
  async function handlePreviewGhRepo(repoName: string) {
    setGhLoading(true);
    try {
      const res = await fetch(`/api/admin/github-import?repo=${encodeURIComponent(repoName)}`);
      const data = await res.json();
      if (res.ok && data.draft) {
        setSelectedRepoDraft(data.draft);
      } else {
        toast.error(data.error || "Could not fetch repo metadata.");
      }
    } catch {
      toast.error("Error inspecting repository.");
    } finally {
      setGhLoading(false);
    }
  }

  // Commit Import Draft
  async function handleCommitImportDraft(draft: any) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/github-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        toast.success(`Project "${draft.name}" imported.`);
        setSelectedRepoDraft(null);
        const prjRes = await fetch("/api/admin/projects");
        const prjData = await prjRes.json();
        if (prjData.projects) setProjects(prjData.projects);
      } else {
        toast.error(data.error || "Failed to import project.");
      }
    } catch {
      toast.error("Import error.");
    } finally {
      setSaving(false);
    }
  }

  // Skills
  async function handleAddSkill(e: React.FormEvent) {
    e.preventDefault();
    if (!newSkill.name) return;
    try {
      const res = await fetch("/api/admin/stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setSkills([...skills, data.skill]);
        setNewSkill({ ...newSkill, name: "", note: "" });
        toast.success("Skill added.");
      }
    } catch {
      toast.error("Failed to add skill.");
    }
  }

  async function handleDeleteSkill(id: string) {
    try {
      const res = await fetch(`/api/admin/stack?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
        toast.success("Skill removed.");
      }
    } catch {
      toast.error("Failed to delete skill.");
    }
  }

  // Messages
  async function handleToggleMessageRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      if (res.ok) {
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch {
      toast.error("Error updating message.");
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        toast.success("Message deleted.");
      }
    } catch {
      toast.error("Error deleting message.");
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const publishedProjects = projects.filter((p) => p.published !== false);
  const unpublishedProjects = projects.filter((p) => p.published === false);

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === "published" && p.published === false) return false;
    if (projectFilter === "drafts" && p.published !== false) return false;
    if (projectSearch) {
      const q = projectSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-3.5 sm:px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground md:hidden hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <BrandLogo size="md" />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm font-semibold tracking-tight text-foreground truncate">
                Mission Control
              </span>
              <span className="hidden sm:inline-block label-mono rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                CONFIDENTIAL
              </span>
            </div>
            <p className="hidden sm:block font-mono text-[11px] text-muted-foreground truncate">
              {site.name} · Site Administration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 sm:px-3 text-xs font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-accent"
            title="View Live Portfolio"
          >
            <span className="hidden sm:inline">Live Portfolio</span>
            <span className="sm:hidden text-[11px]">Site</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
          </a>
          <button
            onClick={handleLockVault}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 sm:px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            title="Lock Vault"
          >
            <Lock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lock &amp; Exit</span>
            <span className="sm:hidden text-[11px]">Lock</span>
          </button>
        </div>
      </header>

      {/* Quick Mobile Horizontal Tab Strip (Phones & Compact Tablets) */}
      <nav
        aria-label="Mobile Navigation Strip"
        className="flex md:hidden items-center gap-1.5 overflow-x-auto border-b border-border bg-card/50 px-3 py-2 no-scrollbar"
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "projects"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <FolderGit2 className="h-3.5 w-3.5" />
          <span>Projects</span>
          <span className="label-mono text-[10px] opacity-80">({projects.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("github");
            if (ghRepos.length === 0) handleFetchGitHubRepos();
          }}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "github"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </button>

        <button
          onClick={() => setActiveTab("ui")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "ui"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>UI Controls</span>
        </button>

        <button
          onClick={() => setActiveTab("identity")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "identity"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "skills"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Stack</span>
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            activeTab === "inbox"
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-muted-foreground hover:bg-accent hover:text-foreground border border-border bg-card"
          }`}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-accent-blue px-1.5 py-0.2 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Mobile Drawer Overlay Sheet */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex md:hidden bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="relative w-4/5 max-w-xs h-full border-r border-border bg-card p-5 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded border border-border bg-muted font-mono text-xs font-semibold">
                    TA
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Mission Control</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Navigation</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("overview");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("projects");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "projects"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderGit2 className="h-4 w-4" />
                    <span>Projects ({projects.length})</span>
                  </div>
                  {unpublishedProjects.length > 0 && (
                    <span className="label-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {unpublishedProjects.length} draft
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("github");
                    setMobileMenuOpen(false);
                    if (ghRepos.length === 0) handleFetchGitHubRepos();
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "github"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Sync &amp; Import</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("ui");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "ui"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Palette className="h-4 w-4" />
                  <span>UI &amp; Layout Toggles</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("identity");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "identity"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Identity &amp; Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("skills");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "skills"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Cpu className="h-4 w-4" />
                  <span>Tech Stack</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("inbox");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === "inbox"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span>Inquiries</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="label-mono rounded-full bg-accent-blue px-2 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-md border border-border p-2.5 text-xs text-foreground hover:bg-accent"
              >
                <span>Live Portfolio</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <button
                onClick={handleLockVault}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Lock Vault Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex flex-1 min-w-0">
        {/* Sidebar Nav (Tablet landscape & Desktop) */}
        <aside className="hidden md:block w-56 lg:w-64 shrink-0 border-r border-border bg-card/40 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderGit2 className="h-4 w-4" />
                <span>Projects ({projects.length})</span>
              </div>
              {unpublishedProjects.length > 0 && (
                <span
                  className={`label-mono text-[10px] px-1.5 py-0.5 rounded ${
                    activeTab === "projects"
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {unpublishedProjects.length} draft
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("github");
                if (ghRepos.length === 0) handleFetchGitHubRepos();
              }}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "github"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Github className="h-4 w-4" />
              <span>GitHub Sync &amp; Import</span>
            </button>

            <button
              onClick={() => setActiveTab("ui")}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "ui"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>UI &amp; Layout Toggles</span>
            </button>

            <button
              onClick={() => setActiveTab("identity")}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "identity"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Identity &amp; Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "skills"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>Tech Stack</span>
            </button>

            <button
              onClick={() => setActiveTab("inbox")}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "inbox"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>Inquiries</span>
              </div>
              {unreadCount > 0 && (
                <span className="label-mono rounded-full bg-accent-blue px-2 py-0.5 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <p className="label-mono text-accent-blue">
                  <ScrambleText text="Dashboard // Telemetry" />
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  System Overview
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage projects, appearance toggles, and view form submissions.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04, duration: 0.28 }}
                  data-spotlight-card
                  className="relative overflow-hidden rounded-lg border border-border bg-card p-5"
                >
                  <ArchitecturalSpotlightLayer />
                  <span className="pointer-events-none absolute top-2 right-2.5 font-mono text-[9px] text-accent-blue opacity-60">
                    +
                  </span>
                  <div className="relative z-10 flex items-center justify-between text-muted-foreground">
                    <span className="label-mono">LIVE PROJECTS</span>
                    <FolderGit2 className="h-4 w-4 text-accent-blue" />
                  </div>
                  <div className="relative z-10 mt-3 text-3xl font-semibold text-foreground">
                    {publishedProjects.length}
                  </div>
                  <div className="relative z-10 mt-1 text-xs text-muted-foreground">
                    {unpublishedProjects.length} unpublished / in draft
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.28 }}
                  data-spotlight-card
                  className="relative overflow-hidden rounded-lg border border-border bg-card p-5"
                >
                  <ArchitecturalSpotlightLayer />
                  <span className="pointer-events-none absolute top-2 right-2.5 font-mono text-[9px] text-accent-blue opacity-60">
                    +
                  </span>
                  <div className="relative z-10 flex items-center justify-between text-muted-foreground">
                    <span className="label-mono">FEATURED</span>
                    <Star className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="relative z-10 mt-3 text-3xl font-semibold text-foreground">
                    {projects.filter((p) => p.featured && p.published !== false).length}
                  </div>
                  <div className="relative z-10 mt-1 text-xs text-muted-foreground">
                    Rendered on home page
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.28 }}
                  data-spotlight-card
                  className="relative overflow-hidden rounded-lg border border-border bg-card p-5"
                >
                  <ArchitecturalSpotlightLayer />
                  <span className="pointer-events-none absolute top-2 right-2.5 font-mono text-[9px] text-accent-blue opacity-60">
                    +
                  </span>
                  <div className="relative z-10 flex items-center justify-between text-muted-foreground">
                    <span className="label-mono">TECH STACK</span>
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="relative z-10 mt-3 text-3xl font-semibold text-foreground">{skills.length}</div>
                  <div className="relative z-10 mt-1 text-xs text-muted-foreground">Documented tools</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.28 }}
                  data-spotlight-card
                  className="relative overflow-hidden rounded-lg border border-border bg-card p-5"
                >
                  <ArchitecturalSpotlightLayer />
                  <span className="pointer-events-none absolute top-2 right-2.5 font-mono text-[9px] text-accent-blue opacity-60">
                    +
                  </span>
                  <div className="relative z-10 flex items-center justify-between text-muted-foreground">
                    <span className="label-mono">INBOX INQUIRIES</span>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="relative z-10 mt-3 text-3xl font-semibold text-foreground">{messages.length}</div>
                  <div className="relative z-10 mt-1 text-xs text-accent-blue">{unreadCount} unread message(s)</div>
                </motion.div>
              </div>

              {/* Quick Visibility Controls & Recent Messages */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <h3 className="label-mono text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-accent-blue" />
                    Section Visibility Toggles
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          &quot;Available for Hire&quot; Badge
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Renders live availability badge in the hero
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={ui.showAvailability}
                        onChange={(e) => setUi({ ...ui, showAvailability: e.target.checked })}
                        className="h-4 w-4 accent-foreground rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          GitHub Live Feeds Section
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Shows repository list and commit activity on home
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={ui.showGitHubStats}
                        onChange={(e) => setUi({ ...ui, showGitHubStats: e.target.checked })}
                        className="h-4 w-4 accent-foreground rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Writing &amp; Engineering Blog
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Enables article listing and routing
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={ui.showBlog}
                        onChange={(e) => setUi({ ...ui, showBlog: e.target.checked })}
                        className="h-4 w-4 accent-foreground rounded"
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleSaveUi}
                    disabled={saving}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Toggles</span>
                  </button>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="label-mono text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-accent-blue" />
                      Recent Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab("inbox")}
                      className="text-xs text-accent-blue hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No contact messages received yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {messages.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          className="rounded-md border border-border bg-background p-3 text-xs"
                        >
                          <div className="flex items-center justify-between text-muted-foreground mb-1">
                            <span className="font-medium text-foreground">{m.name}</span>
                            <span className="font-mono text-[10px]">
                              {new Date(m.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-muted-foreground">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & PUBLISHING */}
          {activeTab === "projects" && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="label-mono text-accent-blue">Catalogue</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                    Project Management
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Publish, unpublish, feature, and edit portfolio projects.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("github")}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-accent hover:border-foreground/25"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Import Repo</span>
                  </button>
                  <button
                    onClick={() => setShowNewProjectModal(true)}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Project</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setProjectFilter("all")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      projectFilter === "all"
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({projects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter("published")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      projectFilter === "published"
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Published ({publishedProjects.length})
                  </button>
                  <button
                    onClick={() => setProjectFilter("drafts")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      projectFilter === "drafts"
                        ? "bg-foreground text-background"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Unpublished / Drafts ({unpublishedProjects.length})
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground w-full sm:w-60 focus-visible:outline-2 focus-visible:outline-ring"
                />
              </div>

              {/* Mobile Cards View (Phones & Small Tablets) */}
              <div className="space-y-3 block md:hidden">
                {filteredProjects.map((p) => {
                  const isPub = p.published !== false;
                  return (
                    <div
                      key={p.slug}
                      className="rounded-lg border border-border bg-card p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {p.name}
                          </h4>
                          <p className="font-mono text-xs text-muted-foreground">
                            /{p.slug}
                          </p>
                        </div>
                        <span className="label-mono uppercase text-[10px] text-muted-foreground shrink-0 border border-border px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={p.status} />
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono transition ${
                            p.featured
                              ? "bg-accent text-accent-blue font-medium"
                              : "text-muted-foreground border border-border"
                          }`}
                        >
                          <Star className={`h-3 w-3 ${p.featured ? "fill-accent-blue" : ""}`} />
                          <span>{p.featured ? "Featured" : "Regular"}</span>
                        </button>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleTogglePublished(p.slug, isPub)}
                          className={`label-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
                            isPub
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                              : "border-border bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              isPub ? "bg-emerald-500" : "bg-muted-foreground"
                            }`}
                          />
                          <span>{isPub ? "Published" : "Draft (Unpublished)"}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {isPub && (
                            <a
                              href={`/projects/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"
                              title="View Case Study"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleTogglePublished(p.slug, isPub)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-foreground"
                            title={isPub ? "Unpublish" : "Publish"}
                          >
                            {isPub ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <FileCheck2 className="h-4 w-4 text-emerald-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProject(p.slug)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tablet & Desktop Table View */}
              <div className="hidden md:block rounded-lg border border-border bg-card overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">PROJECT &amp; SLUG</th>
                      <th className="py-3 px-4">DISCIPLINE</th>
                      <th className="py-3 px-4">HONEST STATUS</th>
                      <th className="py-3 px-4">VISIBILITY</th>
                      <th className="py-3 px-4">FEATURED</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProjects.map((p) => {
                      const isPub = p.published !== false;
                      return (
                        <tr key={p.slug} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground text-sm">{p.name}</div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                              /{p.slug}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="label-mono uppercase text-muted-foreground">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleTogglePublished(p.slug, isPub)}
                              title={isPub ? "Click to unpublish" : "Click to publish live"}
                              className={`label-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
                                isPub
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium"
                                  : "border-border bg-muted/40 text-muted-foreground hover:border-foreground/30"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isPub ? "bg-emerald-500" : "bg-muted-foreground"
                                }`}
                              />
                              <span>{isPub ? "Published" : "Unpublished"}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono transition ${
                                p.featured
                                  ? "bg-accent text-accent-blue font-medium"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <Star className={`h-3 w-3 ${p.featured ? "fill-accent-blue" : ""}`} />
                              <span>{p.featured ? "Featured" : "No"}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isPub && (
                                <a
                                  href={`/projects/${p.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded p-1 text-muted-foreground hover:text-foreground"
                                  title="View Case Study"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleTogglePublished(p.slug, isPub)}
                                className="rounded p-1 text-muted-foreground hover:text-foreground"
                                title={isPub ? "Unpublish from site" : "Publish to site"}
                              >
                                {isPub ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <FileCheck2 className="h-4 w-4 text-emerald-500" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.slug)}
                                className="rounded p-1 text-muted-foreground hover:text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB SYNC & 1-CLICK IMPORTER */}
          {activeTab === "github" && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <p className="label-mono text-accent-blue">Integration</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  GitHub Repository Synchronizer
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse and import repositories directly into your portfolio catalogue.
                </p>
              </div>

              {/* Custom Repo Lookup */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="label-mono text-muted-foreground mb-2">Import any repository</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customRepoInput}
                    onChange={(e) => setCustomRepoInput(e.target.value)}
                    placeholder="e.g. taiwoade-hub/repository-name"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  />
                  <button
                    onClick={() => handlePreviewGhRepo(customRepoInput)}
                    disabled={!customRepoInput || ghLoading}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Inspect
                  </button>
                </div>
              </div>

              {/* Selected Draft Card */}
              {selectedRepoDraft && (
                <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-accent-blue flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      Ready to Import
                    </span>
                    <button
                      onClick={() => setSelectedRepoDraft(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">
                        {selectedRepoDraft.name}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground mt-0.5">
                        /{selectedRepoDraft.slug}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedRepoDraft.tagline}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-mono text-foreground capitalize">
                          {selectedRepoDraft.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Cover variant:</span>
                        <span className="font-mono text-foreground capitalize">
                          {selectedRepoDraft.cover}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedRepoDraft.tech.map((t: string) => (
                          <span
                            key={t}
                            className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleCommitImportDraft(selectedRepoDraft)}
                      disabled={saving}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:opacity-90 w-full sm:w-auto"
                    >
                      <Check className="h-4 w-4" />
                      <span>Confirm &amp; Add to Portfolio</span>
                    </button>
                    <button
                      onClick={() => setSelectedRepoDraft(null)}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 text-xs text-muted-foreground hover:text-foreground w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Repositories Grid */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Repositories on Account ({site.githubUsername || "taiwoade-hub"})
                  </h3>
                  <button
                    onClick={handleFetchGitHubRepos}
                    disabled={ghLoading}
                    className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
                  >
                    <RefreshCw className={`h-3 w-3 ${ghLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {ghLoading && (
                  <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                    Querying GitHub API...
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ghRepos.map((repo) => {
                    const existing = projects.find(
                      (p) => p.repo === repo.name || p.slug === repo.name.toLowerCase()
                    );
                    const alreadyImported = Boolean(existing);
                    const isPub = existing ? existing.published !== false : false;

                    return (
                      <div
                        key={repo.name}
                        className="rounded-lg border border-border bg-background p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-foreground">
                              {repo.name}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                              <Star className="h-3 w-3 text-accent-blue" />
                              <span>{repo.stars}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {repo.description || "No description provided."}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {repo.language && (
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-foreground">
                                {repo.language}
                              </span>
                            )}
                            {repo.topics.slice(0, 3).map((t: string) => (
                              <span
                                key={t}
                                className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                          <span className="label-mono text-[10px] text-muted-foreground">
                            {alreadyImported
                              ? isPub
                                ? "Published Live"
                                : "Unpublished / Draft"
                              : "Not in catalogue"}
                          </span>

                          <div className="flex items-center gap-2">
                            {alreadyImported && existing && (
                              <button
                                onClick={() => handleTogglePublished(existing.slug, isPub)}
                                className="label-mono text-[10px] text-accent-blue hover:underline"
                              >
                                {isPub ? "Unpublish" : "Publish"}
                              </button>
                            )}
                            {!alreadyImported && (
                              <button
                                onClick={() => handlePreviewGhRepo(repo.name)}
                                className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
                              >
                                1-Click Import
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UI & APPEARANCE */}
          {activeTab === "ui" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <p className="label-mono text-accent-blue">Settings</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  UI &amp; Layout Controls
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure active theme and toggle visibility of home page sections.
                </p>
              </div>

              {/* Theme Selector */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="label-mono text-foreground">Theme Atmosphere</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { id: "slate", label: "Slate Minimal (Default)", desc: "Warm editorial dark and light tones" },
                    { id: "obsidian", label: "Obsidian", desc: "True dark OLED background" },
                    { id: "monochrome", label: "Monochrome", desc: "High contrast pure grayscale" },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setUi({ ...ui, activeTheme: preset.id as any })}
                      className={`flex flex-col text-left p-4 rounded-lg border transition-all ${
                        ui.activeTheme === preset.id
                          ? "border-foreground bg-accent"
                          : "border-border bg-background hover:border-foreground/25"
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-sm text-foreground mb-1">
                        <span>{preset.label}</span>
                        {ui.activeTheme === preset.id && <Check className="h-4 w-4 text-accent-blue" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Toggles */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="label-mono text-foreground">Section Visibility</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Availability Hero Badge
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Show &quot;open to internships and collaboration&quot; badge
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ui.showAvailability}
                      onChange={(e) => setUi({ ...ui, showAvailability: e.target.checked })}
                      className="h-4 w-4 accent-foreground rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        GitHub Live Feeds Section
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Show verified public repositories and commit activity
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ui.showGitHubStats}
                      onChange={(e) => setUi({ ...ui, showGitHubStats: e.target.checked })}
                      className="h-4 w-4 accent-foreground rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Tech Stack Section
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Display categorized skill matrix
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ui.showStack}
                      onChange={(e) => setUi({ ...ui, showStack: e.target.checked })}
                      className="h-4 w-4 accent-foreground rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-md border border-border bg-background p-3.5 cursor-pointer">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Writing &amp; Blog Section
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Display articles on homepage and in navigation
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={ui.showBlog}
                      onChange={(e) => setUi({ ...ui, showBlog: e.target.checked })}
                      className="h-4 w-4 accent-foreground rounded"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveUi}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save UI Settings"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: IDENTITY & BIO */}
          {activeTab === "identity" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <p className="label-mono text-accent-blue">Profile</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  Personal Identity &amp; Bio
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update public names, headlines, introduction text, and social links.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-mono mb-1.5 block text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={site.name}
                      onChange={(e) => setSite({ ...site, name: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    />
                  </div>
                  <div>
                    <label className="label-mono mb-1.5 block text-muted-foreground">
                      Location
                    </label>
                    <input
                      type="text"
                      value={site.location}
                      onChange={(e) => setSite({ ...site, location: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-mono mb-1.5 block text-muted-foreground">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={site.headline}
                    onChange={(e) => setSite({ ...site, headline: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  />
                </div>

                <div>
                  <label className="label-mono mb-1.5 block text-muted-foreground">
                    Intro Statement
                  </label>
                  <textarea
                    rows={4}
                    value={site.intro}
                    onChange={(e) => setSite({ ...site, intro: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label-mono mb-1.5 block text-muted-foreground">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      value={site.githubUsername || ""}
                      onChange={(e) => setSite({ ...site, githubUsername: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    />
                  </div>
                  <div>
                    <label className="label-mono mb-1.5 block text-muted-foreground">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={site.contactEmail || ""}
                      onChange={(e) => setSite({ ...site, contactEmail: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    />
                  </div>
                  <div>
                    <label className="label-mono mb-1.5 block text-muted-foreground">
                      CV File Path
                    </label>
                    <input
                      type="text"
                      value={site.cvPath}
                      onChange={(e) => setSite({ ...site, cvPath: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveSite}
                    disabled={saving}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TECH STACK */}
          {activeTab === "skills" && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <p className="label-mono text-accent-blue">Expertise</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  Tech Stack Catalogue
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Document technologies grouped honestly by proficiency level.
                </p>
              </div>

              {/* Add Skill Form */}
              <form
                onSubmit={handleAddSkill}
                className="rounded-lg border border-border bg-card p-5 grid grid-cols-1 sm:grid-cols-5 gap-3"
              >
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Group</label>
                  <select
                    value={newSkill.groupId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const title =
                        id === "languages"
                          ? "Languages"
                          : id === "frontend"
                          ? "Frontend"
                          : id === "backend"
                          ? "Backend & Databases"
                          : id === "devops"
                          ? "DevOps & Cloud"
                          : "Security & Automation";
                      setNewSkill({ ...newSkill, groupId: id, groupTitle: title });
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="languages">Languages</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend &amp; DB</option>
                    <option value="devops">DevOps &amp; Cloud</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Docker"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="label-mono mb-1 block text-muted-foreground">Context Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Used for isolated container deployments"
                    value={newSkill.note}
                    onChange={(e) => setNewSkill({ ...newSkill, note: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="label-mono mb-1 block text-muted-foreground">Level</label>
                    <select
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="core">Core</option>
                      <option value="working">Working</option>
                      <option value="exploring">Exploring</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </form>

              {/* Skills Grid */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-md border border-border bg-background p-3.5 flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground">{s.name}</span>
                          <span className="label-mono text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.2">
                            {s.level}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                        <span className="font-mono text-[10px] text-muted-foreground/60 mt-1 block">
                          Group: {s.groupTitle}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INBOX */}
          {activeTab === "inbox" && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <p className="label-mono text-accent-blue">Contact</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  Inquiries ({messages.length})
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Real submissions received from your portfolio contact form.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center text-muted-foreground text-sm">
                  Inbox is currently empty.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-lg border p-5 transition ${
                        m.read
                          ? "border-border bg-card/60 text-muted-foreground"
                          : "border-foreground/30 bg-card shadow-sm text-foreground"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3 mb-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-sm text-foreground">{m.name}</span>
                            <span className="text-xs text-muted-foreground font-mono truncate">
                              ({m.email})
                            </span>
                            {!m.read && (
                              <span className="label-mono rounded-full bg-accent-blue px-2 py-0.2 text-[10px] font-semibold text-white">
                                NEW
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-muted-foreground block mt-0.5">
                            {new Date(m.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`mailto:${m.email}?subject=Re: Portfolio Inquiry`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-accent"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Reply</span>
                          </a>
                          <button
                            onClick={() => handleToggleMessageRead(m.id, m.read)}
                            className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs text-muted-foreground hover:text-foreground"
                          >
                            {m.read ? "Mark Unread" : "Mark Read"}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="rounded p-1.5 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Manual New Project Modal */}
      <AnimatePresence>
      {showNewProjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-3 sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full max-w-2xl rounded-lg border border-border bg-card p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Add Portfolio Project</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                      setNewProject({ ...newProject, name, slug });
                    }}
                    placeholder="e.g. Order of Service"
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  />
                </div>
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={newProject.slug}
                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                    placeholder="order-of-service"
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono mb-1 block text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  required
                  value={newProject.tagline}
                  onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                  placeholder="One-line positioning statement"
                  className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                />
              </div>

              <div>
                <label className="label-mono mb-1 block text-muted-foreground">Summary</label>
                <textarea
                  rows={2}
                  value={newProject.summary}
                  onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                  placeholder="Two-sentence card description"
                  className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({ ...newProject, category: e.target.value as ProjectCategory })
                    }
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  >
                    <option value="software">Software</option>
                    <option value="security">Security</option>
                    <option value="ai">AI &amp; Automation</option>
                    <option value="devops">DevOps</option>
                    <option value="trading">Trading</option>
                  </select>
                </div>

                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({ ...newProject, status: e.target.value as ProjectStatus })
                    }
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="in-development">In Development</option>
                    <option value="experimental">Experimental</option>
                    <option value="concept">Concept</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>

                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">Cover Art</label>
                  <select
                    value={newProject.cover}
                    onChange={(e) =>
                      setNewProject({ ...newProject, cover: e.target.value as CoverVariant })
                    }
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  >
                    <option value="terminal">Terminal</option>
                    <option value="nodes">Nodes</option>
                    <option value="window">Window</option>
                    <option value="rings">Rings</option>
                    <option value="pipeline">Pipeline</option>
                    <option value="market">Market</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">
                    GitHub Repo Name
                  </label>
                  <input
                    type="text"
                    value={newProject.repo || ""}
                    onChange={(e) => setNewProject({ ...newProject, repo: e.target.value })}
                    placeholder="order-of-service"
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  />
                </div>
                <div>
                  <label className="label-mono mb-1 block text-muted-foreground">
                    Live URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newProject.liveUrl || ""}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono mb-1 block text-muted-foreground">
                  Tech Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    setNewProject({
                      ...newProject,
                      tech: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    });
                  }}
                  placeholder="TypeScript, Next.js, SQLite"
                  className="w-full rounded-md border border-input bg-background p-2.5 text-foreground"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProject.published !== false}
                    onChange={(e) => setNewProject({ ...newProject, published: e.target.checked })}
                    className="h-4 w-4 accent-foreground rounded"
                  />
                  <span className="text-foreground">Publish to Portfolio immediately</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProject.featured}
                    onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    className="h-4 w-4 accent-foreground rounded"
                  />
                  <span className="text-foreground">Feature on Home Page</span>
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="rounded-md border border-border px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground hover:opacity-90"
                >
                  Save Project
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
