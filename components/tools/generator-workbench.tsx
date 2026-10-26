"use client";

import { useEffect, useMemo, useState } from "react";
import { MarkdownPreview } from "@/components/markdown/preview";
import type { Tool } from "@/lib/catalog";
import { tableToMarkdown } from "@/lib/engines/flavors";
import { generators, type Field } from "@/lib/engines/generators";
import { rememberTool } from "@/lib/recent";
import { CopyButton, areaClass, inputClass } from "./copy-button";

export function GeneratorWorkbench({ tool }: { tool: Tool }) {
  useEffect(() => {
    rememberTool(tool.slug);
  }, [tool.slug]);
  if (tool.engine === "table") return <TableGenerator />;
  if (tool.engine === "discord-color") return <DiscordColors />;
  if (tool.engine === "merge-cells") return <MergeCells />;
  const def = generators[tool.engine];
  if (!def) return <p>This generator is not wired up yet.</p>;
  return <SchemaGenerator fields={def.fields} build={def.build} />;
}

function SchemaGenerator({ fields, build }: { fields: Field[]; build: (values: Record<string, string | boolean>) => string }) {
  const initial = Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? (field.type === "checkbox" ? false : "")]));
  const [values, setValues] = useState<Record<string, string | boolean>>(initial);
  const output = useMemo(() => build(values), [build, values]);
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        {fields.map((field) => (
          <label key={field.name} className="block text-sm">
            <span className="mb-1.5 block text-muted">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea rows={field.rows ?? 4} className={areaClass} value={String(values[field.name] ?? "")} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} />
            ) : field.type === "select" ? (
              <select className={inputClass} value={String(values[field.name] ?? "")} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues({ ...values, [field.name]: event.target.checked })} />
            ) : (
              <input className={inputClass} value={String(values[field.name] ?? "")} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} />
            )}
          </label>
        ))}
      </form>
      <Result markdown={output} />
    </div>
  );
}

function Result({ markdown }: { markdown: string }) {
  return (
    <div>
      <div className="mb-2 flex gap-2">
        <CopyButton text={markdown} />
      </div>
      <pre className="overflow-auto rounded-2xl border border-border p-4 font-mono text-sm">{markdown}</pre>
      <div className="mt-4 rounded-2xl border border-border p-4">
        <MarkdownPreview markdown={markdown} />
      </div>
    </div>
  );
}

function TableGenerator() {
  const [rows, setRows] = useState([
    ["Name", "Role"],
    ["Ada", "Engineer"],
    ["Lin", "Writer"],
  ]);
  const [history, setHistory] = useState<string[][][]>([]);
  const [future, setFuture] = useState<string[][][]>([]);
  function commit(next: string[][]) {
    setHistory((stack) => [...stack.slice(-30), rows]);
    setFuture([]);
    setRows(next);
  }
  const markdown = tableToMarkdown(rows);
  const html = `<table>\n${rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${cell}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("\n")}\n</table>`;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit(rows.map((row) => [...row, ""]))} >Add column</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit([...rows, rows[0].map(() => "")])}>Add row</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit(rows[0].map((_, index) => rows.map((row) => row[index] ?? "")))}>Transpose</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit([rows[0], ...rows.slice(1).sort((a, b) => (a[0] ?? "").localeCompare(b[0] ?? ""))])}>Sort</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit(rows.filter((row, index) => index === 0 || !rows.slice(1, index).some((other) => other.join() === row.join())))}>Dedupe</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" onClick={() => commit(rows.map((row, index) => (index === 0 ? row : row.map(() => ""))))}>Clear</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" disabled={!history.length} onClick={() => { const previous = history[history.length - 1]; setHistory(history.slice(0, -1)); setFuture([rows, ...future]); setRows(previous); }}>Undo</button>
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm" disabled={!future.length} onClick={() => { const [next, ...rest] = future; setFuture(rest); setHistory([...history, rows]); setRows(next); }}>Redo</button>
        <CopyButton text={markdown} label="Copy Markdown" />
        <CopyButton text={html} label="Copy HTML" />
      </div>
      <div className="overflow-auto rounded-2xl border border-border">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex} className="border border-border p-0">
                    <input
                      value={cell}
                      aria-label={`Row ${rowIndex + 1} column ${columnIndex + 1}`}
                      className="w-full min-w-32 bg-transparent px-3 py-2 outline-none"
                      onChange={(event) => {
                        const next = rows.map((line) => [...line]);
                        next[rowIndex][columnIndex] = event.target.value;
                        setRows(next);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Tab") {
                          event.preventDefault();
                          const forward = !event.shiftKey;
                          const columns = row.length;
                          const flat = rowIndex * columns + columnIndex + (forward ? 1 : -1);
                          const targetRow = Math.floor(flat / columns);
                          const targetColumn = ((flat % columns) + columns) % columns;
                          if (targetRow >= rows.length) commit([...rows, rows[0].map(() => "")]);
                          const selector = `input[aria-label="Row ${targetRow + 1} column ${targetColumn + 1}"]`;
                          window.setTimeout(() => document.querySelector<HTMLInputElement>(selector)?.focus(), 0);
                        }
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Result markdown={markdown} />
    </div>
  );
}

