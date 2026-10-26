import type { Metadata } from "next";
import { Article } from "@/components/content/article";
import { guides } from "@/lib/guides";

export const metadata: Metadata = { title: guides.privacy.title, description: guides.privacy.description };

export default function PrivacyPage() {
  return <Article title={guides.privacy.title} markdown={guides.privacy.markdown} />;
}
