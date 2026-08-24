import { describe, expect, it } from "vitest";
import { profileFormSchema } from "./schema";

describe("profileFormSchema — name", () => {
  it("accepts a valid composed name with accents", () => {
    const result = profileFormSchema.safeParse({ name: "José Márcio da Silva", email: "jose@example.com" });
    expect(result.success).toBe(true);
  });

  it("trims leading and trailing whitespace", () => {
    const result = profileFormSchema.safeParse({ name: "  Paulo Victor  ", email: "paulo@example.com" });
    expect(result.success && result.data.name).toBe("Paulo Victor");
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(profileFormSchema.safeParse({ name: "A", email: "a@example.com" }).success).toBe(false);
  });

  it("rejects a name longer than 60 characters", () => {
    expect(profileFormSchema.safeParse({ name: "a".repeat(61), email: "a@example.com" }).success).toBe(false);
  });

  it("rejects a name made only of spaces", () => {
    expect(profileFormSchema.safeParse({ name: "     ", email: "a@example.com" }).success).toBe(false);
  });

  it("rejects a missing name", () => {
    expect(profileFormSchema.safeParse({ email: "a@example.com" }).success).toBe(false);
  });
});

describe("profileFormSchema — email", () => {
  it("lowercases the email", () => {
    const result = profileFormSchema.safeParse({ name: "Paulo", email: "PAULO@Example.COM" });
    expect(result.success && result.data.email).toBe("paulo@example.com");
  });

  it("trims whitespace around the email", () => {
    const result = profileFormSchema.safeParse({ name: "Paulo", email: "  paulo@example.com  " });
    expect(result.success && result.data.email).toBe("paulo@example.com");
  });

  it("rejects an invalid email format", () => {
    expect(profileFormSchema.safeParse({ name: "Paulo", email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a missing email", () => {
    expect(profileFormSchema.safeParse({ name: "Paulo", email: "" }).success).toBe(false);
  });
});
