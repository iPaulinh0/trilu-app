import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import type { ProfileRepository, UpdateProfileInput } from "../domain/profile-repository";
import type { ProfileImageStorage } from "../domain/profile-image-storage";
import type { UserProfile } from "../domain/types";

const PROFILES_KEY = "trilu.profile.v1";

/** What's actually persisted — `avatarUrl` is always derived at read time, never stored. */
type StoredProfile = Omit<UserProfile, "avatarUrl">;

export interface LocalProfileRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
  /** Seeds a first-time profile record from the auth session's name/email. */
  getSessionUser: () => { id: string; name: string; email: string };
  imageStorage: ProfileImageStorage;
}

export function createLocalProfileRepository({
  kv,
  getUserId,
  getSessionUser,
  imageStorage,
}: LocalProfileRepositoryDeps): ProfileRepository {
  const profiles = createCollectionStorage<StoredProfile>(kv, PROFILES_KEY);

  function requireStoredProfile(): StoredProfile {
    const userId = getUserId();
    const existing = profiles.getAll().find((p) => p.id === userId);
    if (existing) return existing;

    const session = getSessionUser();
    const now = new Date().toISOString();
    const seeded: StoredProfile = {
      id: session.id,
      name: session.name,
      email: session.email,
      avatarStorageKey: null,
      createdAt: now,
      updatedAt: now,
    };
    profiles.setAll([...profiles.getAll(), seeded]);
    return seeded;
  }

  function save(updated: StoredProfile) {
    profiles.setAll(profiles.getAll().map((p) => (p.id === updated.id ? updated : p)));
  }

  async function withResolvedAvatar(stored: StoredProfile): Promise<UserProfile> {
    const avatarUrl = stored.avatarStorageKey ? await imageStorage.getUrl(stored.avatarStorageKey) : null;
    return { ...stored, avatarUrl };
  }

  return {
    async getProfile() {
      return withResolvedAvatar(requireStoredProfile());
    },

    async updateProfile(input: UpdateProfileInput) {
      const existing = requireStoredProfile();
      const updated: StoredProfile = {
        ...existing,
        name: input.name,
        email: input.email,
        updatedAt: new Date().toISOString(),
      };
      save(updated);
      return withResolvedAvatar(updated);
    },

    async updateAvatarStorageKey(key: string | null) {
      const existing = requireStoredProfile();
      const updated: StoredProfile = { ...existing, avatarStorageKey: key, updatedAt: new Date().toISOString() };
      save(updated);
      return withResolvedAvatar(updated);
    },
  };
}
