"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ScreenShell } from "@/components/shared/screen-shell";
import { TabBar } from "@/components/shared/tab-bar";
import { userProgressStorage } from "@/lib/services";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

/**
 * Shared shell for the authenticated tabs (Trilha/Treino/Amigos/Perfil):
 * guards on session + first-run habit setup, then renders the bottom
 * TabBar alongside a scrollable content area.
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
    <ScreenShell className="px-0 pt-0">
      <div className="flex-1 overflow-y-auto px-5 pt-[max(0.5rem,env(safe-area-inset-top))]">{children}</div>
      <TabBar />
    </ScreenShell>
  );
}
