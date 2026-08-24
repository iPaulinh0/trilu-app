import type { Habit } from "@/features/habits/domain/types";
import type { TrailGoal } from "@/features/trail/domain/types";
import type { DailyMissionState } from "./mission";

export interface HabitChecklistItem {
  habit: Habit;
  completedToday: boolean;
}

export type WeekDayStatus = "completed" | "today" | "rest" | "future" | "missed";

export interface WeekDaySummary {
  dateKey: string;
  weekday: number;
  status: WeekDayStatus;
  stepsEarned: number;
}

export interface HomeSnapshot {
  dateKey: string;
  user: { firstName: string; avatarUrl: string | null };
  trail: {
    goal: TrailGoal;
    nextMilestone: number | null;
    stepsRemaining: number | null;
  };
  mission: DailyMissionState;
  habits: {
    items: HabitChecklistItem[];
    pausedHabits: Habit[];
    hasAnyHabitsConfigured: boolean;
  };
  week: WeekDaySummary[];
  streak: { current: number; best: number };
  lastAchievement: { title: string; dateKey: string } | null;
}
