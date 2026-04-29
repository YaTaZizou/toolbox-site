import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR — Image en Texte",
  description: "Extrayez le texte de vos images et documents scannés en ligne. OCR gratuit propulsé par IA.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
