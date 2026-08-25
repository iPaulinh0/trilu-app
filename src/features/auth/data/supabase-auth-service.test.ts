import type { SupabaseClient } from "@supabase/supabase-js";
import { AuthApiError } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { createSupabaseAuthService } from "./supabase-auth-service";
import { AuthError } from "../domain/types";

/**
 * Per the spec's testing guidance ("mock apenas a camada de
 * infraestrutura"): this fakes the Supabase *client*, not the AuthService's
 * own rules — every test below exercises the real mapping/validation logic
 * in supabase-auth-service.ts against a stand-in for the network boundary.
 */
function createFakeSupabase(overrides: Partial<Record<string, ReturnType<typeof vi.fn>>> = {}) {
  const auth = {
    signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    verifyOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    resend: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    ...overrides,
  };
  return { auth } as unknown as SupabaseClient;
}

describe("signUpWithEmail", () => {
  it("passes the name through as full_name metadata", async () => {
    const supabase = createFakeSupabase();
    const service = createSupabaseAuthService(supabase);
    await service.signUpWithEmail({ name: "Ana Silva", email: "ana@example.com", password: "Senha123" });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "ana@example.com",
      password: "Senha123",
      options: { data: { full_name: "Ana Silva" } },
    });
  });

  it("throws a mapped, friendly AuthError on failure", async () => {
    const supabase = createFakeSupabase({
      signUp: vi.fn().mockResolvedValue({ data: {}, error: new AuthApiError("dup", 422, "user_already_exists") }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(service.signUpWithEmail({ name: "Ana", email: "ana@example.com", password: "Senha123" })).rejects.toMatchObject(
      { code: "emailAlreadyInUse" },
    );
  });

  it("throws emailAlreadyInUse when Supabase silently no-ops for an already-registered, confirmed email", async () => {
    // With "Confirm email" on, Supabase returns no error and an obfuscated
    // user (empty `identities`) instead of erroring, to avoid leaking which
    // emails already have an account — no confirmation email is sent either.
    const supabase = createFakeSupabase({
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email: "ana@example.com", identities: [] }, session: null },
        error: null,
      }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(
      service.signUpWithEmail({ name: "Ana", email: "ana@example.com", password: "Senha123" }),
    ).rejects.toMatchObject({ code: "emailAlreadyInUse" });
  });

  it("succeeds for a genuinely new signup (identities populated)", async () => {
    const supabase = createFakeSupabase({
      signUp: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email: "ana@example.com", identities: [{ id: "i1" }] }, session: null },
        error: null,
      }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(
      service.signUpWithEmail({ name: "Ana", email: "ana@example.com", password: "Senha123" }),
    ).resolves.toBeUndefined();
  });
});

describe("verifyEmailCode", () => {
  it("verifies with type email, per the account-confirmation OTP flow", async () => {
    const supabase = createFakeSupabase();
    const service = createSupabaseAuthService(supabase);
    await service.verifyEmailCode({ email: "ana@example.com", code: "123456" });
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({ email: "ana@example.com", token: "123456", type: "email" });
  });

  it("throws invalidOtp for a wrong code", async () => {
    const supabase = createFakeSupabase({
      verifyOtp: vi.fn().mockResolvedValue({ data: {}, error: new AuthApiError("Token is invalid", 403, "otp_expired") }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(service.verifyEmailCode({ email: "a@b.com", code: "000000" })).rejects.toMatchObject({
      code: "invalidOtp",
    });
  });
});

describe("resendEmailCode", () => {
  it("resends with type signup", async () => {
    const supabase = createFakeSupabase();
    const service = createSupabaseAuthService(supabase);
    await service.resendEmailCode("ana@example.com");
    expect(supabase.auth.resend).toHaveBeenCalledWith({ type: "signup", email: "ana@example.com" });
  });

  it("throws rateLimited when the cooldown is hit server-side", async () => {
    const supabase = createFakeSupabase({
      resend: vi.fn().mockResolvedValue({ data: {}, error: new AuthApiError("slow down", 429, "over_email_send_rate_limit") }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(service.resendEmailCode("ana@example.com")).rejects.toMatchObject({ code: "rateLimited" });
  });
});

describe("signInWithPassword", () => {
  it("throws invalidCredentials on wrong password", async () => {
    const supabase = createFakeSupabase({
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: {}, error: new AuthApiError("bad creds", 400, "invalid_credentials") }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(service.signInWithPassword({ email: "a@b.com", password: "wrong" })).rejects.toMatchObject({
      code: "invalidCredentials",
    });
  });
});

describe("getAuthenticatedUser", () => {
  it("returns null when there is no session", async () => {
    const supabase = createFakeSupabase();
    const service = createSupabaseAuthService(supabase);
    expect(await service.getAuthenticatedUser()).toBeNull();
  });

  it("maps a Supabase user to the domain AuthUser shape", async () => {
    const supabase = createFakeSupabase({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email: "ana@example.com", user_metadata: { full_name: "Ana Silva" } } },
        error: null,
      }),
    });
    const service = createSupabaseAuthService(supabase);
    expect(await service.getAuthenticatedUser()).toEqual({ id: "u1", name: "Ana Silva", email: "ana@example.com" });
  });

  it("never returns the literal string 'undefined' when full_name is missing", async () => {
    const supabase = createFakeSupabase({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "u1", email: "ana@example.com", user_metadata: {} } },
        error: null,
      }),
    });
    const service = createSupabaseAuthService(supabase);
    const user = await service.getAuthenticatedUser();
    expect(user?.name).toBe("");
  });
});

describe("signOut", () => {
  it("calls supabase.auth.signOut", async () => {
    const supabase = createFakeSupabase();
    const service = createSupabaseAuthService(supabase);
    await service.signOut();
    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("throws a mapped AuthError on failure", async () => {
    const supabase = createFakeSupabase({
      signOut: vi.fn().mockResolvedValue({ error: new AuthApiError("boom", 500, undefined) }),
    });
    const service = createSupabaseAuthService(supabase);
    await expect(service.signOut()).rejects.toBeInstanceOf(AuthError);
  });
});
