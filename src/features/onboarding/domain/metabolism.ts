import type { ActivityLevel, SexForBmr } from "./types";

/**
 * Harris–Benedict activity multipliers. Pure data — no business logic
 * changes these based on user goal, ever.
 */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extremelyActive: 1.9,
};

export interface BmrInput {
  sexForBmr: SexForBmr;
  weightKg: number;
  heightCm: number;
  age: number;
}

/**
 * Basal Metabolic Rate via the Harris–Benedict equation.
 * Male:   66.5 + 13.75×kg + 5.003×cm − 6.75×idade
 * Female: 655.1 + 9.563×kg + 1.850×cm − 4.676×idade
 * Returns the raw decimal value — round only for display.
 */
export function calculateBmr({ sexForBmr, weightKg, heightCm, age }: BmrInput): number {
  if (sexForBmr === "male") {
    return 66.5 + 13.75 * weightKg + 5.003 * heightCm - 6.75 * age;
  }
  return 655.1 + 9.563 * weightKg + 1.85 * heightCm - 4.676 * age;
}

/**
 * Total Daily Energy Expenditure = BMR × fator de atividade.
 * No deficit/surplus is ever applied here — that belongs to a future
 * nutrition feature, not to this raw estimate.
 */
export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_FACTORS[activityLevel];
}

/**
 * Rounds a raw kcal value for presentation only. Never feed a rounded
 * value back into another calculation.
 */
export function roundKcal(value: number): number {
  return Math.round(value);
}
