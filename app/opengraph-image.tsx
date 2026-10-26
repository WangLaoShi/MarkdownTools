import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MarkdownTools — free browser-based Markdown tools";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#09090b", color: "#fafafa", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
        <div style={{ fontSize: 28, letterSpacing: 2 }}>MARKDOWNTOOLS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>Editor, PDF, and tables.</div>
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>Free Markdown tools that run in the browser.</div>
        </div>
      </div>
    ),
    size,
  );
}
