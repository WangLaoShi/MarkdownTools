import Link from "next/link";
import { categoryLabel, type Tool } from "@/lib/catalog";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/${tool.slug}`} className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition hover:border-foreground/20">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{categoryLabel(tool.category)}</span>
        {tool.featured && <span className="rounded-full border border-border px-2 py-0.5">Featured</span>}
      </div>
      <h2 className="text-base font-medium tracking-tight group-hover:underline">{tool.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
      <span className="mt-4 text-sm">Open tool</span>
    </Link>
  );
}
