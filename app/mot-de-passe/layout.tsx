import { Metadata } from "next";
export const metadata: Metadata = { title: "Générateur de Mot de Passe sécurisé", description: "Génère des mots de passe forts et sécurisés. Longueur et caractères personnalisables. Gratuit." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
