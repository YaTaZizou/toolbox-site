import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertisseur Audio en ligne", description: "Convertis tes fichiers audio en MP3, WAV, OGG, FLAC, OPUS. Gratuit et 100% local." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
