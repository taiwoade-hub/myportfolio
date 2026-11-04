"use client";

import React, { type ReactNode } from "react";
import { type PreloaderTargetId } from "@/components/motion/cursor-builder-provider";

export interface CursorPrintRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds (compatible with <Reveal />). */
  delay?: number;
  /** Vertical offset in pixels (compatible with <Reveal />). */
  y?: number;
  /** Technical tag displayed on the wireframe box (e.g., "01_WORK", "PROJECT_CARD"). */
  label?: string;
  /**
   * Optional Phase 1 Pre-loader target identifier.
   */
  preloaderTarget?: PreloaderTargetId;
  /** Disable cursor wireframe dispatch and render immediately. */
  disabled?: boolean;
}

/**
 * Wrapper component that registers sections and cards with the granular
 * Multi-Cursor Live Builder DOM scanner while remaining 100% compatible
 * with existing <Reveal /> and <CursorPrintReveal /> usage across the site.
 */
export function CursorPrintReveal({
  children,
  className,
  label,
  preloaderTarget,
  disabled = false,
}: CursorPrintRevealProps) {
  return (
    <div
      data-reveal
      data-print-target={preloaderTarget}
      data-print-label={label}
      data-cb-skip={disabled ? "1" : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
