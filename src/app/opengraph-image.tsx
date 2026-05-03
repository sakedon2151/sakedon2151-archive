import { ImageResponse } from "next/og";

export const alt = "sakedon2151";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#fdfdfc",
        color: "#21201c",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          borderTop: "1px solid #cfceca",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          paddingTop: "44px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#63635e",
            display: "flex",
            fontSize: 28,
            letterSpacing: 0,
            lineHeight: 1.4,
          }}
        >
          Design / Engineering
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          sakedon2151
        </div>
        <div
          style={{
            color: "#63635e",
            display: "flex",
            fontSize: 32,
            lineHeight: 1.45,
            maxWidth: 720,
          }}
        >
          Quiet notes for restrained interfaces.
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
