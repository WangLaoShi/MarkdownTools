"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import { readShare } from "@/lib/documents";

export function ShareView() {
  const [state, setState] = useState<"loading" | "missing" | "ready">("loading");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    const shareId = window.location.hash.replace(/^#/, "");
    if (!shareId) {
      setState("missing");
      return;
    }
    readShare(shareId).then((share) => {
      if (!share) {
        setState("missing");
        return;
      }
      setTitle(share.title);
      setContent(share.content);
      setState("ready");
    });
  }, []);
  if (state === "loading") return <p className="px-4 py-10 text-sm text-muted">Opening the local share…</p>;
  if (state === "missing") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-2xl font-semibold">This share is not on this browser</h1>
        <p className="mt-3 text-muted">Share links in this build are stored locally. Open the link in the browser that created it, or paste the Markdown into the editor.</p>
        <Link href="/editor" className="mt-4 inline-block underline">Open the editor</Link>
      </div>
    );
  }
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-muted">Local share</p>
      <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
      <div className="mt-6"><MarkdownPreview markdown={content} /></div>
    </article>
  );
}
