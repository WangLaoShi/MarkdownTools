import type { Metadata } from "next";
import { Article } from "@/components/content/article";
import { guides } from "@/lib/guides";

export const metadata: Metadata = { title: guides.about.title, description: guides.about.description };

export default function AboutPage() {
  return <Article title={guides.about.title} markdown={guides.about.markdown} />;
}
