import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  signupSchema,
} from "./schema";

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "anything" }).success).toBe(true);
  });

  it("normalizes the email to lowercase and trimmed", () => {
    const result = loginSchema.safeParse({ email: "  USER@Example.com  ", password: "x" });
    expect(result.success && result.data.email).toBe("user@example.com");
  });

  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "" }).success).toBe(false);
  });
});

const validSignup = {
  name: "Paulo Victor",
  email: "paulo@example.com",
  password: "Senha123",
  confirmPassword: "Senha123",
  acceptTerms: true,
};

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(signupSchema.safeParse({ ...validSignup, password: "Ab1", confirmPassword: "Ab1" }).success).toBe(false);
  });

  it("rejects a password with no letter", () => {
    expect(signupSchema.safeParse({ ...validSignup, password: "12345678", confirmPassword: "12345678" }).success).toBe(
      false,
    );
  });

  it("rejects a password with no number", () => {
    expect(
      signupSchema.safeParse({ ...validSignup, password: "OnlyLetters", confirmPassword: "OnlyLetters" }).success,
    ).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    expect(signupSchema.safeParse({ ...validSignup, confirmPassword: "Different1" }).success).toBe(false);
  });

  it("rejects when terms are not accepted", () => {
    expect(signupSchema.safeParse({ ...validSignup, acceptTerms: false }).success).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(signupSchema.safeParse({ ...validSignup, name: "A" }).success).toBe(false);
  });
});

describe("otpSchema", () => {
  it("accepts a 6-digit numeric code", () => {
    expect(otpSchema.safeParse({ code: "123456" }).success).toBe(true);
  });

  it("rejects an incomplete code", () => {
    expect(otpSchema.safeParse({ code: "123" }).success).toBe(false);
  });

  it("rejects a code with non-digit characters", () => {
    expect(otpSchema.safeParse({ code: "12a456" }).success).toBe(false);
  });

  it("trims surrounding whitespace before validating length", () => {
    expect(otpSchema.safeParse({ code: " 123456 " }).success).toBe(true);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching, strong passwords", () => {
    expect(resetPasswordSchema.safeParse({ password: "Senha123", confirmPassword: "Senha123" }).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    expect(resetPasswordSchema.safeParse({ password: "Senha123", confirmPassword: "Outra123" }).success).toBe(false);
  });

  it("rejects a weak password", () => {
    expect(resetPasswordSchema.safeParse({ password: "weak", confirmPassword: "weak" }).success).toBe(false);
  });
});
