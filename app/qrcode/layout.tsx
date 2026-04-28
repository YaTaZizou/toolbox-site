import { Metadata } from "next";
export const metadata: Metadata = { title: "Générateur de QR Code gratuit", description: "Crée un QR code personnalisé pour n'importe quel lien ou texte. Téléchargement PNG gratuit." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
