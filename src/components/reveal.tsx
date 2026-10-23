"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Vertical offset in pixels (0 disables movement, opacity only). */
  y?: number;
}

/**
 * Viewport-triggered reveal. Animates opacity and transform only,
 * fires once, and collapses to a plain fade (or nothing) for
 * reduced-motion users.
 */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const prefersReduced = useReducedMotion();
  const offset = prefersReduced ? 0 : y;

  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
