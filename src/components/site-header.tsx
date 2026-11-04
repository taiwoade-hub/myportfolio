"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { useCursorBuilder } from "@/components/motion/cursor-builder-provider";
import { CursorPrintReveal } from "@/components/motion/cursor-print-reveal";

/**
 * Compact, sticky header: monogram + name, desktop nav with an animated
 * active indicator, theme switcher, contact shortcut, and an accessible
 * mobile menu (Escape to close, scroll locked while open, focus returned
 * to the trigger on close).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const { isTargetPrinted } = useCursorBuilder();
  const headerPrinted = isTargetPrinted("header-nav");
  const { scrollYProgress } = useScroll();
  const caliperScaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 34,
    mass: 0.25,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll lock while the menu is open.
  useEffect(() => {
    if (menuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [menuOpen]);

  // Escape closes the menu and restores focus.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        headerPrinted ? "border-border" : "border-transparent",
        scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.02)]",
      )}
    >
      <CursorPrintReveal
        preloaderTarget="header-nav"
        className="container-site flex h-16 items-center justify-between gap-4"
      >
        {/* Wordmark */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          aria-label="Taiwo Adebola — home"
        >
          <BrandLogo size="md" />
          <span className="hidden text-[15px] font-medium tracking-tight sm:block">
            Taiwo Adebola
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  item.href === "/contact" && "hidden xl:inline-flex",
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-accent-blue"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/contact"
            className="ml-1 hidden h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex motion-reduce:active:transform-none"
          >
            Contact
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </CursorPrintReveal>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="panel"
              ref={menuPanelRef}
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="absolute inset-x-0 top-16 z-50 border-b border-border bg-background lg:hidden"
            >
              <ul className="container-site flex flex-col py-4">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-3 text-base transition-colors",
                        isActive(item.href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                      {isActive(item.href) ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" aria-hidden="true" />
                      ) : null}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      {/* 1px Swiss Vernier Caliper Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{
          scaleX: caliperScaleX,
          backgroundColor: "var(--accent-blue)",
        }}
        className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-[1.5px] origin-left"
      />
    </header>
  );
}
