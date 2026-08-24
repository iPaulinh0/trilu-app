import type { CustomExercise, CustomExerciseFormValues } from "./custom-exercise";

export interface CustomExerciseRepository {
  listAll(): Promise<CustomExercise[]>;
  search(query: string): Promise<CustomExercise[]>;
  getById(id: string): Promise<CustomExercise | null>;
  create(input: CustomExerciseFormValues): Promise<CustomExercise>;
}
