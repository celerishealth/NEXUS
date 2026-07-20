import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  issuePostgresAuthenticatedOwnerSession,
  resolvePostgresAuthenticatedOwnerSession,
  revokePostgresAuthenticatedOwnerSession,
  type PostgresAuthenticatedOwnerAuthAccess,
  type PostgresAuthenticatedOwnerAuthRuntime,
} from "./postgresAuthenticatedOwnerAuthApi";

const TENANT_ID =
  "11111111-1111-4111-8111-111111111111";

const OWNER_ID =
  "22222222-2222-4222-8222-222222222222";

const AUTHORITY_EPOCH =
  "33333333-3333-4333-8333-333333333333";

const SESSION_ID =
  "44444444-4444-4444-8444-444444444444";

const REQUEST_ID =
  "55555555-5555-4555-8555-555555555555";

const NOW =
  "2026-07-20T08:00:00.000Z";

const EXPIRES_AT =
  "2026-07-20T16:00:00.000Z";

function createAccess(
  overrides: Partial<
    PostgresAuthenticatedOwnerAuthAccess
  > = {},
): PostgresAuthenticatedOwnerAuthAccess {
  return {
    authenticateAndIssueSession:
      vi.fn(
        async () => ({
          tenantId:
            TENANT_ID,
          ownerId:
            OWNER_ID,
          role:
            "OWNER",
          authorityEpoch:
            AUTHORITY_EPOCH,
          sessionId:
            SESSION_ID,
          sessionToken:
            "opaque-owner-session-token",
          sessionTokenDigest:
            "digest-must-not-be-returned",
          issuedAt:
            NOW,
          expiresAt:
            EXPIRES_AT,
        }),
      ),

    resolveSession:
      vi.fn(
        async () => ({
          authenticated:
            true,
          tenantId:
            TENANT_ID,
          ownerId:
            OWNER_ID,
          role:
            "OWNER",
          authorityEpoch:
            AUTHORITY_EPOCH,
          sessionId:
            SESSION_ID,
          expiresAt:
            EXPIRES_AT,
        }),
      ),

    revokeSession:
      vi.fn(
        async () => ({
          tenantId:
            TENANT_ID,
          ownerId:
            OWNER_ID,
          sessionId:
            SESSION_ID,
          revoked:
            true,
          revokedAt:
            NOW,
        }),
      ),

    ...overrides,
  };
}

function createRuntime(
  access:
    PostgresAuthenticatedOwnerAuthAccess =
      createAccess(),
): PostgresAuthenticatedOwnerAuthRuntime {
  return {
    createAccess:
      vi.fn(
        () => access,
      ),

    now:
      vi.fn(
        () => NOW,
      ),

    randomRequestId:
      vi.fn(
        () => REQUEST_ID,
      ),
  };
}

