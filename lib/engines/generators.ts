export type Field =
  | { type: "text" | "textarea"; name: string; label: string; defaultValue?: string; rows?: number }
  | { type: "select"; name: string; label: string; options: { value: string; label: string }[]; defaultValue?: string }
  | { type: "checkbox"; name: string; label: string; defaultValue?: boolean };

export interface GeneratorDef {
  fields: Field[];
  build: (values: Record<string, string | boolean>) => string;
}

function value(values: Record<string, string | boolean>, name: string) {
  return String(values[name] ?? "");
}

const readmeTemplates: Record<string, string> = {
  minimal: `# Project\n\nOne sentence about what this does.\n\n## Usage\n\n\`\`\`bash\nnpm install project\n\`\`\`\n\n## License\n\nMIT\n`,
  "open-source": `# Project\n\n[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)\n\nA short description of the problem this project solves.\n\n## Install\n\n\`\`\`bash\nnpm install project\n\`\`\`\n\n## Usage\n\n\`\`\`ts\nimport { project } from "project";\n\`\`\`\n\n## Contributing\n\nIssues and pull requests are welcome.\n\n## License\n\nMIT\n`,
  library: `# Library\n\n## Install\n\n\`\`\`bash\npip install library\n\`\`\`\n\n## Quick start\n\n\`\`\`python\nimport library\nlibrary.run()\n\`\`\`\n\n## API\n\n### run()\n\nDoes the main work.\n\n## License\n\nApache-2.0\n`,
};

