import type { UserProfile } from "./types";

export interface UpdateProfileInput {
  name: string;
  email: string;
}

/**
 * Boundary for the user's editable profile. Today backed by localStorage
 * (see data/local-profile-repository.ts); swap the implementation for a
 * real backend later without touching any component.
 */
export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(input: UpdateProfileInput): Promise<UserProfile>;
  /** Sets (or clears, with `null`) the durable avatar reference on the profile. */
  updateAvatarStorageKey(key: string | null): Promise<UserProfile>;
}
