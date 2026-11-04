"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CIPHER_GLYPHS = "0123456789ABCDEF#%&*+<>_/:;[]=";
const SCRAMBLE_DURATION_MS = 300;

/**
 * Scramble a string at progress `t` in [0, 1], locking characters from left to right
 * while preserving whitespace and punctuation spacing.
 */
function scrambleStringAtProgress(original: string, progress: number): string {
  if (progress >= 1) return original;
  const len = original.length;
  const lockCount = Math.floor(progress * len);
  let out = "";

  for (let i = 0; i < len; i++) {
    const ch = original[i];
    if (ch === " " || ch === "\n" || ch === "\t" || ch === "·" || ch === "—") {
      out += ch;
    } else if (i < lockCount) {
      out += ch;
    } else {
      const randomIdx = Math.floor(Math.random() * CIPHER_GLYPHS.length);
      out += CIPHER_GLYPHS[randomIdx];
    }
  }
  return out;
}

export interface ScrambleTextProps {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

/**
 * Reusable Cryptographic Text Scramble component.
 * On mouse enter, rapidly cycles through ASCII/hex glyphs for 0.3s (300ms)
 * before locking into the actual string.
 */
export function ScrambleText({
  text,
  className,
  as: Tag = "span",
}: ScrambleTextProps) {
  const prefersReduced = Boolean(useReducedMotion());
  const [display, setDisplay] = useState<string>(text);
  const rafRef = useRef<number | null>(null);

  const triggerScramble = useCallback(() => {
    if (prefersReduced) return;
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / SCRAMBLE_DURATION_MS);
      setDisplay(scrambleStringAtProgress(text, progress));

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        setDisplay(text);
        rafRef.current = null;
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
  }, [prefersReduced, text]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const currentText = prefersReduced ? text : display;

  return (
    <Tag
      data-scramble-bound="1"
      onMouseEnter={triggerScramble}
      className={className}
    >
      {currentText}
    </Tag>
  );
}

/**
 * Global delegated listener that automatically applies the 0.3s (300ms)
 * cryptographic terminal decryption effect to any `.label-mono` element or
 * section header (`[data-scramble]`) across the entire portfolio on hover,
 * without mutating child icons or layout geometry.
 */
export function GlobalMonoScrambler() {
  const prefersReduced = Boolean(useReducedMotion());

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const originalTextMap = new WeakMap<Text, string>();
    const activeAnimations = new WeakMap<HTMLElement, number>();
    const lastTriggeredAt = new WeakMap<HTMLElement, number>();

    const collectDirectTextNodes = (root: HTMLElement): Text[] => {
      const nodes: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          const parent = node.parentElement;
          if (parent && parent.closest(".sr-only")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let current = walker.nextNode();
      while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
      }
      return nodes;
    };

    const scrambleElement = (el: HTMLElement) => {
      if (el.dataset.scrambleBound === "1") return;

      const now = performance.now();
      const last = lastTriggeredAt.get(el) ?? 0;
      if (now - last < 360) return;
      lastTriggeredAt.set(el, now);

      const textNodes = collectDirectTextNodes(el);
      if (textNodes.length === 0) return;

      for (const tNode of textNodes) {
        if (!originalTextMap.has(tNode)) {
          originalTextMap.set(tNode, tNode.nodeValue ?? "");
        }
      }

      const prevRaf = activeAnimations.get(el);
      if (prevRaf) {
        window.cancelAnimationFrame(prevRaf);
      }

      const startTime = performance.now();
      const tick = (frameNow: number) => {
        const elapsed = frameNow - startTime;
        const progress = Math.min(1, elapsed / SCRAMBLE_DURATION_MS);

        for (const tNode of textNodes) {
          const orig = originalTextMap.get(tNode);
          if (typeof orig === "string") {
            tNode.nodeValue = scrambleStringAtProgress(orig, progress);
          }
        }

        if (progress < 1) {
          const nextId = window.requestAnimationFrame(tick);
          activeAnimations.set(el, nextId);
        } else {
          for (const tNode of textNodes) {
            const orig = originalTextMap.get(tNode);
            if (typeof orig === "string") {
              tNode.nodeValue = orig;
            }
          }
          activeAnimations.delete(el);
        }
      };

      const id = window.requestAnimationFrame(tick);
      activeAnimations.set(el, id);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const monoEl = target.closest(
        ".label-mono, [data-scramble]",
      ) as HTMLElement | null;
      if (monoEl) {
        scrambleElement(monoEl);
        return;
      }

      // Also trigger scramble on child `.label-mono` tags when hovering a parent card or link
      const cardOrLink = target.closest("a, button, li, article") as HTMLElement | null;
      if (cardOrLink) {
        const innerMono = cardOrLink.querySelector<HTMLElement>(".label-mono");
        if (innerMono) {
          scrambleElement(innerMono);
        }
      }
    };

    document.addEventListener("mouseover", onMouseOver, { passive: true });
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [prefersReduced]);

  return null;
}
