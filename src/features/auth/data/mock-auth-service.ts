import type { AuthService } from "../domain/auth-service";
import { AuthError } from "../domain/types";
import type { AuthResult, LoginCredentials, SignupInput } from "../domain/types";

interface MockAccount {
  id: string;
  name: string;
  email: string;
  password: string;
}

const MOCK_NETWORK_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * In-memory mock of AuthService for this MVP step. Not persisted to disk on
 * purpose — passwords never touch localStorage. Seeded with one demo
 * account so the login screen is reviewable without signing up first.
 *
 * Isolated behind the AuthService interface so it can be swapped for a real
 * provider later with zero changes to LoginForm / SignupForm.
 */
export function createMockAuthService(): AuthService {
  const accounts = new Map<string, MockAccount>([
    [
      "demo@trilu.app",
      { id: "demo-user", name: "Convidado Trilu", email: "demo@trilu.app", password: "trilu123" },
    ],
  ]);

  return {
    async login({ email, password }: LoginCredentials): Promise<AuthResult> {
      await delay(MOCK_NETWORK_DELAY_MS);
      const account = accounts.get(email.trim().toLowerCase());
      if (!account || account.password !== password) {
        throw new AuthError("invalidCredentials", "E-mail ou senha incorretos.");
      }
      return { user: { id: account.id, name: account.name, email: account.email } };
    },

    async signup({ name, email, password }: SignupInput): Promise<AuthResult> {
      await delay(MOCK_NETWORK_DELAY_MS);
      const normalizedEmail = email.trim().toLowerCase();
      if (accounts.has(normalizedEmail)) {
        throw new AuthError("emailAlreadyInUse", "Já existe uma conta com este e-mail.");
      }
      const account: MockAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
      };
      accounts.set(normalizedEmail, account);
      return { user: { id: account.id, name: account.name, email: account.email } };
    },

    async signOut() {
      // Nothing to invalidate server-side in this in-memory mock — login
      // issues no server session/token, just a delay standing in for the
      // real network round-trip a provider's sign-out call would make. A
      // real AuthService would revoke the session/refresh token here.
      await delay(MOCK_NETWORK_DELAY_MS);
    },
  };
}
