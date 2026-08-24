"use client";

import { useMemo, useState } from "react";
import { addDaysToDateKey, getWeekdayFromDateKey, todayDateKey } from "@/lib/date/local-date";
import { useTrainingCalendar } from "../hooks/use-training-calendar";
import { MUSCLE_GROUP_LABELS } from "@/features/exercises/domain/types";
import { cn } from "@/lib/utils";

const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function startOfWeekDateKey(dateKey: string): string {
  return addDaysToDateKey(dateKey, -getWeekdayFromDateKey(dateKey));
}

function dayOfMonth(dateKey: string): number {
  return Number(dateKey.split("-")[2]);
}

/**
 * A week-at-a-glance strip so the person can see which days they trained and
 * which muscle groups, without needing to schedule workouts to specific days
 * up front (that concept was removed from workout creation).
 */
export function WorkoutCalendarStrip() {
  const today = todayDateKey();
  const weekStart = useMemo(() => startOfWeekDateKey(today), [today]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysToDateKey(weekStart, i)), [weekStart]);
  const [selected, setSelected] = useState(today);
  const { trainingByDate, status } = useTrainingCalendar(days[0], days[days.length - 1]);

  const selectedGroups = trainingByDate.get(selected) ?? [];

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink-100 bg-card p-3">
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateKey) => {
          const weekday = getWeekdayFromDateKey(dateKey);
          const isToday = dateKey === today;
          const isSelected = dateKey === selected;
          const trained = (trainingByDate.get(dateKey)?.length ?? 0) > 0;
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelected(dateKey)}
              aria-pressed={isSelected}
              aria-label={`${WEEKDAY_SHORT[weekday]} ${dayOfMonth(dateKey)}${trained ? ", treino registrado" : ""}`}
              className="flex flex-col items-center gap-1 rounded-xl py-1.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
            >
              <span className="text-[11px] font-semibold text-ink-400">{WEEKDAY_SHORT[weekday]}</span>
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  isSelected ? "bg-violet-500 text-white" : isToday ? "border-2 border-violet-400 text-violet-600" : "text-ink-700",
                )}
              >
                {dayOfMonth(dateKey)}
              </span>
              <span className={cn("size-1.5 rounded-full", trained ? "bg-coral-500" : "bg-transparent")} aria-hidden />
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-ink-500">
        {status === "loading"
          ? "Carregando…"
          : selectedGroups.length > 0
            ? `Treinou: ${selectedGroups.map((g) => MUSCLE_GROUP_LABELS[g]).join(", ")}`
            : "Nenhum treino registrado nesse dia."}
      </p>
    </div>
  );
}
