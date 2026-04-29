import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formateur JSON",
  description: "Formate, minifie et valide vos fichiers JSON en ligne gratuitement. Indentation automatique et mise en forme.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
