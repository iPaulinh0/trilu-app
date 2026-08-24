"use client";

import { useEffect, useState } from "react";
import { workoutRepository, workoutSessionRepository } from "@/lib/services";
import type { WorkoutTemplate } from "../domain/types";
import type { LastSessionSummary } from "../domain/workout-session-repository";

export interface WorkoutListItem {
  template: WorkoutTemplate;
  exerciseCount: number;
  lastExecutionDateKey: string | null;
  lastSessionSummary: LastSessionSummary | null;
}

export type WorkoutsStatus = "loading" | "error" | "ready";

export function useWorkouts() {
  const [items, setItems] = useState<WorkoutListItem[]>([]);
  const [status, setStatus] = useState<WorkoutsStatus>("loading");

  async function load() {
    setStatus("loading");
    try {
      const templates = await workoutRepository.listAll();
      const withDetails = await Promise.all(
        templates.map(async (template) => {
          const full = await workoutRepository.getById(template.id);
          const lastExecutionDateKey = await workoutRepository.getLastExecutionDateKey(template.id);
          const lastSessionSummary = await workoutSessionRepository.getLastCompletedSessionSummaryForTemplate(template.id);
          return { template, exerciseCount: full?.exercises.length ?? 0, lastExecutionDateKey, lastSessionSummary };
        }),
      );
      setItems(withDetails);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return { items, status, reload: load };
}
