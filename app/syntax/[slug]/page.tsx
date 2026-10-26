import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import { getSyntaxPage, syntaxPages } from "@/lib/syntax";

export const dynamicParams = false;

export function generateStaticParams() {
  return syntaxPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = getSyntaxPage((await params).slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default function SyntaxPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted">Loading syntax…</div>}>
      <ResolvedSyntax params={params} />
    </Suspense>
  );
}

async function ResolvedSyntax({ params }: { params: Promise<{ slug: string }> }) {
  const page = getSyntaxPage((await params).slug);
  if (!page) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-muted">
        <Link href="/">Home</Link> / <Link href="/syntax">Markdown Syntax</Link> / {page.title}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{page.title}</h1>
      <h2 className="mt-8 text-lg font-medium">Quick answer</h2>
      <p className="mt-2 text-muted">{page.answer}</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <pre className="overflow-auto rounded-2xl border border-border p-4 font-mono text-sm">{page.syntax}</pre>
        <div className="rounded-2xl border border-border p-4">
          <MarkdownPreview markdown={page.syntax} />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">
        Everything renders in your browser. Need more room? <Link href="/editor" className="underline">Open the editor</Link> or <Link href="/preview" className="underline">the viewer</Link>.
      </p>
      <h2 className="mt-10 text-lg font-medium">Platform support</h2>
      <table className="mt-3 w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-border px-3 py-2 text-left">Platform</th>
            <th className="border border-border px-3 py-2 text-left">Support</th>
          </tr>
        </thead>
        <tbody>
          {page.platforms.map((row) => (
            <tr key={row.name}>
              <td className="border border-border px-3 py-2">{row.name}</td>
              <td className="border border-border px-3 py-2">{row.support}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="mt-10 text-lg font-medium">Common mistakes</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
        {page.mistakes.map((mistake) => (
          <li key={mistake}>{mistake}</li>
        ))}
      </ul>
    </div>
  );
}
