import { describe, expect, it } from "vitest";
import {
  canCompleteSet,
  setLogFormSchema,
  createWorkoutSchema,
  workoutExerciseSetSchema,
  workoutExerciseSetCountSchema,
} from "./schema";

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

describe("createWorkoutSchema", () => {
  it("accepts a simple name", () => {
    expect(createWorkoutSchema.safeParse({ name: "Treino A" }).success).toBe(true);
  });

  it("trims leading/trailing whitespace", () => {
    const result = createWorkoutSchema.safeParse({ name: "  Treino A  " });
    expect(result.success).toBe(true);
    expect(result.success && result.data.name).toBe("Treino A");
  });

  it("rejects an empty (whitespace-only) name", () => {
    expect(createWorkoutSchema.safeParse({ name: "   " }).success).toBe(false);
  });

  it("rejects a name longer than 60 characters", () => {
    expect(createWorkoutSchema.safeParse({ name: "a".repeat(61) }).success).toBe(false);
  });

  it("accepts a single-character name", () => {
    expect(createWorkoutSchema.safeParse({ name: "A" }).success).toBe(true);
  });

  it("accepts a 60-character name", () => {
    expect(createWorkoutSchema.safeParse({ name: "a".repeat(60) }).success).toBe(true);
  });
});

describe("workoutExerciseSetSchema", () => {
  it("accepts a blank weight as null (bodyweight exercises)", () => {
    const result = workoutExerciseSetSchema.safeParse({ targetWeightKg: "", targetRepetitions: "12" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.targetWeightKg).toBeNull();
  });

  it("accepts a decimal weight", () => {
    const result = workoutExerciseSetSchema.safeParse({ targetWeightKg: "20,5", targetRepetitions: "10" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.targetWeightKg).toBe(20.5);
  });

  it("rejects a negative weight", () => {
    expect(workoutExerciseSetSchema.safeParse({ targetWeightKg: "-5", targetRepetitions: "10" }).success).toBe(false);
  });

  it("rejects zero repetitions", () => {
    expect(workoutExerciseSetSchema.safeParse({ targetWeightKg: "20", targetRepetitions: "0" }).success).toBe(false);
  });

  it("rejects a fractional repetition count", () => {
    expect(workoutExerciseSetSchema.safeParse({ targetWeightKg: "20", targetRepetitions: "8.5" }).success).toBe(false);
  });
});

describe("workoutExerciseSetCountSchema", () => {
  it("accepts values within [1, 20]", () => {
    expect(workoutExerciseSetCountSchema.safeParse("1").success).toBe(true);
    expect(workoutExerciseSetCountSchema.safeParse("20").success).toBe(true);
  });

  it("rejects 0 and negative counts", () => {
    expect(workoutExerciseSetCountSchema.safeParse("0").success).toBe(false);
    expect(workoutExerciseSetCountSchema.safeParse("-1").success).toBe(false);
  });

  it("rejects counts above the technical ceiling", () => {
    expect(workoutExerciseSetCountSchema.safeParse("21").success).toBe(false);
  });
});
