"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Globe, Pause, Play, X } from "lucide-react";

export type PreloaderTargetId =
  | "header-nav"
  | "hero-badge"
  | "hero-title"
  | "hero-cta"
  | "hero-safari";

export interface ScrollPrintRequest {
  id: string;
  getElement: () => HTMLElement | null;
  label?: string;
  delayMs?: number;
  onStartDrag?: () => void;
  onPrinted: () => void;
}

interface CursorBuilderContextValue {
  isPreloaderActive: boolean;
  isPreloaderComplete: boolean;
  isTargetPrinted: (targetId: PreloaderTargetId) => boolean;
  isTargetDragging: (targetId: PreloaderTargetId) => boolean;
  enqueueScrollPrint: (req: ScrollPrintRequest) => () => void;
  replayPreloader: () => void;
  prefersReducedMotion: boolean;
}

const CursorBuilderContext = createContext<CursorBuilderContextValue | null>(
  null,
);

export function useCursorBuilder(): CursorBuilderContextValue {
  const ctx = useContext(CursorBuilderContext);
  if (!ctx) {
    return {
      isPreloaderActive: false,
      isPreloaderComplete: true,
      isTargetPrinted: () => true,
      isTargetDragging: () => false,
      enqueueScrollPrint: (req) => {
        req.onPrinted();
        return () => {};
      },
      replayPreloader: () => {},
      prefersReducedMotion: false,
    };
  }
  return ctx;
}

const SESSION_STORAGE_KEY = "ta_cursor_builder_v2";

type CursorToolType = "arrow" | "ibeam" | "crosshair" | "resize";

export interface AgentSpec {
  id: number;
  name: string;
  role: string;
  color: string;
  defaultTool: CursorToolType;
}

export const AGENT_PALETTE = [
  "#3b82f6", // Blue (Lead)
  "#06b6d4", // Cyan (UI/UX)
  "#10b981", // Emerald (DevOps)
  "#f43f5e", // Rose (Security)
  "#8b5cf6", // Violet (Backend)
  "#f59e0b", // Amber (Frontend)
  "#14b8a6", // Teal (Design System)
  "#ec4899", // Pink (Motion Lab)
  "#6366f1", // Indigo (Database)
  "#0ea5e9", // Sky (Full-Stack)
  "#84cc16", // Lime (Performance)
  "#f97316", // Orange (Cloud Ops)
  "#d946ef", // Fuchsia (QA Engine)
  "#a855f7", // Purple (Typography)
  "#22c55e", // Green (API Gateway)
  "#0284c7", // Light Blue (Accessibility)
  "#e11d48", // Crimson (Systems)
  "#059669", // Dark Teal (Deploy)
];

export const AGENTS: AgentSpec[] = [
  { id: 0, name: "Taiwo", role: "Arch", color: "#3b82f6", defaultTool: "arrow" },
  { id: 1, name: "Sarah", role: "UI/UX", color: "#06b6d4", defaultTool: "arrow" },
  { id: 2, name: "Alex", role: "DevOps", color: "#10b981", defaultTool: "crosshair" },
  { id: 3, name: "Maya", role: "Security", color: "#f43f5e", defaultTool: "arrow" },
  { id: 4, name: "Jordan", role: "Backend", color: "#8b5cf6", defaultTool: "ibeam" },
  { id: 5, name: "Leo", role: "Frontend", color: "#f59e0b", defaultTool: "arrow" },
  { id: 6, name: "Elena", role: "Design", color: "#14b8a6", defaultTool: "resize" },
  { id: 7, name: "Chen", role: "Motion", color: "#ec4899", defaultTool: "arrow" },
  { id: 8, name: "Nia", role: "Data", color: "#6366f1", defaultTool: "arrow" },
  { id: 9, name: "Chris", role: "Full-Stack", color: "#0ea5e9", defaultTool: "ibeam" },
  { id: 10, name: "Sam", role: "Perf", color: "#84cc16", defaultTool: "crosshair" },
  { id: 11, name: "Avery", role: "Cloud", color: "#f97316", defaultTool: "arrow" },
  { id: 12, name: "Kai", role: "QA Engine", color: "#d946ef", defaultTool: "resize" },
  { id: 13, name: "Morgan", role: "Type", color: "#a855f7", defaultTool: "ibeam" },
  { id: 14, name: "Riley", role: "API", color: "#22c55e", defaultTool: "arrow" },
  { id: 15, name: "Taylor", role: "A11y", color: "#0284c7", defaultTool: "crosshair" },
  { id: 16, name: "Quinn", role: "Systems", color: "#e11d48", defaultTool: "arrow" },
  { id: 17, name: "Jamie", role: "Deploy", color: "#059669", defaultTool: "resize" },
];

interface LayerItem {
  id: number;
  el: HTMLElement;
  kind: "text" | "control" | "card";
  state: "hidden" | "framing" | "printed";
  docTop: number;
  docLeft: number;
  width: number;
  height: number;
}

interface ActiveTask {
  layerId: number;
  agentId: number;
  assistAgentId?: number;
  tool: CursorToolType;
  startTime: number;
  moveDuration: number;
  frameDuration: number;
  fromX: number;
  fromY: number;
  startedFraming: boolean;
}

interface AgentRender {
  id: number;
  x: number;
  y: number;
  color: string;
  name: string;
  role: string;
  tool: CursorToolType;
  scale: number;
  opacity: number;
  isFraming?: boolean;
}

interface BoxRender {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  fullWidth: number;
  fullHeight: number;
  progress: number;
  color: string;
  agentName: string;
}

function easeOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
}

/**
 * Discover all granular visual layers on the page in top-to-bottom document order.
 */
