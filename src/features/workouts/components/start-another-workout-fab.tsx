"use client";

import { DumbbellIcon } from "lucide-react";
import { TAB_BAR_HEIGHT_PX } from "@/components/shared/tab-bar";

interface StartAnotherWorkoutFabProps {
  onClick: () => void;
}

/**
 * Shown only once today's workout is already logged, when the workout list
 * itself is replaced by a summary — this is how the user gets back to
 * picking a workout to train again the same day. Floats over the page's own
 * content, clear of the tab bar — never overlapping or embedded in it.
 */
export function StartAnotherWorkoutFab({ onClick }: StartAnotherWorkoutFabProps) {
  return (
    // Full-width, pointer-events-none wrapper so the FAB can be positioned
    // relative to the app's centered 430px column (like TabBar's <nav>)
    // instead of the raw viewport edge, which would strand it on desktop.
    <div
      className="pointer-events-none fixed inset-x-0 z-40"
      style={{ bottom: `calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom) + 1.25rem)` }}
    >
      <div className="relative mx-auto max-w-[430px]">
        <button
          type="button"
          onClick={onClick}
          aria-label="Fazer outro treino hoje"
          className="pointer-events-auto absolute right-5 bottom-0 flex size-14 items-center justify-center rounded-full bg-coral-500 text-white shadow-[var(--shadow-coral)] outline-none transition-transform active:scale-[var(--press-scale)] focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <DumbbellIcon className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}
