"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  isAccent: boolean;
}

interface SwimmingCursor {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  swimPhase: number;
  swimFreq: number;
  maxSpeed: number;
  size: number;
  isAlpha: boolean;
  tag: string;
  cooldown: number;
  trail: { x: number; y: number }[];
}

const ALPHA_TAGS = ["SEEK_01", "LURE_02", "FLOW_03", "ECHO_04", "SWIM_05"];

/**
 * Ambient Water Surface & Schooling Cursor Background ("Cursor Pond"):
 * - Renders a calm, Swiss-editorial architectural water surface behind the Home page.
 * - Moving or clicking the mouse creates expanding 1px concentric water ripples that subtly
 *   refract the underlying coordinate grid.
 * - A school of 32 autonomous micro-cursors swims through the water using Boids schooling
 *   physics + sinusoidal tail propulsion, actively chasing the user's mouse lure, darting in
 *   to "nibble" the ripple ring, and scattering playfully when the user clicks.
 */
export function WaterCursorSchool() {
  const prefersReduced = Boolean(useReducedMotion());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };
    resize();

    // Theme colors resolved from CSS variables
    let fgColor = "#18181b";
    let accentColor = "#2563eb";
    let isDark = document.documentElement.classList.contains("dark");

    const syncThemeColors = () => {
      isDark = document.documentElement.classList.contains("dark");
      const styles = window.getComputedStyle(document.documentElement);
      const rawFg = styles.getPropertyValue("--foreground").trim();
      const rawAccent = styles.getPropertyValue("--accent-blue").trim();
      fgColor = rawFg || (isDark ? "#f4f4f5" : "#18181b");
      accentColor = rawAccent || "#2563eb";
    };
    syncThemeColors();

    const themeObserver = new MutationObserver(syncThemeColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    // Spawn school of swimming micro-cursors
    const count = width < 768 ? 15 : 32;
    const school: SwimmingCursor[] = Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.4 + Math.random() * 1.2;
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        id: i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        swimPhase: Math.random() * Math.PI * 2,
        swimFreq: 0.14 + Math.random() * 0.07,
        maxSpeed: 2.5 + Math.random() * 1.35,
        size: i < 5 ? 11.5 : 8.5 + (i % 3) * 1.1,
        isAlpha: i < 5,
        tag: ALPHA_TAGS[i] ?? "",
        cooldown: 0,
        trail: Array.from({ length: 7 }, () => ({ x, y })),
      };
    });

    const ripples: WaterRipple[] = [];

    const spawnRipple = (
      x: number,
      y: number,
      maxRadius = 110,
      alpha = 0.28,
      isAccent = true,
    ) => {
      if (ripples.length > 28) ripples.shift();
      ripples.push({
        x,
        y,
        radius: 3,
        maxRadius,
        alpha,
        speed: 1.45 + Math.random() * 0.45,
        isAccent,
      });
    };

    // Mouse lure tracking
    const mouse = {
      x: width * 0.5,
      y: height * 0.42,
      prevX: width * 0.5,
      prevY: height * 0.42,
      active: false,
      lastMoveAt: 0,
      scareUntil: 0,
    };

    let lastRippleDist = 0;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      const stepDist = Math.hypot(dx, dy);

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.lastMoveAt = performance.now();

      lastRippleDist += stepDist;
      if (lastRippleDist > 34) {
        lastRippleDist = 0;
        spawnRipple(e.clientX, e.clientY, 95 + Math.min(60, stepDist * 1.2), 0.24, true);
      }

      // Very fast whip startles nearby fish briefly
      if (stepDist > 58) {
        mouse.scareUntil = performance.now() + 260;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      mouse.scareUntil = performance.now() + 480;
      // Triple water splash on click
      spawnRipple(e.clientX, e.clientY, 170, 0.36, true);
      spawnRipple(e.clientX, e.clientY, 115, 0.25, false);
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    let rafId = 0;
    let frame = 0;

    const render = (now: number) => {
      frame++;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Determine active lure coordinates (mouse when active, gentle wandering current when idle)
      const isMouseFresh = mouse.active && now - mouse.lastMoveAt < 6000;
      const idleLureX =
        width * 0.5 + Math.cos(now * 0.00045) * (width * 0.28);
      const idleLureY =
        height * 0.45 + Math.sin(now * 0.00065) * (height * 0.24);

      const lureX = isMouseFresh ? mouse.x : idleLureX;
      const lureY = isMouseFresh ? mouse.y : idleLureY;
      const isScared = now < mouse.scareUntil;

      // Ambient bobbing water ripple on the lure
      if (frame % 75 === 0) {
        spawnRipple(lureX, lureY, isMouseFresh ? 85 : 70, 0.16, true);
      }

      // 1. Draw Subtle Refracted Water Surface Dots
      const gridStep = width < 768 ? 56 : 48;
      ctx.fillStyle = fgColor;
      ctx.globalAlpha = isDark ? 0.075 : 0.065;

      for (let gx = gridStep / 2; gx < width; gx += gridStep) {
        for (let gy = gridStep / 2; gy < height; gy += gridStep) {
          let ox = 0;
          let oy = 0;

          // Displace water surface points near active ripples or mouse lure
          const dxL = gx - lureX;
          const dyL = gy - lureY;
          const distL = Math.hypot(dxL, dyL);
          if (distL < 160 && distL > 1) {
            const wave = Math.sin(distL * 0.08 - now * 0.005) * (1 - distL / 160) * 3.2;
            ox += (dxL / distL) * wave;
            oy += (dyL / distL) * wave;
          }

          ctx.fillRect(gx + ox - 0.75, gy + oy - 0.75, 1.5, 1.5);
        }
      }

      // 2. Update & Draw Expanding Water Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        const progress = r.radius / r.maxRadius;
        if (progress >= 1) {
          ripples.splice(i, 1);
          continue;
        }

        const currentAlpha = r.alpha * (1 - progress) * (1 - progress * 0.5);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.isAccent ? accentColor : fgColor;
        ctx.globalAlpha = currentAlpha;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Update & Draw Schooling Cursors ("Swimming in water trying to catch the mouse")
      for (let i = 0; i < school.length; i++) {
        const fish = school[i];
        if (fish.cooldown > 0) fish.cooldown--;

        // Boids neighborhood forces (Separation, Alignment, Cohesion)
        let sepX = 0;
        let sepY = 0;
        let alignX = 0;
        let alignY = 0;
        let cohX = 0;
        let cohY = 0;
        let neighbors = 0;

        for (let j = 0; j < school.length; j++) {
          if (i === j) continue;
          const other = school[j];
          const dx = fish.x - other.x;
          const dy = fish.y - other.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 6400 && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            neighbors++;
            alignX += other.vx;
            alignY += other.vy;
            cohX += other.x;
            cohY += other.y;

            if (dist < 34) {
              const force = (34 - dist) / 34;
              sepX += (dx / dist) * force * 0.95;
              sepY += (dy / dist) * force * 0.95;
            }
          }
        }

        if (neighbors > 0) {
          alignX = (alignX / neighbors - fish.vx) * 0.04;
          alignY = (alignY / neighbors - fish.vy) * 0.04;
          cohX = (cohX / neighbors - fish.x) * 0.0018;
          cohY = (cohY / neighbors - fish.y) * 0.0018;
        }

        // Lure-seeking ("trying to catch the mouse")
        const toLureX = lureX - fish.x;
        const toLureY = lureY - fish.y;
        const distToLure = Math.hypot(toLureX, toLureY) || 1;
        const dirX = toLureX / distToLure;
        const dirY = toLureY / distToLure;

        let seekX = 0;
        let seekY = 0;

        if (isScared && distToLure < 220) {
          // Splash startle: scatter radially outward like startled fish
          const scareStrength = (1 - distToLure / 220) * 0.65;
          seekX = -dirX * scareStrength;
          seekY = -dirY * scareStrength;
        } else if (distToLure < 32 && fish.cooldown === 0) {
          // "Caught / Nibbled" the mouse lure! Emit a tiny nibble ripple and dart playfully past
          fish.cooldown = 48;
          spawnRipple(
            lureX + (Math.random() - 0.5) * 14,
            lureY + (Math.random() - 0.5) * 14,
            46,
            0.22,
            true,
          );
          // Tangential bank after nibble
          seekX = -dirY * 0.45 + dirX * 0.1;
          seekY = dirX * 0.45 + dirY * 0.1;
        } else if (distToLure < 72) {
          // Orbit & swirl tightly around the lure trying to get an angle to catch it
          const tangentX = -dirY;
          const tangentY = dirX;
          seekX = dirX * 0.065 + tangentX * 0.095;
          seekY = dirY * 0.065 + tangentY * 0.095;
        } else {
          // Swim purposefully toward the mouse lure
          const pull = Math.min(0.14, 24 / (distToLure + 60));
          seekX = dirX * pull;
          seekY = dirY * pull;
        }

        // Sinusoidal fish tail-fin undulation perpendicular to heading
        fish.swimPhase += fish.swimFreq * (1 + Math.hypot(fish.vx, fish.vy) * 0.22);
        const perpX = -Math.sin(fish.angle);
        const perpY = Math.cos(fish.angle);
        const swimWave = Math.sin(fish.swimPhase) * 0.065;

        // Soft screen-edge turnback so the school stays in the viewport pond
        const margin = 48;
        let boundX = 0;
        let boundY = 0;
        if (fish.x < margin) boundX = 0.12;
        else if (fish.x > width - margin) boundX = -0.12;
        if (fish.y < margin) boundY = 0.12;
        else if (fish.y > height - margin) boundY = -0.12;

        fish.vx += sepX * 0.09 + alignX + cohX + seekX + perpX * swimWave + boundX;
        fish.vy += sepY * 0.09 + alignY + cohY + seekY + perpY * swimWave + boundY;

        // Clamp speed
        const speed = Math.hypot(fish.vx, fish.vy) || 0.01;
        const limit = isScared
          ? fish.maxSpeed * 1.75
          : distToLure < 180 && isMouseFresh
          ? fish.maxSpeed * 1.25
          : fish.maxSpeed;

        if (speed > limit) {
          fish.vx = (fish.vx / speed) * limit;
          fish.vy = (fish.vy / speed) * limit;
        } else if (speed < 0.85) {
          fish.vx = (fish.vx / speed) * 0.85;
          fish.vy = (fish.vy / speed) * 0.85;
        }

        fish.x += fish.vx;
        fish.y += fish.vy;

        // Smooth angular banking toward velocity vector
        const targetAngle = Math.atan2(fish.vy, fish.vx);
        let diff = targetAngle - fish.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        fish.angle += diff * 0.22;

        // Update fluid wake trail
        if (frame % 2 === 0) {
          fish.trail.pop();
          fish.trail.unshift({ x: fish.x, y: fish.y });
        } else {
          fish.trail[0] = { x: fish.x, y: fish.y };
        }

        const isNearLure = distToLure < 190;
        const baseAlpha = fish.isAlpha
          ? isNearLure
            ? 0.42
            : 0.26
          : isNearLure
          ? 0.3
          : 0.17;

        // Draw delicate water wake trail behind the swimming cursor
        ctx.beginPath();
        for (let t = 0; t < fish.trail.length; t++) {
          const pt = fish.trail[t];
          if (t === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = isNearLure || fish.isAlpha ? accentColor : fgColor;
        ctx.globalAlpha = baseAlpha * 0.42;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw the sleek swimming cursor arrowhead rotated to its exact swim direction
        ctx.save();
        ctx.translate(fish.x, fish.y);
        // Subtle tail wiggle added to visual rotation
        ctx.rotate(fish.angle + Math.sin(fish.swimPhase) * 0.08);

        const s = fish.size;
        ctx.beginPath();
        // Sharp hydrodynamic cursor dart (tip at +s*0.6, notched tail at -s*0.55)
        ctx.moveTo(s * 0.65, 0);
        ctx.lineTo(-s * 0.55, -s * 0.42);
        ctx.lineTo(-s * 0.28, 0);
        ctx.lineTo(-s * 0.55, s * 0.42);
        ctx.closePath();

        ctx.fillStyle = fish.isAlpha || isNearLure ? accentColor : fgColor;
        ctx.globalAlpha = baseAlpha;
        ctx.fill();

        ctx.strokeStyle = fgColor;
        ctx.globalAlpha = baseAlpha * 0.7;
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();

        // Optional crisp mono tag on Alpha cursors when closing in on the mouse lure
        if (fish.isAlpha && isNearLure && width >= 768) {
          ctx.font = "500 8px monospace";
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = 0.34;
          ctx.fillText(fish.tag, fish.x + 10, fish.y + 3);
        }
      }

      ctx.restore();
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden="true"
      data-cb-ignore
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
