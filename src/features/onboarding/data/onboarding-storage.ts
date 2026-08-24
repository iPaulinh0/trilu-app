import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import type { OnboardingDraft } from "../domain/types";

const STORAGE_KEY = "trilu.onboarding.draft.v1";

export interface OnboardingStorage {
  load(): OnboardingDraft | null;
  save(draft: OnboardingDraft): void;
  clear(): void;
}

/**
 * Builds an OnboardingStorage on top of any KeyValueStorage implementation.
 * Depends only on the KV interface (a type), never on a concrete platform
 * API — swap in an AsyncStorage-backed KeyValueStorage for React Native
 * without touching this file.
 */
export function createOnboardingStorage(kv: KeyValueStorage): OnboardingStorage {
  return {
    load() {
      const raw = kv.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as Partial<OnboardingDraft>;
        if (!parsed || typeof parsed !== "object") return null;
        return parsed as OnboardingDraft;
      } catch {
        return null;
      }
    },
    save(draft) {
      kv.setItem(STORAGE_KEY, JSON.stringify(draft));
    },
    clear() {
      kv.removeItem(STORAGE_KEY);
    },
  };
}
