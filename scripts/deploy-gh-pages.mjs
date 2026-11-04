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
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH !== undefined
    ? process.env.NEXT_PUBLIC_BASE_PATH
    : "/myportfolio";

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

function collectAppAssets(dir, relDir = "") {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const relPath = path.join(relDir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === "api" || entry === "admin") continue;
      if (entry.endsWith(".segments")) {
        copyRecursive(fullPath, path.join(OUT_DIR, relPath));
      } else {
        collectAppAssets(fullPath, relPath);
      }
      continue;
    }

    if (entry.endsWith(".html")) {
      const baseName = entry.slice(0, -5);
      if (baseName === "_not-found" || baseName === "_global-error") {
        if (baseName === "_not-found") {
          fs.copyFileSync(fullPath, path.join(OUT_DIR, "404.html"));
        }
        continue;
      }

      const destHtml = path.join(OUT_DIR, relDir, `${baseName}.html`);
      fs.mkdirSync(path.dirname(destHtml), { recursive: true });
      fs.copyFileSync(fullPath, destHtml);

      // Also write /<route>/index.html for clean URLs on GitHub Pages
      if (baseName !== "index") {
        const cleanIndex = path.join(OUT_DIR, relDir, baseName, "index.html");
        fs.mkdirSync(path.dirname(cleanIndex), { recursive: true });
        fs.copyFileSync(fullPath, cleanIndex);
      }
    } else if (entry.endsWith(".rsc")) {
      const destRsc = path.join(OUT_DIR, relPath);
      fs.mkdirSync(path.dirname(destRsc), { recursive: true });
      fs.copyFileSync(fullPath, destRsc);
    } else if (entry.endsWith(".body")) {
      // e.g. robots.txt.body, icon.svg.body, sitemap.xml.body
      const realFile = entry.slice(0, -5);
      const destBody = path.join(OUT_DIR, relDir, realFile);
      fs.mkdirSync(path.dirname(destBody), { recursive: true });
      fs.copyFileSync(fullPath, destBody);
    }
  }
}

console.log(`▸ [1/3] Building Next.js portfolio for GitHub Pages (basePath: "${basePath || "/"}")...`);
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
});

console.log("▸ [2/3] Assembling static GitHub Pages bundle in ./out ...");
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. Copy public/ -> out/
copyRecursive(PUBLIC_DIR, OUT_DIR);

// 2. Copy .next/static/ -> out/_next/static/
copyRecursive(NEXT_STATIC, path.join(OUT_DIR, "_next", "static"));

// 3. Copy pre-rendered HTML, RSC payloads, and metadata routes
collectAppAssets(NEXT_SERVER_APP);

// 4. Add .nojekyll so GitHub Pages serves the _next/ folder
fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), "");

// 5. Ensure public asset paths (/profile.jpg, /avatar.jpg, /cv/...) work under project subpath
if (basePath) {
  const rewriteHtmlFiles = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        rewriteHtmlFiles(full);
      } else if (entry.endsWith(".html") || entry.endsWith(".rsc")) {
        let content = fs.readFileSync(full, "utf8");
        content = content
          .replace(/(src|href)="\/(profile\.jpg|avatar\.jpg|cv\/[^"]+)"/g, `$1="${basePath}/$2"`)
          .replace(/\\"(profile\.jpg|avatar\.jpg|cv\/[^"\\]+)\\"/g, `\\"${basePath}/$1\\"`);
        fs.writeFileSync(full, content);
      }
    }
  };
  rewriteHtmlFiles(OUT_DIR);
}

console.log("✓ Static export ready in ./out");

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
execSync('git commit -m "Deploy portfolio to GitHub Pages"', {
  cwd: OUT_DIR,
  stdio: "inherit",
});
execSync(`git push -f ${remoteUrl} gh-pages`, {
  cwd: OUT_DIR,
  stdio: "inherit",
});

console.log("✓ Deployed successfully to gh-pages branch!");
