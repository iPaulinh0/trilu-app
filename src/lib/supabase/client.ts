import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components. Session cookies are handled
 * automatically by @supabase/ssr (via document.cookie) so this stays in
 * sync with the server-rendered session — never read `localStorage`
 * directly for auth state.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
