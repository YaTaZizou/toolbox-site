"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Link from "next/link";

const COOKIE_KEY = "toolbox_cookie_consent";

type ConsentStatus = "pending" | "accepted" | "declined";

const CookieConsentContext = createContext<{
  consent: ConsentStatus;
  accept: () => void;
  decline: () => void;
}>({
  consent: "pending",
  accept: () => {},
  decline: () => {},
});

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored as ConsentStatus);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setConsent("accepted");
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setConsent("declined");
  };

  return (
    <CookieConsentContext.Provider value={{ consent, accept, decline }}>
      {children}
      {mounted && consent === "pending" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Consentement aux cookies"
          aria-live="polite"
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 px-4 py-4 md:px-6"
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-300 font-medium mb-1">🍪 Ce site utilise des cookies</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Nous utilisons des cookies publicitaires (Google AdSense) pour financer ce service gratuit.
                Les abonnés Premium ne voient aucune publicité.{" "}
                <Link href="/confidentialite" className="text-purple-400 hover:underline">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={decline}
                aria-label="Refuser les cookies"
                className="text-xs text-gray-400 hover:text-gray-200 px-4 py-2 border border-gray-700 rounded-lg transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                aria-label="Accepter les cookies"
                className="text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
}
