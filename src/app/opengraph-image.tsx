import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import brand from "@/config/brand-palette.json";
export const alt = `${site.name} — Full-stack development, AI engineering, and security`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: brand.light.background,
          color: brand.light.foreground,
          padding: 72,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
          }}
        >
          <span>{site.handle}</span>
          <span>SELECTED WORK & IDEAS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 112, letterSpacing: -6 }}>{site.name}</span>
          <span
            style={{
              fontSize: 32,
              color: brand.light.accentText,
              marginTop: 18,
            }}
          >
            Full-stack development. AI engineering. Security.
          </span>
        </div>
        <div style={{ fontSize: 20 }}>A work in progress. By design.</div>
      </div>
    ),
    size,
  );
}
