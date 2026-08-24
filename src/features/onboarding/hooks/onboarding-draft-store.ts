import { onboardingStorage } from "@/lib/services";
import { createEmptyOnboardingDraft, type OnboardingDraft } from "../domain/types";

/**
 * Tiny external store wrapping the persisted onboarding draft. Reading
 * through `useSyncExternalStore` (see use-onboarding-draft.ts) is the
 * React-endorsed way to pull in client-only data (localStorage) without
 * a setState-in-effect hydration flash: the server snapshot is a fixed
 * sentinel, and the real value is loaded lazily on first client read.
 */
type Listener = () => void;

const SERVER_SNAPSHOT = createEmptyOnboardingDraft();

let currentDraft: OnboardingDraft = SERVER_SNAPSHOT;
let hasLoaded = false;
const listeners = new Set<Listener>();

/**
 * True only when a persisted draft already past the first question was
 * found at load time — decided once, from the raw stored value, so later
 * in-session navigation (which also changes currentStep) never re-triggers
 * it. Module-level so it survives client-side route changes between
 * onboarding steps and only resets on a real page reload.
 */
let wasResumedFromStorage = false;
let hasNotifiedResume = false;

function ensureLoaded() {
  if (hasLoaded) return;
  hasLoaded = true;
  const stored = onboardingStorage.load();
  wasResumedFromStorage = !!stored && stored.currentStep !== "objetivo";
  currentDraft = stored ? { ...createEmptyOnboardingDraft(), ...stored } : createEmptyOnboardingDraft();
}

function notify() {
  listeners.forEach((listener) => listener());
}

export const onboardingDraftStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): OnboardingDraft {
    ensureLoaded();
    return currentDraft;
  },
  getServerSnapshot(): OnboardingDraft {
    return SERVER_SNAPSHOT;
  },
  isServerSnapshot(draft: OnboardingDraft) {
    return draft === SERVER_SNAPSHOT;
  },
  consumeResumeNotification(): boolean {
    if (!wasResumedFromStorage || hasNotifiedResume) return false;
    hasNotifiedResume = true;
    return true;
  },
  update(patch: Partial<OnboardingDraft>) {
    ensureLoaded();
    currentDraft = { ...currentDraft, ...patch, updatedAt: new Date().toISOString() };
    onboardingStorage.save(currentDraft);
    notify();
  },
  reset() {
    onboardingStorage.clear();
    currentDraft = createEmptyOnboardingDraft();
    wasResumedFromStorage = false;
    notify();
  },
};
