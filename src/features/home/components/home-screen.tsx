"use client";

import { toast } from "sonner";
import { useHomeSnapshot } from "../hooks/use-home-snapshot";
import { HomeHeader } from "./home-header";
import { MissionCard } from "./mission-card";
import { WeekSummaryCard } from "./week-summary-card";
import { StatsCards } from "./stats-cards";
import { HomeSkeleton } from "./home-skeleton";
import { HomeErrorState } from "./home-error-state";
import { TrailCard } from "@/features/trail/components/trail-card";
import { HabitChecklistCard } from "@/features/habits/components/habit-checklist-card";

export function HomeScreen() {
  const {
    snapshot,
    status,
    reload,
    isHabitPending,
    toggleHabit,
    createHabit,
    updateHabit,
    pauseHabit,
    reactivateHabit,
    deleteHabit,
  } = useHomeSnapshot();

  if (status === "loading" || !snapshot) return <HomeSkeleton />;
  if (status === "error") return <HomeErrorState onRetry={reload} />;

  const nextMilestoneMessage =
    snapshot.trail.nextMilestone !== null
      ? `Faltam ${snapshot.trail.stepsRemaining} ${snapshot.trail.stepsRemaining === 1 ? "passo" : "passos"} para o próximo marco.`
      : "Você chegou à meta da sua trilha!";

  return (
    <div className="flex flex-col gap-4 py-2">
      <HomeHeader firstName={snapshot.user.firstName} nextMilestoneMessage={nextMilestoneMessage} />

      <TrailCard
        goal={snapshot.trail.goal}
        nextMilestone={snapshot.trail.nextMilestone}
        stepsRemaining={snapshot.trail.stepsRemaining}
      />

      <MissionCard
        mission={snapshot.mission}
        onStartWorkout={() => toast("Os treinos ainda não estão disponíveis nesta versão.")}
      />

      <HabitChecklistCard
        items={snapshot.habits.items}
        pausedHabits={snapshot.habits.pausedHabits}
        hasAnyHabitsConfigured={snapshot.habits.hasAnyHabitsConfigured}
        isHabitPending={isHabitPending}
        onToggle={toggleHabit}
        onCreate={createHabit}
        onUpdate={updateHabit}
        onPause={pauseHabit}
        onReactivate={reactivateHabit}
        onDelete={deleteHabit}
      />

      <WeekSummaryCard days={snapshot.week} todayKey={snapshot.dateKey} />

      <StatsCards streak={snapshot.streak} lastAchievement={snapshot.lastAchievement} todayKey={snapshot.dateKey} />
    </div>
  );
}
