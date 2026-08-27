"use client";

import { useEffect, useState } from "react";
import { workoutSessionRepository } from "@/lib/services";

type Status = "loading" | "ready" | "error";

/**
 * Workout names trained per dateKey, in [startDateKey, endDateKeyInclusive].
 * Derived straight from completed sessions' own name snapshot — never from
 * the template's muscle groups, since workouts created through the current
 * (name-only) creation flow never have any.
 */
export function useTrainingCalendar(startDateKey: string, endDateKeyInclusive: string) {
  const [trainingByDate, setTrainingByDate] = useState<Map<string, string[]>>(new Map());
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    workoutSessionRepository
      .getTrainingDaysInRange(startDateKey, endDateKeyInclusive)
      .then((entries) => {
        if (cancelled) return;
        const map = new Map<string, string[]>();
        for (const entry of entries) {
          const existing = map.get(entry.dateKey) ?? [];
          if (!existing.includes(entry.workoutNameSnapshot)) existing.push(entry.workoutNameSnapshot);
          map.set(entry.dateKey, existing);
        }
        setTrainingByDate(map);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [startDateKey, endDateKeyInclusive]);

  return { trainingByDate, status };
}
