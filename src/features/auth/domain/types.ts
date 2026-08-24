/** Pure domain types for authentication. No React, no DOM, no Next.js. */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: AuthUser;
}

export type AuthErrorCode =
  | "invalidCredentials"
  | "emailAlreadyInUse"
  | "unavailable";

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}
