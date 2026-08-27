import { classifyExercise } from "../domain/muscle-group-map";
import { getExerciseDisplayNamePtBr } from "../domain/exercise-name-translations";
import type { ExerciseCatalogItem } from "../domain/types";
import type { RawExerciseDbItem } from "./exercisedb-client";

function toDisplayName(rawName: string): string {
  return rawName
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** The only place a raw ExerciseDB item is allowed to exist — everything past this is domain-shaped. */
export function mapExerciseDbItemToCatalogItem(raw: RawExerciseDbItem): ExerciseCatalogItem {
  const { primaryMuscleGroup, secondaryMuscleGroups } = classifyExercise({
    targetMuscles: raw.targetMuscles ?? [],
    secondaryMuscles: raw.secondaryMuscles ?? [],
    bodyParts: raw.bodyParts ?? [],
  });

  const fallbackDisplayName = toDisplayName(raw.name);

  return {
    providerId: raw.exerciseId,
    provider: "exercisedb",
    name: raw.name,
    displayName: getExerciseDisplayNamePtBr(raw.exerciseId, fallbackDisplayName),
    gifUrl: raw.gifUrl ?? null,
    bodyParts: raw.bodyParts ?? [],
    primaryMuscles: raw.targetMuscles ?? [],
    secondaryMuscles: raw.secondaryMuscles ?? [],
    equipment: raw.equipments ?? [],
    instructions: raw.instructions ?? [],
    isCustom: false,
    primaryMuscleGroup,
    secondaryMuscleGroups,
  };
}
