# UI Specification & Design System — Taiwo Adebola Portfolio

An editorial, high-precision developer portfolio engineered with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion 12**, and **shadcn/ui**.

---

## 1. Design Philosophy & Aesthetic Identity

- **Editorial & Restrained Engineering**: High-contrast, clean typography inspired by Swiss editorial layouts and technical whitepapers rather than generic template SaaS themes.
- **Honest Metrics**: Avoids arbitrary percentage skill bars ("JavaScript 90%"). Technical capabilities are categorized into **Core**, **Working**, and **Exploring**.
- **Realistic Project Representation**: Projects carry explicit status pills (`active`, `in-development`, `experimental`, `concept`, `ongoing`). Visual assets utilize handcrafted abstract typographic SVG cover art rather than mocked screenshots.
- **Micro-Interactions with Accessibility**: Physics-informed Framer Motion transitions with strict `prefers-reduced-motion` guards.

---

## 2. Color Palette & Token Architecture (OKLCH)

Configured in `src/app/globals.css` with dynamic semantic tokens:

### 2.1 Base Themes

| Token | Light Mode (Warm Paper) | Dark Mode (Deep Slate) | Purpose |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.985 0.002 80)` | `oklch(0.14 0.002 80)` | Main canvas backdrop |
| `--foreground` | `oklch(0.155 0.004 80)` | `oklch(0.955 0.002 80)` | Primary text & headings |
| `--card` | `oklch(1 0 0)` | `oklch(0.178 0.002 80)` | Card and panel backgrounds |
| `--card-foreground` | `oklch(0.155 0.004 80)` | `oklch(0.955 0.002 80)` | Card text |
| `--border` / `--input` | `oklch(0.905 0.004 80)` | `oklch(0.262 0.002 80)` | Subtle structural borders |
| `--muted-foreground` | `oklch(0.5 0.012 80)` | `oklch(0.66 0.005 80)` | Secondary copy & metadata |
| `--accent-blue` | `oklch(0.502 0.191 257.4)` | `oklch(0.709 0.153 252.5)` | Strategic focal point & active tabs |
| `--primary` | `oklch(0.175 0.004 80)` | `oklch(0.955 0.002 80)` | High-emphasis CTA buttons |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.16 0.002 80)` | Text inside primary buttons |

### 2.2 Dynamic Theme Presets (`data-theme`)
The application supports multi-theme switching managed via the Stealth Admin Dashboard:
- **Default (Slate)**: Editorial warm paper / slate dark.
- **Obsidian**: True ultra-black OLED contrast (`#000000` / `oklch(0.09 0 0)`).
- **Cyberpunk**: Violet/Neon magenta accents with deep synthetic darks (`oklch(0.13 0.03 290)`).
- **Emerald**: Forest green terminal aesthetic with high-visibility mint highlights (`oklch(0.12 0.02 155)`).
- **Monochrome**: Stark architectural black & white (`#000000` / `#ffffff`).

---

## 3. Typography Hierarchy

Utilizes Next.js font optimization with **Geist Sans** and **Geist Mono**:

| Element | Class / Token | Weight & Specs | Usage |
| :--- | :--- | :--- | :--- |
| **Section Index** | `SectionHeading index` | Mono, `text-xs`, uppercase, `text-accent-blue` | Editorial numbered indices (`01`, `02`, `03`) |
| **Eyebrow / Badge** | `.label-mono` | Mono `11px`, uppercase, `tracking-[0.12em]` | Category pills, metadata, status labels |
| **Hero Title** | `h1` | Sans, `3rem - 3.3rem`, weight 600, `leading-[1.1]` | Main value proposition |
| **Section Heading** | `h2` | Sans, `1.875rem - 2.25rem`, weight 600, `tracking-tight` | Section headers |
| **Body Copy** | `p` | Sans, `15px - 16px`, `leading-relaxed`, `text-muted-foreground` | Paragraph text and descriptions |
| **Code / Metrics** | `code`, `.font-mono` | Mono, `12px - 13px`, `tracking-tight` | Tech stack tags, endpoints, terminal output |

---

## 4. Global UI Components & Layout Anatomy

