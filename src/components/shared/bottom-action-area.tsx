import type { ReactNode } from "react";

interface BottomActionAreaProps {
  children: ReactNode;
}

/**
 * Pins the primary action near the bottom of the screen while staying in
 * document flow (no position: fixed, no overlap risk with content).
 */
export function BottomActionArea({ children }: BottomActionAreaProps) {
  return (
    <div className="mt-auto flex flex-col gap-3 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}
