"use client";

import { HeightStep } from "@/features/onboarding/components/height-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { HeightStepInput } from "@/features/onboarding/domain/schema";

export default function AlturaPage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("altura");

  if (!isHydrated) return null;

  const handleSubmit = (values: HeightStepInput) => {
    goNext({ heightCm: values.heightCm });
  };

  return (
    <HeightStep defaultValues={{ heightCm: draft.heightCm ?? undefined }} onSubmit={handleSubmit} />
  );
}
