import type { SupabaseClient } from "@supabase/supabase-js";
import { AuthError } from "@/features/auth/domain/types";
import { mapSupabaseAuthError } from "@/features/auth/data/map-supabase-auth-error";
import type { ProfileRepository, UpdateProfileInput } from "../domain/profile-repository";
import type { ProfileImageStorage } from "../domain/profile-image-storage";
import type { AvatarKeyStorage } from "./local-avatar-key-storage";
import type { UserProfile } from "../domain/types";

interface ProfileRow {
  full_name: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProfileRepositoryDeps {
  supabase: SupabaseClient;
  imageStorage: ProfileImageStorage;
  avatarKeyStorage: AvatarKeyStorage;
}

/**
 * `full_name` and `onboarding_completed` live in `public.profiles` (see
 * supabase/migrations) and are readable/writable only for the row matching
 * `auth.uid()` — enforced by RLS, not by this file. `email` is never stored
 * here: it's read live from the auth user so it can never drift from what
 * Supabase considers the account's real, verified address.
 */
export function createSupabaseProfileRepository({
  supabase,
  imageStorage,
  avatarKeyStorage,
}: SupabaseProfileRepositoryDeps): ProfileRepository {
  async function requireAuthUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new AuthError("sessionExpired", "Sua sessão expirou. Entre novamente.");
    return user;
  }

  async function loadRow(userId: string): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, onboarding_completed, created_at, updated_at")
      .eq("id", userId)
      .single();
    if (error || !data) {
      throw new AuthError("noProfile", "Não encontramos seu perfil. Tente novamente em instantes.");
    }
    return data;
  }

  async function toUserProfile(userId: string, email: string, row: ProfileRow): Promise<UserProfile> {
    const avatarStorageKey = avatarKeyStorage.get(userId);
    const avatarUrl = avatarStorageKey ? await imageStorage.getUrl(avatarStorageKey) : null;
    return {
      id: userId,
      name: row.full_name ?? "",
      email,
      avatarStorageKey,
      avatarUrl,
      onboardingCompleted: row.onboarding_completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  return {
    async getProfile() {
      const user = await requireAuthUser();
      const row = await loadRow(user.id);
      return toUserProfile(user.id, user.email ?? "", row);
    },

    async updateProfile(input: UpdateProfileInput) {
      const user = await requireAuthUser();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: input.name, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) throw new AuthError("unavailable", "Não foi possível atualizar seu perfil agora.");

      // Keeps auth.users.user_metadata.full_name (what the Home greeting and
      // useCurrentUser() read, for a fast synchronous name) in step with the
      // profiles row (this feature's source of truth for display purposes).
      await supabase.auth.updateUser({ data: { full_name: input.name } });

      if (input.email !== (user.email ?? "").toLowerCase()) {
        // Supabase emails a confirmation link to the new address; the
        // account's email only actually changes once that's clicked, so
        // the profile returned below still reports the current one.
        const { error: emailError } = await supabase.auth.updateUser({ email: input.email });
        if (emailError) throw mapSupabaseAuthError(emailError);
      }

      const row = await loadRow(user.id);
      const { data: freshUser } = await supabase.auth.getUser();
      return toUserProfile(user.id, freshUser.user?.email ?? user.email ?? "", row);
    },

    async updateAvatarStorageKey(key: string | null) {
      const user = await requireAuthUser();
      avatarKeyStorage.set(user.id, key);
      const row = await loadRow(user.id);
      return toUserProfile(user.id, user.email ?? "", row);
    },

    async markOnboardingCompleted() {
      const user = await requireAuthUser();
      const { error } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw new AuthError("unavailable", "Não foi possível concluir essa etapa agora.");
      const row = await loadRow(user.id);
      return toUserProfile(user.id, user.email ?? "", row);
    },
  };
}
