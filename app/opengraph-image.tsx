import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 8, height: 60, background: "#e11d48", borderRadius: 4, marginRight: 20 }} />
          <span style={{ fontSize: 80, fontWeight: 700, color: "#f5f5f5", letterSpacing: "-2px" }}>
            BEIRUT SCOPE
          </span>
        </div>
        <span style={{ fontSize: 28, color: "#737373", letterSpacing: 2, textTransform: "uppercase" }}>
          Breaking news from Lebanon and the world
        </span>
      </div>
    ),
    { ...size }
  );
}
