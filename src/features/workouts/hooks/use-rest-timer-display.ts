"use client";

import { useEffect, useState } from "react";
import { getRemainingSeconds, isRestTimerFinished } from "../domain/rest-timer";
import type { RestTimerState } from "../domain/types";

/**
 * Re-renders once a second so the UI reflects the wall-clock-derived
 * remaining time — the interval is only a repaint trigger, never the
 * source of truth (that's always `getRemainingSeconds(timer, new Date())`),
 * so the display self-corrects after a tab switch, lock, or reload.
 */
export function useRestTimerDisplay(timer: RestTimerState | null) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (!timer || timer.isPaused) return;
    const interval = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return {
    remainingSeconds: getRemainingSeconds(timer),
    isFinished: isRestTimerFinished(timer),
  };
}
