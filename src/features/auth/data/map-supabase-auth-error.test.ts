import { AuthApiError } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import { mapSupabaseAuthError, mapVerifyOtpError } from "./map-supabase-auth-error";

function apiError(message: string, status: number, code: string | undefined) {
  return new AuthApiError(message, status, code);
}

describe("mapSupabaseAuthError", () => {
  it("maps invalid_credentials to a generic, non-revealing message", () => {
    const mapped = mapSupabaseAuthError(apiError("Invalid login credentials", 400, "invalid_credentials"));
    expect(mapped.code).toBe("invalidCredentials");
    expect(mapped.message).not.toMatch(/credentials/i);
  });

  it("maps email_not_confirmed", () => {
    expect(mapSupabaseAuthError(apiError("Email not confirmed", 400, "email_not_confirmed")).code).toBe(
      "emailNotConfirmed",
    );
  });

  it("maps user_already_exists to emailAlreadyInUse", () => {
    expect(mapSupabaseAuthError(apiError("User already registered", 422, "user_already_exists")).code).toBe(
      "emailAlreadyInUse",
    );
  });

  it("maps weak_password", () => {
    expect(mapSupabaseAuthError(apiError("Password too weak", 422, "weak_password")).code).toBe("weakPassword");
  });

  it("maps email_address_invalid to a clear, actionable message", () => {
    const mapped = mapSupabaseAuthError(apiError('Email address "x@example.com" is invalid', 400, "email_address_invalid"));
    expect(mapped.message).toBe("Informe um e-mail válido.");
  });

  it("maps over_email_send_rate_limit to rateLimited", () => {
    expect(mapSupabaseAuthError(apiError("Rate limited", 429, "over_email_send_rate_limit")).code).toBe(
      "rateLimited",
    );
  });

  it("falls back to rateLimited on a bare 429 status with no known code", () => {
    expect(mapSupabaseAuthError(apiError("Too many requests", 429, undefined)).code).toBe("rateLimited");
  });

  it("falls back to unavailable for an unrecognized error", () => {
    expect(mapSupabaseAuthError(new Error("boom")).code).toBe("unavailable");
  });

  it("never leaks the original technical message", () => {
    const original = "very specific internal database constraint violation xyz123";
    const mapped = mapSupabaseAuthError(apiError(original, 500, undefined));
    expect(mapped.message).not.toContain(original);
  });
});

describe("mapVerifyOtpError", () => {
  it("reports otpExpired when the message says expired", () => {
    expect(mapVerifyOtpError(apiError("Token has expired", 403, "otp_expired")).code).toBe("otpExpired");
  });

  it("reports invalidOtp when the message says invalid (not expired)", () => {
    expect(mapVerifyOtpError(apiError("Token is invalid", 403, "otp_expired")).code).toBe("invalidOtp");
  });

  it("passes through non-otp errors unchanged", () => {
    expect(mapVerifyOtpError(apiError("Rate limited", 429, "over_email_send_rate_limit")).code).toBe("rateLimited");
  });
});
