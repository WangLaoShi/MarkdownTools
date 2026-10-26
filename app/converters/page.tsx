import { HubPage, hubMetadata } from "@/components/hubs/hub-page";

export const metadata = hubMetadata("converters");

export default function Page() {
  return <HubPage category="converters" />;
}
