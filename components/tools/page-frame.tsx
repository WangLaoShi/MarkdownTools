import Link from "next/link";
import { categoryLabel, relatedTools, type Tool } from "@/lib/catalog";
import { categoryMeta } from "@/lib/site";

export function PageFrame({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  const related = relatedTools(tool);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-muted">
        <Link href={categoryMeta[tool.category].href} className="hover:text-foreground">
          {categoryLabel(tool.category)}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{tool.title}</h1>
      <p className="mt-3 max-w-3xl text-muted">{tool.description}</p>
      <div className="mt-8">{children}</div>
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-medium">Related tools</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/${item.slug}`} className="block rounded-xl border border-border px-4 py-3 hover:border-foreground/20">
                  <span className="block text-sm font-medium">{item.title}</span>
                  <span className="text-sm text-muted">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
