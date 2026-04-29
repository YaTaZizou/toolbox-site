import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajout de Filigrane",
  description: "Ajoutez un filigrane texte ou logo sur vos images en ligne. Gratuit, rapide, sans inscription.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
