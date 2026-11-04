"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Download,
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Printer,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { DitheringShape } from "@paper-design/shaders";
import { KineticTilt } from "@/components/motion/kinetic-tilt";
import { site } from "@/lib/site";

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-zinc-500">
        Loading shader...
      </div>
    ),
  }
);

/** Error boundary to prevent any WebGL crash from breaking the page */
class ShaderErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[ShaderErrorBoundary] WebGL error, using 2D canvas fallback:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/** 100% reliable 2D canvas fallback for mobile browsers where WebGL is limited */
function ShaderCanvasFallback({
  shape,
  isDarkMode,
}: {
  shape: DitheringShape;
  isDarkMode: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width || 360);
      const h = Math.floor(rect.height || 340);
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = isDarkMode ? "#09090b" : "#f4f4f5";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = isDarkMode ? "#3b82f6" : "#1d4ed8";
      const step = 8;
      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const nx = (x / cols) * 2 - 1;
          const ny = (y / rows) * 2 - 1;
          let val = 0;

          if (shape === "wave") {
            val = Math.sin(nx * 4 + t) * Math.cos(ny * 4 + t * 0.8);
          } else if (shape === "sphere") {
            const d = Math.sqrt(nx * nx + ny * ny);
            val = d < 0.75 ? Math.cos(d * 4 - t) : -1;
          } else if (shape === "swirl") {
            const angle = Math.atan2(ny, nx);
            const dist = Math.sqrt(nx * nx + ny * ny);
            val = Math.sin(angle * 3 + dist * 6 - t);
          } else if (shape === "ripple") {
            const dist = Math.sqrt(nx * nx + ny * ny);
            val = Math.sin(dist * 14 - t * 2.5);
          } else if (shape === "warp") {
            val = Math.sin(nx * 3 + Math.sin(ny * 3 + t) + t);
          } else {
            val = Math.sin(nx * 3.5 + t) + Math.cos(ny * 3.5 - t * 0.7);
          }

          if (val > 0.05) {
            const dotSize = Math.min(step - 1.5, Math.max(1.5, (val + 1) * 2.4));
            ctx.fillRect(
              x * step + (step - dotSize) / 2,
              y * step + (step - dotSize) / 2,
              dotSize,
              dotSize
            );
          }
        }
      }

      ctx.restore();
      t += 0.035;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [shape, isDarkMode]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

type MilestoneCategory = "ALL" | "SYSTEMS" | "SECURITY" | "INFRA";

interface CvMilestone {
  id: string;
  code: string;
  title: string;
  role: string;
  period: string;
  category: Exclude<MilestoneCategory, "ALL">;
  status: string;
  summary: string;
  highlights: string[];
  stack: string[];
  nodes: [string, string, string];
  metrics: { label: string; value: string }[];
  href?: string;
}

