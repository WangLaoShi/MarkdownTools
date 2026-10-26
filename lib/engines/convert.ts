import { load as loadYaml } from "js-yaml";
import Papa from "papaparse";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { parseBlocks } from "./blocks";
import {
  alignTable,
  centerTable,
  formatMarkdownTable,
  htmlTableToMarkdown,
  jiraToMarkdown,
  markdownTableRecords,
  markdownTableToHtml,
  markdownTableToLatex,
  markdownToFlavor,
  stripMarkdown,
  tableToMarkdown,
  tableWithoutHeader,
  textToMarkdown,
} from "./flavors";
import { markdownToHtml } from "@/lib/markdown/html";

const samples: Record<string, string> = {
  "md-to-html": sampleMd(),
  "md-to-pdf": sampleMd(),
  "md-to-docx": sampleMd(),
  "md-to-rich": sampleMd(),
  "md-to-slack": sampleMd(),
  "md-to-discord": sampleMd(),
  "md-to-whatsapp": sampleMd(),
  "md-to-telegram": sampleMd(),
  "strip-md": sampleMd(),
  "md-to-jira": sampleMd(),
  "md-to-bbcode": sampleMd(),
  "jira-to-md": "h1. Release notes\n\n*bold* and _italic_\n\n{code:js}\nconsole.log('hi')\n{code}",
  "html-to-md": "<h1>Notes</h1><p>This is <strong>bold</strong> and <a href=\"https://example.com\">a link</a>.</p><ul><li>One</li><li>Two</li></ul>",
  "paste-html-to-md": "<h1>Pasted page</h1><p>Paste HTML copied from Docs, Notion, or Confluence.</p>",
  "csv-to-table": "Name,Role\nAda,Engineer\nLin,Writer",
  "json-to-table": '[{"name":"Ada","role":"Engineer"},{"name":"Lin","role":"Writer"}]',
  "text-to-md": "Project update\n\nShipped the editor.\nFixed table alignment.\n\nhttps://www.markdowntools.io/editor",
  "openapi-to-md": '{\n  "openapi": "3.0.0",\n  "info": {"title": "Notes", "version": "1.0.0"},\n  "paths": {\n    "/notes": {\n      "get": {"summary": "List notes", "responses": {"200": {"description": "OK"}}}\n    }\n  }\n}',
  "table-format": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |\n| Lin | Writer |",
  "table-align": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "table-no-header": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "table-center": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "html-table-to-md": "<table><tr><th>Name</th><th>Role</th></tr><tr><td>Ada</td><td>Engineer</td></tr></table>",
  "md-table-to-csv": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "md-table-to-json": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "md-table-to-excel": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "md-table-to-html": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  "md-table-to-latex": "| Name | Role |\n| --- | --- |\n| Ada | Engineer |",
  format: "# Messy title\n\n\n\nParagraph with trailing space   \n",
  lint: "# Title\nText\n```\ncode\n```",
  "readme-audit": "# Example\n\nA small library.\n",
  "link-check": "See [MarkdownTools](https://www.markdowntools.io) and https://example.com",
  "mdx-validate": "# Hello\n\n<Callout>This is MDX</Callout>\n",
  "word-count": "Markdown keeps the words you already wrote.",
  "text-diff": "",
};

function sampleMd() {
  return `# Sample Markdown

This is a **bold** and *italic* text sample with a [link](https://www.markdowntools.io).

- First item
- Second item

> [!NOTE]
> Start with a tool, then copy or download the result.

| Column | Value |
| --- | --- |
| Rows | 2 |
`;
}

export function sampleFor(engine: string, slug: string) {
  if (slug === "chatgpt-to-word" || slug === "chatgpt-to-pdf") {
    return `# Chat\n\n**You:** Summarize the release notes.\n\n**Assistant:** The editor, PDF export, and table tools all run in the browser.`;
  }
  if (slug === "claude-to-pdf") return `# Claude\n\n**You:** Turn this into a short brief.\n\n**Claude:** Here is a one-paragraph brief you can export.`;
  if (slug === "gemini-to-pdf") return `# Gemini\n\n**You:** List the steps.\n\n**Gemini:** Paste the conversation, pick a page size, then save the PDF.`;
  return samples[engine] ?? sampleMd();
}

