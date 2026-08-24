"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, PlusIcon, Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { startRestTimer, pauseRestTimer, resumeRestTimer, addSecondsToRestTimer } from "../domain/rest-timer";
import { useRestTimerDisplay } from "../hooks/use-rest-timer-display";
import { REST_PRESETS_SECONDS } from "../domain/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RestTimerState } from "../domain/types";

interface RestTimerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timer: RestTimerState | null;
  onChangeTimer: (timer: RestTimerState | null) => void;
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * A discreet, non-modal overlay — deliberately NOT a shadcn/vaul Drawer,
 * which renders a full-screen blocking backdrop. The brief explicitly
 * wants the rest timer to never pull the user out of the session, so
 * everything behind it (other sets, exercise navigation, "Concluir
 * treino") must stay tappable while it's open.
 */
export function RestTimerDrawer({ open, onOpenChange, timer, onChangeTimer }: RestTimerDrawerProps) {
  const { remainingSeconds, isFinished } = useRestTimerDisplay(timer);
  const [customSeconds, setCustomSeconds] = useState("45");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const hasAnnouncedFinish = useRef(false);

  useEffect(() => {
    if (!timer) hasAnnouncedFinish.current = false;
  }, [timer]);

  useEffect(() => {
    if (!isFinished || hasAnnouncedFinish.current) return;
    hasAnnouncedFinish.current = true;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(200);
    }
    if (soundEnabled && typeof window !== "undefined" && "AudioContext" in window) {
      try {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        oscillator.frequency.value = 880;
        oscillator.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.25);
        oscillator.onended = () => ctx.close();
      } catch {
        // Sound is a nice-to-have — never block the timer on playback errors.
      }
    }
  }, [isFinished, soundEnabled]);

  function startPreset(seconds: number) {
    onChangeTimer(startRestTimer(seconds));
  }

  function dismiss() {
    onChangeTimer(null);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Descanso"
      className={cn(
        "flex w-full flex-col gap-4 rounded-2xl border border-ink-100 bg-card p-4 shadow-overlay",
        "motion-safe:animate-[trilu-rise_var(--dur-slow)_var(--ease-out)]",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-ink-900">Descanso</span>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Minimizar descanso"
          className="flex size-9 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      </div>

      {!timer ? (
        <div className="flex flex-col items-center gap-4 pb-2">
          <p className="text-sm text-ink-500">Escolha quanto tempo você quer descansar.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {REST_PRESETS_SECONDS.map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => startPreset(seconds)}
                className="min-h-11 rounded-full border-2 border-ink-200 bg-card px-4 text-sm font-bold text-ink-700 hover:border-violet-300"
              >
                {seconds}s
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value)}
              className="w-24"
              aria-label="Descanso personalizado em segundos"
            />
            <Button type="button" variant="outline" onClick={() => startPreset(Math.max(1, Number(customSeconds) || 0))}>
              Personalizado
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 pb-2">
          <p
            className="font-display text-5xl font-extrabold text-ink-900"
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatClock(remainingSeconds)}
          </p>
          {isFinished ? <p className="font-bold text-mint-600">Descanso concluído!</p> : null}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeTimer(timer.isPaused ? resumeRestTimer(timer) : pauseRestTimer(timer))}
              aria-label={timer.isPaused ? "Continuar descanso" : "Pausar descanso"}
              className="flex size-14 items-center justify-center rounded-full bg-violet-500 text-white shadow-brand"
            >
              {timer.isPaused ? <PlayIcon className="size-6" aria-hidden /> : <PauseIcon className="size-6" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => onChangeTimer(addSecondsToRestTimer(timer, 30))}
              className="flex min-h-11 items-center gap-1 rounded-full border-2 border-ink-200 px-3 text-sm font-bold text-ink-700"
            >
              <PlusIcon className="size-4" aria-hidden />
              30s
            </button>
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              aria-label={soundEnabled ? "Desativar som" : "Ativar som"}
              aria-pressed={soundEnabled}
              className="flex size-11 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
            >
              {soundEnabled ? <Volume2Icon className="size-5" aria-hidden /> : <VolumeXIcon className="size-5" aria-hidden />}
            </button>
          </div>

          <div className="flex w-full gap-2">
            <Button type="button" variant="outline" block onClick={dismiss}>
              Pular
            </Button>
            <Button type="button" variant="ghost" block onClick={dismiss}>
              Encerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
