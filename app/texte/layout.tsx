import { Metadata } from "next";
export const metadata: Metadata = { title: "Générateur de Texte IA", description: "Génère des posts, emails, descriptions, accroches avec l'IA. Rédaction professionnelle en quelques secondes." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
