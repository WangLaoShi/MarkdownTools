"use client";

import Link from "next/link";
import { useState } from "react";
import { toolsIn } from "@/lib/catalog";
import type { CategoryId } from "@/lib/site";
import { categoryMeta } from "@/lib/site";
import { themeToggleScript } from "./theme-script";

const menus: CategoryId[] = ["cheat-sheets", "converters", "generators", "table-tools", "text-tools"];

export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-xs text-accent-foreground">M</span>
          MarkdownTools
        </Link>
        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          <Link href="/tools" className="rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-foreground/5">
            All Tools
          </Link>
          {menus.map((category) => (
            <div key={category} className="group relative">
              <Link href={categoryMeta[category].href} className="rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-foreground/5">
                {categoryMeta[category].label}
              </Link>
              <div className="invisible absolute left-0 top-full z-50 w-64 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="max-h-96 overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl">
                  {toolsIn(category).map((tool) => (
                    <Link key={tool.slug} href={`/${tool.slug}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-foreground/5">
                      {tool.nav}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link href="/editor" className="rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-foreground/5">
            Editor
          </Link>
          <Link href="/preview" className="rounded-md px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-foreground/5">
            Viewer
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="hidden items-center gap-3 rounded-lg border border-border px-3 py-1.5 text-sm text-muted sm:flex"
          >
            Search…
            <kbd className="rounded border border-border px-1.5 text-[10px] tracking-wide">Ctrl K</kbd>
          </button>
          <Link href="/workspace" className="hidden rounded-lg border border-border px-3 py-1.5 text-sm sm:inline">
            My documents
          </Link>
          <button type="button" onClick={themeToggleScript} className="rounded-lg border border-border px-2.5 py-1.5 text-sm" aria-label="Toggle color scheme">
            Theme
          </button>
          <button type="button" className="rounded-lg border border-border px-2.5 py-1.5 text-sm lg:hidden" onClick={() => setOpen((value) => !value)}>
            Menu
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[70vh] overflow-auto border-t border-border px-4 py-3 lg:hidden">
          <div className="mb-3 flex gap-2">
            <button type="button" onClick={onSearch} className="rounded-lg border border-border px-3 py-2 text-sm">
              Search
            </button>
            <Link href="/workspace" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setOpen(false)}>
              My documents
            </Link>
          </div>
          <Link href="/tools" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            All Tools
          </Link>
          {menus.map((category) => (
            <div key={category} className="py-2">
              <Link href={categoryMeta[category].href} className="text-sm font-medium" onClick={() => setOpen(false)}>
                {categoryMeta[category].label}
              </Link>
            </div>
          ))}
          <Link href="/editor" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            Editor
          </Link>
          <Link href="/preview" className="block py-2 text-sm" onClick={() => setOpen(false)}>
            Viewer
          </Link>
        </div>
      )}
    </header>
  );
}
