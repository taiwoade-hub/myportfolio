import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArticleRow } from "@/components/article-row";
import { getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Field reports from the work — self-hosting infrastructure, building Telegram bots, and learning web security by constructing instruments.",
  openGraph: { title: "Writing — Taiwo Adebola" },
};

export default function BlogIndexPage() {
  const articles = getArticles();

  return (
    <div className="container-site py-16 md:py-24">
      <header className="mb-14 max-w-2xl">
        <p className="label-mono text-accent-blue">Writing</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Field reports from the work.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          I write about what building things teaches me — infrastructure
          operated by hand, bots that must never go quiet, and learning
          security by constructing the instruments. Short series, honest
          conclusions, no filler.
        </p>
      </header>

      <Reveal>
        <ul className="border-t border-border">
          {articles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-14">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground/70">
          The blog is intentionally small — structured content I can maintain
          in one file, rendered by one template. No comment section to
          moderate, no CMS to patch; writing that earns its place, or it
          doesn&apos;t ship.
        </p>
      </Reveal>
    </div>
  );
}
