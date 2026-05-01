import { createServerClient } from "@supabase/ssr";
import { createServiceClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAsync, getClientIp } from "@/lib/rateLimiter";

export async function DELETE(req: NextRequest) {
  try {
    // Rate limiting : 5 tentatives par jour par IP
    const ip = getClientIp(req);
    const { allowed } = await checkRateLimitAsync(`delete-account:${ip}`, 5);
    if (!allowed) {
      return NextResponse.json({ error: "Trop de requêtes. Réessaie demain." }, { status: 429 });
    }

    // CSRF protection: require explicit confirmation in request body
    const body = await req.json().catch(() => ({}));
    if (body?.confirm !== "DELETE") {
      return NextResponse.json({ error: "Confirmation manquante ou invalide." }, { status: 400 });
    }

    // Récupérer l'utilisateur connecté via les cookies
    let response = NextResponse.next({ request: req });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
            response = NextResponse.next({ request: req });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    // Supprimer le compte avec le service role
    const admin = createServiceClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error("Delete account error:", error.message);
      return NextResponse.json({ error: "Impossible de supprimer le compte. Contacte le support." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
