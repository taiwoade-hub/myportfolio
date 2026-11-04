import type { Metadata } from "next";
import ResumePage from "@/components/ui/portfolio-hero-with-paper-shaders";

export const metadata: Metadata = {
  title: "Interactive Resume — Taiwo Adebola",
  description:
    "Interactive resume and career milestones featuring dynamic WebGL paper dithering shaders.",
};

export default function ResumeRoute() {
  return (
    <main className="min-h-screen w-full">
      <ResumePage />
    </main>
  );
}
