"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Cpu, Layers, ShieldCheck, Terminal } from "lucide-react";

const DISCIPLINE_TELEMETRY = [
  {
    code: "01 // SYS_ENG",
    label: "Full-Stack Architecture",
    detail: "Next.js 16 · TypeScript · FastAPI",
    metric: "PROD_READY",
    icon: Layers,
  },
  {
    code: "02 // SEC_OPS",
    label: "Security & Verification",
    detail: "OWASP · Headless Evidence Pipelines",
    metric: "VERIFIED",
    icon: ShieldCheck,
  },
  {
    code: "03 // INFRA_LAB",
    label: "Self-Hosted Linux Cloud",
    detail: "Docker · Coolify · AWS EC2 · Caddy",
    metric: "ONLINE_24/7",
    icon: ServerIcon,
  },
  {
    code: "04 // AUTO_AI",
    label: "Autonomous Bots & AI",
    detail: "Python · aiogram · Market Scanners",
    metric: "ACTIVE",
    icon: Cpu,
  },
] as const;

function ServerIcon({ className }: { className?: string }) {
  return <Terminal className={className} />;
}

export interface HeroPortraitShowcaseProps {
  src?: string;
  name?: string;
}

/**
 * Swiss-Editorial 3D Architectural Portrait Monolith.
 * Replaces the generic browser mockup with a multi-plane 3D engineering
 * portrait instrument featuring real-time pitch/yaw parallax, orbital
 * degree calibration rings, interactive inspection modes, and floating Z-depth
 * telemetry badges — zero neon, zero gradients, pure architectural craft.
 */
