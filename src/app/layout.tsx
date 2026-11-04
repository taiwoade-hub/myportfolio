import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteUrl, getSocialLinks, site } from "@/lib/site";
import { getLiveUiConfig } from "@/lib/dynamic-data";

const geistSans = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = getSiteUrl();
const description =
  "Portfolio of Taiwo Adebola — software engineer, cybersecurity student and DevOps enthusiast. Real projects, honest case studies, and writing about building software, secure systems and self-hosted infrastructure.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Software Engineer`,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "Taiwo Adebola",
    "software engineer",
    "cybersecurity",
    "DevOps",
    "Next.js developer",
    "Python developer",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: site.name,
    title: `${site.name} — Software Engineer`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Software Engineer`,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#171716" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const uiConfig = await getLiveUiConfig();
  const social = getSocialLinks();

  return (
    <html lang="en" suppressHydrationWarning data-theme={uiConfig.activeTheme}>
      <head>
        {/* No-JS fallback: motion components render hidden initial states
            server-side; without JavaScript, force them visible. */}
        <noscript>
          <style>{`[data-reveal],[data-print-target]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter social={social} />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
