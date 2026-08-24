import type { CustomExercise } from "./custom-exercise";
import type { ExerciseCatalogItem } from "./types";

/** Custom exercises never have a GIF — the UI shows the mascot/icon placeholder instead. */
export function customExerciseToCatalogItem(exercise: CustomExercise): ExerciseCatalogItem {
  return {
    providerId: exercise.id,
    provider: "custom",
    name: exercise.name.toLowerCase(),
    displayName: exercise.name,
    gifUrl: null,
    bodyParts: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: exercise.equipment ? [exercise.equipment] : [],
    instructions: exercise.instructions ? [exercise.instructions] : [],
    isCustom: true,
    primaryMuscleGroup: exercise.primaryMuscleGroup,
    secondaryMuscleGroups: exercise.secondaryMuscleGroups,
  };
}
