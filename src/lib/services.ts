import { createWebKeyValueStorage } from "@/lib/storage/web-kv-storage";
import { createOnboardingStorage } from "@/features/onboarding/data/onboarding-storage";
import { createMockAuthService } from "@/features/auth/data/mock-auth-service";
import { createUserProfileStorage } from "@/features/auth/data/user-profile-storage";

/**
 * Composition root for the web app. Every feature depends on interfaces
 * (OnboardingStorage, AuthService, UserProfileStorage) — only this file
 * knows they're currently backed by localStorage + an in-memory mock.
 */
const webKeyValueStorage = createWebKeyValueStorage();

export const onboardingStorage = createOnboardingStorage(webKeyValueStorage);
export const userProfileStorage = createUserProfileStorage(webKeyValueStorage);
export const authService = createMockAuthService();
