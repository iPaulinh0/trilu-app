"use client";

import { useParams } from "next/navigation";
import { ExerciseProgressScreen } from "@/features/workouts/components/exercise-progress-screen";

export default function ExercicioProgressoPage() {
  const params = useParams<{ exerciseId: string }>();
  return <ExerciseProgressScreen routeId={params.exerciseId} />;
}
