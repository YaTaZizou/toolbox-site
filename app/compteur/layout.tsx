import { Metadata } from "next";
export const metadata: Metadata = { title: "Compteur de Mots et Caractères", description: "Compte les mots, caractères, phrases et estime le temps de lecture de ton texte. Gratuit." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
