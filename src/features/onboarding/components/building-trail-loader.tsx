"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/shared/mascot";

const MESSAGES = ["Analisando suas respostas...", "Calculando seu metabolismo...", "Montando sua trilha..."];

const STEP_MS = 40;
const TOTAL_DURATION_MS = 2200;

interface BuildingTrailLoaderProps {
  onComplete: () => void;
}

/**
 * Deliberately-paced transition between the metabolic result and signup —
 * without this, clicking "Criar minha trilha" felt unresponsive during the
 * brief route change, with nothing telling the person their tap registered.
 */
export function BuildingTrailLoader({ onComplete }: BuildingTrailLoaderProps) {
  const [progress, setProgress] = useState(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const increment = 100 / (TOTAL_DURATION_MS / STEP_MS);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + increment));
    }, STEP_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [progress, onComplete]);

  const messageIndex = Math.min(MESSAGES.length - 1, Math.floor((progress / 100) * MESSAGES.length));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <Mascot size={140} priority />
      <div className="flex w-full max-w-xs flex-col gap-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-violet-500 transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-base font-bold text-ink-900" aria-live="polite">
          {MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  );
}
