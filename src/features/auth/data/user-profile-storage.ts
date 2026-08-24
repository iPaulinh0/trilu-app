import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import type { AuthUser } from "../domain/types";
import type { OnboardingDraft } from "@/features/onboarding/domain/types";

const STORAGE_KEY = "trilu.user.profile.v1";

/**
 * Local snapshot linking an authenticated user to their onboarding answers.
 * Never includes a password. This is scaffolding for a future backend sync,
 * not a session/auth token store.
 */
export interface LocalUserProfile {
  user: AuthUser;
  onboarding: Omit<OnboardingDraft, "currentStep" | "updatedAt">;
  createdAt: string;
}

export interface UserProfileStorage {
  save(profile: LocalUserProfile): void;
  load(): LocalUserProfile | null;
}

export function createUserProfileStorage(kv: KeyValueStorage): UserProfileStorage {
  return {
    save(profile) {
      kv.setItem(STORAGE_KEY, JSON.stringify(profile));
    },
    load() {
      const raw = kv.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as LocalUserProfile;
      } catch {
        return null;
      }
    },
  };
}
