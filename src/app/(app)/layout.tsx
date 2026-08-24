"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ScreenShell } from "@/components/shared/screen-shell";
import { TabBar, TAB_BAR_HEIGHT_PX } from "@/components/shared/tab-bar";
import { userProgressStorage } from "@/lib/services";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

/**
 * Shared shell for the authenticated tabs (Trilha/Treinos/Perfil): guards on
 * session + first-run habit setup, then renders the scrollable content plus
 * a TRULY fixed bottom TabBar.
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
export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isHydrated } = useCurrentUser();
  const progress = user ? userProgressStorage.get(user.id) : null;
  const canRender = isHydrated && !!user && !!progress?.habitSetupCompleted;

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
    } else if (!progress?.habitSetupCompleted) {
      router.replace("/configuracao-habitos");
    }
  }, [isHydrated, user, progress?.habitSetupCompleted, router]);

  if (!canRender) return null;

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
    </>
  );
}
