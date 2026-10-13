import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const ogAlt = `${site.name} — ${site.tagline}`;
export const ogSize = { width: 1200, height: 630 };

export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#08080b",
          backgroundImage:
            "radial-gradient(circle at 15% 10%, rgba(124,92,255,.45), transparent 45%), radial-gradient(circle at 90% 90%, rgba(196,255,61,.25), transparent 45%)",
          color: "#ededf2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 999, background: "#c4ff3d" }} />
          <div style={{ fontSize: 40, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Digital products</div>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1, color: "#c4ff3d" }}>
            end to end.
          </div>
        </div>
        <div style={{ fontSize: 32, color: "#8b8b98" }}>{`${site.tagline} · Telegram Mini Apps`}</div>
      </div>
    ),
    ogSize,
  );
}
