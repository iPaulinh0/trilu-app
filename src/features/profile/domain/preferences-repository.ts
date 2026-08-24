import type { ThemePreference, UserPreferences } from "./types";

/**
 * Domain-level record of the user's preferences (today: only theme). This is
 * separate from next-themes' own rendering/persistence: next-themes owns
 * *applying* the theme class and surviving a reload before hydration;
 * this repository is the per-user record kept for a future backend sync.
 * The two are kept in sync by the settings UI, not by this interface.
 */
export interface PreferencesRepository {
  getPreferences(): Promise<UserPreferences>;
  updateTheme(theme: ThemePreference): Promise<UserPreferences>;
}
