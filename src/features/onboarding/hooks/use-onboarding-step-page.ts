"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingDraft } from "./use-onboarding-draft";
import {
  getFirstIncompleteStep,
  getNextStep,
  getNextStepPath,
  getPreviousStepPath,
  getStepIndex,
  getStepPath,
} from "../domain/steps";
import type { OnboardingDraft, OnboardingQuestionStep } from "../domain/types";

/**
 * Wires a single onboarding question screen to the shared draft: keeps
 * `currentStep` pointing at the step being viewed (so a reload resumes
 * exactly here), redirects away if a required earlier answer is missing,
 * and exposes back/next navigation bound to that step's neighbors.
 */
export function useOnboardingStepPage(step: OnboardingQuestionStep) {
  const router = useRouter();
  const { draft, isHydrated, updateDraft, resetDraft } = useOnboardingDraft();

  useEffect(() => {
    if (!isHydrated) return;
    const firstIncomplete = getFirstIncompleteStep(draft);
    if (firstIncomplete && getStepIndex(step) > getStepIndex(firstIncomplete)) {
      router.replace(getStepPath(firstIncomplete));
      return;
    }
    if (draft.currentStep !== step) {
      updateDraft({ currentStep: step });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, step]);

  const goNext = (patch: Partial<OnboardingDraft>) => {
    updateDraft({ ...patch, currentStep: getNextStep(step) });
    router.push(getNextStepPath(step));
  };

  const goBack = () => {
    router.push(getPreviousStepPath(step));
  };

  return { draft, isHydrated, goNext, goBack, resetDraft };
}
