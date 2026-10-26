import type { MetadataRoute } from "next";
import { tools } from "@/lib/catalog";
import { syntaxPages } from "@/lib/syntax";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/tools",
    "/cheat-sheets",
    "/converters",
    "/generators",
    "/table-tools",
    "/text-tools",
    "/editors",
    "/about",
    "/privacy",
    "/changelog",
    "/best-markdown-editors",
    "/markdown-api",
    "/how-to-convert-markdown-to-pdf",
    "/how-to-convert-pdf-to-markdown",
    "/syntax",
    "/pdf/markdown-cheat-sheet.pdf",
    "/pdf/github-markdown-cheat-sheet.pdf",
    "/pdf/jupyter-notebook-markdown-cheat-sheet.pdf",
    "/pdf/obsidian-markdown-cheat-sheet.pdf",
    "/pdf/r-markdown-cheat-sheet.pdf",
    "/pdf/markdown-flavor-compatibility.pdf",
    "/downloads/markdown-flavor-compatibility.md",
    "/downloads/obsidian-markdown-cheat-sheet.md",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    })),
    ...tools.map((tool) => ({
      url: `${site.url}/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: tool.priority ?? 0.7,
    })),
    ...syntaxPages.map((page) => ({
      url: `${site.url}/syntax/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
