"use client";

import { SexReferenceStep } from "@/features/onboarding/components/sex-reference-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { SexForBmrStepInput } from "@/features/onboarding/domain/schema";

export default function ReferenciaPage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("referencia");

  if (!isHydrated) return null;

  const handleSubmit = (values: SexForBmrStepInput) => {
    goNext({ sexForBmr: values.sexForBmr });
  };

  return (
    <SexReferenceStep
      defaultValues={{ sexForBmr: draft.sexForBmr ?? undefined }}
      onSubmit={handleSubmit}
    />
  );
}
