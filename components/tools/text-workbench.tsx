"use client";

import { useEffect, useMemo, useState } from "react";
import type { Tool } from "@/lib/catalog";
import { convertText, sampleFor } from "@/lib/engines/convert";
import { auditReadme, caseBundle, cjkStats, compareText, extractLinks, lintMarkdown, readingTime, toAlternating, toKebab, toSnake, toTitle, twitterLength, wordStats } from "@/lib/engines/text";
import { rememberTool } from "@/lib/recent";
import { CopyButton, areaClass } from "./copy-button";

export function TextWorkbench({ tool }: { tool: Tool }) {
  const [input, setInput] = useState(() => sampleFor(tool.engine, tool.slug));
  const [other, setOther] = useState("Markdown keeps the words after an edit.");
  const [output, setOutput] = useState("");
  const [links, setLinks] = useState<{ url: string; ok: boolean; status: number }[]>([]);
  const [mdx, setMdx] = useState("");
  useEffect(() => {
    rememberTool(tool.slug);
  }, [tool.slug]);

  useEffect(() => {
    if (tool.engine !== "format") return;
    convertText("format", input).then(setOutput);
  }, [input, tool.engine]);

  const stats = useMemo(() => wordStats(input), [input]);

  function checkLinks() {
    setLinks(extractLinks(input).map((url) => ({ url, ok: false, status: 0 })));
  }

  async function validateMdx() {
    try {
      const { compile } = await import("@mdx-js/mdx");
      await compile(input.slice(0, 200_000), { development: false });
      setMdx("MDX compiled.");
    } catch (error) {
      setMdx(error instanceof Error ? error.message : "MDX failed to compile.");
    }
  }

  return (
    <div className="space-y-4">
      {tool.engine === "text-diff" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea className={areaClass} value={input} onChange={(event) => setInput(event.target.value)} aria-label="Original text" />
          <textarea className={areaClass} value={other} onChange={(event) => setOther(event.target.value)} aria-label="Changed text" />
        </div>
      ) : (
        <textarea className={areaClass} value={input} onChange={(event) => setInput(event.target.value)} spellCheck aria-label="Text" />
      )}
      {tool.engine === "word-count" && <StatGrid items={[["Words", stats.words], ["Characters", stats.characters], ["No spaces", stats.charactersNoSpaces], ["Sentences", stats.sentences], ["Paragraphs", stats.paragraphs], ["Lines", stats.lines]]} />}
      {tool.engine === "char-count" && <StatGrid items={[["Characters", stats.characters], ["Without spaces", stats.charactersNoSpaces]]} />}
      {tool.engine === "twitter-count" && <TwitterPanel text={input} />}
      {tool.engine === "cjk-count" && <CjkPanel text={input} />}
      {tool.engine === "reading-time" && <ReadingPanel text={input} />}
      {tool.engine === "case" && <CaseList text={input} />}
      {tool.engine === "snake" && <Single label="snake_case" value={toSnake(input)} />}
      {tool.engine === "kebab" && <Single label="kebab-case" value={toKebab(input)} />}
      {tool.engine === "alternating" && <Single label="Alternating" value={toAlternating(input)} />}
      {tool.engine === "title" && <Single label="Title Case" value={toTitle(input)} />}
      {tool.engine === "text-diff" && (
        <pre className="overflow-auto rounded-2xl border border-border p-4 font-mono text-sm">
          {compareText(input, other).map((part, index) => (
            <div key={index} className={part.added ? "bg-emerald-500/15" : part.removed ? "bg-red-500/15" : ""}>
              {part.added ? "+ " : part.removed ? "- " : "  "}
              {part.value}
            </div>
          ))}
        </pre>
      )}
      {tool.engine === "format" && (
        <div>
          <CopyButton text={output} />
          <textarea readOnly className={`${areaClass} mt-3`} value={output} />
        </div>
      )}
      {tool.engine === "lint" && <LintList text={input} />}
      {tool.engine === "readme-audit" && <Audit text={input} />}
      {tool.engine === "link-check" && (
        <div>
          <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={checkLinks}>Find links</button>
          <p className="mt-3 text-sm text-muted">Links are listed here. This static site does not open them, so it cannot report whether each one responds.</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.url} className="rounded-lg border border-border px-3 py-2">{link.url}</li>
            ))}
          </ul>
        </div>
      )}
      {tool.engine === "mdx-validate" && (
        <div>
          <button type="button" className="rounded-lg bg-accent px-3 py-1.5 text-sm text-accent-foreground" onClick={validateMdx}>Validate MDX</button>
          {mdx && <p className="mt-3 text-sm">{mdx}</p>}
        </div>
      )}
    </div>
  );
}

function StatGrid({ items }: { items: [string, number][] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-border p-4">
          <dt className="text-sm text-muted">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TwitterPanel({ text }: { text: string }) {
  const result = twitterLength(text);
  return <StatGrid items={[["Weighted length", result.weight], ["Remaining", result.remaining], ["Limit", result.limit]]} />;
}

function CjkPanel({ text }: { text: string }) {
  const result = cjkStats(text);
  return <StatGrid items={[["Han", result.han], ["Hiragana", result.hiragana], ["Katakana", result.katakana], ["Hangul", result.hangul], ["All characters", result.total]]} />;
}

function ReadingPanel({ text }: { text: string }) {
  const result = readingTime(text);
  return <StatGrid items={[["Minutes", result.minutes], ["Words", result.words], ["CJK characters", result.cjk]]} />;
}

function CaseList({ text }: { text: string }) {
  const cases = caseBundle(text);
  return (
    <div className="space-y-2">
      {Object.entries(cases).map(([name, value]) => (
        <div key={name} className="flex items-start justify-between gap-3 rounded-xl border border-border px-3 py-2">
          <div>
            <p className="text-xs uppercase text-muted">{name}</p>
            <p className="font-mono text-sm">{value}</p>
          </div>
          <CopyButton text={value} />
        </div>
      ))}
    </div>
  );
}

function Single({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-mono">{value}</p>
      <div className="mt-3"><CopyButton text={value} /></div>
    </div>
  );
}

function LintList({ text }: { text: string }) {
  const issues = lintMarkdown(text);
  if (issues.length === 0) return <p className="text-sm">No lint issues found.</p>;
  return (
    <ul className="space-y-2 text-sm">
      {issues.map((issue, index) => (
        <li key={`${issue.rule}-${index}`} className="rounded-xl border border-border px-3 py-2">
          Line {issue.line} · {issue.rule} · {issue.message}
        </li>
      ))}
    </ul>
  );
}

function Audit({ text }: { text: string }) {
  const result = auditReadme(text);
  return (
    <div>
      <p className="text-3xl font-semibold">{result.score}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {result.checks.map((check) => (
          <li key={check.id} className="rounded-xl border border-border px-3 py-2">
            {check.ok ? "Pass" : "Missing"} · {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
