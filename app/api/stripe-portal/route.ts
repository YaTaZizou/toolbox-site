import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // Récupérer le customerId Stripe depuis les métadonnées ou chercher par email
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: "Aucun abonnement Stripe trouvé" }, { status: 404 });
    }

    const customerId = customers.data[0].id;
    const { origin } = new URL(req.url);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profil`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: "Erreur lors de l'ouverture du portail" }, { status: 500 });
  }
}
