"use client";

import { ChevronLeftIcon } from "lucide-react";
import { Logo } from "./logo";
import { ProgressBar } from "./progress-bar";

interface StepHeaderProps {
  onBack: () => void;
  stepIndex: number;
  totalSteps: number;
}

/** Shared chrome for every onboarding question screen. */
export function StepHeader({ onBack, stepIndex, totalSteps }: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <ChevronLeftIcon className="size-6" aria-hidden />
        </button>
        <Logo height={22} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-[0.08em] text-ink-500">
          PASSO {stepIndex} DE {totalSteps}
        </span>
        <ProgressBar value={stepIndex} max={totalSteps} label={`Passo ${stepIndex} de ${totalSteps}`} />
      </div>
    </div>
  );
}
