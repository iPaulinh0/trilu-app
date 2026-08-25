"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";
import { ResultStep } from "@/features/onboarding/components/result-step";
import { BuildingTrailLoader } from "@/features/onboarding/components/building-trail-loader";
import { getFirstIncompleteStep, getStepPath } from "@/features/onboarding/domain/steps";

export default function ResultadoPage() {
  const router = useRouter();
  const { draft, isHydrated } = useOnboardingDraft();
  const [isBuildingTrail, setIsBuildingTrail] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    const firstIncomplete = getFirstIncompleteStep(draft);
    if (firstIncomplete) {
      router.replace(getStepPath(firstIncomplete));
    }
  }, [isHydrated, draft, router]);

  if (!isHydrated || draft.bmr === null || draft.tdee === null) return null;

  if (isBuildingTrail) {
    return <BuildingTrailLoader onComplete={() => router.push("/cadastro")} />;
  }

  return (
    <ResultStep
      draft={draft}
      onEdit={() => router.push("/onboarding/objetivo")}
      onContinue={() => setIsBuildingTrail(true)}
    />
  );
}
