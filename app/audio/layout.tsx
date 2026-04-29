import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur Audio en ligne gratuit — MP3 WAV FLAC OGG",
  description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement en ligne. Traitement 100% local, sans inscription, dans votre navigateur.",
  alternates: { canonical: "https://alltoolbox.fr/audio" },
  openGraph: {
    title: "Convertisseur Audio en ligne — ToolBox",
    description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement.",
    url: "https://alltoolbox.fr/audio",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Convertisseur Audio — ToolBox", description: "Convertissez vos fichiers audio en MP3, WAV, OGG, FLAC ou OPUS gratuitement." },
};

export default function AudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      </section>
    </>
  );
}
