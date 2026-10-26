import Link from "next/link";
import { toolsIn } from "@/lib/catalog";

function Column({ title, href, links }: { title: string; href: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <Link href={href} className="text-sm font-medium">
        {title}
      </Link>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-6">
        <Column
          title="Converters"
          href="/converters"
          links={toolsIn("converters").slice(0, 6).map((tool) => ({ href: `/${tool.slug}`, label: tool.nav }))}
        />
        <Column
          title="Generators"
          href="/generators"
          links={toolsIn("generators").slice(0, 6).map((tool) => ({ href: `/${tool.slug}`, label: tool.nav }))}
        />
        <Column
          title="Text Tools"
          href="/text-tools"
          links={toolsIn("text-tools").slice(0, 6).map((tool) => ({ href: `/${tool.slug}`, label: tool.nav }))}
        />
        <Column
          title="Editor"
          href="/editors"
          links={[
            { href: "/editor", label: "Editor" },
            { href: "/preview", label: "Viewer" },
            { href: "/folder-editor", label: "Folder Editor" },
            { href: "/mermaid-editor", label: "Mermaid Editor" },
            { href: "/markdown-formatter", label: "Formatter" },
          ]}
        />
        <Column
          title="Syntax Guide"
          href="/syntax"
          links={[
            { href: "/syntax/bold", label: "Bold" },
            { href: "/syntax/headings", label: "Headings" },
            { href: "/syntax/links", label: "Links" },
            { href: "/syntax/tables", label: "Tables" },
            { href: "/syntax/code-blocks", label: "Code Blocks" },
            { href: "/syntax", label: "All syntax →" },
          ]}
        />
        <div>
          <p className="text-sm font-medium">Related Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/tools" className="hover:text-foreground">All Markdown Tools</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Part of the Fileworks family — free tools that run in your browser.</p>
          <p>© {new Date().getFullYear()} MarkdownTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
