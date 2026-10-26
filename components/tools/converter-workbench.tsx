"use client";

import { useEffect, useMemo, useState } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import type { Tool } from "@/lib/catalog";
import { convertText, downloadDocx, downloadTableExcel, downloadText, downloadTextPdf, fileToMarkdown, hintsFor, htmlFromMarkdown, sampleFor } from "@/lib/engines/convert";
import { rememberTool } from "@/lib/recent";
import { CopyButton, areaClass } from "./copy-button";

const fileEngines = new Set(["docx-to-md", "excel-to-table", "pdf-to-md"]);
const previewEngines = new Set(["md-to-html", "md-to-pdf", "md-to-rich", "paste-html-to-md", "html-to-md", "docx-to-md", "pdf-to-md", "strip-md", "text-to-md", "jira-to-md"]);

export function ConverterWorkbench({ tool }: { tool: Tool }) {
  const [input, setInput] = useState(() => sampleFor(tool.engine, tool.slug));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("center");
  const [headings, setHeadings] = useState(true);
  const [lists, setLists] = useState(true);
  const [links, setLinks] = useState(true);
  const [pageSize, setPageSize] = useState("A4");
  const [margin, setMargin] = useState("16");
  const [theme, setTheme] = useState("light");
  const hint = hintsFor(tool.slug);

  useEffect(() => {
    rememberTool(tool.slug);
  }, [tool.slug]);

  useEffect(() => {
    if (fileEngines.has(tool.engine) || tool.engine === "url-to-md") return;
    let cancelled = false;
    convertText(tool.engine, input, { align: [align, align], headings, lists, links })
      .then((result) => {
        if (!cancelled) {
          setOutput(result);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Could not convert that input.");
      });
    return () => {
      cancelled = true;
    };
  }, [align, headings, input, links, lists, tool.engine]);

  const filename = useMemo(() => `${tool.slug}.md`, [tool.slug]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      if (tool.engine === "md-to-pdf" || tool.engine === "md-to-docx") {
        setInput(await file.text());
      } else {
        setOutput(await fileToMarkdown(tool.engine, file));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  async function fetchUrl() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(input.trim());
      if (!response.ok) throw new Error(`The page responded ${response.status}.`);
      const html = (await response.text()).slice(0, 1_500_000);
      setOutput(await convertText("html-to-md", html));
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "";
      setError(/failed to fetch|networkerror|load failed/i.test(message) || !message
        ? "The browser could not read that page. Paste its HTML into HTML to Markdown."
        : message);
    } finally {
      setBusy(false);
    }
  }

  async function copyRich() {
    const html = tool.engine === "md-to-html" ? output : await htmlFromMarkdown(input);
    await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([input], { type: "text/plain" }) })]);
  }

  function printPdf() {
    const sheet = document.getElementById("pdf-sheet");
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup || !sheet) {
      setError("Allow pop-ups, then choose Save as PDF in the print dialog.");
      return;
    }
    popup.document.write(`<!doctype html><html><head><title>${tool.title}</title><style>@page{size:${pageSize};margin:${margin}mm}body{font-family:Geist,sans-serif;padding:0}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:4px 8px}pre{background:#f4f4f5;padding:12px;border-radius:8px}</style></head><body>${sheet.innerHTML}</body></html>`);
    popup.document.close();
    popup.focus();
    popup.print();
  }

  return (
    <div className="space-y-4">
      {hint && <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {!fileEngines.has(tool.engine) && tool.engine !== "url-to-md" && (
          <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => setInput(sampleFor(tool.engine, tool.slug))}>
            Try a sample
          </button>
        )}
        <CopyButton text={input} label="Copy input" />
        <CopyButton text={output} label="Copy output" />
        {output && <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => downloadText(output, filename, "text/markdown")}>Download</button>}
        {(tool.engine === "md-to-docx") && <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={() => downloadDocx(input, `${tool.slug}.docx`)}>Download DOCX</button>}
        {tool.engine === "md-to-pdf" && (
          <>
            <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={printPdf}>Download PDF</button>
            <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => downloadTextPdf(input, `${tool.slug}.pdf`)}>Download text PDF</button>
          </>
        )}
        {tool.engine === "md-to-rich" && <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={copyRich}>Copy rich text</button>}
        {tool.engine === "md-table-to-excel" && <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={() => downloadTableExcel(input)}>Download Excel</button>}
        {(fileEngines.has(tool.engine) || tool.engine === "md-to-pdf" || tool.engine === "md-to-docx") && (
          <label className="rounded-lg border border-border px-3 py-1.5 text-sm">
            Upload
            <input
              type="file"
              className="sr-only"
              accept={tool.engine === "pdf-to-md" ? ".pdf" : tool.engine === "docx-to-md" ? ".docx" : tool.engine === "excel-to-table" ? ".xlsx,.xls" : ".md,.txt,.markdown"}
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>
        )}
      </div>
      {tool.engine === "text-to-md" && (
        <div className="flex flex-wrap gap-4 text-sm">
          <label><input type="checkbox" checked={headings} onChange={(event) => setHeadings(event.target.checked)} /> Headings</label>
          <label><input type="checkbox" checked={lists} onChange={(event) => setLists(event.target.checked)} /> Lists</label>
          <label><input type="checkbox" checked={links} onChange={(event) => setLinks(event.target.checked)} /> Links</label>
        </div>
      )}
      {tool.engine === "table-align" && (
        <label className="block text-sm">
          Column alignment{" "}
          <select value={align} onChange={(event) => setAlign(event.target.value as typeof align)} className="rounded-lg border border-border bg-transparent px-2 py-1">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
      )}
      {tool.engine === "md-to-pdf" && (
        <div className="flex flex-wrap gap-3 text-sm">
          <label>Page <select value={pageSize} onChange={(event) => setPageSize(event.target.value)} className="rounded-lg border border-border bg-transparent px-2 py-1"><option>A4</option><option>Letter</option><option>Legal</option></select></label>
          <label>Margin <input value={margin} onChange={(event) => setMargin(event.target.value)} className="w-16 rounded-lg border border-border bg-transparent px-2 py-1" /> mm</label>
          <label>Theme <select value={theme} onChange={(event) => setTheme(event.target.value)} className="rounded-lg border border-border bg-transparent px-2 py-1"><option value="light">Light</option><option value="dark">Dark</option><option value="github">GitHub</option></select></label>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {busy && <p className="text-sm text-muted">Working…</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        {tool.engine === "url-to-md" ? (
          <div>
            <label className="mb-2 block text-sm text-muted">Public URL</label>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="https://example.com/article" className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none" />
            <button type="button" className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={fetchUrl}>Convert</button>
          </div>
        ) : fileEngines.has(tool.engine) ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
            Drop a file with the Upload button. The file stays in this browser.
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onPaste={(event) => {
              if (tool.engine !== "paste-html-to-md") return;
              const html = event.clipboardData.getData("text/html");
              if (html) {
                event.preventDefault();
                setInput(html);
              }
            }}
            spellCheck
            aria-label="Input"
            className={areaClass}
          />
        )}
        {tool.engine === "md-to-pdf" ? (
          <div id="pdf-sheet" className={`page-sheet theme-${theme} max-h-[40rem] overflow-auto rounded-2xl border border-border p-6`} style={{ padding: `${margin}mm` }}>
            <MarkdownPreview markdown={input} />
          </div>
        ) : previewEngines.has(tool.engine) && tool.engine !== "md-to-html" ? (
          <div className="max-h-[40rem] overflow-auto rounded-2xl border border-border p-4">
            <MarkdownPreview markdown={tool.engine === "html-to-md" || tool.engine === "paste-html-to-md" || tool.engine === "docx-to-md" || tool.engine === "pdf-to-md" || tool.engine === "text-to-md" || tool.engine === "jira-to-md" ? output : input} />
          </div>
        ) : (
          <textarea readOnly value={output} aria-label="Output" className={areaClass} />
        )}
      </div>
      {tool.engine === "md-to-html" && (
        <div className="rounded-2xl border border-border p-4">
          <MarkdownPreview markdown={input} />
        </div>
      )}
      {tool.engine === "md-to-rich" && (
        <div className="rounded-2xl border border-border p-4">
          <MarkdownPreview markdown={input} />
        </div>
      )}
    </div>
  );
}
