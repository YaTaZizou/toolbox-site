import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Crée ton compte ToolBox gratuitement et accède à tous les outils en ligne.",
  robots: { index: false },
};

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
