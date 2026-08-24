import { MUSCLE_GROUP_LABELS, TRILU_MUSCLE_GROUPS, type TriluMuscleGroup } from "@/features/exercises/domain/types";
import { cn } from "@/lib/utils";

const GROUP_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6];

interface MuscleGroupPickerProps {
  count: number | undefined;
  onCountChange: (count: number) => void;
  value: TriluMuscleGroup[];
  onChange: (value: TriluMuscleGroup[]) => void;
}

/**
 * Replaces the old "grupo principal + secundários" hierarchy: the person
 * first says how many muscle groups the workout covers, then picks exactly
 * that many from one flat pill list. No default count — picking it is a
 * deliberate step, not something we pre-select for them.
 */
export function MuscleGroupPicker({ count, onCountChange, value, onChange }: MuscleGroupPickerProps) {
  function handleCountChange(next: number) {
    onCountChange(next);
    if (value.length > next) onChange(value.slice(0, next));
  }

  function toggle(group: TriluMuscleGroup) {
    if (value.includes(group)) {
      onChange(value.filter((g) => g !== group));
      return;
    }
    if (count === undefined || value.length >= count) return;
    onChange([...value, group]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">
          QUANTOS GRUPOS MUSCULARES VOCÊ VAI TREINAR?
        </span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quantidade de grupos musculares">
          {GROUP_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={count === n}
              onClick={() => handleCountChange(n)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
                count === n ? "border-violet-500 bg-violet-500 text-white" : "border-ink-200 bg-card text-ink-700",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">
          GRUPOS MUSCULARES{count ? ` (${value.length}/${count})` : ""}
        </span>
        {count === undefined ? (
          <p className="rounded-2xl bg-ink-50 px-4 py-4 text-sm text-ink-500">Escolha quantos grupos primeiro.</p>
        ) : (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Grupos musculares">
            {TRILU_MUSCLE_GROUPS.map((group) => {
              const selected = value.includes(group);
              const atCap = !selected && value.length >= count;
              return (
                <button
                  key={group}
                  type="button"
                  aria-pressed={selected}
                  disabled={atCap}
                  onClick={() => toggle(group)}
                  className={cn(
                    "min-h-9 rounded-full border-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:cursor-not-allowed disabled:opacity-40",
                    selected ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 bg-card text-ink-600",
                  )}
                >
                  {MUSCLE_GROUP_LABELS[group]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
