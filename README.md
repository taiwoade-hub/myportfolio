<div align="center">

# TAIWO ADEBOLA — ENGINEERING PORTFOLIO

**Software Engineer · Cybersecurity Undergraduate · DevOps & Self-Hosted Infrastructure · AI Automation**

[![Live Portfolio](https://img.shields.io/badge/LIVE_PORTFOLIO-taiwoade--hub.github.io%2Fmyportfolio-2563eb?style=for-the-badge)](https://taiwoade-hub.github.io/myportfolio/)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router-171716?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-TypeScript_5-171716?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-OKLCH_Tokens-171716?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

[**Explore Live Site ↗**](https://taiwoade-hub.github.io/myportfolio/) · [**Interactive CV ↗**](https://taiwoade-hub.github.io/myportfolio/cv) · [**Project Index (24 Systems) ↗**](https://taiwoade-hub.github.io/myportfolio/projects) · [**Download A4 CV (PDF) ↗**](https://taiwoade-hub.github.io/myportfolio/cv/taiwo-adebola-cv.pdf)

</div>

---

## 01 // Overview & Design Philosophy

This repository houses the source code for **Taiwo Adebola's** personal engineering portfolio, interactive curriculum vitae, and technical writing platform.

Built with a **Swiss-editorial architectural aesthetic**, the interface prioritizes typographic hierarchy, structural 1px hairlines, OKLCH color tokens (warm paper in light mode, carbon slate in dark mode), and tactile 3D hardware-inspired motion—strictly avoiding generic neon glows or decorative gradients.

> **Honesty Principle:** Every project documented in this portfolio carries an explicit, verifiable engineering status label (`Live`, `Active`, `In development`, `Experimental`, or `Concept / Architecture`). No metrics, employers, or credentials are invented.

---

## 02 // Signature Interactive Systems

| System | Module | Description |
| :--- | :--- | :--- |
| **Autonomous Multi-Cursor Live Builder** | [`cursor-builder-provider.tsx`](src/components/motion/cursor-builder-provider.tsx) | 18 autonomous engineering cursors (`Arrow`, `I-Beam`, `Crosshair`, `Resize`) scan and assemble the page layer-by-layer with top/left CAD pixel rulers, dynamic alignment guides, and a live Picture-in-Picture minimap. |
| **3D Architectural Portrait Monolith** | [`hero-portrait-showcase.tsx`](src/components/motion/hero-portrait-showcase.tsx) | 4-plane `preserve-3d` portrait showcase with spring-damped pitch/yaw parallax, a rotating 72-tick SVG orbital calibration dial, `OPTICAL` / `BLUEPRINT` inspection lens toggle, and floating Z-depth discipline telemetry. |
| **Ambient Water Cursor Pond** | [`water-cursor-school.tsx`](src/components/motion/water-cursor-school.tsx) | 60fps HTML5 Canvas background simulation on the Home page featuring expanding 1px concentric water ripples and 32 autonomous micro-cursors schooling via Boids physics. |
| **Magnetic Wireframe Reticle** | [`magnetic-wireframe-cursor.tsx`](src/components/motion/magnetic-wireframe-cursor.tsx) | Non-intrusive spring-physics CAD reticle that morphs into corner L-brackets around interactive buttons, links, and cards while keeping the native OS pointer 100% responsive. |
| **Interactive CV & Live CLI Workbench** | [`portfolio-hero-with-paper-shaders.tsx`](src/components/ui/portfolio-hero-with-paper-shaders.tsx) | Features WebGL paper dithering shaders, an interactive **Engineering Competency Matrix** (`CORE` / `WORKING` / `EXPLORING`), and an executable **Live Engineering Terminal** (`help`, `skills`, `projects`, `verify`, `infra`, `contact`). |
| **3D A4 Vector CV Compiler & PDF** | [`cv-pdf-download-modal.tsx`](src/components/motion/cv-pdf-download-modal.tsx) | Intercepts CV PDF downloads to display an interactive 3D A4 Swiss-editorial sheet compilation sequence while dispatching the vector PDF ([`public/cv/taiwo-adebola-cv.pdf`](public/cv/taiwo-adebola-cv.pdf)) with embedded portrait. |
| **Kinetic TA Monogram & Favicon** | [`brand-logo.tsx`](src/components/brand-logo.tsx) | Custom geometric `TA` monogram SVG with orbital perimeter scan, self-drawing strokes, and live emerald status pulse, matched with [`src/app/icon.svg`](src/app/icon.svg). |
| **Stealth Admin Mission Control** | [`src/app/admin/`](src/app/admin/page.tsx) | Camouflaged behind a 404 gate unless unlocked via secret query key or keyboard shortcut (`Ctrl/Cmd + Shift + A`), featuring kinetic stat counters and live SQLite/Prisma CMS controls. |

---

## 03 // Architecture & Route Map

```text
├── public/
│   ├── profile.jpg                  # High-resolution portrait (used in Hero, CV & PDF)
│   ├── logo.svg                     # Standalone vector monogram
│   └── cv/taiwo-adebola-cv.pdf      # Vector A4 CV generated via Cairo + Pillow
├── scripts/
│   ├── generate_cv.py               # Python Cairo vector A4 PDF compiler with portrait
│   └── deploy-gh-pages.mjs          # Zero-corruption static bundle exporter for GitHub Pages
├── prisma/
│   └── schema.prisma                # SQLite schema (Projects, Stack, SiteSettings, UiConfig, Messages)
└── src/
    ├── app/
    │   ├── page.tsx                 # Home — Hero Portrait Monolith, Selected Work, Stack, GitHub, Writing
    │   ├── about/page.tsx           # Biography, Engineering Principles & Timeline
    │   ├── projects/page.tsx        # Filterable 24-Project Engineering Index
    │   ├── projects/[slug]/page.tsx # Deep-dive Architectural Case Studies
    │   ├── stack/page.tsx           # Categorized Technical Capabilities Matrix
    │   ├── engineering/page.tsx     # Self-Hosted Cloud Lab, Security & DevOps Practice
    │   ├── cv/page.tsx              # Interactive CV Dossier, Competency Matrix & CLI
    │   ├── blog/page.tsx            # Technical Essays & Field Notes
    │   ├── contact/page.tsx         # Rate-Limited, Honeypot-Protected Contact Pipeline
    │   └── admin/page.tsx           # Stealth Mission Control CMS
    ├── components/
    │   ├── motion/                  # 3D Portrait, Multi-Cursor Builder, Water Pond, Reticle, Tilt
    │   └── ui/                      # Swiss-editorial primitives & interactive CV shaders
    └── lib/
        ├── projects.ts              # 24 curated projects with full case studies
        ├── stack.ts                 # Honest 3-tier technical stack definitions
        └── articles.ts              # Long-form engineering articles
```

---

## 04 // Technology Stack

- **Framework:** Next.js 16.1 (App Router, Turbopack, Server & Client Components)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4, custom OKLCH design tokens, Geist Sans & Geist Mono local fonts
- **Motion & Graphics:** Framer Motion 12, HTML5 2D Canvas (Boids & Water Physics), `@paper-design/shaders-react` (WebGL Dithering), CSS 3D Transforms (`preserve-3d`)
- **Data & Persistence:** Prisma ORM + SQLite (with automatic static fallback for serverless/GitHub Pages hosting)
- **PDF Engineering:** Python `pycairo` + `Pillow` vector A4 compiler

---

## 05 // Getting Started & Local Development

### Prerequisites

- **Node.js** `>= 20.x` (or **Bun** `>= 1.1`)
- **Python 3** (optional, only required if regenerating the PDF via `scripts/generate_cv.py`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/taiwoade-hub/myportfolio.git
cd myportfolio

# 2. Install dependencies
npm install

# 3. Push Prisma SQLite schema (optional for local CMS)
npm run db:push

# 4. Start the local development server on http://localhost:3011
npm run dev
```

Open **[http://localhost:3011](http://localhost:3011)** in your browser.

---

## 06 // Regenerating the A4 CV PDF

The downloadable CV ([`public/cv/taiwo-adebola-cv.pdf`](public/cv/taiwo-adebola-cv.pdf)) is compiled directly from [`scripts/generate_cv.py`](scripts/generate_cv.py) using `pycairo` and `Pillow`, embedding [`public/profile.jpg`](public/profile.jpg) inside a Swiss-editorial A4 vector layout:

```bash
python3 scripts/generate_cv.py
```

---

## 07 // Building & Deploying to GitHub Pages

This project includes a custom static bundle exporter ([`scripts/deploy-gh-pages.mjs`](scripts/deploy-gh-pages.mjs)) that compiles all 51 static and SSG routes with `basePath: "/myportfolio"`, preserves byte-exact RSC payloads, and pushes the bundle to the `gh-pages` branch:

```bash
# Build and deploy directly to GitHub Pages (gh-pages branch)
npm run deploy

# Or build the static ./out bundle locally without pushing
node scripts/deploy-gh-pages.mjs --build-only
```

---

## 08 // License & Contact

Designed and engineered by **Taiwo Adebola**.

- **Portfolio:** [https://taiwoade-hub.github.io/myportfolio/](https://taiwoade-hub.github.io/myportfolio/)
- **GitHub:** [@taiwoade-hub](https://github.com/taiwoade-hub)
- **Email:** [taiwoadebola237@gmail.com](mailto:taiwoadebola237@gmail.com)
