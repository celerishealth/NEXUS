import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const doubles = vi.hoisted(
  () => ({
    revokeSession:
      vi.fn(),
    createRuntime:
      vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/postgresAuthenticatedOwnerAuthApi",
  () => ({
    revokePostgresAuthenticatedOwnerSession:
      doubles.revokeSession,
  }),
);

vi.mock(
  "@/lib/nexus/postgresAuthenticatedOwnerAccessRuntime",
  () => ({
    createPostgresAuthenticatedOwnerAuthRuntime:
      doubles.createRuntime,
  }),
);

import {
  POST,
} from "../../app/api/nexus/auth/postgres/session/revoke/route";

const ROUTE_URL =
  "https://nexus.test/api/nexus/auth/postgres/session/revoke";

const runtimeDouble =
  Object.freeze({
    kind:
      "postgres-auth-runtime-double",
  });

function request():
  Parameters<typeof POST>[0] {
  return new Request(
    ROUTE_URL,
    {
      method:
        "POST",
      headers: {
        authorization:
          "Bearer opaque-owner-session-token",
        "x-nexus-tenant-id":
          "tenant-ppa-industrial-solution-v1",
        "x-request-id":
          "request-postgres-revoke-0001",
      },
    },
  ) as Parameters<typeof POST>[0];
}

async function readJson(
  response: Response,
): Promise<Record<string, unknown>> {
  return await response.json() as
    Record<string, unknown>;
}

function configureEnabledRoute(): void {
  vi.stubEnv(
    "NEXUS_POSTGRES_AUTH_ENABLED",
    "true",
  );

  vi.stubEnv(
    "NEXUS_POSTGRES_AUTH_STORAGE_MODE",
    "postgres",
  );

  vi.stubEnv(
    "NEXUS_CONTROLLED_ACTION_STORAGE",
    "sqlite",
  );
}

describe(
  "PostgreSQL authenticated-owner session revocation route",
  () => {
    beforeEach(
      () => {
        vi.unstubAllEnvs();
        vi.clearAllMocks();

        doubles.createRuntime
          .mockReturnValue(
            runtimeDouble,
          );

        doubles.revokeSession
          .mockResolvedValue({
            status:
              200,
            body: {
              revoked:
                true,
              revokedAt:
                "2026-07-20T08:00:00.000Z",
              session: {
                tenantId:
                  "tenant-ppa-industrial-solution-v1",
                ownerId:
                  "owner-prashant-srivastav-v1",
              },
            },
          });
      },
    );

    afterEach(
      () => {
        vi.unstubAllEnvs();
      },
    );

    it(
      "fails closed while PostgreSQL authenticated-owner access is disabled",
      async () => {
        const response =
          await POST(
            request(),
          );

        expect(response.status)
          .toBe(503);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "PostgreSQL authenticated owner access is disabled by default.",
          publicSignupAuthorized:
            false,
          publicLaunchAuthorized:
            false,
          liveProviderExecutionAuthorized:
            false,
          paymentExecutionAuthorized:
            false,
          externalDeliveryAuthorized:
            false,
        });

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.revokeSession,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "requires the dedicated PostgreSQL auth storage mode",
      async () => {
        vi.stubEnv(
          "NEXUS_POSTGRES_AUTH_ENABLED",
          "true",
        );

        vi.stubEnv(
          "NEXUS_CONTROLLED_ACTION_STORAGE",
          "sqlite",
        );

        const response =
          await POST(
            request(),
          );

        expect(response.status)
          .toBe(503);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          error:
            "PostgreSQL authenticated owner access requires postgres storage mode.",
          publicLaunchAuthorized:
            false,
        });

        expect(
          doubles.createRuntime,
        ).not.toHaveBeenCalled();

        expect(
          doubles.revokeSession,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "revokes a session through the dedicated PostgreSQL auth storage contract",
      async () => {
        configureEnabledRoute();

        const response =
          await POST(
            request(),
          );

        expect(
          doubles.createRuntime,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.revokeSession,
        ).toHaveBeenCalledWith(
          {
            headers: {
              authorization:
                "Bearer opaque-owner-session-token",
              tenantId:
                "tenant-ppa-industrial-solution-v1",
              requestId:
                "request-postgres-revoke-0001",
            },
          },
          runtimeDouble,
        );

        expect(response.status)
          .toBe(200);

        expect(
          await readJson(
            response,
          ),
        ).toMatchObject({
          revoked:
            true,
          session: {
            tenantId:
              "tenant-ppa-industrial-solution-v1",
            ownerId:
              "owner-prashant-srivastav-v1",
          },
        });

        expect(
          response.headers.get(
            "cache-control",
          ),
        ).toBe("no-store");

        expect(
          response.headers.get(
            "pragma",
          ),
        ).toBe("no-cache");
      },
    );
  },
);
