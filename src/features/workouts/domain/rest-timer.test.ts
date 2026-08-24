import { describe, expect, it } from "vitest";
import {
  addSecondsToRestTimer,
  getRemainingSeconds,
  isRestTimerFinished,
  pauseRestTimer,
  resumeRestTimer,
  startRestTimer,
} from "./rest-timer";

describe("rest timer", () => {
  it("derives remaining time from endsAt vs now, not a decrementing counter", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    const timer = startRestTimer(90, now);
    expect(getRemainingSeconds(timer, now)).toBe(90);
    expect(getRemainingSeconds(timer, new Date(now.getTime() + 30_000))).toBe(60);
  });

  it("recovers correctly after time has passed (simulating a reload)", () => {
    const startedAt = new Date("2026-01-01T10:00:00.000Z");
    const timer = startRestTimer(60, startedAt);
    // Simulate the page reloading 45s later — the timer must reflect that
    // elapsed time, not restart.
    const reloadedAt = new Date(startedAt.getTime() + 45_000);
    expect(getRemainingSeconds(timer, reloadedAt)).toBe(15);
  });

  it("never goes negative once the duration has fully elapsed", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    const timer = startRestTimer(30, now);
    const later = new Date(now.getTime() + 120_000);
    expect(getRemainingSeconds(timer, later)).toBe(0);
    expect(isRestTimerFinished(timer, later)).toBe(true);
  });

  it("freezes the remaining time while paused", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    let timer = startRestTimer(60, now);
    const pausedAt = new Date(now.getTime() + 20_000);
    timer = pauseRestTimer(timer, pausedAt);
    expect(timer.isPaused).toBe(true);
    expect(getRemainingSeconds(timer, new Date(pausedAt.getTime() + 30_000))).toBe(40);
  });

  it("resumes counting down from where it was paused", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    let timer = startRestTimer(60, now);
    timer = pauseRestTimer(timer, new Date(now.getTime() + 20_000)); // 40s left
    const resumedAt = new Date(now.getTime() + 25_000);
    timer = resumeRestTimer(timer, resumedAt);
    expect(getRemainingSeconds(timer, new Date(resumedAt.getTime() + 10_000))).toBe(30);
  });

  it("adds seconds to a running timer", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    const timer = addSecondsToRestTimer(startRestTimer(30, now), 30);
    expect(getRemainingSeconds(timer, now)).toBe(60);
  });

  it("adds seconds to a paused timer's frozen remainder", () => {
    const now = new Date("2026-01-01T10:00:00.000Z");
    let timer = startRestTimer(30, now);
    timer = pauseRestTimer(timer, new Date(now.getTime() + 10_000)); // 20s left
    timer = addSecondsToRestTimer(timer, 30);
    expect(timer.remainingSecondsWhenPaused).toBe(50);
  });
});
