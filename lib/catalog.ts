import { categoryMeta, type CategoryId } from "./site";

export type ToolKind = "reference" | "converter" | "generator" | "text" | "editor";

export interface Tool {
  slug: string;
  title: string;
  nav: string;
  description: string;
  category: CategoryId;
  kind: ToolKind;
  engine: string;
  featured?: boolean;
  priority?: number;
}

export const tools: Tool[] = [
  { slug: "cheat-sheet", title: "Markdown Cheat Sheet", nav: "Cheat Sheet", description: "Complete Markdown syntax reference with interactive examples and a free PDF.", category: "cheat-sheets", kind: "reference", engine: "markdown", featured: true, priority: 0.9 },
  { slug: "discord-markdown", title: "Discord Markdown Guide", nav: "Discord", description: "Discord text formatting: bold, italic, underline, code blocks, spoilers, timestamps, and colored text.", category: "cheat-sheets", kind: "reference", engine: "discord", featured: true, priority: 0.9 },
  { slug: "r-markdown-cheat-sheet", title: "R Markdown Cheat Sheet", nav: "R Markdown", description: "Complete R Markdown reference with code chunks and output options.", category: "cheat-sheets", kind: "reference", engine: "r-markdown", priority: 0.7 },
  { slug: "obsidian-cheat-sheet", title: "Obsidian Markdown Cheat Sheet", nav: "Obsidian", description: "Obsidian Markdown syntax including wikilinks, callouts, embeds, and printable examples.", category: "cheat-sheets", kind: "reference", engine: "obsidian", featured: true, priority: 0.9 },
  { slug: "obsidian-callouts", title: "Obsidian Callouts Guide", nav: "Obsidian Callouts", description: "Obsidian callout syntax, every built-in type, collapsible callouts, and examples.", category: "cheat-sheets", kind: "reference", engine: "obsidian-callouts", priority: 0.7 },
  { slug: "obsidian-wikilinks", title: "Obsidian Wikilinks Guide", nav: "Obsidian Wikilinks", description: "Obsidian wikilink syntax for linking notes, headings, and blocks, plus embeds.", category: "cheat-sheets", kind: "reference", engine: "obsidian-wikilinks", priority: 0.7 },
  { slug: "reddit-markdown", title: "Reddit Markdown Guide", nav: "Reddit", description: "Reddit text formatting with Markdown, including spoilers and superscript.", category: "cheat-sheets", kind: "reference", engine: "reddit", priority: 0.7 },
  { slug: "gitlab-markdown", title: "GitLab Markdown Cheat Sheet", nav: "GitLab", description: "GitLab Flavored Markdown with task lists, math, diagrams, and references.", category: "cheat-sheets", kind: "reference", engine: "gitlab", priority: 0.7 },
  { slug: "slack-markdown", title: "Slack Markdown Guide", nav: "Slack", description: "Slack mrkdwn formatting: bold, italic, strike, quotes, code, and links.", category: "cheat-sheets", kind: "reference", engine: "slack", priority: 0.7 },
  { slug: "jupyter-markdown-cheat-sheet", title: "Jupyter Markdown Cheat Sheet", nav: "Jupyter", description: "Markdown in Jupyter notebooks: math, images, tables, and HTML.", category: "cheat-sheets", kind: "reference", engine: "jupyter", priority: 0.7 },
  { slug: "github-markdown-cheat-sheet", title: "GitHub Markdown Cheat Sheet", nav: "GitHub MD", description: "GitHub Flavored Markdown: alerts, task lists, tables, footnotes, and autolinks.", category: "cheat-sheets", kind: "reference", engine: "github", priority: 0.7 },
  { slug: "emoji-cheat-sheet", title: "Emoji Cheat Sheet", nav: "Emoji Cheat Sheet", description: "Emoji shortcodes you can type in Markdown, with the character beside each code.", category: "cheat-sheets", kind: "reference", engine: "emoji", priority: 0.7 },
  { slug: "discord-code-block", title: "Discord Code Blocks", nav: "Discord Code Blocks", description: "Discord code fences, language hints, and inline code.", category: "cheat-sheets", kind: "reference", engine: "discord-code", priority: 0.7 },
  { slug: "discord-text-formatting", title: "Discord Text Formatting", nav: "Discord Formatting", description: "Bold, italic, underline, strike, headings, and subtext on Discord.", category: "cheat-sheets", kind: "reference", engine: "discord-formatting", priority: 0.7 },
  { slug: "discord-spoiler", title: "Discord Spoilers", nav: "Discord Spoilers", description: "Spoiler tags for text and the limits Discord actually renders.", category: "cheat-sheets", kind: "reference", engine: "discord-spoiler", priority: 0.7 },

  { slug: "html-to-markdown", title: "HTML to Markdown Converter", nav: "HTML → MD", description: "Convert HTML to clean Markdown syntax.", category: "converters", kind: "converter", engine: "html-to-md", priority: 0.7 },
  { slug: "markdown-to-html", title: "Markdown to HTML Converter", nav: "MD → HTML", description: "Convert Markdown to HTML code. See the rendered preview and copy the output.", category: "converters", kind: "converter", engine: "md-to-html", priority: 0.7 },
  { slug: "markdown-to-pdf", title: "Markdown to PDF Converter", nav: "MD → PDF", description: "Export Markdown to print-ready PDFs with live preview, page sizes, margins, and themes.", category: "converters", kind: "converter", engine: "md-to-pdf", featured: true, priority: 0.9 },
  { slug: "pdf-to-markdown", title: "PDF to Markdown Converter", nav: "PDF → MD", description: "Extract text from a PDF in your browser and turn it into editable Markdown.", category: "converters", kind: "converter", engine: "pdf-to-md", featured: true, priority: 0.9 },
  { slug: "markdown-to-word", title: "Markdown to Word Converter", nav: "MD → Word", description: "Convert Markdown to a .docx file you can open in Word or Google Docs.", category: "converters", kind: "converter", engine: "md-to-docx", priority: 0.7 },
  { slug: "url-to-markdown", title: "URL to Markdown Converter", nav: "URL → MD", description: "Fetch a public page and convert its article HTML into Markdown.", category: "converters", kind: "converter", engine: "url-to-md", priority: 0.7 },
  { slug: "google-docs-to-markdown", title: "Google Docs to Markdown", nav: "GDocs → MD", description: "Paste from Google Docs and convert the rich text into Markdown.", category: "converters", kind: "converter", engine: "paste-html-to-md", priority: 0.7 },
  { slug: "markdown-to-google-docs", title: "Markdown to Google Docs", nav: "MD → GDocs", description: "Render Markdown as rich text you can paste into Google Docs.", category: "converters", kind: "converter", engine: "md-to-rich", priority: 0.7 },
  { slug: "csv-to-markdown-table", title: "CSV to Markdown Table", nav: "CSV → Table", description: "Turn CSV into a Markdown table.", category: "converters", kind: "converter", engine: "csv-to-table", priority: 0.7 },
  { slug: "excel-to-markdown", title: "Excel to Markdown Table", nav: "Excel → Table", description: "Read the first sheet of an Excel file and output a Markdown table.", category: "converters", kind: "converter", engine: "excel-to-table", priority: 0.7 },
  { slug: "json-to-markdown-table", title: "JSON to Markdown Table", nav: "JSON → Table", description: "Convert an array of objects into a Markdown table.", category: "converters", kind: "converter", engine: "json-to-table", priority: 0.7 },
  { slug: "notion-to-markdown", title: "Notion to Markdown", nav: "Notion → MD", description: "Paste exported Notion HTML or copied blocks and get Markdown.", category: "converters", kind: "converter", engine: "paste-html-to-md", priority: 0.9 },
  { slug: "rich-text-to-markdown", title: "Rich Text to Markdown", nav: "Rich Text → MD", description: "Paste formatted text from any app and convert it to Markdown.", category: "converters", kind: "converter", engine: "paste-html-to-md", priority: 0.7 },
  { slug: "markdown-to-rich-text", title: "Markdown to Rich Text", nav: "MD → Rich Text", description: "Copy rendered Markdown as rich text for email, Docs, or Word.", category: "converters", kind: "converter", engine: "md-to-rich", priority: 0.7 },
  { slug: "confluence-to-markdown", title: "Confluence to Markdown", nav: "Confluence → MD", description: "Paste Confluence storage HTML or a copied page and convert it to Markdown.", category: "converters", kind: "converter", engine: "paste-html-to-md", priority: 0.7 },
  { slug: "markdown-to-slack", title: "Markdown to Slack", nav: "MD → Slack", description: "Convert standard Markdown into Slack mrkdwn.", category: "converters", kind: "converter", engine: "md-to-slack", priority: 0.7 },
  { slug: "markdown-to-discord", title: "Markdown to Discord", nav: "MD → Discord", description: "Rewrite Markdown so headings, spoilers, and emphasis match Discord.", category: "converters", kind: "converter", engine: "md-to-discord", priority: 0.7 },
  { slug: "markdown-to-whatsapp", title: "Markdown to WhatsApp", nav: "MD → WhatsApp", description: "Convert Markdown emphasis into WhatsApp formatting.", category: "converters", kind: "converter", engine: "md-to-whatsapp", priority: 0.7 },
  { slug: "markdown-to-telegram", title: "Markdown to Telegram", nav: "MD → Telegram", description: "Convert Markdown into Telegram-friendly formatting.", category: "converters", kind: "converter", engine: "md-to-telegram", priority: 0.7 },
  { slug: "remove-markdown", title: "Remove Markdown", nav: "Remove MD", description: "Strip Markdown syntax and leave plain text.", category: "converters", kind: "converter", engine: "strip-md", priority: 0.7 },
  { slug: "markdown-to-jira", title: "Markdown to Jira", nav: "MD → Jira", description: "Convert Markdown to Jira wiki markup.", category: "converters", kind: "converter", engine: "md-to-jira", priority: 0.7 },
  { slug: "jira-to-markdown", title: "Jira to Markdown", nav: "Jira → MD", description: "Convert Jira wiki markup into Markdown.", category: "converters", kind: "converter", engine: "jira-to-md", priority: 0.7 },
  { slug: "markdown-to-bbcode", title: "Markdown to BBCode", nav: "MD → BBCode", description: "Convert Markdown into BBCode for forums.", category: "converters", kind: "converter", engine: "md-to-bbcode", priority: 0.7 },
  { slug: "openapi-to-markdown", title: "OpenAPI to Markdown", nav: "OpenAPI → MD", description: "Turn an OpenAPI or Swagger JSON or YAML document into Markdown.", category: "converters", kind: "converter", engine: "openapi-to-md", priority: 0.9 },
  { slug: "docx-to-markdown", title: "DOCX to Markdown", nav: "DOCX to MD", description: "Convert a Word .docx file into Markdown in your browser.", category: "converters", kind: "converter", engine: "docx-to-md", priority: 0.7 },
  { slug: "markdown-to-docx", title: "Markdown to DOCX", nav: "MD to DOCX", description: "Download Markdown as a Word document.", category: "converters", kind: "converter", engine: "md-to-docx", priority: 0.7 },
  { slug: "chatgpt-to-word", title: "ChatGPT to Word", nav: "ChatGPT to Word", description: "Paste a ChatGPT conversation and download it as a Word document.", category: "converters", kind: "converter", engine: "md-to-docx", featured: true, priority: 0.9 },
  { slug: "chatgpt-to-pdf", title: "ChatGPT to PDF", nav: "ChatGPT to PDF", description: "Paste a ChatGPT conversation and export a print-ready PDF.", category: "converters", kind: "converter", engine: "md-to-pdf", featured: true, priority: 0.9 },
  { slug: "claude-to-pdf", title: "Claude to PDF", nav: "Claude to PDF", description: "Paste a Claude conversation and export it as a PDF.", category: "converters", kind: "converter", engine: "md-to-pdf", priority: 0.7 },
  { slug: "gemini-to-pdf", title: "Gemini to PDF", nav: "Gemini to PDF", description: "Paste a Gemini conversation and export it as a PDF.", category: "converters", kind: "converter", engine: "md-to-pdf", priority: 0.7 },
  { slug: "text-to-markdown", title: "Text to Markdown", nav: "Text → MD", description: "Paste plain text and get headings, lists, links, and paragraphs.", category: "converters", kind: "converter", engine: "text-to-md", priority: 0.7 },

  { slug: "table-generator", title: "Markdown Table Generator", nav: "Table Generator", description: "Visual table builder for Markdown, HTML, and LaTeX.", category: "generators", kind: "generator", engine: "table", featured: true, priority: 0.9 },
  { slug: "quote-generator", title: "Markdown Quote Generator", nav: "Quote Generator", description: "Generate blockquotes with attribution and nesting.", category: "generators", kind: "generator", engine: "quote", priority: 0.7 },
  { slug: "markdown-callouts", title: "Markdown Callout Generator", nav: "Callouts", description: "Build GitHub, GitLab, and Obsidian callouts with a live preview.", category: "generators", kind: "generator", engine: "callout", priority: 0.7 },
  { slug: "table-of-contents-generator", title: "Table of Contents Generator", nav: "TOC Generator", description: "Build a linked table of contents from Markdown headings.", category: "generators", kind: "generator", engine: "toc", priority: 0.7 },
  { slug: "readme-generator", title: "README Generator", nav: "README", description: "Generate a README from your project name, install command, and usage.", category: "generators", kind: "generator", engine: "readme", priority: 0.7 },
  { slug: "github-profile-readme", title: "GitHub Profile README", nav: "Profile README", description: "Generate a GitHub profile README with a bio, skills, and links.", category: "generators", kind: "generator", engine: "profile-readme", priority: 0.7 },
  { slug: "badge-generator", title: "Badge Generator", nav: "Badges", description: "Build shields.io badge Markdown for a README.", category: "generators", kind: "generator", engine: "badge", priority: 0.7 },
  { slug: "link-generator", title: "Markdown Link Generator", nav: "Link Generator", description: "Build inline Markdown links with optional titles.", category: "generators", kind: "generator", engine: "link", priority: 0.7 },
  { slug: "code-block-generator", title: "Code Block Generator", nav: "Code Block", description: "Wrap code in a fenced block with a language tag.", category: "generators", kind: "generator", engine: "code-block", priority: 0.7 },
  { slug: "discord-timestamp-generator", title: "Discord Timestamp Generator", nav: "Discord Timestamps", description: "Generate Discord <t:unix:style> timestamps in every format.", category: "generators", kind: "generator", engine: "discord-timestamp", priority: 0.7 },
  { slug: "discord-colored-text", title: "Discord Colored Text", nav: "Discord Colors", description: "Generate Discord ANSI colored text with the escape codes included.", category: "generators", kind: "generator", engine: "discord-color", priority: 0.7 },
  { slug: "checkbox-generator", title: "Checkbox Generator", nav: "Checkboxes", description: "Turn a list into a Markdown task list.", category: "generators", kind: "generator", engine: "checkbox", priority: 0.7 },
  { slug: "readme-templates", title: "README Templates", nav: "README Templates", description: "Copy a README template for an open-source project, library, or app.", category: "generators", kind: "generator", engine: "readme-templates", featured: true, priority: 0.9 },
  { slug: "changelog-generator", title: "Changelog Generator", nav: "Changelog", description: "Generate a Keep a Changelog entry from added, changed, and fixed notes.", category: "generators", kind: "generator", engine: "changelog", priority: 0.9 },
  { slug: "llms-txt-generator", title: "llms.txt Generator", nav: "llms.txt", description: "Generate an llms.txt file that points agents at your important pages.", category: "generators", kind: "generator", engine: "llms", priority: 0.9 },
  { slug: "quote-block-generator", title: "Quote Block Generator", nav: "Quote Blocks", description: "Generate a Markdown blockquote with an optional citation.", category: "generators", kind: "generator", engine: "quote-block", priority: 0.7 },
  { slug: "image-generator", title: "Markdown Image Generator", nav: "Image Syntax", description: "Build Markdown image syntax from alt text, URL, and title.", category: "generators", kind: "generator", engine: "image", priority: 0.7 },
  { slug: "github-markdown-image", title: "GitHub Markdown Image", nav: "GitHub Images", description: "Markdown and HTML image snippets that control width on GitHub.", category: "generators", kind: "generator", engine: "github-image", priority: 0.7 },
  { slug: "github-markdown-code-block", title: "GitHub Code Block", nav: "GitHub Code Blocks", description: "Fenced code blocks with a language and an optional filename comment.", category: "generators", kind: "generator", engine: "github-code", priority: 0.7 },
  { slug: "markdown-definition-list", title: "Definition List Generator", nav: "Definition List", description: "Generate definition lists as Markdown Extra, HTML, a bold list, or a table.", category: "generators", kind: "generator", engine: "definition-list", priority: 0.7 },
  { slug: "claude-md-generator", title: "CLAUDE.md Generator", nav: "CLAUDE.md", description: "Generate CLAUDE.md, AGENTS.md, and Cursor rules from one form.", category: "generators", kind: "generator", engine: "claude-md", priority: 0.7 },

  { slug: "table-merge-cells", title: "Markdown Table Merge Cells", nav: "Merge Cells", description: "Markdown tables cannot merge cells. Build an HTML table with colspan and rowspan instead.", category: "table-tools", kind: "generator", engine: "merge-cells", priority: 0.7 },
  { slug: "table-formatter", title: "Markdown Table Formatter", nav: "Table Formatter", description: "Align columns and pad a Markdown table so it is easy to read.", category: "table-tools", kind: "converter", engine: "table-format", featured: true, priority: 0.9 },
  { slug: "table-without-header", title: "Table Without Header", nav: "No Header Table", description: "GFM tables always have a header. Get an HTML table with no header row.", category: "table-tools", kind: "converter", engine: "table-no-header", priority: 0.7 },
  { slug: "table-alignment", title: "Markdown Table Alignment", nav: "Table Align", description: "Set left, center, or right alignment on each Markdown column.", category: "table-tools", kind: "converter", engine: "table-align", priority: 0.7 },
  { slug: "center-table", title: "Center a Markdown Table", nav: "Center Table", description: "Wrap a table so it sits in the center on GitHub and in HTML.", category: "table-tools", kind: "converter", engine: "table-center", priority: 0.7 },
  { slug: "html-table-to-markdown", title: "HTML Table to Markdown", nav: "HTML Table → MD", description: "Convert an HTML table into a GitHub-flavored Markdown table.", category: "table-tools", kind: "converter", engine: "html-table-to-md", featured: true, priority: 0.9 },
  { slug: "markdown-table-to-csv", title: "Markdown Table to CSV", nav: "MD Table → CSV", description: "Convert a Markdown table to CSV.", category: "table-tools", kind: "converter", engine: "md-table-to-csv", priority: 0.7 },
  { slug: "markdown-table-to-json", title: "Markdown Table to JSON", nav: "MD Table → JSON", description: "Convert a Markdown table to a JSON array of objects.", category: "table-tools", kind: "converter", engine: "md-table-to-json", priority: 0.7 },
  { slug: "markdown-table-to-excel", title: "Markdown Table to Excel", nav: "MD Table → Excel", description: "Download a Markdown table as an .xlsx file.", category: "table-tools", kind: "converter", engine: "md-table-to-excel", priority: 0.7 },
  { slug: "markdown-table-to-html", title: "Markdown Table to HTML", nav: "MD Table → HTML", description: "Convert a Markdown table to an HTML table.", category: "table-tools", kind: "converter", engine: "md-table-to-html", priority: 0.7 },
  { slug: "markdown-table-to-latex", title: "Markdown Table to LaTeX", nav: "MD Table → LaTeX", description: "Convert a Markdown table to a LaTeX tabular.", category: "table-tools", kind: "converter", engine: "md-table-to-latex", priority: 0.7 },

  { slug: "word-counter", title: "Word Counter", nav: "Word Counter", description: "Count words, characters, sentences, paragraphs, and reading time.", category: "text-tools", kind: "text", engine: "word-count", featured: true, priority: 0.9 },
  { slug: "text-compare", title: "Text Compare", nav: "Text Compare", description: "Diff two texts line by line.", category: "text-tools", kind: "text", engine: "text-diff", priority: 0.7 },
  { slug: "case-converter", title: "Case Converter", nav: "Case Converter", description: "Convert text to upper, lower, title, camel, snake, and kebab case.", category: "text-tools", kind: "text", engine: "case", priority: 0.7 },
  { slug: "snake-case-converter", title: "Snake Case Converter", nav: "Snake Case", description: "Convert text to snake_case.", category: "text-tools", kind: "text", engine: "snake", priority: 0.7 },
  { slug: "kebab-case-converter", title: "Kebab Case Converter", nav: "Kebab Case", description: "Convert text to kebab-case.", category: "text-tools", kind: "text", engine: "kebab", priority: 0.7 },
  { slug: "alternating-case-converter", title: "Alternating Case Converter", nav: "aLtErNaTiNg", description: "Convert text to aLtErNaTiNg case.", category: "text-tools", kind: "text", engine: "alternating", priority: 0.7 },
  { slug: "title-case-converter", title: "Title Case Converter", nav: "Title Case", description: "Convert text to Title Case, leaving small words lowercase.", category: "text-tools", kind: "text", engine: "title", priority: 0.7 },
  { slug: "character-counter", title: "Character Counter", nav: "Char Counter", description: "Count characters with and without spaces.", category: "text-tools", kind: "text", engine: "char-count", priority: 0.7 },
  { slug: "twitter-character-counter", title: "Twitter Character Counter", nav: "Twitter Counter", description: "Estimate the weighted length of a post against the 280-character limit.", category: "text-tools", kind: "text", engine: "twitter-count", priority: 0.7 },
  { slug: "chinese-character-counter", title: "Chinese Character Counter", nav: "CJK Counter", description: "Count Han, Hiragana, Katakana, and Hangul characters.", category: "text-tools", kind: "text", engine: "cjk-count", priority: 0.7 },
  { slug: "reading-time-calculator", title: "Reading Time Calculator", nav: "Reading Time", description: "Estimate reading time for English words and CJK characters.", category: "text-tools", kind: "text", engine: "reading-time", priority: 0.7 },
  { slug: "markdown-lint", title: "Markdown Lint", nav: "Markdown Lint", description: "Check Markdown for common structure problems before you publish.", category: "text-tools", kind: "text", engine: "lint", priority: 0.7 },
  { slug: "readme-auditor", title: "README Auditor", nav: "README Audit", description: "Score a README for the sections people look for first.", category: "text-tools", kind: "text", engine: "readme-audit", featured: true, priority: 0.9 },
  { slug: "markdown-link-checker", title: "Markdown Link Checker", nav: "Link Checker", description: "Find links in Markdown and check whether they respond.", category: "text-tools", kind: "text", engine: "link-check", featured: true, priority: 0.9 },
  { slug: "mdx-validator", title: "MDX Validator", nav: "MDX Validator", description: "Compile MDX and report the first syntax error.", category: "text-tools", kind: "text", engine: "mdx-validate", featured: true, priority: 0.9 },

  { slug: "markdown-formatter", title: "Markdown Formatter", nav: "Formatter", description: "Clean trailing space, blank lines, and heading spacing.", category: "editors", kind: "text", engine: "format", featured: true, priority: 0.9 },
  { slug: "editor", title: "Markdown Editor", nav: "Editor", description: "Write Markdown with a live preview, spell check, find and replace, and local documents.", category: "editors", kind: "editor", engine: "editor", featured: true, priority: 0.9 },
  { slug: "preview", title: "Markdown Viewer", nav: "Viewer", description: "Full Markdown preview with callouts, math, and Mermaid diagrams.", category: "editors", kind: "editor", engine: "preview", featured: true, priority: 0.9 },
  { slug: "folder-editor", title: "Folder Editor", nav: "Folder Editor", description: "Open several Markdown files, edit one at a time, and download them as a zip.", category: "editors", kind: "editor", engine: "folder", priority: 0.7 },
  { slug: "mermaid-editor", title: "Mermaid Editor", nav: "Mermaid Editor", description: "Edit a Mermaid diagram and preview it, then download the SVG.", category: "editors", kind: "editor", engine: "mermaid", featured: true, priority: 0.9 },
];

const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));

export function getTool(slug: string) {
  return bySlug.get(slug);
}

export function toolsIn(category: CategoryId) {
  return tools.filter((tool) => tool.category === category);
}

export function relatedTools(tool: Tool, count = 4) {
  return tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, count);
}

export function categoryLabel(category: CategoryId) {
  return categoryMeta[category].label;
}
