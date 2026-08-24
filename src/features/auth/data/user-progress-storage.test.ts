import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createUserProgressStorage } from "./user-progress-storage";

describe("user-progress-storage", () => {
  it("a first-time user has no progress record yet", () => {
    const storage = createUserProgressStorage(createInMemoryKeyValueStorage());
    expect(storage.get("user-1")).toBeNull();
  });

  it("ensure() creates a default record with habit setup not completed", () => {
    const storage = createUserProgressStorage(createInMemoryKeyValueStorage());
    const progress = storage.ensure("user-1");
    expect(progress).toEqual({ userId: "user-1", habitSetupCompleted: false });
  });

  it("ensure() does not overwrite an existing record", () => {
    const storage = createUserProgressStorage(createInMemoryKeyValueStorage());
    storage.setHabitSetupCompleted("user-1", true);
    const progress = storage.ensure("user-1");
    expect(progress.habitSetupCompleted).toBe(true);
  });

  it("a returning user who already finished setup is recognized as such", () => {
    const kv = createInMemoryKeyValueStorage();
    createUserProgressStorage(kv).setHabitSetupCompleted("user-1", true);
    const reloaded = createUserProgressStorage(kv);
    expect(reloaded.get("user-1")?.habitSetupCompleted).toBe(true);
  });

  it("tracks multiple users independently", () => {
    const storage = createUserProgressStorage(createInMemoryKeyValueStorage());
    storage.setHabitSetupCompleted("user-1", true);
    storage.ensure("user-2");
    expect(storage.get("user-1")?.habitSetupCompleted).toBe(true);
    expect(storage.get("user-2")?.habitSetupCompleted).toBe(false);
  });
});
