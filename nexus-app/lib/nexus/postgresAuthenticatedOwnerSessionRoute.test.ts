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
    issueSession:
      vi.fn(),
    resolveSession:
      vi.fn(),
    createRuntime:
      vi.fn(),
  }),
);

vi.mock(
  "@/lib/nexus/postgresAuthenticatedOwnerAuthApi",
  () => ({
    issuePostgresAuthenticatedOwnerSession:
      doubles.issueSession,
    resolvePostgresAuthenticatedOwnerSession:
      doubles.resolveSession,
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
  GET,
  POST,
} from "../../app/api/nexus/auth/postgres/session/route";

const ROUTE_URL =
  "https://nexus.test/api/nexus/auth/postgres/session";

const runtimeDouble =
  Object.freeze({
    kind:
      "postgres-auth-runtime-double",
  });

function request(
  method: "GET" | "POST",
  body?: unknown,
): Parameters<typeof POST>[0] {
  const headers:
    Record<string, string> = {
      authorization:
        "Bearer opaque-owner-session-token",
      "x-nexus-tenant-id":
        "tenant-ppa-industrial-solution-v1",
      "x-request-id":
        "request-postgres-session-0001",
  };

  const init:
    RequestInit = {
      method,
      headers,
    };

  if (body !== undefined) {
    headers["content-type"] =
      "application/json";

    init.body =
      JSON.stringify(
        body,
      );
  }

  return new Request(
    ROUTE_URL,
    init,
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
  "PostgreSQL authenticated-owner session route",
  () => {
    beforeEach(
      () => {
        vi.unstubAllEnvs();
        vi.clearAllMocks();

        doubles.createRuntime
          .mockReturnValue(
            runtimeDouble,
          );

        doubles.issueSession
          .mockResolvedValue({
            status:
              201,
            body: {
              authenticated:
                true,
              sessionToken:
                "opaque-owner-session-token",
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
            },
          });

        doubles.resolveSession
          .mockResolvedValue({
            status:
              200,
            body: {
              authenticated:
                true,
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
            request(
              "POST",
              {},
            ),
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
          doubles.issueSession,
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
            request(
              "POST",
              {},
            ),
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
          doubles.issueSession,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "issues a session through the dedicated PostgreSQL auth storage contract",
      async () => {
        configureEnabledRoute();

        const body = {
          tenantId:
            "tenant-ppa-industrial-solution-v1",
          email:
            "owner@nexus.test",
          password:
            "Controlled-Password-For-Test-Only",
        };

        const response =
          await POST(
            request(
              "POST",
              body,
            ),
          );

        expect(
          doubles.createRuntime,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.issueSession,
        ).toHaveBeenCalledWith(
          {
            body,
            headers: {
              authorization:
                "Bearer opaque-owner-session-token",
              tenantId:
                "tenant-ppa-industrial-solution-v1",
              requestId:
                "request-postgres-session-0001",
            },
            ttlSeconds:
              28_800,
          },
          runtimeDouble,
        );

        expect(response.status)
          .toBe(201);

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

    it(
      "resolves a session through the dedicated PostgreSQL auth storage contract",
      async () => {
        configureEnabledRoute();

        const response =
          await GET(
            request(
              "GET",
            ),
          );

        expect(
          doubles.createRuntime,
        ).toHaveBeenCalledTimes(1);

        expect(
          doubles.resolveSession,
        ).toHaveBeenCalledWith(
          {
            headers: {
              authorization:
                "Bearer opaque-owner-session-token",
              tenantId:
                "tenant-ppa-industrial-solution-v1",
              requestId:
                "request-postgres-session-0001",
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
          authenticated:
            true,
          session: {
            tenantId:
              "tenant-ppa-industrial-solution-v1",
            ownerId:
              "owner-prashant-srivastav-v1",
          },
        });
      },
    );
  },
);
