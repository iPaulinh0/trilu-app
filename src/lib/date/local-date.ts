/**
 * Local-calendar date helpers. Everything here operates on the user's local
 * wall-clock date, never UTC — `toISOString()` shifts by the timezone
 * offset and can silently roll a date to the previous/next day, which would
 * corrupt streaks and daily habit keys. Keep this module free of React/DOM.
 */

/** "YYYY-MM-DD" for the given date, in local time. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today's dateKey. Isolated so tests can inject a fixed `now`. */
export function todayDateKey(now: Date = new Date()): string {
  return toDateKey(now);
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Adds (or subtracts, with a negative n) whole days to a dateKey. */
export function addDaysToDateKey(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

/** JS weekday index: 0 = domingo … 6 = sábado. */
export function getWeekdayFromDateKey(dateKey: string): number {
  return parseDateKey(dateKey).getDay();
}

export function isFutureDateKey(dateKey: string, todayKey: string): boolean {
  return dateKey > todayKey;
}

/** Ascending list of the last `count` dateKeys, ending at `endDateKey` (inclusive). */
export function getLastNDateKeys(count: number, endDateKey: string): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    keys.push(addDaysToDateKey(endDateKey, -i));
  }
  return keys;
}

const RELATIVE_WEEKDAY_LABELS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** "hoje" / "ontem" / "há N dias" / weekday name, relative to `todayKey`. */
export function formatRelativeDateKey(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return "hoje";
  const yesterday = addDaysToDateKey(todayKey, -1);
  if (dateKey === yesterday) return "ontem";
  let diff = 0;
  let cursor = todayKey;
  while (cursor > dateKey && diff < 400) {
    cursor = addDaysToDateKey(cursor, -1);
    diff += 1;
  }
  if (diff <= 6) return `há ${diff} dias`;
  return RELATIVE_WEEKDAY_LABELS[getWeekdayFromDateKey(dateKey)];
}
