import { HubPage, hubMetadata } from "@/components/hubs/hub-page";

export const metadata = hubMetadata("text-tools");

export default function Page() {
  return <HubPage category="text-tools" />;
}
