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
  /** Display-only cache (never a GIF/media URL) so lists don't refetch on every render. */
  exerciseNameSnapshot: string;
  position: number;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  notes: string | null;
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

export const WORKOUT_NAME_MIN_LENGTH = 2;
export const WORKOUT_NAME_MAX_LENGTH = 50;

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
