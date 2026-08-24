"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkoutSessionScreen } from "@/features/workouts/components/workout-session-screen";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

/**
 * Deliberately outside the (app) route group: this is the "full-screen
 * focus mode" the workout session runs in, so the bottom TabBar never
 * competes with "Próximo exercício" / "Concluir treino".
 */
export default function SessaoTreinoPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { user, isHydrated } = useCurrentUser();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;

  return <WorkoutSessionScreen sessionId={params.sessionId} />;
}
