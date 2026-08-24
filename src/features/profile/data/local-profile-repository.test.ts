import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalProfileRepository } from "./local-profile-repository";
import type { ProfileImageStorage } from "../domain/profile-image-storage";

const SESSION_USER = { id: "user-1", name: "Paulo Victor", email: "paulo@example.com" };

function createFakeImageStorage(): ProfileImageStorage {
  const blobs = new Map<string, string>();
  let counter = 0;
  return {
    async upload({ blob }) {
      const key = `key-${counter++}`;
      blobs.set(key, String(blob));
      return { key };
    },
    async getUrl(key) {
      return blobs.has(key) ? `blob:${key}` : null;
    },
    async remove(key) {
      blobs.delete(key);
    },
  };
}

function setup(kv = createInMemoryKeyValueStorage(), imageStorage = createFakeImageStorage()) {
  const repo = createLocalProfileRepository({
    kv,
    getUserId: () => SESSION_USER.id,
    getSessionUser: () => SESSION_USER,
    imageStorage,
  });
  return { repo, kv, imageStorage };
}

describe("getProfile", () => {
  it("seeds a first-time profile from the session's name and email", async () => {
    const { repo } = setup();
    const profile = await repo.getProfile();
    expect(profile).toMatchObject({ id: "user-1", name: "Paulo Victor", email: "paulo@example.com", avatarUrl: null });
  });

  it("returns the same profile on a second read (does not reseed)", async () => {
    const { repo } = setup();
    const first = await repo.getProfile();
    const second = await repo.getProfile();
    expect(second.createdAt).toBe(first.createdAt);
  });
});

describe("updateProfile", () => {
  it("updates name and email and bumps updatedAt", async () => {
    const { repo } = setup();
    const before = await repo.getProfile();
    const updated = await repo.updateProfile({ name: "Novo Nome", email: "novo@example.com" });
    expect(updated.name).toBe("Novo Nome");
    expect(updated.email).toBe("novo@example.com");
    expect(updated.id).toBe(before.id);
  });

  it("persists the update across a simulated reload (fresh repository instance, same storage)", async () => {
    const kv = createInMemoryKeyValueStorage();
    const first = setup(kv);
    await first.repo.updateProfile({ name: "Novo Nome", email: "novo@example.com" });

    const second = setup(kv, first.imageStorage);
    const reloaded = await second.repo.getProfile();
    expect(reloaded.name).toBe("Novo Nome");
    expect(reloaded.email).toBe("novo@example.com");
  });
});

describe("updateAvatarStorageKey", () => {
  it("resolves avatarUrl through the injected image storage once a key is set", async () => {
    const { repo, imageStorage } = setup();
    const { key } = await imageStorage.upload({ blob: new Blob(["fake"]), contentType: "image/webp" });
    const updated = await repo.updateAvatarStorageKey(key);
    expect(updated.avatarStorageKey).toBe(key);
    expect(updated.avatarUrl).toBe(`blob:${key}`);
  });

  it("clears avatarUrl when the key is set back to null", async () => {
    const { repo, imageStorage } = setup();
    const { key } = await imageStorage.upload({ blob: new Blob(["fake"]), contentType: "image/webp" });
    await repo.updateAvatarStorageKey(key);
    const cleared = await repo.updateAvatarStorageKey(null);
    expect(cleared.avatarStorageKey).toBeNull();
    expect(cleared.avatarUrl).toBeNull();
  });
});
