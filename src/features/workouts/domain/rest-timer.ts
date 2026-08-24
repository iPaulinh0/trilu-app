import type { RestTimerState } from "./types";

/**
 * Wall-clock rest timer. The remaining time is always *derived* from
 * `endsAt` vs `now` — never a variable ticking down once a second — so it
 * stays correct across tab switches, screen locks, and page reloads.
 */
export function startRestTimer(durationSeconds: number, now: Date = new Date()): RestTimerState {
  return {
    durationSeconds,
    endsAt: new Date(now.getTime() + durationSeconds * 1000).toISOString(),
    remainingSecondsWhenPaused: null,
    isPaused: false,
  };
}

export function pauseRestTimer(timer: RestTimerState, now: Date = new Date()): RestTimerState {
  if (timer.isPaused || !timer.endsAt) return timer;
  const remaining = Math.max(0, Math.round((new Date(timer.endsAt).getTime() - now.getTime()) / 1000));
  return { ...timer, isPaused: true, endsAt: null, remainingSecondsWhenPaused: remaining };
}

export function resumeRestTimer(timer: RestTimerState, now: Date = new Date()): RestTimerState {
  if (!timer.isPaused || timer.remainingSecondsWhenPaused === null) return timer;
  return {
    ...timer,
    isPaused: false,
    endsAt: new Date(now.getTime() + timer.remainingSecondsWhenPaused * 1000).toISOString(),
    remainingSecondsWhenPaused: null,
  };
}

export function addSecondsToRestTimer(timer: RestTimerState, seconds: number): RestTimerState {
  if (timer.isPaused && timer.remainingSecondsWhenPaused !== null) {
    return { ...timer, remainingSecondsWhenPaused: timer.remainingSecondsWhenPaused + seconds };
  }
  if (!timer.endsAt) return timer;
  return { ...timer, endsAt: new Date(new Date(timer.endsAt).getTime() + seconds * 1000).toISOString() };
}

export function getRemainingSeconds(timer: RestTimerState | null, now: Date = new Date()): number {
  if (!timer) return 0;
  if (timer.isPaused) return timer.remainingSecondsWhenPaused ?? 0;
  if (!timer.endsAt) return 0;
  return Math.max(0, Math.round((new Date(timer.endsAt).getTime() - now.getTime()) / 1000));
}

export function isRestTimerFinished(timer: RestTimerState | null, now: Date = new Date()): boolean {
  return timer !== null && !timer.isPaused && getRemainingSeconds(timer, now) <= 0;
}
