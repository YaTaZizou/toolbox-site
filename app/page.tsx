import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { SearchBar } from "@/components/SearchBar";
import { RecentTools } from "@/components/RecentTools";
import { HeroPremiumBadge } from "@/components/HeroPremiumBadge";

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
    title: "Générateurs",
    cardClass: "card-purple",
    titleColor: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/5",
    tools: [
      { href: "/pseudo", emoji: "🎭", title: "Générateur de Pseudo", description: "Pseudos uniques pour gaming, réseaux sociaux, streaming...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/bio", emoji: "✍️", title: "Générateur de Bio", description: "Bio percutante pour Instagram, TikTok, LinkedIn...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/texte", emoji: "📝", title: "Générateur de Texte", description: "Posts, emails, descriptions, accroches...", badge: "IA", badgeColor: "bg-purple-500/20 text-purple-400", available: true },
      { href: "/logo", emoji: "🎨", title: "Générateur de Logo", description: "Crée un logo unique avec l'IA en quelques secondes.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
      { href: "/qrcode", emoji: "📱", title: "Générateur de QR Code", description: "Crée un QR code pour n'importe quel lien ou texte.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/mot-de-passe", emoji: "🔑", title: "Générateur de Mot de Passe", description: "Génère des mots de passe sécurisés.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/hash", emoji: "🔐", title: "Générateur de Hash", description: "MD5, SHA-256, SHA-512 en temps réel.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
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
      { href: "/pdf?tab=fusionner", emoji: "🔗", title: "Fusionner des PDFs", description: "Combine plusieurs PDFs en un seul fichier.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf?tab=image-vers-pdf", emoji: "🖼️", title: "Images → PDF", description: "Convertis tes JPG/PNG en fichier PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf?tab=decouper", emoji: "✂️", title: "Découper un PDF", description: "Extrait des pages spécifiques d'un PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf?tab=proteger", emoji: "🔒", title: "Protéger un PDF", description: "Ajoute un mot de passe à ton PDF.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/pdf-images", emoji: "📸", title: "PDF → Images", description: "Convertis chaque page d'un PDF en image.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/modifier-pdf", emoji: "📝", title: "Modifier un PDF", description: "Pivote, supprime ou réorganise les pages.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/compresser-pdf", emoji: "🗜️", title: "Compresser un PDF", description: "Réduis la taille de tes PDFs jusqu'à 80%.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
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
      { href: "/amelioration-image", emoji: "✨", title: "Amélioration d'Image", description: "Augmente la résolution jusqu'à 4× avec l'IA.", badge: "⭐ Premium", badgeColor: "bg-yellow-500/20 text-yellow-400", available: true },
      { href: "/filigrane", emoji: "🖊️", title: "Ajout de Filigrane", description: "Protège tes images avec un filigrane personnalisé.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/convertisseur-lien", emoji: "⬇️", title: "Téléchargeur de Vidéos", description: "YouTube, TikTok, Instagram, X — télécharge en MP4 ou MP3.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
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
      { href: "/ocr", emoji: "🔍", title: "OCR — Image en Texte", description: "Extrait le texte de n'importe quelle image.", badge: "IA", badgeColor: "bg-blue-500/20 text-blue-400", available: true },
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
      { href: "/unites", emoji: "📏", title: "Convertisseur d'Unités", description: "Distance, poids, température, vitesse...", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/couleurs", emoji: "🎨", title: "Palette de Couleurs", description: "Génère des palettes harmonieuses.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/formateur-json", emoji: "{ }", title: "Formateur JSON", description: "Formate, minifie et valide tes données JSON.", badge: "Gratuit", badgeColor: "bg-green-500/20 text-green-400", available: true },
      { href: "/lien", emoji: "🔗", title: "Raccourcisseur de Lien", description: "Raccourcis tes URLs en un clic.", badge: "Bientôt", badgeColor: "bg-gray-700 text-gray-500", available: false },
    ],
  },
];

// Tri alphabétique par titre dans chaque catégorie (outils disponibles d'abord, "Bientôt" à la fin)
function sortTools(tools: Tool[]): Tool[] {
  return [...tools].sort((a, b) => {
    if (a.available && !b.available) return -1;
    if (!a.available && b.available) return 1;
    return a.title.localeCompare(b.title, "fr", { sensitivity: "base" });
  });
}

categories.forEach((cat) => {
  cat.tools = sortTools(cat.tools);
});

// Aplatir tous les outils pour la recherche
const allTools = categories.flatMap((cat) =>
  cat.tools.map((tool) => ({
    ...tool,
    category: cat.title,
    categoryEmoji: cat.emoji,
  }))
);

const totalAvailable = categories.reduce(
  (acc, cat) => acc + cat.tools.filter((t) => t.available).length,
  0
);

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* ── Hero ── */}
      <div className="relative text-center mb-14 overflow-hidden py-8">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        {/* Badge */}
        <div className="animate-fade-in mb-6" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400">
            <span className="h-2 w-2 rounded-full bg-purple-400 inline-block" />
            {totalAvailable} outils disponibles gratuitement
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-6xl font-black mb-5 animate-fade-in-up tracking-tight"
          style={{ animationDelay: "80ms" }}
        >
          <span className="gradient-text">Tous vos outils</span>
          <br />
          <span className="text-white">en un seul endroit.</span>
        </h1>

        <p
          className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed"
          style={{ animationDelay: "160ms" }}
        >
          PDF, IA, images, vidéo, texte — sans installation,
          sans inscription forcée, sans filigrane.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="/pdf"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:-translate-y-0.5"
          >
            Essayer un outil →
          </Link>
          <HeroPremiumBadge />
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap justify-center gap-10 mt-14 animate-fade-in"
          style={{ animationDelay: "320ms" }}
        >
          {[
            { value: `${totalAvailable}+`, label: "outils disponibles" },
            { value: "100%", label: "en ligne, aucune install" },
            { value: "Gratuit", label: "sans inscription forcée" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Barre de recherche ── */}
      <SearchBar tools={allTools} />

      {/* ── Outils récents ── */}
      <RecentTools />

      {/* ── Catégories ── */}
      <div className="space-y-14">
        {categories.map((cat, catIdx) => (
          <div key={cat.id}>
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
                        className={`group bg-gray-900/50 border border-gray-800/60 rounded-xl p-5 h-full cursor-pointer transition-all duration-300 hover:border-purple-500/40 hover:bg-gray-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 animate-fade-in-up`}
                        style={{ animationDelay: `${catIdx * 80 + toolIdx * 40 + 350}ms` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-2xl transition-colors group-hover:bg-purple-500/20">
                            {tool.emoji}
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-purple-300 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{tool.description}</p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={tool.href + tool.title}
                      className="bg-gray-900/20 border border-gray-800/30 rounded-xl p-5 h-full opacity-35 cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-800/50 text-2xl">
                          {tool.emoji}
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-1.5">{tool.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">{tool.description}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Pub APRÈS la catégorie (après la 2e et la 4e) */}
          {(catIdx === 1 || catIdx === 3) && <AdBanner />}
          </div>
        ))}
      </div>
    </div>
  );
}
