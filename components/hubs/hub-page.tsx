import type { Metadata } from "next";
import { CategoryIntro, ToolBrowser } from "@/components/tools/tool-browser";
import { categoryMeta, type CategoryId } from "@/lib/site";

export function hubMetadata(category: CategoryId): Metadata {
  const meta = categoryMeta[category];
  return { title: meta.label, description: meta.blurb };
}

export function HubPage({ category }: { category: CategoryId }) {
  const meta = categoryMeta[category];
  return (
    <CategoryIntro title={meta.label} description={meta.blurb}>
      <ToolBrowser initial={category} />
    </CategoryIntro>
  );
}
