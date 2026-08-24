import { Mascot } from "@/components/shared/mascot";
import { Button } from "@/components/ui/button";

interface HabitEmptyStateProps {
  onAddFirstHabit: () => void;
}

export function HabitEmptyState({ onAddFirstHabit }: HabitEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-50 px-5 py-6 text-center">
      <Mascot size={72} />
      <h3 className="font-display text-lg font-semibold text-ink-900">
        Pequenos hábitos também movem sua trilha.
      </h3>
      <p className="text-sm leading-relaxed text-ink-700">
        Adicione algumas ações que você quer cumprir hoje.
      </p>
      <Button type="button" variant="accent" onClick={onAddFirstHabit} className="mt-1">
        Adicionar primeiro hábito
      </Button>
    </div>
  );
}
