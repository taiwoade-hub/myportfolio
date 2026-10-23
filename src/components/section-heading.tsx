import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Zero-padded index, e.g. "01" — the editorial marker. */
  index?: string;
  label: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  className?: string;
}

/**
 * Editorial section header: mono index + label, confident heading,
 * optional description and an "view all" style link.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="label-mono flex items-center gap-3 text-muted-foreground">
            {index && <span className="text-accent-blue">{index}</span>}
            <span aria-hidden="true" className="h-px w-8 bg-border" />
            <span>{label}</span>
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="group hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {action.label}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
