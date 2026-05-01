import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur Audio en ligne gratuit — MP3 WAV FLAC OGG",
  description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement en ligne. Traitement 100% local, sans inscription, dans votre navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/audio" },
  openGraph: {
    title: "Convertisseur Audio en ligne — ToolBox",
    description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement.",
    url: "https://alltoolbox.fr/audio",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur Audio — ToolBox", description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement." },
};

export default function AudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "Convertisseur audio en ligne gratuit",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/audio",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Convertissez vos fichiers audio en MP3, WAV, FLAC ou OGG gratuitement en ligne."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Convertir un fichier audio en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Le convertisseur audio de ToolBox vous permet de transformer vos fichiers sonores entre les principaux formats sans installer de logiciel. Convertissez un fichier WAV en MP3 pour réduire sa taille, ou un MP3 en FLAC pour une qualité sans perte. Le traitement est entièrement local dans votre navigateur — vos enregistrements audio restent confidentiels.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quel format audio choisir ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          MP3 est le format universel pour la musique et les podcasts. WAV offre une qualité maximale sans compression. OGG et OPUS sont optimisés pour le streaming web. FLAC est parfait pour l'archivage en qualité lossless.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je régler le débit binaire (bitrate) ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, l'outil vous laisse choisir le bitrate de sortie pour trouver le meilleur compromis entre qualité audio et taille du fichier final.
        </p>
        <div className="mt-6 pt-4 border-t border-gray-800/40">
          <p className="text-gray-500 text-xs mb-2">Outils connexes :</p>
          <div className="flex flex-wrap gap-3">
            <a href="/video" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Convertir une vidéo</a>
            <a href="/convertisseur-lien" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Télécharger une vidéo</a>
          </div>
        </div>
      </section>
    </>
  );
}
