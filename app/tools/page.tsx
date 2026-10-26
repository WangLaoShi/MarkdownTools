import type { Metadata } from "next";
import { CategoryIntro, ToolBrowser } from "@/components/tools/tool-browser";

export const metadata: Metadata = {
  title: "All Markdown Tools",
  description: "A complete browser-based toolkit for writing, converting, formatting, and shipping Markdown.",
};

export default function ToolsPage() {
  return (
    <CategoryIntro title="All Markdown Tools" description="A complete browser-based toolkit for writing, converting, formatting, and shipping Markdown.">
      <ToolBrowser />
    </CategoryIntro>
  );
}
