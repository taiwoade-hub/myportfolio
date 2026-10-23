"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * App-wide providers: class-based theming with no flash, and a global
 * motion configuration that respects the user's reduced-motion
 * preference ("user" = disable animations only for those who ask).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
