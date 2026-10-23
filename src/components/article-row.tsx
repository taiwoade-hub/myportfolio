import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/articles";
import { cn } from "@/lib/utils";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Editorial article row — shared by the home teaser and the blog index. */
export function ArticleRow({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <li className={cn("group border-b border-border last:border-b-0", className)}>
      <Link
        href={`/blog/${article.slug}`}
        className="flex flex-col gap-2 py-6 transition-colors first:pt-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:flex-row sm:items-center sm:gap-8"
      >
        <time
          dateTime={article.date}
          className="shrink-0 font-mono text-[12px] tracking-wide text-muted-foreground/70 sm:w-28"
        >
          {formatDate(article.date)}
        </time>
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-medium leading-snug tracking-tight transition-colors group-hover:text-accent-blue">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
        </div>
        <span className="label-mono hidden shrink-0 items-center gap-1.5 text-muted-foreground/60 transition-colors group-hover:text-accent-blue sm:flex">
          {article.minutes} min
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </span>
      </Link>
    </li>
  );
}
