import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  GET,
  POST,
} from "../../../app/api/nexus/founder-emergency/route";

const doubles = vi.hoisted(
  () => ({
    verifyToken: vi.fn(),
    assertActiveSession: vi.fn(),
    closeSession: vi.fn(),
    readStatus: vi.fn(),
    pauseOperations: vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/founderEmergencyOperations",
  () => ({
    readFounderEmergencyStatus:
      doubles.readStatus,
    pauseFounderEmergencyOperations:
      doubles.pauseOperations,
  }),
);

vi.mock(
  "@/lib/nexus/sqliteAuthenticatedTenantSessionStore",
  () => ({
    verifyAuthenticatedTenantSessionToken:
      doubles.verifyToken,

    SQLiteAuthenticatedTenantSessionStore:
      class {
        async assertActiveSession(
          ...args: unknown[]
        ) {
          return doubles.assertActiveSession(
            ...args,
          );
        }

        close() {
          doubles.closeSession();
        }
      },
  }),
);

vi.mock(
  "@/lib/nexus/supabaseControlledPilotOperationStateReader",
  () => ({
    SupabaseControlledPilotOperationStateReader:
      class {},
  }),
);

vi.mock(
  "@/lib/nexus/supabaseControlledPilotAtomicHealthPauseStore",
  () => ({
    SupabaseControlledPilotAtomicHealthPauseStore:
      class {},
  }),
);

const ownerClaims = {
  version: 1,
  keyId: "primary",
  sessionId: "session-owner-a",
  tenantId: "tenant-a",
  actorId: "owner-a",
  role: "owner",
  issuedAt:
    "2026-07-14T05:00:00.000Z",
  expiresAt:
    "2026-07-14T13:00:00.000Z",
};

const activeState = {
  tenantId: "tenant-a",
  operationStatus:
    "active" as const,
  blockingSignalId: null,
  stateVersion: 4,
  lastTransitionAt:
    1_720_000_000_000,
};

const pausedState = {
  tenantId: "tenant-a",
  operationStatus:
    "paused" as const,
  blockingSignalId:
    "server-generated-signal",
  stateVersion: 5,
  lastTransitionAt:
    1_720_000_001_000,
};

function authenticatedRequest(
  method: "GET" | "POST",
  body?: unknown,
): Request {
  const headers:
    Record<string, string> = {
      authorization:
        "Bearer authenticated-session-token",
  };

  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) {
    headers["content-type"] =
      "application/json";
    init.body = JSON.stringify(body);
  }

  return new Request(
    "http://localhost/api/nexus/founder-emergency",
    init,
  );
}

async function readBody(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

describe(
  "authenticated founder emergency API",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.stubEnv(
        "NEXUS_FOUNDER_EMERGENCY_OPERATIONS_ENABLED",
        "true",
      );
      vi.stubEnv(
        "NEXUS_CONTROLLED_ACTION_STORAGE",
        "sqlite",
      );
      vi.stubEnv(
        "NEXUS_CONTROLLED_ACTION_STORAGE_MODE",
        "",
      );
      vi.stubEnv(
        "NEXUS_AUTH_SESSION_KEY_ID",
        "primary",
      );
      vi.stubEnv(
        "NEXUS_AUTH_SESSION_SIGNING_SECRET",
        "test-session-secret",
      );
      vi.stubEnv(
        "NEXUS_FOUNDER_EMERGENCY_OWNER_ACTOR_ID",
        "owner-a",
      );
      vi.stubEnv(
        "SUPABASE_URL",
        "https://example.supabase.co",
      );
      vi.stubEnv(
        "SUPABASE_SERVICE_ROLE_KEY",
        "test-service-role-key",
      );

      doubles.verifyToken
        .mockReturnValue(ownerClaims);

      doubles.assertActiveSession
        .mockResolvedValue(undefined);
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it(
      "fails closed while founder emergency operations are disabled",
      async () => {
        vi.stubEnv(
          "NEXUS_FOUNDER_EMERGENCY_OPERATIONS_ENABLED",
          "false",
        );

        const response =
          await GET(
            authenticatedRequest("GET"),
          );

        expect(response.status).toBe(503);
        expect(
          doubles.verifyToken,
        ).not.toHaveBeenCalled();

        await expect(
          readBody(response),
        ).resolves.toEqual({
          error:
            "Founder emergency operations are disabled.",
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );

    it(
      "rejects cookie-only mutation access without a bearer session",
      async () => {
        const response =
          await POST(
            new Request(
              "http://localhost/api/nexus/founder-emergency",
              {
                method: "POST",
                headers: {
                  cookie:
                    "nexus_session=untrusted-cookie",
                },
              },
            ),
          );

        expect(response.status).toBe(401);
        expect(
          doubles.pauseOperations,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects malformed credentials without leaking raw failure details",
      async () => {
        doubles.verifyToken
          .mockImplementation(() => {
            throw new Error(
              "raw token signature and secret detail",
            );
          });

        const response =
          await GET(
            authenticatedRequest("GET"),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(401);
        expect(body).toEqual({
          error:
            "Authentication failed.",
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
        expect(
          JSON.stringify(body),
        ).not.toContain(
          "raw token signature",
        );
      },
    );

    it(
      "rejects an inactive or revoked authenticated session",
      async () => {
        doubles.assertActiveSession
          .mockRejectedValue(
            new Error(
              "revoked session database detail",
            ),
          );

        const response =
          await POST(
            authenticatedRequest("POST"),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(401);
        expect(
          doubles.pauseOperations,
        ).not.toHaveBeenCalled();
        expect(
          JSON.stringify(body),
        ).not.toContain(
          "database detail",
        );
      },
    );

    it(
      "blocks an authenticated actor who is not the configured founder owner",
      async () => {
        doubles.verifyToken
          .mockReturnValue({
            ...ownerClaims,
            actorId:
              "different-owner",
          });

        const response =
          await POST(
            authenticatedRequest("POST"),
          );

        expect(response.status).toBe(403);
        expect(
          doubles.pauseOperations,
        ).not.toHaveBeenCalled();

        await expect(
          readBody(response),
        ).resolves.toEqual({
          error:
            "Owner authority is required.",
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );

    it(
      "reads only the tenant bound to the active founder session",
      async () => {
        doubles.readStatus
          .mockResolvedValue({
            status: "ready",
            state: activeState,
          });

        const response =
          await GET(
            authenticatedRequest("GET"),
          );

        expect(response.status).toBe(200);
        expect(
          doubles.readStatus,
        ).toHaveBeenCalledWith(
          "tenant-a",
          expect.anything(),
        );

        await expect(
          readBody(response),
        ).resolves.toEqual({
          mode:
            "authenticated-founder-emergency-status-v1",
          tenantId: "tenant-a",
          ownerActorId: "owner-a",
          operationStatus:
            "active",
          blockingSignalId: null,
          stateVersion: 4,
          lastTransitionAt:
            1_720_000_000_000,
          emergencyPauseAvailable:
            true,
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );

    it(
      "ignores body identity fields and pauses only the authenticated tenant",
      async () => {
        doubles.pauseOperations
          .mockResolvedValue({
            status: "paused",
            signalId:
              "server-generated-signal",
            state: pausedState,
          });

        const response =
          await POST(
            authenticatedRequest(
              "POST",
              {
                tenantId:
                  "attacker-tenant",
                ownerActorId:
                  "attacker-owner",
                signalId:
                  "attacker-signal",
                resumeAuthorized:
                  true,
              },
            ),
          );

        expect(response.status).toBe(200);
        expect(
          doubles.pauseOperations,
        ).toHaveBeenCalledTimes(1);

        const input =
          doubles.pauseOperations
            .mock.calls[0]?.[0] as {
              tenantId: string;
              signalId: string;
              observedAt: number;
            };

        expect(input.tenantId)
          .toBe("tenant-a");
        expect(input.signalId)
          .toEqual(
            expect.any(String),
          );
        expect(input.signalId)
          .not.toBe(
            "attacker-signal",
          );
        expect(input.observedAt)
          .toEqual(
            expect.any(Number),
          );

        await expect(
          readBody(response),
        ).resolves.toEqual({
          mode:
            "authenticated-founder-emergency-pause-v1",
          tenantId: "tenant-a",
          ownerActorId: "owner-a",
          pauseStatus: "paused",
          operationStatus:
            "paused",
          blockingSignalId:
            "server-generated-signal",
          stateVersion: 5,
          lastTransitionAt:
            1_720_000_001_000,
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );

    it(
      "maps a concurrent pause conflict to a safe fail-closed response",
      async () => {
        doubles.pauseOperations
          .mockResolvedValue({
            status:
              "state-conflict",
          });

        const response =
          await POST(
            authenticatedRequest("POST"),
          );

        expect(response.status).toBe(409);

        await expect(
          readBody(response),
        ).resolves.toEqual({
          error:
            "Emergency pause was blocked by a concurrent state change.",
          pauseStatus:
            "state-conflict",
          liveProviderExecutionAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );
  },
);