"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Animated Swiss-Editorial CAD Monogram (`TA`):
 * - Matches `src/app/icon.svg` with theme-adaptive OKLCH variables (`--foreground`, `--accent-blue`, `--border`, `--card`).
 * - Features a continuous 1px orbiting signal trace around the frame perimeter,
 *   4 corner CAD registration brackets, geometric vector `T` and `A` strokes,
 *   and an interactive re-draw / lock-in sequence on hover.
 */
export function BrandLogo({ size = "md", className }: BrandLogoProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [drawKey, setDrawKey] = useState(0);

  const dimensions =
    size === "sm"
      ? "h-7 w-7"
      : size === "lg"
      ? "h-10 w-10"
      : "h-8 w-8";

  return (
    <motion.span
      aria-hidden="true"
      onMouseEnter={() => {
        setHovered(true);
        if (!prefersReduced) setDrawKey((k) => k + 1);
      }}
      onMouseLeave={() => setHovered(false)}
      whileHover={prefersReduced ? undefined : { scale: 1.05 }}
      whileTap={prefersReduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-card text-foreground select-none",
        dimensions,
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Subtle Inner Drafting Crosshairs */}
        <path
          d="M2 32H62M32 2V62"
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1"
        />

        {/* Base Hairline Perimeter Frame */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="11.5"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* Continuous Orbiting 1px Perimeter Signal Trace */}
        {!prefersReduced ? (
          <motion.rect
            x="2.5"
            y="2.5"
            width="59"
            height="59"
            rx="11.5"
            stroke="var(--accent-blue)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="34 196"
            animate={{ strokeDashoffset: [230, 0] }}
            transition={{
              duration: hovered ? 2.2 : 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ) : null}

        {/* 4 Corner CAD Registration Brackets */}
        <motion.g
          animate={
            prefersReduced
              ? undefined
              : { scale: hovered ? 0.94 : 1 }
          }
          style={{ transformOrigin: "32px 32px" }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <path
            d="M8 15V9.5C8 8.67 8.67 8 9.5 8H15"
            stroke="var(--accent-blue)"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
          <path
            d="M49 8H54.5C55.33 8 56 8.67 56 9.5V15"
            stroke="var(--accent-blue)"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
          <path
            d="M8 49V54.5C8 55.33 8.67 56 9.5 56H15"
            stroke="var(--accent-blue)"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
          <path
            d="M56 49V54.5C56 55.33 55.33 56 54.5 56H49"
            stroke="var(--accent-blue)"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </motion.g>

        {/* Precision Vector 'T' */}
        <motion.path
          key={`t-${drawKey}`}
          d="M13 21H29M21 21V44"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={prefersReduced ? false : { pathLength: 0.25, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.21, 0.47, 0.32, 0.98] }}
        />

        {/* Precision Vector 'A' Chevron */}
        <motion.path
          key={`a-${drawKey}`}
          d="M32 44L41 21L50 44"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={prefersReduced ? false : { pathLength: 0.25, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 0.46,
            delay: 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        />

        {/* Animated Accent Crossbar inside 'A' */}
        <motion.path
          key={`bar-${drawKey}`}
          d="M35.5 36H46.5"
          stroke="var(--accent-blue)"
          strokeWidth="3.8"
          strokeLinecap="square"
          initial={prefersReduced ? false : { scaleX: 0.2, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          style={{ transformOrigin: "41px 36px" }}
          transition={{
            duration: 0.38,
            delay: 0.12,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        />

        {/* Top-Right Telemetry Pulse Node */}
        <motion.circle
          cx="50"
          cy="14"
          r="2.4"
          fill="#10b981"
          animate={
            prefersReduced
              ? undefined
              : {
                  opacity: [1, 0.38, 1],
                  scale: [1, 1.25, 1],
                }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.span>
  );
}
