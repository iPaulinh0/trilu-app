import { describe, expect, it } from "vitest";
import { calculateStreak } from "./streak";

describe("calculateStreak", () => {
  it("counts consecutive qualifying days ending today", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-03", "2026-01-04", "2026-01-05"],
      restDateKeys: [],
      todayKey: "2026-01-05",
    });
    expect(result.current).toBe(3);
    expect(result.best).toBe(3);
  });

  it("does not break the streak on a true rest day (nothing scheduled)", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-03", "2026-01-05"],
      restDateKeys: ["2026-01-04"],
      todayKey: "2026-01-05",
    });
    // The rest day passes the streak through without resetting it, but the
    // count itself only reflects days something was actually completed.
    expect(result.current).toBe(2);
  });

  it("breaks the streak on a day with something scheduled but nothing completed", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-01", "2026-01-02", "2026-01-04", "2026-01-05"],
      restDateKeys: [],
      todayKey: "2026-01-05",
    });
    // 2026-01-03 is neither qualifying nor rest — the streak restarts after it.
    expect(result.current).toBe(2);
    expect(result.best).toBe(2);
  });

  it("does not let an incomplete today retroactively break yesterday's streak", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-03", "2026-01-04"],
      restDateKeys: [],
      todayKey: "2026-01-05",
    });
    // Today (01-05) has nothing yet, but the day isn't over — still counts
    // the streak built through yesterday.
    expect(result.current).toBe(2);
  });

  it("never lets a future date count", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-05", "2026-01-06"],
      restDateKeys: [],
      todayKey: "2026-01-05",
    });
    expect(result.current).toBe(1);
  });

  it("tracks the best streak separately from the current one", () => {
    const result = calculateStreak({
      qualifyingDateKeys: ["2026-01-01", "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-08"],
      restDateKeys: [],
      todayKey: "2026-01-10",
    });
    // 01-05 through 01-07 are unaccounted-for days that break the streak,
    // so the run built through 01-08 (best = 4) is long over by 01-10.
    expect(result.best).toBe(4);
    expect(result.current).toBe(0);
  });

  it("returns zero for a brand-new user with no history", () => {
    const result = calculateStreak({ qualifyingDateKeys: [], restDateKeys: [], todayKey: "2026-01-05" });
    expect(result).toEqual({ current: 0, best: 0 });
  });
});
