"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { workoutSessionRepository } from "@/lib/services";
import type { WorkoutSession } from "../domain/types";

/**
 * Surfaces the in-progress/draft session (if any) so the app can show a
 * "resume" affordance from anywhere — re-checked on every navigation, since
 * that's when a session started/completed/discarded elsewhere would need to
 * be picked up.
 */
export function useActiveWorkoutSession(): WorkoutSession | null {
  const pathname = usePathname();
  const [session, setSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    workoutSessionRepository.getActiveSession().then((found) => {
      if (!cancelled) setSession(found);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return session;
}
