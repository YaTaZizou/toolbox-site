import { Metadata } from "next";
export const metadata: Metadata = { title: "Traducteur en ligne gratuit", description: "Traduis du texte dans plus de 12 langues grâce à l'IA. Traduction automatique en temps réel." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
