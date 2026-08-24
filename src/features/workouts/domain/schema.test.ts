import { describe, expect, it } from "vitest";
import { canCompleteSet, setLogFormSchema, workoutTemplateFormSchema } from "./schema";

describe("setLogFormSchema", () => {
  it("accepts a comma decimal for weight", () => {
    const result = setLogFormSchema.safeParse({ weightKg: "22,5", repetitions: "10" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.weightKg).toBe(22.5);
  });

  it("accepts a dot decimal for weight", () => {
    const result = setLogFormSchema.safeParse({ weightKg: "22.5", repetitions: "10" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.weightKg).toBe(22.5);
  });

  it("accepts 0 kg for bodyweight exercises", () => {
    expect(setLogFormSchema.safeParse({ weightKg: "0", repetitions: "12" }).success).toBe(true);
  });

  it("rejects a negative weight", () => {
    expect(setLogFormSchema.safeParse({ weightKg: "-5", repetitions: "10" }).success).toBe(false);
  });

  it("rejects a non-numeric weight", () => {
    expect(setLogFormSchema.safeParse({ weightKg: "abc", repetitions: "10" }).success).toBe(false);
  });

  it("rejects a fractional repetition count", () => {
    expect(setLogFormSchema.safeParse({ weightKg: "20", repetitions: "8.5" }).success).toBe(false);
  });

  it("rejects a negative repetition count", () => {
    expect(setLogFormSchema.safeParse({ weightKg: "20", repetitions: "-1" }).success).toBe(false);
  });
});

describe("canCompleteSet", () => {
  it("requires at least one repetition to mark a set as done", () => {
    expect(canCompleteSet(0)).toBe(false);
    expect(canCompleteSet(1)).toBe(true);
  });
});

describe("workoutTemplateFormSchema", () => {
  const base = { name: "Treino A", muscleGroups: ["chest"] as const };

  it("accepts a minimal valid workout", () => {
    expect(workoutTemplateFormSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(workoutTemplateFormSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });

  it("rejects a name longer than 50 characters", () => {
    expect(workoutTemplateFormSchema.safeParse({ ...base, name: "a".repeat(51) }).success).toBe(false);
  });

  it("requires at least one muscle group", () => {
    expect(workoutTemplateFormSchema.safeParse({ name: "Treino A", muscleGroups: [] }).success).toBe(false);
  });

  it("accepts several muscle groups with no upper bound in the schema itself", () => {
    expect(
      workoutTemplateFormSchema.safeParse({ name: "Treino A", muscleGroups: ["chest", "back", "shoulders"] }).success,
    ).toBe(true);
  });
});
