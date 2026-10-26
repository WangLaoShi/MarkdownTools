import type { Metadata } from "next";
import Link from "next/link";
import { syntaxPages } from "@/lib/syntax";

export const metadata: Metadata = {
  title: "Markdown Syntax",
  description: "Deep-dive guides for every Markdown element — syntax, edge cases, and how each platform handles it.",
};

export default function SyntaxIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-muted">Home / Markdown Syntax</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Markdown Syntax Reference</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Deep-dive guides for every Markdown element — syntax, edge cases, common mistakes, and how each platform handles it. Need a quick overview instead? Start with the <Link href="/cheat-sheet" className="underline">cheat sheet</Link>.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {syntaxPages.map((page) => (
          <Link key={page.slug} href={`/syntax/${page.slug}`} className="rounded-2xl border border-border p-4 hover:border-foreground/20">
            <h2 className="font-medium">{page.title.replace("How to ", "").replace(" in Markdown", "")}</h2>
            <p className="mt-2 text-sm text-muted">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
