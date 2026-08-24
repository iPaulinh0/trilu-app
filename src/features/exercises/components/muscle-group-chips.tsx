import { MUSCLE_GROUP_LABELS, TRILU_MUSCLE_GROUPS, type TriluMuscleGroup } from "../domain/types";
import { cn } from "@/lib/utils";

interface MuscleGroupChipsProps {
  value: TriluMuscleGroup[];
  onChange: (value: TriluMuscleGroup[]) => void;
  exclude?: TriluMuscleGroup;
  label?: string;
}

export function MuscleGroupChips({ value, onChange, exclude, label = "Grupos secundários" }: MuscleGroupChipsProps) {
  const options = TRILU_MUSCLE_GROUPS.filter((g) => g !== exclude);

  function toggle(group: TriluMuscleGroup) {
    onChange(value.includes(group) ? value.filter((g) => g !== group) : [...value, group]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">{label.toUpperCase()}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((group) => {
          const selected = value.includes(group);
          return (
            <button
              key={group}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(group)}
              className={cn(
                "min-h-9 rounded-full border-2 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
                selected ? "border-violet-500 bg-violet-50 text-violet-700" : "border-ink-200 bg-card text-ink-600",
              )}
            >
              {MUSCLE_GROUP_LABELS[group]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
