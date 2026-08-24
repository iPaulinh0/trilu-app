import { TrailPath } from "./trail-path";
import type { TrailGoal } from "../domain/types";

interface TrailCardProps {
  goal: TrailGoal;
  nextMilestone: number | null;
  stepsRemaining: number | null;
}

export function TrailCard({ goal, nextMilestone, stepsRemaining }: TrailCardProps) {
  const isComplete = goal.currentSteps >= goal.targetSteps;

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink-900">{goal.title}</h2>
        <p className="text-sm font-bold text-ink-500">
          {goal.currentSteps} de {goal.targetSteps} passos
        </p>
      </div>

      <TrailPath goal={goal} />

      <p className="text-center text-sm font-semibold text-violet-600">
        {isComplete
          ? "Você chegou à meta! Uma nova trilha está a caminho."
          : nextMilestone !== null
            ? `Faltam ${stepsRemaining} ${stepsRemaining === 1 ? "passo" : "passos"} para o próximo marco`
            : "Continue avançando na sua trilha"}
      </p>
    </section>
  );
}
