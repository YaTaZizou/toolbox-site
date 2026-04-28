import { Metadata } from "next";
export const metadata: Metadata = { title: "Dictionnaire IA en ligne", description: "Trouve la définition, les synonymes et les antonymes de n'importe quel mot grâce à l'IA." };
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
