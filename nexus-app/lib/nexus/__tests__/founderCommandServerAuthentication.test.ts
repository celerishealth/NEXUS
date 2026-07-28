import { beforeEach, describe, expect, it, vi } from "vitest";

const doubles = vi.hoisted(() => ({
  verifyToken: vi.fn(),
  assertActiveSession: vi.fn(),
  closeSessionStore: vi.fn(),
}));

vi.mock(
  "@/lib/nexus/sqliteAuthenticatedTenantSessionStore",
  () => ({
    verifyAuthenticatedTenantSessionToken: doubles.verifyToken,
    SQLiteAuthenticatedTenantSessionStore: class {
      async assertActiveSession(...args: unknown[]) {
        return doubles.assertActiveSession(...args);
      }

      close() {
        doubles.closeSessionStore();
      }
    },
  }),
);

import { authenticateFounderCommandRequest } from "../founderCommandServerAuthentication";

const ownerClaims = {
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
};

function bearerRequest(token = "session-token") {
  return new Request("http://localhost/founder-command", {
    headers: { authorization: `Bearer ${token}` },
  });
}

describe("founder command server authentication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv(
      "NEXUS_AUTH_SESSION_SIGNING_SECRET",
      "test-signing-secret",
    );
    vi.stubEnv(
      "NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID",
      "owner-a",
    );
    doubles.verifyToken.mockReturnValue(ownerClaims);
    doubles.assertActiveSession.mockResolvedValue(undefined);
  });

  it("rejects a missing bearer token before session verification", async () => {
    await expect(
      authenticateFounderCommandRequest(
        new Request("http://localhost/founder-command"),
      ),
    ).resolves.toEqual({
      ok: false,
      status: 401,
      reason: "authentication-failed",
    });

    expect(doubles.verifyToken).not.toHaveBeenCalled();
    expect(doubles.closeSessionStore).not.toHaveBeenCalled();
  });

  it("returns exact tenant-owner identity for an active owner session", async () => {
    await expect(
      authenticateFounderCommandRequest(bearerRequest()),
    ).resolves.toEqual({
      ok: true,
      tenantId: "tenant-a",
      actorId: "owner-a",
    });

    expect(doubles.verifyToken).toHaveBeenCalledWith(
      "session-token",
      { primary: "test-signing-secret" },
      expect.objectContaining({ maxClockSkewMs: 60_000 }),
    );
    expect(doubles.assertActiveSession).toHaveBeenCalledTimes(1);
    expect(doubles.closeSessionStore).toHaveBeenCalledTimes(1);
  });

  it("rejects a non-owner or unexpected actor after active-session verification", async () => {
    doubles.verifyToken.mockReturnValue({
      tenantId: "tenant-a",
      actorId: "viewer-a",
      role: "viewer",
    });

    await expect(
      authenticateFounderCommandRequest(bearerRequest()),
    ).resolves.toEqual({
      ok: false,
      status: 403,
      reason: "owner-authority-required",
    });

    expect(doubles.assertActiveSession).toHaveBeenCalledTimes(1);
    expect(doubles.closeSessionStore).toHaveBeenCalledTimes(1);
  });

  it("fails closed when the authenticated session is inactive", async () => {
    doubles.assertActiveSession.mockRejectedValue(
      new Error("inactive session"),
    );

    await expect(
      authenticateFounderCommandRequest(bearerRequest()),
    ).resolves.toEqual({
      ok: false,
      status: 401,
      reason: "authentication-failed",
    });

    expect(doubles.closeSessionStore).toHaveBeenCalledTimes(1);
  });

  it("fails closed before token verification when server auth is not configured", async () => {
    vi.stubEnv("NEXUS_AUTH_SESSION_SIGNING_SECRET", "");
    vi.stubEnv("NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID", "");

    await expect(
      authenticateFounderCommandRequest(bearerRequest()),
    ).resolves.toEqual({
      ok: false,
      status: 503,
      reason: "authentication-not-configured",
    });

    expect(doubles.verifyToken).not.toHaveBeenCalled();
    expect(doubles.closeSessionStore).not.toHaveBeenCalled();
  });

  it("uses the bounded configured clock skew and defaults invalid values safely", async () => {
    vi.stubEnv("NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS", "120000");
    await authenticateFounderCommandRequest(bearerRequest());
    expect(doubles.verifyToken).toHaveBeenLastCalledWith(
      "session-token",
      { primary: "test-signing-secret" },
      expect.objectContaining({ maxClockSkewMs: 120_000 }),
    );

    vi.stubEnv("NEXUS_AUTH_SESSION_MAX_CLOCK_SKEW_MS", "900000");
    await authenticateFounderCommandRequest(bearerRequest());
    expect(doubles.verifyToken).toHaveBeenLastCalledWith(
      "session-token",
      { primary: "test-signing-secret" },
      expect.objectContaining({ maxClockSkewMs: 60_000 }),
    );
  });
});