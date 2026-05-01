import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86400; // re-génère au maximum une fois par jour
export const alt = "ToolBox — Outils gratuits en ligne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #09090b 0%, #0f0a1e 50%, #09090b 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Halo violet */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            background: "radial-gradient(closest-side, rgba(124,58,237,0.35), rgba(124,58,237,0) 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 22,
            background: "linear-gradient(140deg, #8b5cf6 0%, #7c3aed 60%, #5b21b6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            boxShadow: "0 20px 60px rgba(124,58,237,0.5)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: 18,
          }}
        >
          ToolBox
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Outils gratuits en ligne — PDF, IA, images, vidéo, texte
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
          }}
        >
          {["✓ Sans inscription", "✓ 100% gratuit", "✓ Aucune installation"].map((text) => (
            <div
              key={text}
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.35)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#c4b5fd",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            color: "#52525b",
            fontSize: 18,
            letterSpacing: "0.05em",
          }}
        >
          alltoolbox.fr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
