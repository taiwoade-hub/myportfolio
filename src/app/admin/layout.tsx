import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Control — Taiwo Adebola",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      {children}
    </div>
  );
}
