"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Download, Github, Linkedin } from "lucide-react";
import type { SocialLinks } from "@/lib/site";

interface HeroProps {
  social: SocialLinks;
  availability: string | null;
  cvPath: string;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

/**
 * Opening section: restrained, typographic, staggered entrance.
 * One accent color, one idea per line, nothing decorative that moves.
 */
export function Hero({ social, availability, cvPath }: HeroProps) {
  return (
    <section
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden"
      aria-label="Introduction"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-site w-full py-20 sm:py-24"
      >
        {/* Availability — only rendered when configured & accurate */}
        {availability ? (
          <motion.div variants={item} className="mb-6">
            <span className="label-mono inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">
              <span
                aria-hidden="true"
                className="animate-availability inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
              {availability}
            </span>
          </motion.div>
        ) : null}

        <motion.p
          variants={item}
          className="label-mono text-accent-blue"
        >
          Taiwo Adebola
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.6rem]"
        >
          I build software, solve problems, and turn ideas into working
          products.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 font-mono text-[13px] tracking-wide text-muted-foreground"
        >
          Software Engineer · Cybersecurity · DevOps · AI &amp; Automation
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base"
        >
          I&apos;m a cybersecurity student and aspiring software engineer
          interested in building useful applications, secure systems,
          intelligent automation and reliable infrastructure. I enjoy learning
          by creating real projects and exploring how technology works beneath
          the surface.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
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
        </motion.div>

        {/* Professional links — rendered only when configured */}
        <motion.div
          variants={item}
          className="mt-8 flex items-center gap-3"
        >
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
          <a
            href={cvPath}
            download
            className="label-mono inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Download CV (PDF)"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            CV · PDF
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
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
