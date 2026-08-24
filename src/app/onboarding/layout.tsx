"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ScreenShell } from "@/components/shared/screen-shell";
import { StepHeader } from "@/components/shared/step-header";
import { Logo } from "@/components/shared/logo";
import {
  ONBOARDING_STEP_PATHS,
  getPreviousStepPath,
  getStepIndex,
  TOTAL_QUESTION_STEPS,
} from "@/features/onboarding/domain/steps";
import type { OnboardingQuestionStep } from "@/features/onboarding/domain/types";

function findQuestionStep(pathname: string): OnboardingQuestionStep | null {
  const entry = Object.entries(ONBOARDING_STEP_PATHS).find(([, path]) => path === pathname);
  return entry ? (entry[0] as OnboardingQuestionStep) : null;
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const questionStep = findQuestionStep(pathname);
  const isResult = pathname === "/onboarding/resultado";

  return (
    <ScreenShell>
      {questionStep ? (
        <StepHeader
          onBack={() => router.push(getPreviousStepPath(questionStep))}
          stepIndex={getStepIndex(questionStep) + 1}
          totalSteps={TOTAL_QUESTION_STEPS}
        />
      ) : isResult ? (
        <div className="flex items-center pb-2">
          <Logo height={22} />
        </div>
      ) : null}
      {children}
    </ScreenShell>
  );
}
