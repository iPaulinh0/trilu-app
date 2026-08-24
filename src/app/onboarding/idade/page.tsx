"use client";

import { AgeStep } from "@/features/onboarding/components/age-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { AgeStepInput } from "@/features/onboarding/domain/schema";

export default function IdadePage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("idade");

  if (!isHydrated) return null;

  const handleSubmit = (values: AgeStepInput) => {
    goNext({ age: values.age });
  };

  return <AgeStep defaultValues={{ age: draft.age ?? undefined }} onSubmit={handleSubmit} />;
}