const ansiColors = [
  ["30", "Gray"],
  ["31", "Red"],
  ["32", "Green"],
  ["33", "Yellow"],
  ["34", "Blue"],
  ["35", "Pink"],
  ["36", "Cyan"],
  ["37", "White"],
];

function DiscordColors() {
  const [text, setText] = useState("Hello from MarkdownTools");
  const [color, setColor] = useState("32");
  const [bold, setBold] = useState(true);
  const code = `\`\`\`ansi\n\u001b[${bold ? "1;" : ""}${color}m${text}\u001b[0m\n\`\`\``;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3">
        <textarea className={areaClass} value={text} onChange={(event) => setText(event.target.value)} />
        <div className="flex flex-wrap gap-2">
          {ansiColors.map(([value, label]) => (
            <button key={value} type="button" className={`rounded-lg border px-3 py-1.5 text-sm ${color === value ? "border-foreground" : "border-border"}`} onClick={() => setColor(value)}>{label}</button>
          ))}
        </div>
        <label className="text-sm"><input type="checkbox" checked={bold} onChange={(event) => setBold(event.target.checked)} /> Bold</label>
      </div>
      <Result markdown={`Discord only renders this inside an ANSI code block.\n\n${code}`} />
    </div>
  );
}

function MergeCells() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(3);
  const [cells, setCells] = useState<Record<string, { text: string; colspan: number }>>({
    "0-0": { text: "Group", colspan: 2 },
    "0-2": { text: "Status", colspan: 1 },
    "1-0": { text: "Ada", colspan: 1 },
    "1-1": { text: "Engineer", colspan: 1 },
    "1-2": { text: "Active", colspan: 1 },
  });
  const html = buildMergeHtml(rows, cols, cells);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">GitHub Flavored Markdown cannot merge cells. This builds an HTML table, which GitHub will render.</p>
      <div className="flex gap-3 text-sm">
        <label>Rows <input className="w-16 rounded border border-border bg-transparent px-2 py-1" type="number" min={1} max={8} value={rows} onChange={(event) => setRows(Number(event.target.value) || 1)} /></label>
        <label>Columns <input className="w-16 rounded border border-border bg-transparent px-2 py-1" type="number" min={1} max={8} value={cols} onChange={(event) => setCols(Number(event.target.value) || 1)} /></label>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {Array.from({ length: rows * cols }, (_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const key = `${row}-${col}`;
          const cell = cells[key] ?? { text: "", colspan: 1 };
          return (
            <label key={key} className="text-xs text-muted">
              {row + 1},{col + 1}
              <input className={`${inputClass} mt-1`} value={cell.text} onChange={(event) => setCells({ ...cells, [key]: { ...cell, text: event.target.value } })} />
              <input className={`${inputClass} mt-1`} type="number" min={1} value={cell.colspan} onChange={(event) => setCells({ ...cells, [key]: { ...cell, colspan: Number(event.target.value) || 1 } })} />
            </label>
          );
        })}
      </div>
      <Result markdown={`\`\`\`html\n${html}\n\`\`\``} />
    </div>
  );
}

function buildMergeHtml(rows: number, cols: number, cells: Record<string, { text: string; colspan: number }>) {
  const lines = ["<table>"];
  for (let row = 0; row < rows; row += 1) {
    let col = 0;
    const parts: string[] = [];
    while (col < cols) {
      const cell = cells[`${row}-${col}`] ?? { text: "", colspan: 1 };
      const span = Math.max(1, Math.min(cell.colspan, cols - col));
      parts.push(`<td${span > 1 ? ` colspan="${span}"` : ""}>${cell.text}</td>`);
      col += span;
    }
    lines.push(`<tr>${parts.join("")}</tr>`);
  }
  lines.push("</table>");
  return lines.join("\n");
}
