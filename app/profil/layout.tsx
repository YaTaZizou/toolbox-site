import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil — ToolBox",
  description: "Gérez votre compte ToolBox, votre abonnement Premium et vos préférences.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://alltoolbox.fr/profil" },
};

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
