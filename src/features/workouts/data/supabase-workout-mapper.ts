import type { TriluMuscleGroup } from "@/features/exercises/domain/types";
import type { ExerciseSource, WorkoutExerciseSet, WorkoutTemplate, WorkoutTemplateExercise } from "../domain/types";

/** Same estimate the previous local implementation used — 40s of work assumed per set, plus its rest. */
const SECONDS_PER_SET_WORK = 40;

export interface WorkoutRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  muscle_groups: string[];
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExerciseSetRow {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  /** Postgres `numeric` comes back from PostgREST as a string, to avoid float rounding. */
  target_weight_kg: number | string | null;
  target_repetitions: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExerciseRow {
  id: string;
  workout_id: string;
  exercise_source: string;
  provider_exercise_id: string | null;
  custom_exercise_id: string | null;
  exercise_name_snapshot: string;
  muscle_group: string | null;
  equipment: string | null;
  media_url: string | null;
  position: number;
  rest_seconds: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  workout_exercise_sets?: WorkoutExerciseSetRow[];
}

function toNumberOrNull(value: number | string | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

export function mapSetRow(row: WorkoutExerciseSetRow): WorkoutExerciseSet {
  return {
    id: row.id,
    workoutExerciseId: row.workout_exercise_id,
    setNumber: row.set_number,
    targetWeightKg: toNumberOrNull(row.target_weight_kg),
    targetRepetitions: row.target_repetitions,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapExerciseRow(row: WorkoutExerciseRow): WorkoutTemplateExercise {
  const sets = [...(row.workout_exercise_sets ?? [])].sort((a, b) => a.set_number - b.set_number).map(mapSetRow);
  const reps = sets.map((s) => s.targetRepetitions);
  return {
    id: row.id,
    workoutTemplateId: row.workout_id,
    exerciseSource: row.exercise_source as ExerciseSource,
    providerExerciseId: row.provider_exercise_id,
    customExerciseId: row.custom_exercise_id,
    exerciseNameSnapshot: row.exercise_name_snapshot,
    muscleGroup: row.muscle_group as TriluMuscleGroup | null,
    equipment: row.equipment,
    gifUrl: row.media_url,
    position: row.position,
    defaultSets: sets.length,
    targetRepMin: reps.length > 0 ? Math.min(...reps) : 0,
    targetRepMax: reps.length > 0 ? Math.max(...reps) : 0,
    defaultRestSeconds: row.rest_seconds,
    notes: row.notes,
    sets,
  };
}

/** Ported from the previous local implementation's estimateDurationMinutes, generalized from "defaultSets" to a per-exercise set count. */
export function estimateDurationMinutes(exercises: { restSeconds: number; setCount: number }[]): number {
  const totalSeconds = exercises.reduce((sum, ex) => sum + ex.setCount * (SECONDS_PER_SET_WORK + ex.restSeconds), 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}

export function mapWorkoutRow(row: WorkoutRow, estimatedDurationMinutes: number): WorkoutTemplate {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    muscleGroups: row.muscle_groups as TriluMuscleGroup[],
    estimatedDurationMinutes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

export interface BootstrapSetPayload {
  setNumber: number;
  targetWeightKg: number | null;
  targetRepetitions: number;
}

/** Generates N fresh planned sets from a quick-add config (same target reps, weight left blank for the user to fill in via the inline editor). */
export function buildBootstrapSets(count: number, targetRepetitions: number): BootstrapSetPayload[] {
  return Array.from({ length: count }, (_, i) => ({
    setNumber: i + 1,
    targetWeightKg: null,
    targetRepetitions,
  }));
}
