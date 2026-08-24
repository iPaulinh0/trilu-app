"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { onboardingDraftStore } from "./onboarding-draft-store";
import type { OnboardingDraft, OnboardingStep } from "../domain/types";

export function useOnboardingDraft() {
  const draft = useSyncExternalStore(
    onboardingDraftStore.subscribe,
    onboardingDraftStore.getSnapshot,
    onboardingDraftStore.getServerSnapshot,
  );
  const isHydrated = !onboardingDraftStore.isServerSnapshot(draft);

  useEffect(() => {
    if (!isHydrated) return;
    if (onboardingDraftStore.consumeResumeNotification()) {
      toast.info("Continuando de onde você parou.");
    }
  }, [isHydrated]);

  const updateDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    onboardingDraftStore.update(patch);
  }, []);

  const setCurrentStep = useCallback((step: OnboardingStep) => {
    onboardingDraftStore.update({ currentStep: step });
  }, []);

  const resetDraft = useCallback(() => {
    onboardingDraftStore.reset();
  }, []);

  return { draft, isHydrated, updateDraft, setCurrentStep, resetDraft };
}
