"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import type { Tool } from "@/lib/catalog";
import { createShare, getDoc, saveDoc, titleFromMarkdown } from "@/lib/documents";
import { downloadText, htmlFromMarkdown } from "@/lib/engines/convert";
import { rememberTool } from "@/lib/recent";
import { areaClass } from "./copy-button";

const starter = `# Untitled

Write here. Spell check uses the browser, so Grammarly and similar extensions can attach to this box.

## Outline

- A point
- Another point

\`\`\`ts
export const local = true;
\`\`\`
`;

const mermaidStarter = `flowchart LR
  write[Write Markdown] --> preview[Preview]
  preview --> export[Export]
`;

export function EditorWorkbench({ tool }: { tool: Tool }) {
  useEffect(() => {
    rememberTool(tool.slug);
  }, [tool.slug]);
  if (tool.engine === "folder") return <FolderEditor />;
  if (tool.engine === "mermaid") return <MermaidEditor />;
  if (tool.engine === "preview") return <Writer mode="preview" />;
  return <Writer mode="editor" />;
}

function Writer({ mode }: { mode: "editor" | "preview" }) {
  const params = useSearchParams();
  const docId = params.get("doc");
  const [value, setValue] = useState(starter);
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [status, setStatus] = useState("");
  const [currentId, setCurrentId] = useState<string | undefined>(docId ?? undefined);

  useEffect(() => {
    if (!docId) return;
    getDoc(docId).then((doc) => {
      if (!doc) return;
      setValue(doc.content);
      setCurrentId(doc.id);
    });
  }, [docId]);

  const outline = useMemo(
    () =>
      value
        .split("\n")
        .map((line) => /^(#{1,6})\s+(.+)$/.exec(line))
        .filter((match): match is RegExpExecArray => Boolean(match))
        .map((match) => ({ level: match[1].length, text: match[2] })),
    [value],
  );

  function wrap(before: string, after = before) {
    const area = document.querySelector<HTMLTextAreaElement>("[data-editor]");
    if (!area) return;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const selected = value.slice(start, end) || "text";
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    setValue(next);
  }

  async function save() {
    const doc = await saveDoc({ id: currentId, content: value });
    setCurrentId(doc.id);
    setStatus(`Saved “${doc.title}” on this device.`);
  }

  async function share() {
    const shareId = await createShare(value, titleFromMarkdown(value));
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/share/#${shareId}`;
    await navigator.clipboard.writeText(url);
    setStatus("Share link copied. It opens on this browser.");
  }

  return (
    <div className="space-y-4">
      {mode === "editor" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => wrap("**")}>Bold</button>
          <button type="button" className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => wrap("*")}>Italic</button>
          <button type="button" className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => wrap("`", "`")}>Code</button>
          <button type="button" className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => wrap("[", "](https://)")}>Link</button>
          <button type="button" className="rounded-lg border border-border px-2 py-1 text-sm" onClick={() => setValue(`## Heading\n\n${value}`)}>Heading</button>
          <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={save}>Save</button>
          <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={share}>Share link</button>
          <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => downloadText(value, "document.md", "text/markdown")}>Download MD</button>
          <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={async () => downloadText(await htmlFromMarkdown(value), "document.html", "text/html")}>Download HTML</button>
          <label className="rounded-lg border border-border px-3 py-1.5 text-sm">
            Open
            <input type="file" accept=".md,.txt,.markdown" className="sr-only" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) setValue(await file.text());
            }} />
          </label>
        </div>
      )}
      {mode === "editor" && (
        <div className="flex flex-wrap gap-2 text-sm">
          <input value={find} onChange={(event) => setFind(event.target.value)} placeholder="Find" className="rounded-lg border border-border bg-transparent px-3 py-1.5" />
          <input value={replace} onChange={(event) => setReplace(event.target.value)} placeholder="Replace" className="rounded-lg border border-border bg-transparent px-3 py-1.5" />
          <button type="button" className="rounded-lg border border-border px-3 py-1.5" onClick={() => find && setValue(value.replaceAll(find, replace))}>Replace all</button>
        </div>
      )}
      {status && <p className="text-sm text-muted">{status}</p>}
      <div className={`grid gap-4 ${mode === "editor" ? "lg:grid-cols-[12rem_minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
        {mode === "editor" && (
          <aside className="rounded-2xl border border-border p-3 text-sm">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Outline</p>
            <ul className="space-y-1">
              {outline.map((item) => (
                <li key={`${item.level}-${item.text}`} style={{ paddingLeft: (item.level - 1) * 8 }}>{item.text}</li>
              ))}
            </ul>
          </aside>
        )}
        {mode === "editor" && (
          <textarea data-editor value={value} onChange={(event) => setValue(event.target.value)} spellCheck className={areaClass} aria-label="Markdown editor" />
        )}
        {mode === "preview" && (
          <textarea value={value} onChange={(event) => setValue(event.target.value)} spellCheck className={`${areaClass} mb-4`} aria-label="Markdown source" />
        )}
        <div className="rounded-2xl border border-border p-4">
          <MarkdownPreview markdown={value} />
        </div>
      </div>
    </div>
  );
}

function FolderEditor() {
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [active, setActive] = useState(0);
  const current = files[active];
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div>
        <label className="mb-3 inline-block rounded-lg border border-border px-3 py-1.5 text-sm">
          Open Markdown files
          <input
            type="file"
            accept=".md,.txt,.markdown"
            multiple
            className="sr-only"
            onChange={async (event) => {
              const picked = await Promise.all(Array.from(event.target.files ?? []).map(async (file) => ({ name: file.name, content: await file.text() })));
              setFiles(picked);
              setActive(0);
            }}
          />
        </label>
        <ul className="space-y-1 text-sm">
          {files.map((file, index) => (
            <li key={file.name}>
              <button type="button" className={`w-full rounded-lg px-2 py-1 text-left ${index === active ? "bg-foreground/10" : ""}`} onClick={() => setActive(index)}>{file.name}</button>
            </li>
          ))}
        </ul>
        {files.length > 0 && (
          <button
            type="button"
            className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground"
            onClick={async () => {
              const { default: JSZip } = await import("jszip");
              const zip = new JSZip();
              files.forEach((file) => zip.file(file.name, file.content));
              const blob = await zip.generateAsync({ type: "blob" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "markdown-folder.zip";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download zip
          </button>
        )}
      </div>
      {current ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea
            className={areaClass}
            value={current.content}
            onChange={(event) => setFiles(files.map((file, index) => index === active ? { ...file, content: event.target.value } : file))}
          />
          <div className="rounded-2xl border border-border p-4">
            <MarkdownPreview markdown={current.content} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Choose one or more .md files. They stay in this browser until you download the zip.</p>
      )}
    </div>
  );
}

function MermaidEditor() {
  const [chart, setChart] = useState(mermaidStarter);
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let alive = true;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral" });
      try {
        const rendered = await mermaid.render(`mermaid-editor-${Date.now()}`, chart);
        if (alive) setSvg(rendered.svg);
      } catch (error) {
        if (alive) setSvg(`<p>${error instanceof Error ? error.message : "Diagram error"}</p>`);
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <textarea className={areaClass} value={chart} onChange={(event) => setChart(event.target.value)} aria-label="Mermaid source" />
        <button
          type="button"
          className="mt-3 rounded-lg border border-border px-3 py-1.5 text-sm"
          onClick={() => downloadText(svg, "diagram.svg", "image/svg+xml")}
        >
          Download SVG
        </button>
      </div>
      <div className="overflow-auto rounded-2xl border border-border p-4" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
