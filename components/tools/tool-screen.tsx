"use client";

import type { Tool } from "@/lib/catalog";
import { ConverterWorkbench } from "./converter-workbench";
import { EditorWorkbench } from "./editor-workbench";
import { GeneratorWorkbench } from "./generator-workbench";
import { PageFrame } from "./page-frame";
import { ReferenceView } from "./reference-view";
import { TextWorkbench } from "./text-workbench";

export function ToolScreen({ tool }: { tool: Tool }) {
  return (
    <PageFrame tool={tool}>
      {tool.kind === "reference" && <ReferenceView tool={tool} />}
      {tool.kind === "converter" && <ConverterWorkbench tool={tool} />}
      {tool.kind === "generator" && <GeneratorWorkbench tool={tool} />}
      {tool.kind === "text" && <TextWorkbench tool={tool} />}
      {tool.kind === "editor" && <EditorWorkbench tool={tool} />}
    </PageFrame>
  );
}
