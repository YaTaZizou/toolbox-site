import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur Vidéo en ligne gratuit — MP4 WebM MOV",
  description: "Convertissez et compressez vos vidéos MP4, WebM, MOV gratuitement en ligne. Traitement 100% local dans le navigateur, sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/video" },
  openGraph: {
    title: "Convertisseur Vidéo en ligne — ToolBox",
    description: "Convertissez vos vidéos MP4, WebM, MOV gratuitement en ligne.",
    url: "https://alltoolbox.fr/video",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur Vidéo — ToolBox", description: "Convertissez vos vidéos MP4, WebM, MOV gratuitement en ligne." },
};

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertir une vidéo en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          ToolBox propose un convertisseur vidéo en ligne qui fonctionne entièrement dans votre navigateur grâce à la technologie FFmpeg. Convertissez vos vidéos entre les formats MP4, WebM, MOV et AVI sans passer par un serveur distant. Réduisez aussi le poids de vos vidéos en ajustant la qualité, idéal pour partager sur les réseaux sociaux ou envoyer par email.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quels formats vidéo sont supportés ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          L'outil prend en charge les principaux formats vidéo : MP4 (H.264), WebM (VP9), MOV et AVI. Le format MP4 est recommandé pour la compatibilité maximale avec tous les appareils et plateformes.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Ma vidéo est-elle envoyée sur internet ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Non. La conversion s'effectue entièrement dans votre navigateur via WebAssembly. Vos vidéos restent sur votre appareil à tout moment — aucun transfert vers un serveur externe.
        </p>
      </section>
    </>
  );
}
