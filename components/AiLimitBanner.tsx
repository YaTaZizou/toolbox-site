"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { AiLimitStatus } from "@/hooks/useAiLimit";

type Props = {
  remaining: number;
  isPremium: boolean;
  limit: number;
  status?: AiLimitStatus;
};

function getTimeUntilReset(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (hours === 0) return `${mins} min`;
  return `${hours}h ${mins}min`;
}

export function AiLimitBanner({ remaining, isPremium, limit, status }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilReset());
  const pathname = usePathname();

  useEffect(() => {
    if (remaining > 0 || isPremium) return;
    const id = setInterval(() => setTimeLeft(getTimeUntilReset()), 30_000);
    return () => clearInterval(id);
  }, [remaining, isPremium]);

  if (isPremium) return null;

  // ── Connexion requise → modale plein écran (bleu) ─────────────────────
  if (status === "login_required") {
    const redirectParam = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{ background: "var(--panel)", border: "1px solid rgba(59,130,246,0.35)" }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}
          >
            🔓
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Connecte-toi pour continuer gratuitement</h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
            Tu as utilisé <strong className="text-white">3 générations</strong> en tant qu&apos;invité.
            Crée un compte gratuit pour continuer jusqu&apos;à{" "}
            <strong className="text-white">{limit} générations</strong> par jour.
          </p>

          {/* CTA Principal */}
          <Link
            href={`/inscription${redirectParam}`}
            className="block w-full font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors"
            style={{ background: "#3b82f6", color: "#fff" }}
          >
            Créer un compte gratuit →
          </Link>

          {/* CTA Secondaire */}
          <Link
            href={`/connexion${redirectParam}`}
            className="block w-full font-semibold py-3 rounded-xl text-sm transition-colors"
            style={{ background: "rgba(59,130,246,0.1)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            Se connecter →
          </Link>
        </div>
      </div>
    );
  }

  // ── Limite atteinte → modale plein écran (amber/gold) ─────────────────
  if (status === "limit_reached" || remaining === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      >
        <div className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{ background: "var(--panel)", border: "1px solid rgba(250,204,21,0.25)" }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl"
            style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}
          >
            ⭐
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Limite journalière atteinte</h2>
          <p className="text-sm mb-1" style={{ color: "var(--text-2)" }}>
            Tu as utilisé tes <strong className="text-white">{limit} générations</strong> gratuites d&apos;aujourd&apos;hui.
          </p>
          <p className="text-xs mb-6 flex items-center justify-center gap-1" style={{ color: "var(--text-3)" }}>
            🕐 Réinitialisation dans <span className="font-semibold" style={{ color: "var(--text-2)" }}>{timeLeft}</span>
          </p>

          {/* CTA Principal */}
          <Link
            href="/premium"
            className="block w-full font-bold py-3.5 rounded-xl text-sm mb-3 transition-colors"
            style={{ background: "#facc15", color: "#000" }}
          >
            ⭐ Passer Premium — 3,99€/mois
          </Link>

          {/* Avantages */}
          <ul className="text-xs text-left space-y-1.5 mb-5" style={{ color: "var(--text-3)" }}>
            {["Générations IA illimitées", "Zéro publicité", "Accès prioritaire aux nouveaux outils", "Garanti 7 jours — remboursé si insatisfait"].map(item => (
              <li key={item} className="flex items-center gap-2">
                <span style={{ color: "#4ade80" }}>✓</span> {item}
              </li>
            ))}
          </ul>

          {/* Option secondaire */}
          <p className="text-xs" style={{ color: "var(--text-3)" }}>
            Ou attends la réinitialisation dans{" "}
            <span className="font-semibold" style={{ color: "var(--text-2)" }}>{timeLeft}</span>
          </p>
        </div>
      </div>
    );
  }

  // ── Barre de progression ───────────────────────────────────────────────
  const pct = (remaining / limit) * 100;
  const color =
    remaining <= 1 ? "bg-red-500" : remaining <= 2 ? "bg-yellow-500" : "bg-green-500";
  const urgency = remaining === 1;

  return (
    <div
      className={`border rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between gap-3 transition-colors ${
        urgency
          ? "bg-red-500/5 border-red-500/20"
          : "bg-gray-900 border-gray-800"
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        <div className="w-24 bg-gray-800 rounded-full h-1.5">
          <div
            className={`${color} h-1.5 rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400">
          {urgency && <span className="text-red-400 font-semibold mr-0.5">⚠️</span>}
          {remaining}/{limit} génération{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} aujourd&apos;hui
        </span>
      </div>
      <Link
        href="/premium"
        className="text-xs text-yellow-400 hover:text-yellow-300 font-medium shrink-0 transition-colors"
      >
        ⭐ Illimité
      </Link>
    </div>
  );
}
