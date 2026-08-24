import { describe, expect, it } from "vitest";
import { mapExerciseDbItemToCatalogItem } from "./exercisedb-mapper";
import type { RawExerciseDbItem } from "./exercisedb-client";

const RAW: RawExerciseDbItem = {
  exerciseId: "SpYC0Kp",
  name: "dumbbell bench press",
  gifUrl: "https://static.exercisedb.dev/media/SpYC0Kp.gif",
  bodyParts: ["chest"],
  equipments: ["dumbbell"],
  targetMuscles: ["pectorals"],
  secondaryMuscles: ["triceps", "shoulders"],
  instructions: ["Step:1 Lie on a bench."],
};

describe("mapExerciseDbItemToCatalogItem", () => {
  it("normalizes the raw provider shape into the internal domain shape", () => {
    const item = mapExerciseDbItemToCatalogItem(RAW);
    expect(item.provider).toBe("exercisedb");
    expect(item.providerId).toBe("SpYC0Kp");
    expect(item.isCustom).toBe(false);
    expect(item.gifUrl).toBe(RAW.gifUrl);
    expect(item.primaryMuscles).toEqual(["pectorals"]);
    expect(item.secondaryMuscles).toEqual(["triceps", "shoulders"]);
    expect(item.equipment).toEqual(["dumbbell"]);
  });

  it("classifies the muscle group instead of leaving it as a raw provider string", () => {
    const item = mapExerciseDbItemToCatalogItem(RAW);
    expect(item.primaryMuscleGroup).toBe("chest");
    expect(item.secondaryMuscleGroups).toEqual(["triceps", "shoulders"]);
  });

  it("capitalizes each word for the display name, keeping the raw name lowercase", () => {
    const item = mapExerciseDbItemToCatalogItem(RAW);
    expect(item.name).toBe("dumbbell bench press");
    expect(item.displayName).toBe("Dumbbell Bench Press");
  });

  it("never fabricates a gifUrl or instructions when the provider omits them", () => {
    const item = mapExerciseDbItemToCatalogItem({ ...RAW, gifUrl: undefined, instructions: undefined });
    expect(item.gifUrl).toBeNull();
    expect(item.instructions).toEqual([]);
  });
});
