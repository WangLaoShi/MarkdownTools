import type { Metadata } from "next";
import { SettingsPanel } from "@/components/workspace/settings-panel";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsPanel />;
}
