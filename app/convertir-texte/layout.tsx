import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertisseur de Texte en ligne", description: "Convertis ton texte en majuscules, minuscules, slug, camelCase et plus. Gratuit et instantané." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
