import { inlinePlain, parseBlocks } from "./blocks";

function mapInline(text: string, flavor: "slack" | "whatsapp" | "telegram" | "discord" | "jira" | "bbcode") {
  let value = text;
  value = value.replace(/\[([^\]]+)]\(([^)]+)\)/g, (_, label: string, url: string) => {
    if (flavor === "slack") return `<${url}|${label}>`;
    if (flavor === "jira") return `[${label}|${url}]`;
    if (flavor === "bbcode") return `[url=${url}]${label}[/url]`;
    return `[${label}](${url})`;
  });
  value = value.replace(/\*\*(.+?)\*\*/g, (_, inner: string) => {
    if (flavor === "slack" || flavor === "whatsapp" || flavor === "telegram") return `*${inner}*`;
    if (flavor === "jira") return `*${inner}*`;
    if (flavor === "bbcode") return `[b]${inner}[/b]`;
    return `**${inner}**`;
  });
  value = value.replace(/(^|[^\*])\*([^*\n]+)\*(?!\*)/g, (_, lead: string, inner: string) => {
    if (flavor === "slack" || flavor === "whatsapp" || flavor === "telegram") return `${lead}_${inner}_`;
    if (flavor === "jira") return `${lead}_${inner}_`;
    if (flavor === "bbcode") return `${lead}[i]${inner}[/i]`;
    return `${lead}*${inner}*`;
  });
  value = value.replace(/~~(.+?)~~/g, (_, inner: string) => {
    if (flavor === "slack" || flavor === "whatsapp") return `~${inner}~`;
    if (flavor === "telegram") return `~${inner}~`;
    if (flavor === "bbcode") return `[s]${inner}[/s]`;
    if (flavor === "jira") return `-${inner}-`;
    return `~~${inner}~~`;
  });
  value = value.replace(/`([^`]+)`/g, (_, inner: string) => {
    if (flavor === "jira") return `{{${inner}}}`;
    if (flavor === "bbcode") return `[code]${inner}[/code]`;
    return `\`${inner}\``;
  });
  return value;
}

export function markdownToFlavor(markdown: string, flavor: "slack" | "whatsapp" | "telegram" | "discord" | "jira" | "bbcode") {
  return parseBlocks(markdown)
    .map((block) => {
      if (block.type === "heading") {
        const text = mapInline(block.text, flavor);
        if (flavor === "jira") return `h${block.level}. ${text}`;
        if (flavor === "bbcode") return `[size=${Math.max(3, 7 - (block.level ?? 2))}][b]${text}[/b][/size]`;
        if (flavor === "discord") return block.level === 1 ? `# ${text}` : block.level === 2 ? `## ${text}` : `### ${text}`;
        return `*${text}*`;
      }
      if (block.type === "code") {
        if (flavor === "jira") return `{code${block.lang ? `:${block.lang}` : ""}}\n${block.text}\n{code}`;
        if (flavor === "bbcode") return `[code]${block.text}[/code]`;
        return `\`\`\`${block.lang ?? ""}\n${block.text}\n\`\`\``;
      }
      if (block.type === "list") {
        return (block.items ?? [])
          .map((item, index) => {
            const marker = block.ordered ? `${index + 1}.` : flavor === "jira" ? "*" : "-";
            const body = mapInline(item, flavor);
            return `${marker} ${body}`;
          })
          .join("\n");
      }
      if (block.type === "quote") {
        if (flavor === "bbcode") return `[quote]${block.text}[/quote]`;
        if (flavor === "jira") return `{quote}${block.text}{quote}`;
        return block.text
          .split("\n")
          .map((line) => `> ${mapInline(line, flavor)}`)
          .join("\n");
      }
      if (block.type === "rule") return flavor === "bbcode" ? "[hr]" : "---";
      if (block.type === "table" && block.rows) {
        if (flavor === "jira") {
          return block.rows.map((row, rowIndex) => row.map((cell) => (rowIndex === 0 ? `||${cell}||` : `|${cell}|`)).join("")).join("\n");
        }
        return block.rows.map((row) => row.join(" | ")).join("\n");
      }
      return mapInline(block.text, flavor);
    })
    .join("\n\n");
}

