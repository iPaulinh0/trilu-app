import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalPreferencesRepository } from "./local-preferences-repository";

const USER_ID = "user-1";

function setup(kv = createInMemoryKeyValueStorage()) {
  return createLocalPreferencesRepository({ kv, getUserId: () => USER_ID });
}

describe("getPreferences", () => {
  it("defaults to light theme for a first-time read", async () => {
    const repo = setup();
    expect(await repo.getPreferences()).toMatchObject({ userId: USER_ID, theme: "light" });
  });
});

describe("updateTheme", () => {
  it("switches to dark", async () => {
    const repo = setup();
    const updated = await repo.updateTheme("dark");
    expect(updated.theme).toBe("dark");
  });

  it("switches back to light", async () => {
    const repo = setup();
    await repo.updateTheme("dark");
    const backToLight = await repo.updateTheme("light");
    expect(backToLight.theme).toBe("light");
  });

  it("persists the chosen theme across a simulated reload (fresh repository instance, same storage)", async () => {
    const kv = createInMemoryKeyValueStorage();
    await setup(kv).updateTheme("dark");

    const reloaded = await setup(kv).getPreferences();
    expect(reloaded.theme).toBe("dark");
  });
});
