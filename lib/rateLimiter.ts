/**
 * Rate limiter — Upstash Redis en production, in-memory en local/fallback.
 * Variables d'env requises pour Upstash :
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

// ── Fallback in-memory (local dev ou Upstash non configuré) ──────────────────
type Entry = { count: number; date: string };
const store = new Map<string, Entry>();
const today = () => new Date().toISOString().slice(0, 10);

function inMemoryLimit(key: string, limit: number): { allowed: boolean } {
  const t = today();
  const entry = store.get(key);
  if (!entry || entry.date !== t) {
    store.set(key, { count: 1, date: t });
    return { allowed: true };
  }
  if (entry.count >= limit) return { allowed: false };
  entry.count++;
  return { allowed: true };
}

// ── Upstash Redis ─────────────────────────────────────────────────────────────
let upstashClient: import("@upstash/redis").Redis | null = null;

async function getUpstash() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!upstashClient) {
    const { Redis } = await import("@upstash/redis");
    upstashClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return upstashClient;
}

async function upstashLimit(key: string, limit: number): Promise<{ allowed: boolean }> {
  try {
    const redis = await getUpstash();
    if (!redis) return inMemoryLimit(key, limit);

    const dayKey = `rl:${key}:${today()}`;
    const count = await redis.incr(dayKey);
    if (count === 1) {
      // Expire à minuit (secondes restantes dans la journée)
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const ttl = Math.ceil((midnight.getTime() - now.getTime()) / 1000);
      await redis.expire(dayKey, ttl);
    }
    return { allowed: count <= limit };
  } catch (err) {
    console.warn("Upstash error, falling back to in-memory:", err);
    return inMemoryLimit(key, limit);
  }
}

// ── Export principal ──────────────────────────────────────────────────────────
const DAILY_LIMIT = 5;

export async function checkRateLimitAsync(key: string, limit = DAILY_LIMIT): Promise<{ allowed: boolean }> {
  return upstashLimit(key, limit);
}

export function getClientIp(req: Request): string {
  // Vercel injecte x-real-ip de façon fiable — prioritaire sur x-forwarded-for
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  // x-forwarded-for peut contenir plusieurs IPs séparées par virgule
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "anon";
}