```
┌────────────────────────────────────────────────────────────────────────┐
│ SiteHeader (Sticky blur, Monogram "TA", Animated Nav Link, ThemeToggle) │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Page Content ]                                                      │
│  • Hero / Page Header                                                  │
│  • Section Containers (.container-site max-w-6xl px-6)                 │
│  • Staggered Reveal Animations (<Reveal /> via Framer Motion)         │
│  • Card Grids & Interactive Explorers                                  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ SiteFooter (Status Indicator, Quick Links, Copyright, Socials)          │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Site Header (`src/components/site-header.tsx`)
- **Sticky Glassmorphic Bar**: `sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border`.
- **Monogram Wordmark**: Squared pill icon with `TA` branding and full name reveal on larger viewports.
- **Animated Desktop Navigation**: Underline indicator powered by Framer Motion `layoutId="site-nav-active"`.
- **Accessible Mobile Drawer**: Built with full keyboard navigation, `Escape` key trigger to close, body scroll-lock, and focus retention.
- **Theme Toggle**: Hydration-safe theme toggle utilizing `useSyncExternalStore`.

### 4.2 Hero Section (`src/components/hero.tsx`)
- **Left Column**:
  - Availability pill with pulsing radar indicator (`animate-availability bg-emerald-500`).
  - Monogram name label and large typography title.
  - Multi-discipline role pill ticker (`Software Engineer · Cybersecurity · DevOps · AI & Automation`).
  - Primary CTA actions: `Explore My Work` and `Get In Touch`.
  - Social channel icons (GitHub, LinkedIn) alongside `Interactive CV` pill and `PDF` download link.
- **Right Column (Safari Mockup)**:
  - Realistic macOS Safari browser frame (`Safari` component) presenting `taiwoadebola.app` with smooth hover scaling (`hover:scale-[1.02]`).
- **Scroll Cue**: Subtle floating chevron with bounce keyframe animation at viewport bottom.

### 4.3 Project Cards & Cover Art (`src/components/project-card.tsx` & `cover-art.tsx`)
- **Abstract Generative SVG Covers**: 9 typographic styles (`window`, `rings`, `nodes`, `pipeline`, `market`, `map`, `grid`, `ledger`, `terminal`) designed without fake mockup graphics.
- **Metadata Header**: Project category and status badges (`Concept`, `In Development`, `Active`, etc.).
- **Card Body**: Project name, summary paragraph, and tag pills for technologies used.
- **Card Footer**: GitHub link, live demo URL, and link to in-depth case study.

### 4.4 Tech Stack Explorer (`src/app/stack/page.tsx`)
- Structured by domains: Frontend, Backend, Database, Cloud & DevOps, Security, AI & Tools.
- Three tiers of honest expertise:
  1. **Core**: Tools used routinely in production and daily architecture.
  2. **Working**: Technologies deployed in active projects and services.
  3. **Exploring**: Frameworks and tools under current evaluation.

### 4.5 Self-Hosted Infrastructure Diagram (`src/components/infra-diagram.tsx`)
- Hand-drawn SVG architectural schematic showing the production homelab/cloud deployment:
  - Reverse Proxy: **Caddy**
  - Orchestration & PaaS: **Coolify & Docker Engine**
  - Data Layer: **PostgreSQL & Redis**
  - Application Services: Next.js frontend, microservices, bot worker daemons.

### 4.6 Contact System (`src/components/contact-form.tsx`)
- Fully accessible React Hook Form backed by **Zod** validation.
- Built-in honeypot anti-spam trap, client & server-side rate-limiting, and timing-safe admin routing.
- Micro-interaction states: idle, submitting (with loading spinner), success banner, and field-level error messages.

### 4.7 Admin Stealth Control (`src/app/admin/`)
- Stealth token authentication overlay.
- Real-time live controls for theme selection, hero presentation, feature visibility toggles (GitHub stats, Stack, Blog, Engineering), and contact message inbox.

---

## 5. Animation & Motion Standards

- **Engine**: Framer Motion 12 (`motion/react`).
- **Default Easing**: Cubic Bezier `[0.21, 0.47, 0.32, 0.98]` for smooth natural deceleration.
- **Stagger Delays**: Container children stagger at `0.05s - 0.09s` intervals.
- **Scroll Reveals**: `<Reveal>` component wraps content blocks with `whileInView={{ opacity: 1, y: 0 }}` triggering once.
- **Accessibility Fallback**: `MotionConfig reducedMotion="user"` and Tailwind `motion-reduce:transform-none` prevent motion sickness.

---

## 6. Page Inventory

| Route | Page Name | Primary UI Purpose |
| :--- | :--- | :--- |
| `/` | **Home** | Editorial hero, selected work, about summary, stack teaser, writing & contact CTA |
| `/about` | **About** | Personal journey, cybersecurity focus, engineering principles, and homelab setup |
| `/projects` | **Projects** | Filterable catalog (Software, Security, AI, DevOps, Trading) with live search |
| `/projects/[slug]` | **Case Study** | 8-section technical breakdown (Problem, Solution, Tech Decisions, Architecture, etc.) |
| `/stack` | **Tech Stack** | Categorized tools across Core, Working, and Exploring disciplines |
| `/engineering` | **Engineering** | 10 technical capabilities + Interactive self-hosted architecture SVG diagram |
| `/blog` | **Blog / Notes** | Minimalist technical field reports and write-ups |
| `/blog/[slug]` | **Article** | Long-form reading view with syntax highlighting, TOC, and metadata |
| `/contact` | **Contact** | Secure form, contact channels, and PGP/security keys |
| `/cv` / `/resume` | **Interactive CV** | Clean web CV + Direct link to ATS-compliant PDF |
| `/admin` | **Admin Suite** | Stealth console for site settings, UI configuration, and message auditing |

---

## 7. Responsive Breakpoint Matrix

- **Mobile (`< 640px`)**: Single column stack, hamburger drawer navigation, condensed typography, simplified card layout.
- **Tablet (`640px - 1024px`)**: 2-column project cards, expandable metadata, balanced spacing.
- **Desktop (`> 1024px`)**: Full multi-column grid, persistent horizontal nav with animated active pill, Safari mockup alongside hero copy, multi-column footer.
- **Maximum Width Container**: `.container-site` clamped to `max-w-6xl` with `mx-auto px-5 sm:px-8`.