export function jiraToMarkdown(input: string) {
  return input
    .replace(/^h([1-6])\.\s+(.*)$/gm, (_, level: string, text: string) => `${"#".repeat(Number(level))} ${text}`)
    .replace(/\{code(?::([^}]+))?\}([\s\S]*?)\{code\}/g, (_, lang: string, body: string) => `\`\`\`${lang ?? ""}\n${body.trim()}\n\`\`\``)
    .replace(/\{quote\}([\s\S]*?)\{quote\}/g, (_, body: string) => body.trim().split("\n").map((line) => `> ${line}`).join("\n"))
    .replace(/\[([^\]|]+)\|([^\]]+)]/g, "[$1]($2)")
    .replace(/(^|\s)\*(\S(?:.*?\S)?)\*(?=\s|$)/g, "$1**$2**")
    .replace(/\{\{([^}]+)\}\}/g, "`$1`");
}

export function stripMarkdown(markdown: string) {
  return parseBlocks(markdown)
    .map((block) => {
      if (block.type === "list") return (block.items ?? []).map((item) => `• ${inlinePlain(item)}`).join("\n");
      if (block.type === "table") return (block.rows ?? []).map((row) => row.join("\t")).join("\n");
      if (block.type === "rule") return "";
      return inlinePlain(block.text);
    })
    .filter(Boolean)
    .join("\n\n");
}

export function textToMarkdown(input: string, options: { headings: boolean; lists: boolean; links: boolean }) {
  const blocks = input.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((line) => line.trimEnd());
      const nonEmpty = lines.filter((line) => line.trim());
      if (nonEmpty.length === 0) return "";
      if (options.lists && nonEmpty.every((line) => /^(\s*[-*•]|\s*\d+[.)])\s+/.test(line))) {
        return nonEmpty
          .map((line) => {
            const ordered = /^\s*\d+[.)]\s+/.exec(line);
            const text = line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "");
            return ordered ? `1. ${linkify(text, options.links)}` : `- ${linkify(text, options.links)}`;
          })
          .join("\n");
      }
      if (options.headings && nonEmpty.length === 1 && nonEmpty[0].length < 80 && !/[.!?]$/.test(nonEmpty[0])) {
        return `## ${linkify(nonEmpty[0], options.links)}`;
      }
      return linkify(nonEmpty.join(" "), options.links);
    })
    .filter(Boolean)
    .join("\n\n");
}

function linkify(text: string, enabled: boolean) {
  if (!enabled) return text;
  return text.replace(/(^|\s)(https?:\/\/[^\s)]+)/g, "$1<$2>");
}

export function tableToMarkdown(rows: string[][], align: Array<"left" | "center" | "right" | ""> = []) {
  if (rows.length === 0) return "";
  const width = Math.max(...rows.map((row) => row.length));
  const normalized = rows.map((row) => Array.from({ length: width }, (_, index) => row[index] ?? ""));
  const header = normalized[0];
  const divider = header.map((_, index) => {
    const mode = align[index] ?? "left";
    if (mode === "center") return ":---:";
    if (mode === "right") return "---:";
    return "---";
  });
  const body = normalized.slice(1);
  return [header, divider, ...body].map((row) => `| ${row.join(" | ")} |`).join("\n");
}

export function formatMarkdownTable(markdown: string) {
  const rows = readFirstTable(markdown);
  if (!rows) return markdown;
  const widths = widthsOf(rows);
  const formatted = rows.map((row, rowIndex) => {
    const cells = row.map((cell, index) => {
      const width = widths[index];
      if (rowIndex === 1 && /^:?-+:?$/.test(cell.replace(/\s/g, ""))) {
        const raw = cell.replace(/\s/g, "");
        const left = raw.startsWith(":");
        const right = raw.endsWith(":");
        const fill = "-".repeat(Math.max(3, width));
        return `${left ? ":" : ""}${fill}${right ? ":" : ""}`.slice(0, Math.max(width, 3));
      }
      return cell.padEnd(width, " ");
    });
    return `| ${cells.join(" | ")} |`;
  });
  return replaceFirstTable(markdown, formatted.join("\n"));
}

