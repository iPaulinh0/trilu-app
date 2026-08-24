import { TrophyIcon } from "lucide-react";
import { Mascot } from "@/components/shared/mascot";
import { Button } from "@/components/ui/button";
import { formatWorkoutDuration } from "../domain/format";
import type { CompleteSessionResult } from "../domain/workout-session-repository";

interface SessionSummaryProps {
  result: CompleteSessionResult;
  onFinish: () => void;
  onShare: () => void;
}

export function SessionSummary({ result, onFinish, onShare }: SessionSummaryProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-5 py-6 text-center">
      <Mascot size={130} priority />
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Treino concluído!</h1>
        {result.stepEarned ? <p className="mt-1 font-semibold text-violet-600">Você avançou mais 1 passo na trilha.</p> : null}
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink-900">{formatWorkoutDuration(result.durationSeconds)}</p>
          <p className="text-xs font-semibold text-ink-500">Duração</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink-900">{result.totalCompletedSets}</p>
          <p className="text-xs font-semibold text-ink-500">Séries concluídas</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink-900">{result.totalReps}</p>
          <p className="text-xs font-semibold text-ink-500">Repetições</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-card">
          <p className="font-display text-2xl font-extrabold text-ink-900">{Math.round(result.totalVolumeKg)} kg</p>
          <p className="text-xs font-semibold text-ink-500">Volume total</p>
        </div>
      </div>

      {result.personalRecords.length > 0 ? (
        <div className="flex w-full flex-col gap-2 rounded-2xl bg-sun-50 p-4 text-left">
          <div className="flex items-center gap-2 text-sun-700">
            <TrophyIcon className="size-4" aria-hidden />
            <span className="text-xs font-bold tracking-[0.08em]">NOVOS RECORDES</span>
          </div>
          {result.personalRecords.map((pr) => (
            <p key={pr.exerciseNameSnapshot} className="text-sm font-semibold text-ink-900">
              {pr.exerciseNameSnapshot}: {pr.weightKg} kg
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-2 flex w-full flex-col gap-2">
        <Button type="button" variant="outline" size="lg" block onClick={onShare}>
          Compartilhar
        </Button>
        <Button type="button" variant="accent" size="lg" block onClick={onFinish}>
          Ver minha trilha
        </Button>
      </div>
    </div>
  );
}
