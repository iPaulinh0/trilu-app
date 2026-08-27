import { describe, expect, it } from "vitest";
import {
  mapSetRow,
  mapExerciseRow,
  mapWorkoutRow,
  estimateDurationMinutes,
  buildBootstrapSets,
  type WorkoutExerciseRow,
  type WorkoutRow,
} from "./supabase-workout-mapper";

describe("mapSetRow", () => {
  it("parses a numeric target_weight_kg that PostgREST returns as a string", () => {
    const set = mapSetRow({
      id: "s1",
      workout_exercise_id: "e1",
      set_number: 1,
      target_weight_kg: "20.50",
      target_repetitions: 12,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(set.targetWeightKg).toBe(20.5);
  });

  it("keeps a null target_weight_kg as null (bodyweight exercises)", () => {
    const set = mapSetRow({
      id: "s1",
      workout_exercise_id: "e1",
      set_number: 1,
      target_weight_kg: null,
      target_repetitions: 12,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(set.targetWeightKg).toBeNull();
  });
});

function exerciseRow(overrides: Partial<WorkoutExerciseRow> = {}): WorkoutExerciseRow {
  return {
    id: "e1",
    workout_id: "w1",
    exercise_source: "exercisedb",
    provider_exercise_id: "0001",
    custom_exercise_id: null,
    exercise_name_snapshot: "Supino reto",
    muscle_group: "chest",
    equipment: "barbell",
    media_url: "https://example.com/supino.gif",
    position: 0,
    rest_seconds: 60,
    notes: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    workout_exercise_sets: [],
    ...overrides,
  };
}

describe("mapExerciseRow", () => {
  it("derives defaultSets/targetRepMin/targetRepMax from the individual sets", () => {
    const exercise = mapExerciseRow(
      exerciseRow({
        workout_exercise_sets: [
          { id: "s1", workout_exercise_id: "e1", set_number: 1, target_weight_kg: "20", target_repetitions: 12, created_at: "", updated_at: "" },
          { id: "s2", workout_exercise_id: "e1", set_number: 2, target_weight_kg: "20", target_repetitions: 12, created_at: "", updated_at: "" },
          { id: "s3", workout_exercise_id: "e1", set_number: 3, target_weight_kg: "22", target_repetitions: 10, created_at: "", updated_at: "" },
        ],
      }),
    );
    expect(exercise.defaultSets).toBe(3);
    expect(exercise.targetRepMin).toBe(10);
    expect(exercise.targetRepMax).toBe(12);
    expect(exercise.sets.map((s) => s.setNumber)).toEqual([1, 2, 3]);
  });

  it("sorts sets by set_number even when the rows arrive out of order", () => {
    const exercise = mapExerciseRow(
      exerciseRow({
        workout_exercise_sets: [
          { id: "s2", workout_exercise_id: "e1", set_number: 2, target_weight_kg: null, target_repetitions: 8, created_at: "", updated_at: "" },
          { id: "s1", workout_exercise_id: "e1", set_number: 1, target_weight_kg: null, target_repetitions: 8, created_at: "", updated_at: "" },
        ],
      }),
    );
    expect(exercise.sets.map((s) => s.id)).toEqual(["s1", "s2"]);
  });

  it("falls back to 0/0 rep range when there are no sets yet", () => {
    const exercise = mapExerciseRow(exerciseRow({ workout_exercise_sets: [] }));
    expect(exercise.defaultSets).toBe(0);
    expect(exercise.targetRepMin).toBe(0);
    expect(exercise.targetRepMax).toBe(0);
  });

  it("maps the catalog snapshot fields (muscle group, equipment, media url)", () => {
    const exercise = mapExerciseRow(exerciseRow());
    expect(exercise.muscleGroup).toBe("chest");
    expect(exercise.equipment).toBe("barbell");
    expect(exercise.gifUrl).toBe("https://example.com/supino.gif");
  });
});

describe("estimateDurationMinutes", () => {
  it("matches the previous local-repository formula (40s of work per set, plus rest)", () => {
    const minutes = estimateDurationMinutes([
      { restSeconds: 60, setCount: 3 },
      { restSeconds: 90, setCount: 2 },
    ]);
    // (3 * (40+60) + 2 * (40+90)) / 60 = (300 + 260) / 60 = 9.33 -> 9
    expect(minutes).toBe(9);
  });

  it("never returns less than 1 minute", () => {
    expect(estimateDurationMinutes([])).toBe(1);
  });
});

describe("mapWorkoutRow", () => {
  const row: WorkoutRow = {
    id: "w1",
    user_id: "u1",
    name: "Treino A",
    description: "Peito e tríceps",
    muscle_groups: ["chest", "triceps"],
    archived_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  };

  it("maps every field one to one", () => {
    const template = mapWorkoutRow(row, 12);
    expect(template).toMatchObject({
      id: "w1",
      userId: "u1",
      name: "Treino A",
      description: "Peito e tríceps",
      muscleGroups: ["chest", "triceps"],
      estimatedDurationMinutes: 12,
      archivedAt: null,
    });
  });
});

describe("buildBootstrapSets", () => {
  it("generates one row per set, numbered from 1, with a null weight and the given target reps", () => {
    const sets = buildBootstrapSets(3, 10);
    expect(sets).toEqual([
      { setNumber: 1, targetWeightKg: null, targetRepetitions: 10 },
      { setNumber: 2, targetWeightKg: null, targetRepetitions: 10 },
      { setNumber: 3, targetWeightKg: null, targetRepetitions: 10 },
    ]);
  });

  it("returns an empty array for a zero count", () => {
    expect(buildBootstrapSets(0, 10)).toEqual([]);
  });
});
