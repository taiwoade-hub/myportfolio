#!/usr/bin/env python3
"""Generate Taiwo Adebola's one-page CV as a clean, typographic PDF.

Honesty constraints (same as the portfolio):
- No invented contact details, metrics, employers or certifications.
- Contact is directed to the portfolio's verified channels.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    HRFlowable,
)

OUT = "/home/z/my-project/public/cv/taiwo-adebola-cv.pdf"

INK = HexColor("#141413")
MUTED = HexColor("#5d5b57")
FAINT = HexColor("#8a8781")
ACCENT = HexColor("#2f6fdd")
RULE = HexColor("#d9d6d0")

styles = {
    "name": ParagraphStyle(
        "name", fontName="Helvetica-Bold", fontSize=24, leading=26,
        textColor=INK, alignment=TA_LEFT, spaceAfter=2,
    ),
    "roles": ParagraphStyle(
        "roles", fontName="Helvetica", fontSize=9.5, leading=13,
        textColor=ACCENT, spaceAfter=1,
    ),
    "meta": ParagraphStyle(
        "meta", fontName="Helvetica", fontSize=8.5, leading=12,
        textColor=MUTED,
    ),
    "section": ParagraphStyle(
        "section", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=INK, spaceBefore=14, spaceAfter=4,
    ),
    "item": ParagraphStyle(
        "item", fontName="Helvetica", fontSize=9.5, leading=14.5,
        textColor=MUTED, spaceAfter=3.5,
    ),
    "bullet": ParagraphStyle(
        "bullet", fontName="Helvetica", fontSize=9.5, leading=13.5,
        textColor=MUTED, leftIndent=10, bulletIndent=2, spaceAfter=2.5,
    ),
    "foot": ParagraphStyle(
        "foot", fontName="Helvetica-Oblique", fontSize=8, leading=11,
        textColor=FAINT,
    ),
}


def section(title):
    return [
        Paragraph(title.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.7, color=RULE, spaceAfter=6),
    ]


def build():
    doc = SimpleDocTemplate(
        OUT,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=14 * mm,
        title="Taiwo Adebola - CV",
        author="Taiwo Adebola",
        subject="Curriculum Vitae",
    )

    story = []

    # ── Header ────────────────────────────────────────────────
    story.append(Paragraph("Taiwo Adebola", styles["name"]))
    story.append(
        Paragraph("Software Engineer in training · Cybersecurity student · DevOps enthusiast · AI &amp; automation builder", styles["roles"])
    )
    story.append(Spacer(1, 3))
    story.append(
        Paragraph("Nigeria · Contact via the portfolio contact form (verified channels only)", styles["meta"])
    )
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.7, color=RULE, spaceAfter=4))

    # ── Profile ───────────────────────────────────────────────
    story += section("Profile")
    story.append(
        Paragraph(
            "Cybersecurity student and aspiring software engineer who learns by building. "
            "I create real applications, security-minded tooling, automation and self-hosted "
            "infrastructure, and I document all of it honestly - concepts, works in progress "
            "and running systems, clearly distinguished. Currently deepening full-stack "
            "engineering (Next.js, TypeScript, Python) while operating my own deployment "
            "environment on Linux.",
            styles["item"],
        )
    )

    # ── Selected projects ─────────────────────────────────────
    story += section("Selected projects")
    projects = [
        (
            "Order of Service - church service planning app",
            "Real-time document preview, inline editing and reusable liturgy blueprints. In development (Next.js, TypeScript).",
        ),
        (
            "Verify Hub - website verification &amp; inspection pipeline",
            "URL checks, browser automation with screenshot evidence, error reporting, GitHub and Telegram notifications. In development (Python).",
        ),
        (
            "Miro - Telegram AI &amp; music bot",
            "Conversational AI, music features, per-user memory and admin commands; reliability-first long-running service. Experimental (Python, aiogram, SQLite).",
        ),
        (
            "Self-hosted deployment &amp; development infrastructure",
            "Applications deployed from GitHub via Coolify on Ubuntu; Docker, PostgreSQL, Redis, Nginx, DNS and reverse-proxy practice; AWS EC2 managed over SSH. Ongoing.",
        ),
        (
            "Alchemist - market-structure intelligence bot",
            "Telegram delivery of BOS/CHOCH, liquidity, fair-value-gap and regime observations. Analysis software only - not financial advice. In development (Python).",
        ),
        (
            "Developer portfolio - this website's sibling",
            "Next.js App Router, TypeScript, Tailwind CSS, budgeted motion, GitHub integration with graceful fallback, validated and spam-protected contact pipeline. Live.",
        ),
    ]
    for title, body in projects:
        story.append(Paragraph(f"<b>{title}.</b> {body}", styles["bullet"], bulletText="-"))

    # ── Technical skills ──────────────────────────────────────
    story += section("Technical skills")
    story.append(
        Paragraph(
            "<b>Languages:</b> Python (core), JavaScript (core), TypeScript, SQL, HTML/CSS, Bash",
            styles["item"],
        )
    )
    story.append(
        Paragraph(
            "<b>Frontend:</b> React, Next.js (App Router), Tailwind CSS, shadcn/ui, Motion",
            styles["item"],
        )
    )
    story.append(
        Paragraph(
            "<b>Backend &amp; data:</b> FastAPI, Node.js, REST API design, Prisma, SQLite, PostgreSQL, Redis",
            styles["item"],
        )
    )
    story.append(
        Paragraph(
            "<b>DevOps &amp; cloud:</b> Linux (Ubuntu), Docker, Git/GitHub, AWS EC2 (SSH), Coolify, Cloudflare Tunnel, Nginx, DNS",
            styles["item"],
        )
    )
    story.append(
        Paragraph(
            "<b>Security &amp; automation:</b> web security fundamentals (OWASP study), browser automation, Telegram bots (aiogram), LLM integrations, yt-dlp",
            styles["item"],
        )
    )

    # ── Education & learning ──────────────────────────────────
    story += section("Education &amp; learning")
    story.append(
        Paragraph(
            "<b>Cybersecurity student</b> - coursework across web security fundamentals, "
            "Linux, networking and security tooling; self-directed study of the OWASP Top 10 "
            "through building inspection and verification tools.",
            styles["item"],
        )
    )
    story.append(
        Paragraph(
            "<b>Continuous practice</b> - operating a self-hosted environment (deployment, "
            "DNS, reverse proxies, databases) and maintaining a catalogue of personal projects "
            "with honest status labels.",
            styles["item"],
        )
    )

    # ── Footer note ───────────────────────────────────────────
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.7, color=RULE, spaceAfter=5))
    story.append(
        Paragraph(
            "Full case studies, honest project statuses and writing are available on the "
            "portfolio website. This CV lists only work that exists - no invented metrics, "
            "employers or certifications.",
            styles["foot"],
        )
    )

    doc.build(story)
    print(f"CV written to {OUT}")


if __name__ == "__main__":
    build()
