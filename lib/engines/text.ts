import { diffLines } from "diff";
import { formatMarkdown } from "./flavors";

export interface LintIssue {
  line: number;
  rule: string;
  message: string;
}

const smallWords = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in", "with"]);

export function toSnake(value: string) {
  return splitWords(value).join("_").toLowerCase();
}

export function toKebab(value: string) {
  return splitWords(value).join("-").toLowerCase();
}

export function toCamel(value: string) {
  const words = splitWords(value);
  return words.map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word))).join("");
}

export function toTitle(value: string) {
  return value
    .split(/(\s+)/)
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (!part.trim()) return part;
      if (index > 0 && smallWords.has(lower)) return lower;
      return capitalize(lower);
    })
    .join("");
}

export function toAlternating(value: string) {
  let upper = false;
  return Array.from(value)
    .map((char) => {
      if (!/\p{L}/u.test(char)) return char;
      upper = !upper;
      return upper ? char.toUpperCase() : char.toLowerCase();
    })
    .join("");
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;
}

function splitWords(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

export function caseBundle(value: string) {
  return {
    upper: value.toUpperCase(),
    lower: value.toLowerCase(),
    title: toTitle(value),
    camel: toCamel(value),
    snake: toSnake(value),
    kebab: toKebab(value),
    alternating: toAlternating(value),
  };
}

export function wordStats(value: string) {
  const characters = Array.from(value).length;
  const charactersNoSpaces = Array.from(value.replace(/\s/g, "")).length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const sentences = value.trim() ? value.split(/[.!?]+/).filter((part) => part.trim()).length : 0;
  const paragraphs = value.trim() ? value.split(/\n{2,}/).filter((part) => part.trim()).length : 0;
  const lines = value ? value.split("\n").length : 0;
  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines };
}

export function twitterLength(value: string) {
  const urls: string[] = [];
  const stripped = value.replace(/https?:\/\/\S+/g, (url) => {
    urls.push(url);
    return "";
  });
  let weight = urls.length * 23;
  for (const char of Array.from(stripped)) {
    const code = char.codePointAt(0) ?? 0;
    weight += code > 0xffff || /\p{Extended_Pictographic}/u.test(char) ? 2 : 1;
  }
  return { weight, limit: 280, remaining: 280 - weight };
}

export function cjkStats(value: string) {
  const count = (pattern: RegExp) => Array.from(value).filter((char) => pattern.test(char)).length;
  return {
    han: count(/\p{Script=Han}/u),
    hiragana: count(/\p{Script=Hiragana}/u),
    katakana: count(/\p{Script=Katakana}/u),
    hangul: count(/\p{Script=Hangul}/u),
    total: Array.from(value).length,
  };
}

export function readingTime(value: string) {
  const words = wordStats(value).words;
  const cjk = cjkStats(value).han + cjkStats(value).hiragana + cjkStats(value).katakana + cjkStats(value).hangul;
  const minutes = words / 200 + cjk / 400;
  return { minutes: Math.max(1, Math.round(minutes || 0)), words, cjk };
}

export function compareText(left: string, right: string) {
  return diffLines(left, right);
}

export function lintMarkdown(markdown: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = markdown.split("\n");
  let blanks = 0;
  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (/[ \t]+$/.test(line)) issues.push({ line: lineNo, rule: "MD009", message: "Trailing space." });
    if (line.includes("\t")) issues.push({ line: lineNo, rule: "MD010", message: "Hard tab. Prefer spaces." });
    if (!line.trim()) blanks += 1;
    else blanks = 0;
    if (blanks > 2) issues.push({ line: lineNo, rule: "MD012", message: "More than one blank line in a row." });
    if (/^#{1,6}[^ #\n]/.test(line)) issues.push({ line: lineNo, rule: "MD018", message: "No space after the heading marker." });
    if (/^```\s*$/.test(line)) issues.push({ line: lineNo, rule: "MD040", message: "Fenced code block has no language." });
  });
  if (markdown.length > 0 && !markdown.endsWith("\n")) issues.push({ line: lines.length, rule: "MD047", message: "File should end with a single newline." });
  const formatted = formatMarkdown(markdown);
  if (formatted !== (markdown.endsWith("\n") ? markdown : `${markdown}\n`) && issues.length === 0) {
    issues.push({ line: 1, rule: "format", message: "Spacing can be cleaned up by the formatter." });
  }
  return issues;
}

export function auditReadme(markdown: string) {
  const checks = [
    { id: "title", label: "Has a top-level title", ok: /^#\s+\S/m.test(markdown) },
    { id: "description", label: "Has a short description", ok: markdown.split("\n").filter((line) => line.trim() && !line.startsWith("#")).length > 0 },
    { id: "install", label: "Explains installation", ok: /install/i.test(markdown) },
    { id: "usage", label: "Shows usage", ok: /usage|getting started|example/i.test(markdown) },
    { id: "license", label: "Mentions a license", ok: /license/i.test(markdown) },
    { id: "badge", label: "Includes a badge or status image", ok: /!\[[^\]]*]\([^)]+\)/.test(markdown) },
    { id: "contributing", label: "Mentions contributing or the community", ok: /contribut/i.test(markdown) },
  ];
  const score = Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
  return { checks, score };
}

export function extractLinks(markdown: string) {
  const found = new Set<string>();
  for (const match of markdown.matchAll(/\[[^\]]*]\((https?:\/\/[^)\s]+)\)/g)) found.add(match[1]);
  for (const match of markdown.matchAll(/https?:\/\/[^\s)<]+/g)) found.add(match[0]);
  return Array.from(found).slice(0, 20);
}
