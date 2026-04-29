import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Hash",
  description: "Génère des empreintes SHA-256, SHA-512 et MD5 de n'importe quel texte. Outil gratuit en ligne.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
