import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de liens — YouTube, TikTok, Instagram, X",
  description:
    "Télécharge des vidéos depuis YouTube, TikTok, Instagram, X (Twitter) et plus. MP4 ou MP3, gratuit et sans logiciel.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
