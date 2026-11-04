"use client";

import React, { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Architectural Spotlight Mask Overlay:
 * Renders a restrained, monochromatic radial CSS mask tracking `clientX / clientY`
 * inside any card with `[data-spotlight-card]`.
 *
 * Instead of neon gradients, it acts like a harsh Swiss architectural flashlight
 * that illuminates only:
 * 1. A fine 16px × 16px drafting grid texture (`--foreground` at 6% opacity)
 * 2. The crisp 1px structural `--border` / `--foreground` perimeter of the hovered card
 * leaving the rest of the grid flat and restrained.
 */
export function ArchitecturalSpotlightLayer({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        className,
      )}
    >
      {/* 1. Monochromatic Swiss drafting grid revealed only within the radial mask */}
      <div
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklab, var(--foreground) 9%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 9%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "18px 18px",
          WebkitMaskImage:
            "radial-gradient(190px circle at var(--spot-x, -200px) var(--spot-y, -200px), #000 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
          maskImage:
            "radial-gradient(190px circle at var(--spot-x, -200px) var(--spot-y, -200px), #000 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
        }}
        className="absolute inset-0"
      />

      {/* 2. Harsh 1px perimeter border illumination strictly under the flashlight beam */}
      <div
        style={{
          border: "1px solid color-mix(in oklab, var(--foreground) 62%, transparent)",
          WebkitMaskImage:
            "radial-gradient(150px circle at var(--spot-x, -200px) var(--spot-y, -200px), #000 0%, rgba(0,0,0,0.7) 45%, transparent 100%)",
          maskImage:
            "radial-gradient(150px circle at var(--spot-x, -200px) var(--spot-y, -200px), #000 0%, rgba(0,0,0,0.7) 45%, transparent 100%)",
        }}
        className="absolute inset-0 rounded-[inherit]"
      />
    </div>
  );
}

/**
 * Global delegated pointer tracker that updates `--spot-x` and `--spot-y` CSS
 * custom properties on any `[data-spotlight-card]` element as the mouse moves.
 * Zero React re-renders during mouse movement.
 */
export function GlobalSpotlightTracker() {
  const prefersReduced = Boolean(useReducedMotion());

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const card = target.closest<HTMLElement>("[data-spotlight-card]");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--spot-x", `${x.toFixed(1)}px`);
      card.style.setProperty("--spot-y", `${y.toFixed(1)}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [prefersReduced]);

  return null;
}
