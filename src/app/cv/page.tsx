import type { Metadata } from "next";
import ResumePage from "@/components/ui/portfolio-hero-with-paper-shaders";

export const metadata: Metadata = {
  title: "Interactive CV — Taiwo Adebola",
  description:
    "Interactive curriculum vitae and career milestones featuring dynamic WebGL paper dithering shaders.",
  openGraph: {
    title: "Interactive CV — Taiwo Adebola",
    description: "Interactive curriculum vitae featuring dynamic WebGL paper dithering shaders.",
  },
};

export default function CVRoute() {
  return (
    <main className="min-h-screen w-full">
      <ResumePage />
    </main>
  );
}
