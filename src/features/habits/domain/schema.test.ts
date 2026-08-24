import { describe, expect, it } from "vitest";
import { habitFormSchema } from "./schema";

const BASE = {
  name: "Meditar",
  description: "Meditar por 10 minutos",
  icon: "brain",
  color: "violet",
  scheduledWeekdays: [1, 3, 5],
};

describe("habitFormSchema", () => {
  it("accepts a well-formed habit", () => {
    expect(habitFormSchema.safeParse(BASE).success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(habitFormSchema.safeParse({ ...BASE, name: "A" }).success).toBe(false);
  });

  it("rejects a name longer than 50 characters", () => {
    expect(habitFormSchema.safeParse({ ...BASE, name: "a".repeat(51) }).success).toBe(false);
  });

  it("requires at least one scheduled weekday", () => {
    expect(habitFormSchema.safeParse({ ...BASE, scheduledWeekdays: [] }).success).toBe(false);
  });

  it("treats an empty description as absent", () => {
    const result = habitFormSchema.safeParse({ ...BASE, description: "" });
    expect(result.success).toBe(true);
    expect(result.success && result.data.description).toBeNull();
  });

  it("rejects an unknown icon or color", () => {
    expect(habitFormSchema.safeParse({ ...BASE, icon: "not-a-real-icon" }).success).toBe(false);
    expect(habitFormSchema.safeParse({ ...BASE, color: "rainbow" }).success).toBe(false);
  });
});
