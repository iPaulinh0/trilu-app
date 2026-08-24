"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser } from "../domain/types";

/**
 * Distinguishes "haven't heard from Supabase yet" (first paint) from
 * "checked, nobody's logged in" — both would otherwise collapse to `null`
 * and make redirect guards fire one render too early.
 */
const UNLOADED = Symbol("unloaded");
type UserSnapshot = AuthUser | null | typeof UNLOADED;

function toAuthUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> | null }): AuthUser {
  const fullName = user.user_metadata?.full_name;
  return { id: user.id, name: typeof fullName === "string" ? fullName : "", email: user.email ?? "" };
}

/**
 * Reactive client-side auth state, subscribed directly to Supabase's own
 * `onAuthStateChange` — not routed through AuthService, whose interface
 * models imperative actions (sign in/out/up), not state subscription.
 *
 * This is UI state, not an authorization check: it trusts whatever session
 * Supabase already has cached locally. Anything that actually gates access
 * to data must re-verify server-side with `getClaims()` (see
 * src/app/(app)/layout.tsx) — never this hook.
 */
export function useCurrentUser(): { user: AuthUser | null; isHydrated: boolean } {
  const [snapshot, setSnapshot] = useState<UserSnapshot>(UNLOADED);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSnapshot(session?.user ? toAuthUser(session.user) : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isHydrated = snapshot !== UNLOADED;
  return { user: isHydrated ? (snapshot as AuthUser | null) : null, isHydrated };
}
