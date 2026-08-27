import type { TriluMuscleGroup } from "@/features/exercises/domain/types";
import type { WorkoutTemplate, WorkoutTemplateExercise } from "./types";

export interface WorkoutExerciseSetInput {
  setNumber: number;
  targetWeightKg: number | null;
  targetRepetitions: number;
}

export interface WorkoutTemplateExerciseInput {
  exerciseSource: WorkoutTemplateExercise["exerciseSource"];
  providerExerciseId: string | null;
  customExerciseId: string | null;
  exerciseNameSnapshot: string;
  muscleGroup: TriluMuscleGroup | null;
  equipment: string | null;
  gifUrl: string | null;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  notes: string | null;
}

export type AddWorkoutExerciseInput = WorkoutTemplateExerciseInput;

export interface UpdateExerciseConfigurationInput {
  workoutExerciseId: string;
  restSeconds: number;
  sets: WorkoutExerciseSetInput[];
}

export interface WorkoutTemplateInput {
  name: string;
  description: string | null;
  muscleGroups: TriluMuscleGroup[];
}

export interface WorkoutTemplateWithExercises {
  template: WorkoutTemplate;
  exercises: WorkoutTemplateExercise[];
}

/**
 * Boundary for workout templates. Editing a template (including its
 * exercise list) never touches historical WorkoutSession/ExerciseSession
 * records — those keep their own name snapshots, independent of the
 * template that spawned them.
 */
export interface WorkoutRepository {
  listAll(): Promise<WorkoutTemplate[]>;
  search(query: string): Promise<WorkoutTemplate[]>;
  getById(id: string): Promise<WorkoutTemplateWithExercises | null>;
  /** Creating a workout only takes a name — exercises are added afterward via addExercise(). */
  create(input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]): Promise<WorkoutTemplateWithExercises>;
  rename(id: string, name: string): Promise<WorkoutTemplate>;
  duplicate(id: string): Promise<WorkoutTemplateWithExercises>;
  archive(id: string): Promise<void>;
  getLastExecutionDateKey(id: string): Promise<string | null>;
  /** Appends one exercise to an existing workout without touching any other exercise's sets. */
  addExercise(workoutId: string, input: AddWorkoutExerciseInput): Promise<WorkoutTemplateExercise>;
  /** Removes one exercise (and its planned sets, via cascade) from a workout. */
  removeExercise(workoutExerciseId: string): Promise<void>;
  /** Swaps one exercise's position with its neighbor in the given direction; a no-op past either end. */
  moveExercise(workoutId: string, exerciseId: string, direction: -1 | 1): Promise<void>;
  /** Atomically replaces one exercise's planned sets and rest time. */
  updateExerciseConfiguration(input: UpdateExerciseConfigurationInput): Promise<WorkoutTemplateExercise>;
}
