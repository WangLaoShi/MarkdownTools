import type { MetadataRoute } from "next";
import { publicPath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MarkdownTools",
    short_name: "MDTools",
    description: "Free browser-based Markdown tools: converters, generators, cheat sheets, and editors. Works offline.",
    start_url: publicPath("/"),
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: publicPath("/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: publicPath("/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: publicPath("/icon-512-maskable.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
