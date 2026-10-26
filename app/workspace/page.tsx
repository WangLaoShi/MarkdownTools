import type { Metadata } from "next";
import { DocumentsApp } from "@/components/workspace/documents";

export const metadata: Metadata = {
  title: "My documents",
  robots: { index: false, follow: false },
};

export default function WorkspacePage() {
  return <DocumentsApp />;
}
