import type { CSSProperties } from "react";

export function getBadgeStyle(badgeColor: string): CSSProperties {
  switch (badgeColor) {
    case "free":
      return {
        background: "var(--green-soft)",
        color: "#4ade80",
        border: "1px solid rgba(34,197,94,0.25)",
      };
    case "ai":
      return {
        background: "var(--primary-soft)",
        color: "var(--primary-2)",
        border: "1px solid rgba(124,58,237,0.3)",
      };
    case "premium":
      return {
        background: "var(--amber-soft)",
        color: "var(--amber)",
        border: "1px solid rgba(250,204,21,0.3)",
      };
    case "soon":
    default:
      return {
        background: "rgba(30,30,35,0.8)",
        color: "#71717a",
        border: "1px solid #2a2a31",
      };
  }
}
