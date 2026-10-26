export interface Example {
  title: string;
  syntax: string;
  note?: string;
}

export interface ReferenceDoc {
  intro: string;
  sections: { title: string; examples: Example[] }[];
  download?: { href: string; label: string };
}

const markdown: ReferenceDoc = {
  intro: "Forty-plus elements, each with the syntax beside its rendered output. GitHub Flavored Markdown is the default. Platform differences are called out where they matter.",
  download: { href: "/pdf/markdown-cheat-sheet.pdf", label: "Download PDF" },
  sections: [
    {
      title: "Headings and text",
      examples: [
        { title: "Headings", syntax: "# Heading 1\n## Heading 2\n### Heading 3" },
        { title: "Emphasis", syntax: "This is **bold**, *italic*, and ***both***.\nYou can also use __bold__ and _italic_." },
        { title: "Strikethrough", syntax: "This was ~~removed~~ and this stayed." },
        { title: "Highlight", syntax: "Use ==highlight== where the renderer supports it, or <mark>HTML</mark>." },
      ],
    },
    {
      title: "Links, images, and code",
      examples: [
        { title: "Links", syntax: "[MarkdownTools](https://www.markdowntools.io \"Home\")\n<https://www.markdowntools.io>" },
        { title: "Images", syntax: "![Alt text](https://example.com/diagram.png)" },
        { title: "Inline code", syntax: "Run `npm run dev` from the project root." },
        { title: "Code block", syntax: "```ts\nexport const answer = 42;\n```" },
      ],
    },
    {
      title: "Structure",
      examples: [
        { title: "Lists", syntax: "- Item\n- Nested\n  - Child\n\n1. First\n2. Second" },
        { title: "Task list", syntax: "- [x] Write\n- [ ] Review" },
        { title: "Blockquote", syntax: "> A sentence worth keeping.\n>\n> — Source" },
        { title: "Callout", syntax: "> [!NOTE]\n> This stays in the browser." },
        { title: "Table", syntax: "| Tool | Runs locally |\n| --- | --- |\n| Editor | Yes |\n| PDF | Yes |" },
        { title: "Horizontal rule", syntax: "Above\n\n---\n\nBelow" },
      ],
    },
    {
      title: "Extras",
      examples: [
        { title: "Footnote", syntax: "A claim that needs a source.[^1]\n\n[^1]: The source goes here." },
        { title: "Math", syntax: "Inline $E = mc^2$ and a block:\n\n$$\na^2 + b^2 = c^2\n$$" },
        { title: "Mermaid", syntax: "```mermaid\nflowchart LR\n  A[Write] --> B[Preview]\n```" },
        { title: "Escape", syntax: "Use \\*asterisks\\* when you want the characters, not emphasis." },
        { title: "Line break", syntax: "End a line with two spaces  \nto force a break." },
        { title: "Comment", syntax: "Visible text.\n\n<!-- This comment is hidden in HTML renderers. -->" },
      ],
    },
  ],
};

function doc(intro: string, sections: ReferenceDoc["sections"], download?: ReferenceDoc["download"]): ReferenceDoc {
  return { intro, sections, download };
}