function scanDocumentLayers(): LayerItem[] {
  if (typeof document === "undefined") return [];

  const selector = [
    "header a",
    "header button",
    '[data-print-target="hero-safari"]',
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main .label-mono",
    "main a",
    "main button",
    "main [data-spotlight-card]",
    "main aside li",
    "main svg",
    "footer p",
    "footer a",
  ].join(", ");

  const rawNodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const seen = new Set<HTMLElement>();
  const candidates: HTMLElement[] = [];

  for (const node of rawNodes) {
    if (seen.has(node)) continue;
    if (node.closest("[data-cb-ignore]") || node.closest(".sr-only")) continue;
    if (node.closest("#mobile-menu")) continue;

    // Avoid scanning tiny inline SVGs inside buttons/links that are already scanned
    const parentInteractive = node.parentElement?.closest("a, button");
    if (
      parentInteractive &&
      parentInteractive !== node &&
      (node.tagName.toLowerCase() === "svg" ||
        node.classList.contains("label-mono"))
    ) {
      continue;
    }

    // If an element is inside the Safari mockup SVG, let the Safari container represent it
    const safariWrap = node.closest('[data-print-target="hero-safari"]');
    if (safariWrap && safariWrap !== node) {
      continue;
    }

    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = node.getBoundingClientRect();
    if (rect.width < 14 || rect.height < 10) continue;

    seen.add(node);
    candidates.push(node);
  }

  // Filter out parents that purely wrap another single candidate of almost identical size
  const filtered = candidates.filter((el) => {
    for (const other of candidates) {
      if (other !== el && el.contains(other)) {
        const r1 = el.getBoundingClientRect();
        const r2 = other.getBoundingClientRect();
        if (
          Math.abs(r1.width - r2.width) < 16 &&
          Math.abs(r1.height - r2.height) < 16
        ) {
          return false;
        }
      }
    }
    return true;
  });

  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  const items: LayerItem[] = filtered.map((el, idx) => {
    const rect = el.getBoundingClientRect();
    const tag = el.tagName.toLowerCase();
    const isText =
      tag === "h1" ||
      tag === "h2" ||
      tag === "h3" ||
      tag === "p" ||
      el.classList.contains("label-mono");
    const isCard =
      el.hasAttribute("data-spotlight-card") ||
      el.getAttribute("data-print-target") === "hero-safari" ||
      (rect.width > 240 && rect.height > 120);

    return {
      id: idx,
      el,
      kind: isCard ? "card" : isText ? "text" : "control",
      state: "hidden",
      docTop: rect.top + scrollY,
      docLeft: rect.left + scrollX,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });

  items.sort((a, b) => {
    const rowDiff = a.docTop - b.docTop;
    if (Math.abs(rowDiff) > 28) return rowDiff;
    return a.docLeft - b.docLeft;
  });

  items.forEach((item, i) => {
    item.id = i;
  });

  return items;
}

export interface CursorBuilderProviderProps {
  children: React.ReactNode;
  forcePreloader?: boolean;
}

export function CursorBuilderProvider({
  children,
  forcePreloader = false,
}: CursorBuilderProviderProps) {
  const pathname = usePathname();
  const prefersReduced = Boolean(useReducedMotion());
  const isHome = pathname === "/";

  const [phase, setPhase] = useState<"idle" | "scanning" | "building" | "done">(
    "idle",
  );
  const [scanProgress, setScanProgress] = useState(0);
  const [totalLayers, setTotalLayers] = useState(0);
  const [printedCount, setPrintedCount] = useState(0);
  const [isTouring, setIsTouring] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 4>(1);
  const [showHiddenTexts, setShowHiddenTexts] = useState(false);

  const [agentsRender, setAgentsRender] = useState<AgentRender[]>([]);
  const [boxesRender, setBoxesRender] = useState<BoxRender[]>([]);
  const [viewportSize, setViewportSize] = useState({ w: 1280, h: 800 });
  const [scrollPos, setScrollPos] = useState(0);
  const [docHeight, setDocHeight] = useState(3200);

  const layersRef = useRef<LayerItem[]>([]);
  const activeTasksRef = useRef<ActiveTask[]>([]);
  const agentPosRef = useRef<Array<{ x: number; y: number; busy: boolean }>>([]);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<"idle" | "scanning" | "building" | "done">("idle");
  const isTouringRef = useRef(true);
  const isPausedRef = useRef(false);
  const speedRef = useRef<1 | 2 | 4>(1);
  const showHiddenRef = useRef(false);
  const lastManualScrollRef = useRef<number>(0);

  useEffect(() => {
    isTouringRef.current = isTouring;
  }, [isTouring]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    showHiddenRef.current = showHiddenTexts;
    const layers = layersRef.current;
    for (const layer of layers) {
      if (!layer.el.isConnected) continue;
      if (layer.state === "hidden") {
        if (showHiddenTexts) {
          layer.el.setAttribute("data-cb-state", "framing");
        } else {
          layer.el.setAttribute("data-cb-state", "hidden");
        }
      }
    }
  }, [showHiddenTexts]);

  // Keep viewport metrics synced for rulers and minimap
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResizeOrScroll = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
      setScrollPos(window.scrollY);
      setDocHeight(
        Math.max(
          document.documentElement.scrollHeight,
          window.innerHeight * 1.5,
        ),
      );
    };
    const initId = window.requestAnimationFrame(onResizeOrScroll);
    window.addEventListener("resize", onResizeOrScroll, { passive: true });
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(initId);
      window.removeEventListener("resize", onResizeOrScroll);
      window.removeEventListener("scroll", onResizeOrScroll);
    };
  }, []);

  // Detect manual wheel/touch scroll so user can freely scroll anytime
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onUserScrollIntent = () => {
      lastManualScrollRef.current = performance.now();
    };
    window.addEventListener("wheel", onUserScrollIntent, { passive: true });
    window.addEventListener("touchmove", onUserScrollIntent, { passive: true });
    return () => {
      window.removeEventListener("wheel", onUserScrollIntent);
      window.removeEventListener("touchmove", onUserScrollIntent);
    };
  }, []);

  const revealAllAndCleanup = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    layersRef.current = layersRef.current.map((layer) => {
      if (layer.el && layer.el.isConnected) {
        layer.el.removeAttribute("data-cb-state");
      }
      return { ...layer, state: "printed" as const };
    });
    document.querySelectorAll("[data-cb-state]").forEach((el) => {
      el.removeAttribute("data-cb-state");
    });
    activeTasksRef.current = [];
    phaseRef.current = "done";
    setPhase("done");
    setBoxesRender([]);
    setAgentsRender([]);
    setPrintedCount(layersRef.current.length);
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, "done");
    } catch {
      // ignore
    }
  }, []);

  // Start the full video-accurate sequence:
  // 1) 0.0s – 1.45s: Swirling 18-agent swarm around center TA monogram + "Scanning page..."
  // 2) 1.45s+: Multi-cursor Figma wireframe assembly + Top/Left Rulers + Live Minimap + Auto-Touring
  const startLiveBuilder = useCallback(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    const discovered = scanDocumentLayers();
    layersRef.current = discovered;

    for (const layer of discovered) {
      layer.el.setAttribute("data-cb-state", "hidden");
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const agentCount = vw < 640 ? 8 : 18;

    agentPosRef.current = Array.from({ length: agentCount }, (_, i) => ({
      x: vw * 0.5 + Math.cos((i / agentCount) * Math.PI * 2) * 90,
      y: vh * 0.5 + Math.sin((i / agentCount) * Math.PI * 2) * 60,
      busy: false,
    }));

    activeTasksRef.current = [];
    phaseRef.current = "scanning";
    setPhase("scanning");
    setScanProgress(0);
    setTotalLayers(discovered.length);
    setPrintedCount(0);
    setIsPaused(false);
    setIsTouring(true);

    const scanStart = performance.now();
    const scanDuration = 1800;

    const tick = (now: number) => {
      const curVw = window.innerWidth;
      const curVh = window.innerHeight;
      const count = curVw < 640 ? 8 : 18;

      // ── STAGE 1: SWIRLING SWARM & "Scanning page..." ──
      if (phaseRef.current === "scanning") {
        const elapsed = (now - scanStart) * speedRef.current;
        const p = Math.min(1, elapsed / scanDuration);
        setScanProgress(Math.round(p * 100));

        // Two counter-rotating clusters around the center TA monogram (matching z_01 & z_02)
        const swarmAgents: AgentRender[] = [];
        for (let i = 0; i < count; i++) {
          const cluster = i % 2 === 0 ? 1 : -1;
          const clusterCenterX =
            curVw * 0.5 + cluster * Math.cos(p * Math.PI * 1.6) * 85;
          const clusterCenterY =
            curVh * 0.5 + cluster * Math.sin(p * Math.PI * 1.6) * 52;
          const angle =
            (i / (count / 2)) * Math.PI * 2 +
            p * Math.PI * 3.2 * cluster;
          const radiusX = 24 + (i % 4) * 14;
          const radiusY = 16 + (i % 3) * 11;

          const x = clusterCenterX + Math.cos(angle) * radiusX;
          const y = clusterCenterY + Math.sin(angle) * radiusY;

          if (agentPosRef.current[i]) {
            agentPosRef.current[i].x = x;
            agentPosRef.current[i].y = y;
          }

          const spec = AGENTS[i % AGENTS.length];
          swarmAgents.push({
            id: i,
            x,
            y,
            color: spec.color,
            name: spec.name,
            role: spec.role,
            tool: "arrow",
            scale: 1,
            opacity: Math.min(1, p * 2.8),
            isFraming: false,
          });
        }

        setAgentsRender(swarmAgents);
        setBoxesRender([]);

        if (p >= 1) {
          phaseRef.current = "building";
          setPhase("building");
        }

        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      // ── STAGE 2: MULTI-AGENT LAYER FRAMING & AUTO-SCROLL TOURING ──
      if (phaseRef.current === "building") {
        if (isPausedRef.current) {
          rafRef.current = window.requestAnimationFrame(tick);
          return;
        }

        const layers = layersRef.current;
        const speed = speedRef.current;
        const curScrollY = window.scrollY;

        // 1. Update all currently running tasks
        const nextBoxes: BoxRender[] = [];
        const activeAgentMap = new Map<number, AgentRender>();
        const remainingTasks: ActiveTask[] = [];

        for (const task of activeTasksRef.current) {
          const layer = layers[task.layerId];
          if (!layer || !layer.el.isConnected) {
            if (agentPosRef.current[task.agentId]) {
              agentPosRef.current[task.agentId].busy = false;
            }
            if (
              typeof task.assistAgentId === "number" &&
              agentPosRef.current[task.assistAgentId]
            ) {
              agentPosRef.current[task.assistAgentId].busy = false;
            }
            continue;
          }

          const rect = layer.el.getBoundingClientRect();
          layer.width = Math.max(16, Math.round(rect.width));
          layer.height = Math.max(14, Math.round(rect.height));
          layer.docTop = rect.top + curScrollY;

          const elapsed = (now - task.startTime) * speed;
          const totalDuration = task.moveDuration + task.frameDuration;

          const spec = AGENTS[task.agentId % AGENTS.length];

          if (elapsed <= task.moveDuration) {
            // Flying to top-left corner of layer
            const t = easeOutCubic(elapsed / task.moveDuration);
            const cx = task.fromX + (rect.left - task.fromX) * t;
            const cy = task.fromY + (rect.top - task.fromY) * t;

            activeAgentMap.set(task.agentId, {
              id: task.agentId,
              x: cx,
              y: cy,
              color: spec.color,
              name: spec.name,
              role: spec.role,
              tool: task.tool,
              scale: 1,
              opacity: 1,
              isFraming: false,
            });

            if (agentPosRef.current[task.agentId]) {
              agentPosRef.current[task.agentId].x = cx;
              agentPosRef.current[task.agentId].y = cy;
            }

            if (typeof task.assistAgentId === "number") {
              const assistSpec = AGENTS[task.assistAgentId % AGENTS.length];
              const assistSlot = agentPosRef.current[task.assistAgentId];
              const ax =
                (assistSlot?.x ?? curVw * 0.5) +
                (rect.right - (assistSlot?.x ?? curVw * 0.5)) * t;
              const ay =
                (assistSlot?.y ?? curVh * 0.5) +
                (rect.top - (assistSlot?.y ?? curVh * 0.5)) * t;
              activeAgentMap.set(task.assistAgentId, {
                id: task.assistAgentId,
                x: ax,
                y: ay,
                color: assistSpec.color,
                name: assistSpec.name,
                role: assistSpec.role,
                tool: "crosshair",
                scale: 0.95,
                opacity: 0.9,
                isFraming: false,
              });
            }

            remainingTasks.push(task);
          } else if (elapsed <= totalDuration) {
            // Framing / dragging bounding box across the layer
            if (!task.startedFraming) {
              task.startedFraming = true;
              layer.state = "framing";
              layer.el.setAttribute("data-cb-state", "framing");
            }

            const frameT = easeOutCubic(
              (elapsed - task.moveDuration) / task.frameDuration,
            );
            const curW = Math.max(14, rect.width * frameT);
            const curH = Math.max(12, rect.height * frameT);
            const cx = rect.left + curW;
            const cy =
              task.tool === "ibeam"
                ? rect.top + rect.height * 0.5
                : rect.top + curH;

            activeAgentMap.set(task.agentId, {
              id: task.agentId,
              x: cx,
              y: cy,
              color: spec.color,
              name: spec.name,
              role: spec.role,
              tool: task.tool,
              scale: 1,
              opacity: 1,
              isFraming: true,
            });

            if (agentPosRef.current[task.agentId]) {
              agentPosRef.current[task.agentId].x = cx;
              agentPosRef.current[task.agentId].y = cy;
            }

            if (typeof task.assistAgentId === "number") {
              const assistSpec = AGENTS[task.assistAgentId % AGENTS.length];
              const ax = rect.left + rect.width;
              const ay = rect.top + curH * 0.85;
              activeAgentMap.set(task.assistAgentId, {
                id: task.assistAgentId,
                x: ax,
                y: ay,
                color: assistSpec.color,
                name: assistSpec.name,
                role: assistSpec.role,
                tool: "crosshair",
                scale: 0.95,
                opacity: 0.95,
                isFraming: true,
              });
              if (agentPosRef.current[task.assistAgentId]) {
                agentPosRef.current[task.assistAgentId].x = ax;
                agentPosRef.current[task.assistAgentId].y = ay;
              }
            }

            // Only render boxes that are inside or near the viewport
            if (rect.bottom >= -40 && rect.top <= curVh + 40) {
              nextBoxes.push({
                id: layer.id,
                left: rect.left,
                top: rect.top,
                width: curW,
                height: curH,
                fullWidth: rect.width,
                fullHeight: rect.height,
                progress: frameT,
                color: spec.color,
                agentName: spec.name,
              });
            }

            remainingTasks.push(task);
          } else {
            // Task finished -> mark layer printed!
            layer.state = "printed";
            layer.el.setAttribute("data-cb-state", "printed");
            if (agentPosRef.current[task.agentId]) {
              agentPosRef.current[task.agentId].busy = false;
            }
            if (
              typeof task.assistAgentId === "number" &&
              agentPosRef.current[task.assistAgentId]
            ) {
              agentPosRef.current[task.assistAgentId].busy = false;
            }
          }
        }

        activeTasksRef.current = remainingTasks;

        // 2. Count printed layers
        let doneCount = 0;
        for (const l of layers) {
          if (l.state === "printed") doneCount++;
        }
        setPrintedCount(doneCount);

        if (doneCount >= layers.length) {
          revealAllAndCleanup();
          return;
        }

        // 3. Assign idle agents to the next unprinted layers in or near the viewport
        const maxConcurrentTasks = curVw < 640 ? 3 : 5;
        if (activeTasksRef.current.length < maxConcurrentTasks) {
          // Prefer layers currently visible in viewport; otherwise pick next unprinted layer
          const inViewportHidden = layers.filter((l) => {
            if (l.state !== "hidden") return false;
            const alreadyAssigned = activeTasksRef.current.some(
              (t) => t.layerId === l.id,
            );
            if (alreadyAssigned) return false;
            const r = l.el.getBoundingClientRect();
            return r.top >= -80 && r.top <= curVh + 140;
          });

          const fallbackHidden =
            inViewportHidden.length > 0
              ? inViewportHidden
              : layers.filter(
                  (l) =>
                    l.state === "hidden" &&
                    !activeTasksRef.current.some((t) => t.layerId === l.id),
                );

          for (const candidate of fallbackHidden) {
            if (activeTasksRef.current.length >= maxConcurrentTasks) break;

            const freeAgentIdx = agentPosRef.current.findIndex((a) => !a.busy);
            if (freeAgentIdx === -1) break;

            agentPosRef.current[freeAgentIdx].busy = true;
            const fromPos = agentPosRef.current[freeAgentIdx];

            let assistIdx: number | undefined;
            if (candidate.kind === "card") {
              const secondIdx = agentPosRef.current.findIndex(
                (a, idx) => !a.busy && idx !== freeAgentIdx,
              );
              if (secondIdx !== -1) {
                agentPosRef.current[secondIdx].busy = true;
                assistIdx = secondIdx;
              }
            }

            const tool: CursorToolType =
              candidate.kind === "text"
                ? freeAgentIdx % 2 === 0
                  ? "ibeam"
                  : "arrow"
                : candidate.kind === "card"
                  ? "resize"
                  : AGENTS[freeAgentIdx % AGENTS.length].defaultTool;

            const moveDuration = 380 + (freeAgentIdx % 4) * 50;
            const frameDuration =
              candidate.kind === "card"
                ? 640
                : candidate.kind === "text"
                  ? 480
                  : 380;

            activeTasksRef.current.push({
              layerId: candidate.id,
              agentId: freeAgentIdx,
              assistAgentId: assistIdx,
              tool,
              startTime: now,
              moveDuration,
              frameDuration,
              fromX: fromPos.x,
              fromY: fromPos.y,
              startedFraming: false,
            });
          }
        }

        // 4. Keep idle agents subtly hovering around active construction zones
        for (let i = 0; i < count; i++) {
          if (!activeAgentMap.has(i)) {
            const slot = agentPosRef.current[i];
            if (slot) {
              const driftX =
                slot.x + Math.sin(now * 0.003 + i * 1.7) * 0.9;
              const driftY =
                slot.y + Math.cos(now * 0.0027 + i * 1.3) * 0.9;
              slot.x = Math.max(28, Math.min(curVw - 40, driftX));
              slot.y = Math.max(28, Math.min(curVh - 60, driftY));

              const spec = AGENTS[i % AGENTS.length];
              activeAgentMap.set(i, {
                id: i,
                x: slot.x,
                y: slot.y,
                color: spec.color,
                name: spec.name,
                role: spec.role,
                tool: spec.defaultTool,
                scale: 0.92,
                opacity: 0.72,
                isFraming: false,
              });
            }
          }
        }

        // 5. Auto-Scrolling "Touring" camera: glide down smoothly to follow the active build wave
        const userScrolledRecently =
          now - lastManualScrollRef.current < 1800;
        if (isTouringRef.current && !userScrolledRecently) {
          const nextUnbuilt = layers.find((l) => l.state !== "printed");
          if (nextUnbuilt && nextUnbuilt.el.isConnected) {
            const rect = nextUnbuilt.el.getBoundingClientRect();
            const desiredTop = curVh * 0.34;
            const delta = rect.top - desiredTop;
            if (delta > 100 || delta < -180) {
              window.scrollBy({
                top: delta * 0.038 * speed,
                behavior: "instant" as ScrollBehavior,
              });
            }
          }
        }

        setAgentsRender(Array.from(activeAgentMap.values()));
        setBoxesRender(nextBoxes);

        rafRef.current = window.requestAnimationFrame(tick);
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }, [prefersReduced, revealAllAndCleanup]);

  // Trigger on initial mount on Home page `/`
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReduced || !isHome) {
      const id = window.requestAnimationFrame(() => {
        revealAllAndCleanup();
      });
      return () => window.cancelAnimationFrame(id);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const forceFromUrl =
      urlParams.get("replay") === "1" || urlParams.get("preloader") === "1";

    let alreadyDone = false;
    try {
      alreadyDone =
        window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "done";
    } catch {
      alreadyDone = false;
    }

    if (alreadyDone && !forcePreloader && !forceFromUrl) {
      const id = window.requestAnimationFrame(() => {
        revealAllAndCleanup();
      });
      return () => window.cancelAnimationFrame(id);
    }

    const startTimer = window.setTimeout(() => {
      startLiveBuilder();
    }, 60);

    return () => {
      window.clearTimeout(startTimer);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    forcePreloader,
    isHome,
    prefersReduced,
    revealAllAndCleanup,
    startLiveBuilder,
  ]);

  const replayPreloader = useCallback(() => {
    if (prefersReduced) return;
    try {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    startLiveBuilder();
  }, [prefersReduced, startLiveBuilder]);

  const cycleSpeed = useCallback(() => {
    setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  }, []);

  const isPreloaderActive = phase === "scanning" || phase === "building";
  const isPreloaderComplete = phase === "done";

  const isTargetPrinted = useCallback(() => true, []);
  const isTargetDragging = useCallback(() => false, []);
  const enqueueScrollPrint = useCallback((req: ScrollPrintRequest) => {
    req.onPrinted();
    return () => {};
  }, []);

  const contextValue = useMemo<CursorBuilderContextValue>(
    () => ({
      isPreloaderActive,
      isPreloaderComplete,
      isTargetPrinted,
      isTargetDragging,
      enqueueScrollPrint,
      replayPreloader,
      prefersReducedMotion: prefersReduced,
    }),
    [
      enqueueScrollPrint,
      isPreloaderActive,
      isPreloaderComplete,
      isTargetDragging,
      isTargetPrinted,
      prefersReduced,
      replayPreloader,
    ],
  );

  // Compute aggregate ruler span for the top and left Figma rulers
  const activeBounds = useMemo(() => {
    if (boxesRender.length === 0) return null;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const b of boxesRender) {
      if (b.left < minX) minX = b.left;
      if (b.left + b.width > maxX) maxX = b.left + b.width;
      if (b.top < minY) minY = b.top;
      if (b.top + b.height > maxY) maxY = b.top + b.height;
    }
    return { minX, maxX, minY, maxY };
  }, [boxesRender]);

  const progressRatio =
    totalLayers > 0 ? Math.min(1, printedCount / totalLayers) : 0;

  return (
    <CursorBuilderContext.Provider value={contextValue}>
      {children}

      {!prefersReduced ? (
        <>
          {/* ── 1. STAGE 1 FULL-SCREEN SCANNING BACKDROP + CENTER "TA" MONOGRAM ── */}
          {phase === "scanning" ? (
            <div
              aria-hidden="true"
              style={{ backgroundColor: "var(--background)" }}
              className="pointer-events-none fixed inset-0 z-[9990] flex items-center justify-center select-none"
            >
              <span
                style={{ color: "var(--foreground)" }}
                className="font-mono text-6xl font-bold tracking-tighter opacity-15 sm:text-7xl"
              >
                TA
              </span>
            </div>
          ) : null}

          {/* ── 2. TOP & LEFT FIGMA/CAD PIXEL RULERS + FULL-VIEWPORT GUIDE LINES ── */}
          {phase === "building" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[9992] overflow-hidden select-none"
            >
              {/* Persistent vertical left editorial margin guide line (red/accent line from video) */}
              <div
                style={{
                  left:
                    viewportSize.w >= 1200
                      ? `${Math.max(24, (viewportSize.w - 1152) / 2 + 32)}px`
                      : "24px",
                  backgroundColor:
                    "color-mix(in oklab, var(--destructive) 55%, transparent)",
                }}
                className="absolute inset-y-0 w-[1px]"
              />

              {/* Dynamic cross-viewport alignment guide lines from active wireframe boxes */}
              {boxesRender.slice(0, 4).map((box) => (
                <React.Fragment key={`guide-${box.id}`}>
                  <div
                    style={{
                      transform: `translate3d(0, ${Math.round(box.top)}px, 0)`,
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-blue) 28%, transparent)",
                    }}
                    className="absolute inset-x-0 top-0 h-[1px]"
                  />
                  <div
                    style={{
                      transform: `translate3d(${Math.round(box.left)}px, 0, 0)`,
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-blue) 28%, transparent)",
                    }}
                    className="absolute inset-y-0 left-0 w-[1px]"
                  />
                </React.Fragment>
              ))}

              {/* Top Horizontal Pixel Ruler */}
              <div
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--background) 92%, transparent)",
                  borderColor: "var(--border)",
                }}
                className="absolute top-0 right-0 left-5 h-5 border-b backdrop-blur-xs"
              >
                {activeBounds ? (
                  <div
                    style={{
                      left: `${Math.max(0, activeBounds.minX - 20)}px`,
                      width: `${Math.max(12, activeBounds.maxX - activeBounds.minX)}px`,
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-blue) 26%, transparent)",
                      borderColor: "var(--accent-blue)",
                    }}
                    className="absolute inset-y-0 border-x"
                  />
                ) : null}
                {Array.from(
                  { length: Math.ceil(viewportSize.w / 100) + 1 },
                  (_, i) => i * 100,
                ).map((px) => (
                  <div
                    key={`hr-${px}`}
                    style={{ left: `${px}px` }}
                    className="absolute top-0 bottom-0 flex items-start"
                  >
                    <span className="h-2.5 w-[1px] bg-border" />
                    <span className="pl-1 font-mono text-[8px] leading-none text-muted-foreground/70">
                      {px}
                    </span>
                  </div>
                ))}
              </div>

              {/* Left Vertical Pixel Ruler */}
              <div
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--background) 92%, transparent)",
                  borderColor: "var(--border)",
                }}
                className="absolute top-5 bottom-0 left-0 w-5 border-r backdrop-blur-xs"
              >
                {activeBounds ? (
                  <div
                    style={{
                      top: `${Math.max(0, activeBounds.minY - 20)}px`,
                      height: `${Math.max(12, activeBounds.maxY - activeBounds.minY)}px`,
                      backgroundColor:
                        "color-mix(in oklab, var(--accent-blue) 26%, transparent)",
                      borderColor: "var(--accent-blue)",
                    }}
                    className="absolute inset-x-0 border-y"
                  />
                ) : null}
                {Array.from(
                  { length: Math.ceil(viewportSize.h / 100) + 1 },
                  (_, i) => i * 100,
                ).map((py) => (
                  <div
                    key={`vr-${py}`}
                    style={{ top: `${py}px` }}
                    className="absolute right-0 left-0 flex flex-col items-start"
                  >
                    <span className="h-[1px] w-2.5 bg-border" />
                    <span className="pt-0.5 pl-0.5 font-mono text-[7px] leading-none text-muted-foreground/70 [writing-mode:vertical-lr]">
                      {py}
                    </span>
                  </div>
                ))}
              </div>

              {/* Top-left Ruler Corner Intersection Square */}
              <div
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
                className="absolute top-0 left-0 flex h-5 w-5 items-center justify-center border-r border-b font-mono text-[8px] text-muted-foreground"
              >
                +
              </div>
            </div>
          ) : null}

          {/* ── 3. ACTIVE FIGMA SELECTION BOUNDING BOXES & MULTI-AGENT CURSORS ── */}
          {isPreloaderActive ? (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[9995] overflow-hidden select-none"
            >
              {/* Figma-style Wireframe Selection Boxes with 4 Corner Handles & Multi-Color Theming */}
              {boxesRender.map((box) => (
                <div
                  key={`box-${box.id}`}
                  style={{
                    transform: `translate3d(${Math.round(box.left)}px, ${Math.round(box.top)}px, 0)`,
                    width: `${Math.round(box.width)}px`,
                    height: `${Math.round(box.height)}px`,
                    borderColor: box.color,
                    backgroundColor: `color-mix(in oklab, ${box.color} 14%, rgba(128,128,128,0.05))`,
                    boxShadow: `0 0 0 1px color-mix(in oklab, ${box.color} 30%, transparent), 0 4px 14px color-mix(in oklab, ${box.color} 12%, transparent)`,
                  }}
                  className="absolute top-0 left-0 border will-change-transform"
                >
                  {/* 4 White Corner Handles with Agent Color Border */}
                  <span
                    style={{ borderColor: box.color }}
                    className="absolute -top-[3px] -left-[3px] h-[5px] w-[5px] border bg-white shadow-2xs"
                  />
                  <span
                    style={{ borderColor: box.color }}
                    className="absolute -top-[3px] -right-[3px] h-[5px] w-[5px] border bg-white shadow-2xs"
                  />
                  <span
                    style={{ borderColor: box.color }}
                    className="absolute -bottom-[3px] -left-[3px] h-[5px] w-[5px] border bg-white shadow-2xs"
                  />
                  <span
                    style={{ borderColor: box.color }}
                    className="absolute -right-[3px] -bottom-[3px] h-[5px] w-[5px] border bg-white shadow-2xs"
                  />

                  {/* Top-Left Agent Name Pill Tag */}
                  <span
                    style={{
                      backgroundColor: box.color,
                      color: "#ffffff",
                    }}
                    className="absolute -top-[16px] left-0 rounded-t-[3px] px-1.5 py-[1px] font-mono text-[8px] leading-tight font-semibold tracking-wide uppercase whitespace-nowrap shadow-xs"
                  >
                    {box.agentName}
                  </span>

                  {/* Bottom Center Dimension Readout Badge (e.g., 280 × 68) */}
                  <span
                    style={{
                      backgroundColor: box.color,
                      color: "#ffffff",
                    }}
                    className="absolute -bottom-[16px] left-1/2 -translate-x-1/2 rounded-[2px] px-1.5 py-[1px] font-mono text-[9px] leading-tight font-medium whitespace-nowrap tabular-nums shadow-xs"
                  >
                    {Math.round(box.width)} × {Math.round(box.height)}
                  </span>
                </div>
              ))}

              {/* 18 Autonomous Multi-Tool Cursors with Multi-Color Badges & Realistic Pointers */}
              {agentsRender.map((agent) => (
                <div
                  key={`agent-${agent.id}`}
                  style={{
                    transform: `translate3d(${Math.round(agent.x)}px, ${Math.round(agent.y)}px, 0) scale(${agent.scale})`,
                    opacity: agent.opacity,
                  }}
                  className="absolute top-0 left-0 origin-top-left will-change-transform"
                >
                  <AgentCursor agent={agent} />
                </div>
              ))}
            </div>
          ) : null}

          {/* ── 4. BOTTOM INTERACTIVE FLOATING CONTROL DOCK & MINI-PREVIEW PIP WINDOW ── */}
          {isPreloaderActive ? (
            <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[9999] flex items-end justify-center gap-3 px-4 select-none sm:bottom-4">
              {/* Interactive Multi-Agent Control Pill */}
              <div
                style={{
                  backgroundColor:
                    "color-mix(in oklab, var(--card) 94%, transparent)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                className="pointer-events-auto flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] shadow-xl backdrop-blur-md"
              >
                {phase === "scanning" ? (
                  <>
                    <span className="text-muted-foreground">
                      Scanning page...
                    </span>
                    <div className="h-1 w-20 overflow-hidden rounded-full bg-border">
                      <div
                        style={{
                          width: `${scanProgress}%`,
                          backgroundColor: "var(--accent-blue)",
                        }}
                        className="h-full transition-all duration-75"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Overlapping Colored Agent Dots */}
                    <div className="flex items-center -space-x-1.5">
                      {AGENT_PALETTE.slice(0, 5).map((col, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: col,
                            borderColor: "var(--card)",
                          }}
                          className="inline-block h-3 w-3 rounded-full border"
                        />
                      ))}
                    </div>

                    <span className="font-medium whitespace-nowrap">
                      {viewportSize.w < 640 ? "8" : "18"} agents
                    </span>

                    <span className="hidden text-muted-foreground tabular-nums sm:inline">
                      {printedCount} / {totalLayers} layers
                    </span>

                    <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-border md:block">
                      <div
                        style={{
                          width: `${Math.round(progressRatio * 100)}%`,
                          backgroundColor: "var(--accent-blue)",
                        }}
                        className="h-full transition-all duration-100"
                      />
                    </div>
                  </>
                )}

                {/* Touring Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTouring((v) => !v)}
                  style={
                    isTouring
                      ? {
                          backgroundColor: "var(--accent-blue)",
                          color: "#ffffff",
                        }
                      : undefined
                  }
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
                    isTouring
                      ? ""
                      : "border border-border bg-background/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isTouring ? "Touring" : "Tour"}
                </button>

                {/* Speed Multiplier Button (1x / 2x / 4x) */}
                <button
                  type="button"
                  onClick={cycleSpeed}
                  title="Cycle build speed"
                  className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums transition-colors hover:text-foreground"
                >
                  {speedMultiplier}x
                </button>

                {/* Pause / Resume Button */}
                <button
                  type="button"
                  onClick={() => setIsPaused((v) => !v)}
                  aria-label={isPaused ? "Resume builder" : "Pause builder"}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {isPaused ? (
                    <Play className="h-2.5 w-2.5" />
                  ) : (
                    <Pause className="h-2.5 w-2.5" />
                  )}
                </button>

                {/* Close / Skip Button */}
                <button
                  type="button"
                  onClick={revealAllAndCleanup}
                  aria-label="Close live builder and reveal all"
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Picture-in-Picture Live Mini-Preview Window (Desktop/Tablet) */}
              {phase === "building" && viewportSize.w >= 768 ? (
                <div
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--card) 95%, transparent)",
                    borderColor: "var(--border)",
                  }}
                  className="pointer-events-auto hidden w-44 flex-col overflow-hidden rounded-lg border shadow-2xl backdrop-blur-md sm:flex"
                >
                  {/* Mini Browser Title Bar */}
                  <div
                    style={{ borderColor: "var(--border)" }}
                    className="flex items-center gap-1.5 border-b px-2.5 py-1.5"
                  >
                    <Globe
                      style={{ color: "var(--accent-blue)" }}
                      className="h-3 w-3 shrink-0"
                    />
                    <span className="truncate font-mono text-[9px] font-medium text-foreground">
                      TAIWO ADEBOLA | Portfolio
                    </span>
                  </div>

                  {/* Live Scaled Viewport Radar Canvas */}
                  <div
                    style={{ backgroundColor: "var(--background)" }}
                    className="relative h-24 w-full overflow-hidden"
                  >
                    {/* Faint structural wireframe silhouette inside minimap */}
                    <div className="absolute inset-x-2 top-1.5 h-1.5 rounded-[1px] bg-foreground/15" />
                    <div className="absolute top-5 left-2 h-8 w-16 rounded-[1px] bg-foreground/10" />
                    <div className="absolute top-5 right-2 h-10 w-14 rounded-[2px] border border-border bg-card" />
                    <div className="absolute inset-x-2 top-16 grid grid-cols-2 gap-1">
                      <div className="h-6 rounded-[1px] bg-foreground/10" />
                      <div className="h-6 rounded-[1px] bg-foreground/10" />
                    </div>

                    {/* Active wireframe boxes projected into the minimap matching agent colors */}
                    {boxesRender.map((b) => {
                      const rx = (b.left / Math.max(1, viewportSize.w)) * 176;
                      const ry = (b.top / Math.max(1, viewportSize.h)) * 96;
                      const rw = Math.max(
                        4,
                        (b.width / Math.max(1, viewportSize.w)) * 176,
                      );
                      const rh = Math.max(
                        3,
                        (b.height / Math.max(1, viewportSize.h)) * 96,
                      );
                      return (
                        <div
                          key={`mini-${b.id}`}
                          style={{
                            transform: `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`,
                            width: `${rw.toFixed(1)}px`,
                            height: `${rh.toFixed(1)}px`,
                            borderColor: b.color || "var(--accent-blue)",
                            backgroundColor: `color-mix(in oklab, ${b.color || "var(--accent-blue)"} 30%, transparent)`,
                          }}
                          className="absolute top-0 left-0 border"
                        />
                      );
                    })}

                    {/* Viewport Scroll Indicator Frame */}
                    <div
                      style={{
                        top: `${Math.min(72, (scrollPos / Math.max(1, docHeight)) * 72)}px`,
                        borderColor:
                          "color-mix(in oklab, var(--accent-blue) 55%, transparent)",
                      }}
                      className="absolute inset-x-0.5 h-6 rounded-[2px] border border-dashed"
                    />
                  </div>
                </div>
              ) : null}

              {/* Bottom-Right "Show hidden texts" Pill (matches bottom-right button in video) */}
              {phase === "building" ? (
                <button
                  type="button"
                  onClick={() => setShowHiddenTexts((v) => !v)}
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--card) 92%, transparent)",
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                  className="pointer-events-auto fixed right-4 bottom-3.5 hidden rounded-md border px-2.5 py-1 font-mono text-[10px] shadow-md backdrop-blur-md transition-colors hover:text-foreground lg:inline-flex"
                >
                  {showHiddenTexts ? "Hide unbuilt texts" : "Show hidden texts"}
                </button>
              ) : null}
            </div>
          ) : isHome ? (
            /* Subtle Replay Pill in Bottom-Right once finished */
            <button
              type="button"
              onClick={replayPreloader}
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--card) 90%, transparent)",
                borderColor: "var(--border)",
                color: "var(--muted-foreground)",
              }}
              className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] shadow-sm backdrop-blur-md transition-colors hover:border-accent-blue hover:text-foreground"
            >
              <span
                style={{ backgroundColor: "var(--accent-blue)" }}
                className="inline-block h-1.5 w-1.5 rounded-full"
              />
              <span>18 agents · Replay build</span>
            </button>
          ) : null}
        </>
      ) : null}
    </CursorBuilderContext.Provider>
  );
}

