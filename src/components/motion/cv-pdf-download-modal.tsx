"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Download, ExternalLink, FileText, X } from "lucide-react";
import { KineticTilt } from "@/components/motion/kinetic-tilt";
import { site } from "@/lib/site";

/**
 * Global Animated A4 CV Compiler & Interactive Sheet Preview Modal.
 * Intercepts clicks on any CV PDF download link (`a[download]`, `a[href$=".pdf"]`)
 * across the portfolio (Hero, Footer, /cv), plays a crisp 1.2s Swiss-editorial
 * A4 sheet compilation & line-drawing animation while triggering the real PDF download,
 * and lets the user inspect the animated 3D A4 CV sheet on screen.
 */
export function CvPdfDownloadModal() {
  const prefersReduced = Boolean(useReducedMotion());
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"compiling" | "ready">("compiling");
  const [progress, setProgress] = useState(0);
  const [pdfHref, setPdfHref] = useState<string>(site.cvPath);

  const triggerBrowserDownload = useCallback((url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "taiwo-adebola-cv.pdf";
    a.dataset.bypassModal = "1";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.dataset.bypassModal === "1") return;

      const href = anchor.getAttribute("href") ?? "";
      const isCvPdf =
        anchor.hasAttribute("download") &&
        (href.endsWith(".pdf") || href.includes("/cv"));

      if (!isCvPdf) return;

      e.preventDefault();
      setPdfHref(href || site.cvPath);
      setOpen(true);
      setPhase(prefersReduced ? "ready" : "compiling");
      setProgress(prefersReduced ? 100 : 0);

      if (prefersReduced) {
        triggerBrowserDownload(href || site.cvPath);
        return;
      }

      const start = performance.now();
      const duration = 1150;
      let downloaded = false;

      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setProgress(Math.round(p * 100));
        if (p < 1) {
          window.requestAnimationFrame(tick);
        } else {
          setPhase("ready");
          if (!downloaded) {
            downloaded = true;
            triggerBrowserDownload(href || site.cvPath);
          }
        }
      };

      window.requestAnimationFrame(tick);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [prefersReduced, triggerBrowserDownload]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cv-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          data-cb-ignore
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md sm:p-6"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            {/* Top Telemetry Header Bar */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    phase === "ready"
                      ? "bg-emerald-500"
                      : "animate-pulse bg-accent-blue"
                  }`}
                />
                <span className="label-mono text-foreground">
                  {phase === "compiling"
                    ? `COMPILING A4 VECTOR SHEET // ${progress}%`
                    : "A4 VECTOR CV READY // DOWNLOAD DISPATCHED"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close CV preview"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Center Stage: Interactive 3D Animated A4 Swiss-Editorial Sheet */}
            <div className="overflow-y-auto bg-muted/30 p-4 sm:p-6">
              <KineticTilt maxDegrees={2.6} className="mx-auto max-w-2xl">
                <div className="relative overflow-hidden rounded-lg border border-border bg-[#fcfbf9] p-5 text-[#171718] shadow-xl sm:p-7">
                  {/* Animated laser scan line while compiling */}
                  {phase === "compiling" ? (
                    <motion.div
                      initial={{ top: "0%" }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.1, ease: "linear" }}
                      className="pointer-events-none absolute inset-x-0 z-20 h-[2px] bg-accent-blue shadow-[0_0_12px_rgba(37,99,235,0.5)]"
                    />
                  ) : null}

                  {/* 4 Corner Registration Crosshairs (+) */}
                  <span className="pointer-events-none absolute top-2.5 left-2.5 font-mono text-[10px] text-[#2461d1]">
                    +
                  </span>
                  <span className="pointer-events-none absolute top-2.5 right-2.5 font-mono text-[10px] text-[#2461d1]">
                    +
                  </span>
                  <span className="pointer-events-none absolute bottom-2.5 left-2.5 font-mono text-[10px] text-[#2461d1]">
                    +
                  </span>
                  <span className="pointer-events-none absolute right-2.5 bottom-2.5 font-mono text-[10px] text-[#2461d1]">
                    +
                  </span>

                  {/* Top Document Ref Row */}
                  <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-2 font-mono text-[9px] tracking-wider uppercase">
                    <span className="text-[#78787c]">
                      DOC_REF // TA-CV-2026.V2
                    </span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 }}
                      className="rounded border border-[#2461d1] bg-[#eef5fe] px-1.5 py-0.5 font-semibold text-[#2461d1]"
                    >
                      STATUS: VERIFIED · ATS-COMPLIANT
                    </motion.span>
                  </div>

                  {/* Sheet Header Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    className="mt-4 flex flex-col justify-between gap-3 border-b-2 border-[#171718] pb-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-12 w-12 shrink-0 rounded-lg border border-[#2461d1] bg-white p-0.5 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/profile.jpg`}
                          alt="Taiwo Adebola"
                          className="h-full w-full rounded-[5px] object-cover object-top"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-full border-2 border-[#fcfbf9] bg-emerald-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-[#171718]">
                          TAIWO ADEBOLA
                        </h3>
                        <p className="font-mono text-[9px] font-semibold tracking-wider text-[#2461d1] uppercase">
                          Software Engineer · Cybersecurity · DevOps · AI Automation
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#5c5c60]">
                          B.Sc. Cybersecurity Candidate · Builder of Practical Software &amp; Self-Hosted Infrastructure
                        </p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] leading-relaxed text-[#5c5c60] sm:text-right">
                      <p>NIGERIA (REMOTE / HYBRID)</p>
                      <p className="font-semibold text-[#171718]">
                        TAIWOADEBOLA.APP
                      </p>
                      <p>GITHUB.COM/TAIWOADE-HUB</p>
                    </div>
                  </motion.div>

                  {/* 01 // Engineering Profile */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.35 }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-2 border-b border-[#d9d9d4] pb-1 font-mono text-[9px] font-bold uppercase">
                      <span className="text-[#2461d1]">01</span>
                      <span className="h-[1px] w-4 bg-[#d9d9d4]" />
                      <span>ENGINEERING PROFILE</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#525256]">
                      Cybersecurity undergraduate and software engineer who learns
                      by designing, building, and operating real systems across
                      Next.js, TypeScript, Python verification pipelines, and
                      self-hosted Linux infrastructure.
                    </p>
                  </motion.div>

                  {/* 02 // Selected Systems Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42, duration: 0.35 }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-2 border-b border-[#d9d9d4] pb-1 font-mono text-[9px] font-bold uppercase">
                      <span className="text-[#2461d1]">02</span>
                      <span className="h-[1px] w-4 bg-[#d9d9d4]" />
                      <span>SELECTED SYSTEMS &amp; ARCHITECTURE</span>
                    </div>
                    <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        {
                          name: "Verify Hub",
                          status: "IN DEVELOPMENT",
                          stack: "Python · Playwright · GitHub · Telegram",
                          desc: "Automated website verification & headless browser evidence pipeline.",
                        },
                        {
                          name: "Order of Service",
                          status: "IN DEVELOPMENT",
                          stack: "Next.js · TypeScript · Tailwind",
                          desc: "Real-time document planning engine with live split-pane preview.",
                        },
                        {
                          name: "Self-Hosted Cloud Lab",
                          status: "ACTIVE · ONGOING",
                          stack: "Ubuntu · Coolify · Docker · Postgres · Redis",
                          desc: "Production self-hosted PaaS with automated webhook deploys & TLS proxy.",
                        },
                        {
                          name: "Alchemist Market Engine",
                          status: "IN DEVELOPMENT",
                          stack: "Python · Algorithmic Analysis",
                          desc: "BOS/CHOCH & Fair Value Gap market-structure detection pipeline.",
                        },
                      ].map((proj, idx) => (
                        <motion.div
                          key={proj.name}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.08 }}
                          className="border border-[#d9d9d4] border-l-2 border-l-[#2461d1] bg-white p-2.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-[#171718]">
                              {proj.name}
                            </span>
                            <span className="border border-[#2461d1]/50 bg-[#eef5fe] px-1 py-0.5 font-mono text-[7.5px] font-semibold text-[#2461d1]">
                              {proj.status}
                            </span>
                          </div>
                          <p className="mt-0.5 font-mono text-[8.5px] text-[#2461d1]">
                            {proj.stack}
                          </p>
                          <p className="mt-1 text-[10px] leading-snug text-[#5c5c60]">
                            {proj.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 03 // Technical Capabilities Matrix */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.78, duration: 0.35 }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-2 border-b border-[#d9d9d4] pb-1 font-mono text-[9px] font-bold uppercase">
                      <span className="text-[#2461d1]">03</span>
                      <span className="h-[1px] w-4 bg-[#d9d9d4]" />
                      <span>TECHNICAL CAPABILITIES MATRIX</span>
                    </div>
                    <div className="mt-2 space-y-1 text-[10px]">
                      <div className="grid grid-cols-[110px_1fr] gap-2">
                        <span className="font-mono text-[8.5px] font-bold text-[#2461d1]">
                          CORE &amp; LANGUAGES
                        </span>
                        <span className="text-[#171718]">
                          Python · TypeScript · JavaScript · SQL · Bash · HTML/CSS
                        </span>
                      </div>
                      <div className="grid grid-cols-[110px_1fr] gap-2">
                        <span className="font-mono text-[8.5px] font-bold text-[#2461d1]">
                          STACK &amp; INFRA
                        </span>
                        <span className="text-[#171718]">
                          Next.js 16 · React 19 · FastAPI · Docker · Coolify · PostgreSQL · Redis
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </KineticTilt>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  <strong className="font-medium text-foreground">
                    taiwo-adebola-cv.pdf
                  </strong>{" "}
                  (A4 Vector · ATS-Ready)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={pdfHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-bypass-modal="1"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-[11px] text-foreground transition-colors hover:bg-accent"
                >
                  <FileText className="h-3 w-3 text-accent-blue" />
                  Open PDF Tab
                </a>
                <Link
                  href="/cv"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 font-mono text-[11px] text-foreground transition-colors hover:bg-accent"
                >
                  <ExternalLink className="h-3 w-3 text-accent-blue" />
                  Interactive CV
                </Link>
                <button
                  type="button"
                  onClick={() => triggerBrowserDownload(pdfHref)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 font-mono text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Download className="h-3 w-3" />
                  Download Again
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
