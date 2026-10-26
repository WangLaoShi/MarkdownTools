"use client";

import "highlight.js/styles/github.css";
import "katex/dist/katex.min.css";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { remarkCallouts } from "@/lib/markdown/callouts";
import { slugifyHeading } from "@/lib/markdown/html";

function textContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textContent((node as { props?: { children?: React.ReactNode } }).props?.children);
  }
  return "";
}

function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    const host = ref.current;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      const dark = document.documentElement.classList.contains("dark");
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: dark ? "dark" : "neutral" });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      try {
        const { svg } = await mermaid.render(id, chart);
        if (alive && host) host.innerHTML = svg;
      } catch (error) {
        if (alive && host) host.textContent = error instanceof Error ? error.message : "Could not render diagram";
      }
    })();
    return () => {
      alive = false;
    };
  }, [chart]);
  return <div ref={ref} className="overflow-x-auto" />;
}

function Heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = `h${level}` as const;
  return function HeadingTag({ children }: { children?: React.ReactNode }) {
    return <Tag id={slugifyHeading(textContent(children))}>{children}</Tag>;
  };
}

export function MarkdownPreview({
  markdown,
  className = "prose-md",
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h1: Heading(1),
          h2: Heading(2),
          h3: Heading(3),
          h4: Heading(4),
          h5: Heading(5),
          h6: Heading(6),
          code({ className: codeClass, children }) {
            const text = String(children).replace(/\n$/, "");
            const lang = /language-(\w+)/.exec(codeClass ?? "")?.[1];
            if (lang === "mermaid") return <Mermaid chart={text} />;
            return <code className={codeClass}>{children}</code>;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
