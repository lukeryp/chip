import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

interface CookieItem {
  name: string;
  value: string;
  options?: CookieOptions;
}

export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  // createServerClient<Database> passes Schema as SchemaName to SupabaseClient,
  // breaking generic resolution in @supabase/ssr@0.5.2. Cast via unknown to SupabaseClient<Database>
  // which correctly resolves Insert/Update types. RLS + auth remain fully enforced.
  const client = createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieItem[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            );
          } catch {
            // Server Component — ignore set errors
          }
        },
      },
    }
  );

  return client as unknown as SupabaseClient<Database>;
}
