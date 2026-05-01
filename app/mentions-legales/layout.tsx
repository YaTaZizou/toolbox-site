import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de ToolBox — éditeur, hébergeur et informations légales.",
  alternates: { canonical: "https://alltoolbox.fr/mentions-legales" },
};

export default function MentionsLegalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
