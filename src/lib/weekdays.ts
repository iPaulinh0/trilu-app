/** 0 = domingo … 6 = sábado — matches Date#getDay(). Shared across habits and workouts. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const ALL_WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: "Dom",
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
};