export function readFirstTable(markdown: string) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line, index) => line.trim().startsWith("|") && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] ?? ""));
  if (start < 0) return null;
  const rows: string[][] = [];
  for (let index = start; index < lines.length; index += 1) {
    if (!lines[index].trim().startsWith("|")) break;
    rows.push(
      lines[index]
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim()),
    );
  }
  return rows;
}

function widthsOf(rows: string[][]) {
  const width = Math.max(...rows.map((row) => row.length));
  return Array.from({ length: width }, (_, index) => Math.max(3, ...rows.map((row) => (row[index] ?? "").length)));
}

function replaceFirstTable(markdown: string, next: string) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line, index) => line.trim().startsWith("|") && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] ?? ""));
  if (start < 0) return markdown;
  let end = start;
  while (end < lines.length && lines[end].trim().startsWith("|")) end += 1;
  return [...lines.slice(0, start), next, ...lines.slice(end)].join("\n");
}

export function alignTable(markdown: string, align: Array<"left" | "center" | "right">) {
  const rows = readFirstTable(markdown);
  if (!rows || rows.length < 2) return markdown;
  const header = rows[0];
  const body = rows.slice(2);
  return replaceFirstTable(markdown, tableToMarkdown([header, ...body], align));
}

export function tableWithoutHeader(markdown: string) {
  const rows = readFirstTable(markdown);
  if (!rows) return markdown;
  const data = [rows[0], ...rows.slice(2)];
  const body = data.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  return `<table>\n${body}\n</table>`;
}

export function centerTable(markdown: string) {
  const rows = readFirstTable(markdown);
  const table = rows ? rows.map((row) => `| ${row.join(" | ")} |`).join("\n") : markdown.trim();
  return `<div align="center">\n\n${table}\n\n</div>`;
}

export function markdownTableToHtml(markdown: string) {
  const rows = readFirstTable(markdown);
  if (!rows) return "";
  const header = rows[0].map((cell) => `<th>${escapeHtml(cell)}</th>`).join("");
  const body = rows.slice(2).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("\n");
  return `<table>\n<thead><tr>${header}</tr></thead>\n<tbody>\n${body}\n</tbody>\n</table>`;
}

export function markdownTableToLatex(markdown: string) {
  const rows = readFirstTable(markdown);
  if (!rows) return "";
  const data = [rows[0], ...rows.slice(2)];
  const cols = data[0].map(() => "l").join(" ");
  const body = data.map((row) => `${row.map(escapeLatex).join(" & ")} \\\\`).join("\n");
  return `\\begin{tabular}{${cols}}\n\\hline\n${body}\n\\hline\n\\end{tabular}`;
}

export function markdownTableRecords(markdown: string) {
  const rows = readFirstTable(markdown);
  if (!rows) return [];
  const header = rows[0];
  return rows.slice(2).map((row) => Object.fromEntries(header.map((key, index) => [key || `column${index + 1}`, row[index] ?? ""])));
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeLatex(value: string) {
  return value.replace(/([%&_#$])/g, "\\$1");
}

export function htmlTableToMarkdown(html: string) {
  if (typeof DOMParser === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const table = doc.querySelector("table");
  if (!table) return "No HTML table found.";
  const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
    Array.from(row.querySelectorAll("th,td")).map((cell) => (cell.textContent ?? "").trim().replace(/\|/g, "\\|")),
  );
  return tableToMarkdown(rows);
}

export function formatMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").replace(/\t/g, "  ").split("\n");
  const cleaned = lines.map((line) => line.replace(/[ \t]+$/g, "").replace(/^(#{1,6})([^ #\n])/, "$1 $2"));
  const collapsed: string[] = [];
  for (const line of cleaned) {
    if (line === "" && collapsed[collapsed.length - 1] === "" && collapsed[collapsed.length - 2] === "") continue;
    collapsed.push(line);
  }
  return `${collapsed.join("\n").replace(/^\n+/, "").replace(/\s*$/, "")}\n`;
}
