import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./app-shell";

/**
 * Server-side gate for every authenticated tab (Trilha/Treinos/Perfil).
 * Never trusts a client-supplied session: `getClaims()` verifies the JWT
 * (against the project's JWKS, or the Auth server as a fallback) before any
 * of this layout's children ever render or fetch data.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", data.claims.sub)
    .single();

  if (!profile?.onboarding_completed) redirect("/configuracao-habitos");

  return <AppShell>{children}</AppShell>;
}
