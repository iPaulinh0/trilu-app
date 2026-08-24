import { describe, expect, it } from "vitest";
import { ACTIVITY_FACTORS, calculateBmr, calculateTdee, roundKcal } from "./metabolism";

describe("calculateBmr", () => {
  it("computes the male (Harris–Benedict) formula", () => {
    const bmr = calculateBmr({ sexForBmr: "male", weightKg: 80, heightCm: 180, age: 30 });
    // 66.5 + 13.75*80 + 5.003*180 - 6.75*30
    expect(bmr).toBeCloseTo(66.5 + 13.75 * 80 + 5.003 * 180 - 6.75 * 30, 10);
    expect(bmr).toBeCloseTo(1864.54, 2);
  });

  it("computes the female (Harris–Benedict) formula", () => {
    const bmr = calculateBmr({ sexForBmr: "female", weightKg: 65, heightCm: 165, age: 28 });
    // 655.1 + 9.563*65 + 1.850*165 - 4.676*28
    expect(bmr).toBeCloseTo(655.1 + 9.563 * 65 + 1.85 * 165 - 4.676 * 28, 10);
    expect(bmr).toBeCloseTo(1451.017, 3);
  });

  it("never rounds the raw result", () => {
    const bmr = calculateBmr({ sexForBmr: "male", weightKg: 70.3, heightCm: 172, age: 33 });
    expect(Number.isInteger(bmr)).toBe(false);
  });
});

describe("calculateTdee", () => {
  const bmr = 1500;

  it.each(Object.entries(ACTIVITY_FACTORS))("applies the %s activity factor", (level, factor) => {
    const tdee = calculateTdee(bmr, level as keyof typeof ACTIVITY_FACTORS);
    expect(tdee).toBeCloseTo(bmr * factor, 10);
  });

  it("does not apply any goal-based deficit or surplus", () => {
    const tdee = calculateTdee(bmr, "sedentary");
    expect(tdee).toBeCloseTo(bmr * 1.2, 10);
  });
});

describe("roundKcal", () => {
  it("rounds only for presentation, keeping the raw value untouched elsewhere", () => {
    expect(roundKcal(1780.04)).toBe(1780);
    expect(roundKcal(1780.5)).toBe(1781);
    expect(roundKcal(1780.49)).toBe(1780);
  });
});
