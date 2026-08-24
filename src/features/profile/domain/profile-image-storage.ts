export interface ProfileImageUploadInput {
  blob: Blob;
  contentType: string;
}

export interface ProfileImageUploadResult {
  key: string;
}

/**
 * Boundary for where processed avatar images actually live. Today backed by
 * IndexedDB (see data/indexeddb-profile-image-storage.ts) since this project
 * has no real backend/file storage yet — swapping in a remote upload later
 * (e.g. signed URLs to S3/Supabase Storage) means implementing this same
 * interface and changing only the composition root (src/lib/services.ts).
 * Components never call IndexedDB directly.
 */
export interface ProfileImageStorage {
  upload(input: ProfileImageUploadInput): Promise<ProfileImageUploadResult>;
  /** A fresh, non-persisted display URL for `key` — caller must revoke it (see use-avatar-object-url). */
  getUrl(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
}
