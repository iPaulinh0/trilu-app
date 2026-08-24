const STORAGE_KEY = "trilu.pending-confirmation-email";

/**
 * Holds only the email address awaiting confirmation — never a password —
 * so /confirmar-email knows who it's confirming after a redirect from
 * /cadastro or /login. sessionStorage (not localStorage): it should not
 * outlive the tab, and it's never treated as a session/auth mechanism.
 */
export interface PendingEmailStorage {
  save(email: string): void;
  load(): string | null;
  clear(): void;
}

function hasSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function createPendingEmailStorage(): PendingEmailStorage {
  return {
    save(email) {
      if (!hasSessionStorage()) return;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, email);
      } catch {
        // Storage unavailable (private mode, quota) — the confirm-email
        // screen falls back to asking the user to restart signup.
      }
    },
    load() {
      if (!hasSessionStorage()) return null;
      try {
        return window.sessionStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    },
    clear() {
      if (!hasSessionStorage()) return;
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    },
  };
}
