import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connecte-toi à ton compte ToolBox pour accéder à tes outils et gérer ton abonnement Premium.",
  robots: { index: false },
  alternates: { canonical: "https://alltoolbox.fr/connexion" },
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
