"use client";

import React, { useCallback, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface KineticTiltProps {
  children: ReactNode;
  className?: string;
  /**
   * Maximum tilt angle in degrees along X and Y axes.
   * Strictly clamped to the 2–4 degree range for tangible physical weight.
   */
  maxDegrees?: number;
  /** Perspective depth in pixels. */
  perspective?: number;
}

/**
 * Kinetic Spatial Tilt:
 * Applies a highly restrained, physics-based 3D rotation (strictly capped at 2–4 degrees)
 * along the X and Y axes as the mouse moves across the container, giving the Hero Safari
 * mockup and abstract SVG cover art tangible physical weight.
 */
export function KineticTilt({
  children,
  className,
  maxDegrees = 3.2,
  perspective = 1100,
}: KineticTiltProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);

  // Enforce strict 2–4 degree cap
  const clampedMax = Math.max(2, Math.min(4, maxDegrees));

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, {
    stiffness: 260,
    damping: 26,
    mass: 0.55,
  });
  const rotateY = useSpring(rawRotateY, {
    stiffness: 260,
    damping: 26,
    mass: 0.55,
  });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Normalized offset in [-0.5, 0.5]
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      const nextRotateX = Math.max(
        -clampedMax,
        Math.min(clampedMax, -ny * 2 * clampedMax),
      );
      const nextRotateY = Math.max(
        -clampedMax,
        Math.min(clampedMax, nx * 2 * clampedMax),
      );

      rawRotateX.set(nextRotateX);
      rawRotateY.set(nextRotateY);
    },
    [clampedMax, prefersReduced, rawRotateX, rawRotateY],
  );

  const handlePointerLeave = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }, [rawRotateX, rawRotateY]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transformPerspective: perspective,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