/**
 * Renders collaborative multiplayer cursors:
 * - Crisp SVG pointer (Arrow, I-Beam, Crosshair, Resize) with high-contrast dual outline
 * - Real designer/agent name pill badge with distinct vibrant color, role, and active status
 */
function AgentCursor({ agent }: { agent: AgentRender }) {
  const isArrow = agent.tool === "arrow";
  const isIbeam = agent.tool === "ibeam";
  const isCrosshair = agent.tool === "crosshair";
  const isResize = agent.tool === "resize";

  return (
    <div className="relative select-none pointer-events-none drop-shadow-md">
      {/* 1. Primary Tool Cursor Icon */}
      {isArrow && (
        <svg
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          className="origin-top-left drop-shadow-xs"
        >
          <path
            d="M2 2L7.6 18.2L10.5 11.8L16.8 9L2 2Z"
            fill={agent.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {isIbeam && (
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center drop-shadow-xs">
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <path
              d="M3 2H11M7 2V18M3 18H11"
              stroke={agent.color}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M3 2H11M7 2V18M3 18H11"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {isCrosshair && (
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center drop-shadow-xs">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle
              cx="8"
              cy="8"
              r="5.5"
              stroke={agent.color}
              strokeWidth="1.5"
              fill="rgba(255,255,255,0.2)"
            />
            <path
              d="M8 1V15M1 8H15"
              stroke={agent.color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {isResize && (
        <div className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center drop-shadow-xs">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 7V3H7M13 9V13H9M3 3L13 13"
              stroke={agent.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 7V3H7M13 9V13H9M3 3L13 13"
              stroke="#ffffff"
              strokeWidth="0.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* 2. Collaborative Multi-Cursor Name Tag Badge */}
      <div
        style={{
          backgroundColor: agent.color,
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.3)",
        }}
        className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-2 py-0.5 text-white font-mono text-[9px] font-semibold tracking-wide whitespace-nowrap shadow-md transition-transform ${
          agent.isFraming ? "scale-105" : "scale-100"
        }`}
      >
        <span className="leading-none">{agent.name}</span>
        {agent.isFraming ? (
          <span className="flex items-center gap-1 font-normal opacity-95 text-[8px] leading-none">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span>drafting</span>
          </span>
        ) : (
          <span className="font-normal opacity-80 text-[8px] leading-none">
            · {agent.role}
          </span>
        )}
      </div>
    </div>
  );
}
