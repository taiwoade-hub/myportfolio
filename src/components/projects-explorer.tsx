"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { categories } from "@/lib/projects";
import type { Project, ProjectCategory } from "@/lib/project-types";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cellVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

interface ProjectsExplorerProps {
  projects: Project[];
}

/**
 * Filterable project grid. Category switching re-mounts the grid with a
 * light staggered entrance; hover feedback is CSS-only.
 */
export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: projects.length,
      software: 0,
      security: 0,
      ai: 0,
      devops: 0,
      trading: 0,
    };
    for (const p of projects) base[p.category] += 1;
    return base;
  }, [projects]);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.map((c) => ({ id: c.id as Filter, label: c.shortLabel })),
  ];

  return (
    <div>
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter projects by category"
        className="flex flex-wrap items-center gap-2"
      >
        {tabs.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "label-mono inline-flex h-9 items-center gap-2 rounded-full border px-3.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {tab.label}
              <span className={cn("text-[10px]", active ? "opacity-70" : "opacity-50")}>
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div
        key={filter}
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project) => (
          <motion.div key={project.slug} variants={cellVariants} className="h-full">
            <ProjectCard project={project} className="h-full" />
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-8 text-sm text-muted-foreground/70" role="status">
        Showing {visible.length} of {projects.length} projects
        {filter !== "all" ? " — filter active" : ""}.
      </p>
    </div>
  );
}
