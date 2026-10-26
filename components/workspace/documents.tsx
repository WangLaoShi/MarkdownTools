"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteDoc, listDocs, saveDoc, type LocalDoc } from "@/lib/documents";

const templates: { name: string; content: string }[] = [
  { name: "README", content: "# Project\n\nWhat it does.\n\n## Install\n\n```bash\nnpm install project\n```\n" },
  { name: "CHANGELOG", content: "# Changelog\n\n## 1.0.0 — 2026-10-26\n\n### Added\n\n- First public release\n" },
  { name: "ADR", content: "# ADR 0001\n\n## Status\n\nProposed\n\n## Context\n\n## Decision\n\n## Consequences\n" },
  { name: "Meeting notes", content: "# Meeting\n\n## Decisions\n\n## Actions\n\n- [ ] Owner — task\n" },
  { name: "Blog post", content: "# Title\n\nOne sentence that earns the next paragraph.\n" },
  { name: "CLAUDE.md", content: "# Project\n\n## Commands\n\n- Dev: `npm run dev`\n\n## Conventions\n\nPrefer the existing patterns.\n" },
];

export function DocumentsApp() {
  const [docs, setDocs] = useState<LocalDoc[]>([]);
  useEffect(() => {
    listDocs().then(setDocs);
  }, []);

  async function create(content = "# Untitled\n\n") {
    const doc = await saveDoc({ content });
    setDocs(await listDocs());
    window.location.href = `/editor?doc=${doc.id}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">My documents</h1>
        <Link href="/workspace/settings" className="text-sm underline">Settings</Link>
      </div>
      <p className="mt-3 text-muted">Saved in this browser. A share link from the editor opens here too, on this device.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={() => create()}>New document</button>
        {templates.map((template) => (
          <button key={template.name} type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => create(template.content)}>
            {template.name}
          </button>
        ))}
      </div>
      <ul className="mt-8 divide-y divide-border rounded-2xl border border-border">
        {docs.length === 0 && <li className="px-4 py-6 text-sm text-muted">No documents yet.</li>}
        {docs.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href={`/editor?doc=${doc.id}`}>
              <span className="block font-medium">{doc.title}</span>
              <span className="text-xs text-muted">{new Date(doc.updatedAt).toLocaleString()}</span>
            </Link>
            <button type="button" className="text-sm text-muted" onClick={async () => { await deleteDoc(doc.id); setDocs(await listDocs()); }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
