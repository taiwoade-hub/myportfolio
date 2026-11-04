"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface NodeSpec {
  id: string;
  title: string;
  spec: string;
}

const NODE_SPECS: Record<string, NodeSpec> = {
  developer: {
    id: "developer",
    title: "DEVELOPER WORKSTATION",
    spec: "SSH ED25519 · PORT 22 · KEY-ONLY AUTH",
  },
  github: {
    id: "github",
    title: "GITHUB WEBHOOKS",
    spec: "HMAC-SHA256 SIGNED · AUTO-BUILD TRIGGER",
  },
  browser: {
    id: "browser",
    title: "CLIENT BROWSER",
    spec: "HTTPS / H3 · TLS 1.3 · STRICT CSP",
  },
  proxy: {
    id: "proxy",
    title: "REVERSE PROXY (CADDY / TRAEFIK)",
    spec: ":443 TLS TERMINATION · ZERO-DOWNTIME ROUTING",
  },
  coolify: {
    id: "coolify",
    title: "COOLIFY ORCHESTRATOR",
    spec: "DOCKER ENGINE · SELF-HOSTED PAAS · HEALTHCHECKS",
  },
  apps: {
    id: "apps",
    title: "APPLICATION CONTAINERS",
    spec: "NEXT.JS 16 STANDALONE · BOT WORKERS · ISOLATED NET",
  },
  mediadb: {
    id: "mediadb",
    title: "MEDIADB / SQLITE",
    spec: "WAL MODE · LOCAL VOLUME PERSISTENCE",
  },
  postgres: {
    id: "postgres",
    title: "POSTGRESQL 16",
    spec: ":5432 TCP · DURABLE RELATIONAL STORAGE · BACKUPS",
  },
  redis: {
    id: "redis",
    title: "REDIS 7",
    spec: ":6379 RESP · IN-MEMORY CACHE & RATE LIMITING",
  },
  cloudflare: {
    id: "cloudflare",
    title: "CLOUDFLARE TUNNEL",
    spec: "CLOUDFLARED DAEMON · OUTBOUND-ONLY INGRESS",
  },
};

/**
 * Interactive 2D/3D Isometric Architecture Blueprint of the self-hosted environment —
 * drawn from practice: Coolify on Ubuntu, proxy-fronted services,
 * PostgreSQL and Redis, deploys from GitHub, SSH operation, and Cloudflare Tunnel.
 * Pure 1px vector strokes, mono telemetry, and orthographic 3D projection.
 */
