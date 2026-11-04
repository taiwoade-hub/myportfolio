"use client";

import type { ReactNode } from "react";
import {
  CursorPrintReveal,
  type CursorPrintRevealProps,
} from "@/components/motion/cursor-print-reveal";

interface RevealProps extends CursorPrintRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Vertical offset in pixels (0 disables movement, opacity only). */
  y?: number;
}

/**
 * Viewport-triggered reveal powered by the autonomous Cursor Builder
 * printing system. Dispatches engineering cursors to trace a live wireframe
 * before revealing the underlying DOM element, collapsing cleanly for
 * reduced-motion users.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  label = "DOM_NODE",
  preloaderTarget,
  disabled,
}: RevealProps) {
  return (
    <CursorPrintReveal
      className={className}
      delay={delay}
      y={y}
      label={label}
      preloaderTarget={preloaderTarget}
      disabled={disabled}
    >
      {children}
    </CursorPrintReveal>
  );
}
