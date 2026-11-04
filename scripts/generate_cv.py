#!/usr/bin/env python3
"""Generate Taiwo Adebola's one-page A4 CV as a Swiss-editorial vector PDF with embedded profile portrait."""

import io
import os
import cairo
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PDF = os.path.join(ROOT, "public", "cv", "taiwo-adebola-cv.pdf")
PROFILE_JPG = os.path.join(ROOT, "public", "profile.jpg")


def build_pdf():
    # A4 dimensions in points (1 pt = 1/72 inch): 595.28 x 841.89
    W, H = 595.28, 841.89
    os.makedirs(os.path.dirname(OUT_PDF), exist_ok=True)
    surface = cairo.PDFSurface(OUT_PDF, W, H)
    ctx = cairo.Context(surface)

    # Swiss Warm Paper & Editorial Slate + Restrained Accent Blue
    BG = (0.988, 0.986, 0.980)       # Warm paper #fcfbf9
    INK = (0.09, 0.09, 0.095)        # Primary ink #171718
    MUTED = (0.40, 0.40, 0.42)       # Secondary slate
    FAINT = (0.55, 0.55, 0.58)       # Metadata gray
    BORDER = (0.85, 0.85, 0.83)      # 1px structural hairline
    BLUE = (0.14, 0.38, 0.82)        # Swiss accent blue #2461d1
    BLUE_BG = (0.93, 0.96, 0.995)    # Subtle pill tint
    CARD_BG = (1.0, 1.0, 1.0)        # Pure white card

    # Background fill
    ctx.set_source_rgb(*BG)
    ctx.rectangle(0, 0, W, H)
    ctx.fill()

    # Outer architectural frame + corner registration crosshairs
    M = 36.0
    ctx.set_line_width(0.6)
    ctx.set_source_rgb(*BORDER)
    ctx.rectangle(M, M, W - 2 * M, H - 2 * M)
    ctx.stroke()

    def draw_corner_tick(x, y):
        ctx.set_source_rgb(*BLUE)
        ctx.set_line_width(0.85)
        ctx.move_to(x - 4.5, y)
        ctx.line_to(x + 4.5, y)
        ctx.move_to(x, y - 4.5)
        ctx.line_to(x, y + 4.5)
        ctx.stroke()

    draw_corner_tick(M, M)
    draw_corner_tick(W - M, M)
    draw_corner_tick(M, H - M)
    draw_corner_tick(W - M, H - M)

    def set_font(family="DejaVu Sans", bold=False, italic=False, size=10):
        slant = cairo.FONT_SLANT_ITALIC if italic else cairo.FONT_SLANT_NORMAL
        weight = cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL
        ctx.select_font_face(family, slant, weight)
        ctx.set_font_size(size)

    def draw_text(x, y, text, family="DejaVu Sans", bold=False, italic=False, size=9.5, color=INK):
        set_font(family, bold, italic, size)
        ctx.set_source_rgb(*color)
        ctx.move_to(x, y)
        ctx.show_text(text)

    def draw_right_text(right_x, y, text, family="DejaVu Sans Mono", bold=False, size=7.2, color=MUTED):
        set_font(family, bold, False, size)
        ext = ctx.text_extents(text)
        ctx.set_source_rgb(*color)
        ctx.move_to(right_x - ext.width, y)
        ctx.show_text(text)

    def draw_wrapped(x, y, max_w, text, family="DejaVu Sans", bold=False, size=8.8, line_h=13.0, color=MUTED):
        set_font(family, bold, False, size)
        ctx.set_source_rgb(*color)
        words = text.split(" ")
        line = ""
        cur_y = y
        for w in words:
            test = (line + " " + w).strip()
            ext = ctx.text_extents(test)
            if ext.width > max_w and line:
                ctx.move_to(x, cur_y)
                ctx.show_text(line)
                line = w
                cur_y += line_h
            else:
                line = test
        if line:
            ctx.move_to(x, cur_y)
            ctx.show_text(line)
            cur_y += line_h
        return cur_y

    def draw_pill(x, y, text, fg=BLUE, bg=BLUE_BG, border_col=BLUE):
        set_font("DejaVu Sans Mono", True, False, 6.3)
        ext = ctx.text_extents(text)
        pw = ext.width + 9
        ph = 11.5
        ctx.set_source_rgb(*bg)
        ctx.rectangle(x, y - 8.5, pw, ph)
        ctx.fill()
        ctx.set_source_rgb(*border_col)
        ctx.set_line_width(0.5)
        ctx.rectangle(x, y - 8.5, pw, ph)
        ctx.stroke()
        ctx.set_source_rgb(*fg)
        ctx.move_to(x + 4.5, y - 0.5)
        ctx.show_text(text)
        return pw

    def draw_rounded_rect(x, y, w, h, r):
        ctx.new_sub_path()
        ctx.arc(x + w - r, y + r, r, -0.5 * 3.14159, 0)
        ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * 3.14159)
        ctx.arc(x + r, y + h - r, r, 0.5 * 3.14159, 3.14159)
        ctx.arc(x + r, y + r, r, 3.14159, 1.5 * 3.14159)
        ctx.close_path()

    PAD_X = 50.0
    RIGHT_X = W - PAD_X
    CONTENT_W = W - 2 * PAD_X
    y = 54.0

    draw_text(PAD_X, y, "DOC_REF // TA-CV-2026.V3", "DejaVu Sans Mono", False, False, 7.0, FAINT)
    draw_right_text(RIGHT_X, y, "STATUS: VERIFIED · ATS-COMPLIANT", "DejaVu Sans Mono", True, 7.0, BLUE)

    y += 10
    ctx.set_source_rgb(*BORDER)
    ctx.set_line_width(0.6)
    ctx.move_to(PAD_X, y)
    ctx.line_to(RIGHT_X, y)
    ctx.stroke()

    # ── HEADER BLOCK WITH EMBEDDED PROFILE PHOTO ──────────────────
    y += 14
    AVATAR_SIZE = 44.0
    av_x = PAD_X
    av_y = y - 4

    # Outer architectural frame around portrait
    ctx.set_source_rgb(*CARD_BG)
    draw_rounded_rect(av_x - 2, av_y - 2, AVATAR_SIZE + 4, AVATAR_SIZE + 4, 6.0)
    ctx.fill()
    ctx.set_source_rgb(*BLUE)
    ctx.set_line_width(0.9)
    draw_rounded_rect(av_x - 2, av_y - 2, AVATAR_SIZE + 4, AVATAR_SIZE + 4, 6.0)
    ctx.stroke()

    if os.path.exists(PROFILE_JPG):
        im = Image.open(PROFILE_JPG).convert("RGB")
        im = ImageOps.fit(im, (240, 240), method=Image.Resampling.LANCZOS)
        png_buf = io.BytesIO()
        im.save(png_buf, format="PNG")
        png_buf.seek(0)
        img_surface = cairo.ImageSurface.create_from_png(png_buf)

        ctx.save()
        draw_rounded_rect(av_x, av_y, AVATAR_SIZE, AVATAR_SIZE, 4.5)
        ctx.clip()
        scale_f = AVATAR_SIZE / 240.0
        ctx.translate(av_x, av_y)
        ctx.scale(scale_f, scale_f)
        ctx.set_source_surface(img_surface, 0, 0)
        ctx.paint()
        ctx.restore()
    else:
        ctx.set_source_rgb(*INK)
        draw_rounded_rect(av_x, av_y, AVATAR_SIZE, AVATAR_SIZE, 4.5)
        ctx.fill()
        draw_text(av_x + 12, av_y + 27, "TA", "DejaVu Sans Mono", True, False, 14, BG)

    # Small emerald verified dot at bottom-right of portrait
    ctx.set_source_rgb(1.0, 1.0, 1.0)
    ctx.arc(av_x + AVATAR_SIZE + 0.5, av_y + AVATAR_SIZE + 0.5, 4.2, 0, 2 * 3.14159)
    ctx.fill()
    ctx.set_source_rgb(0.06, 0.72, 0.50)
    ctx.arc(av_x + AVATAR_SIZE + 0.5, av_y + AVATAR_SIZE + 0.5, 2.8, 0, 2 * 3.14159)
    ctx.fill()

    TEXT_LEFT = PAD_X + AVATAR_SIZE + 14.0
    draw_text(TEXT_LEFT, y + 13, "TAIWO ADEBOLA", "DejaVu Sans", True, False, 20.5, INK)
    draw_text(
        TEXT_LEFT,
        y + 27,
        "SOFTWARE ENGINEER · CYBERSECURITY · DEVOPS · AI AUTOMATION",
        "DejaVu Sans Mono",
        True,
        False,
        7.1,
        BLUE,
    )
    draw_text(
        TEXT_LEFT,
        y + 38,
        "B.Sc. Cybersecurity Candidate · Builder of Practical Software & Self-Hosted Infrastructure",
        "DejaVu Sans",
        False,
        False,
        7.8,
        MUTED,
    )

    draw_right_text(RIGHT_X, y + 9, "NIGERIA (REMOTE / HYBRID)", "DejaVu Sans Mono", False, 7.0, MUTED)
    draw_right_text(RIGHT_X, y + 20, "TAIWOADEBOLA.APP", "DejaVu Sans Mono", True, 7.2, INK)
    draw_right_text(RIGHT_X, y + 31, "GITHUB.COM/TAIWOADE-HUB", "DejaVu Sans Mono", False, 7.0, MUTED)

    y += 50
    ctx.set_source_rgb(*INK)
    ctx.set_line_width(1.1)
    ctx.move_to(PAD_X, y)
    ctx.line_to(RIGHT_X, y)
    ctx.stroke()

    def draw_section_header(cur_y, index_str, label_str):
        cur_y += 18
        draw_text(PAD_X, cur_y, index_str, "DejaVu Sans Mono", True, False, 8.0, BLUE)
        ctx.set_source_rgb(*BORDER)
        ctx.set_line_width(0.8)
        ctx.move_to(PAD_X + 18, cur_y - 3)
        ctx.line_to(PAD_X + 38, cur_y - 3)
        ctx.stroke()
        draw_text(PAD_X + 44, cur_y, label_str, "DejaVu Sans Mono", True, False, 8.0, INK)
        cur_y += 6.0
        ctx.set_source_rgb(*BORDER)
        ctx.set_line_width(0.5)
        ctx.move_to(PAD_X, cur_y)
        ctx.line_to(RIGHT_X, cur_y)
        ctx.stroke()
        return cur_y + 12

    # ── 01 // ENGINEERING PROFILE ─────────────────────────────────
    y = draw_section_header(y, "01", "ENGINEERING PROFILE")
    profile_copy = (
        "Cybersecurity undergraduate and software engineer who learns by designing, building, and operating real systems. "
        "My work spans full-stack web applications (Next.js App Router, TypeScript, FastAPI), automated verification and security "
        "inspection pipelines (Python), resilient long-running Telegram bots, and self-hosted Linux cloud infrastructure (Coolify, "
        "Docker, PostgreSQL, Redis, Caddy/Nginx). Every project carries an honest, verifiable engineering status label."
    )
    y = draw_wrapped(PAD_X, y, CONTENT_W, profile_copy, "DejaVu Sans", False, 8.6, 12.8, MUTED)

    # ── 02 // SELECTED SYSTEMS & ARCHITECTURE ─────────────────────
    y = draw_section_header(y - 3, "02", "SELECTED SYSTEMS & ARCHITECTURE")

    projects = [
        {
            "name": "Verify Hub",
            "status": "IN DEVELOPMENT",
            "stack": "Python · Playwright · GitHub API · Telegram",
            "desc": "Automated website verification and security inspection pipeline. Executes headless browser checks, captures visual evidence screenshots, audits TLS/HTTP responses, and dispatches structured alerts.",
        },
        {
            "name": "Order of Service",
            "status": "IN DEVELOPMENT",
            "stack": "Next.js · TypeScript · Tailwind CSS",
            "desc": "Real-time liturgical & event document planning engine. Features live split-pane document preview, structured section reordering, inline typography controls, and reusable service blueprints.",
        },
        {
            "name": "Self-Hosted Cloud Lab",
            "status": "ACTIVE · ONGOING",
            "stack": "Ubuntu · Coolify · Docker · PostgreSQL · Redis",
            "desc": "Production-grade self-hosted deployment environment on AWS EC2 & Linux. Automated GitHub webhook deployments via Coolify, TLS reverse-proxy routing, isolated container networks, and Cloudflare Tunnel.",
        },
        {
            "name": "Miro AI & Media Bot",
            "status": "EXPERIMENTAL",
            "stack": "Python · aiogram · LLM APIs · SQLite",
            "desc": "Long-running asynchronous Telegram assistant combining conversational AI with persistent per-user context memory, media extraction pipelines, rate-limiting, and admin telemetry commands.",
        },
        {
            "name": "Alchemist Market Engine",
            "status": "IN DEVELOPMENT",
            "stack": "Python · Pandas · Algorithmic Analysis",
            "desc": "Market-structure intelligence engine detecting Break of Structure (BOS), Change of Character (CHOCH), liquidity sweeps, and Fair Value Gaps (FVG) with automated Telegram chart dispatches.",
        },
        {
            "name": "Editorial Portfolio & CMS",
            "status": "LIVE · PRODUCTION",
            "stack": "Next.js 16 · React 19 · Prisma · Framer Motion",
            "desc": "High-precision engineering portfolio featuring autonomous multi-cursor DOM assembly, WebGL dithering shaders, live GitHub API integration, stealth admin suite, and rate-limited contact pipeline.",
        },
    ]

    COL_GAP = 14.0
    COL_W = (CONTENT_W - COL_GAP) / 2.0

    for row_idx in range(3):
        p_left = projects[row_idx * 2]
        p_right = projects[row_idx * 2 + 1]
        row_top = y
        box_h = 78.0

        for col_idx, proj in enumerate([p_left, p_right]):
            cx = PAD_X + col_idx * (COL_W + COL_GAP)
            ctx.set_source_rgb(*CARD_BG)
            ctx.rectangle(cx, row_top - 10, COL_W, box_h)
            ctx.fill()
            ctx.set_source_rgb(*BORDER)
            ctx.set_line_width(0.6)
            ctx.rectangle(cx, row_top - 10, COL_W, box_h)
            ctx.stroke()

            ctx.set_source_rgb(*BLUE)
            ctx.rectangle(cx, row_top - 10, 2.2, box_h)
            ctx.fill()

            draw_text(cx + 9, row_top + 2.5, proj["name"], "DejaVu Sans", True, False, 9.2, INK)
            is_live = "LIVE" in proj["status"] or "ACTIVE" in proj["status"]
            pill_fg = (0.06, 0.45, 0.28) if is_live else BLUE
            pill_bg = (0.92, 0.98, 0.95) if is_live else BLUE_BG
            set_font("DejaVu Sans Mono", True, False, 6.3)
            ext = ctx.text_extents(proj["status"])
            draw_pill(cx + COL_W - ext.width - 15, row_top + 2.5, proj["status"], pill_fg, pill_bg, pill_fg)

            draw_text(cx + 9, row_top + 14.5, proj["stack"], "DejaVu Sans Mono", False, False, 6.9, BLUE)
            draw_wrapped(cx + 9, row_top + 26.5, COL_W - 16, proj["desc"], "DejaVu Sans", False, 7.6, 10.6, MUTED)

        y += box_h + 8.5

    # ── 03 // TECHNICAL CAPABILITIES MATRIX ───────────────────────
    y = draw_section_header(y - 5, "03", "TECHNICAL CAPABILITIES MATRIX (CORE · WORKING · EXPLORING)")

    skills = [
        ("LANGUAGES & CORE", "Python (Core) · TypeScript (Core) · JavaScript ES2024 (Core) · SQL · Bash / Shell · HTML5 / CSS3"),
        ("FRONTEND & MOTION", "Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion 12 · shadcn/ui · WebGL"),
        ("BACKEND & DATA", "FastAPI · Node.js · REST API Design · Prisma ORM · PostgreSQL · SQLite · Redis · Zod Validation"),
        ("DEVOPS & INFRA", "Linux (Ubuntu) · Docker · Coolify PaaS · AWS EC2 · Caddy / Nginx · Cloudflare Tunnel · Git"),
        ("SECURITY & AI", "OWASP Top 10 Study · Automated Browser Verification · Telegram Bots (aiogram) · LLM APIs"),
    ]

    for label_k, val_v in skills:
        draw_text(PAD_X, y, label_k, "DejaVu Sans Mono", True, False, 7.2, BLUE)
        end_y = draw_wrapped(PAD_X + 104, y, CONTENT_W - 104, val_v, "DejaVu Sans", False, 7.9, 11.5, INK)
        y = max(y + 14.5, end_y + 2.5)

    # ── 04 // EDUCATION & SECURITY PRACTICE ───────────────────────
    y = draw_section_header(y - 5, "04", "EDUCATION & SECURITY PRACTICE")

    draw_text(PAD_X, y, "B.Sc. in Cybersecurity (Undergraduate)", "DejaVu Sans", True, False, 9.2, INK)
    draw_right_text(RIGHT_X, y, "2022 — 2026 (EXPECTED)", "DejaVu Sans Mono", True, 7.3, BLUE)
    y += 12.5
    edu_copy = (
        "Coursework & applied lab focus: Web Application Security, Network Protocols, Linux Systems Administration, Cryptography "
        "Fundamentals, and Defensive Tooling. Complemented by operating a live self-hosted production homelab and building "
        "verification instruments around the OWASP Top 10."
    )
    y = draw_wrapped(PAD_X, y, CONTENT_W, edu_copy, "DejaVu Sans", False, 8.1, 11.8, MUTED)

    # ── FOOTER COLOPHON ───────────────────────────────────────────
    foot_y = H - 48.0
    ctx.set_source_rgb(*BORDER)
    ctx.set_line_width(0.6)
    ctx.move_to(PAD_X, foot_y - 10)
    ctx.line_to(RIGHT_X, foot_y - 10)
    ctx.stroke()

    draw_text(
        PAD_X,
        foot_y + 2,
        "HONESTY PLEDGE: Every system & status listed is real and verifiable.",
        "DejaVu Sans Mono",
        False,
        False,
        6.8,
        MUTED,
    )
    draw_right_text(
        RIGHT_X,
        foot_y + 2,
        "INTERACTIVE DOSSIER: TAIWOADEBOLA.APP/CV",
        "DejaVu Sans Mono",
        True,
        6.8,
        BLUE,
    )

    surface.finish()
    print(f"✓ Generated Swiss-editorial CV PDF with embedded profile portrait: {OUT_PDF}")


if __name__ == "__main__":
    build_pdf()
