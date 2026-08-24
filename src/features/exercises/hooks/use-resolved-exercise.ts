"use client";

import { useEffect, useState } from "react";
import { exerciseCatalogProvider } from "@/lib/services";
import type { ExerciseCatalogItem } from "../domain/types";

/**
 * Resolves the *current* catalog data (GIF included) for an exercise
 * referenced only by id — sessions/templates never cache media, so this
 * always asks the provider fresh.
 */
export function useResolvedExercise(providerId: string | null): ExerciseCatalogItem | null {
  const [item, setItem] = useState<ExerciseCatalogItem | null>(null);

  useEffect(() => {
    // Clears the previous exercise's data immediately when the id changes —
    // a derived-state reset, not the async fetch below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItem(null);
    if (!providerId) return;
    let cancelled = false;
    exerciseCatalogProvider
      .getById(providerId)
      .then((result) => {
        if (!cancelled) setItem(result);
      })
      .catch(() => {
        // Media is best-effort — callers already render a placeholder/snapshot
        // name when this stays null, so a failed lookup (timeout, rate limit,
        // provider down) shouldn't surface as an unhandled rejection.
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  return item;
}
