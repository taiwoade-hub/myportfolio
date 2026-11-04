"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface ClickPulse {
  id: number;
  x: number;
  y: number;
}

const COMPACT_INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [data-magnetic], summary';

/**
 * Non-Distracting Swiss Precision Cursor & Magnetic Corner-Bracket Follower:
 * - Preserves the native OS cursor so clicking and text selection feel 100% natural and effortless.
 * - Follows the pointer with a gossamer-thin 1px spring ring (`22px`) that subtly responds to velocity.
 * - When hovering compact interactive controls (buttons, nav links, pills), the ring morphs
 *   into 4 precision L-shaped corner brackets (`┌ ┐ └ ┘`) that gently frame the element's corners
 *   without covering or inverting the text inside.
 * - Emits a razor-thin concentric CAD ripple on click for crisp tactile feedback.
 */
export function MagneticWireframeCursor() {
  const prefersReduced = Boolean(useReducedMotion());
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  const [isOverCard, setIsOverCard] = useState(false);
  const [pulses, setPulses] = useState<ClickPulse[]>([]);

  const activeElRef = useRef<HTMLElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const pulseIdRef = useRef(0);

  // Spring-driven frame coordinates & dimensions
  const frameX = useMotionValue(-100);
  const frameY = useMotionValue(-100);
  const frameW = useMotionValue(22);
  const frameH = useMotionValue(22);
  const frameR = useMotionValue(999);

  // Tiny trailing dot coordinates (faster spring for subtle parallax depth)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const springX = useSpring(frameX, {
    stiffness: 420,
    damping: 32,
    mass: 0.28,
  });
  const springY = useSpring(frameY, {
    stiffness: 420,
    damping: 32,
    mass: 0.28,
  });
  const springW = useSpring(frameW, {
    stiffness: 440,
    damping: 34,
    mass: 0.26,
  });
  const springH = useSpring(frameH, {
    stiffness: 440,
    damping: 34,
    mass: 0.26,
  });
  const springR = useSpring(frameR, {
    stiffness: 440,
    damping: 34,
    mass: 0.26,
  });

  const springDotX = useSpring(dotX, {
    stiffness: 780,
    damping: 42,
    mass: 0.15,
  });
  const springDotY = useSpring(dotY, {
    stiffness: 780,
    damping: 42,
    mass: 0.15,
  });

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const mq = window.matchMedia("(pointer: fine)");
    const updateMedia = () => {
      setEnabled(mq.matches);
    };

    const initId = window.requestAnimationFrame(updateMedia);
    mq.addEventListener("change", updateMedia);

    return () => {
      window.cancelAnimationFrame(initId);
      mq.removeEventListener("change", updateMedia);
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled || prefersReduced) return;

    const resetMagneticTransform = (el: HTMLElement | null) => {
      if (!el) return;
      if (el.dataset.magneticActive === "1") {
        el.style.transform = "";
        delete el.dataset.magneticActive;
      }
    };

    const syncGeometry = (clientX: number, clientY: number) => {
      dotX.set(clientX);
      dotY.set(clientY);

      const el = activeElRef.current;
      if (!el || !el.isConnected) {
        activeElRef.current = null;
        setIsSnapped(false);
        frameX.set(clientX);
        frameY.set(clientY);
        frameW.set(isOverCard ? 28 : 22);
        frameH.set(isOverCard ? 28 : 22);
        frameR.set(999);
        return;
      }

      const rect = el.getBoundingClientRect();
      // Only snap to compact buttons, links, pills, and controls (never giant containers)
      const isCompactControl =
        rect.width >= 16 &&
        rect.height >= 16 &&
        rect.width <= 320 &&
        rect.height <= 72;

      if (!isCompactControl) {
        resetMagneticTransform(el);
        setIsSnapped(false);
        frameX.set(clientX);
        frameY.set(clientY);
        frameW.set(26);
        frameH.set(26);
        frameR.set(999);
        return;
      }

      const computed = window.getComputedStyle(el);
      const parsedRadius = parseFloat(computed.borderRadius) || 6;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Gentle, non-jarring magnetic pull on compact buttons
      const offsetX = (clientX - centerX) * 0.12;
      const offsetY = (clientY - centerY) * 0.12;

      if (rect.width <= 240 && rect.height <= 56) {
        const pullX = Math.max(-2.2, Math.min(2.2, (clientX - centerX) * 0.07));
        const pullY = Math.max(-1.6, Math.min(1.6, (clientY - centerY) * 0.07));
        el.dataset.magneticActive = "1";
        el.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0)`;
      }

      const pad = 4;
      setIsSnapped(true);
      frameX.set(centerX + offsetX);
      frameY.set(centerY + offsetY);
      frameW.set(rect.width + pad * 2);
      frameH.set(rect.height + pad * 2);
      frameR.set(Math.min(14, parsedRadius + 3));
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      const targetNode = e.target as Element | null;

      // Ignore inputs/textareas so typing is completely unbothered
      if (targetNode?.closest("input, textarea, select, [contenteditable]")) {
        resetMagneticTransform(activeElRef.current);
        activeElRef.current = null;
        setIsSnapped(false);
        setIsOverCard(false);
        frameX.set(e.clientX);
        frameY.set(e.clientY);
        frameW.set(14);
        frameH.set(14);
        frameR.set(999);
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        return;
      }

      const interactive = targetNode?.closest(
        COMPACT_INTERACTIVE_SELECTOR,
      ) as HTMLElement | null;

      const card = Boolean(targetNode?.closest("[data-spotlight-card]"));
      setIsOverCard(card);

      if (interactive !== activeElRef.current) {
        resetMagneticTransform(activeElRef.current);
        activeElRef.current = interactive;
      }

      syncGeometry(e.clientX, e.clientY);
    };

    const onScroll = () => {
      if (activeElRef.current) {
        syncGeometry(mouseRef.current.x, mouseRef.current.y);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setPressed(true);
      const id = ++pulseIdRef.current;
      setPulses((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 460);
    };

    const onMouseUp = () => setPressed(false);

    const onMouseLeaveWindow = () => {
      setVisible(false);
      resetMagneticTransform(activeElRef.current);
      activeElRef.current = null;
      setIsSnapped(false);
      setIsOverCard(false);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeaveWindow);

    return () => {
      resetMagneticTransform(activeElRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
    };
  }, [
    dotX,
    dotY,
    enabled,
    frameH,
    frameR,
    frameW,
    frameX,
    frameY,
    isOverCard,
    prefersReduced,
    visible,
  ]);

  if (!enabled || prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden select-none"
    >
      {/* 1. Tactile CAD Click Ripples */}
      <AnimatePresence>
        {pulses.map((pulse) => (
          <motion.span
            key={pulse.id}
            initial={{ opacity: 0.55, scale: 0.35 }}
            animate={{ opacity: 0, scale: 2.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: pulse.x,
              top: pulse.y,
              translateX: "-50%",
              translateY: "-50%",
              borderColor: "var(--accent-blue)",
            }}
            className="absolute h-7 w-7 rounded-full border"
          />
        ))}
      </AnimatePresence>

      {/* 2. Subtle Precision Core Dot (hides when snapped around a button so the button stays spotless) */}
      <motion.div
        style={{
          x: springDotX,
          y: springDotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible && !isSnapped ? 0.55 : 0,
          scale: pressed ? 0.7 : 1,
          backgroundColor: "var(--accent-blue)",
        }}
        className="absolute top-0 left-0 h-1 w-1 rounded-full transition-opacity duration-150 will-change-transform"
      />

      {/*
        3. Gossamer Spring Ring -> Magnetic Corner-Bracket Frame:
        - Free-roaming: 22×22px ultra-subtle ring (28×28px with crosshair ticks when over a card).
        - Hovering a button/link: smoothly morphs to frame the button's perimeter with 4 crisp
          corner brackets (`┌ ┐ └ ┘`) in `--accent-blue` and a faint hairline border.
      */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: springW,
          height: springH,
          borderRadius: springR,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.96 : 1,
          borderColor: isSnapped
            ? "color-mix(in oklab, var(--accent-blue) 42%, transparent)"
            : isOverCard
            ? "color-mix(in oklab, var(--accent-blue) 48%, transparent)"
            : "color-mix(in oklab, var(--foreground) 22%, transparent)",
        }}
        className="absolute top-0 left-0 border transition-[border-color,opacity] duration-150 will-change-transform"
      >
        {/* Corner L-Brackets when snapped onto a button/link */}
        {isSnapped ? (
          <>
            <span
              style={{ borderColor: "var(--accent-blue)" }}
              className="absolute -top-[1px] -left-[1px] h-2.5 w-2.5 rounded-tl-[2px] border-t-[1.5px] border-l-[1.5px]"
            />
            <span
              style={{ borderColor: "var(--accent-blue)" }}
              className="absolute -top-[1px] -right-[1px] h-2.5 w-2.5 rounded-tr-[2px] border-t-[1.5px] border-r-[1.5px]"
            />
            <span
              style={{ borderColor: "var(--accent-blue)" }}
              className="absolute -bottom-[1px] -left-[1px] h-2.5 w-2.5 rounded-bl-[2px] border-b-[1.5px] border-l-[1.5px]"
            />
            <span
              style={{ borderColor: "var(--accent-blue)" }}
              className="absolute -right-[1px] -bottom-[1px] h-2.5 w-2.5 rounded-br-[2px] border-r-[1.5px] border-b-[1.5px]"
            />
          </>
        ) : isOverCard ? (
          /* Subtle cardinal ticks when gliding over a Project/Stack card */
          <>
            <span
              style={{ backgroundColor: "var(--accent-blue)" }}
              className="absolute -top-[3px] left-1/2 h-[3px] w-[1px] -translate-x-1/2 opacity-60"
            />
            <span
              style={{ backgroundColor: "var(--accent-blue)" }}
              className="absolute -bottom-[3px] left-1/2 h-[3px] w-[1px] -translate-x-1/2 opacity-60"
            />
            <span
              style={{ backgroundColor: "var(--accent-blue)" }}
              className="absolute top-1/2 -left-[3px] h-[1px] w-[3px] -translate-y-1/2 opacity-60"
            />
            <span
              style={{ backgroundColor: "var(--accent-blue)" }}
              className="absolute top-1/2 -right-[3px] h-[1px] w-[3px] -translate-y-1/2 opacity-60"
            />
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
