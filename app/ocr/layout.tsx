import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR en ligne — Reconnaissance de Texte dans les Images",
  description: "Extrayez le texte de vos images et documents scannés en ligne. OCR gratuit propulsé par l'IA, sans installation, supporte JPG, PNG et PDF.",
  alternates: { canonical: "https://alltoolbox.fr/ocr" },
  openGraph: {
    title: "OCR Reconnaissance de Texte — ToolBox",
    description: "Extrayez le texte de vos images et documents scannés gratuitement en ligne.",
    url: "https://alltoolbox.fr/ocr",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ToolBox" }],
  },
  twitter: { card: "summary_large_image", title: "OCR Reconnaissance de Texte — ToolBox", description: "Extrayez le texte de vos images et documents scannés gratuitement en ligne." },
};

export default function OcrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        "name": "OCR — Image en texte gratuit IA",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "url": "https://alltoolbox.fr/ocr",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Extrayez le texte de vos images et PDFs scannés en ligne grâce à l'IA. Gratuit."
      }) }} />
      {children}
      <section className="max-w-2xl mx-auto px-4 py-12 border-t border-gray-800/60 mt-8">
        <h2 className="text-xl font-bold mb-4 text-white">OCR en ligne — Extraire du texte depuis une image</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          L'OCR (Reconnaissance Optique de Caractères) de ToolBox transforme vos images contenant du texte en texte éditable et copiable. Importez une photo de document, une capture d'écran, une facture scannée ou une page de livre — l'IA extrait le texte avec une haute précision, même sur des documents de mauvaise qualité.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">Quels formats de fichiers sont acceptés ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4">
          L'outil OCR accepte les images JPG, PNG et WebP, ainsi que les fichiers PDF numérisés. Pour de meilleurs résultats, utilisez des images nettes avec un bon contraste entre le texte et le fond.
        </p>
        <h3 className="font-semibold text-white mb-2 text-sm">L'OCR fonctionne-t-il sur plusieurs langues ?</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Oui, la reconnaissance de texte supporte le français, l'anglais, l'espagnol, l'allemand et d'autres langues latines. Les textes en caractères arabes ou asiatiques sont aussi partiellement supportés.
        </p>
      </section>
    </>
  );
}
