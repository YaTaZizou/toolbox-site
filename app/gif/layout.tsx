import { Metadata } from "next";
export const metadata: Metadata = { title: "Créateur de GIF en ligne", description: "Crée des GIFs animés depuis tes images JPG et PNG. Gratuit, rapide, dans le navigateur." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
