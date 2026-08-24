import { getWeekdayFromDateKey } from "@/lib/date/local-date";

export type DailyMissionStatus = "notConfigured" | "restDay" | "pending" | "inProgress" | "completed";

export interface DailyMissionWorkout {
  name: string;
  muscleGroup: string;
  exerciseCount: number;
  estimatedMinutes: number;
}

export interface DailyMissionState {
  status: DailyMissionStatus;
  workout?: DailyMissionWorkout;
}

/**
 * Spreads `count` training days as evenly as possible across a 7-day week.
 * E.g. 3 → roughly every other day; 7 → every day.
 */
export function getTrainingWeekdays(count: number): number[] {
  if (count <= 0) return [];
  if (count >= 7) return [0, 1, 2, 3, 4, 5, 6];
  const days = new Set<number>();
  for (let i = 0; i < count; i += 1) {
    days.add(Math.round((i * 7) / count) % 7);
  }
  return [...days].sort((a, b) => a - b);
}

/**
 * There is no workout-scheduling feature yet, so this derives a
 * placeholder mission purely from the user's onboarding weekly-frequency
 * answer: `null` → not configured at all; otherwise a fixed demo workout on
 * evenly-spaced training days, rest on the others. `inProgress` /
 * `completed` are real states the UI supports but this generator can't
 * produce yet — they'll come from the future workout feature.
 */
export function buildMissionState(dateKey: string, weeklyFrequency: number | null): DailyMissionState {
  if (weeklyFrequency === null) return { status: "notConfigured" };
  const weekday = getWeekdayFromDateKey(dateKey);
  const trainingDays = getTrainingWeekdays(weeklyFrequency);
  if (!trainingDays.includes(weekday)) return { status: "restDay" };
  return {
    status: "pending",
    workout: { name: "Treino A", muscleGroup: "Peito", exerciseCount: 5, estimatedMinutes: 42 },
  };
}
