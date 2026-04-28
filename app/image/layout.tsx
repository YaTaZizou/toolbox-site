import { Metadata } from "next";
export const metadata: Metadata = { title: "Convertisseur d'Images en ligne", description: "Convertis tes images en JPG, PNG, WebP, AVIF. Compresse et optimise tes images gratuitement." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
