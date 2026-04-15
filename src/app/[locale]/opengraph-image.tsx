import { ImageResponse } from "next/og";
import { hasLocale, type Locale } from "@/i18n/config";

export const runtime = "edge";
export const alt = "Habitat 3RI — Third Industrial Revolution";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const titles: Record<Locale, string> = {
  fr: "Votre maison, votre centrale énergétique",
  nl: "Uw woning, uw energiecentrale",
  en: "Your home, your power plant",
  de: "Ihr Haus, Ihr Kraftwerk",
  lb: "Äert Heem, Är Energiezentral",
};

const subtitles: Record<Locale, string> = {
  fr: "Rénovation durable · Énergie renouvelable · Habitat intelligent",
  nl: "Duurzame renovatie · Hernieuwbare energie · Slim wonen",
  en: "Sustainable renovation · Renewable energy · Smart living",
  de: "Nachhaltige Sanierung · Erneuerbare Energie · Intelligentes Wohnen",
  lb: "Nohalteg Renovatioun · Erneierbar Energie · Intelligent Wunnen",
};

export default async function OGImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = hasLocale(locale) ? (locale as Locale) : "fr";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a2e1a 0%, #0c1929 50%, #1a0a2e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #22c55e, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                background: "linear-gradient(135deg, #22c55e, #3b82f6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Habitat
            </span>
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#f59e0b" }}>
              3RI
            </span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.3,
          }}
        >
          {titles[loc]}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            textAlign: "center",
            marginTop: "16px",
            maxWidth: "700px",
          }}
        >
          {subtitles[loc]}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "16px",
            color: "#64748b",
          }}
        >
          habitat3ri.eu
        </div>
      </div>
    ),
    { ...size }
  );
}
