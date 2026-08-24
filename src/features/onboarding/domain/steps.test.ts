import { describe, expect, it } from "vitest";
import { getFirstIncompleteStep, getNextStep, getPreviousStepPath } from "./steps";
import { createEmptyOnboardingDraft } from "./types";

describe("getFirstIncompleteStep", () => {
  it("starts at objetivo for a brand-new draft", () => {
    expect(getFirstIncompleteStep(createEmptyOnboardingDraft())).toBe("objetivo");
  });

  it("treats 'ainda não sei' (null frequency) as answered once submitted", () => {
    const draft = {
      ...createEmptyOnboardingDraft(),
      goal: "voltarRotina" as const,
      weeklyFrequency: null,
      weeklyFrequencyAnswered: true,
    };
    expect(getFirstIncompleteStep(draft)).toBe("idade");
  });

  it("returns null once every question is answered", () => {
    const draft = {
      ...createEmptyOnboardingDraft(),
      goal: "voltarRotina" as const,
      weeklyFrequency: 3,
      weeklyFrequencyAnswered: true,
      age: 30,
      weightKg: 70,
      heightCm: 175,
      sexForBmr: "female" as const,
      activityLevel: "sedentary" as const,
    };
    expect(getFirstIncompleteStep(draft)).toBeNull();
  });

  it("requires a custom description when goal is 'outro'", () => {
    const draft = { ...createEmptyOnboardingDraft(), goal: "outro" as const, customGoal: null };
    expect(getFirstIncompleteStep(draft)).toBe("objetivo");
  });
});

describe("step navigation", () => {
  it("advances objetivo -> frequencia -> ... -> resultado", () => {
    expect(getNextStep("objetivo")).toBe("frequencia");
    expect(getNextStep("atividade")).toBe("resultado");
  });

  it("goes back to the welcome screen from the first question", () => {
    expect(getPreviousStepPath("objetivo")).toBe("/");
  });
});
