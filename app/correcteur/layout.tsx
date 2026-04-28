import { Metadata } from "next";
export const metadata: Metadata = { title: "Correcteur de Texte IA", description: "Corrige l'orthographe, la grammaire et le style de ton texte avec l'IA. Français, anglais, espagnol." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
