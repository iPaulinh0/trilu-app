import type { AuthUser } from "./types";

export interface SignUpWithEmailInput {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailCodeInput {
  email: string;
  code: string;
}

export interface SignInWithPasswordInput {
  email: string;
  password: string;
}

/**
 * Auth boundary the UI depends on. Backed by Supabase Auth
 * (see data/supabase-auth-service.ts) via @supabase/ssr, but nothing above
 * this interface knows that — swapping to a React Native client later means
 * implementing this same contract against @supabase/supabase-js's
 * AsyncStorage-backed client, with zero changes to any component.
 */
export interface AuthService {
  signUpWithEmail(input: SignUpWithEmailInput): Promise<void>;
  verifyEmailCode(input: VerifyEmailCodeInput): Promise<void>;
  resendEmailCode(email: string): Promise<void>;
  signInWithPassword(input: SignInWithPasswordInput): Promise<void>;
  /** Google only — redirects the browser, so there is nothing to await besides kicking it off. */
  signInWithGoogle(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
  getAuthenticatedUser(): Promise<AuthUser | null>;
}
