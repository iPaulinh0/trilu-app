"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkoutShareScreen } from "@/features/workouts/components/workout-share-screen";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

/** Outside the (app) group, same full-screen focus mode as the session route itself. */
export default function CompartilharTreinoPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { user, isHydrated } = useCurrentUser();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;

  return <WorkoutShareScreen sessionId={params.sessionId} />;
}
