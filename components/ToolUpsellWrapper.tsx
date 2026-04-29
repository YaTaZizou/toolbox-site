"use client";

import { usePathname } from "next/navigation";
import { PremiumUpsellBanner } from "@/components/PremiumUpsellBanner";

// Pages qui ne sont PAS des outils — pas de banner upsell sur ces pages
const EXCLUDED_PATHS = [
  "/",
  "/premium",
  "/connexion",
  "/inscription",
  "/profil",
  "/contact",
  "/reset-password",
  "/mentions-legales",
  "/confidentialite",
  "/conditions",
  "/login",
];

export function ToolUpsellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isToolPage =
    !EXCLUDED_PATHS.includes(pathname) &&
    !pathname.startsWith("/api/");

  return (
    <>
      {children}
      {isToolPage && <PremiumUpsellBanner />}
    </>
  );
}
