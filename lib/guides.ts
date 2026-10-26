export const guides = {
  about: {
    title: "About",
    description: "MarkdownTools is a free, browser-based toolkit for writing and converting Markdown.",
    markdown: `# About

MarkdownTools is a free toolkit for people who write in Markdown and need the file in another shape before the end of the day.

The editor, converters, generators, and cheat sheets run in your browser. You do not create an account to use them. A document you type or open stays on the device unless you download it or copy a local share link.

## What you can do

- Write with a live preview, spell check, and an outline
- Export Markdown to PDF and Word
- Convert HTML, DOCX, PDF text, CSV, Excel, and JSON
- Format tables and check a README
- Look up syntax for GitHub, Discord, Obsidian, Slack, and the rest

## Fileworks

MarkdownTools is part of the Fileworks family: free tools that run in your browser.

## This copy

Documents are stored in this browser with IndexedDB. Share links opened from the editor work on the same browser. There is no cloud account in this build.
`,
  },
  privacy: {
    title: "Privacy Policy",
    description: "How MarkdownTools handles text you type, files you open, and pages you visit.",
    markdown: `# Privacy Policy

Last updated: July 26, 2026

## Overview

MarkdownTools.io ("we", "our", or "us") is committed to protecting your privacy. This policy explains how information is handled when you use the site.

## Data processing

The tools process your content in your browser.

- Text you type is handled by JavaScript on your device
- Files you open are read locally
- We do not receive the body of a document you convert, edit, or preview

Two features do send a small request, and only when you use them:

- **URL to Markdown** sends the public address you typed so the server can fetch that page. The page HTML is converted and returned. Private networks are blocked.
- **Link checker** sends the URLs it found in your Markdown and reports status codes. It does not send the surrounding document.

## Documents on this device

The editor can save documents in IndexedDB. That copy never leaves the browser unless you download it or copy a share link. A share link only resolves on the browser that created it. Clearing site data deletes the documents.

## Analytics

This build does not include a third-party analytics script. Your host may still record ordinary server logs for pages and for the two proxies above. Those logs should not contain document text.

## Contact

Questions about this policy can be sent through the site you deployed this build on.
`,
  },
  changelog: {
    title: "Changelog",
    description: "New tools, features, and improvements on MarkdownTools.",
    markdown: `# Changelog

New tools, features, and improvements on MarkdownTools — updated as we ship.

## September 2026

- Text to Markdown, with switches for headings, lists, and links
- Definition lists in four formats
- CLAUDE.md generator with project presets
- Reddit, Obsidian callout, and Discord references
- Table generator with keyboard movement, undo, transpose, sort, and dedupe
- PDF to Markdown extracts the text layer in the browser
- Local documents, with templates in the workspace

## July 2026

- Markdown to PDF preview with page size, margin, and theme
- Downloadable PDF cheat sheets
- Discord timestamp and ANSI color generators
- ChatGPT to Word and DOCX to Markdown
- Flavor comparison across GitHub, Obsidian, Jupyter, Discord, and Slack

## June 2026

- MDX validator, llms.txt generator, OpenAPI to Markdown, and README auditor
- Emoji cheat sheet and Markdown hacks guide
- Table conversions to CSV, JSON, Excel, HTML, and LaTeX
- Jira and BBCode converters, plus a Markdown linter
- Slack, Telegram, and WhatsApp converters
- Editor outline, find and replace, local share links, and HTML export
- Command palette and searchable tools directory
- Syntax guides for individual Markdown elements
`,
  },
  "best-markdown-editors": {
    title: "Best Markdown Editors",
    description: "How to pick a Markdown editor, and where a browser tool is enough.",
    markdown: `# Best Markdown Editors

The useful split is simple: an editor you live in, and a converter you open when the file has to leave as PDF, Word, or HTML.

## Write in the browser

The [MarkdownTools editor](/editor) is the right first stop when you want a preview, spell check, and a download without installing anything. Pair it with the [viewer](/preview) when you only need to read.

## Editors people keep open

| Editor | Best for | Watch-out |
| --- | --- | --- |
| Visual Studio Code | Repos, with extensions for preview and lint | Setup is the product |
| Obsidian | Linked notes, callouts, wikilinks | The vault is a folder you have to own |
| Typora | A page that looks finished while you type | Paid, and less scriptable |
| iA Writer | Focused prose | Fewer conversion options |
| Zed / Neovim | People who already live in a terminal | You build the preview yourself |

## When not to switch editors

If the writing already lives in Notion, Google Docs, or Word, convert the export instead of retyping it. Start with [HTML to Markdown](/html-to-markdown), [DOCX to Markdown](/docx-to-markdown), or [rich text to Markdown](/rich-text-to-markdown).

## A short way to choose

Use a desktop editor when the files belong to a repo. Use a notes app when the links between notes are the point. Use the browser tools on this site when you need a conversion or a one-off document and you do not want an account.
`,
  },
  "how-to-convert-markdown-to-pdf": {
    title: "How to Convert Markdown to PDF",
    description: "Four ways to turn Markdown into a PDF, and when each one is worth the setup.",
    markdown: `# How to Convert Markdown to PDF

**Short answer:** paste the Markdown into the [Markdown to PDF converter](/markdown-to-pdf), pick a page size and theme, then save the PDF from the print dialog. The preview is rendered in your browser.

## 1. Free online converter

Use it for a document you need now. You can set A4, Letter, or Legal, change the margin, and switch a light, dark, or GitHub-like theme. Nothing is uploaded.

**Best for:** one document, consistent themed output.

## 2. Print the preview

Open the [viewer](/preview) and print to PDF with Ctrl/Cmd+P. Same idea, fewer options.

**Best for:** a quick export with no extra controls.

## 3. Pandoc

\`\`\`bash
pandoc input.md -o output.pdf
\`\`\`

Pandoc is the standard for a repeatable pipeline: release notes, reports, documentation in CI.

**Best for:** the same conversion every time, under version control.

## 4. The app you already write in

Obsidian, Typora, and many IDEs export PDF. The result follows that app's theme.

**Best for:** notes that already live in one app.

## Which method should you pick?

For a document you need right now, the online converter wins. For a publishing workflow, invest the setup in Pandoc. Before you export, run the [Markdown linter](/markdown-lint) so a broken table does not show up for the first time on paper.

## FAQ

**What is the easiest way?** Paste into a browser converter and save the PDF. A good one never uploads the file.

**Do code blocks and tables survive?** Yes. Math and Mermaid depend on the converter. This site's preview renders both; the direct text PDF keeps the words and drops the diagram drawing.

**Can I automate it?** Yes. Pandoc, or a Node tool such as md-to-pdf, fits a Makefile or CI job.
`,
  },
  "how-to-convert-pdf-to-markdown": {
    title: "How to Convert PDF to Markdown",
    description: "Four ways to get editable Markdown out of a PDF.",
    markdown: `# How to Convert PDF to Markdown

**Short answer:** open the [PDF to Markdown converter](/pdf-to-markdown) and drop the file in. Text is extracted in your browser. Pages that are only a scan, with no text layer, come back empty.

## 1. Free online converter

Best for a single confidential file. Headings are guessed from font size. You still want to skim the result: PDF is a print format, and columns come out in reading order only when the extractor gets lucky.

## 2. Microsoft MarkItDown

\`\`\`bash
pip install markitdown
markitdown document.pdf > document.md
\`\`\`

Useful when the conversion is one step in a pipeline that feeds a model.

## 3. Python libraries

\`pymupdf4llm\` and similar libraries give you more control over tables and page breaks, and more code to own.

## 4. Copy, paste, and clean up

For a short PDF, copy the text into the [editor](/editor) and put the headings back by hand.

## FAQ

**Can I convert a scanned PDF?** Only with OCR. This converter reads the text layer and tells you when a page has none.

**Why Markdown for AI tools?** Headings and lists chunk more cleanly than a raw text dump, and they cost fewer tokens than a PDF.

**Do tables and images survive?** Simple text usually does. Images are not embedded; you extract them separately and point at them with image syntax.
`,
  },
} as const;

export type GuideSlug = keyof typeof guides;
