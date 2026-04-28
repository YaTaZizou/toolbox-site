import { Metadata } from "next";
export const metadata: Metadata = { title: "Générateur de Palette de Couleurs", description: "Génère des palettes harmonieuses : monochromatique, analogique, complémentaire. Gratuit." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
