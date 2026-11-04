import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { StatusBadge, TechChips } from "@/components/badges";
import { getCategoryMeta } from "@/lib/projects";
import type { Project } from "@/lib/project-types";
import { cn } from "@/lib/utils";
import { ArchitecturalSpotlightLayer } from "@/components/motion/architectural-spotlight";
import { KineticTilt } from "@/components/motion/kinetic-tilt";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * Reusable project card. The whole card is one link to the case study —
 * no nested interactive elements, keyboard focusable, enhanced with
 * monochromatic architectural spotlight masking and restrained 3D cover tilt.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const category = getCategoryMeta(project.category);

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-spotlight-card
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <ArchitecturalSpotlightLayer />

      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted/40">
        <KineticTilt
          maxDegrees={2.8}
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        >
          <CoverArt variant={project.cover} name={project.name} />
        </KineticTilt>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
          {category ? (
            <span className="label-mono text-foreground/45 [text-shadow:none]">
              {category.shortLabel}
            </span>
          ) : null}
          <StatusBadge status={project.status} className="text-foreground/45" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-accent-blue">
            {project.name}
          </h3>
          <ArrowUpRight
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-blue motion-reduce:transform-none"
            aria-hidden="true"
          />
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <TechChips tech={project.tech} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}
