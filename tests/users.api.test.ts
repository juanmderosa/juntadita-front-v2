import { afterEach, describe, expect, it, vi } from "vitest";
import { usersApi } from "@/api/users.api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("users API", () => {
  it("keeps the /api/v1/me bearer flow and validates its contract", async () => {
    const payload = {
      status: "success",
      data: {
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "user@example.com",
        },
        profile: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "user@example.com",
          displayName: "Juan",
          avatarUrl: null,
          onboardingCompletedAt: "2026-07-06T15:30:00Z",
          createdAt: "2026-07-06T15:00:00Z",
          updatedAt: "2026-07-06T15:30:00Z",
        },
        requiresProfileOnboarding: false,
      },
    };
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(usersApi.getCurrentUser("access-token")).resolves.toEqual(
      payload.data,
    );
    expect(fetchMock.mock.calls[0][0]).toContain("/api/v1/me");
    expect(
      (fetchMock.mock.calls[0][1].headers as Headers).get("Authorization"),
    ).toBe("Bearer access-token");
  });
});
