import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Télécharger des Vidéos YouTube TikTok Instagram en ligne — Gratuit",
  description: "Téléchargez des vidéos depuis YouTube, TikTok, Instagram, X (Twitter) et plus. Format MP4 ou MP3, gratuit, sans logiciel à installer.",
  alternates: { canonical: "https://alltoolbox.fr/convertisseur-lien" },
  openGraph: {
    title: "Téléchargeur de Vidéos YouTube TikTok — ToolBox",
    description: "Téléchargez des vidéos depuis YouTube, TikTok, Instagram en MP4 ou MP3.",
    url: "https://alltoolbox.fr/convertisseur-lien",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "Téléchargeur YouTube TikTok — ToolBox", description: "Téléchargez des vidéos depuis YouTube, TikTok, Instagram en MP4 ou MP3." },
};

export default function ConvertisseurLienLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">Télécharger des vidéos en ligne gratuitement</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Cet outil vous permet de télécharger des vidéos depuis les principales plateformes — YouTube, TikTok, Instagram, X (Twitter) — en collant simplement l'URL de la vidéo. Choisissez entre le format MP4 pour conserver la vidéo ou MP3 pour extraire uniquement l'audio. Parfait pour écouter de la musique hors ligne ou conserver un tutoriel vidéo.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Comment télécharger une vidéo YouTube ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          Copiez l'URL de la vidéo YouTube, collez-la dans le champ prévu, sélectionnez la qualité souhaitée (720p, 1080p…) puis cliquez sur "Télécharger". La vidéo est sauvegardée directement sur votre appareil.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Puis-je extraire seulement l'audio d'une vidéo ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, sélectionnez le format MP3 pour extraire uniquement la piste audio. Idéal pour convertir une vidéo YouTube en musique ou podcast MP3.
        </p>
      </section>
    </>
  );
}
