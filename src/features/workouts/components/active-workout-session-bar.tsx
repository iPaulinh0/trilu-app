"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DumbbellIcon } from "lucide-react";
import { useActiveWorkoutSession } from "../hooks/use-active-workout-session";
import { TAB_BAR_HEIGHT_PX } from "@/components/shared/tab-bar";

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Floating "resume workout" pill, shown above the tab bar on every
 * authenticated screen while a session is in progress — navigating away
 * from the session screen (via the header's "Ver meus treinos" button)
 * never pauses or discards it, so this is how the user gets back in.
 */
export function ActiveWorkoutSessionBar() {
  const session = useActiveWorkoutSession();
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(session.startedAt).getTime()) / 1000));

  return (
    <button
      type="button"
      onClick={() => router.push(`/treinos/sessao/${session.id}`)}
      style={{ bottom: `calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom) + 0.75rem)` }}
      className="fixed inset-x-0 z-40 mx-auto flex w-[calc(100%-2.5rem)] max-w-[390px] items-center gap-3 rounded-full bg-violet-600 px-4 py-3 text-left text-white shadow-[var(--shadow-raised)] transition-transform active:scale-[var(--press-scale)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
      aria-label={`Voltar para o treino ${session.workoutNameSnapshot}, em andamento há ${formatElapsed(elapsedSeconds)}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
        <DumbbellIcon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold">{session.workoutNameSnapshot}</span>
      <span className="shrink-0 font-display text-sm font-extrabold tabular-nums" aria-hidden>
        {formatElapsed(elapsedSeconds)}
      </span>
    </button>
  );
}
