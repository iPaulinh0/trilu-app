import type { SupabaseClient, User } from "@supabase/supabase-js";
import { mapSupabaseAuthError, mapVerifyOtpError } from "./map-supabase-auth-error";
import type { AuthService } from "../domain/auth-service";
import type { AuthUser } from "../domain/types";

function toAuthUser(user: User): AuthUser {
  const fullName = user.user_metadata?.full_name;
  return {
    id: user.id,
    name: typeof fullName === "string" ? fullName : "",
    email: user.email ?? "",
  };
}

/**
 * Real AuthService, backed by Supabase Auth. Takes the browser client as a
 * dependency (rather than importing `@/lib/supabase/client` directly) so it
 * stays framework-agnostic — a React Native port only needs to hand this
 * factory an AsyncStorage-backed Supabase client.
 */
export function createSupabaseAuthService(supabase: SupabaseClient): AuthService {
  return {
    async signUpWithEmail({ name, email, password }) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw mapSupabaseAuthError(error);
    },

    async verifyEmailCode({ email, code }) {
      const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
      if (error) throw mapVerifyOtpError(error);
    },

    async resendEmailCode(email) {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw mapSupabaseAuthError(error);
    },

    async signInWithPassword({ email, password }) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw mapSupabaseAuthError(error);
    },

    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: "openid email profile",
        },
      });
      if (error) throw mapSupabaseAuthError(error);
    },

    async requestPasswordReset(email) {
      // Routed through /auth/callback (not straight to /redefinir-senha)
      // because Supabase's recovery link is a PKCE code, same as OAuth —
      // it needs exchangeCodeForSession before a session exists.
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/redefinir-senha")}`,
      });
      if (error) throw mapSupabaseAuthError(error);
    },

    async updatePassword(password) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw mapSupabaseAuthError(error);
    },

    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw mapSupabaseAuthError(error);
    },

    async getAuthenticatedUser() {
      // getUser() re-validates against the server, unlike getSession() which
      // just trusts the locally-stored token — required for anything used
      // to gate UI, per Supabase's own guidance.
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return toAuthUser(data.user);
    },
  };
}

export { toAuthUser };
