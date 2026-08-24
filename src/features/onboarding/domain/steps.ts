import {
  ONBOARDING_QUESTION_STEPS,
  type OnboardingDraft,
  type OnboardingQuestionStep,
  type OnboardingStep,
} from "./types";

export const ONBOARDING_STEP_PATHS: Record<OnboardingQuestionStep, string> = {
  objetivo: "/onboarding/objetivo",
  frequencia: "/onboarding/frequencia",
  idade: "/onboarding/idade",
  peso: "/onboarding/peso",
  altura: "/onboarding/altura",
  referencia: "/onboarding/referencia",
  atividade: "/onboarding/atividade",
};

export const RESULT_STEP_PATH = "/onboarding/resultado";

export const TOTAL_QUESTION_STEPS = ONBOARDING_QUESTION_STEPS.length;

export function getStepIndex(step: OnboardingQuestionStep): number {
  return ONBOARDING_QUESTION_STEPS.indexOf(step);
}

export function getStepPath(step: OnboardingQuestionStep): string {
  return ONBOARDING_STEP_PATHS[step];
}

export function getPreviousStepPath(step: OnboardingQuestionStep): string {
  const index = getStepIndex(step);
  if (index <= 0) return "/";
  return getStepPath(ONBOARDING_QUESTION_STEPS[index - 1]);
}

export function getNextStep(step: OnboardingQuestionStep): OnboardingStep {
  const index = getStepIndex(step);
  if (index >= TOTAL_QUESTION_STEPS - 1) return "resultado";
  return ONBOARDING_QUESTION_STEPS[index + 1];
}

export function getNextStepPath(step: OnboardingQuestionStep): string {
  const next = getNextStep(step);
  return next === "resultado" ? RESULT_STEP_PATH : getStepPath(next);
}

/**
 * Returns the earliest question step whose required answer is still
 * missing from the draft — used both to resume after a reload and to guard
 * against deep-linking past unanswered steps.
 */
export function getFirstIncompleteStep(draft: OnboardingDraft): OnboardingQuestionStep | null {
  for (const step of ONBOARDING_QUESTION_STEPS) {
    if (!isStepAnswered(step, draft)) return step;
  }
  return null;
}

export function isStepAnswered(step: OnboardingQuestionStep, draft: OnboardingDraft): boolean {
  switch (step) {
    case "objetivo":
      return draft.goal !== null && (draft.goal !== "outro" || !!draft.customGoal?.trim());
    case "frequencia":
      return draft.weeklyFrequencyAnswered;
    case "idade":
      return draft.age !== null;
    case "peso":
      return draft.weightKg !== null;
    case "altura":
      return draft.heightCm !== null;
    case "referencia":
      return draft.sexForBmr !== null;
    case "atividade":
      return draft.activityLevel !== null;
    default:
      return false;
  }
}
