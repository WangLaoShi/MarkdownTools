export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicPath(path: string) {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const site = {
  name: "MarkdownTools",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://WangLaoShi.github.io/MarkdownTools",
  title: "Markdown Tools — Editor, Markdown to PDF & Table Generator",
  description:
    "Free markdown editor, markdown to PDF, PDF to markdown, markdown to HTML, and table generator. Word and README tools too. Runs in your browser — no signup.",
  locale: "en_US",
};

export const categoryMeta = {
  "cheat-sheets": {
    label: "Cheat Sheets",
    href: "/cheat-sheets",
    blurb: "Syntax references with a live render beside every example.",
  },
  converters: {
    label: "Converters",
    href: "/converters",
    blurb: "Turn Markdown, HTML, PDF, Word, and spreadsheets into each other.",
  },
  generators: {
    label: "Generators",
    href: "/generators",
    blurb: "Build tables, READMEs, badges, callouts, and snippets.",
  },
  "table-tools": {
    label: "Table Tools",
    href: "/table-tools",
    blurb: "Format, align, and convert Markdown tables.",
  },
  "text-tools": {
    label: "Text Tools",
    href: "/text-tools",
    blurb: "Count, compare, lint, and clean up text.",
  },
  editors: {
    label: "Editors",
    href: "/editors",
    blurb: "Write, preview, and diagram Markdown in the browser.",
  },
} as const;

export type CategoryId = keyof typeof categoryMeta;
