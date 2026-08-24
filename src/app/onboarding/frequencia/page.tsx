"use client";

import { FrequencyStep, type FrequencyStepResult } from "@/features/onboarding/components/frequency-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { FrequencySelection } from "@/features/onboarding/domain/schema";

export default function FrequenciaPage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("frequencia");

  if (!isHydrated) return null;

  const defaultSelection: FrequencySelection | undefined = draft.weeklyFrequencyAnswered
    ? (draft.weeklyFrequency === null ? "unknown" : (String(draft.weeklyFrequency) as FrequencySelection))
    : undefined;

  const handleSubmit = ({ weeklyFrequency }: FrequencyStepResult) => {
    goNext({ weeklyFrequency, weeklyFrequencyAnswered: true });
  };

  return <FrequencyStep defaultSelection={defaultSelection} onSubmit={handleSubmit} />;
}
