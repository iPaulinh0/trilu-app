"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";
import { ResultStep } from "@/features/onboarding/components/result-step";
import { getFirstIncompleteStep, getStepPath } from "@/features/onboarding/domain/steps";

export default function ResultadoPage() {
  const router = useRouter();
  const { draft, isHydrated } = useOnboardingDraft();

  useEffect(() => {
    if (!isHydrated) return;
    const firstIncomplete = getFirstIncompleteStep(draft);
    if (firstIncomplete) {
      router.replace(getStepPath(firstIncomplete));
    }
  }, [isHydrated, draft, router]);

  if (!isHydrated || draft.bmr === null || draft.tdee === null) return null;

  return (
    <ResultStep
      draft={draft}
      onEdit={() => router.push("/onboarding/objetivo")}
      onContinue={() => router.push("/cadastro")}
    />
  );
}
