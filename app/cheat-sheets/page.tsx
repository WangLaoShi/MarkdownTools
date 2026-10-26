import { HubPage, hubMetadata } from "@/components/hubs/hub-page";

export const metadata = hubMetadata("cheat-sheets");

export default function Page() {
  return <HubPage category="cheat-sheets" />;
}