export function hintsFor(slug: string) {
  const hints: Record<string, string> = {
    "google-docs-to-markdown": "In Google Docs, select the content, copy it, and paste it into the box. The converter reads the HTML on your clipboard, or you can paste the HTML source.",
    "notion-to-markdown": "In Notion, copy the blocks or export HTML, then paste here. This page does not sign in to Notion.",
    "confluence-to-markdown": "Copy the page from Confluence, or paste storage-format HTML. This page does not use a Confluence account.",
    "rich-text-to-markdown": "Paste formatted text. If the browser exposes HTML on the clipboard, that HTML is converted.",
    "markdown-to-google-docs": "Copy the rich-text result and paste it into a Google Doc.",
    "url-to-markdown": "The browser asks the page directly. Many sites block that. When it does, paste the HTML into HTML to Markdown instead.",
    "pdf-to-markdown": "Text is extracted in your browser with PDF.js. Scanned pages without a text layer come back empty.",
    "markdown-to-pdf": "Download PDF opens the print dialog. Choose Save as PDF. A second button writes a text PDF directly.",
  };
  return hints[slug] ?? "";
}

function turndown() {
  const service = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
  service.use(gfm);
  return service;
}

export async function convertText(engine: string, input: string, options?: { align?: Array<"left" | "center" | "right">; headings?: boolean; lists?: boolean; links?: boolean }) {
  switch (engine) {
    case "html-to-md":
    case "paste-html-to-md":
      return turndown().turndown(input);
    case "md-to-html":
      return markdownToHtml(input);
    case "md-to-slack":
      return markdownToFlavor(input, "slack");
    case "md-to-discord":
      return markdownToFlavor(input, "discord");
    case "md-to-whatsapp":
      return markdownToFlavor(input, "whatsapp");
    case "md-to-telegram":
      return markdownToFlavor(input, "telegram");
    case "md-to-jira":
      return markdownToFlavor(input, "jira");
    case "md-to-bbcode":
      return markdownToFlavor(input, "bbcode");
    case "jira-to-md":
      return jiraToMarkdown(input);
    case "strip-md":
      return stripMarkdown(input);
    case "text-to-md":
      return textToMarkdown(input, { headings: options?.headings ?? true, lists: options?.lists ?? true, links: options?.links ?? true });
    case "csv-to-table": {
      const parsed = Papa.parse<string[]>(input.trim(), { skipEmptyLines: true });
      return tableToMarkdown(parsed.data);
    }
    case "json-to-table": {
      const data = JSON.parse(input) as unknown;
      if (!Array.isArray(data) || data.some((item) => !item || typeof item !== "object")) {
        throw new Error("Paste a JSON array of objects.");
      }
      const rows = data as Record<string, unknown>[];
      const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
      return tableToMarkdown([headers, ...rows.map((row) => headers.map((key) => String(row[key] ?? "")))]);
    }
    case "openapi-to-md":
      return openApiToMarkdown(input);
    case "table-format":
      return formatMarkdownTable(input);
    case "table-align":
      return alignTable(input, options?.align ?? ["left", "left"]);
    case "table-no-header":
      return tableWithoutHeader(input);
    case "table-center":
      return centerTable(input);
    case "html-table-to-md":
      return htmlTableToMarkdown(input);
    case "md-table-to-csv": {
      const records = markdownTableRecords(input);
      return Papa.unparse(records);
    }
    case "md-table-to-json":
      return JSON.stringify(markdownTableRecords(input), null, 2);
    case "md-table-to-html":
      return markdownTableToHtml(input);
    case "md-table-to-latex":
      return markdownTableToLatex(input);
    case "format": {
      const { formatMarkdown } = await import("./flavors");
      return formatMarkdown(input);
    }
    default:
      throw new Error("This tool needs a file or a different action.");
  }
}

function openApiToMarkdown(input: string) {
  const spec = (input.trim().startsWith("{") ? JSON.parse(input) : loadYaml(input)) as {
    info?: { title?: string; version?: string; description?: string };
    paths?: Record<string, Record<string, { summary?: string; description?: string; responses?: Record<string, { description?: string }> }>>;
  };
  const lines = [`# ${spec.info?.title ?? "API"}`, "", spec.info?.version ? `Version ${spec.info.version}` : "", spec.info?.description ?? ""];
  for (const [path, methods] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(methods)) {
      if (method.startsWith("x-") || typeof operation !== "object") continue;
      lines.push("", `## ${method.toUpperCase()} ${path}`, "", operation.summary ?? operation.description ?? "");
      const responses = operation.responses ?? {};
      if (Object.keys(responses).length) {
        lines.push("", "| Status | Description |", "| --- | --- |");
        for (const [status, response] of Object.entries(responses)) lines.push(`| ${status} | ${response.description ?? ""} |`);
      }
    }
  }
  return lines.filter((line, index, all) => line !== "" || all[index - 1] !== "").join("\n");
}

export async function htmlFromMarkdown(markdown: string) {
  return markdownToHtml(markdown);
}

