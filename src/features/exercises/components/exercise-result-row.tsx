import { MUSCLE_GROUP_LABELS } from "../domain/types";
import { getEquipmentLabel } from "../domain/muscle-group-map";
import { ExerciseGif } from "./exercise-gif";
import type { ExerciseCatalogItem } from "../domain/types";

interface ExerciseResultRowProps {
  exercise: ExerciseCatalogItem;
  onSelect: () => void;
  isAlreadyAdded?: boolean;
}

export function ExerciseResultRow({ exercise, onSelect, isAlreadyAdded = false }: ExerciseResultRowProps) {
  const equipmentLabel = exercise.equipment[0] ? getEquipmentLabel(exercise.equipment[0]) : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl border border-ink-100 bg-card p-2 text-left transition-colors hover:border-violet-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
    >
      <ExerciseGif gifUrl={exercise.gifUrl} alt={exercise.displayName} className="size-16 shrink-0 rounded-xl" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-body text-sm font-bold text-ink-900">{exercise.displayName}</span>
        <span className="block truncate text-xs text-ink-500">
          {MUSCLE_GROUP_LABELS[exercise.primaryMuscleGroup]}
          {equipmentLabel ? ` · ${equipmentLabel}` : ""}
        </span>
        <span className="mt-0.5 flex gap-1">
          {exercise.isCustom ? (
            <span className="inline-block rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-bold text-coral-600">
              Personalizado
            </span>
          ) : null}
          {isAlreadyAdded ? (
            <span className="inline-block rounded-full bg-mint-50 px-2 py-0.5 text-[10px] font-bold text-mint-700">
              Já no treino
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
