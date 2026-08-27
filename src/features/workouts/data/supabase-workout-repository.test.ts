import { describe, expect, it, vi } from "vitest";
import { createSupabaseWorkoutRepository } from "./supabase-workout-repository";
import { WorkoutNotFoundError } from "../domain/errors";
import type { WorkoutTemplateExerciseInput, WorkoutTemplateInput } from "../domain/workout-repository";

const WORKOUT_ROW = {
  id: "w1",
  user_id: "u1",
  name: "Treino A",
  description: null,
  muscle_groups: ["chest"],
  archived_at: null,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  workout_exercises: [
    {
      id: "e1",
      workout_id: "w1",
      exercise_source: "exercisedb",
      provider_exercise_id: "0001",
      custom_exercise_id: null,
      exercise_name_snapshot: "Supino reto",
      muscle_group: "chest",
      equipment: "barbell",
      media_url: null,
      position: 0,
      rest_seconds: 60,
      notes: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      workout_exercise_sets: [
        { id: "s1", workout_exercise_id: "e1", set_number: 1, target_weight_kg: "20", target_repetitions: 12, created_at: "", updated_at: "" },
      ],
    },
  ],
};

/**
 * A minimal, purpose-built stand-in for the chainable PostgREST query
 * builder — every chain method returns `this`; the terminal call
 * (`.maybeSingle()`/`.single()`, or awaiting the builder itself for a plain
 * `select`) resolves to whatever `resolve(table, calls)` returns for this
 * invocation. `rpc` is a separate, simpler mock the same way
 * supabase-auth-service.test.ts fakes flat auth calls.
 */
function createFakeSupabase(options: {
  resolve: (table: string, calls: { method: string; args: unknown[] }[]) => { data: unknown; error: unknown };
  rpc?: (name: string, args: Record<string, unknown>) => { data: unknown; error: unknown };
}) {
  function builderFor(table: string) {
    const calls: { method: string; args: unknown[] }[] = [];
    const builder: Record<string, unknown> = {};
    for (const method of ["select", "eq", "is", "order", "update", "delete"]) {
      builder[method] = (...args: unknown[]) => {
        calls.push({ method, args });
        return builder;
      };
    }
    builder.maybeSingle = async () => options.resolve(table, calls);
    builder.single = async () => options.resolve(table, calls);
    builder.then = (resolve: (v: { data: unknown; error: unknown }) => unknown) => resolve(options.resolve(table, calls));
    return builder;
  }

  const rpc = vi.fn((name: string, args: Record<string, unknown>) => {
    const result = options.rpc?.(name, args) ?? { data: null, error: new Error(`unmocked rpc ${name}`) };
    return Promise.resolve(result);
  });

  return { from: vi.fn(builderFor), rpc } as unknown as import("@supabase/supabase-js").SupabaseClient;
}

const EXERCISE_INPUT: WorkoutTemplateExerciseInput = {
  exerciseSource: "exercisedb",
  providerExerciseId: "0001",
  customExerciseId: null,
  exerciseNameSnapshot: "Supino reto",
  muscleGroup: "chest",
  equipment: "barbell",
  gifUrl: null,
  defaultSets: 3,
  targetRepMin: 8,
  targetRepMax: 12,
  defaultRestSeconds: 60,
  notes: null,
};

const TEMPLATE_INPUT: WorkoutTemplateInput = { name: "Treino A", description: null, muscleGroups: ["chest"] };

describe("create", () => {
  it("calls save_workout with bootstrap sets generated from defaultSets/targetRepMax, then fetches the new workout", async () => {
    const supabase = createFakeSupabase({
      resolve: () => ({ data: WORKOUT_ROW, error: null }),
      rpc: (name) => (name === "save_workout" ? { data: "w1", error: null } : { data: null, error: new Error("unexpected rpc") }),
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });

    const result = await repo.create(TEMPLATE_INPUT, [EXERCISE_INPUT]);

    expect(supabase.rpc).toHaveBeenCalledWith(
      "save_workout",
      expect.objectContaining({
        p_workout_id: null,
        p_name: "Treino A",
        p_exercises: [
          expect.objectContaining({
            sets: [
              { setNumber: 1, targetWeightKg: null, targetRepetitions: 12 },
              { setNumber: 2, targetWeightKg: null, targetRepetitions: 12 },
              { setNumber: 3, targetWeightKg: null, targetRepetitions: 12 },
            ],
          }),
        ],
      }),
    );
    expect(result.template.id).toBe("w1");
    expect(result.exercises).toHaveLength(1);
  });

  it("throws a friendly error when the RPC fails", async () => {
    const supabase = createFakeSupabase({
      resolve: () => ({ data: null, error: null }),
      rpc: () => ({ data: null, error: new Error("boom") }),
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.create(TEMPLATE_INPUT, [EXERCISE_INPUT])).rejects.toThrow();
  });
});

describe("removeExercise", () => {
  it("deletes the exercise row (its sets cascade)", async () => {
    const supabase = createFakeSupabase({ resolve: () => ({ data: null, error: null }) });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.removeExercise("e1")).resolves.toBeUndefined();
  });

  it("throws a friendly error when the delete fails", async () => {
    const supabase = createFakeSupabase({ resolve: () => ({ data: null, error: new Error("boom") }) });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.removeExercise("e1")).rejects.toThrow();
  });
});

