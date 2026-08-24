import { createWebKeyValueStorage } from "@/lib/storage/web-kv-storage";
import { createOnboardingStorage } from "@/features/onboarding/data/onboarding-storage";
import { getGoalLabel } from "@/features/onboarding/domain/format";
import { createMockAuthService } from "@/features/auth/data/mock-auth-service";
import { createUserProfileStorage } from "@/features/auth/data/user-profile-storage";
import { createSessionStorage } from "@/features/auth/data/session-storage";
import { createUserProgressStorage } from "@/features/auth/data/user-progress-storage";
import { createLocalTrailRepository } from "@/features/trail/data/local-trail-repository";
import { createLocalHabitRepository } from "@/features/habits/data/local-habit-repository";
import { createLocalHomeRepository } from "@/features/home/data/local-home-repository";
import { createLocalCustomExerciseRepository } from "@/features/exercises/data/local-custom-exercise-repository";
import { createUsedExerciseIndex } from "@/features/exercises/data/used-exercise-index";
import { createHttpExerciseCatalogProvider } from "@/features/exercises/data/http-exercise-catalog-provider";
import { createLocalWorkoutRepository } from "@/features/workouts/data/local-workout-repository";
import { createLocalWorkoutSessionRepository } from "@/features/workouts/data/local-workout-session-repository";
import { createLocalProfileRepository } from "@/features/profile/data/local-profile-repository";
import { createIndexedDbProfileImageStorage } from "@/features/profile/data/indexeddb-profile-image-storage";
import { createLocalPreferencesRepository } from "@/features/profile/data/local-preferences-repository";

/**
 * Composition root for the web app. Every feature depends on interfaces
 * (OnboardingStorage, AuthService, HabitRepository, TrailRepository,
 * HomeRepository…) — only this file knows they're currently backed by
 * localStorage + an in-memory mock. Swapping any of them for a real backend
 * later means changing only this file.
 */
const webKeyValueStorage = createWebKeyValueStorage();

export const onboardingStorage = createOnboardingStorage(webKeyValueStorage);
export const userProfileStorage = createUserProfileStorage(webKeyValueStorage);
export const authService = createMockAuthService();
export const authSessionStorage = createSessionStorage(webKeyValueStorage);
export const userProgressStorage = createUserProgressStorage(webKeyValueStorage);

/** Throws when called outside an authenticated route — those must guard first. */
function getCurrentUserId(): string {
  const user = authSessionStorage.load();
  if (!user) throw new Error("Nenhum usuário autenticado.");
  return user.id;
}

function getCurrentUserFirstName(): string {
  const user = authSessionStorage.load();
  const name = user?.name?.trim();
  return name ? name.split(" ")[0] : "Você";
}

/** Throws — same contract as getCurrentUserId — when called outside an authenticated route. */
function getSessionUser() {
  const user = authSessionStorage.load();
  if (!user) throw new Error("Nenhum usuário autenticado.");
  return user;
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

export const profileRepository = createLocalProfileRepository({
  kv: webKeyValueStorage,
  getUserId: getCurrentUserId,
  getSessionUser,
  imageStorage: profileImageStorage,
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
 * Where to send the user right after login/signup: first-run habit setup
 * if they haven't finished it yet, the Home otherwise. Used by both
 * LoginForm and SignupForm so the rule lives in exactly one place.
 */
export function resolvePostAuthPath(userId: string): string {
  const progress = userProgressStorage.ensure(userId);
  return progress.habitSetupCompleted ? "/trilha" : "/configuracao-habitos";
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
