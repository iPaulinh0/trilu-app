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

export const homeRepository = createLocalHomeRepository({
  habitRepository,
  trailRepository,
  getUserFirstName: getCurrentUserFirstName,
  getWeeklyFrequency: getOnboardingWeeklyFrequency,
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
