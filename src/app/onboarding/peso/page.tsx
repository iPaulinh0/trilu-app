"use client";

import { WeightStep, type WeightStepResult } from "@/features/onboarding/components/weight-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";

export default function PesoPage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("peso");

  if (!isHydrated) return null;

  const handleSubmit = (values: WeightStepResult) => {
    goNext({ weightKg: values.weightKg });
  };

  return <WeightStep defaultValue={draft.weightKg} onSubmit={handleSubmit} />;
}
