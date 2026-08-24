import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNextPath } from "@/features/auth/domain/sanitize-next";

/**
 * PKCE landing point for both Google OAuth and the password-recovery email
 * link (Supabase issues a `code` for either). Never logs the code or the
 * resulting tokens. `next` is validated so this can never be used as an
 * open redirect.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next"));

  const noStoreHeaders = { "Cache-Control": "private, no-store" };

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`, { headers: noStoreHeaders });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();
        const destination = profile?.onboarding_completed ? "/trilha" : "/configuracao-habitos";
        return NextResponse.redirect(`${origin}${destination}`, { headers: noStoreHeaders });
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`, { headers: noStoreHeaders });
}
