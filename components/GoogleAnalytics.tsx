"use client";

import { useEffect } from "react";
import { useCookieConsent } from "@/components/CookieConsent";

const GA_ID = "G-WN7MTE5CPE";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export function GoogleAnalytics() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (consent !== "accepted") return;

    // Injecte le script GA une seule fois
    if (document.getElementById("ga-script")) return;

    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      anonymize_ip: true, // RGPD : anonymise les IPs
    });
  }, [consent]);

  return null;
}
