"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Enregistrement du service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((err) => console.warn("SW registration failed:", err));
    }

    // Détection de l'état réseau
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    // État initial
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 12,
        background: "#1f2937",
        border: "1px solid #374151",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        fontSize: 13,
        fontWeight: 500,
        color: "#f9fafb",
        whiteSpace: "nowrap",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 6c0 0 5-6 11-6s11 6 11 6" />
        <path d="M5 10c0 0 3-4 7-4s7 4 7 4" />
        <path d="M9 14c0 0 1-2 3-2s3 2 3 2" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
      Mode hors-ligne — certaines fonctions sont limitées
    </div>
  );
}
