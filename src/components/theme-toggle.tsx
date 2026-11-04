"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Theme switcher — icon-only button with a subtle rotation between states.
 * Uses CSS dark: variants for instant theme switching without hydration flash,
 * with useTheme() state control.
 */
const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const toggle = () => {
    const currentIsDark = resolvedTheme
      ? resolvedTheme === "dark"
      : typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    setTheme(currentIsDark ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
    >
      <span className="relative block h-[18px] w-[18px]">
        {/* Sun icon: visible in light mode, rotates away in dark mode */}
        <Sun
          className="absolute inset-0 h-[18px] w-[18px] rotate-0 scale-100 opacity-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0"
          aria-hidden="true"
        />
        {/* Moon icon: hidden in light mode, rotates into view in dark mode */}
        <Moon
          className="absolute inset-0 h-[18px] w-[18px] rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