describe("moveExercise", () => {
  const ORDERED_ROWS = [
    { id: "e1", position: 0 },
    { id: "e2", position: 1 },
    { id: "e3", position: 2 },
  ];

  it("swaps positions with the next exercise when moving down", async () => {
    const supabase = createFakeSupabase({
      resolve: (_table, calls) =>
        calls.some((c) => c.method === "order") ? { data: ORDERED_ROWS, error: null } : { data: null, error: null },
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.moveExercise("w1", "e1", 1)).resolves.toBeUndefined();
  });

  it("is a no-op when moving the first exercise up", async () => {
    const supabase = createFakeSupabase({
      resolve: (_table, calls) =>
        calls.some((c) => c.method === "order") ? { data: ORDERED_ROWS, error: null } : { data: null, error: new Error("should not update") },
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.moveExercise("w1", "e1", -1)).resolves.toBeUndefined();
  });

  it("is a no-op when moving the last exercise down", async () => {
    const supabase = createFakeSupabase({
      resolve: (_table, calls) =>
        calls.some((c) => c.method === "order") ? { data: ORDERED_ROWS, error: null } : { data: null, error: new Error("should not update") },
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.moveExercise("w1", "e3", 1)).resolves.toBeUndefined();
  });
});

describe("addExercise", () => {
  it("sends bootstrap sets and fetches the newly created exercise", async () => {
    const supabase = createFakeSupabase({
      resolve: () => ({ data: WORKOUT_ROW.workout_exercises[0], error: null }),
      rpc: (name) => (name === "add_workout_exercise" ? { data: "e1", error: null } : { data: null, error: new Error("unexpected") }),
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    const exercise = await repo.addExercise("w1", EXERCISE_INPUT);
    expect(supabase.rpc).toHaveBeenCalledWith(
      "add_workout_exercise",
      expect.objectContaining({ p_workout_id: "w1", p_sets: buildBootstrapSetsForAssertion(3, 12) }),
    );
    expect(exercise.id).toBe("e1");
  });

  it("throws WorkoutNotFoundError when the target workout isn't the caller's", async () => {
    const supabase = createFakeSupabase({
      resolve: () => ({ data: null, error: null }),
      rpc: () => ({ data: null, error: new Error("Treino não encontrado.") }),
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.addExercise("not-mine", EXERCISE_INPUT)).rejects.toBeInstanceOf(WorkoutNotFoundError);
  });
});

describe("updateExerciseConfiguration", () => {
  it("sends the sets and rest seconds together, then returns the refreshed exercise", async () => {
    const supabase = createFakeSupabase({
      resolve: () => ({ data: WORKOUT_ROW.workout_exercises[0], error: null }),
      rpc: (name) => (name === "save_workout_exercise_configuration" ? { data: null, error: null } : { data: null, error: new Error("unexpected") }),
    });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    const result = await repo.updateExerciseConfiguration({
      workoutExerciseId: "e1",
      restSeconds: 90,
      sets: [{ setNumber: 1, targetWeightKg: 20, targetRepetitions: 12 }],
    });
    expect(supabase.rpc).toHaveBeenCalledWith(
      "save_workout_exercise_configuration",
      expect.objectContaining({
        p_workout_exercise_id: "e1",
        p_rest_seconds: 90,
        p_sets: [{ setNumber: 1, targetWeightKg: 20, targetRepetitions: 12 }],
      }),
    );
    expect(result.id).toBe("e1");
  });
});

describe("archive", () => {
  it("throws WorkoutNotFoundError instead of silently no-op'ing when RLS blocks the update", async () => {
    const supabase = createFakeSupabase({ resolve: () => ({ data: null, error: new Error("blocked") }) });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => null });
    await expect(repo.archive("not-mine")).rejects.toBeInstanceOf(WorkoutNotFoundError);
  });
});

describe("getLastExecutionDateKey", () => {
  it("delegates to the injected session lookup, same as the previous local implementation", async () => {
    const supabase = createFakeSupabase({ resolve: () => ({ data: null, error: null }) });
    const repo = createSupabaseWorkoutRepository({ supabase, getLastExecutionDateKey: async () => "2026-01-05" });
    expect(await repo.getLastExecutionDateKey("w1")).toBe("2026-01-05");
  });
});

function buildBootstrapSetsForAssertion(count: number, reps: number) {
  return Array.from({ length: count }, (_, i) => ({ setNumber: i + 1, targetWeightKg: null, targetRepetitions: reps }));
}
