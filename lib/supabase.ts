import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client navigateur — stocke la session dans les cookies ET localStorage
// pour que le middleware puisse la lire et maintenir la connexion
export function createSupabaseBrowser() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Gardé pour compatibilité côté serveur uniquement
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
