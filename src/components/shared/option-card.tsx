import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  name: string;
}

/**
 * Big, tappable selectable card used for single-choice questions (objetivo,
 * atividade, referência). Selection is shown via border + fill + a check
 * icon — never color alone.
 */
export function OptionCard({ title, description, selected, onSelect, name }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      name={name}
      onClick={onSelect}
      className={cn(
        "flex min-h-[56px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors duration-150 ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40",
        selected
          ? "border-violet-500 bg-violet-50"
          : "border-ink-200 bg-card hover:border-ink-300",
      )}
    >
      <span className="flex-1">
        <span className="block font-body text-base font-bold text-ink-900">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-sm text-ink-500">{description}</span>
        ) : null}
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-violet-500 bg-violet-500" : "border-ink-300 bg-transparent",
        )}
      >
        {selected ? <CheckIcon className="size-4 text-white" /> : null}
      </span>
    </button>
  );
}
