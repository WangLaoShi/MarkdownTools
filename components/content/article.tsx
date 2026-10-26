import { MarkdownPreview } from "@/components/markdown/preview";

export function Article({ title, markdown }: { title: string; markdown: string }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <MarkdownPreview markdown={markdown.startsWith(`# ${title}`) ? markdown : `# ${title}\n\n${markdown}`} />
    </article>
  );
}
