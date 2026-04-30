import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium — Accès illimité à tous les outils",
  description: "Passez Premium pour accéder à tous les outils IA sans limite, sans publicité. Moins de 3€/mois, résiliable à tout moment, garanti 7 jours.",
  alternates: { canonical: "https://alltoolbox.fr/premium" },
  openGraph: {
    title: "ToolBox Premium — Accès illimité à tous les outils",
    description: "Générateurs IA illimités, zéro pub, accès prioritaire aux nouveaux outils. Moins de 3€/mois.",
    url: "https://alltoolbox.fr/premium",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox Premium" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBox Premium — Accès illimité à tous les outils",
    images: ["/icon-512.png"],
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
