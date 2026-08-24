/** Pure domain types for authentication. No React, no DOM, no Next.js, no Supabase types. */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export type AuthErrorCode =
  | "invalidCredentials"
  | "emailAlreadyInUse"
  | "emailNotConfirmed"
  | "weakPassword"
  | "invalidOtp"
  | "otpExpired"
  | "rateLimited"
  | "oauthCancelled"
  | "oauthProviderNotConfigured"
  | "sessionExpired"
  | "noProfile"
  | "unavailable";

/** Portuguese, user-safe message — never the raw Supabase/HTTP error text. */
export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
