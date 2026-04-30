import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // Vérifier auth + premium
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_subscribed")
    .eq("id", user.id)
    .single();

  if (!profile?.is_subscribed) {
    return NextResponse.json({ error: "Réservé aux membres Premium" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const scale = Math.min(Math.max(parseInt(formData.get("scale") as string) || 2, 1), 4);
  const mode = (formData.get("mode") as string) || "standard";

  if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = sharp(buffer);
  const meta = await image.metadata();

  const newW = Math.round((meta.width || 800) * scale);
  const newH = Math.round((meta.height || 600) * scale);

  // Paramètres selon le mode
  const sharpParams = {
    subtil:   { sigma: 0.8, m1: 0.5, m2: 1.0 },
    standard: { sigma: 1.2, m1: 1.2, m2: 1.8 },
    intense:  { sigma: 1.8, m1: 2.0, m2: 3.0 },
  }[mode] ?? { sigma: 1.2, m1: 1.2, m2: 1.8 };

  const saturation = mode === "intense" ? 1.15 : mode === "standard" ? 1.08 : 1.03;

  const result = await image
    .resize(newW, newH, { kernel: "lanczos3", fastShrinkOnLoad: false })
    .sharpen({ sigma: sharpParams.sigma, m1: sharpParams.m1, m2: sharpParams.m2 })
    .modulate({ brightness: 1.02, saturation })
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();

  return new NextResponse(new Uint8Array(result), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="toolbox-enhanced.png"`,
    },
  });
}
