import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import type { AuthUser } from "../domain/types";

const STORAGE_KEY = "trilu.session.v1";

/**
 * Tracks which local user is currently "logged in" in this browser. This is
 * intentionally separate from UserProfileStorage (onboarding association):
 * a user can log in (e.g. the demo account) without ever having gone
 * through onboarding/signup.
 */
export interface SessionStorage {
  save(user: AuthUser): void;
  load(): AuthUser | null;
  clear(): void;
}

export function createSessionStorage(kv: KeyValueStorage): SessionStorage {
  return {
    save(user) {
      kv.setItem(STORAGE_KEY, JSON.stringify(user));
    },
    load() {
      const raw = kv.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        return null;
      }
    },
    clear() {
      kv.removeItem(STORAGE_KEY);
    },
  };
}