export const generators: Record<string, GeneratorDef> = {
  quote: {
    fields: [
      { type: "textarea", name: "text", label: "Quote", defaultValue: "Write the sentence you want to quote.", rows: 4 },
      { type: "text", name: "author", label: "Attribution", defaultValue: "Ada Lovelace" },
      { type: "checkbox", name: "nested", label: "Nest one level", defaultValue: false },
    ],
    build: (values) => {
      const prefix = values.nested ? "> > " : "> ";
      const body = value(values, "text").split("\n").map((line) => `${prefix}${line}`).join("\n");
      const author = value(values, "author");
      return author ? `${body}\n${prefix}\n${prefix}— ${author}` : body;
    },
  },
  "quote-block": {
    fields: [
      { type: "textarea", name: "text", label: "Quote", defaultValue: "A short quotation.", rows: 4 },
      { type: "text", name: "cite", label: "Citation", defaultValue: "Source" },
    ],
    build: (values) => `> ${value(values, "text").replace(/\n/g, "\n> ")}\n>\n> — ${value(values, "cite")}`,
  },
  callout: {
    fields: [
      { type: "select", name: "platform", label: "Platform", defaultValue: "github", options: [{ value: "github", label: "GitHub" }, { value: "gitlab", label: "GitLab" }, { value: "obsidian", label: "Obsidian" }] },
      { type: "select", name: "kind", label: "Type", defaultValue: "NOTE", options: ["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION", "INFO", "SUCCESS", "QUESTION", "FAILURE", "DANGER", "BUG", "EXAMPLE", "QUOTE"].map((item) => ({ value: item, label: item })) },
      { type: "text", name: "title", label: "Title", defaultValue: "" },
      { type: "textarea", name: "body", label: "Body", defaultValue: "Explain the consequence in one or two sentences.", rows: 5 },
      { type: "checkbox", name: "open", label: "Expanded by default (Obsidian)", defaultValue: true },
    ],
    build: (values) => {
      const kind = value(values, "kind");
      const title = value(values, "title");
      const fold = values.platform === "obsidian" ? (values.open ? "+" : "-") : "";
      const label = values.platform === "obsidian" ? kind.toLowerCase() : kind;
      const first = `> [!${label}]${fold}${title ? ` ${title}` : ""}`;
      const body = value(values, "body").split("\n").map((line) => `> ${line}`).join("\n");
      return `${first}\n${body}`;
    },
  },
  toc: {
    fields: [
      { type: "textarea", name: "markdown", label: "Markdown", defaultValue: "# Guide\n\n## Install\n\n## Usage\n\n### Options\n", rows: 10 },
      { type: "checkbox", name: "skipH1", label: "Skip the title", defaultValue: true },
    ],
    build: (values) => {
      const lines = value(values, "markdown").split("\n");
      return lines
        .map((line) => /^(#{1,6})\s+(.+)$/.exec(line))
        .filter((match): match is RegExpExecArray => Boolean(match))
        .filter((match) => !(values.skipH1 && match[1].length === 1))
        .map((match) => {
          const text = match[2].trim();
          const slug = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
          return `${"  ".repeat(match[1].length - 1)}- [${text}](#${slug})`;
        })
        .join("\n");
    },
  },
  readme: {
    fields: [
      { type: "text", name: "name", label: "Project name", defaultValue: "Project" },
      { type: "textarea", name: "description", label: "Description", defaultValue: "What this project does.", rows: 3 },
      { type: "text", name: "install", label: "Install command", defaultValue: "npm install project" },
      { type: "textarea", name: "usage", label: "Usage", defaultValue: "npx project", rows: 3 },
      { type: "text", name: "license", label: "License", defaultValue: "MIT" },
    ],
    build: (values) => `# ${value(values, "name")}\n\n${value(values, "description")}\n\n## Install\n\n\`\`\`bash\n${value(values, "install")}\n\`\`\`\n\n## Usage\n\n\`\`\`bash\n${value(values, "usage")}\n\`\`\`\n\n## License\n\n${value(values, "license")}\n`,
  },
  "profile-readme": {
    fields: [
      { type: "text", name: "name", label: "Name", defaultValue: "Your Name" },
      { type: "text", name: "headline", label: "Headline", defaultValue: "Building small tools for writers." },
      { type: "textarea", name: "about", label: "About", defaultValue: "I write about Markdown, documentation, and local-first tools.", rows: 4 },
      { type: "text", name: "skills", label: "Skills, comma separated", defaultValue: "TypeScript, Markdown, Writing" },
      { type: "text", name: "github", label: "GitHub username", defaultValue: "octocat" },
      { type: "text", name: "website", label: "Website", defaultValue: "https://example.com" },
    ],
    build: (values) => {
      const skills = value(values, "skills").split(",").map((item) => item.trim()).filter(Boolean).map((item) => `\`${item}\``).join(" ");
      return `# Hi, I'm ${value(values, "name")}\n\n${value(values, "headline")}\n\n${value(values, "about")}\n\n## Skills\n\n${skills}\n\n## Links\n\n- GitHub: [@${value(values, "github")}](https://github.com/${value(values, "github")})\n- Website: ${value(values, "website")}\n`;
    },
  },
  badge: {
    fields: [
      { type: "text", name: "label", label: "Label", defaultValue: "license" },
      { type: "text", name: "message", label: "Message", defaultValue: "MIT" },
      { type: "text", name: "color", label: "Color", defaultValue: "blue" },
    ],
    build: (values) => {
      const label = encodeURIComponent(value(values, "label"));
      const message = encodeURIComponent(value(values, "message"));
      const color = encodeURIComponent(value(values, "color"));
      return `![${value(values, "label")}](https://img.shields.io/badge/${label}-${message}-${color})`;
    },
  },
  link: {
    fields: [
      { type: "text", name: "text", label: "Text", defaultValue: "MarkdownTools" },
      { type: "text", name: "url", label: "URL", defaultValue: "https://www.markdowntools.io" },
      { type: "text", name: "title", label: "Title", defaultValue: "" },
    ],
    build: (values) => {
      const title = value(values, "title");
      return title ? `[${value(values, "text")}](${value(values, "url")} "${title}")` : `[${value(values, "text")}](${value(values, "url")})`;
    },
  },
  "code-block": {
    fields: [
      { type: "text", name: "language", label: "Language", defaultValue: "ts" },
      { type: "textarea", name: "code", label: "Code", defaultValue: "export const answer = 42;\n", rows: 8 },
    ],
    build: (values) => `\`\`\`${value(values, "language")}\n${value(values, "code").replace(/\n$/, "")}\n\`\`\`\n`,
  },
  "github-code": {
    fields: [
      { type: "text", name: "language", label: "Language", defaultValue: "ts" },
      { type: "text", name: "filename", label: "Filename", defaultValue: "src/index.ts" },
      { type: "textarea", name: "code", label: "Code", defaultValue: "export const answer = 42;\n", rows: 8 },
    ],
    build: (values) => {
      const filename = value(values, "filename");
      const comment = filename ? `// ${filename}\n` : "";
      return `\`\`\`${value(values, "language")}\n${comment}${value(values, "code").replace(/\n$/, "")}\n\`\`\`\n`;
    },
  },
  "discord-timestamp": {
    fields: [
      { type: "text", name: "when", label: "Local date and time", defaultValue: "2026-10-26T17:00" },
      { type: "select", name: "style", label: "Style", defaultValue: "f", options: [
        { value: "t", label: "Short time" },
        { value: "T", label: "Long time" },
        { value: "d", label: "Short date" },
        { value: "D", label: "Long date" },
        { value: "f", label: "Short date and time" },
        { value: "F", label: "Long date and time" },
        { value: "R", label: "Relative" },
      ] },
    ],
    build: (values) => {
      const date = new Date(value(values, "when"));
      const unix = Number.isNaN(date.getTime()) ? Math.floor(Date.now() / 1000) : Math.floor(date.getTime() / 1000);
      return `<t:${unix}:${value(values, "style") || "f"}>`;
    },
  },
  checkbox: {
    fields: [{ type: "textarea", name: "items", label: "One item per line. Start a line with x to check it.", defaultValue: "Write the draft\nx Review the table\nExport the PDF", rows: 8 }],
    build: (values) => value(values, "items").split("\n").filter((line) => line.trim()).map((line) => {
      const checked = /^x\s+/i.test(line.trim());
      const text = line.trim().replace(/^x\s+/i, "");
      return `- [${checked ? "x" : " "}] ${text}`;
    }).join("\n"),
  },
  "readme-templates": {
    fields: [{ type: "select", name: "template", label: "Template", defaultValue: "open-source", options: [
      { value: "minimal", label: "Minimal" },
      { value: "open-source", label: "Open source" },
      { value: "library", label: "Library" },
    ] }],
    build: (values) => readmeTemplates[value(values, "template")] ?? readmeTemplates.minimal,
  },
  changelog: {
    fields: [
      { type: "text", name: "version", label: "Version", defaultValue: "1.1.0" },
      { type: "text", name: "date", label: "Date", defaultValue: "2026-10-26" },
      { type: "textarea", name: "added", label: "Added", defaultValue: "Folder editor", rows: 3 },
      { type: "textarea", name: "changed", label: "Changed", defaultValue: "Clearer PDF preview", rows: 3 },
      { type: "textarea", name: "fixed", label: "Fixed", defaultValue: "Table alignment on narrow screens", rows: 3 },
    ],
    build: (values) => {
      const section = (title: string, body: string) => {
        const items = body.split("\n").map((line) => line.trim()).filter(Boolean);
        return items.length ? `### ${title}\n\n${items.map((item) => `- ${item}`).join("\n")}\n` : "";
      };
      return `# Changelog\n\n## [${value(values, "version")}] — ${value(values, "date")}\n\n${section("Added", value(values, "added"))}\n${section("Changed", value(values, "changed"))}\n${section("Fixed", value(values, "fixed"))}`;
    },
  },
  llms: {
    fields: [
      { type: "text", name: "name", label: "Site name", defaultValue: "MarkdownTools" },
      { type: "textarea", name: "summary", label: "Summary", defaultValue: "Browser-based Markdown tools for converting, editing, and formatting documents.", rows: 3 },
      { type: "textarea", name: "pages", label: "Pages, one per line: Title | URL | note", defaultValue: "Cheat sheet | https://www.markdowntools.io/cheat-sheet | Syntax reference\nEditor | https://www.markdowntools.io/editor | Write and preview", rows: 6 },
    ],
    build: (values) => {
      const links = value(values, "pages").split("\n").map((line) => line.split("|").map((part) => part.trim())).filter((parts) => parts[0] && parts[1]);
      return `# ${value(values, "name")}\n\n> ${value(values, "summary")}\n\n## Docs\n\n${links.map(([title, url, note]) => `- [${title}](${url})${note ? `: ${note}` : ""}`).join("\n")}\n`;
    },
  },
  image: {
    fields: [
      { type: "text", name: "alt", label: "Alt text", defaultValue: "Diagram of the editor" },
      { type: "text", name: "src", label: "Image URL", defaultValue: "https://example.com/diagram.png" },
      { type: "text", name: "title", label: "Title", defaultValue: "" },
    ],
    build: (values) => {
      const title = value(values, "title");
      return title ? `![${value(values, "alt")}](${value(values, "src")} "${title}")` : `![${value(values, "alt")}](${value(values, "src")})`;
    },
  },
  "github-image": {
    fields: [
      { type: "text", name: "alt", label: "Alt text", defaultValue: "Screenshot" },
      { type: "text", name: "src", label: "Image URL", defaultValue: "https://example.com/screen.png" },
      { type: "text", name: "width", label: "Width in pixels", defaultValue: "480" },
    ],
    build: (values) => `![${value(values, "alt")}](${value(values, "src")})\n\n<img src="${value(values, "src")}" alt="${value(values, "alt")}" width="${value(values, "width")}">\n`,
  },
  "definition-list": {
    fields: [
      { type: "select", name: "format", label: "Format", defaultValue: "html", options: [
        { value: "extra", label: "Markdown Extra" },
        { value: "html", label: "HTML" },
        { value: "bold", label: "Bold list" },
        { value: "table", label: "Table" },
      ] },
      { type: "textarea", name: "pairs", label: "term | definition", defaultValue: "Markdown | A plain-text writing format\nGFM | GitHub Flavored Markdown", rows: 6 },
    ],
    build: (values) => {
      const pairs = value(values, "pairs").split("\n").map((line) => line.split("|").map((part) => part.trim())).filter((parts) => parts[0]);
      if (values.format === "extra") return pairs.map(([term, def]) => `${term}\n: ${def ?? ""}`).join("\n\n");
      if (values.format === "bold") return pairs.map(([term, def]) => `**${term}**\n${def ?? ""}`).join("\n\n");
      if (values.format === "table") return `| Term | Definition |\n| --- | --- |\n${pairs.map(([term, def]) => `| ${term} | ${def ?? ""} |`).join("\n")}`;
      return `<dl>\n${pairs.map(([term, def]) => `<dt>${term}</dt>\n<dd>${def ?? ""}</dd>`).join("\n")}\n</dl>`;
    },
  },
  "claude-md": {
    fields: [
      { type: "select", name: "preset", label: "Preset", defaultValue: "next", options: [
        { value: "next", label: "Next.js" },
        { value: "python", label: "Python" },
        { value: "generic", label: "Generic" },
      ] },
      { type: "text", name: "name", label: "Project", defaultValue: "MarkdownTools" },
      { type: "textarea", name: "about", label: "What it is", defaultValue: "A browser-based Markdown toolkit.", rows: 3 },
      { type: "textarea", name: "conventions", label: "Conventions", defaultValue: "Keep tools client-side. Match the existing catalog instead of adding one-off pages.", rows: 4 },
    ],
    build: (values) => {
      const commands = values.preset === "python"
        ? "- Install: `pip install -e .`\n- Test: `pytest`\n- Lint: `ruff check .`"
        : values.preset === "generic"
          ? "- Install: document the package manager\n- Test: document the test command\n- Lint: document the lint command"
          : "- Dev: `npm run dev`\n- Build: `npm run build`\n- Lint: `npm run lint`";
      return `# ${value(values, "name")}\n\n${value(values, "about")}\n\n## Commands\n\n${commands}\n\n## Conventions\n\n${value(values, "conventions")}\n\n## Notes for agents\n\nRead this file before editing. Prefer the existing patterns in the repository.\n`;
    },
  },
};
