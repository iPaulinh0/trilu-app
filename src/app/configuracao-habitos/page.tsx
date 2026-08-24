"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HabitSetupScreen } from "@/features/habits/components/habit-setup-screen";
import { ScreenShell } from "@/components/shared/screen-shell";
import { habitRepository, userProgressStorage } from "@/lib/services";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import type { CreateHabitInput } from "@/features/habits/domain/types";

export default function ConfiguracaoHabitosPage() {
  const router = useRouter();
  const { user, isHydrated } = useCurrentUser();

  useEffect(() => {
    if (isHydrated && !user) router.replace("/login");
  }, [isHydrated, user, router]);

  if (!isHydrated || !user) return null;
  const userId = user.id;

  async function handleFinish(habits: CreateHabitInput[]) {
    for (const habit of habits) {
      // Sequential on purpose: each create() checks the active-habit cap
      // against what was just persisted, so concurrent writes could race.
      await habitRepository.create(habit);
    }
    userProgressStorage.setHabitSetupCompleted(userId, true);
    router.push("/trilha");
  }

  function handleSkip() {
    userProgressStorage.setHabitSetupCompleted(userId, true);
    router.push("/trilha");
  }

  return (
    <ScreenShell>
      <HabitSetupScreen onFinish={handleFinish} onSkip={handleSkip} />
    </ScreenShell>
  );
}
