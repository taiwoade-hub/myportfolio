import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { stackGroups, stackLevelMeta } from "@/lib/stack";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tech Stack",
  description:
    "The tools I use, grouped by discipline and labelled honestly — core, working, and exploring. No skill bars, no invented percentages.",
  openGraph: { title: "Tech Stack — Taiwo Adebola" },
};

export default function StackPage() {
  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="label-mono text-accent-blue">Stack</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Tools, labelled the way engineers actually talk.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Three words carry the weight here:{" "}
          <span className="text-foreground">core</span> means I reach for it
          by default,{" "}
          <span className="text-foreground">working</span> means it appears in
          real projects I&apos;m still deepening, and{" "}
          <span className="text-foreground">exploring</span> means I&apos;m
          actively learning it. That&apos;s the whole system — no bars, no
          percentages, no charts pretending to measure a person.
        </p>
      </header>

      {/* Level key */}
      <aside
        aria-label="Level key"
        className="mb-14 grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-5 sm:grid-cols-3"
      >
        {(Object.keys(stackLevelMeta) as Array<keyof typeof stackLevelMeta>).map((level) => (
          <div key={level} className="flex items-baseline gap-3">
            <span className="label-mono shrink-0 rounded-md border border-border bg-background px-2 py-1 text-muted-foreground">
              {stackLevelMeta[level].label}
            </span>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {stackLevelMeta[level].description}
            </p>
          </div>
        ))}
      </aside>

      <div className="space-y-16">
        {stackGroups.map((group, gi) => (
          <section key={group.id} aria-labelledby={`stack-${group.id}`}>
            <Reveal>
              <div className="mb-6 flex items-baseline justify-between gap-6 border-b border-border pb-4">
                <div>
                  <p className="label-mono text-muted-foreground">
                    <span className="text-accent-blue">
                      {String(gi + 1).padStart(2, "0")}
                    </span>{" "}
                    · {group.items.length} tools
                  </p>
                  <h2
                    id={`stack-${group.id}`}
                    className="mt-2 text-2xl font-semibold tracking-tight"
                  >
                    {group.title}
                  </h2>
                </div>
              </div>
              <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {group.blurb}
              </p>
            </Reveal>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <Reveal key={item.name} delay={0.03 * (i % 3)}>
                  <li className="group h-full rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/20">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[15px] font-medium tracking-tight transition-colors group-hover:text-accent-blue">
                        {item.name}
                      </h3>
                      {item.level !== "core" ? (
                        <span
                          className={cn(
                            "label-mono shrink-0 rounded border px-1.5 py-0.5",
                            item.level === "working"
                              ? "border-border text-muted-foreground"
                              : "border-dashed border-border text-muted-foreground/70",
                          )}
                        >
                          {stackLevelMeta[item.level].label}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {item.note}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Reveal className="mt-16">
        <p className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">A note on honesty —</span>{" "}
          this page lists tools my projects and practice actually involve.
          Anything I&apos;ve only read about doesn&apos;t appear here, and
          anything marked exploring is an interest in progress, not a claimed
          proficiency. The catalogue it&apos;s checked against lives in{" "}
          <a href="/projects" className="text-accent-blue underline-offset-4 hover:underline">
            the projects section
          </a>
          .
        </p>
      </Reveal>
    </div>
  );
}
