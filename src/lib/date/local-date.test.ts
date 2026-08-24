import { describe, expect, it } from "vitest";
import {
  addDaysToDateKey,
  formatRelativeDateKey,
  getLastNDateKeys,
  getWeekdayFromDateKey,
  isFutureDateKey,
  toDateKey,
} from "./local-date";

describe("toDateKey", () => {
  it("formats using local getFullYear/getMonth/getDate — never toISOString", () => {
    // 2026-01-05 23:30 local time would roll to 2026-01-06 in UTC+ zones if
    // toISOString() were used; toDateKey must keep the local calendar day.
    const date = new Date(2026, 0, 5, 23, 30, 0);
    expect(toDateKey(date)).toBe("2026-01-05");
  });

  it("pads single-digit month and day", () => {
    expect(toDateKey(new Date(2026, 2, 4))).toBe("2026-03-04");
  });
});

describe("addDaysToDateKey", () => {
  it("adds days across a month boundary", () => {
    expect(addDaysToDateKey("2026-01-30", 3)).toBe("2026-02-02");
  });

  it("subtracts days with a negative amount", () => {
    expect(addDaysToDateKey("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("handles a leap-year February correctly", () => {
    expect(addDaysToDateKey("2028-02-28", 1)).toBe("2028-02-29");
  });
});

describe("getWeekdayFromDateKey", () => {
  it("matches Date#getDay() (0 = domingo)", () => {
    // 2026-01-04 is a Sunday.
    expect(getWeekdayFromDateKey("2026-01-04")).toBe(0);
    expect(getWeekdayFromDateKey("2026-01-05")).toBe(1);
  });
});

describe("isFutureDateKey", () => {
  it("compares string dateKeys lexicographically", () => {
    expect(isFutureDateKey("2026-01-06", "2026-01-05")).toBe(true);
    expect(isFutureDateKey("2026-01-04", "2026-01-05")).toBe(false);
    expect(isFutureDateKey("2026-01-05", "2026-01-05")).toBe(false);
  });
});

describe("getLastNDateKeys", () => {
  it("returns an ascending run ending at the given day, inclusive", () => {
    expect(getLastNDateKeys(3, "2026-01-05")).toEqual(["2026-01-03", "2026-01-04", "2026-01-05"]);
  });
});

describe("formatRelativeDateKey", () => {
  const today = "2026-01-10";

  it("labels today and yesterday", () => {
    expect(formatRelativeDateKey(today, today)).toBe("hoje");
    expect(formatRelativeDateKey("2026-01-09", today)).toBe("ontem");
  });

  it("counts days for anything within the last week", () => {
    expect(formatRelativeDateKey("2026-01-05", today)).toBe("há 5 dias");
  });
});
