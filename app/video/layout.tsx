import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur Vidéo en ligne gratuit — MP4 WebM MOV",
  description: "Convertissez et compressez vos vidéos MP4, WebM, MOV gratuitement en ligne. Traitement 100% local dans le navigateur, sans inscription.",
  alternates: { canonical: "https://alltoolbox.fr/video" },
  openGraph: {
    title: "Convertisseur Vidéo en ligne — ToolBox",
    description: "Convertissez vos vidéos MP4, WebM, MOV gratuitement en ligne.",
    url: "https://alltoolbox.fr/video",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur Vidéo — ToolBox", description: "Convertissez vos vidéos MP4, WebM, MOV gratuitement en ligne." },
};

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Convertisseur Vidéo en ligne — ToolBox",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/video",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Convertissez et compressez vos vidéos MP4, WebM, MOV gratuitement en ligne. Traitement 100% local dans le navigateur, sans inscription."
      }) }} />
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
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/audio" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir un audio</a>
            <a href="/gif" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Créer un GIF</a>
            <a href="/image" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir une image</a>
          </div>
        </div>
      </section>
    </>
  );
}
