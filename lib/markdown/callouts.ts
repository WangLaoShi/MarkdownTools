import type { Paragraph, Root, Text } from "mdast";
import { visit } from "unist-util-visit";

const marker =
  /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|SUCCESS|QUESTION|FAILURE|DANGER|BUG|EXAMPLE|QUOTE|ABSTRACT|TODO)\]([+-])?\s*(.*)$/i;

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node) => {
      const paragraph = node.children[0];
      if (!paragraph || paragraph.type !== "paragraph") return;
      const textNode = paragraph.children.find((child): child is Text => child.type === "text");
      if (!textNode) return;
      const match = marker.exec(textNode.value.trim());
      if (!match) return;
      const kind = match[1].toLowerCase();
      const title = match[3]?.trim() ?? "";
      const label = kind.charAt(0).toUpperCase() + kind.slice(1);
      textNode.value = title ? `${label}: ${title}` : label;
      const strong = {
        type: "strong" as const,
        children: [{ type: "text" as const, value: textNode.value }],
      };
      const rest = paragraph.children.slice(paragraph.children.indexOf(textNode) + 1);
      (paragraph as Paragraph).children = [strong, ...rest];
      node.data = {
        hName: "div",
        hProperties: {
          className: ["callout", `callout-${kind}`],
        },
      };
    });
  };
}
