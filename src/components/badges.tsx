import { statusMeta } from "@/lib/projects";
import type { ProjectStatus } from "@/lib/project-types";
import { cn } from "@/lib/utils";

/**
 * Honest status badge: a small dot + mono label. The dot's treatment
 * (filled accent, filled, outline, muted) encodes progression without
 * pretending to a precision the data doesn't have.
 */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const meta = statusMeta[status];
  return (
    <span
      title={meta.hint}
      className={cn(
        "label-mono inline-flex items-center gap-1.5 text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-[6px] w-[6px] rounded-full",
          meta.tone === "accent" && "bg-accent-blue",
          meta.tone === "foreground" &&
            status === "experimental" &&
            "border border-current bg-transparent",
          meta.tone === "foreground" &&
            status !== "experimental" &&
            "bg-foreground",
          meta.tone === "muted" && "bg-muted-foreground/50",
        )}
      />
      <span>{meta.label}</span>
    </span>
  );
}

/** Small bordered mono chip for a technology name. */
export function TechChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-[11px] leading-5 text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** Row of tech chips, capping the count at `max` with a "+n" tail. */
export function TechChips({
  tech,
  max = 4,
  className,
}: {
  tech: string[];
  max?: number;
  className?: string;
}) {
  const shown = tech.slice(0, max);
  const rest = tech.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Technologies">
      {shown.map((t) => (
        <li key={t}>
          <TechChip label={t} />
        </li>
      ))}
      {rest > 0 ? (
        <li className="font-mono text-[11px] leading-5 text-muted-foreground/70">
          +{rest}
        </li>
      ) : null}
    </ul>
  );
}