export const references: Record<string, ReferenceDoc> = {
  markdown,
  discord: doc("Discord renders a subset of Markdown inside messages. Headings are limited, and spoilers use double pipes.", [
    { title: "Emphasis", examples: [
      { title: "Bold, italic, underline", syntax: "**bold**\n*italic*\n__underline__\n~~strike~~" },
      { title: "Spoiler", syntax: "The ending is ||a spoiler||." },
      { title: "Inline code", syntax: "Use `backticks` for a short command." },
    ]},
    { title: "Blocks", examples: [
      { title: "Code block", syntax: "```js\nconsole.log('hello')\n```" },
      { title: "Quote", syntax: "> quoted message" },
      { title: "Subtext", syntax: "-# this is subtext" },
    ]},
  ]),
  "r-markdown": doc("R Markdown mixes prose, fenced chunks, and chunk options. The chunk is the unit of execution.", [
    { title: "Chunks", examples: [
      { title: "R chunk", syntax: "```{r}\nsummary(cars)\n```" },
      { title: "Hide code, show plot", syntax: "```{r, echo=FALSE}\nplot(pressure)\n```" },
      { title: "Inline", syntax: "The mean is `r mean(cars$speed)`." },
    ]},
  ], { href: "/pdf/r-markdown-cheat-sheet.pdf", label: "Download PDF" }),
  obsidian: doc("Obsidian adds wikilinks, embeds, and callouts on top of Markdown.", [
    { title: "Notes", examples: [
      { title: "Wikilink", syntax: "[[Project brief]]\n[[Project brief#Decision]]\n[[Project brief|the brief]]" },
      { title: "Embed", syntax: "![[diagram.png]]\n![[Meeting notes#Decision]]" },
      { title: "Callout", syntax: "> [!tip] Ship it\n> Keep the note short." },
      { title: "Task", syntax: "- [ ] Draft\n- [x] Review" },
    ]},
  ], { href: "/pdf/obsidian-markdown-cheat-sheet.pdf", label: "Download PDF" }),
  "obsidian-callouts": doc("Obsidian ships thirteen callout types. Fold them with + or - after the type.", [
    { title: "Types", examples: ["note", "tip", "info", "todo", "warning", "caution", "important", "success", "question", "failure", "danger", "bug", "example", "quote"].map((kind) => ({
      title: kind,
      syntax: `> [!${kind}] ${kind}\n> One sentence is enough.`,
    })) },
  ]),
  "obsidian-wikilinks": doc("Wikilinks resolve note titles. Add a heading, a block id, or an alias when the title is not the words you want in the sentence.", [
    { title: "Links", examples: [
      { title: "Note", syntax: "[[Weekly review]]" },
      { title: "Heading", syntax: "[[Weekly review#Decisions]]" },
      { title: "Block", syntax: "[[Weekly review#^decision]]" },
      { title: "Alias", syntax: "[[Weekly review|last week's review]]" },
      { title: "Embed", syntax: "![[Weekly review#Decisions]]" },
    ]},
  ]),
  reddit: doc("Reddit uses a Markdown dialect. Spoilers and superscripts are the pieces people miss.", [
    { title: "Formatting", examples: [
      { title: "Emphasis", syntax: "**bold** and *italic*" },
      { title: "Spoiler", syntax: "The twist is >!hidden!<." },
      { title: "Superscript", syntax: "E = mc^2^" },
      { title: "Quote", syntax: "> previous comment" },
    ]},
  ]),
  gitlab: doc("GitLab Flavored Markdown adds task lists, math, and Mermaid to CommonMark.", [
    { title: "GitLab", examples: [
      { title: "Task list", syntax: "- [x] Open the issue\n- [ ] Ship the patch" },
      { title: "Math", syntax: "$$\nx = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n$$" },
      { title: "Mermaid", syntax: "```mermaid\nsequenceDiagram\n  Alice->>Bob: Hello\n```" },
    ]},
  ]),
  slack: doc("Slack uses mrkdwn, not CommonMark. Bold is a single asterisk.", [
    { title: "mrkdwn", examples: [
      { title: "Emphasis", syntax: "*bold*\n_italic_\n~strike~" },
      { title: "Link", syntax: "<https://www.markdowntools.io|MarkdownTools>" },
      { title: "Quote", syntax: "> one line" },
      { title: "Code", syntax: "`inline` and a block:\n```\nline\n```" },
    ]},
  ]),
  jupyter: doc("Notebook Markdown cells render CommonMark plus MathJax and raw HTML.", [
    { title: "Cells", examples: [
      { title: "Math", syntax: "Inline $y = mx + b$." },
      { title: "Image", syntax: "![plot](attachment:plot.png)" },
      { title: "Table", syntax: "| x | y |\n| --- | --- |\n| 1 | 2 |" },
    ]},
  ], { href: "/pdf/jupyter-notebook-markdown-cheat-sheet.pdf", label: "Download PDF" }),
  github: doc("GitHub Flavored Markdown adds tables, task lists, strikethrough, autolinks, and alerts.", [
    { title: "GFM", examples: [
      { title: "Alert", syntax: "> [!WARNING]\n> This force-pushes the branch." },
      { title: "Autolink", syntax: "https://github.com/github/docs\nFix #128" },
      { title: "Task list", syntax: "- [x] Tests\n- [ ] Docs" },
    ]},
  ], { href: "/pdf/github-markdown-cheat-sheet.pdf", label: "Download PDF" }),
  emoji: doc("Shortcodes are a convenience. The character is what every renderer understands.", [
    { title: "Common", examples: [
      ["smile", "😄"], ["tada", "🎉"], ["rocket", "🚀"], ["warning", "⚠️"], ["white_check_mark", "✅"], ["x", "❌"], ["books", "📚"], ["memo", "📝"],
    ].map(([name, emoji]) => ({ title: name, syntax: `:${name}:  →  ${emoji}`, note: emoji })) },
  ]),
  "discord-code": doc("Discord code blocks start with three backticks. A language hint colors the block in the client.", [
    { title: "Code", examples: [
      { title: "Inline", syntax: "Run `npm test`." },
      { title: "Block", syntax: "```\nplain block\n```" },
      { title: "Language", syntax: "```py\nprint('ok')\n```" },
    ]},
  ]),
  "discord-formatting": doc("Discord bold and italic follow Markdown. Underline uses double underscores, which many Markdown flavors treat as bold.", [
    { title: "Text", examples: [
      { title: "Bold", syntax: "**bold**" },
      { title: "Italic", syntax: "*italic* or _italic_" },
      { title: "Underline", syntax: "__underline__" },
      { title: "Heading", syntax: "# Big\n## Medium\n### Small" },
    ]},
  ]),
  "discord-spoiler": doc("Spoilers hide text until the reader clicks. They do not nest cleanly inside other formatting.", [
    { title: "Spoilers", examples: [
      { title: "Inline", syntax: "The answer is ||42||." },
      { title: "Block", syntax: "||\nA longer reveal\nacross lines\n||" },
    ]},
  ]),
};

export function getReference(engine: string) {
  return references[engine];
}
