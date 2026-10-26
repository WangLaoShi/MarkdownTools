"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTool, tools } from "@/lib/catalog";
import { readRecent } from "@/lib/recent";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) setRecent(readRecent());
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools.slice(0, 8);
    return tools
      .filter((tool) => `${tool.title} ${tool.nav} ${tool.description} ${tool.slug}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/50 px-4 pt-[12vh]" onMouseDown={onClose}>
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-label="Search tools">
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-base outline-none"
        />
        {!query && recent.length > 0 && (
          <div className="px-4 pt-3 text-xs uppercase tracking-wide text-muted">Recent</div>
        )}
        <ul className="max-h-80 overflow-auto p-2">
          {!query &&
            recent.map((slug) => {
              const tool = getTool(slug);
              if (!tool) return null;
              return (
                <li key={slug}>
                  <Link href={`/${slug}`} onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-foreground/5">
                    <span className="block text-sm">{tool.title}</span>
                    <span className="text-xs text-muted">Recent</span>
                  </Link>
                </li>
              );
            })}
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link href={`/${tool.slug}`} onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-foreground/5">
                <span className="block text-sm">{tool.title}</span>
                <span className="text-xs text-muted">{tool.description}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-6 text-sm text-muted">No tools match that search.</li>}
        </ul>
      </div>
    </div>
  );
}
