import { describe, expect, it } from "vitest";
import { resolveSearchTerm } from "./search-aliases";

describe("resolveSearchTerm", () => {
  it("translates known PT-BR aliases to the English term ExerciseDB indexes", () => {
    expect(resolveSearchTerm("supino")).toBe("bench press");
    expect(resolveSearchTerm("agachamento")).toBe("squat");
    expect(resolveSearchTerm("levantamento terra")).toBe("deadlift");
  });

  it("works when the alias is part of a longer phrase", () => {
    expect(resolveSearchTerm("supino reto")).toBe("bench press reto");
  });

  it("leaves an unrecognized query untouched", () => {
    expect(resolveSearchTerm("face pull")).toBe("face pull");
  });

  it("is case-insensitive on the input", () => {
    expect(resolveSearchTerm("Rosca")).toBe("curl");
  });
});
