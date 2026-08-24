import type { AuthResult, LoginCredentials, SignupInput } from "./types";

/**
 * Auth boundary the UI depends on. Today it's backed by an in-memory mock
 * (see data/mock-auth-service.ts); swap the implementation for a real
 * provider (or a React Native-friendly client) without touching any
 * component.
 */
export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  signup(input: SignupInput): Promise<AuthResult>;
  /** Invalidates the session on the auth provider's side (server session/token). */
  signOut(): Promise<void>;
}
