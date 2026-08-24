import { describe, expect, it } from "vitest";
import { classifyExercise, classifyMuscle, getEquipmentLabel, getProviderMusclesForGroup } from "./muscle-group-map";

describe("classifyMuscle", () => {
  it("maps well-known ExerciseDB muscles to Trilu groups", () => {
    expect(classifyMuscle("pectorals")).toBe("chest");
    expect(classifyMuscle("lats")).toBe("back");
    expect(classifyMuscle("quadriceps")).toBe("quadriceps");
    expect(classifyMuscle("hamstrings")).toBe("hamstrings");
    expect(classifyMuscle("glutes")).toBe("glutes");
    expect(classifyMuscle("calves")).toBe("calves");
    expect(classifyMuscle("abs")).toBe("core");
  });

  it("is case-insensitive", () => {
    expect(classifyMuscle("Pectorals")).toBe("chest");
  });

  it("falls back to a body part when the muscle itself is unmapped", () => {
    expect(classifyMuscle("chest")).toBe("chest"); // body part name, not a muscle
  });

  it("falls back to 'other' for anything unrecognized", () => {
    expect(classifyMuscle("some-unknown-muscle")).toBe("other");
  });
});

describe("classifyExercise", () => {
  it("uses the first target muscle as the primary group", () => {
    const result = classifyExercise({ targetMuscles: ["pectorals"], secondaryMuscles: ["triceps"], bodyParts: ["chest"] });
    expect(result.primaryMuscleGroup).toBe("chest");
    expect(result.secondaryMuscleGroups).toEqual(["triceps"]);
  });

  it("falls back to the body part when there are no target muscles", () => {
    const result = classifyExercise({ targetMuscles: [], secondaryMuscles: [], bodyParts: ["back"] });
    expect(result.primaryMuscleGroup).toBe("back");
  });

  it("excludes the primary group from the secondary list even if duplicated", () => {
    const result = classifyExercise({
      targetMuscles: ["pectorals"],
      secondaryMuscles: ["pectorals", "shoulders"],
      bodyParts: [],
    });
    expect(result.secondaryMuscleGroups).toEqual(["shoulders"]);
  });
});

describe("getProviderMusclesForGroup", () => {
  it("returns raw muscle strings that classify into the given group", () => {
    const chestMuscles = getProviderMusclesForGroup("chest");
    expect(chestMuscles).toContain("pectorals");
    expect(chestMuscles).toContain("chest");
    expect(chestMuscles).not.toContain("lats");
  });
});

describe("getEquipmentLabel", () => {
  it("translates known equipment via the controlled map", () => {
    expect(getEquipmentLabel("dumbbell")).toBe("Halteres");
    expect(getEquipmentLabel("body weight")).toBe("Peso do corpo");
  });

  it("falls back to the raw value for unknown equipment instead of guessing", () => {
    expect(getEquipmentLabel("some new gadget")).toBe("some new gadget");
  });
});
