interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

/** Violet trail progress — "a trilha é a interface da marca". */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
    >
      <div
        className="h-full rounded-full bg-violet-500 transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
