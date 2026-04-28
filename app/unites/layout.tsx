import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertisseur d'Unités en ligne", description: "Convertis des distances, poids, températures, vitesses et surfaces. Gratuit et instantané." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
