import type { ExerciseIdentity, RestTimerState, SetLog, WorkoutSession } from "./types";

export interface StartSessionExerciseSeed {
  exerciseSource: ExerciseIdentity["exerciseSource"];
  providerExerciseId: string | null;
  customExerciseId: string | null;
  exerciseNameSnapshot: string;
  suggestedSets: number;
  suggestedRestSeconds: number;
  notes: string | null;
}

export interface AddSetInput {
  weightKg: number;
  repetitions: number;
  restSeconds: number | null;
  isWarmup: boolean;
}

export interface ExerciseHistoryEntry {
  sessionId: string;
  dateKey: string;
  workoutNameSnapshot: string;
  setLogs: SetLog[];
}

export interface TrainingDayEntry {
  dateKey: string;
  workoutTemplateId: string;
}

export interface LastSessionSummary {
  dateKey: string;
  exerciseNames: string[];
  totalReps: number;
  totalVolumeKg: number;
}

export interface CompleteSessionResult {
  session: WorkoutSession;
  durationSeconds: number;
  totalCompletedSets: number;
  totalReps: number;
  totalVolumeKg: number;
  stepEarned: boolean;
  personalRecords: { exerciseNameSnapshot: string; weightKg: number }[];
}

/**
 * Boundary for in-progress and historical workout sessions. `completeSession`
 * is the only path that ever creates a trail contribution for a workout,
 * and it does so at most once per session (idempotent).
 */
export interface WorkoutSessionRepository {
  getActiveSession(): Promise<WorkoutSession | null>;
  getById(sessionId: string): Promise<WorkoutSession | null>;
  startSession(
    workoutTemplateId: string,
    workoutName: string,
    exercises: StartSessionExerciseSeed[],
  ): Promise<WorkoutSession>;

  addSet(sessionId: string, exerciseSessionId: string, input: AddSetInput): Promise<SetLog>;
  updateSet(sessionId: string, setLogId: string, input: Partial<AddSetInput>): Promise<SetLog>;
  duplicateSet(sessionId: string, setLogId: string): Promise<SetLog>;
  deleteSet(sessionId: string, setLogId: string): Promise<void>;
  reorderSets(sessionId: string, exerciseSessionId: string, orderedSetLogIds: string[]): Promise<void>;
  toggleSetCompleted(sessionId: string, setLogId: string): Promise<SetLog>;

  updateRestTimer(sessionId: string, timer: RestTimerState | null): Promise<void>;

  saveAsDraft(sessionId: string): Promise<void>;
  cancelSession(sessionId: string): Promise<void>;
  completeSession(sessionId: string): Promise<CompleteSessionResult>;

  getLastPerformance(exercise: ExerciseIdentity): Promise<{ weightKg: number; repetitions: number; dateKey: string } | null>;
  listCompletedSessionsForExercise(exercise: ExerciseIdentity): Promise<ExerciseHistoryEntry[]>;
  getLastCompletedDateKeyForTemplate(workoutTemplateId: string): Promise<string | null>;
  /** One entry per completed session whose date falls in [startDateKey, endDateKeyInclusive]. */
  getTrainingDaysInRange(startDateKey: string, endDateKeyInclusive: string): Promise<TrainingDayEntry[]>;
  getLastCompletedSessionSummaryForTemplate(workoutTemplateId: string): Promise<LastSessionSummary | null>;
}