export async function fileToMarkdown(engine: string, file: File) {
  if (engine === "docx-to-md") {
    const mammoth = await import("mammoth");
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    return turndown().turndown(result.value);
  }
  if (engine === "excel-to-table") {
    const XLSX = await import("xlsx");
    const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheet = book.Sheets[book.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, { header: 1 });
    return tableToMarkdown(rows.map((row) => row.map((cell) => String(cell ?? ""))));
  }
  if (engine === "pdf-to-md") return pdfToMarkdown(file);
  throw new Error("Unsupported file conversion.");
}

async function pdfToMarkdown(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/pdf.worker.min.mjs`;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];
  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = new Map<number, { text: string; height: number }>();
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = Math.round(item.transform[5]);
      const height = Math.abs(item.transform[3]) || item.height || 0;
      const current = lines.get(y) ?? { text: "", height };
      current.text = `${current.text} ${item.str}`.trim();
      current.height = Math.max(current.height, height);
      lines.set(y, current);
    }
    const ordered = Array.from(lines.entries()).sort((a, b) => b[0] - a[0]);
    const heights = ordered.map((entry) => entry[1].height).filter(Boolean);
    const typical = heights.sort((a, b) => a - b)[Math.floor(heights.length / 2)] || 12;
    const pageLines = ordered.map((entry) => (entry[1].height > typical * 1.35 ? `## ${entry[1].text}` : entry[1].text));
    if (pageLines.length === 0) pageLines.push(`<!-- Page ${pageNumber} has no text layer. Scanned pages are not read. -->`);
    parts.push(pageLines.join("\n"));
  }
  return parts.join("\n\n");
}

export async function downloadDocx(markdown: string, filename: string) {
  const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
  const children = parseBlocks(markdown).flatMap((block) => {
    if (block.type === "heading") {
      const levels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
      return [new Paragraph({ heading: levels[(block.level ?? 1) - 1], children: runs(block.text, TextRun) })];
    }
    if (block.type === "list") {
      return (block.items ?? []).map((item) => new Paragraph({ text: item, bullet: block.ordered ? undefined : { level: 0 }, numbering: block.ordered ? { reference: "numbers", level: 0 } : undefined }));
    }
    if (block.type === "code") return [new Paragraph({ children: [new TextRun({ text: block.text, font: "Consolas" })] })];
    if (block.type === "quote") return [new Paragraph({ children: runs(block.text, TextRun) })];
    if (block.type === "table") return (block.rows ?? []).map((row) => new Paragraph({ text: row.join(" | ") }));
    return [new Paragraph({ children: runs(block.text, TextRun) })];
  });
  const doc = new Document({
    numbering: { config: [{ reference: "numbers", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: "left" }] }] },
    sections: [{ children }],
  });
  const blob = await Packer.toBlob(doc);
  saveBlob(blob, filename);
}

function runs(text: string, TextRun: typeof import("docx").TextRun) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith("**")) return new TextRun({ text: part.slice(2, -2), bold: true });
    if (part.startsWith("*")) return new TextRun({ text: part.slice(1, -1), italics: true });
    if (part.startsWith("`")) return new TextRun({ text: part.slice(1, -1), font: "Consolas" });
    return new TextRun(part);
  });
}

export async function downloadTableExcel(markdown: string) {
  const XLSX = await import("xlsx");
  const records = markdownTableRecords(markdown);
  const sheet = XLSX.utils.json_to_sheet(records);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Table");
  XLSX.writeFile(book, "table.xlsx");
}

export async function downloadTextPdf(markdown: string, filename: string) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  let y = 800;
  const write = (text: string, size: number, face: typeof font) => {
    const safe = text.replace(/[^\x09\x0a\x0d\x20-\x7e]/g, "?");
    for (const raw of wrap(safe, 90)) {
      if (y < 48) {
        page = pdf.addPage([595, 842]);
        y = 800;
      }
      page.drawText(raw, { x: 48, y, size, font: face, color: rgb(0.1, 0.1, 0.12) });
      y -= size + 6;
    }
  };
  for (const block of parseBlocks(markdown)) {
    if (block.type === "heading") write(block.text, 18 - (block.level ?? 1), bold);
    else if (block.type === "list") (block.items ?? []).forEach((item, index) => write(`${block.ordered ? `${index + 1}.` : "•"} ${item}`, 11, font));
    else if (block.type === "code") write(block.text, 10, font);
    else if (block.text) write(block.text, 11, font);
    y -= 8;
  }
  const bytes = await pdf.save();
  saveBlob(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), filename);
}

function wrap(text: string, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let rest = paragraph;
    if (!rest) lines.push("");
    while (rest.length > width) {
      const cut = rest.lastIndexOf(" ", width);
      const index = cut > 20 ? cut : width;
      lines.push(rest.slice(0, index));
      rest = rest.slice(index).trimStart();
    }
    lines.push(rest);
  }
  return lines;
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadText(text: string, filename: string, type = "text/plain") {
  saveBlob(new Blob([text], { type }), filename);
}
