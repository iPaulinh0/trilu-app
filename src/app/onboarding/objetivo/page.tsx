"use client";

import { GoalStep } from "@/features/onboarding/components/goal-step";
import { useOnboardingStepPage } from "@/features/onboarding/hooks/use-onboarding-step-page";
import type { GoalStepInput } from "@/features/onboarding/domain/schema";

export default function ObjetivoPage() {
  const { draft, isHydrated, goNext } = useOnboardingStepPage("objetivo");

  if (!isHydrated) return null;

  const handleSubmit = (values: GoalStepInput) => {
    goNext({ goal: values.goal, customGoal: values.goal === "outro" ? values.customGoal ?? "" : null });
  };

  return (
    <GoalStep
      defaultValues={{ goal: draft.goal ?? undefined, customGoal: draft.customGoal ?? "" }}
      onSubmit={handleSubmit}
    />
  );
}
