import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertisseur Vidéo en ligne", description: "Convertis et compresse tes vidéos MP4, WebM, MOV gratuitement. Traitement 100% local." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
