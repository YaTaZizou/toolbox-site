export type ToolEntry = {
  href: string;
  emoji: string;
  title: string;
  category: string;
  available: boolean;
};

export const ALL_TOOLS: ToolEntry[] = [
  // Générateurs
  { href: "/pseudo", emoji: "🎭", title: "Générateur de Pseudo", category: "Générateurs", available: true },
  { href: "/bio", emoji: "✍️", title: "Générateur de Bio", category: "Générateurs", available: true },
  { href: "/texte", emoji: "📝", title: "Générateur de Texte", category: "Générateurs", available: true },
  { href: "/qrcode", emoji: "📱", title: "Générateur de QR Code", category: "Générateurs", available: true },
  { href: "/mot-de-passe", emoji: "🔑", title: "Générateur de Mot de Passe", category: "Générateurs", available: true },
  { href: "/hash", emoji: "🔐", title: "Générateur de Hash", category: "Générateurs", available: true },
  // PDF
  { href: "/pdf", emoji: "🔗", title: "Outils PDF", category: "Outils PDF", available: true },
  { href: "/pdf-images", emoji: "📸", title: "PDF → Images", category: "Outils PDF", available: true },
  { href: "/modifier-pdf", emoji: "📝", title: "Modifier un PDF", category: "Outils PDF", available: true },
  { href: "/compresser-pdf", emoji: "🗜️", title: "Compresser un PDF", category: "Outils PDF", available: true },
  // Images & Médias
  { href: "/image", emoji: "🔄", title: "Convertisseur d'Images", category: "Images & Médias", available: true },
  { href: "/modifier-image", emoji: "✏️", title: "Modifier une Image", category: "Images & Médias", available: true },
  { href: "/gif", emoji: "🎞️", title: "Créateur de GIF", category: "Images & Médias", available: true },
  { href: "/video", emoji: "🎬", title: "Convertisseur Vidéo", category: "Images & Médias", available: true },
  { href: "/supprimer-fond", emoji: "✂️", title: "Suppression de Fond", category: "Images & Médias", available: true },
  { href: "/audio", emoji: "🎵", title: "Convertisseur Audio", category: "Images & Médias", available: true },
  { href: "/amelioration-image", emoji: "✨", title: "Amélioration d'Image", category: "Images & Médias", available: true },
  { href: "/filigrane", emoji: "🖊️", title: "Ajout de Filigrane", category: "Images & Médias", available: true },
  { href: "/convertisseur-lien", emoji: "⬇️", title: "Téléchargeur de Vidéos", category: "Images & Médias", available: true },
  // Texte & Langue
  { href: "/traducteur", emoji: "🌍", title: "Traducteur", category: "Texte & Langue", available: true },
  { href: "/correcteur", emoji: "✅", title: "Correcteur de Texte", category: "Texte & Langue", available: true },
  { href: "/dictionnaire", emoji: "📖", title: "Dictionnaire", category: "Texte & Langue", available: true },
  { href: "/convertir-texte", emoji: "🔡", title: "Convertisseur de Texte", category: "Texte & Langue", available: true },
  { href: "/compteur", emoji: "📊", title: "Compteur de Mots", category: "Texte & Langue", available: true },
  { href: "/ocr", emoji: "🔍", title: "OCR — Image en Texte", category: "Texte & Langue", available: true },
  // Outils Rapides
  { href: "/unites", emoji: "📏", title: "Convertisseur d'Unités", category: "Outils Rapides", available: true },
  { href: "/couleurs", emoji: "🎨", title: "Palette de Couleurs", category: "Outils Rapides", available: true },
  { href: "/formateur-json", emoji: "{ }", title: "Formateur JSON", category: "Outils Rapides", available: true },
];
