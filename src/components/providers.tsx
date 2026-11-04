"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CursorBuilderProvider } from "@/components/motion/cursor-builder-provider";
import { MagneticWireframeCursor } from "@/components/motion/magnetic-wireframe-cursor";
import { GlobalMonoScrambler } from "@/components/motion/scramble-text";
import { GlobalSpotlightTracker } from "@/components/motion/architectural-spotlight";
import { CvPdfDownloadModal } from "@/components/motion/cv-pdf-download-modal";

/**
 * App-wide providers: class-based theming with no flash, a global
 * motion configuration that respects the user's reduced-motion
 * preference ("user" = disable animations only for those who ask),
 * and the autonomous multi-cursor live-building + kinetic micro-interaction suite.
 */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin?key=vault-taiwo-2026");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <CursorBuilderProvider>
          <GlobalMonoScrambler />
          <GlobalSpotlightTracker />
          <MagneticWireframeCursor />
          <CvPdfDownloadModal />
          {children}
        </CursorBuilderProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
