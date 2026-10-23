import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70svh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-6xl font-semibold tracking-tight text-accent-blue/90">
        404
      </p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        The link may be outdated, or the page moved during a refactor. Either
        way — the interesting parts of this site are one click away.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:active:transform-none"
        >
          Back home
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/projects"
          className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium transition-all duration-200 hover:border-foreground/25 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          Browse projects
        </Link>
      </div>
    </div>
  );
}
