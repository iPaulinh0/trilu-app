import { ACTIVITY_LEVEL_OPTIONS, GOAL_OPTIONS, type ActivityLevel, type Goal } from "./types";

export function getGoalLabel(goal: Goal | null, customGoal: string | null): string {
  if (!goal) return "";
  if (goal === "outro") return customGoal?.trim() || "Outro objetivo";
  return GOAL_OPTIONS.find((option) => option.value === goal)?.label ?? "";
}

export function getActivityLevelTitle(activityLevel: ActivityLevel | null): string {
  if (!activityLevel) return "";
  return ACTIVITY_LEVEL_OPTIONS.find((option) => option.value === activityLevel)?.title ?? "";
}

export function formatWeeklyFrequency(weeklyFrequency: number | null): string {
  if (weeklyFrequency === null) return "Ainda não sei";
  return weeklyFrequency === 1 ? "1 vez por semana" : `${weeklyFrequency} vezes por semana`;
}
