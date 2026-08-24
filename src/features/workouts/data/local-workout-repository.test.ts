import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalWorkoutRepository } from "./local-workout-repository";
import type { WorkoutTemplateExerciseInput, WorkoutTemplateInput } from "../domain/workout-repository";

const USER_ID = "user-1";

function setup(getLastExecutionDateKey: (id: string) => Promise<string | null> = async () => null) {
  return createLocalWorkoutRepository({
    kv: createInMemoryKeyValueStorage(),
    getUserId: () => USER_ID,
    getLastExecutionDateKey,
  });
}

const TEMPLATE_INPUT: WorkoutTemplateInput = {
  name: "Treino A",
  description: "Peito e tríceps",
  muscleGroups: ["chest", "triceps"],
};

function exercise(name: string): WorkoutTemplateExerciseInput {
  return {
    exerciseSource: "exercisedb",
    providerExerciseId: `ex-${name}`,
    customExerciseId: null,
    exerciseNameSnapshot: name,
    defaultSets: 3,
    targetRepMin: 8,
    targetRepMax: 12,
    defaultRestSeconds: 60,
    notes: null,
  };
}

describe("create", () => {
  it("creates a workout with its exercises in order", async () => {
    const repo = setup();
    const { template, exercises } = await repo.create(TEMPLATE_INPUT, [exercise("Supino"), exercise("Crucifixo")]);
    expect(template.name).toBe("Treino A");
    expect(exercises.map((e) => e.exerciseNameSnapshot)).toEqual(["Supino", "Crucifixo"]);
    expect(exercises.map((e) => e.position)).toEqual([0, 1]);
  });
});

describe("rename", () => {
  it("changes only the name", async () => {
    const repo = setup();
    const { template } = await repo.create(TEMPLATE_INPUT, [exercise("Supino")]);
    const renamed = await repo.rename(template.id, "Treino A · Peito");
    expect(renamed.name).toBe("Treino A · Peito");
    expect(renamed.muscleGroups).toEqual(["chest", "triceps"]);
  });
});

describe("duplicate", () => {
  it("creates a copy with a new id and '(cópia)' suffix, keeping the same exercises", async () => {
    const repo = setup();
    const { template } = await repo.create(TEMPLATE_INPUT, [exercise("Supino"), exercise("Crucifixo")]);
    const copy = await repo.duplicate(template.id);
    expect(copy.template.id).not.toBe(template.id);
    expect(copy.template.name).toBe("Treino A (cópia)");
    expect(copy.exercises.map((e) => e.exerciseNameSnapshot)).toEqual(["Supino", "Crucifixo"]);
  });
});

describe("archive (delete)", () => {
  it("removes the workout from listAll but does not throw for existing references", async () => {
    const repo = setup();
    const { template } = await repo.create(TEMPLATE_INPUT, [exercise("Supino")]);
    await repo.archive(template.id);
    expect(await repo.listAll()).toHaveLength(0);
  });
});

describe("update (reordering exercises)", () => {
  it("replaces the exercise list and re-numbers positions in the new order", async () => {
    const repo = setup();
    const { template } = await repo.create(TEMPLATE_INPUT, [exercise("Supino"), exercise("Crucifixo")]);
    const { exercises } = await repo.update(template.id, TEMPLATE_INPUT, [exercise("Crucifixo"), exercise("Supino")]);
    expect(exercises.map((e) => e.exerciseNameSnapshot)).toEqual(["Crucifixo", "Supino"]);
    expect(exercises.map((e) => e.position)).toEqual([0, 1]);
  });
});

describe("search", () => {
  it("filters by name, case-insensitively", async () => {
    const repo = setup();
    await repo.create(TEMPLATE_INPUT, [exercise("Supino")]);
    await repo.create({ ...TEMPLATE_INPUT, name: "Treino B" }, [exercise("Remada")]);
    expect(await repo.search("treino a")).toHaveLength(1);
    expect(await repo.search("nada")).toHaveLength(0);
  });

  it("returns everything for an empty query", async () => {
    const repo = setup();
    await repo.create(TEMPLATE_INPUT, [exercise("Supino")]);
    expect(await repo.search("")).toHaveLength(1);
  });
});

describe("getLastExecutionDateKey", () => {
  it("delegates to the injected session lookup", async () => {
    const repo = setup(async () => "2026-01-05");
    const { template } = await repo.create(TEMPLATE_INPUT, [exercise("Supino")]);
    expect(await repo.getLastExecutionDateKey(template.id)).toBe("2026-01-05");
  });
});
