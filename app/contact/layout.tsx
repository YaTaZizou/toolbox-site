import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact — ToolBox",
  description: "Contactez l'équipe ToolBox pour toute question, suggestion ou problème. Nous répondons sous 24h.",
  alternates: { canonical: "https://alltoolbox.fr/contact" },
};
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
