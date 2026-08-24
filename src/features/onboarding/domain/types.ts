/**
 * Pure domain types for the onboarding flow. No React, no DOM, no Next.js —
 * this module must stay portable to a future React Native client.
 */

export type Goal =
  | "voltarRotina"
  | "ganharForca"
  | "ganharMassa"
  | "perderGordura"
  | "melhorarCondicionamento"
  | "competirComigoMesmo"
  | "outro";

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "voltarRotina", label: "Voltar à rotina" },
  { value: "ganharForca", label: "Ganhar força" },
  { value: "ganharMassa", label: "Ganhar massa muscular" },
  { value: "perderGordura", label: "Perder gordura" },
  { value: "melhorarCondicionamento", label: "Melhorar o condicionamento" },
  { value: "competirComigoMesmo", label: "Competir comigo mesmo" },
  { value: "outro", label: "Outro objetivo" },
];

/**
 * The biological reference used by the BMR equation. Deliberately distinct
 * from gender identity — the app never asks "gender", only which formula
 * reference to use for the metabolic estimate.
 */
export type SexForBmr = "female" | "male";

export type ActivityLevel =
  | "sedentary"
  | "lightlyActive"
  | "moderatelyActive"
  | "veryActive"
  | "extremelyActive";

export const ACTIVITY_LEVEL_OPTIONS: {
  value: ActivityLevel;
  title: string;
  description: string;
}[] = [
  {
    value: "sedentary",
    title: "Sedentário",
    description: "Pouco ou nenhum exercício",
  },
  {
    value: "lightlyActive",
    title: "Levemente ativo",
    description: "Exercício leve ou atividade leve diária",
  },
  {
    value: "moderatelyActive",
    title: "Moderadamente ativo",
    description: "Exercício moderado ou rotina moderadamente ativa",
  },
  {
    value: "veryActive",
    title: "Muito ativo",
    description: "Exercício intenso ou rotina fisicamente exigente",
  },
  {
    value: "extremelyActive",
    title: "Extremamente ativo",
    description: "Exercício muito intenso, treinos frequentes ou trabalho físico pesado",
  },
];

export const WEEKLY_FREQUENCY_MIN = 1;
export const WEEKLY_FREQUENCY_MAX = 7;

export const AGE_MIN = 18;
export const AGE_MAX = 100;

export const WEIGHT_KG_MIN = 30;
export const WEIGHT_KG_MAX = 300;

export const HEIGHT_CM_MIN = 120;
export const HEIGHT_CM_MAX = 230;

export const ONBOARDING_QUESTION_STEPS = [
  "objetivo",
  "frequencia",
  "idade",
  "peso",
  "altura",
  "referencia",
  "atividade",
] as const;

export type OnboardingQuestionStep = (typeof ONBOARDING_QUESTION_STEPS)[number];

export type OnboardingStep = OnboardingQuestionStep | "resultado";

/**
 * The full onboarding draft persisted locally while the user progresses
 * through the flow. Never put a password or any auth secret in here.
 */
export interface OnboardingDraft {
  goal: Goal | null;
  customGoal: string | null;
  weeklyFrequency: number | null;
  /**
   * True once the frequency step has been submitted. Needed because
   * `weeklyFrequency: null` is itself a valid, deliberate answer ("ainda não
   * sei") and must stay distinguishable from "not answered yet".
   */
  weeklyFrequencyAnswered: boolean;
  age: number | null;
  weightKg: number | null;
  heightCm: number | null;
  sexForBmr: SexForBmr | null;
  activityLevel: ActivityLevel | null;
  /** Raw Basal Metabolic Rate in kcal/day, full decimal precision. */
  bmr: number | null;
  /** Raw Total Daily Energy Expenditure in kcal/day, full decimal precision. */
  tdee: number | null;
  currentStep: OnboardingStep;
  updatedAt: string;
}

export function createEmptyOnboardingDraft(): OnboardingDraft {
  return {
    goal: null,
    customGoal: null,
    weeklyFrequency: null,
    weeklyFrequencyAnswered: false,
    age: null,
    weightKg: null,
    heightCm: null,
    sexForBmr: null,
    activityLevel: null,
    bmr: null,
    tdee: null,
    currentStep: "objetivo",
    updatedAt: new Date().toISOString(),
  };
}
