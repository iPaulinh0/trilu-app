import { ALL_WEEKDAYS, WEEKDAY_LABELS, type Weekday } from "@/lib/weekdays";
import { cn } from "@/lib/utils";

interface WeekdayPickerProps {
  value: number[];
  onChange: (next: number[]) => void;
  label?: string;
}

export function WeekdayPicker({ value, onChange, label = "Dias da semana" }: WeekdayPickerProps) {
  function toggle(day: Weekday) {
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">{label.toUpperCase()}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {ALL_WEEKDAYS.map((day) => {
          const selected = value.includes(day);
          return (
            <button
              key={day}
              type="button"
              aria-pressed={selected}
              aria-label={WEEKDAY_LABELS[day]}
              onClick={() => toggle(day)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
                selected ? "border-violet-500 bg-violet-500 text-white" : "border-ink-200 bg-card text-ink-700",
              )}
            >
              {WEEKDAY_LABELS[day][0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
