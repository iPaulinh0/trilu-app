import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalCustomExerciseRepository } from "./local-custom-exercise-repository";
import type { CustomExerciseFormValues } from "../domain/custom-exercise";

const USER_ID = "user-1";

function setup() {
  return createLocalCustomExerciseRepository({ kv: createInMemoryKeyValueStorage(), getUserId: () => USER_ID });
}

const INPUT: CustomExerciseFormValues = {
  name: "Remada curvada na banda",
  primaryMuscleGroup: "back",
  secondaryMuscleGroups: ["biceps"],
  equipment: "Faixa elástica",
  instructions: null,
  defaultRestSeconds: 60,
};

describe("local-custom-exercise-repository", () => {
  it("creates a custom exercise with a generated id, never a provider id", () => {
    return setup()
      .create(INPUT)
      .then((exercise) => {
        expect(exercise.id).toBeTruthy();
        expect(exercise.userId).toBe(USER_ID);
        expect(exercise.name).toBe(INPUT.name);
      });
  });

  it("finds it afterwards by id", async () => {
    const repo = setup();
    const created = await repo.create(INPUT);
    const found = await repo.getById(created.id);
    expect(found?.name).toBe(INPUT.name);
  });

  it("appears in searches matching its name (case-insensitive substring)", async () => {
    const repo = setup();
    await repo.create(INPUT);
    const results = await repo.search("remada");
    expect(results).toHaveLength(1);
    expect(await repo.search("supino")).toHaveLength(0);
  });

  it("does not search with an empty query", async () => {
    const repo = setup();
    await repo.create(INPUT);
    expect(await repo.search("")).toEqual([]);
  });
});