describe(
  "PostgreSQL authenticated owner HTTP contract",
  () => {
    it(
      "issues an opaque tenant-bound owner session",
      async () => {
        const access =
          createAccess();

        const runtime =
          createRuntime(
            access,
          );

        const result =
          await issuePostgresAuthenticatedOwnerSession(
            {
              body: {
                tenantId:
                  TENANT_ID,
                email:
                  " Owner@Example.com ",
                password:
                  "correct-password",
              },
              headers: {
                requestId:
                  REQUEST_ID,
              },
              ttlSeconds:
                28_800,
            },
            runtime,
          );

        expect(result.status)
          .toBe(200);

        expect(result.body)
          .toMatchObject({
            tokenType:
              "Bearer",
            accessToken:
              "opaque-owner-session-token",
            session: {
              sessionId:
                SESSION_ID,
              tenantId:
                TENANT_ID,
              ownerId:
                OWNER_ID,
              role:
                "OWNER",
              authorityEpoch:
                AUTHORITY_EPOCH,
              issuedAt:
                NOW,
              expiresAt:
                EXPIRES_AT,
            },
            publicSignupAuthorized:
              false,
            publicLaunchAuthorized:
              false,
            paymentExecutionAuthorized:
              false,
          });

        expect(result.body)
          .not
          .toHaveProperty(
            "sessionTokenDigest",
          );

        expect(
          access
            .authenticateAndIssueSession,
        ).toHaveBeenCalledWith({
          email:
            "Owner@Example.com",
          password:
            "correct-password",
          ttlSeconds:
            28_800,
          authenticatedAt:
            NOW,
        });
      },
    );

    it(
      "resolves a bearer session only with explicit tenant binding",
      async () => {
        const access =
          createAccess();

        const result =
          await resolvePostgresAuthenticatedOwnerSession(
            {
              headers: {
                tenantId:
                  TENANT_ID,
                authorization:
                  "Bearer opaque-owner-session-token",
                requestId:
                  REQUEST_ID,
              },
            },
            createRuntime(
              access,
            ),
          );

        expect(result.status)
          .toBe(200);

        expect(result.body)
          .toMatchObject({
            authenticated:
              true,
            session: {
              sessionId:
                SESSION_ID,
              tenantId:
                TENANT_ID,
              ownerId:
                OWNER_ID,
            },
          });

        expect(
          access.resolveSession,
        ).toHaveBeenCalledWith({
          sessionToken:
            "opaque-owner-session-token",
          resolvedAt:
            NOW,
        });
      },
    );

    it(
      "revokes a tenant-bound bearer session",
      async () => {
        const access =
          createAccess();

        const result =
          await revokePostgresAuthenticatedOwnerSession(
            {
              headers: {
                tenantId:
                  TENANT_ID,
                authorization:
                  "Bearer opaque-owner-session-token",
              },
            },
            createRuntime(
              access,
            ),
          );

        expect(result.status)
          .toBe(200);

        expect(result.body)
          .toMatchObject({
            revoked:
              true,
            revokedAt:
              NOW,
            session: {
              sessionId:
                SESSION_ID,
              tenantId:
                TENANT_ID,
              ownerId:
                OWNER_ID,
            },
          });
      },
    );

    it(
      "blocks session resolution without tenant binding",
      async () => {
        const result =
          await resolvePostgresAuthenticatedOwnerSession(
            {
              headers: {
                authorization:
                  "Bearer opaque-owner-session-token",
              },
            },
            createRuntime(),
          );

        expect(result.status)
          .toBe(400);

        expect(result.body)
          .toMatchObject({
            error:
              "Invalid authentication request.",
          });
      },
    );

    it(
      "maps credential failure to a generic response",
      async () => {
        const access =
          createAccess({
            authenticateAndIssueSession:
              vi.fn(
                async () => {
                  throw {
                    code:
                      "AUTHENTICATION_FAILED",
                    detail:
                      "database-password",
                  };
                },
              ),
          });

        const result =
          await issuePostgresAuthenticatedOwnerSession(
            {
              body: {
                tenantId:
                  TENANT_ID,
                email:
                  "owner@example.com",
                password:
                  "wrong-password",
              },
              headers: {},
              ttlSeconds:
                28_800,
            },
            createRuntime(
              access,
            ),
          );

        expect(result.status)
          .toBe(401);

        expect(result.body)
          .toMatchObject({
            error:
              "Authentication failed.",
          });

        expect(
          JSON.stringify(
            result.body,
          ),
        ).not.toContain(
          "database-password",
        );
      },
    );

    it(
      "returns bounded lockout metadata",
      async () => {
        const lockedUntil =
          "2026-07-20T08:15:00.000Z";

        const access =
          createAccess({
            authenticateAndIssueSession:
              vi.fn(
                async () => {
                  throw {
                    code:
                      "PRINCIPAL_LOCKED",
                    lockedUntil,
                  };
                },
              ),
          });

        const result =
          await issuePostgresAuthenticatedOwnerSession(
            {
              body: {
                tenantId:
                  TENANT_ID,
                email:
                  "owner@example.com",
                password:
                  "wrong-password",
              },
              headers: {},
              ttlSeconds:
                28_800,
            },
            createRuntime(
              access,
            ),
          );

        expect(result.status)
          .toBe(429);

        expect(result.body)
          .toMatchObject({
            error:
              "Authenticated owner is temporarily locked.",
            lockedUntil,
          });
      },
    );

    it(
      "sanitizes unexpected runtime failures",
      async () => {
        const runtime:
          PostgresAuthenticatedOwnerAuthRuntime =
          {
            createAccess() {
              throw new Error(
                "postgres://owner:secret@private-host/nexus",
              );
            },

            now() {
              return NOW;
            },

            randomRequestId() {
              return REQUEST_ID;
            },
          };

        const result =
          await resolvePostgresAuthenticatedOwnerSession(
            {
              headers: {
                tenantId:
                  TENANT_ID,
                authorization:
                  "Bearer opaque-owner-session-token",
              },
            },
            runtime,
          );

        expect(result.status)
          .toBe(503);

        expect(result.body)
          .toMatchObject({
            error:
              "Authenticated owner service is unavailable.",
          });

        expect(
          JSON.stringify(
            result.body,
          ),
        ).not.toContain(
          "secret",
        );
      },
    );

    it(
      "rejects invalid session TTL",
      async () => {
        const result =
          await issuePostgresAuthenticatedOwnerSession(
            {
              body: {
                tenantId:
                  TENANT_ID,
                email:
                  "owner@example.com",
                password:
                  "correct-password",
              },
              headers: {},
              ttlSeconds:
                60,
            },
            createRuntime(),
          );

        expect(result.status)
          .toBe(400);
      },
    );
  },
);
