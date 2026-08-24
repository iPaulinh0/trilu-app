"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toBlob } from "html-to-image";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import { workoutRepository, workoutSessionRepository } from "@/lib/services";
import { computeSessionTotalReps, computeSessionVolume } from "../domain/volume";
import { formatRelativeDateKey, todayDateKey, toDateKey } from "@/lib/date/local-date";
import { WorkoutShareCard } from "./workout-share-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";
import type { TriluMuscleGroup } from "@/features/exercises/domain/types";
import type { WorkoutSession } from "../domain/types";

interface ShareData {
  session: WorkoutSession;
  muscleGroups: TriluMuscleGroup[];
}

function capitalize(text: string): string {
  return text.length > 0 ? text[0].toUpperCase() + text.slice(1) : text;
}

interface WorkoutShareScreenProps {
  sessionId: string;
}

export function WorkoutShareScreen({ sessionId }: WorkoutShareScreenProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ShareData | null | undefined>(undefined);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await workoutSessionRepository.getById(sessionId);
      if (!session || session.status !== "completed") {
        setData(null);
        return;
      }
      const template = await workoutRepository.getById(session.workoutTemplateId);
      setData({ session, muscleGroups: template?.template.muscleGroups ?? [] });
    })();
  }, [sessionId]);

  async function handleShare() {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 3, cacheBust: true });
      if (!blob) throw new Error("Falha ao gerar a imagem.");
      const file = new File([blob], "treino-trilu.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Meu treino no Trilu" });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "treino-trilu.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        toast.success("Imagem baixada!");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Não foi possível gerar a imagem agora.");
    } finally {
      setIsSharing(false);
    }
  }

  if (data === undefined) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col items-center justify-center gap-3 px-5 text-center">
        <Mascot size={110} />
        <h1 className="text-xl font-bold text-ink-900">Não encontramos esse treino para compartilhar.</h1>
        <Button type="button" variant="accent" onClick={() => router.push("/trilha")}>
          Ver minha trilha
        </Button>
      </div>
    );
  }

  const { session, muscleGroups } = data;
  const allSets = session.exerciseSessions.flatMap((es) => es.setLogs);
  const dateKey = session.completedAt ? toDateKey(new Date(session.completedAt)) : todayDateKey();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col gap-5 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between gap-2 py-2">
        <button
          type="button"
          onClick={() => router.push("/trilha")}
          aria-label="Fechar"
          className="flex size-11 items-center justify-center rounded-full text-ink-700 hover:bg-ink-50"
        >
          <XIcon className="size-5" aria-hidden />
        </button>
        <h1 className="text-base font-bold text-ink-900">Compartilhar treino</h1>
        <div className="size-11" aria-hidden />
      </header>

      <WorkoutShareCard
        ref={cardRef}
        workoutName={session.workoutNameSnapshot}
        dateLabel={capitalize(formatRelativeDateKey(dateKey, todayDateKey()))}
        durationSeconds={session.durationSeconds ?? 0}
        muscleGroups={muscleGroups}
        totalReps={computeSessionTotalReps(allSets)}
        totalVolumeKg={computeSessionVolume(allSets)}
      />

      <Button type="button" variant="accent" size="lg" block loading={isSharing} onClick={handleShare}>
        Compartilhar
      </Button>
    </div>
  );
}
