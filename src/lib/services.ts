import { createWebKeyValueStorage } from "@/lib/storage/web-kv-storage";
import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createOnboardingStorage } from "@/features/onboarding/data/onboarding-storage";
import { getGoalLabel } from "@/features/onboarding/domain/format";
import { createSupabaseAuthService } from "@/features/auth/data/supabase-auth-service";
import { createUserProfileStorage } from "@/features/auth/data/user-profile-storage";
import { createPendingEmailStorage } from "@/features/auth/data/pending-email-storage";
import { createLocalTrailRepository } from "@/features/trail/data/local-trail-repository";
import { createLocalHabitRepository } from "@/features/habits/data/local-habit-repository";
import { createLocalHomeRepository } from "@/features/home/data/local-home-repository";
import { createLocalCustomExerciseRepository } from "@/features/exercises/data/local-custom-exercise-repository";
import { createUsedExerciseIndex } from "@/features/exercises/data/used-exercise-index";
import { createHttpExerciseCatalogProvider } from "@/features/exercises/data/http-exercise-catalog-provider";
import { createLocalWorkoutRepository } from "@/features/workouts/data/local-workout-repository";
import { createLocalWorkoutSessionRepository } from "@/features/workouts/data/local-workout-session-repository";
import { createSupabaseProfileRepository } from "@/features/profile/data/supabase-profile-repository";
import { createIndexedDbProfileImageStorage } from "@/features/profile/data/indexeddb-profile-image-storage";
import { createLocalAvatarKeyStorage } from "@/features/profile/data/local-avatar-key-storage";
import { createLocalPreferencesRepository } from "@/features/profile/data/local-preferences-repository";

/**
 * Composition root for the web app. Every feature depends on interfaces
 * (OnboardingStorage, AuthService, HabitRepository, TrailRepository,
 * HomeRepository…) — only this file knows most of them are backed by
 * localStorage, and that auth/profile are backed by Supabase. Swapping any
 * of them later means changing only this file.
 */
const webKeyValueStorage = createWebKeyValueStorage();
const supabase = createSupabaseBrowserClient();

export const onboardingStorage = createOnboardingStorage(webKeyValueStorage);
export const userProfileStorage = createUserProfileStorage(webKeyValueStorage);
export const pendingEmailStorage = createPendingEmailStorage();
export const authService = createSupabaseAuthService(supabase);

/**
 * Mirrors Supabase's own reactive auth state into a value every other
 * (synchronous) local repository's `getUserId()` can read. This is not a
 * second session store — no tokens live here, only the id/name/email
 * Supabase already reports via `onAuthStateChange` — but existing
 * repositories (habits, workouts, trail, …) call `getUserId()` as a plain
 * sync function, and rewriting all of them to be async is out of scope for
 * this auth integration.
 */
let currentUserId: string | null = null;
let currentUserName = "";

supabase.auth.onAuthStateChange((_event, session) => {
  currentUserId = session?.user?.id ?? null;
  const fullName = session?.user?.user_metadata?.full_name;
  currentUserName = typeof fullName === "string" ? fullName : "";
});

/** Throws when called outside an authenticated route — those must guard first. */
function getCurrentUserId(): string {
  if (!currentUserId) throw new Error("Nenhum usuário autenticado.");
  return currentUserId;
}

function getCurrentUserFirstName(): string {
  const name = currentUserName.trim();
  return name ? name.split(" ")[0] : "Você";
}

function getDefaultTrailTitle(): string {
  const onboarding = userProfileStorage.load()?.onboarding;
  if (!onboarding) return "Minha trilha";
  return getGoalLabel(onboarding.goal, onboarding.customGoal) || "Minha trilha";
}

function getOnboardingWeeklyFrequency(): number | null {
  const onboarding = userProfileStorage.load()?.onboarding;
  return onboarding?.weeklyFrequency ?? null;
}

export const trailRepository = createLocalTrailRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
  getDefaultTitle: getDefaultTrailTitle,
});

export const habitRepository = createLocalHabitRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
  trailRepository,
});

export const workoutSessionRepository = createLocalWorkoutSessionRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
  trailRepository,
});

export const profileImageStorage = createIndexedDbProfileImageStorage();

export const profileRepository = createSupabaseProfileRepository({
  supabase,
  imageStorage: profileImageStorage,
  avatarKeyStorage: createLocalAvatarKeyStorage(webKeyValueStorage),
});

export const preferencesRepository = createLocalPreferencesRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
});

export const homeRepository = createLocalHomeRepository({
  habitRepository,
  trailRepository,
  getUserFirstName: getCurrentUserFirstName,
  getWeeklyFrequency: getOnboardingWeeklyFrequency,
  hasActiveWorkoutSession: async () => (await workoutSessionRepository.getActiveSession()) !== null,
  getUserAvatarUrl: async () => (await profileRepository.getProfile()).avatarUrl,
});

/**
 * Where to send the user right after login/signup/OAuth: first-run habit
 * setup if `profiles.onboarding_completed` is still false, the Home
 * otherwise. Requires an already-established session (call after
 * sign-in/verifyOtp/OAuth exchange resolves). Falls back to onboarding —
 * never Home — if the profile can't be read, since a brand-new user with a
 * not-yet-visible profile row should never land mid-app.
 */
export async function resolvePostAuthPath(): Promise<string> {
  try {
    const profile = await profileRepository.getProfile();
    return profile.onboardingCompleted ? "/trilha" : "/configuracao-habitos";
  } catch {
    return "/configuracao-habitos";
  }
}

export const customExerciseRepository = createLocalCustomExerciseRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
});

const usedExerciseIndex = createUsedExerciseIndex(webKeyValueStorage);

export const exerciseCatalogProvider = createHttpExerciseCatalogProvider({
  customExerciseRepository,
  usedExerciseIndex,
  getUserId: getCurrentUserId,
});

/** Records that an exercise was added to a template, for the "already used" search tier. */
export function recordExerciseUsage(item: Parameters<typeof usedExerciseIndex.record>[1]): void {
  usedExerciseIndex.record(getCurrentUserId(), item);
}

export const workoutRepository = createLocalWorkoutRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
  getLastExecutionDateKey: (templateId) => workoutSessionRepository.getLastCompletedDateKeyForTemplate(templateId),
});
