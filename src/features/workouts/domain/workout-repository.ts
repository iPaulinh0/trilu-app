import type { TriluMuscleGroup } from "@/features/exercises/domain/types";
import type { WorkoutTemplate, WorkoutTemplateExercise } from "./types";

export interface WorkoutTemplateExerciseInput {
  exerciseSource: WorkoutTemplateExercise["exerciseSource"];
  providerExerciseId: string | null;
  customExerciseId: string | null;
  exerciseNameSnapshot: string;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  notes: string | null;
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
  create(input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]): Promise<WorkoutTemplateWithExercises>;
  update(
    id: string,
    input: WorkoutTemplateInput,
    exercises: WorkoutTemplateExerciseInput[],
  ): Promise<WorkoutTemplateWithExercises>;
  rename(id: string, name: string): Promise<WorkoutTemplate>;
  duplicate(id: string): Promise<WorkoutTemplateWithExercises>;
  archive(id: string): Promise<void>;
  getLastExecutionDateKey(id: string): Promise<string | null>;
}
