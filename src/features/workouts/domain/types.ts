import type { TriluMuscleGroup } from "@/features/exercises/domain/types";

/** Pure domain types for workouts. No React, no DOM, no Next.js. */

export type ExerciseSource = "exercisedb" | "custom";

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  /** Order is the selection order — the first entry drives list grouping. */
  muscleGroups: TriluMuscleGroup[];
  estimatedDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface WorkoutTemplateExercise {
  id: string;
  workoutTemplateId: string;
  exerciseSource: ExerciseSource;
  providerExerciseId: string | null;
  customExerciseId: string | null;
  /** Display-only cache so lists don't refetch the catalog on every render. */
  exerciseNameSnapshot: string;
  muscleGroup: TriluMuscleGroup | null;
  /** Raw provider equipment key (e.g. "barbell"), translated only in the UI. */
  equipment: string | null;
  gifUrl: string | null;
  position: number;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  notes: string | null;
  /** Individual planned sets (own weight + reps each) — the source of truth for "Configuração das séries". defaultSets/targetRepMin/targetRepMax above are a derived summary kept for the parts of the app (quick add, session start) that only need a bootstrap count/range. */
  sets: WorkoutExerciseSet[];
}

export interface WorkoutExerciseSet {
  id: string;
  workoutExerciseId: string;
  setNumber: number;
  /** Null means "not set yet" — never fabricated to a number the user didn't enter. */
  targetWeightKg: number | null;
  targetRepetitions: number;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutSessionStatus = "draft" | "in_progress" | "completed" | "cancelled";

export interface RestTimerState {
  durationSeconds: number;
  /** ISO instant the rest ends — null while paused. Never a plain decrementing counter. */
  endsAt: string | null;
  remainingSecondsWhenPaused: number | null;
  isPaused: boolean;
}

export interface SetLog {
  id: string;
  exerciseSessionId: string;
  setNumber: number;
  weightKg: number;
  repetitions: number;
  restSeconds: number | null;
  isWarmup: boolean;
  /** Null until the set is marked done — draft/suggested sets are never auto-completed. */
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSession {
  id: string;
  workoutSessionId: string;
  exerciseSource: ExerciseSource;
  providerExerciseId: string | null;
  customExerciseId: string | null;
  exerciseNameSnapshot: string;
  position: number;
  notes: string | null;
  setLogs: SetLog[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutTemplateId: string;
  workoutNameSnapshot: string;
  status: WorkoutSessionStatus;
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  createdAt: string;
  updatedAt: string;
  restTimer: RestTimerState | null;
  exerciseSessions: ExerciseSession[];
}

export const REST_PRESETS_SECONDS = [30, 60, 90, 120, 180] as const;

export const WORKOUT_NAME_MIN_LENGTH = 1;
export const WORKOUT_NAME_MAX_LENGTH = 60;

export const WORKOUT_EXERCISE_SET_COUNT_MIN = 1;
export const WORKOUT_EXERCISE_SET_COUNT_MAX = 20;
export const TARGET_WEIGHT_KG_MIN = 0;
export const TARGET_WEIGHT_KG_MAX = 500;
export const TARGET_REPETITIONS_MIN = 1;
export const TARGET_REPETITIONS_MAX = 100;

/** Bootstrap values used when an exercise is added to a workout — there's no add-time config form anymore; the user refines sets/carga/descanso afterward, inline on the workout page. */
export const DEFAULT_SETS_ON_ADD = 3;
export const DEFAULT_TARGET_REPS_ON_ADD = 12;
export const DEFAULT_REST_SECONDS_ON_ADD = 60;

/** An exercise identity independent of which session/template it lives in. */
export interface ExerciseIdentity {
  exerciseSource: ExerciseSource;
  providerExerciseId: string | null;
  customExerciseId: string | null;
}

export function sameExercise(a: ExerciseIdentity, b: ExerciseIdentity): boolean {
  if (a.exerciseSource !== b.exerciseSource) return false;
  return a.exerciseSource === "custom" ? a.customExerciseId === b.customExerciseId : a.providerExerciseId === b.providerExerciseId;
}
