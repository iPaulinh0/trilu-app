"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";
import { getFirstIncompleteStep, getStepPath, RESULT_STEP_PATH } from "@/features/onboarding/domain/steps";

/** Entry point: resumes at the first unanswered question, or the result screen. */
export default function OnboardingIndexPage() {
  const router = useRouter();
  const { draft, isHydrated } = useOnboardingDraft();

  useEffect(() => {
    if (!isHydrated) return;
    const firstIncomplete = getFirstIncompleteStep(draft);
    router.replace(firstIncomplete ? getStepPath(firstIncomplete) : RESULT_STEP_PATH);
  }, [isHydrated, draft, router]);

  return null;
}
