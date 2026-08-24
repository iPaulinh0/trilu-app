import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps the Supabase session cookie fresh on every request (refreshing an
 * expiring access token before it reaches a Server Component, where cookies
 * can no longer be written). This file does NOT decide who can see which
 * route — actual authorization happens per-route via `getClaims()` in
 * Server Components (see src/app/(app)/layout.tsx), matching Next.js's own
 * guidance to never rely on proxy/middleware alone for authorization.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // Triggers a token refresh (writing the new cookie above via setAll) when needed.
  await supabase.auth.getClaims();

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and Next's own image
     * optimizer, so real pages/route handlers always see a fresh session.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
