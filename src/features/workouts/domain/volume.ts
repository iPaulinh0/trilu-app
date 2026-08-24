import type { SetLog } from "./types";

/** Only sets the user actually marked done ever count — drafts/suggestions never do. */
function completedOnly(setLogs: SetLog[]): SetLog[] {
  return setLogs.filter((s) => s.completedAt !== null);
}

export function computeSetVolume(set: SetLog): number {
  return set.weightKg * set.repetitions;
}

/** Σ pesoKg × repetições, over completed sets only. */
export function computeSessionVolume(setLogs: SetLog[]): number {
  return completedOnly(setLogs).reduce((sum, s) => sum + computeSetVolume(s), 0);
}

export function computeSessionMaxLoad(setLogs: SetLog[]): number {
  const completed = completedOnly(setLogs);
  if (completed.length === 0) return 0;
  return Math.max(...completed.map((s) => s.weightKg));
}

export function computeSessionTotalReps(setLogs: SetLog[]): number {
  return completedOnly(setLogs).reduce((sum, s) => sum + s.repetitions, 0);
}

export function countCompletedSets(setLogs: SetLog[]): number {
  return completedOnly(setLogs).length;
}

/** Never computed when the first value is zero — a from-zero % is meaningless/misleading. */
export function computePercentChange(first: number, last: number): number | null {
  if (first === 0) return null;
  return ((last - first) / first) * 100;
}

/** True once every completed set for this exercise, across all sessions, used 0 kg. */
export function isBodyweightOnly(sessionLoads: number[]): boolean {
  return sessionLoads.length > 0 && sessionLoads.every((load) => load === 0);
}
