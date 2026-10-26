import type { Metadata } from "next";
import { ShareView } from "@/components/workspace/share-view";

export const metadata: Metadata = {
  title: "Shared document",
  robots: { index: false, follow: false },
};

export default function SharePage() {
  return <ShareView />;
}
