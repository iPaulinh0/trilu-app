"use client";

import { useEffect, useState } from "react";
import { workoutRepository, workoutSessionRepository } from "@/lib/services";
import type { TriluMuscleGroup } from "@/features/exercises/domain/types";

type Status = "loading" | "ready" | "error";

/** Muscle groups trained per dateKey, in [startDateKey, endDateKeyInclusive]. */
export function useTrainingCalendar(startDateKey: string, endDateKeyInclusive: string) {
  const [trainingByDate, setTrainingByDate] = useState<Map<string, TriluMuscleGroup[]>>(new Map());
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    (async () => {
      try {
        const entries = await workoutSessionRepository.getTrainingDaysInRange(startDateKey, endDateKeyInclusive);
        const templateIds = [...new Set(entries.map((e) => e.workoutTemplateId))];
        const templates = await Promise.all(templateIds.map((id) => workoutRepository.getById(id)));
        const groupsByTemplateId = new Map<string, TriluMuscleGroup[]>();
        templates.forEach((data, index) => {
          if (data) groupsByTemplateId.set(templateIds[index], data.template.muscleGroups);
        });
        const map = new Map<string, TriluMuscleGroup[]>();
        for (const entry of entries) {
          const groups = groupsByTemplateId.get(entry.workoutTemplateId) ?? [];
          const existing = map.get(entry.dateKey) ?? [];
          map.set(entry.dateKey, [...new Set([...existing, ...groups])]);
        }
        if (!cancelled) {
          setTrainingByDate(map);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [startDateKey, endDateKeyInclusive]);

  return { trainingByDate, status };
}
