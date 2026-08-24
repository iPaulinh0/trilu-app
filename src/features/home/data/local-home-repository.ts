import { addDaysToDateKey, getWeekdayFromDateKey } from "@/lib/date/local-date";
import type { HabitRepository } from "@/features/habits/domain/habit-repository";
import type { TrailRepository } from "@/features/trail/domain/trail-repository";
import { getLastAchievement, getNextMilestone } from "@/features/trail/domain/milestones";
import { buildDailyActivity } from "../domain/daily-activity";
import { calculateStreak } from "../domain/streak";
import { buildMissionState } from "../domain/mission";
import type { HomeRepository } from "../domain/home-repository";
import type { HomeSnapshot, WeekDaySummary, WeekDayStatus } from "../domain/types";

const WEEK_WINDOW_DAYS = 7;

export interface LocalHomeRepositoryDeps {
  habitRepository: HabitRepository;
  trailRepository: TrailRepository;
  getUserFirstName: () => string;
  getWeeklyFrequency: () => number | null;
}

export function createLocalHomeRepository({
  habitRepository,
  trailRepository,
  getUserFirstName,
  getWeeklyFrequency,
}: LocalHomeRepositoryDeps): HomeRepository {
  return {
    async getHomeSnapshot(dateKey): Promise<HomeSnapshot> {
      const goal = await trailRepository.getOrCreateDefaultGoal();
      const weeklyFrequency = getWeeklyFrequency();

      const scheduledToday = await habitRepository.listScheduledForDate(dateKey);
      const allHabits = await habitRepository.listAll();
      const rangeStart = addDaysToDateKey(dateKey, -(WEEK_WINDOW_DAYS - 1));
      const entriesInRange = await habitRepository.listEntriesForUserBetween(rangeStart, dateKey);

      const entriesToday = entriesInRange.filter((e) => e.dateKey === dateKey);
      const checklist = scheduledToday.map((habit) => ({
        habit,
        completedToday: entriesToday.some((e) => e.habitId === habit.id),
      }));

      const week: WeekDaySummary[] = [];
      const qualifyingDateKeys: string[] = [];
      const restDateKeys: string[] = [];

      for (let offset = WEEK_WINDOW_DAYS - 1; offset >= 0; offset -= 1) {
        const dk = addDaysToDateKey(dateKey, -offset);
        const weekday = getWeekdayFromDateKey(dk);
        const scheduledHabitsForDay = allHabits.filter((h) => h.isActive && h.scheduledWeekdays.includes(weekday));
        const entriesForDay = entriesInRange.filter((e) => e.dateKey === dk);
        const dayMission = buildMissionState(dk, weeklyFrequency);
        const activity = buildDailyActivity({
          dateKey: dk,
          scheduledHabits: scheduledHabitsForDay,
          entriesForDay,
          missionScheduled: dayMission.status !== "notConfigured" && dayMission.status !== "restDay",
          missionCompleted: dayMission.status === "completed",
        });

        if (activity.completedQualifyingAction) qualifyingDateKeys.push(dk);
        else if (!activity.hadScheduledAction) restDateKeys.push(dk);

        const status: WeekDayStatus =
          dk > dateKey
            ? "future"
            : dk === dateKey
              ? "today"
              : activity.completedQualifyingAction
                ? "completed"
                : !activity.hadScheduledAction
                  ? "rest"
                  : "missed";

        week.push({ dateKey: dk, weekday, status, stepsEarned: entriesForDay.length });
      }

      const streak = calculateStreak({ qualifyingDateKeys, restDateKeys, todayKey: dateKey });
      const contributions = await trailRepository.listContributionsForGoal(goal.id);
      const lastAchievement = getLastAchievement(goal, contributions);
      const { nextMilestone, stepsRemaining } = getNextMilestone(goal);

      return {
        dateKey,
        user: { firstName: getUserFirstName() },
        trail: { goal, nextMilestone, stepsRemaining },
        mission: buildMissionState(dateKey, weeklyFrequency),
        habits: {
          items: checklist,
          pausedHabits: allHabits.filter((h) => !h.isActive),
          hasAnyHabitsConfigured: allHabits.length > 0,
        },
        week,
        streak,
        lastAchievement,
      };
    },
  };
}
