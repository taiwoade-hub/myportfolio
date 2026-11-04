#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const NEXT_STATIC = path.join(ROOT, ".next", "static");
const NEXT_SERVER_APP = path.join(ROOT, ".next", "server", "app");
const PUBLIC_DIR = path.join(ROOT, "public");

const buildOnly = process.argv.includes("--build-only");
const rawBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "/myportfolio";
const cleanSubpath = rawBasePath.replace(/^\/+|\/+$/g, ""); // "myportfolio"

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function writeTarget(relFile, srcPath) {
  // Write to root of out/
  const destRoot = path.join(OUT_DIR, relFile);
  fs.mkdirSync(path.dirname(destRoot), { recursive: true });
  fs.copyFileSync(srcPath, destRoot);

  // Also write under out/<cleanSubpath>/ for nested routing safety
  if (cleanSubpath) {
    const destSub = path.join(OUT_DIR, cleanSubpath, relFile);
    fs.mkdirSync(path.dirname(destSub), { recursive: true });
    fs.copyFileSync(srcPath, destSub);
  }
}

function collectAppAssets(dir, relDir = "") {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = path.join(relDir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === "api" || entry === "admin" || entry === "page") continue;
      if (entry.endsWith(".segments")) {
        const dest1 = path.join(OUT_DIR, relPath);
        copyRecursive(fullPath, dest1);
        if (cleanSubpath) {
          const dest2 = path.join(OUT_DIR, cleanSubpath, relPath);
          copyRecursive(fullPath, dest2);
        }
      } else {
        collectAppAssets(fullPath, relPath);
      }
      continue;
    }

    if (entry.endsWith(".html")) {
      const baseName = entry.slice(0, -5);
      if (baseName === "_not-found" || baseName === "_global-error") {
        if (baseName === "_not-found") {
          writeTarget("404.html", fullPath);
        }
        continue;
      }

      // Root HTML file (e.g. index.html or about.html)
      writeTarget(path.join(relDir, `${baseName}.html`), fullPath);

      // Clean directory index for pretty URLs (/about/index.html)
      if (baseName !== "index") {
        writeTarget(path.join(relDir, baseName, "index.html"), fullPath);
      }
    } else if (entry.endsWith(".rsc")) {
      // Keep byte-for-byte exact RSC flight data chunks
      writeTarget(relPath, fullPath);
    } else if (entry.endsWith(".body")) {
      // e.g. robots.txt.body, icon.svg.body, sitemap.xml.body
      const realFile = entry.slice(0, -5);
      writeTarget(path.join(relDir, realFile), fullPath);
    }
  }
}

console.log(`▸ [1/3] Building Next.js portfolio for GitHub Pages (basePath: "${rawBasePath || "/"}")...`);
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_BASE_PATH: rawBasePath,
  },
});

console.log("▸ [2/3] Assembling static GitHub Pages bundle in ./out ...");
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. Copy public assets to both ./out and ./out/<cleanSubpath>/
copyRecursive(PUBLIC_DIR, OUT_DIR);
if (cleanSubpath) {
  copyRecursive(PUBLIC_DIR, path.join(OUT_DIR, cleanSubpath));
}

// 2. Copy .next/static/ to ./out/_next/static/ and ./out/<cleanSubpath>/_next/static/
copyRecursive(NEXT_STATIC, path.join(OUT_DIR, "_next", "static"));
if (cleanSubpath) {
  copyRecursive(NEXT_STATIC, path.join(OUT_DIR, cleanSubpath, "_next", "static"));
}

// 3. Copy pre-rendered HTML, RSC payloads, and metadata routes cleanly
collectAppAssets(NEXT_SERVER_APP);

// 4. Add .nojekyll so GitHub Pages does not ignore _next directory
fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), "");
if (cleanSubpath) {
  fs.writeFileSync(path.join(OUT_DIR, cleanSubpath, ".nojekyll"), "");
}

console.log("✓ Static export bundle ready in ./out");

if (buildOnly) {
  process.exit(0);
}

console.log("▸ [3/3] Deploying ./out to 'gh-pages' branch on origin...");
let remoteUrl = "https://github.com/taiwoade-hub/myportfolio.git";
try {
  const existing = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
  if (existing) remoteUrl = existing;
} catch {
  // fallback to default remoteUrl
}

execSync("git init", { cwd: OUT_DIR, stdio: "inherit" });
execSync("git checkout -B gh-pages", { cwd: OUT_DIR, stdio: "inherit" });
execSync("git add -A", { cwd: OUT_DIR, stdio: "inherit" });
execSync('git commit -m "Deploy portfolio to GitHub Pages (clean export)"', {
  cwd: OUT_DIR,
  stdio: "inherit",
});
execSync(`git push -f ${remoteUrl} gh-pages`, {
  cwd: OUT_DIR,
  stdio: "inherit",
});

console.log("✓ Deployed successfully to gh-pages branch!");
