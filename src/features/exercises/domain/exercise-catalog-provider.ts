import type { ExerciseCatalogItem, ExerciseSearchFilters, ExerciseSearchPage, TriluMuscleGroup } from "./types";

/**
 * Boundary every exercise-picker component depends on. Today it's backed
 * by an HTTP client hitting our own Next.js route handlers (which in turn
 * call ExerciseDB) merged with the local custom-exercise repository — swap
 * either half without touching a component.
 */
export interface ExerciseCatalogProvider {
  search(
    query: string,
    filters: ExerciseSearchFilters,
    cursor?: string | null,
    signal?: AbortSignal,
  ): Promise<ExerciseSearchPage>;
  getById(id: string): Promise<ExerciseCatalogItem | null>;
  getMuscleGroups(): Promise<{ group: TriluMuscleGroup; label: string }[]>;
  getByMuscleGroup(group: TriluMuscleGroup, cursor?: string | null): Promise<ExerciseSearchPage>;
}
