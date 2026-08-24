import { describe, expect, it } from "vitest";
import { buildMissionState, getTrainingWeekdays } from "./mission";

describe("getTrainingWeekdays", () => {
  it("returns no days for zero or negative frequency", () => {
    expect(getTrainingWeekdays(0)).toEqual([]);
  });

  it("returns every day for 7", () => {
    expect(getTrainingWeekdays(7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("spreads a partial frequency across exactly that many distinct weekdays", () => {
    const days = getTrainingWeekdays(3);
    expect(days.length).toBe(3);
    days.forEach((d) => expect(d).toBeGreaterThanOrEqual(0));
    days.forEach((d) => expect(d).toBeLessThanOrEqual(6));
  });
});

describe("buildMissionState", () => {
  it("is not configured when the user never answered the frequency question", () => {
    expect(buildMissionState("2026-01-05", null)).toEqual({ status: "notConfigured" });
  });

  it("is a rest day outside the training weekdays", () => {
    // frequency 0 → no training days at all → always rest.
    expect(buildMissionState("2026-01-05", 0).status).toBe("restDay");
  });

  it("proposes the demo workout on a training day", () => {
    const mission = buildMissionState("2026-01-04", 7); // every day trains
    expect(mission.status).toBe("pending");
    expect(mission.workout?.name).toBe("Treino A");
  });
});
