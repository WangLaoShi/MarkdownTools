import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: "#09090b", color: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96, fontWeight: 700 }}>
        M
      </div>
    ),
    size,
  );
}
