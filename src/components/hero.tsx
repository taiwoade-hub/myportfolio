"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Download, Github, Linkedin, Sparkles } from "lucide-react";
import type { SocialLinks } from "@/lib/site";
import { Safari } from "@/components/ui/safari";
import { CursorPrintReveal } from "@/components/motion/cursor-print-reveal";
import { useCursorBuilder } from "@/components/motion/cursor-builder-provider";
import { KineticTilt } from "@/components/motion/kinetic-tilt";

interface HeroProps {
  social: SocialLinks;
  availability: string | null;
  cvPath: string;
  name?: string;
  headline?: string;
  intro?: string;
  roles?: string[];
  heroVariant?: string;
}

/**
 * Opening section: restrained, typographic, staggered entrance.
 * Integrated with the autonomous multi-cursor live-building pre-loader
 * across 4 Hero DOM target zones + the sticky SiteHeader.
 */
export function Hero({
  social,
  availability,
  cvPath,
  name = "Taiwo Adebola",
  headline = "I build software, solve problems, and turn ideas into working products.",
  intro = "I'm a cybersecurity student and aspiring software engineer interested in building useful applications, secure systems, intelligent automation and reliable infrastructure. I enjoy learning by creating real projects and exploring how technology works beneath the surface.",
  roles,
  heroVariant = "shader",
}: HeroProps) {
  const { isPreloaderComplete } = useCursorBuilder();
  const displayRoles = roles && roles.length > 0 ? roles.join(" · ") : "Software Engineer · Cybersecurity · DevOps · AI & Automation";

  return (
    <section
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden"
      aria-label="Introduction"
      data-hero-variant={heroVariant}
    >
      <div className="container-site w-full py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ── Left Column: Intro & Content ─────────────────────── */}
          <div className="lg:col-span-7">
            {/* Target 2: Availability radar pill & Monogram label */}
            <CursorPrintReveal preloaderTarget="hero-badge">
              {availability ? (
                <div className="mb-6">
                  <span className="label-mono inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="animate-availability inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                    />
                    {availability}
                  </span>
                </div>
              ) : null}

              <p className="label-mono text-accent-blue">
                {name}
              </p>
            </CursorPrintReveal>

            {/* Target 3: h1 Main Title, multi-discipline role ticker & intro */}
            <CursorPrintReveal preloaderTarget="hero-title">
              <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl lg:text-[2.9rem] xl:text-[3.3rem]">
                {headline}
              </h1>

              <p className="mt-5 font-mono text-[13px] tracking-wide text-muted-foreground">
                {displayRoles}
              </p>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {intro}
              </p>
            </CursorPrintReveal>

            {/* Target 4: Primary CTA buttons & Social/CV pills */}
            <CursorPrintReveal preloaderTarget="hero-cta">
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
                >
                  Explore My Work
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-medium transition-all duration-200 hover:border-foreground/25 hover:bg-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
                >
                  Get In Touch
                </Link>
              </div>

              {/* Professional links — rendered only when configured */}
              <div className="mt-8 flex items-center gap-3">
                {social.github ? (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                {social.linkedin ? (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
                <Link
                  href="/cv"
                  className="label-mono inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                  Interactive CV
                </Link>
                <a
                  href={cvPath}
                  download
                  className="label-mono inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Download CV (PDF)"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  PDF
                </a>
              </div>
            </CursorPrintReveal>
          </div>

          {/* ── Right Column: Target 5 — Safari Browser UI with Exploded 3D CAD Layers ──── */}
          <CursorPrintReveal
            preloaderTarget="hero-safari"
            className="lg:col-span-5 flex items-center justify-center lg:justify-end"
          >
            <KineticTilt
              maxDegrees={3.6}
              perspective={1200}
              className="group/safari relative w-full max-w-[540px]"
            >
              {/* Recessed 3D CAD Substrate Layer (-44px Z) */}
              <div
                aria-hidden="true"
                style={{
                  transform: "translateZ(-44px) translate3d(14px, 14px, 0)",
                }}
                className="pointer-events-none absolute inset-0 rounded-2xl border border-dashed border-border bg-background/40 opacity-0 transition-opacity duration-300 group-hover/safari:opacity-100"
              >
                <span className="label-mono absolute right-3 -bottom-5 text-[9px] text-muted-foreground">
                  Z:-44mm // SUBSTRATE_00
                </span>
              </div>

              {/* Middle 3D CAD Wireframe Layer (-22px Z) */}
              <div
                aria-hidden="true"
                style={{
                  transform: "translateZ(-22px) translate3d(7px, 7px, 0)",
                }}
                className="pointer-events-none absolute inset-0 rounded-2xl border border-accent-blue/40 bg-card/30 opacity-0 transition-opacity duration-300 group-hover/safari:opacity-100"
              >
                <span className="label-mono absolute -top-5 left-3 text-[9px] text-accent-blue">
                  Z:-22mm // WIREFRAME_MESH
                </span>
              </div>

              {/* Primary Surface Layer (0px Z) */}
              <div className="relative drop-shadow-2xl">
                <Safari
                  url="taiwoadebola.app"
                  src="/profile.jpg"
                  className="size-full rounded-2xl transition-transform duration-500"
                />
              </div>

              {/* Elevated 3D Telemetry Callout (+24px Z) */}
              <div
                aria-hidden="true"
                style={{
                  transform: "translateZ(24px)",
                }}
                className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-2 rounded border border-border bg-background/95 px-2.5 py-1 opacity-0 shadow-sm transition-opacity duration-300 group-hover/safari:opacity-100 sm:inline-flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                <span className="label-mono text-[9px] text-foreground">
                  ORTHO_3D // 1203 × 753
                </span>
              </div>
            </KineticTilt>
          </CursorPrintReveal>
        </div>
      </div>

      {/* Scroll cue — revealed upon Phase 1 pre-loader completion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderComplete ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="pointer-events-none absolute inset-x-0 bottom-7 hidden justify-center sm:flex"
        aria-hidden="true"
      >
        <span className="flex flex-col items-center gap-2 text-muted-foreground/70">
          <span className="label-mono">Scroll</span>
          <ChevronDown className="animate-scroll-cue h-4 w-4" />
        </span>
      </motion.div>
    </section>
  );
}

