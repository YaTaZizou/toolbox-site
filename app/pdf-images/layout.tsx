import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertir PDF en Images", description: "Convertis chaque page d'un PDF en image JPG ou PNG. Gratuit, rapide, sans logiciel à installer." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
