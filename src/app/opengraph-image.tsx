import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "元とらなアカン";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to right, #f97316, #22c55e)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 40 }}>🤔💡💰</div>
        <div style={{ fontSize: 96, marginBottom: 20 }}>元とらなアカン</div>
        <div style={{ fontSize: 48 }}>元とらなもったいないやん！</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
