import type { Metadata } from "next";
import { ArrowUpRight, Github, Linkedin, Mail, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { getAvailability, getSocialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Taiwo Adebola about projects, engineering opportunities, collaborations — or comparing notes on self-hosting, bots and security tooling.",
  openGraph: { title: "Contact — Taiwo Adebola" },
};

const topics = [
  "An engineering opportunity or internship",
  "A project you'd like built or contributed to",
  "Cybersecurity, self-hosting, bots — comparing notes",
  "Feedback on anything in the catalogue",
];

export default function ContactPage() {
  const social = getSocialLinks();
  const availability = getAvailability();

  const channels = [
    social.email
      ? { icon: Mail, label: "Email", value: social.email, href: `mailto:${social.email}` }
      : null,
    social.github
      ? { icon: Github, label: "GitHub", value: social.github.replace("https://github.com/", "@"), href: social.github }
      : null,
    social.linkedin
      ? { icon: Linkedin, label: "LinkedIn", value: "Connect with me", href: social.linkedin }
      : null,
  ].filter((c): c is { icon: typeof Mail; label: string; value: string; href: string } => c !== null);

  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="label-mono text-accent-blue">Contact</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Let&apos;s talk about something worth building.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          I&apos;m happy to discuss projects, engineering opportunities and
          collaborations — or to compare notes on self-hosting, Telegram bots,
          security tooling or anything else in{" "}
          <a href="/projects" className="text-accent-blue underline-offset-4 hover:underline">
            the catalogue
          </a>
          . The form below delivers straight into a database I check — no
          third-party form processor, no fake success screens.
        </p>
        {availability ? (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 align-middle">
            <span aria-hidden="true" className="animate-availability inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="label-mono text-muted-foreground">{availability}</span>
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.08}>
          <aside className="space-y-4">
            {channels.length > 0 ? (
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="label-mono mb-4 text-muted-foreground">Direct channels</p>
                <ul className="space-y-3">
                  {channels.map((channel) => (
                    <li key={channel.label}>
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 rounded-md p-2 -ml-2 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors group-hover:border-foreground/25 group-hover:text-foreground">
                          <channel.icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{channel.label}</span>
                          <span className="block truncate font-mono text-[12px] text-muted-foreground">
                            {channel.value}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6">
                <p className="label-mono mb-3 text-muted-foreground">Direct channels</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Email and social profiles appear here once configured on the
                  server — this portfolio doesn&apos;t display contact details
                  it can&apos;t verify. The form is always live.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="label-mono mb-4 text-muted-foreground">Good reasons to write</p>
              <ul className="space-y-2.5">
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
                  >
                    <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent-blue/70" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <p className="label-mono flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-blue" aria-hidden="true" />
                How it&apos;s built
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Input validation on both sides of the wire, a honeypot field
                for bots, per-address rate limiting, and hashed IP storage —
                the same security-conscious defaults I apply to every project.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
