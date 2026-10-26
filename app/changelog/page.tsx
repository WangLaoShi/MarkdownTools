import type { Metadata } from "next";
import { Article } from "@/components/content/article";
import { guides } from "@/lib/guides";

export const metadata: Metadata = { title: guides.changelog.title, description: guides.changelog.description };

export default function ChangelogPage() {
  return <Article title={guides.changelog.title} markdown={guides.changelog.markdown} />;
}
