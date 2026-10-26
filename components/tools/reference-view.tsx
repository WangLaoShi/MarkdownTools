"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import type { Tool } from "@/lib/catalog";
import { getReference } from "@/lib/references";
import { rememberTool } from "@/lib/recent";
import { CopyButton } from "./copy-button";

export function ReferenceView({ tool }: { tool: Tool }) {
  const doc = getReference(tool.engine);
  useEffect(() => {
    rememberTool(tool.slug);
  }, [tool.slug]);
  if (!doc) return null;
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-muted">{doc.intro}</p>
        {doc.download && (
          <Link href={doc.download.href} className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground">
            {doc.download.label}
          </Link>
        )}
      </div>
      {doc.sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
          <div className="mt-4 space-y-4">
            {section.examples.map((example) => (
              <article key={example.title} className="grid gap-4 rounded-2xl border border-border p-4 lg:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">{example.title}</h3>
                    <CopyButton text={example.syntax} />
                  </div>
                  <pre className="overflow-auto font-mono text-sm text-muted">{example.syntax}</pre>
                </div>
                <MarkdownPreview markdown={example.note && tool.engine === "emoji" ? example.note : example.syntax} />
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
