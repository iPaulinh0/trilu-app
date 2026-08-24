import { describe, expect, it } from "vitest";
import {
  ageStepSchema,
  goalStepSchema,
  heightStepSchema,
  weightStepSchema,
} from "./schema";

describe("ageStepSchema", () => {
  it("accepts a valid adult age", () => {
    expect(ageStepSchema.safeParse({ age: "25" }).success).toBe(true);
  });

  it.each(["17", "101", "17.5"])("rejects an invalid age (%s)", (age) => {
    const result = ageStepSchema.safeParse({ age });
    expect(result.success).toBe(false);
  });
});

describe("weightStepSchema", () => {
  it("normalizes a comma decimal", () => {
    const result = weightStepSchema.safeParse({ weightKg: "78,5" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.weightKg).toBe(78.5);
  });

  it("normalizes a dot decimal", () => {
    const result = weightStepSchema.safeParse({ weightKg: "78.5" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.weightKg).toBe(78.5);
  });

  it.each(["29", "301", "abc", ""])("rejects an invalid weight (%s)", (weightKg) => {
    expect(weightStepSchema.safeParse({ weightKg }).success).toBe(false);
  });
});

describe("heightStepSchema", () => {
  it("accepts a valid height", () => {
    expect(heightStepSchema.safeParse({ heightCm: "175" }).success).toBe(true);
  });

  it.each(["119", "231"])("rejects an invalid height (%s)", (heightCm) => {
    expect(heightStepSchema.safeParse({ heightCm }).success).toBe(false);
  });
});

describe("goalStepSchema", () => {
  it("accepts a predefined goal without a custom description", () => {
    expect(goalStepSchema.safeParse({ goal: "ganharForca" }).success).toBe(true);
  });

  it("rejects 'outro' with an empty custom goal", () => {
    const result = goalStepSchema.safeParse({ goal: "outro", customGoal: "" });
    expect(result.success).toBe(false);
  });

  it("rejects 'outro' with a too-short custom goal", () => {
    const result = goalStepSchema.safeParse({ goal: "outro", customGoal: "a" });
    expect(result.success).toBe(false);
  });

  it("accepts 'outro' with a valid custom goal", () => {
    const result = goalStepSchema.safeParse({ goal: "outro", customGoal: "Correr uma maratona" });
    expect(result.success).toBe(true);
  });
});
