import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import type { PreferencesRepository } from "../domain/preferences-repository";
import type { ThemePreference, UserPreferences } from "../domain/types";

const PREFERENCES_KEY = "trilu.preferences.v1";
const DEFAULT_THEME: ThemePreference = "light";

export interface LocalPreferencesRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
}

export function createLocalPreferencesRepository({ kv, getUserId }: LocalPreferencesRepositoryDeps): PreferencesRepository {
  const preferences = createCollectionStorage<UserPreferences>(kv, PREFERENCES_KEY);

  function requirePreferences(): UserPreferences {
    const userId = getUserId();
    const existing = preferences.getAll().find((p) => p.userId === userId);
    if (existing) return existing;
    const seeded: UserPreferences = { userId, theme: DEFAULT_THEME, updatedAt: new Date().toISOString() };
    preferences.setAll([...preferences.getAll(), seeded]);
    return seeded;
  }

  return {
    async getPreferences() {
      return requirePreferences();
    },

    async updateTheme(theme) {
      const existing = requirePreferences();
      const updated: UserPreferences = { ...existing, theme, updatedAt: new Date().toISOString() };
      preferences.setAll(preferences.getAll().map((p) => (p.userId === updated.userId ? updated : p)));
      return updated;
    },
  };
}
