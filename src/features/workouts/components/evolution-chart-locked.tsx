import { Mascot } from "@/components/shared/mascot";
import { EVOLUTION_CHART_MIN_SESSIONS } from "../domain/progress";

interface EvolutionChartLockedProps {
  distinctSessionCount: number;
}

export function EvolutionChartLocked({ distinctSessionCount }: EvolutionChartLockedProps) {
  const pct = Math.min(100, (distinctSessionCount / EVOLUTION_CHART_MIN_SESSIONS) * 100);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-50 px-5 py-8 text-center">
      <Mascot size={90} />
      <p className="font-display text-lg font-semibold text-ink-900">
        Complete este exercício em {EVOLUTION_CHART_MIN_SESSIONS} treinos para acompanhar sua evolução.
      </p>
      <div className="w-full max-w-56">
        <div className="h-2 w-full overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-violet-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-violet-700">
          {distinctSessionCount} de {EVOLUTION_CHART_MIN_SESSIONS}
        </p>
      </div>
    </div>
  );
}
