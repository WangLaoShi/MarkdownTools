"use client";

import { useMemo, useState } from "react";
import { tools, type Tool } from "@/lib/catalog";
import { categoryMeta, type CategoryId } from "@/lib/site";
import { ToolCard } from "./tool-card";

const filters = ["all", ...Object.keys(categoryMeta)] as const;

export function ToolBrowser({ initial = "all" }: { initial?: (typeof filters)[number] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>(initial);
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const categoryOk = filter === "all" || tool.category === filter;
      const text = `${tool.title} ${tool.nav} ${tool.description}`.toLowerCase();
      return categoryOk && (!q || text.includes(q));
    });
  }, [filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const count = item === "all" ? tools.length : tools.filter((tool) => tool.category === item).length;
            const label = item === "all" ? "All" : categoryMeta[item as CategoryId].label;
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-3 py-1.5 text-sm ${active ? "border-foreground bg-foreground text-background" : "border-border"}`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter tools"
          className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none sm:w-56"
        />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      {visible.length === 0 && <p className="mt-8 text-sm text-muted">No tools in this filter.</p>}
    </div>
  );
}

export function CategoryIntro({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function staticCategoryTools(category: CategoryId): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
