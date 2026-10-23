"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Theme switcher — icon-only button with a subtle rotation between states.
 * Uses useSyncExternalStore for hydration-safe mounted detection (the
 * server snapshot is always false, the client snapshot always true).
 */
const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-300 ${
            mounted && isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-[18px] w-[18px] transition-all duration-300 ${
            mounted && isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
