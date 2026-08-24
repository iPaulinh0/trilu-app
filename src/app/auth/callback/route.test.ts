import { describe, expect, it, vi, beforeEach } from "vitest";

const exchangeCodeForSession = vi.fn();
const getUser = vi.fn();
const single = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession, getUser },
    from: () => ({
      select: () => ({
        eq: () => ({ single }),
      }),
    }),
  })),
}));

// Imported after the mock so the route handler picks up the mocked client factory.
const { GET } = await import("./route");

const ORIGIN = "https://trilu.app";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /auth/callback", () => {
  it("redirects to /login?error=oauth when there is no code", async () => {
    const response = await GET(new Request(`${ORIGIN}/auth/callback`));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${ORIGIN}/login?error=oauth`);
  });

  it("redirects to /login?error=oauth when the code exchange fails", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: new Error("bad code") });
    const response = await GET(new Request(`${ORIGIN}/auth/callback?code=abc`));
    expect(response.headers.get("location")).toBe(`${ORIGIN}/login?error=oauth`);
  });

  it("sends a new user (onboarding incomplete) to /configuracao-habitos", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    single.mockResolvedValue({ data: { onboarding_completed: false } });
    const response = await GET(new Request(`${ORIGIN}/auth/callback?code=abc`));
    expect(response.headers.get("location")).toBe(`${ORIGIN}/configuracao-habitos`);
  });

  it("sends a returning user (onboarding complete) to /trilha", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    single.mockResolvedValue({ data: { onboarding_completed: true } });
    const response = await GET(new Request(`${ORIGIN}/auth/callback?code=abc`));
    expect(response.headers.get("location")).toBe(`${ORIGIN}/trilha`);
  });

  it("honors a sanitized internal next path over the profile-based default", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(new Request(`${ORIGIN}/auth/callback?code=abc&next=%2Ftreinos`));
    expect(response.headers.get("location")).toBe(`${ORIGIN}/treinos`);
    // The profile lookup should never even run when `next` short-circuits.
    expect(getUser).not.toHaveBeenCalled();
  });

  it("ignores an external next path (open-redirect attempt) and falls back to the profile check", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    single.mockResolvedValue({ data: { onboarding_completed: true } });
    const response = await GET(
      new Request(`${ORIGIN}/auth/callback?code=abc&next=${encodeURIComponent("https://evil.com")}`),
    );
    expect(response.headers.get("location")).toBe(`${ORIGIN}/trilha`);
  });

  it("never caches an auth response", async () => {
    const response = await GET(new Request(`${ORIGIN}/auth/callback`));
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
