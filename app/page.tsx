import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";

type Tool = {
  href: string;
  emoji: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  available: boolean;
};

type Category = {
  id: string;
  emoji: string;
  title: string;
  cardClass: string;
  titleColor: string;
  borderColor: string;
  bgColor: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    id: "ia",
    emoji: "🤖",
    title: "Générateurs IA",
    cardClass: "card-purple",
    titleColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/5",
    tools: [
      { href: "/pseudo", emoji: "🎭", title: "Générateur de Pseudo", description: "Pseudos uniques pour gaming, réseaux sociaux, streaming...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/bio", emoji: "✍️", title: "Générateur de Bio", description: "Bio percutante pour Instagram, TikTok, LinkedIn...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/texte", emoji: "📝", title: "Générateur de Texte", description: "Posts, emails, descriptions, accroches...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/logo", emoji: "🎨", title: "Générateur de Logo", description: "Crée un logo unique avec l'IA en quelques secondes.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
  {
    id: "pdf",
    emoji: "📄",
    title: "Outils PDF",
    cardClass: "card-red",
    titleColor: "text-red-400",
    borderColor: "border-red-500/20",
    bgColor: "bg-red-500/5",
    tools: [
      { href: "/pdf", emoji: "🔗", title: "Fusionner des PDFs", description: "Combine plusieurs PDFs en un seul fichier.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "🖼️", title: "Images → PDF", description: "Convertis tes JPG/PNG en fichier PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "✂️", title: "Découper un PDF", description: "Extrait des pages spécifiques d'un PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf", emoji: "🔒", title: "Protéger un PDF", description: "Ajoute un mot de passe à ton PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf-images", emoji: "📸", title: "PDF → Images", description: "Convertis chaque page d'un PDF en image.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/modifier-pdf", emoji: "📝", title: "Modifier un PDF", description: "Pivote, supprime ou réorganise les pages.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
    ],
  },
  {
    id: "media",
    emoji: "🖼️",
    title: "Images & Médias",
    cardClass: "card-orange",
    titleColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    tools: [
      { href: "/image", emoji: "🔄", title: "Convertisseur d'Images", description: "JPG, PNG, WebP, AVIF + compression.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/modifier-image", emoji: "✏️", title: "Modifier une Image", description: "Redimensionne, pivote ou retourne.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/gif", emoji: "🎞️", title: "Créateur de GIF", description: "Crée des GIFs animés depuis tes images.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/video", emoji: "🎬", title: "Convertisseur Vidéo", description: "Convertis et compresse tes vidéos MP4, WebM, MOV...", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/supprimer-fond", emoji: "✂️", title: "Suppression de Fond", description: "Supprime le fond de tes images avec l'IA.", badge: "IA", badgeColor: "bg-orange-500/20 text-orange-400", available: true },
      { href: "/audio", emoji: "🎵", title: "Convertisseur Audio", description: "Convertis en MP3, WAV, OGG, FLAC, OPUS...", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
    ],
  },
  {
    id: "texte",
    emoji: "📝",
    title: "Texte & Langue",
    cardClass: "card-blue",
    titleColor: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    tools: [
      { href: "/traducteur", emoji: "🌍", title: "Traducteur", description: "Traduis dans plus de 12 langues grâce à l'IA.", badge: "IA", badgeColor: "bg-blue-500/20 text-blue-400", available: true },
      { href: "/correcteur", emoji: "✅", title: "Correcteur de Texte", description: "Corrige orthographe, grammaire et style.", badge: "IA", badgeColor: "bg-blue-500/20 text-blue-400", available: true },
      { href: "/dictionnaire", emoji: "📖", title: "Dictionnaire", description: "Définitions, synonymes et antonymes.", badge: "IA", badgeColor: "bg-blue-500/20 text-blue-400", available: true },
      { href: "/convertir-texte", emoji: "🔡", title: "Convertisseur de Texte", description: "Majuscules, slug, camelCase et plus.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/compteur", emoji: "📊", title: "Compteur de Mots", description: "Mots, caractères, temps de lecture.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
    ],
  },
  {
    id: "utils",
    emoji: "⚡",
    title: "Outils Rapides",
    cardClass: "card-orange",
    titleColor: "text-orange-400",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    tools: [
      { href: "/qrcode", emoji: "📱", title: "Générateur de QR Code", description: "Crée un QR code pour n'importe quel lien ou texte.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/mot-de-passe", emoji: "🔑", title: "Générateur de Mot de Passe", description: "Génère des mots de passe sécurisés.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/unites", emoji: "📏", title: "Convertisseur d'Unités", description: "Distance, poids, température, vitesse...", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/couleurs", emoji: "🎨", title: "Palette de Couleurs", description: "Génère des palettes harmonieuses.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/lien", emoji: "🔗", title: "Raccourcisseur de Lien", description: "Raccourcis tes URLs en un clic.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
];

const totalAvailable = categories.reduce(
  (acc, cat) => acc + cat.tools.filter((t) => t.available).length,
  0
);

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* ── Hero ── */}
      <div className="hero-glow text-center mb-20 relative">
        <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm mb-6">
            ⚡ {totalAvailable} outils disponibles gratuitement
          </div>
        </div>

        <h1
          className="text-6xl md:text-7xl font-black mb-5 gradient-text animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          ToolBox
        </h1>

        <p
          className="text-lg text-gray-400 max-w-xl mx-auto mb-8 animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          Générateurs IA, outils PDF, images et bien plus encore.
          <br />Gratuit, rapide et sans prise de tête.
        </p>

        <div
          className="flex flex-wrap justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/pdf"
            className="bg-white text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            Essayer un outil →
          </Link>
          <Link
            href="/premium"
            className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-semibold px-6 py-2.5 rounded-xl hover:bg-yellow-500/20 transition-colors text-sm"
          >
            ⭐ Passer Premium
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in"
          style={{ animationDelay: "320ms" }}
        >
          {[
            { value: `${totalAvailable}`, label: "outils disponibles" },
            { value: "100%", label: "gratuit" },
            { value: "0", label: "inscription requise" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Catégories ── */}
      <div className="space-y-14">
        {categories.map((cat, catIdx) => (
          <div key={cat.id}>
          {/* Pub entre catégories (après la 2e et la 4e) */}
          {(catIdx === 2 || catIdx === 4) && <AdBanner />}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: `${catIdx * 80 + 300}ms` }}
          >
            {/* Titre catégorie */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{cat.emoji}</span>
              <h2 className={`text-xl font-bold ${cat.titleColor}`}>{cat.title}</h2>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                {cat.tools.filter((t) => t.available).length} outils
              </span>
            </div>

            {/* Grille d'outils */}
            <div className={`border rounded-2xl p-5 ${cat.borderColor} ${cat.bgColor}`}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {cat.tools.map((tool, toolIdx) =>
                  tool.available ? (
                    <Link key={tool.href + tool.title} href={tool.href}>
                      <div
                        className={`group bg-gray-900 border border-gray-800 rounded-xl p-4 h-full cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 ${cat.cardClass} animate-fade-in-up`}
                        style={{ animationDelay: `${catIdx * 80 + toolIdx * 40 + 350}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{tool.emoji}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-white transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{tool.description}</p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={tool.href + tool.title}
                      className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 h-full opacity-40 cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{tool.emoji}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-1">{tool.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{tool.description}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}
