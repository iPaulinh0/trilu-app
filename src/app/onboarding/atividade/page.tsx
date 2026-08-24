"use client";

import { ActivityStep } from "@/features/onboarding/components/activity-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { ActivityLevelStepInput } from "@/features/onboarding/domain/schema";
import { calculateBmr, calculateTdee } from "@/features/onboarding/domain/metabolism";

export default function AtividadePage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("atividade");

  if (!isHydrated) return null;

  const handleSubmit = (values: ActivityLevelStepInput) => {
    const { sexForBmr, weightKg, heightCm, age } = draft;
    if (sexForBmr === null || weightKg === null || heightCm === null || age === null) {
      // Guarded by useOnboardingStepPage's incomplete-step redirect; this
      // branch only exists to keep the compiler honest about nullability.
      return;
    }
    const bmr = calculateBmr({ sexForBmr, weightKg, heightCm, age });
    const tdee = calculateTdee(bmr, values.activityLevel);
    goNext({ activityLevel: values.activityLevel, bmr, tdee });
  };

  return (
    <ActivityStep
      defaultValues={{ activityLevel: draft.activityLevel ?? undefined }}
      onSubmit={handleSubmit}
    />
  );
}
