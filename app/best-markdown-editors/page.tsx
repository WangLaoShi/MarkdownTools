import type { Metadata } from "next";
import { Article } from "@/components/content/article";
import { guides } from "@/lib/guides";

const guide = guides["best-markdown-editors"];
export const metadata: Metadata = { title: guide.title, description: guide.description };

export default function BestEditorsPage() {
  return <Article title={guide.title} markdown={guide.markdown} />;
}
