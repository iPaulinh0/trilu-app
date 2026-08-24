/** Pure domain types for the user profile and app preferences. No React, no DOM, no Next.js. */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  /** Durable reference into ProfileImageStorage — never a blob:/object URL. */
  avatarStorageKey: string | null;
  /** Resolved, display-ready URL for the current avatar — derived at read time, never persisted. */
  avatarUrl: string | null;
  /** Mirrors `profiles.onboarding_completed` — the redirect gate between onboarding and Home. */
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ThemePreference = "light" | "dark";

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  updatedAt: string;
}
