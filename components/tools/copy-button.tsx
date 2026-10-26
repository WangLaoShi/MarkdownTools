"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="rounded-lg border border-border px-3 py-1.5 text-sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-sm text-muted">{children}</label>;
}

export const inputClass = "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none";
export const areaClass = "min-h-64 w-full resize-y rounded-lg border border-border bg-transparent p-3 font-mono text-sm outline-none";
