import { FlameIcon, TrophyIcon } from "lucide-react";
import { formatRelativeDateKey } from "@/lib/date/local-date";

interface StatsCardsProps {
  streak: { current: number; best: number };
  lastAchievement: { title: string; dateKey: string } | null;
  todayKey: string;
}

export function StatsCards({ streak, lastAchievement, todayKey }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 shadow-card">
        <FlameIcon className="size-5 text-coral-500" aria-hidden />
        <p className="font-display text-2xl font-extrabold text-ink-900">
          {streak.current} {streak.current === 1 ? "dia" : "dias"}
        </p>
        <p className="text-xs font-semibold text-ink-500">Sequência atual</p>
        {streak.best > streak.current ? (
          <p className="text-xs text-ink-400">Recorde: {streak.best} dias</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1 rounded-2xl bg-card p-4 shadow-card">
        <TrophyIcon className="size-5 text-sun-600" aria-hidden />
        {lastAchievement ? (
          <>
            <p className="font-display text-base font-bold leading-snug text-ink-900">{lastAchievement.title}</p>
            <p className="text-xs font-semibold text-ink-500">
              Conquistada {formatRelativeDateKey(lastAchievement.dateKey, todayKey)}
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold leading-snug text-ink-500">
            Sua primeira conquista está a caminho.
          </p>
        )}
      </div>
    </div>
  );
}
