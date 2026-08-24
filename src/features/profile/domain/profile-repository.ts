import type { UserProfile } from "./types";

export interface UpdateProfileInput {
  name: string;
  /**
   * When changed, this only *requests* the change: Supabase emails a
   * confirmation link to the new address, and `email` on the returned
   * profile stays the current (still-active) one until that's clicked.
   */
  email: string;
}

/**
 * Boundary for the user's editable profile. Name and the onboarding gate
 * are backed by Supabase's `public.profiles` table (see
 * data/supabase-profile-repository.ts); the avatar photo is unrelated to
 * auth and stays on the local IndexedDB pipeline built for it.
 */
export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(input: UpdateProfileInput): Promise<UserProfile>;
  /** Sets (or clears, with `null`) the durable avatar reference on the profile. */
  updateAvatarStorageKey(key: string | null): Promise<UserProfile>;
  /** One-way: marks first-run onboarding done. Never call this to "undo" it. */
  markOnboardingCompleted(): Promise<UserProfile>;
}
