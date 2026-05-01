import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export async function GET(req: NextRequest) {
  // Rate limiting : 20 tentatives par jour par IP (protection bruteforce de codes OAuth)
  const ip = getClientIp(req);
  const { allowed } = await checkRateLimitAsync(`auth-callback:${ip}`, 20);
  if (!allowed) {
    return NextResponse.redirect(new URL("/connexion?error=rate_limit", req.url));
  }

  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  // Prevent open redirect: next must start with "/" but not "//" (which would be protocol-relative)
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Email de bienvenue pour les nouveaux comptes (< 60s)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const createdAt = new Date(session.user.created_at).getTime();
        const isNewUser = Date.now() - createdAt < 60000;
        if (isNewUser && session.user.email) {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "ToolBox <contact@alltoolbox.fr>",
            to: session.user.email,
            subject: "Bienvenue sur ToolBox ! 🎉",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
                <h1 style="color: #a78bfa; font-size: 24px; margin-bottom: 16px;">⚡ Bienvenue sur ToolBox !</h1>
                <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 16px;">Ton compte est prêt. Tu as maintenant accès à plus de 30 outils gratuits : PDF, image, vidéo, IA, et bien plus.</p>
                <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px 0; color: #e2e8f0; font-weight: bold;">🚀 Outils populaires :</p>
                  <ul style="margin: 0; padding-left: 16px; color: #94a3b8; line-height: 2;">
                    <li><a href="https://alltoolbox.fr/pdf" style="color: #a78bfa;">Outils PDF</a> — fusionner, compresser, modifier</li>
                    <li><a href="https://alltoolbox.fr/ocr" style="color: #a78bfa;">OCR</a> — extraire le texte d'une image</li>
                    <li><a href="https://alltoolbox.fr/correcteur" style="color: #a78bfa;">Correcteur IA</a> — améliorer tes textes</li>
                  </ul>
                </div>
                <a href="https://alltoolbox.fr/premium" style="display: inline-block; background: #eab308; color: #000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">⭐ Découvrir Premium — 3,99€/mois</a>
                <p style="color: #475569; font-size: 12px;">L'équipe ToolBox — <a href="https://alltoolbox.fr" style="color: #a78bfa;">alltoolbox.fr</a></p>
              </div>
            `,
          }).catch(() => {}); // Silencieux
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?error=oauth`);
}
