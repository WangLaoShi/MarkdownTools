import { HubPage, hubMetadata } from "@/components/hubs/hub-page";

export const metadata = hubMetadata("generators");

export default function Page() {
  return <HubPage category="generators" />;
}
