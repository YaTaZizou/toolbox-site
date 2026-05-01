import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et gestion des données personnelles de ToolBox.",
  alternates: { canonical: "https://alltoolbox.fr/confidentialite" },
};

export default function ConfidentialiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
