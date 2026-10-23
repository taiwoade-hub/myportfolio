import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getAdjacentArticles, getArticle, getArticles } from "@/lib/articles";
import type { ArticleBlock } from "@/lib/articles";
import { getSiteUrl } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} — Taiwo Adebola`,
      description: article.description,
      url: `${getSiteUrl()}/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      tags: article.tags,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="text-[15px] leading-[1.75] text-muted-foreground">
          {block.text}
        </p>
      );
    case "h2":
      return (
        <h2 className="mt-12 border-t border-border pt-8 text-xl font-semibold tracking-tight first:mt-8">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
            >
              <span aria-hidden="true" className="mt-2.5 h-1 w-4 shrink-0 rounded-full bg-accent-blue/60" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="rounded-lg border-l-2 border-accent-blue bg-muted/30 px-6 py-5">
          <p className="text-[15px] italic leading-relaxed text-foreground/90">
            {block.text}
          </p>
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-5 font-mono text-[13px] leading-relaxed text-foreground/80">
          <code>{block.code}</code>
        </pre>
      );
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { prev, next } = getAdjacentArticles(article.slug);

  return (
    <article className="container-site py-14 md:py-20">
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        />
        All writing
      </Link>

      {/* Header */}
      <header className="mt-8 max-w-2xl">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] tracking-wide text-muted-foreground/70">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden="true" className="h-px w-6 bg-border" />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {article.minutes} min read
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          {article.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
          {article.tags.map((tag) => (
            <li
              key={tag}
              className="label-mono rounded-md border border-border bg-card px-2 py-1 text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* Body */}
      <Reveal className="mt-12">
        <div className="max-w-2xl space-y-5">
          {article.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </Reveal>

      {/* Prev / next */}
      <nav
        aria-label="Article navigation"
        className="mt-20 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="label-mono block text-muted-foreground/60">Previous</span>
              <span className="mt-1 block truncate text-sm font-medium transition-colors group-hover:text-accent-blue">
                {prev.title}
              </span>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-row-reverse items-center gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:col-start-2"
          >
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="label-mono block text-muted-foreground/60">Next</span>
              <span className="mt-1 block truncate text-sm font-medium transition-colors group-hover:text-accent-blue">
                {next.title}
              </span>
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
