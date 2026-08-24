import { computeSessionMaxLoad, computeSessionTotalReps, computeSessionVolume, isBodyweightOnly } from "./volume";
import type { ExerciseHistoryEntry } from "./workout-session-repository";

export const EVOLUTION_CHART_MIN_SESSIONS = 3;

export interface ExerciseProgressPoint {
  sessionId: string;
  dateKey: string;
  maxLoadKg: number;
  totalReps: number;
  totalVolumeKg: number;
}

/**
 * One point per *distinct completed session* — three sets inside the same
 * workout are one data point, not three, since the gate counts sessions.
 */
export function buildExerciseProgressSeries(entries: ExerciseHistoryEntry[]): ExerciseProgressPoint[] {
  return [...entries]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map((entry) => ({
      sessionId: entry.sessionId,
      dateKey: entry.dateKey,
      maxLoadKg: computeSessionMaxLoad(entry.setLogs),
      totalReps: computeSessionTotalReps(entry.setLogs),
      totalVolumeKg: computeSessionVolume(entry.setLogs),
    }));
}

export function isEvolutionChartUnlocked(distinctSessionCount: number): boolean {
  return distinctSessionCount >= EVOLUTION_CHART_MIN_SESSIONS;
}

export function isExerciseBodyweightOnly(points: ExerciseProgressPoint[]): boolean {
  return isBodyweightOnly(points.map((p) => p.maxLoadKg));
}

export interface MetricSummary {
  latest: number;
  best: number;
  /** null when the first recorded value is 0 — a from-zero % would be misleading. */
  percentChange: number | null;
}

export function summarizeMetric(values: number[]): MetricSummary {
  if (values.length === 0) return { latest: 0, best: 0, percentChange: null };
  const latest = values[values.length - 1];
  const best = Math.max(...values);
  const first = values[0];
  const percentChange = first === 0 ? null : ((latest - first) / first) * 100;
  return { latest, best, percentChange };
}
