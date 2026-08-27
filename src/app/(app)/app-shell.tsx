"use client";

import type { ReactNode } from "react";
import { ScreenShell } from "@/components/shared/screen-shell";
import { TabBar, TAB_BAR_HEIGHT_PX } from "@/components/shared/tab-bar";
import { ActiveWorkoutSessionBar } from "@/features/workouts/components/active-workout-session-bar";

/**
 * Pure UI shell for the authenticated tabs (Trilha/Treinos/Perfil) — the
 * scrollable content plus a TRULY fixed bottom TabBar. Authorization is
 * decided one level up, server-side, in layout.tsx (via `getClaims()`)
 * before this ever renders, so there's no client-side redirect/flash logic
 * here at all.
 *
 * The nav is deliberately NOT a flex sibling inside the scrolling column —
 * that previously made it "sticky-by-accident", only reaching the bottom of
 * the viewport once the (possibly tall) content column had fully scrolled
 * into view. `position: fixed` here is relative to the viewport because no
 * ancestor between this element and <body> sets `transform`, `filter`,
 * `perspective`, or `will-change` (any of which would create a new
 * containing block and break that). ScreenShell only sets flex/padding, so
 * that holds.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScreenShell className="px-0 pt-0">
        <div
          className="flex-1 overflow-y-auto px-5 pt-[max(0.5rem,env(safe-area-inset-top))]"
          style={{ paddingBottom: `calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom) + 1.5rem)` }}
        >
          {children}
        </div>
      </ScreenShell>
      <TabBar />
      <ActiveWorkoutSessionBar />
    </>
  );
}
