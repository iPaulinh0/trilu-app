"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import { WEEKDAY_LABELS } from "@/features/habits/domain/types";
import { formatRelativeDateKey } from "@/lib/date/local-date";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { WeekDaySummary, WeekDayStatus } from "../domain/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<WeekDayStatus, string> = {
  completed: "ação concluída",
  today: "hoje",
  rest: "descanso",
  future: "ainda não chegou",
  missed: "sem conclusão",
};

const STATUS_CLASSES: Record<WeekDayStatus, string> = {
  completed: "bg-mint-500 text-white border-mint-500",
  today: "bg-violet-500 text-white border-violet-500",
  rest: "bg-ink-100 text-ink-500 border-ink-100",
  future: "bg-transparent text-ink-300 border-dashed border-ink-200",
  missed: "bg-card text-ink-400 border-ink-200",
};

interface WeekSummaryCardProps {
  days: WeekDaySummary[];
  todayKey: string;
}

export function WeekSummaryCard({ days, todayKey }: WeekSummaryCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">SUA SEMANA</h2>
      <div className="flex justify-between gap-1">
        {days.map((day) => (
          <Popover key={day.dateKey}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`${WEEKDAY_LABELS[day.weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6]}, ${STATUS_LABEL[day.status]}`}
                className={cn(
                  "flex size-10 flex-col items-center justify-center rounded-full border-2 text-xs font-bold transition-transform focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 active:scale-95",
                  STATUS_CLASSES[day.status],
                )}
              >
                {day.status === "completed" ? (
                  <CheckIcon className="size-4" aria-hidden />
                ) : day.status === "rest" ? (
                  <MinusIcon className="size-4" aria-hidden />
                ) : (
                  WEEKDAY_LABELS[day.weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6][0]
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <p className="font-body text-sm font-bold text-ink-900">
                {WEEKDAY_LABELS[day.weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6]} · {formatRelativeDateKey(day.dateKey, todayKey)}
              </p>
              <p className="mt-1 text-sm text-ink-500">
                {day.status === "future"
                  ? "Esse dia ainda não chegou."
                  : day.status === "rest"
                    ? "Nenhuma ação programada — dia de descanso."
                    : `${day.stepsEarned} ${day.stepsEarned === 1 ? "passo conquistado" : "passos conquistados"}.`}
              </p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </section>
  );
}
