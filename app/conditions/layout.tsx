import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "Conditions Générales d'Utilisation de ToolBox — outils en ligne gratuits.",
};

export default function ConditionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