const CV_MILESTONES: CvMilestone[] = [
  {
    id: "verify-hub",
    code: "SYS_01",
    title: "Verify Hub",
    role: "Identity & Automated Risk Pipeline",
    period: "2024 → Present",
    category: "SECURITY",
    status: "IN DEVELOPMENT",
    summary:
      "Automated website verification and evidence pipeline combining headless browser inspection, GitHub repository heuristics, and Telegram alerting.",
    highlights: [
      "Engineered Playwright headless inspection workers capturing DOM, TLS, and redirect chains.",
      "Built deterministic risk-scoring rules evaluating domain age, repo activity, and security headers.",
      "Integrated real-time Telegram bot dispatch for instant verification dossiers.",
    ],
    stack: ["Python", "Playwright", "GitHub API", "Telegram Bot", "AsyncIO"],
    nodes: ["Target URL / Repo", "Playwright Inspector", "Signed Risk Dossier"],
    metrics: [
      { label: "PIPELINE", value: "HEADLESS + API" },
      { label: "LATENCY", value: "< 4.2s AVG" },
      { label: "OUTPUT", value: "VERIFIED JSON" },
    ],
    href: "/projects/verify-hub",
  },
  {
    id: "order-of-service",
    code: "SYS_02",
    title: "Order of Service",
    role: "Real-Time Document & Layout Engine",
    period: "2024 → Present",
    category: "SYSTEMS",
    status: "IN DEVELOPMENT",
    summary:
      "Structured event-program builder featuring a synchronized split-pane editor, strict typography tokens, and print-ready A4 pagination.",
    highlights: [
      "Architected deterministic block state management with zero-lag live preview rendering.",
      "Designed Swiss-editorial print stylesheets and structured section reordering.",
      "Built reusable template schemas for rapid multi-section programme publishing.",
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS", "React 19"],
    nodes: ["Schema Editor", "State Sync Engine", "Print-Ready DOM"],
    metrics: [
      { label: "RENDER", value: "SPLIT-PANE" },
      { label: "TYPOGRAPHY", value: "EDITORIAL" },
      { label: "EXPORT", value: "PRINT / PDF" },
    ],
    href: "/projects/order-of-service",
  },
  {
    id: "cloud-infra",
    code: "SYS_03",
    title: "Self-Hosted Cloud Lab",
    role: "Linux Infrastructure & Deployment PaaS",
    period: "2023 → Present",
    category: "INFRA",
    status: "ACTIVE · ONGOING",
    summary:
      "Self-hosted Ubuntu production server orchestrated with Coolify and Docker, isolating public web apps from internal Postgres, Redis, and worker containers.",
    highlights: [
      "Configured automated GitHub webhook build pipelines with zero-downtime container swaps.",
      "Hardened Ubuntu host with UFW firewall rules, SSH key-only auth, and TLS termination.",
      "Isolated internal bridge networks for PostgreSQL, Redis, and background bot workers.",
    ],
    stack: ["Ubuntu LTS", "Coolify", "Docker", "PostgreSQL", "Redis", "Caddy/Traefik"],
    nodes: ["GitHub Webhook", "Coolify Build Engine", "Isolated Docker Net"],
    metrics: [
      { label: "INGRESS", value: "TLS 1.3 PROXY" },
      { label: "ISOLATION", value: "PRIVATE BRIDGE" },
      { label: "DEPLOY", value: "AUTO WEBHOOK" },
    ],
    href: "/stack",
  },
  {
    id: "alchemist",
    code: "SYS_04",
    title: "Alchemist Market Engine",
    role: "Algorithmic Structure & FVG Scanner",
    period: "2024 → Present",
    category: "SYSTEMS",
    status: "IN DEVELOPMENT",
    summary:
      "Quantitative Python analysis engine that programmatically identifies Break of Structure (BOS), Change of Character (CHOCH), and Fair Value Gaps across OHLCV feeds.",
    highlights: [
      "Implemented vectorized swing-high/low state machines for multi-timeframe structure mapping.",
      "Automated Fair Value Gap (FVG) mitigation tracking and liquidity sweep alerts.",
      "Structured backtesting telemetry with clean JSON/CSV audit logs.",
    ],
    stack: ["Python", "Pandas", "Algorithmic Analysis", "Data Pipelines"],
    nodes: ["OHLCV Feed", "BOS / FVG Detector", "Signal Telemetry"],
    metrics: [
      { label: "ENGINE", value: "VECTORIZED PY" },
      { label: "DETECTION", value: "BOS · CHOCH · FVG" },
      { label: "AUDIT", value: "DETERMINISTIC" },
    ],
    href: "/projects/alchemist",
  },
  {
    id: "miro-bot",
    code: "SYS_05",
    title: "Miro AI & Media Bot",
    role: "Async Automation & LLM Worker",
    period: "2024 → Present",
    category: "SYSTEMS",
    status: "IN DEVELOPMENT",
    summary:
      "Asynchronous Telegram automation assistant handling media extraction, queue-controlled processing, and LLM-assisted summarization.",
    highlights: [
      "Built resilient async task queues with per-user rate limiting and graceful error recovery.",
      "Automated media pipeline cleanup to keep container disk footprint minimal.",
      "Packaged as a stateless Docker service deployed on the self-hosted Linux lab.",
    ],
    stack: ["Python", "AsyncIO", "Telegram API", "Docker", "LLM Tooling"],
    nodes: ["Telegram Ingress", "Async Task Queue", "Media / AI Output"],
    metrics: [
      { label: "RUNTIME", value: "PYTHON ASYNC" },
      { label: "QUEUE", value: "RATE-LIMITED" },
      { label: "HOST", value: "DOCKER NODE" },
    ],
    href: "/projects/miro",
  },
  {
    id: "cybersecurity-bsc",
    code: "SYS_06",
    title: "BSc Cybersecurity",
    role: "Undergraduate Degree & Security Research",
    period: "2022 → 2026",
    category: "SECURITY",
    status: "UNDERGRADUATE",
    summary:
      "Formal training in network defense, threat modeling, cryptography, and secure systems engineering paired with hands-on Python security tooling.",
    highlights: [
      "Focused on web application security (OWASP), network protocol analysis, and Linux hardening.",
      "Applied defensive engineering principles directly to every full-stack and DevOps project.",
      "Actively seeking Software Engineering, Cybersecurity, or DevOps internships & graduate roles.",
    ],
    stack: ["Network Security", "Threat Modeling", "Linux Hardening", "OWASP", "Cryptography"],
    nodes: ["Threat Model", "Defensive Controls", "Verified System"],
    metrics: [
      { label: "DEGREE", value: "B.SC. CYBERSEC" },
      { label: "TIMELINE", value: "2022 — 2026" },
      { label: "STATUS", value: "FINAL YEAR" },
    ],
  },
];

type SkillTier = "ALL" | "CORE" | "WORKING" | "EXPLORING";

const CAPABILITY_GROUPS: {
  group: string;
  items: { name: string; tier: Exclude<SkillTier, "ALL"> }[];
}[] = [
  {
    group: "Languages & Runtime",
    items: [
      { name: "Python", tier: "CORE" },
      { name: "TypeScript", tier: "CORE" },
      { name: "JavaScript (ES2024)", tier: "CORE" },
      { name: "SQL", tier: "WORKING" },
      { name: "Bash / Shell", tier: "WORKING" },
    ],
  },
  {
    group: "Web & Backend Systems",
    items: [
      { name: "Next.js (App Router)", tier: "CORE" },
      { name: "React 19", tier: "CORE" },
      { name: "Tailwind CSS", tier: "CORE" },
      { name: "FastAPI / REST", tier: "WORKING" },
      { name: "Node.js", tier: "WORKING" },
    ],
  },
  {
    group: "DevOps & Infrastructure",
    items: [
      { name: "Docker & Compose", tier: "CORE" },
      { name: "Linux (Ubuntu LTS)", tier: "CORE" },
      { name: "Coolify PaaS", tier: "WORKING" },
      { name: "GitHub Actions CI/CD", tier: "WORKING" },
      { name: "PostgreSQL & Redis", tier: "WORKING" },
    ],
  },
  {
    group: "Security & Automation",
    items: [
      { name: "Playwright Automation", tier: "CORE" },
      { name: "Web Security / OWASP", tier: "CORE" },
      { name: "Telegram Bot APIs", tier: "CORE" },
      { name: "Network Defense", tier: "WORKING" },
      { name: "AI / LLM Workflows", tier: "EXPLORING" },
    ],
  },
];

export interface ResumePageProps {
  initialDarkMode?: boolean;
}

export default function ResumePage({ initialDarkMode = true }: ResumePageProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [shaderShape, setShaderShape] = useState<DitheringShape>("wave");

  // Interactive CV state
  const [categoryFilter, setCategoryFilter] = useState<MilestoneCategory>("ALL");
  const [selectedId, setSelectedId] = useState<string>(CV_MILESTONES[0].id);
  const [skillTier, setSkillTier] = useState<SkillTier>("ALL");
  const [rightPanelMode, setRightPanelMode] = useState<"dossier" | "sheet">("dossier");
  const [scanningSheet, setScanningSheet] = useState(false);

  useEffect(() => {
    let glSupported = true;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2");
      if (!gl) glSupported = false;
    } catch {
      glSupported = false;
    }
    const raf = window.requestAnimationFrame(() => {
      setMounted(true);
      setWebglSupported(glSupported);
    });
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : initialDarkMode;

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const filteredMilestones = CV_MILESTONES.filter((m) =>
    categoryFilter === "ALL" ? true : m.category === categoryFilter
  );

  const selectedMilestone =
    CV_MILESTONES.find((m) => m.id === selectedId) ?? CV_MILESTONES[0];

  const selectedIndex = CV_MILESTONES.findIndex((m) => m.id === selectedMilestone.id);

  const stepMilestone = (dir: -1 | 1) => {
    const nextIdx = (selectedIndex + dir + CV_MILESTONES.length) % CV_MILESTONES.length;
    setSelectedId(CV_MILESTONES[nextIdx].id);
  };

  const triggerSheetScan = () => {
    setScanningSheet(true);
    window.setTimeout(() => setScanningSheet(false), 1200);
  };

  const shapes: DitheringShape[] = ["wave", "sphere", "simplex", "warp", "swirl", "ripple"];

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row select-none">
      {/* ── Left Interactive CV Ledger Panel ──────────────────────────── */}
      <div
        className={`w-full lg:w-[54%] p-6 sm:p-10 md:p-12 font-mono relative z-10 flex flex-col justify-between transition-colors duration-300 min-h-screen ${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div>
          {/* Top Navigation & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-current/15">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity hover:opacity-75 ${
                  isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Portfolio</span>
              </Link>
              <span className="opacity-25">/</span>
              <span className="text-[11px] uppercase tracking-widest opacity-60">
                DOC_REF // TA-CV-2026.V2
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] uppercase tracking-wider border transition-colors ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300"
                    : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                <Printer className="h-3 w-3" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <a
                href={site.cvPath}
                download
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] uppercase tracking-wider font-semibold transition-opacity hover:opacity-90 ${
                  isDarkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                <Download className="h-3 w-3" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 border ${
                  isDarkMode
                    ? "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-yellow-400"
                    : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-900"
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Identity Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-current opacity-80">
                Interactive · CV Dossier
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded border ${
                  isDarkMode
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-emerald-600/30 bg-emerald-50 text-emerald-700"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available · Internships &amp; Graduate Roles
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              {/* Circular Avatar with Clean Animation */}
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative shrink-0 group"
              >
                <motion.span
                  aria-hidden="true"
                  className={`absolute -inset-1 rounded-full border pointer-events-none ${
                    isDarkMode ? "border-zinc-700/60" : "border-zinc-300/80"
                  }`}
                  animate={{
                    scale: [1, 1.06, 1],
                    opacity: isDarkMode ? [0.4, 0.85, 0.4] : [0.3, 0.75, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 transition-transform duration-300 group-hover:scale-105 ${
                    isDarkMode
                      ? "border-zinc-600 bg-zinc-900 shadow-sm"
                      : "border-zinc-300 bg-zinc-100 shadow-sm"
                  }`}
                >
                  <Image
                    src="/profile.jpg"
                    alt={site.name}
                    width={64}
                    height={64}
                    priority
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
              </motion.div>

              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight uppercase">
                  {site.name}
                </h1>
                <h2 className="text-xs sm:text-sm font-normal opacity-80 tracking-wider uppercase mt-0.5">
                  Software Engineer · Cybersecurity · DevOps · AI Automation
                </h2>
                <p className="text-[11px] opacity-50 mt-0.5">
                  Based in {site.location} · taiwoadebola.app
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed opacity-75 max-w-2xl mt-3">
              Cybersecurity undergraduate and software engineer focused on building resilient web
              applications, automated verification pipelines, and self-hosted Linux cloud
              infrastructure. Select any system below to inspect its live architectural telemetry.
            </p>
          </div>

          {/* 01 // Interactive Systems & Milestones Explorer */}
          <div className="mb-9">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-current/20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-500">01</span>
                <span className="text-[11px] uppercase tracking-widest opacity-70">
                  Systems &amp; Career Milestones
                </span>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {(["ALL", "SYSTEMS", "SECURITY", "INFRA"] as MilestoneCategory[]).map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded transition-colors ${
                        active
                          ? "bg-blue-600 text-white font-semibold"
                          : isDarkMode
                          ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              {filteredMilestones.map((item) => {
                const isSelected = item.id === selectedMilestone.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setRightPanelMode("dossier");
                    }}
                    className={`group cursor-pointer rounded-lg border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? isDarkMode
                          ? "border-blue-500/80 bg-zinc-900/90"
                          : "border-blue-600/80 bg-blue-50/50"
                        : isDarkMode
                        ? "border-zinc-800/90 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/40"
                        : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-zinc-100/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                            isSelected
                              ? "border-blue-500 bg-blue-500/15 text-blue-400"
                              : "border-current/20 opacity-50"
                          }`}
                        >
                          {item.code}
                        </span>
                        <span className="font-semibold text-xs sm:text-sm">{item.title}</span>
                        <span className="hidden md:inline text-xs opacity-60">
                          — {item.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider border ${
                            isDarkMode
                              ? "border-zinc-700 bg-zinc-800/80 text-zinc-300"
                              : "border-zinc-300 bg-white text-zinc-700"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="opacity-50">{item.period}</span>
                      </div>
                    </div>

                    {/* Expanded inline details for the active milestone */}
                    <AnimatePresence initial={false}>
                      {isSelected ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2.5 text-xs leading-relaxed opacity-80">
                            {item.summary}
                          </p>
                          <ul className="mt-2 space-y-1 text-[11px] opacity-75">
                            {item.highlights.map((bullet) => (
                              <li key={bullet} className="flex items-start gap-2">
                                <span className="text-blue-500 font-bold">+</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-current/10">
                            <div className="flex flex-wrap gap-1.5">
                              {item.stack.map((tech) => (
                                <span
                                  key={tech}
                                  className={`text-[10px] px-2 py-0.5 rounded border ${
                                    isDarkMode
                                      ? "border-zinc-800 bg-black/60 text-zinc-300"
                                      : "border-zinc-200 bg-white text-zinc-700"
                                  }`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {item.href ? (
                              <Link
                                href={item.href}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:underline"
                              >
                                <span>Inspect Case Study</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            ) : null}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 02 // Interactive Technical Capabilities Matrix */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-current/20">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-500">02</span>
                <span className="text-[11px] uppercase tracking-widest opacity-70">
                  Technical Capabilities Matrix
                </span>
              </div>

              <div className="flex items-center gap-1">
                {(["ALL", "CORE", "WORKING", "EXPLORING"] as SkillTier[]).map((tier) => {
                  const active = skillTier === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSkillTier(tier)}
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded transition-colors ${
                        active
                          ? "bg-blue-600 text-white font-semibold"
                          : isDarkMode
                          ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "text-zinc-600 hover:text-black hover:bg-zinc-100"
                      }`}
                    >
                      {tier}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAPABILITY_GROUPS.map((group) => {
                const visibleItems = group.items.filter((i) =>
                  skillTier === "ALL" ? true : i.tier === skillTier
                );
                if (visibleItems.length === 0) return null;
                return (
                  <div
                    key={group.group}
                    className={`rounded-lg border p-3 ${
                      isDarkMode
                        ? "border-zinc-800/80 bg-zinc-950/60"
                        : "border-zinc-200 bg-zinc-50/70"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-widest opacity-55 mb-2">
                      {group.group}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {visibleItems.map((skill) => (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border ${
                            skill.tier === "CORE"
                              ? isDarkMode
                                ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                                : "border-blue-600/30 bg-blue-50 text-blue-800"
                              : isDarkMode
                              ? "border-zinc-800 bg-zinc-900 text-zinc-300"
                              : "border-zinc-200 bg-white text-zinc-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              skill.tier === "CORE"
                                ? "bg-blue-500"
                                : skill.tier === "WORKING"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 03 // Shader Geometry Controls */}
          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest opacity-50 mb-2.5">
              <Sparkles className="h-3 w-3" />
              <span>03 // Shader Field Geometry</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => setShaderShape(s)}
                  className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded transition-colors ${
                    shaderShape === s
                      ? isDarkMode
                        ? "bg-white text-black font-semibold"
                        : "bg-black text-white font-semibold"
                      : isDarkMode
                      ? "border border-zinc-800 hover:bg-zinc-900 text-zinc-400"
                      : "border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Footer Links Section */}
        <div className="pt-4 border-t border-current/20 hidden lg:flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={site.cvPath}
              download
              className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
            <Link href="/projects" className="opacity-70 hover:opacity-100 transition-opacity">
              Projects
            </Link>
            <Link href="/stack" className="opacity-70 hover:opacity-100 transition-opacity">
              Tech Stack
            </Link>
            <Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">
              Contact
            </Link>
          </div>

          <div className="opacity-40 text-[11px]">
            © {new Date().getFullYear()} {site.name}
          </div>
        </div>
      </div>

      {/* ── Right Interactive 3D Dossier & Shader Stage ───────────────── */}
      <div
        className={`w-full lg:w-[46%] relative min-h-[540px] lg:min-h-screen lg:sticky lg:top-0 lg:h-screen overflow-hidden flex flex-col justify-between p-5 sm:p-8 transition-colors duration-300 border-t lg:border-t-0 lg:border-l ${
          isDarkMode
            ? "bg-[#09090b] border-zinc-800"
            : "bg-[#f4f4f5] border-zinc-200"
        }`}
      >
        {/* Background WebGL / Canvas 2D Dithering Shader */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {mounted ? (
            webglSupported ? (
              <ShaderErrorBoundary
                fallback={<ShaderCanvasFallback shape={shaderShape} isDarkMode={isDarkMode} />}
              >
                <Dithering
                  style={{ width: "100%", height: "100%", display: "block" }}
                  colorBack={isDarkMode ? "#09090b" : "#f4f4f5"}
                  colorFront={isDarkMode ? "#3b82f6" : "#1d4ed8"}
                  shape={shaderShape}
                  type="4x4"
                  size={3}
                  offsetX={0}
                  offsetY={0}
                  scale={0.85}
                  rotation={0}
                  speed={0.12}
                />
              </ShaderErrorBoundary>
            ) : (
              <ShaderCanvasFallback shape={shaderShape} isDarkMode={isDarkMode} />
            )
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-xs font-mono ${
                isDarkMode ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              Initializing shader canvas...
            </div>
          )}
        </div>

        {/* Top Stage Mode Switcher HUD */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1 rounded-lg border p-1 backdrop-blur-md font-mono text-[11px] ${
              isDarkMode
                ? "border-white/15 bg-black/65 text-white"
                : "border-black/15 bg-white/80 text-zinc-900"
            }`}
          >
            <button
              type="button"
              onClick={() => setRightPanelMode("dossier")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                rightPanelMode === "dossier"
                  ? "bg-blue-600 text-white font-semibold"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>3D System Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRightPanelMode("sheet");
                triggerSheetScan();
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                rightPanelMode === "sheet"
                  ? "bg-blue-600 text-white font-semibold"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <FileText className="h-3 w-3" />
              <span>Live A4 Sheet</span>
            </button>
          </div>

          <div
            className={`px-2.5 py-1 rounded-md border text-[10px] font-mono uppercase tracking-widest backdrop-blur-md ${
              isDarkMode
                ? "border-white/15 bg-black/60 text-zinc-300"
                : "border-black/15 bg-white/80 text-zinc-700"
            }`}
          >
            {rightPanelMode === "dossier"
              ? `ACTIVE // ${selectedMilestone.code}`
              : "ISO 216 // A4 VECTOR"}
          </div>
        </div>

        {/* Center Floating 3D Orthographic Card Stage */}
        <div className="relative z-10 my-auto py-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {rightPanelMode === "dossier" ? (
              <motion.div
                key={`dossier-${selectedMilestone.id}`}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.26, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="w-full max-w-lg"
              >
                <KineticTilt maxDegrees={3.5}>
                  <div
                    className={`relative rounded-xl border p-5 sm:p-6 font-mono backdrop-blur-xl shadow-2xl transition-colors ${
                      isDarkMode
                        ? "border-white/20 bg-zinc-950/88 text-white"
                        : "border-black/15 bg-white/92 text-zinc-900"
                    }`}
                  >
                    {/* Corner CAD Registration Crosshairs */}
                    <span className="pointer-events-none absolute top-2.5 left-2.5 text-[10px] text-blue-500">
                      +
                    </span>
                    <span className="pointer-events-none absolute top-2.5 right-2.5 text-[10px] text-blue-500">
                      +
                    </span>
                    <span className="pointer-events-none absolute bottom-2.5 left-2.5 text-[10px] text-blue-500">
                      +
                    </span>
                    <span className="pointer-events-none absolute bottom-2.5 right-2.5 text-[10px] text-blue-500">
                      +
                    </span>

                    {/* Card Top Bar */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-current/15">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-500">
                          {`${selectedMilestone.code} // ARCHITECTURE TELEMETRY`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => stepMilestone(-1)}
                          aria-label="Previous milestone"
                          className="p-1 rounded border border-current/15 hover:border-blue-500 transition-colors"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => stepMilestone(1)}
                          aria-label="Next milestone"
                          className="p-1 rounded border border-current/15 hover:border-blue-500 transition-colors"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Period */}
                    <div className="mt-3.5 flex items-baseline justify-between gap-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                          {selectedMilestone.title}
                        </h3>
                        <p className="text-xs opacity-70">{selectedMilestone.role}</p>
                      </div>
                      <span className="text-[11px] opacity-60 shrink-0">
                        {selectedMilestone.period}
                      </span>
                    </div>

                    {/* Live Animated CAD Signal Schematic (3-Node Topology) */}
                    <div
                      className={`mt-4 rounded-lg border p-3.5 ${
                        isDarkMode
                          ? "border-zinc-800 bg-black/70"
                          : "border-zinc-200 bg-zinc-50/90"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-60 mb-2">
                        <span>LIVE TOPOLOGY SCHEMATIC</span>
                        <span className="text-emerald-500">● SIGNAL NOMINAL</span>
                      </div>

                      <svg
                        viewBox="0 0 420 74"
                        className="w-full h-auto overflow-visible"
                        role="img"
                        aria-label={`${selectedMilestone.title} topology`}
                      >
                        {/* Connecting Bus Lines */}
                        <line
                          x1="118"
                          y1="37"
                          x2="156"
                          y2="37"
                          stroke="currentColor"
                          strokeOpacity="0.3"
                          strokeDasharray="3 3"
                        />
                        <line
                          x1="264"
                          y1="37"
                          x2="302"
                          y2="37"
                          stroke="currentColor"
                          strokeOpacity="0.3"
                          strokeDasharray="3 3"
                        />

                        {/* Animated 1px Data Packets */}
                        <motion.circle
                          r="3"
                          fill="#3b82f6"
                          animate={{ cx: [118, 156], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                          cy="37"
                        />
                        <motion.circle
                          r="3"
                          fill="#3b82f6"
                          animate={{ cx: [264, 302], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.6,
                            delay: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          cy="37"
                        />

                        {/* 3 System Nodes */}
                        {selectedMilestone.nodes.map((nodeLabel, idx) => {
                          const x = idx === 0 ? 6 : idx === 1 ? 156 : 302;
                          return (
                            <g key={nodeLabel} transform={`translate(${x}, 12)`}>
                              <rect
                                width="112"
                                height="50"
                                rx="5"
                                fill={isDarkMode ? "#111115" : "#ffffff"}
                                stroke={idx === 1 ? "#3b82f6" : "currentColor"}
                                strokeOpacity={idx === 1 ? "0.9" : "0.25"}
                                strokeWidth={idx === 1 ? "1.5" : "1"}
                              />
                              <text
                                x="56"
                                y="21"
                                textAnchor="middle"
                                fill="#3b82f6"
                                fontSize="7.5"
                                fontFamily="monospace"
                              >
                                {`STAGE_0${idx + 1}`}
                              </text>
                              <text
                                x="56"
                                y="35"
                                textAnchor="middle"
                                fill="currentColor"
                                fontSize="8.5"
                                fontWeight="600"
                                fontFamily="monospace"
                              >
                                {nodeLabel}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* 3-Column Telemetry Strip */}
                    <div className="mt-3.5 grid grid-cols-3 gap-2">
                      {selectedMilestone.metrics.map((m) => (
                        <div
                          key={m.label}
                          className={`rounded border p-2 ${
                            isDarkMode
                              ? "border-zinc-800 bg-zinc-900/60"
                              : "border-zinc-200 bg-zinc-100/70"
                          }`}
                        >
                          <div className="text-[9px] uppercase tracking-wider opacity-55">
                            {m.label}
                          </div>
                          <div className="text-[11px] font-bold text-blue-500 mt-0.5 truncate">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Footer inside Card */}
                    <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between gap-2 text-[11px]">
                      <span className="opacity-65">
                         STATUS:{" "}
                        <strong className="text-foreground">{selectedMilestone.status}</strong>
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRightPanelMode("sheet");
                            triggerSheetScan();
                          }}
                          className="opacity-75 hover:opacity-100 underline underline-offset-4"
                        >
                          View on A4 Sheet
                        </button>
                        {selectedMilestone.href ? (
                          <Link
                            href={selectedMilestone.href}
                            className="inline-flex items-center gap-1 font-semibold text-blue-500 hover:underline"
                          >
                            <span>Open System</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </KineticTilt>
              </motion.div>
            ) : (
              /* Live 3D A4 Vector Sheet Preview inside Right Stage */
              <motion.div
                key="live-a4-sheet"
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.26, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="w-full max-w-md"
              >
                <KineticTilt maxDegrees={3}>
                  <div className="relative overflow-hidden rounded-lg border border-zinc-300 bg-[#fcfbf9] p-5 text-[#171718] shadow-2xl font-mono">
                    {/* Optional Laser Scan Sweep */}
                    {scanningSheet ? (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.15, ease: "linear" }}
                        className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-[#2461d1] shadow-[0_0_12px_rgba(37,99,235,0.6)]"
                      />
                    ) : null}

                    {/* Corner Registration Marks */}
                    <span className="pointer-events-none absolute top-2 left-2 text-[9px] text-[#2461d1]">
                      +
                    </span>
                    <span className="pointer-events-none absolute top-2 right-2 text-[9px] text-[#2461d1]">
                      +
                    </span>
                    <span className="pointer-events-none absolute bottom-2 left-2 text-[9px] text-[#2461d1]">
                      +
                    </span>
                    <span className="pointer-events-none absolute bottom-2 right-2 text-[9px] text-[#2461d1]">
                      +
                    </span>

                    <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-1.5 text-[8px] uppercase">
                      <span className="text-[#78787c]">DOC_REF // TA-CV-2026.V2</span>
                      <span className="rounded border border-[#2461d1] bg-[#eef5fe] px-1.5 py-0.5 font-bold text-[#2461d1]">
                        ATS-COMPLIANT A4
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-b-2 border-[#171718] pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center bg-[#171718] text-xs font-bold text-[#fcfbf9]">
                          TA
                        </div>
                        <div>
                          <div className="text-sm font-bold tracking-tight">TAIWO ADEBOLA</div>
                          <div className="text-[8px] font-semibold text-[#2461d1] uppercase">
                            Software Engineer · Cybersecurity · DevOps
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-[8px] text-[#5c5c60]">
                        <div>TAIWOADEBOLA.APP</div>
                        <div>NIGERIA · REMOTE</div>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <div className="text-[8px] font-bold text-[#2461d1] uppercase border-b border-[#d9d9d4] pb-0.5">
                        01 // SELECTED SYSTEMS (CLICK TO FOCUS)
                      </div>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        {CV_MILESTONES.slice(0, 4).map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedId(m.id);
                              setRightPanelMode("dossier");
                            }}
                            className="text-left border border-[#d9d9d4] border-l-2 border-l-[#2461d1] bg-white p-1.5 hover:bg-[#eef5fe]/60 transition-colors"
                          >
                            <div className="text-[9px] font-bold text-[#171718] truncate">
                              {m.title}
                            </div>
                            <div className="text-[7.5px] text-[#2461d1] truncate">
                              {m.stack.slice(0, 3).join(" · ")}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#d9d9d4] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={triggerSheetScan}
                        className="px-2 py-1 text-[9px] font-semibold border border-[#171718] hover:bg-[#171718] hover:text-white transition-colors"
                      >
                        RE-SCAN A4 SHEET
                      </button>
                      <a
                        href={site.cvPath}
                        download
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-semibold bg-[#2461d1] text-white hover:opacity-90 transition-opacity"
                      >
                        <Download className="h-2.5 w-2.5" />
                        <span>DOWNLOAD VECTOR PDF</span>
                      </a>
                    </div>
                  </div>
                </KineticTilt>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Shader Telemetry Badge */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
          <span
            className={`px-2.5 py-1 rounded-full border uppercase tracking-widest backdrop-blur-md ${
              isDarkMode
                ? "border-white/10 bg-black/50 text-white/70"
                : "border-black/10 bg-white/75 text-zinc-800"
            }`}
          >
            {
              /* Show current milestone index */
              `NODE 0${selectedIndex + 1} / 0${CV_MILESTONES.length}`
            }
          </span>

          <span
            className={`px-2.5 py-1 rounded-full border uppercase tracking-widest backdrop-blur-md ${
              isDarkMode
                ? "border-white/10 bg-black/50 text-white/70"
                : "border-black/10 bg-white/75 text-zinc-800"
            }`}
          >
            {webglSupported ? `WebGL · ${shaderShape}` : `Canvas 2D · ${shaderShape}`}
          </span>
        </div>
      </div>

      {/* ── Mobile Footer ─────────────────────────────────────────────── */}
      <div
        className={`lg:hidden w-full p-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-colors duration-300 z-10 ${
          isDarkMode
            ? "bg-black text-white border-zinc-800"
            : "bg-white text-black border-zinc-200"
        }`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={site.cvPath}
            download
            className="inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
          <Link href="/projects" className="opacity-70 hover:opacity-100 transition-opacity">
            Projects
          </Link>
          <Link href="/contact" className="opacity-70 hover:opacity-100 transition-opacity">
            Contact
          </Link>
        </div>

        <div className="opacity-40 text-[11px]">
          © {new Date().getFullYear()} {site.name}
        </div>
      </div>
    </div>
  );
}
