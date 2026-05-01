import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact — ToolBox",
  description: "Contactez l'équipe ToolBox pour toute question, suggestion ou problème. Nous répondons sous 24h.",
  alternates: { canonical: "https://alltoolbox.fr/contact" },
  openGraph: {
    title: "Contact — ToolBox",
    description: "Contactez l'équipe ToolBox pour toute question, suggestion ou problème. Nous répondons sous 24h.",
    url: "https://alltoolbox.fr/contact",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ToolBox" }],
  },
};
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
