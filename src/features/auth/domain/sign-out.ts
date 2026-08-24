import type { AuthService } from "./auth-service";

export interface SignOutDeps {
  authService: Pick<AuthService, "signOut">;
  clearSession: () => void;
  invalidateCache: () => void;
}

/**
 * The actual state transition behind the "Sair" flow, kept separate from
 * services.ts wiring so it's unit-testable: on failure, the session must be
 * left untouched (no partial logout), which is straightforward to assert
 * here and awkward to assert against a rendered dialog.
 */
export async function signOut({ authService, clearSession, invalidateCache }: SignOutDeps): Promise<void> {
  await authService.signOut();
  clearSession();
  invalidateCache();
}
