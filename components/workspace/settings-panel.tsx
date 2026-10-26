"use client";

import { useEffect, useState } from "react";
import { listDocs } from "@/lib/documents";

export function SettingsPanel() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    listDocs().then((docs) => setCount(docs.length));
  }, []);

  async function exportAll() {
    const docs = await listDocs();
    const blob = new Blob([JSON.stringify(docs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "markdowntools-documents.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-3 text-muted">{count} document{count === 1 ? "" : "s"} stored in this browser.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={exportAll}>Export everything</button>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-1.5 text-sm"
          onClick={() => {
            localStorage.removeItem("mdt-theme");
            document.documentElement.classList.toggle("dark", matchMedia("(prefers-color-scheme: dark)").matches);
          }}
        >
          Use system theme
        </button>
      </div>
      <p className="mt-8 text-sm text-muted">
        Install the site from the browser menu where your browser offers “Install app”. The manifest makes that possible. Documents stay on the device either way.
      </p>
    </div>
  );
}
