"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/articles";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Editorial article row — shared by the home teaser and the blog index.
 * Enhanced with a floating 3D orthographic document schematic card on hover
 * that tilts subtly based on pointer velocity (zero neon, zero gradients).
 */
export function ArticleRow({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  const prefersReduced = Boolean(useReducedMotion());
  const rowRef = useRef<HTMLLIElement>(null);
  const [hovered, setHovered] = useState(false);

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const tiltZ = useMotionValue(0);

  const springX = useSpring(cardX, { stiffness: 360, damping: 32, mass: 0.35 });
  const springY = useSpring(cardY, { stiffness: 360, damping: 32, mass: 0.35 });
  const springTilt = useSpring(tiltZ, {
    stiffness: 280,
    damping: 26,
    mass: 0.4,
  });

  const lastXRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (prefersReduced) return;
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    if (lastXRef.current !== null) {
      const vx = relX - lastXRef.current;
      tiltZ.set(Math.max(-3.5, Math.min(3.5, vx * 0.25)));
    }
    lastXRef.current = relX;

    cardX.set(relX + 24);
    cardY.set(relY - 48);
  };

  return (
    <li
      ref={rowRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        lastXRef.current = null;
        tiltZ.set(0);
      }}
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative border-b border-border last:border-b-0",
        className,
      )}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="flex flex-col gap-2 py-6 transition-colors first:pt-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:flex-row sm:items-center sm:gap-8"
      >
        <time
          dateTime={article.date}
          className="shrink-0 font-mono text-[12px] tracking-wide text-muted-foreground/70 sm:w-28"
        >
          {formatDate(article.date)}
        </time>
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-medium leading-snug tracking-tight transition-colors group-hover:text-accent-blue">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        </div>
        <span className="label-mono hidden shrink-0 items-center gap-1.5 text-muted-foreground/60 transition-colors group-hover:text-accent-blue sm:flex">
          {article.minutes} min
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </span>
      </Link>

      {/* Floating 3D Orthographic Document Index Schematic (Desktop) */}
      {!prefersReduced && hovered ? (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            x: springX,
            y: springY,
            rotateZ: springTilt,
            transformPerspective: 900,
          }}
          className="pointer-events-none absolute top-0 left-0 z-30 hidden w-56 rounded-md border border-border bg-card p-3 shadow-xl lg:block"
        >
          <div className="flex items-center justify-between border-b border-border pb-1.5">
            <span className="label-mono text-[9px] text-accent-blue">
              FIELD_REPORT
            </span>
            <span className="font-mono text-[9px] text-muted-foreground tabular-nums">
              {article.minutes}M READ
            </span>
          </div>

          {/* Miniature Swiss typographic page wireframe */}
          <div className="mt-2.5 space-y-1.5">
            <div className="h-1.5 w-3/4 bg-foreground/70" />
            <div className="h-1 w-full bg-border" />
            <div className="h-1 w-5/6 bg-border" />
            <div className="grid grid-cols-3 gap-1 pt-1">
              <div className="h-5 border border-accent-blue/60 bg-accent-blue/5" />
              <div className="col-span-2 space-y-1 pt-0.5">
                <div className="h-1 w-full bg-border" />
                <div className="h-1 w-2/3 bg-border" />
              </div>
            </div>
          </div>

          {article.tags && article.tags.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1 border-t border-border pt-1.5">
              {article.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </li>
  );
}
