import { ImageResponse } from "next/og";

export const alt = "ROLA Replays - Ragnarok Online LATAM replay analyzer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #100d18 0%, #171321 55%, #120f1a 100%)",
      }}
    >
      <div
        style={{
          width: 360,
          height: 360,
          display: "flex",
          borderRadius: 72,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="360" height="360">
          <rect width="64" height="64" rx="12" fill="#0d0b12" />
          <rect x="10" y="10" width="44" height="44" rx="8" fill="#171021" />
          <path d="M15 16h34" stroke="#7d42ee" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M15 48h34" stroke="#3a1d64" strokeWidth="2.5" strokeLinecap="round" />
          <path
            d="M17 24h15.4c5.1 0 8.3 3 8.3 7.3 0 3-1.6 5.3-4.3 6.4L42.5 48h-9.2l-4.8-8h-3.2v8H17V24zm8.3 6.3v3.8h6.4c1.1 0 1.9-.8 1.9-1.9s-.8-1.9-1.9-1.9h-6.4z"
            fill="#f4efff"
          />
          <path d="M38 24h17v6.7h-4.5V48h-8V30.7H38V24z" fill="#a974ff" />
        </svg>
      </div>
    </div>,
    size,
  );
}