export function InfraDiagram() {
  const prefersReduced = Boolean(useReducedMotion());
  const [isIsometric, setIsIsometric] = useState(false);
  const [activeNode, setActiveNode] = useState<string>("coolify");

  const stroke = "currentColor";
  const label = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "10.5px",
    letterSpacing: "1.2px",
    fill: "currentColor",
    opacity: "0.82",
  } as const;
  const sub = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "8.5px",
    letterSpacing: "0.8px",
    fill: "currentColor",
    opacity: "0.48",
  } as const;

  const currentSpec = NODE_SPECS[activeNode] ?? NODE_SPECS.coolify;

  return (
    <div className="relative flex flex-col gap-4">
      {/* Top Blueprint Camera Controls & Live Node Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
          <span className="label-mono text-[10px] text-foreground">
            {currentSpec.title}
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
            — {currentSpec.spec}
          </span>
        </div>

        {!prefersReduced ? (
          <div className="inline-flex items-center rounded-md border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setIsIsometric(false)}
              className={`label-mono rounded-[4px] px-2.5 py-1 text-[9px] transition-colors ${
                !isIsometric
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2D ORTHO
            </button>
            <button
              type="button"
              onClick={() => setIsIsometric(true)}
              className={`label-mono rounded-[4px] px-2.5 py-1 text-[9px] transition-colors ${
                isIsometric
                  ? "bg-accent-blue text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3D ISOMETRIC
            </button>
          </div>
        ) : null}
      </div>

      {/* 3D Isometric Stage Container */}
      <div
        style={{ perspective: "1400px" }}
        className="relative py-2"
      >
        <motion.div
          animate={
            isIsometric && !prefersReduced
              ? {
                  rotateX: 28,
                  rotateZ: -12,
                  scale: 0.94,
                  y: -6,
                }
              : {
                  rotateX: 0,
                  rotateZ: 0,
                  scale: 1,
                  y: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 26,
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative"
        >
          {/* Recessed 3D Orthographic Blueprint Shadow Plane when in 3D Isometric Mode */}
          {isIsometric && !prefersReduced ? (
            <div
              aria-hidden="true"
              style={{
                transform: "translateZ(-28px) translate3d(12px, 16px, 0)",
              }}
              className="pointer-events-none absolute inset-0 rounded-lg border border-dashed border-accent-blue/35 bg-accent-blue/[0.03]"
            />
          ) : null}

          <svg
            viewBox="0 0 760 470"
            className="h-auto w-full text-foreground"
            role="img"
            aria-label="Diagram of the self-hosted infrastructure: deploys flow from GitHub through Coolify on an Ubuntu host; browser requests arrive through the reverse proxy to application containers backed by PostgreSQL and Redis; SSH and Cloudflare Tunnel provide operation and secure sharing paths."
          >
            {/* External sources */}
            <g
              onMouseEnter={() => setActiveNode("developer")}
              className="cursor-pointer"
            >
              <rect
                x="40"
                y="40"
                width="150"
                height="52"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "developer" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "developer" ? "0.95" : "0.5"}
              />
              <text x="52" y="60" style={label}>
                DEVELOPER
              </text>
              <text x="52" y="76" style={sub}>
                ssh · terminal
              </text>
            </g>

            <g
              onMouseEnter={() => setActiveNode("github")}
              className="cursor-pointer"
            >
              <rect
                x="40"
                y="140"
                width="150"
                height="52"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "github" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "github" ? "0.95" : "0.5"}
              />
              <text x="52" y="160" style={label}>
                GITHUB
              </text>
              <text x="52" y="176" style={sub}>
                repositories
              </text>
            </g>

            <g
              onMouseEnter={() => setActiveNode("browser")}
              className="cursor-pointer"
            >
              <rect
                x="570"
                y="40"
                width="150"
                height="52"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "browser" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "browser" ? "0.95" : "0.5"}
              />
              <text x="582" y="60" style={label}>
                BROWSER
              </text>
              <text x="582" y="76" style={sub}>
                https requests
              </text>
            </g>

            {/* Ubuntu host container */}
            <g fill="none" stroke={stroke} strokeWidth="1">
              <rect
                x="200"
                y="120"
                width="360"
                height="320"
                rx="10"
                opacity="0.6"
              />
            </g>
            <text x="220" y="146" style={label}>
              UBUNTU HOST
            </text>
            <text x="220" y="160" style={sub}>
              aws ec2 · linux
            </text>

            {/* Proxy layer */}
            <g
              onMouseEnter={() => setActiveNode("proxy")}
              className="cursor-pointer"
            >
              <rect
                x="240"
                y="180"
                width="280"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "proxy" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "proxy" ? "0.95" : "0.7"}
              />
              <text x="252" y="198" style={label}>
                REVERSE PROXY
              </text>
              <text x="252" y="212" style={sub}>
                tls · routing (coolify-managed)
              </text>
            </g>

            {/* Coolify + containers row */}
            <g
              onMouseEnter={() => setActiveNode("coolify")}
              className="cursor-pointer"
            >
              <rect
                x="240"
                y="252"
                width="84"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className="text-accent-blue"
                opacity="0.95"
              />
              <text x="256" y="270" style={label} className="text-accent-blue">
                COOLIFY
              </text>
              <text x="256" y="284" style={sub}>
                deploys
              </text>
            </g>

            <g
              onMouseEnter={() => setActiveNode("apps")}
              className="cursor-pointer"
            >
              <rect
                x="344"
                y="252"
                width="84"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "apps" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "apps" ? "0.95" : "0.5"}
              />
              <text x="360" y="270" style={label}>
                APPS
              </text>
              <text x="360" y="284" style={sub}>
                containers
              </text>
            </g>

            <g
              onMouseEnter={() => setActiveNode("mediadb")}
              className="cursor-pointer"
            >
              <rect
                x="448"
                y="252"
                width="84"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "mediadb" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "mediadb" ? "0.95" : "0.5"}
              />
              <text x="470" y="270" style={label}>
                MEDIADB
              </text>
              <text x="470" y="284" style={sub}>
                sqlite
              </text>
            </g>

            {/* Data layer */}
            <g
              onMouseEnter={() => setActiveNode("postgres")}
              className="cursor-pointer"
            >
              <rect
                x="240"
                y="330"
                width="128"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "postgres" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "postgres" ? "0.95" : "0.5"}
              />
              <text x="252" y="348" style={label}>
                POSTGRESQL
              </text>
              <text x="252" y="362" style={sub}>
                durable data
              </text>
            </g>

            <g
              onMouseEnter={() => setActiveNode("redis")}
              className="cursor-pointer"
            >
              <rect
                x="404"
                y="330"
                width="128"
                height="44"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                className={
                  activeNode === "redis" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "redis" ? "0.95" : "0.5"}
              />
              <text x="416" y="348" style={label}>
                REDIS
              </text>
              <text x="416" y="362" style={sub}>
                cache · queues
              </text>
            </g>

            {/* Tunnel note */}
            <g
              onMouseEnter={() => setActiveNode("cloudflare")}
              className="cursor-pointer"
            >
              <rect
                x="570"
                y="140"
                width="150"
                height="52"
                rx="6"
                fill="none"
                stroke={stroke}
                strokeWidth="1"
                strokeDasharray="4 4"
                className={
                  activeNode === "cloudflare" ? "text-accent-blue" : undefined
                }
                opacity={activeNode === "cloudflare" ? "0.95" : "0.5"}
              />
              <text x="582" y="160" style={label}>
                CLOUDFLARE
              </text>
              <text x="582" y="176" style={sub}>
                tunnel (local sharing)
              </text>
            </g>

            {/* Flows */}
            <g fill="none" stroke={stroke} strokeWidth="1">
              {/* SSH: developer → host */}
              <path
                id="path-ssh"
                d="M 190 66 L 230 66 L 230 112"
                opacity="0.4"
                strokeDasharray="4 4"
              />
              <path d="M 226 108 L 230 112 L 234 108" opacity="0.4" />

              {/* GitHub → Coolify (deploy) */}
              <path
                id="path-deploy"
                d="M 190 166 L 228 166 L 228 274 L 240 274"
                className="text-accent-blue"
                strokeDasharray="5 4"
                opacity="0.9"
              />
              <path
                d="M 236 270 L 240 274 L 236 278"
                className="text-accent-blue"
                opacity="0.9"
              />

              {/* Browser → proxy */}
              <path
                id="path-https"
                d="M 570 66 L 380 66 L 380 180"
                opacity="0.6"
              />
              <path d="M 376 176 L 380 180 L 384 176" opacity="0.6" />

              {/* Proxy → apps */}
              <path
                id="path-proxy-app"
                d="M 380 224 L 386 240 L 386 252"
                opacity="0.5"
              />

              {/* Apps → data */}
              <path id="path-pg" d="M 304 296 L 304 330" opacity="0.4" />
              <path id="path-redis" d="M 468 296 L 468 330" opacity="0.4" />

              {/* Tunnel → host (dashed) */}
              <path
                d="M 570 166 L 560 166 L 560 274 L 532 274"
                opacity="0.35"
                strokeDasharray="4 4"
              />
            </g>

            {/* Live 1px Precision Data Packets along SVG Paths */}
            {!prefersReduced ? (
              <g className="text-accent-blue" fill="currentColor">
                <rect x="-2.5" y="-2.5" width="5" height="5" rx="1">
                  <animateMotion
                    dur="2.8s"
                    repeatCount="indefinite"
                    path="M 190 166 L 228 166 L 228 274 L 240 274"
                  />
                </rect>
                <rect
                  x="-2"
                  y="-2"
                  width="4"
                  height="4"
                  rx="1"
                  fill="var(--foreground)"
                >
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path="M 570 66 L 380 66 L 380 180"
                  />
                </rect>
                <rect
                  x="-2"
                  y="-2"
                  width="4"
                  height="4"
                  rx="1"
                  fill="var(--foreground)"
                >
                  <animateMotion
                    dur="1.6s"
                    repeatCount="indefinite"
                    path="M 304 296 L 304 330"
                  />
                </rect>
                <rect x="-2" y="-2" width="4" height="4" rx="1">
                  <animateMotion
                    dur="1.9s"
                    repeatCount="indefinite"
                    path="M 468 296 L 468 330"
                  />
                </rect>
              </g>
            ) : null}

            {/* Flow labels */}
            <text x="196" y="130" style={sub} className="text-accent-blue">
              deploy
            </text>
            <text x="396" y="58" style={sub}>
              request
            </text>
            <text x="536" y="262" style={sub}>
              https
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
