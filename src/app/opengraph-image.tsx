import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — software engineer, cybersecurity, DevOps, AI & automation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e0e0d",
          color: "#f4f3f0",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              border: "1px solid rgba(244,243,240,0.25)",
              borderRadius: 12,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: -1,
            }}
          >
            TA
          </div>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(244,243,240,0.65)",
            }}
          >
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.08,
              maxWidth: 940,
            }}
          >
            I build software, solve problems, and turn ideas into working
            products.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(244,243,240,0.55)",
              letterSpacing: 0.5,
            }}
          >
            Software Engineer · Cybersecurity · DevOps · AI &amp; Automation
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(244,243,240,0.15)",
            paddingTop: 28,
            fontSize: 20,
            color: "rgba(244,243,240,0.5)",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span style={{ color: "#4f8ae8" }}>●</span>
            <span>Projects · Case studies · Writing</span>
          </div>
          <div>{site.location}</div>
        </div>
      </div>
    ),
    size,
  );
}
