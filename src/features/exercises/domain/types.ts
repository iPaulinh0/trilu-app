/**
 * Pure domain types for the exercise catalog. No React, no DOM, no
 * Next.js, and — critically — no ExerciseDB field names leaking out: every
 * component works against `ExerciseCatalogItem`, never the raw provider
 * shape.
 */

export const TRILU_MUSCLE_GROUPS = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
  "fullBody",
  "cardio",
  "other",
] as const;
export type TriluMuscleGroup = (typeof TRILU_MUSCLE_GROUPS)[number];

export const MUSCLE_GROUP_LABELS: Record<TriluMuscleGroup, string> = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  forearms: "Antebraços",
  quadriceps: "Quadríceps",
  hamstrings: "Posterior de coxa",
  glutes: "Glúteos",
  calves: "Panturrilhas",
  core: "Abdômen e core",
  fullBody: "Corpo inteiro",
  cardio: "Cardio",
  other: "Outros",
};

export type ExerciseProvider = "exercisedb" | "custom";

export interface ExerciseCatalogItem {
  /** exerciseId for exercisedb items; same as the CustomExercise id for custom ones. */
  providerId: string;
  provider: ExerciseProvider;
  /** Raw/lowercase provider name — kept for matching, never shown directly. */
  name: string;
  /** Presentable, capitalized name. */
  displayName: string;
  /** Null for custom exercises and whenever the provider has none — never fabricated. */
  gifUrl: string | null;
  bodyParts: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  instructions: string[];
  isCustom: boolean;
  primaryMuscleGroup: TriluMuscleGroup;
  secondaryMuscleGroups: TriluMuscleGroup[];
}

export interface ExerciseSearchFilters {
  muscleGroup?: TriluMuscleGroup;
  /** Raw provider equipment keys (e.g. "dumbbell", "cable"). */
  equipment?: string[];
}

export interface ExerciseSearchPage {
  items: ExerciseCatalogItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export const EXERCISE_SEARCH_MIN_LENGTH = 2;
export const EXERCISE_SEARCH_DEBOUNCE_MS = 350;
export const EXERCISE_SEARCH_PAGE_SIZE = 20;