export function HeroPortraitShowcase({
  src = "/profile.jpg",
  name = "Taiwo Adebola",
}: HeroPortraitShowcaseProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc =
    src && src.startsWith("/") && !src.startsWith("//") && basePath
      ? `${basePath}${src}`
      : src;

  // Mouse normalized coordinates [-0.5, 0.5]
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 190, damping: 24, mass: 0.6 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7.5, -7.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8.5, 8.5]);

  // Parallax translations for recessed and elevated planes
  const substrateX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
  const substrateY = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const floatX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const floatY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const [isHovered, setIsHovered] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ x: 210, y: 240 });
  const [angleReadout, setAngleReadout] = useState({ pitch: "0.0", yaw: "0.0" });
  const [activePillar, setActivePillar] = useState(0);
  const [lensMode, setLensMode] = useState<"optical" | "blueprint">("optical");

  // Cycle active engineering discipline pill every 3.4s
  useEffect(() => {
    if (prefersReduced) return;
    const timer = window.setInterval(() => {
      setActivePillar((prev) => (prev + 1) % DISCIPLINE_TELEMETRY.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [prefersReduced]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

    if (!prefersReduced) {
      rawX.set(nx);
      rawY.set(ny);
    }

    const mmX = Math.round(((e.clientX - rect.left) / Math.max(1, rect.width)) * 420);
    const mmY = Math.round(((e.clientY - rect.top) / Math.max(1, rect.height)) * 480);
    setCursorCoords({
      x: Math.max(0, Math.min(420, mmX)),
      y: Math.max(0, Math.min(480, mmY)),
    });
    setAngleReadout({
      pitch: (-ny * 15).toFixed(1),
      yaw: (nx * 17).toFixed(1),
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
    setAngleReadout({ pitch: "0.0", yaw: "0.0" });
  };

  const currentPillar = DISCIPLINE_TELEMETRY[activePillar];
  const PillarIcon = currentPillar.icon;

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: "1300px" }}
      className="group/portrait relative mx-auto w-full max-w-[430px] select-none lg:mx-0 lg:ml-auto"
    >
      <motion.div
        style={
          prefersReduced
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="relative w-full will-change-transform"
      >
        {/* ── PLANE -44px Z: Recessed Architectural Blueprint Substrate ── */}
        <motion.div
          aria-hidden="true"
          style={
            prefersReduced
              ? undefined
              : {
                  x: substrateX,
                  y: substrateY,
                  transform: "translateZ(-44px)",
                }
          }
          className="pointer-events-none absolute -inset-3.5 rounded-2xl border border-dashed border-border bg-card/35 transition-colors duration-300 group-hover/portrait:border-accent-blue/40 sm:-inset-5"
        >
          {/* Subtle architectural dot matrix */}
          <div
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--foreground) 16%, transparent) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            className="absolute inset-0 rounded-2xl opacity-55"
          />

          {/* 4 Corner Registration Crosshairs */}
          <span className="label-mono absolute top-2 left-2.5 text-[10px] text-accent-blue">
            +
          </span>
          <span className="label-mono absolute top-2 right-2.5 text-[10px] text-accent-blue">
            +
          </span>
          <span className="label-mono absolute bottom-2 left-2.5 text-[10px] text-accent-blue">
            +
          </span>
          <span className="label-mono absolute right-2.5 bottom-2 text-[10px] text-accent-blue">
            +
          </span>

          {/* Top & Bottom Substrate Coordinate Labels */}
          <div className="label-mono absolute -top-5 left-2 flex items-center gap-2 text-[9px] text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-blue" />
            <span>CAD_SUBSTRATE // Z:-44MM</span>
          </div>
          <div className="label-mono absolute right-2 -bottom-5 text-[9px] text-muted-foreground tabular-nums">
            <span>
              PITCH:{angleReadout.pitch}° · YAW:{angleReadout.yaw}°
            </span>
          </div>
        </motion.div>

        {/* ── PLANE -20px Z: Rotating Precision Orbital Telemetry Ring ── */}
        <div
          aria-hidden="true"
          style={{ transform: "translateZ(-20px)" }}
          className="pointer-events-none absolute -inset-6 hidden items-center justify-center sm:flex"
        >
          <motion.svg
            viewBox="0 0 500 500"
            animate={prefersReduced ? undefined : { rotate: 360 }}
            transition={
              prefersReduced
                ? undefined
                : { duration: 64, repeat: Infinity, ease: "linear" }
            }
            className="h-full w-full text-foreground/15 transition-colors duration-500 group-hover/portrait:text-accent-blue/30"
          >
            <circle
              cx="250"
              cy="250"
              r="242"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 9"
            />
            <circle
              cx="250"
              cy="250"
              r="226"
              fill="none"
              stroke="var(--accent-blue)"
              strokeWidth="1.2"
              strokeDasharray="48 180"
              strokeLinecap="round"
              opacity="0.55"
            />
          </motion.svg>
        </div>

        {/* ── PLANE 0px Z: Primary Architectural Portrait Monolith ── */}
        <div
          style={{ transform: "translateZ(0px)" }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-colors duration-300 group-hover/portrait:border-foreground/25"
        >
          {/* Top Engineering Instrument Header Bar */}
          <div className="flex items-center justify-between border-b border-border bg-background/90 px-3.5 py-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] font-medium tracking-wider text-foreground uppercase">
                PORTRAIT // TA-01
              </span>
            </div>

            {/* Interactive Optical / Blueprint Inspection Mode Switch */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setLensMode((m) => (m === "optical" ? "blueprint" : "optical"))
                }
                className="cursor-pointer rounded border border-border bg-card px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground uppercase transition-colors hover:border-accent-blue hover:text-foreground"
                title="Toggle optical / blueprint inspection grid"
              >
                {lensMode === "optical" ? "MODE: OPTICAL" : "MODE: BLUEPRINT"}
              </button>
            </div>
          </div>

          {/* Portrait Viewport Frame */}
          <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-muted/40">
            {/* High-Resolution Profile Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedSrc}
              alt={name}
              className={`h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover/portrait:scale-[1.03] ${
                lensMode === "blueprint"
                  ? "contrast-125 grayscale"
                  : "contrast-[1.02]"
              }`}
            />

            {/* Architectural Fine Grid Overlay (intensifies in Blueprint mode or hover) */}
            <div
              aria-hidden="true"
              style={{
                backgroundImage: `
                  linear-gradient(to right, color-mix(in oklab, var(--accent-blue) 22%, transparent) 1px, transparent 1px),
                  linear-gradient(to bottom, color-mix(in oklab, var(--accent-blue) 22%, transparent) 1px, transparent 1px)
                `,
                backgroundSize: "28px 28px",
              }}
              className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                lensMode === "blueprint"
                  ? "opacity-65"
                  : "opacity-0 group-hover/portrait:opacity-25"
              }`}
            />

            {/* Ambient Horizontal Biometric / Calibration Scan Hairline */}
            {!prefersReduced ? (
              <motion.div
                aria-hidden="true"
                animate={{ top: ["6%", "92%", "6%"] }}
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-between px-3"
              >
                <div className="h-[1px] flex-1 bg-accent-blue/45" />
                <span className="ml-2 rounded-[2px] bg-background/85 px-1.5 py-[1px] font-mono text-[8px] tracking-wider text-accent-blue backdrop-blur-xs">
                  SCAN_LOCK // OK
                </span>
              </motion.div>
            ) : null}

            {/* 4 Precision Corner Target Reticles (L-brackets) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3.5 z-10 transition-all duration-300 group-hover/portrait:inset-5"
            >
              <span className="absolute top-0 left-0 h-3.5 w-3.5 border-t-2 border-l-2 border-accent-blue" />
              <span className="absolute top-0 right-0 h-3.5 w-3.5 border-t-2 border-r-2 border-accent-blue" />
              <span className="absolute bottom-0 left-0 h-3.5 w-3.5 border-b-2 border-l-2 border-accent-blue" />
              <span className="absolute right-0 bottom-0 h-3.5 w-3.5 border-r-2 border-b-2 border-accent-blue" />
            </div>

            {/* Live Cursor Coordinate Readout inside Portrait */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute top-3 left-3 z-10 rounded border border-border/80 bg-background/85 px-2 py-0.5 font-mono text-[9px] text-foreground tabular-nums backdrop-blur-xs transition-opacity duration-200 ${
                isHovered || lensMode === "blueprint"
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            >
              X:{String(cursorCoords.x).padStart(3, "0")}mm · Y:
              {String(cursorCoords.y).padStart(3, "0")}mm
            </div>
          </div>

          {/* Bottom Architectural Spec Footer Bar */}
          <div className="flex items-center justify-between border-t border-border bg-background/95 px-3.5 py-2.5 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                TAIWO ADEBOLA
              </span>
              <span className="text-muted-foreground">//</span>
              <span className="text-accent-blue">NGA · UTC+1</span>
            </div>
            <span className="text-[9px] tracking-wider text-muted-foreground uppercase">
              B.SC. CYBERSECURITY
            </span>
          </div>
        </div>

        {/* ── PLANE +36px Z: Floating 3D Discipline Telemetry Card (Bottom-Left) ── */}
        <motion.div
          style={
            prefersReduced
              ? undefined
              : {
                  x: floatX,
                  y: floatY,
                  transform: "translateZ(36px)",
                }
          }
          className="pointer-events-auto relative z-20 -mt-6 mr-4 ml-2 rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-md sm:absolute sm:-bottom-5 sm:-left-6 sm:mt-0 sm:mr-0 sm:ml-0 sm:w-[270px]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-accent-blue uppercase">
              {currentPillar.code}
            </span>
            <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-[1px] font-mono text-[8px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              {currentPillar.metric}
            </span>
          </div>

          <div className="mt-2 flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent-blue">
              <PillarIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">
                {currentPillar.label}
              </p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {currentPillar.detail}
              </p>
            </div>
          </div>

          {/* 4-segment progress selector dots */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {DISCIPLINE_TELEMETRY.map((item, idx) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setActivePillar(idx)}
                aria-label={`Inspect ${item.label}`}
                className={`h-1 flex-1 cursor-pointer rounded-full transition-all duration-300 ${
                  idx === activePillar
                    ? "bg-accent-blue"
                    : "bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* ── PLANE +28px Z: Floating 3D Verification Badge (Top-Right) ── */}
        <motion.div
          aria-hidden="true"
          style={
            prefersReduced
              ? undefined
              : {
                  transform: "translateZ(28px)",
                }
          }
          className="pointer-events-none absolute -top-3.5 -right-3.5 z-20 hidden items-center gap-2 rounded-lg border border-border bg-card/95 px-2.5 py-1.5 shadow-lg backdrop-blur-md sm:inline-flex"
        >
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <div className="font-mono text-[9px] leading-tight">
            <p className="font-semibold text-foreground">ORTHO_3D // VERIFIED</p>
            <p className="text-[8px] text-muted-foreground">
              4-PLANE DEPTH RIG
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
