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
} from "../../../app/api/nexus/founder-command/snapshot/route";

const doubles = vi.hoisted(
  () => ({
    verifyToken: vi.fn(),
    assertActiveSession: vi.fn(),
    closeSession: vi.fn(),
    executeGateway: vi.fn(),
    closeRepository: vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/controlledActionSQLiteRuntimePath",
  () => ({
    resolveControlledActionSQLiteRuntimePath:
      () =>
        ".nexus-runtime/controlled-action-state.sqlite",
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
  "@/lib/nexus/sqliteControlledActionStateRepository",
  () => ({
    SQLiteControlledActionStateRepository:
      class {
        close() {
          doubles.closeRepository();
        }
      },
  }),
);

vi.mock(
  "@/lib/nexus/persistentControlledActionVerticalSlice",
  () => ({
    PersistentControlledActionVerticalSlice:
      class {},
  }),
);

vi.mock(
  "@/lib/nexus/controlledActionCommandGateway",
  () => ({
    ControlledActionCommandGateway:
      class {
        async execute(
          ...args: unknown[]
        ) {
          return doubles.executeGateway(
            ...args,
          );
        }
      },
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
    "2026-07-26T10:00:00.000Z",
  expiresAt:
    "2026-07-26T18:00:00.000Z",
};

const safeGatewayResponse = {
  requestId:
    "request-founder-command-a",
  actorId:
    "owner-a",
  tenantId:
    "tenant-a",
  commandType:
    "read_tenant_snapshot",
  executionBoundary:
    "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
  liveProviderExecutionAuthorized:
    false,
  result: {
    revision: 7,
    killSwitch: {
      engaged: false,
      reason: null,
    },
    actions: {
      "action-a": {
        tenantId:
          "tenant-a",
        status:
          "PENDING_OWNER_REVIEW",
      },
    },
    outbox: {},
    audit: [
      {
        tenantId:
          "tenant-a",
        auditId:
          "audit-a",
      },
    ],
  },
};

function authenticatedRequest(): Request {
  return new Request(
    "http://localhost/api/nexus/founder-command/snapshot",
    {
      method: "GET",
      headers: {
        authorization:
          "Bearer authenticated-session-token",
      },
    },
  );
}

async function readBody(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

describe(
  "authenticated founder command snapshot API",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      vi.stubEnv(
        "NEXUS_FOUNDER_COMMAND_SNAPSHOT_ENABLED",
        "true",
      );
      vi.stubEnv(
        "NEXUS_CONTROLLED_ACTION_STORAGE",
        "sqlite",
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
        "NEXUS_FOUNDER_COMMAND_OWNER_ACTOR_ID",
        "owner-a",
      );

      doubles.verifyToken
        .mockReturnValue(ownerClaims);
      doubles.assertActiveSession
        .mockResolvedValue(undefined);
      doubles.executeGateway
        .mockResolvedValue(
          safeGatewayResponse,
        );
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it(
      "fails closed while the snapshot route is disabled",
      async () => {
        vi.stubEnv(
          "NEXUS_FOUNDER_COMMAND_SNAPSHOT_ENABLED",
          "false",
        );

        const response =
          await GET(
            authenticatedRequest(),
          );

        expect(response.status).toBe(503);
        expect(
          doubles.verifyToken,
        ).not.toHaveBeenCalled();
        expect(
          await readBody(response),
        ).toEqual({
          error:
            "Founder command snapshot is disabled by default.",
          liveProviderExecutionAuthorized:
            false,
          providerMutationAuthorized:
            false,
          resumeAuthorized: false,
        });
      },
    );

    it(
      "rejects cookie-only access without a bearer session",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/nexus/founder-command/snapshot",
              {
                method: "GET",
                headers: {
                  cookie:
                    "nexus_session=untrusted-cookie",
                },
              },
            ),
          );

        expect(response.status).toBe(401);
        expect(
          doubles.executeGateway,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects malformed credentials without leaking raw details",
      async () => {
        doubles.verifyToken
          .mockImplementation(() => {
            throw new Error(
              "raw token signature secret",
            );
          });

        const response =
          await GET(
            authenticatedRequest(),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(401);
        expect(
          JSON.stringify(body),
        ).not.toContain(
          "raw token signature",
        );
        expect(
          doubles.executeGateway,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects an inactive or revoked session",
      async () => {
        doubles.assertActiveSession
          .mockRejectedValue(
            new Error(
              "revoked database detail",
            ),
          );

        const response =
          await GET(
            authenticatedRequest(),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(401);
        expect(
          JSON.stringify(body),
        ).not.toContain(
          "database detail",
        );
        expect(
          doubles.executeGateway,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "blocks an authenticated actor without founder-owner authority",
      async () => {
        doubles.verifyToken
          .mockReturnValue({
            ...ownerClaims,
            actorId:
              "different-owner",
          });

        const response =
          await GET(
            authenticatedRequest(),
          );

        expect(response.status).toBe(403);
        expect(
          doubles.executeGateway,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "returns only the authenticated tenant snapshot with execution blocked",
      async () => {
        const response =
          await GET(
            authenticatedRequest(),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(200);
        expect(
          response.headers.get(
            "cache-control",
          ),
        ).toBe("no-store");

        expect(
          doubles.executeGateway,
        ).toHaveBeenCalledTimes(1);

        const [
          context,
          command,
        ] =
          doubles.executeGateway
            .mock.calls[0];

        expect(context).toMatchObject({
          tenantId: "tenant-a",
          actorId: "owner-a",
          role: "owner",
        });
        expect(
          context.requestId,
        ).toEqual(
          expect.any(String),
        );
        expect(command).toEqual({
          type:
            "read_tenant_snapshot",
        });

        expect(body).toMatchObject({
          schemaVersion:
            "nexus-founder-command-snapshot-v1",
          tenantId:
            "tenant-a",
          ownerActorId:
            "owner-a",
          requestId:
            "request-founder-command-a",
          executionBoundary:
            "PERSISTENCE_ONLY_NO_PROVIDER_EXECUTION",
          liveProviderExecutionAuthorized:
            false,
          providerMutationAuthorized:
            false,
          resumeAuthorized:
            false,
          snapshot:
            safeGatewayResponse.result,
        });

        expect(
          doubles.closeRepository,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      "fails closed when the gateway response boundary is inconsistent",
      async () => {
        doubles.executeGateway
          .mockResolvedValue({
            ...safeGatewayResponse,
            tenantId:
              "foreign-tenant",
          });

        const response =
          await GET(
            authenticatedRequest(),
          );
        const body =
          await readBody(response);

        expect(response.status).toBe(503);
        expect(body).toEqual({
          error:
            "Founder command snapshot could not be safely verified.",
          liveProviderExecutionAuthorized:
            false,
          providerMutationAuthorized:
            false,
          resumeAuthorized:
            false,
        });
        expect(
          doubles.closeRepository,
        ).toHaveBeenCalledTimes(1);
      },
    );
  },
);
