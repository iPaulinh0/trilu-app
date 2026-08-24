import { cn } from "@/lib/utils";

interface NumberChipProps {
  value: number;
  selected: boolean;
  onSelect: () => void;
}

export function NumberChip({ value, selected, onSelect }: NumberChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${value} ${value === 1 ? "vez" : "vezes"} por semana`}
      onClick={onSelect}
      className={cn(
        "flex size-12 items-center justify-center rounded-2xl border-2 font-display text-lg font-bold transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
        selected
          ? "border-violet-500 bg-violet-500 text-white"
          : "border-ink-200 bg-card text-ink-900 hover:border-ink-300",
      )}
    >
      {value}
    </button>
  );
}
