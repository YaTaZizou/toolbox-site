/**
 * Server-side in-memory rate limiter.
 * Works per-instance (good protection against abuse in production).
 * Premium users bypass this entirely.
 */

type Entry = { count: number; date: string };

const store = new Map<string, Entry>();
const DAILY_LIMIT = 5;
const today = () => new Date().toISOString().slice(0, 10);

export function checkRateLimit(key: string): { allowed: boolean } {
  const t = today();
  const entry = store.get(key);

  if (!entry || entry.date !== t) {
    store.set(key, { count: 1, date: t });
    return { allowed: true };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false };
  }

  entry.count++;
  return { allowed: true };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "anon";
}
