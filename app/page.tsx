import Link from "next/link";
import { HomePreview } from "@/components/home/home-preview";
import { ToolCard } from "@/components/tools/tool-card";
import { tools } from "@/lib/catalog";
import { categoryMeta } from "@/lib/site";

const guides = [
  { href: "/cheat-sheet", label: "Markdown Cheat Sheet" },
  { href: "/discord-markdown", label: "Discord Markdown Guide" },
  { href: "/obsidian-cheat-sheet", label: "Obsidian Cheat Sheet" },
  { href: "/preview", label: "Live Markdown Preview" },
];

export default function HomePage() {
  const featured = tools.filter((tool) => tool.featured).slice(0, 6);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm text-muted">Browser-based Markdown toolkit</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Free Online Markdown Tools</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Convert documents, format Markdown, render documentation callouts, preview diagrams and math, export print-ready PDFs, generate syntax, and analyze text without uploading your files.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/tools" className="rounded-lg bg-accent px-4 py-2 text-sm text-accent-foreground">
          Browse tools
        </Link>
        <Link href="/editor" className="rounded-lg border border-border px-4 py-2 text-sm">
          Open editor
        </Link>
        <Link href="/preview" className="rounded-lg border border-border px-4 py-2 text-sm">
          Open viewer
        </Link>
      </div>
      <p className="mt-6 text-sm text-muted">
        Popular guides:{" "}
        {guides.map((guide, index) => (
          <span key={guide.href}>
            {index > 0 && " · "}
            <Link href={guide.href} className="underline decoration-border underline-offset-4">
              {guide.label}
            </Link>
          </span>
        ))}
      </p>
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-medium">Live Markdown Preview</h2>
        <HomePreview />
      </section>
      <section className="mt-12">
        <h2 className="text-lg font-medium">Featured tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categoryMeta).map(([id, meta]) => (
          <Link key={id} href={meta.href} className="rounded-2xl border border-border p-5 hover:border-foreground/20">
            <h2 className="font-medium">{meta.label}</h2>
            <p className="mt-2 text-sm text-muted">{meta.blurb}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
