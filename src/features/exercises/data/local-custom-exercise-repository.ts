import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createId } from "@/lib/id";
import type { CustomExerciseRepository } from "../domain/custom-exercise-repository";
import type { CustomExercise, CustomExerciseFormValues } from "../domain/custom-exercise";

const CUSTOM_EXERCISES_KEY = "trilu.custom-exercises.v1";

export interface LocalCustomExerciseRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
}

export function createLocalCustomExerciseRepository({
  kv,
  getUserId,
}: LocalCustomExerciseRepositoryDeps): CustomExerciseRepository {
  const exercises = createCollectionStorage<CustomExercise>(kv, CUSTOM_EXERCISES_KEY);

  return {
    async listAll() {
      const userId = getUserId();
      return exercises.getAll().filter((e) => e.userId === userId);
    },

    async search(query) {
      const userId = getUserId();
      const normalized = query.trim().toLowerCase();
      if (!normalized) return [];
      return exercises
        .getAll()
        .filter((e) => e.userId === userId && e.name.toLowerCase().includes(normalized));
    },

    async getById(id) {
      const userId = getUserId();
      return exercises.getAll().find((e) => e.id === id && e.userId === userId) ?? null;
    },

    async create(input: CustomExerciseFormValues) {
      const userId = getUserId();
      const now = new Date().toISOString();
      const exercise: CustomExercise = {
        id: createId("custex"),
        userId,
        name: input.name,
        primaryMuscleGroup: input.primaryMuscleGroup,
        secondaryMuscleGroups: input.secondaryMuscleGroups,
        equipment: input.equipment,
        instructions: input.instructions,
        defaultRestSeconds: input.defaultRestSeconds ?? null,
        createdAt: now,
        updatedAt: now,
      };
      exercises.setAll([...exercises.getAll(), exercise]);
      return exercise;
    },
  };
}
