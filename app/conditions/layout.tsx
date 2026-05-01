import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions Générales d'Utilisation de ToolBox — outils en ligne gratuits.",
  alternates: { canonical: "https://alltoolbox.fr/conditions" },
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
