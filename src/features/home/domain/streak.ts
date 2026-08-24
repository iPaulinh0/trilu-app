import { addDaysToDateKey } from "@/lib/date/local-date";

export interface StreakResult {
  current: number;
  best: number;
}

export interface CalculateStreakInput {
  /** Local dateKeys where the user completed a habit or the day's mission. */
  qualifyingDateKeys: string[];
  /** Local dateKeys where nothing at all was scheduled (true rest days). */
  restDateKeys: string[];
  todayKey: string;
}

/**
 * Consecutive-day streak, in local calendar days. A day breaks the streak
 * only if something was scheduled and nothing was completed; a day with
 * nothing scheduled at all (rest) just carries the streak through
 * untouched. Today is judged leniently — an incomplete-so-far today never
 * retroactively breaks yesterday's streak, since the day isn't over.
 */
export function calculateStreak({ qualifyingDateKeys, restDateKeys, todayKey }: CalculateStreakInput): StreakResult {
  const qualifying = new Set(qualifyingDateKeys);
  const rest = new Set(restDateKeys);
  const allKnownKeys = [...qualifying, ...rest].filter((key) => key < todayKey);

  if (allKnownKeys.length === 0) {
    return { current: qualifying.has(todayKey) ? 1 : 0, best: qualifying.has(todayKey) ? 1 : 0 };
  }

  const earliest = allKnownKeys.reduce((min, key) => (key < min ? key : min), todayKey);

  let running = 0;
  let best = 0;
  let cursor = earliest;
  while (cursor < todayKey) {
    if (qualifying.has(cursor)) {
      running += 1;
    } else if (!rest.has(cursor)) {
      running = 0;
    }
    best = Math.max(best, running);
    cursor = addDaysToDateKey(cursor, 1);
  }

  if (qualifying.has(todayKey)) {
    running += 1;
  }
  best = Math.max(best, running);

  return { current: running, best };
}
