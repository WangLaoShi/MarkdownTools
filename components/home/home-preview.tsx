"use client";

import { useState } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";

const sample = `# Release Notes

MarkdownTools keeps document work in the browser.

## What you can do

- Export Markdown to **PDF** and **DOCX**
- Convert PDF, DOCX, HTML, CSV, and JSON
- Format messy Markdown and align tables
- Render GitHub-style note and warning callouts
- Preview Mermaid diagrams and KaTeX math

> [!NOTE]
> Start with a tool, then copy or download the result.
`;

export function HomePreview() {
  const [value, setValue] = useState(sample);
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border lg:grid-cols-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        spellCheck
        aria-label="Markdown sample"
        className="min-h-80 resize-y border-b border-border bg-transparent p-4 font-mono text-sm outline-none lg:border-b-0 lg:border-r"
      />
      <div className="min-h-80 overflow-auto p-4">
        <MarkdownPreview markdown={value} />
      </div>
    </div>
  );
}
