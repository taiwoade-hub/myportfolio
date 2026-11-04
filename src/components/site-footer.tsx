"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { navItems, site } from "@/lib/site";
import type { SocialLinks } from "@/lib/site";
import { BrandLogo } from "@/components/brand-logo";

/**
 * Editorial footer: a closing invitation, compact link columns, and a
 * colophon. Rendered inside the root layout's flex column so short pages
 * keep it pinned to the bottom of the viewport.
 */
export function SiteFooter({ social }: { social: SocialLinks }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  const elsewhere = [
    social.github
      ? { href: social.github, label: "GitHub", icon: Github }
      : null,
    social.linkedin
      ? { href: social.linkedin, label: "LinkedIn", icon: Linkedin }
      : null,
    social.email
      ? { href: `mailto:${social.email}`, label: "Email", icon: Mail }
      : null,
  ].filter((x): x is { href: string; label: string; icon: typeof Github } => x !== null);

  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="container-site">
        {/* Closing invitation */}
        <div className="flex flex-col gap-6 border-b border-border py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-mono text-muted-foreground">Get in touch</p>
            <p className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-balance">
              Let&apos;s build something useful together.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex h-11 w-fit items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
          >
            Start a conversation
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-3">
          <div>
            <p className="label-mono mb-4 text-muted-foreground">Site</p>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-mono mb-4 text-muted-foreground">Elsewhere</p>
            {elsewhere.length > 0 ? (
              <ul className="space-y-2.5">
                {elsewhere.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Writing
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Writing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Contact form
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <div>
            <p className="label-mono mb-4 text-muted-foreground">Documents</p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/cv"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                  Interactive Shader CV
                </Link>
              </li>
              <li>
                <a
                  href={site.cvPath}
                  download
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Download CV (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="flex flex-col gap-3 border-t border-border py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-xs text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
          </div>
          <p className="font-mono text-[11px] tracking-wide">
            Designed &amp; built with Next.js · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
