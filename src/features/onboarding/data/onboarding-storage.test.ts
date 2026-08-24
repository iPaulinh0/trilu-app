import { describe, expect, it } from "vitest";
import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createOnboardingStorage } from "./onboarding-storage";
import { createEmptyOnboardingDraft } from "../domain/types";

function createInMemoryKeyValueStorage(): KeyValueStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

describe("onboarding-storage", () => {
  it("returns null when nothing was saved yet", () => {
    const storage = createOnboardingStorage(createInMemoryKeyValueStorage());
    expect(storage.load()).toBeNull();
  });

  it("recovers a saved draft with its in-progress step", () => {
    const storage = createOnboardingStorage(createInMemoryKeyValueStorage());
    const draft = { ...createEmptyOnboardingDraft(), age: 25, currentStep: "peso" as const };

    storage.save(draft);
    const recovered = storage.load();

    expect(recovered?.age).toBe(25);
    expect(recovered?.currentStep).toBe("peso");
  });

  it("clears the draft", () => {
    const storage = createOnboardingStorage(createInMemoryKeyValueStorage());
    storage.save(createEmptyOnboardingDraft());
    storage.clear();
    expect(storage.load()).toBeNull();
  });

  it("ignores corrupted JSON instead of throwing", () => {
    const kv = createInMemoryKeyValueStorage();
    kv.setItem("trilu.onboarding.draft.v1", "{not-json");
    const storage = createOnboardingStorage(kv);
    expect(storage.load()).toBeNull();
  });
});
