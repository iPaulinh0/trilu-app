import { CheckCircle2Icon, MoonStarIcon } from "lucide-react";
import type { DailyMissionState } from "../domain/mission";
import { Button } from "@/components/ui/button";

interface MissionCardProps {
  mission: DailyMissionState;
  onStartWorkout: () => void;
}

export function MissionCard({ mission, onStartWorkout }: MissionCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">MISSÃO DE HOJE</h2>

      {mission.status === "notConfigured" ? (
        <p className="text-sm leading-relaxed text-ink-500">
          Configure sua rotina de treinos para receber uma missão todos os dias.
        </p>
      ) : mission.status === "restDay" ? (
        <div className="flex items-center gap-3 rounded-2xl bg-violet-50 px-4 py-3">
          <MoonStarIcon className="size-5 shrink-0 text-violet-600" aria-hidden />
          <p className="text-sm font-semibold text-violet-700">
            Hoje é dia de descanso. Aproveite para recarregar as energias.
          </p>
        </div>
      ) : mission.status === "completed" ? (
        <div className="flex items-center gap-3 rounded-2xl bg-mint-50 px-4 py-3">
          <CheckCircle2Icon className="size-5 shrink-0 text-mint-700" aria-hidden />
          <p className="text-sm font-semibold text-mint-700">Treino concluído hoje. Bom trabalho!</p>
        </div>
      ) : mission.workout ? (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">
              {mission.workout.name} · {mission.workout.muscleGroup}
            </p>
            <p className="text-sm text-ink-500">
              {mission.workout.exerciseCount} exercícios · cerca de {mission.workout.estimatedMinutes} min
            </p>
          </div>
          <Button type="button" variant="accent" block onClick={onStartWorkout}>
            {mission.status === "inProgress" ? "Continuar treino" : "Começar treino"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
